/**
 * Climate MCP — wraps Open-Meteo Climate API (free, no auth)
 *
 * Tools:
 * - get_climate_projection: Get long-term climate projection data for a location using EC_Earth3P_HR model
 * - compare_models: Compare temperature projections across multiple climate models
 */

interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
}

const BASE_URL = 'https://climate-api.open-meteo.com/v1';

type RawClimateResponse = {
  latitude: number;
  longitude: number;
  elevation: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  daily_units: Record<string, string>;
  daily: Record<string, (number | null)[]>;
};

function formatClimateResponse(data: RawClimateResponse) {
  const dates = (data.daily['time'] ?? []) as unknown as string[];
  const variables = Object.keys(data.daily).filter((k) => k !== 'time');

  const days = dates.map((date, i) => {
    const entry: Record<string, unknown> = { date };
    for (const variable of variables) {
      entry[variable] = data.daily[variable]?.[i] ?? null;
    }
    return entry;
  });

  return {
    latitude: data.latitude,
    longitude: data.longitude,
    timezone: data.timezone,
    units: data.daily_units,
    days,
  };
}

const tools: McpToolExport['tools'] = [
  {
    name: 'get_climate_projection',
    description:
      'Get long-term climate projection data (temperature and precipitation) for a location using the EC_Earth3P_HR high-resolution climate model via the Open-Meteo Climate API. Date range must be between 1950 and 2050.',
    inputSchema: {
      type: 'object',
      properties: {
        latitude: {
          type: 'number',
          description: 'Latitude of the location in decimal degrees.',
        },
        longitude: {
          type: 'number',
          description: 'Longitude of the location in decimal degrees.',
        },
        start_date: {
          type: 'string',
          description: 'Start date in YYYY-MM-DD format (must be between 1950 and 2050).',
        },
        end_date: {
          type: 'string',
          description: 'End date in YYYY-MM-DD format (must be between 1950 and 2050).',
        },
      },
      required: ['latitude', 'longitude', 'start_date', 'end_date'],
    },
  },
  {
    name: 'compare_models',
    description:
      'Compare daily mean temperature projections across three climate models (EC_Earth3P_HR, MPI_ESM1_2_XR, FGOALS_f3_H) for a location and date range.',
    inputSchema: {
      type: 'object',
      properties: {
        latitude: {
          type: 'number',
          description: 'Latitude of the location in decimal degrees.',
        },
        longitude: {
          type: 'number',
          description: 'Longitude of the location in decimal degrees.',
        },
        start_date: {
          type: 'string',
          description: 'Start date in YYYY-MM-DD format (must be between 1950 and 2050).',
        },
        end_date: {
          type: 'string',
          description: 'End date in YYYY-MM-DD format (must be between 1950 and 2050).',
        },
      },
      required: ['latitude', 'longitude', 'start_date', 'end_date'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'get_climate_projection':
      return getClimateProjection(
        args.latitude as number,
        args.longitude as number,
        args.start_date as string,
        args.end_date as string
      );
    case 'compare_models':
      return compareModels(
        args.latitude as number,
        args.longitude as number,
        args.start_date as string,
        args.end_date as string
      );
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function getClimateProjection(
  latitude: number,
  longitude: number,
  start_date: string,
  end_date: string
) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    start_date,
    end_date,
    daily: 'temperature_2m_mean,precipitation_sum',
    models: 'EC_Earth3P_HR',
  });
  const res = await fetch(`${BASE_URL}/climate?${params}`);
  if (!res.ok) throw new Error(`Climate API error: ${res.status}`);
  const data = (await res.json()) as RawClimateResponse;
  return formatClimateResponse(data);
}

async function compareModels(
  latitude: number,
  longitude: number,
  start_date: string,
  end_date: string
) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    start_date,
    end_date,
    daily: 'temperature_2m_mean',
    models: 'EC_Earth3P_HR,MPI_ESM1_2_XR,FGOALS_f3_H',
  });
  const res = await fetch(`${BASE_URL}/climate?${params}`);
  if (!res.ok) throw new Error(`Climate API error: ${res.status}`);
  const data = (await res.json()) as RawClimateResponse;
  return {
    ...formatClimateResponse(data),
    models: ['EC_Earth3P_HR', 'MPI_ESM1_2_XR', 'FGOALS_f3_H'],
  };
}

export default { tools, callTool } satisfies McpToolExport;
