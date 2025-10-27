#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import fetch from "node-fetch";

const BASE_URL = "https://api.scryfall.com";
const RATE_LIMIT_DELAY = 100; // 100ms between requests

// Helper function to delay between API calls
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Field presets for common use cases
const FIELD_PRESETS = {
  basic: ["name", "set", "rarity", "type_line", "mana_cost"],
  creatures: ["name", "set", "type_line", "mana_cost", "power", "toughness", "rarity"],
  prices: ["name", "set", "rarity", "prices.usd", "prices.usd_foil", "prices.eur", "prices.tix"],
  commander: ["name", "type_line", "color_identity", "cmc", "rarity", "edhrec_rank", "prices.usd"],
  collection: ["name", "set_name", "set", "collector_number", "rarity", "artist", "released_at"],
  comprehensive: [
    "name", "mana_cost", "cmc", "type_line", "oracle_text", "power", "toughness",
    "colors", "color_identity", "set", "set_name", "rarity", "artist",
    "prices.usd", "legalities.standard", "legalities.commander", "scryfall_uri"
  ]
};

/**
 * Extract a field from a card object, supporting nested fields
 */
function extractField(card, field) {
  if (field.includes(".")) {
    const keys = field.split(".");
    let value = card;
    for (const key of keys) {
      if (typeof value === "object" && value !== null) {
        value = value[key];
      } else {
        return "";
      }
    }
    return value ?? "";
  } else {
    // Handle card_faces for double-faced cards
    if (["oracle_text", "mana_cost", "type_line"].includes(field) && !(field in card)) {
      if (card.card_faces && card.card_faces.length > 0) {
        return card.card_faces[0][field] ?? "";
      }
    }
    return card[field] ?? "";
  }
}

/**
 * Format a value for display
 */
function formatValue(value) {
  if (value === null || value === undefined) {
    return "";
  } else if (Array.isArray(value)) {
    return value.join(", ");
  } else if (typeof value === "object") {
    return JSON.stringify(value);
  } else {
    return String(value);
  }
}

/**
 * Search for cards using the Scryfall API
 */
async function searchCards(query, order = "name", unique = "cards", includeExtras = false) {
  const params = new URLSearchParams({
    q: query,
    order: order,
    unique: unique,
    include_extras: String(includeExtras),
  });

  let url = `${BASE_URL}/cards/search?${params.toString()}`;
  const allCards = [];
  let page = 1;

  while (url) {
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error: ${errorData.details || "Unknown error"}`);
    }

    const data = await response.json();

    if (data.object === "error") {
      throw new Error(`Search Error: ${data.details || "Unknown error"}`);
    }

    const cards = data.data || [];
    allCards.push(...cards);

    if (!data.has_more) {
      break;
    }

    url = data.next_page;
    page++;

    // Rate limiting
    await delay(RATE_LIMIT_DELAY);
  }

  return allCards;
}

/**
 * Get card by exact name
 */
async function getCardByName(name, set = null) {
  const params = new URLSearchParams({ exact: name });
  if (set) {
    params.append("set", set);
  }

  const url = `${BASE_URL}/cards/named?${params.toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`API Error: ${errorData.details || "Card not found"}`);
  }

  return await response.json();
}

/**
 * Autocomplete card names
 */
async function autocompleteCards(query) {
  const params = new URLSearchParams({ q: query });
  const url = `${BASE_URL}/cards/autocomplete?${params.toString()}`;
  
  const response = await fetch(url);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`API Error: ${errorData.details || "Unknown error"}`);
  }

  const data = await response.json();
  return data.data || [];
}

/**
 * Format cards as CSV string
 */
