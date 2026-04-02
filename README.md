# @pipeworx/mcp-climate

MCP server for the [Open-Meteo Climate API](https://climate-api.open-meteo.com) — long-term climate projections and multi-model temperature comparisons for any location. Free, no auth required.

## Tools

| Tool | Description |
|------|-------------|
| `get_climate_projection` | Temperature and precipitation projections (1950-2050) using EC_Earth3P_HR |
| `compare_models` | Compare temperature projections across three climate models |

## Quick Start

Add to your MCP client config:

```json
{
  "mcpServers": {
    "climate": {
      "type": "url",
      "url": "https://gateway.pipeworx.io/climate"
    }
  }
}
```

## CLI Usage

```bash
npx @anthropic-ai/mcp-client https://gateway.pipeworx.io/climate
```

## License

MIT
