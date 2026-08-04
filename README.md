# mcp-climate

Climate MCP — wraps Open-Meteo Climate API (free, no auth)

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `get_climate_projection` | Get historical and future temperature and precipitation projections for a location (1950–2050). Returns daily forecasts with temperature, precipitation, and weather conditions. |
| `compare_models` | Compare temperature projections across climate models for the same location and date range. Returns side-by-side daily mean temperatures to assess model agreement and uncertainty. |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "climate": {
      "url": "https://gateway.pipeworx.io/climate/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Climate data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