function formatAsCSV(cards, fields) {
  let csv = fields.join(",") + "\n";

  for (const card of cards) {
    const row = fields.map((field) => {
      const value = formatValue(extractField(card, field));
      // Escape commas and quotes in CSV
      const escaped = value.replace(/"/g, '""');
      return escaped.includes(",") || escaped.includes('"') || escaped.includes("\n")
        ? `"${escaped}"`
        : escaped;
    });
    csv += row.join(",") + "\n";
  }

  return csv;
}

/**
 * Format cards as JSON
 */
function formatAsJSON(cards, fields) {
  const formatted = cards.map((card) => {
    const obj = {};
    for (const field of fields) {
      obj[field] = extractField(card, field);
    }
    return obj;
  });
  return JSON.stringify(formatted, null, 2);
}

/**
 * Format cards as a table
 */
function formatAsTable(cards, fields) {
  if (cards.length === 0) {
    return "No cards found.";
  }

  // Calculate column widths
  const widths = fields.map((field) => field.length);
  for (const card of cards) {
    fields.forEach((field, i) => {
      const value = formatValue(extractField(card, field));
      widths[i] = Math.max(widths[i], String(value).length);
    });
  }

  // Create header
  let table = "";
  table += fields.map((field, i) => field.padEnd(widths[i])).join(" | ") + "\n";
  table += fields.map((_, i) => "-".repeat(widths[i])).join("-+-") + "\n";

  // Create rows
  for (const card of cards) {
    const row = fields.map((field, i) => {
      const value = formatValue(extractField(card, field));
      return String(value).padEnd(widths[i]);
    });
    table += row.join(" | ") + "\n";
  }

  return table;
}

// Create server instance
const server = new Server(
  {
    name: "scryfall-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "search_cards",
        description: "Search for Magic: The Gathering cards using Scryfall search syntax. Returns cards matching the query with specified fields.",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "Scryfall search query (e.g., 'c:red t:legendary', 'set:dom', 'o:flying cmc<=3')",
            },
            fields: {
              type: "array",
              items: { type: "string" },
              description: "List of fields to include (e.g., ['name', 'set', 'mana_cost', 'prices.usd']). Use a preset name or custom fields.",
              default: FIELD_PRESETS.basic,
            },
            preset: {
              type: "string",
              enum: ["basic", "creatures", "prices", "commander", "collection", "comprehensive"],
              description: "Use a predefined field preset instead of custom fields",
            },
            order: {
              type: "string",
              enum: ["name", "set", "released", "rarity", "color", "usd", "tix", "eur", "cmc", "power", "toughness", "edhrec", "artist"],
              description: "Sort order for results",
              default: "name",
            },
            unique: {
              type: "string",
              enum: ["cards", "art", "prints"],
              description: "Strategy for omitting similar cards",
              default: "cards",
            },
            format: {
              type: "string",
              enum: ["json", "csv", "table"],
              description: "Output format",
              default: "table",
            },
            limit: {
              type: "number",
              description: "Maximum number of cards to return (default: all)",
            },
          },
          required: ["query"],
        },
      },
      {
        name: "get_card",
        description: "Get a specific card by exact name, optionally from a specific set.",
        inputSchema: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "Exact card name",
            },
            set: {
              type: "string",
              description: "Set code (optional, e.g., 'dom', 'war')",
            },
            fields: {
              type: "array",
              items: { type: "string" },
              description: "List of fields to include",
              default: FIELD_PRESETS.comprehensive,
            },
            preset: {
              type: "string",
              enum: ["basic", "creatures", "prices", "commander", "collection", "comprehensive"],
              description: "Use a predefined field preset",
            },
            format: {
              type: "string",
              enum: ["json", "table"],
              description: "Output format",
              default: "table",
            },
          },
          required: ["name"],
        },
      },
      {
        name: "autocomplete",
        description: "Get autocomplete suggestions for card names based on a partial query.",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "Partial card name to autocomplete",
            },
          },
          required: ["query"],
        },
      },
      {
        name: "get_field_presets",
        description: "Get information about available field presets for card queries.",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === "search_cards") {
      const {
        query,
        fields: customFields,
        preset,
        order = "name",
        unique = "cards",
        format = "table",
        limit,
      } = args;

      // Determine fields to use
      let fields = customFields;
      if (preset && FIELD_PRESETS[preset]) {
        fields = FIELD_PRESETS[preset];
      } else if (!fields) {
        fields = FIELD_PRESETS.basic;
      }

      // Search for cards
      let cards = await searchCards(query, order, unique);

      // Apply limit if specified
      if (limit && limit > 0) {
        cards = cards.slice(0, limit);
      }

      // Format output
      let output;
      if (format === "csv") {
        output = formatAsCSV(cards, fields);
      } else if (format === "json") {
        output = formatAsJSON(cards, fields);
      } else {
        output = formatAsTable(cards, fields);
      }

      return {
        content: [
          {
            type: "text",
            text: `Found ${cards.length} cards matching "${query}":\n\n${output}`,
          },
        ],
      };
    } else if (name === "get_card") {
      const { name: cardName, set, fields: customFields, preset, format = "table" } = args;

      // Determine fields to use
      let fields = customFields;
      if (preset && FIELD_PRESETS[preset]) {
        fields = FIELD_PRESETS[preset];
      } else if (!fields) {
        fields = FIELD_PRESETS.comprehensive;
      }

      // Get card
      const card = await getCardByName(cardName, set);

      // Format output
      let output;
      if (format === "json") {
        const obj = {};
        for (const field of fields) {
          obj[field] = extractField(card, field);
        }
        output = JSON.stringify(obj, null, 2);
      } else {
        output = formatAsTable([card], fields);
      }

      return {
        content: [
          {
            type: "text",
            text: `Card: ${cardName}${set ? ` (${set.toUpperCase()})` : ""}\n\n${output}`,
          },
        ],
      };
    } else if (name === "autocomplete") {
      const { query } = args;
      const suggestions = await autocompleteCards(query);

      return {
        content: [
          {
            type: "text",
            text: `Autocomplete suggestions for "${query}":\n\n${suggestions.join("\n")}`,
          },
        ],
      };
    } else if (name === "get_field_presets") {
      const presetInfo = Object.entries(FIELD_PRESETS)
        .map(([name, fields]) => `**${name}**:\n  ${fields.join(", ")}`)
        .join("\n\n");

      return {
        content: [
          {
            type: "text",
            text: `Available field presets:\n\n${presetInfo}\n\nYou can also use custom fields by providing a list of field names.`,
          },
        ],
      };
    } else {
      throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Scryfall MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
