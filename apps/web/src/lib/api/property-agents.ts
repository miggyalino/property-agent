import type { PropertyAgentPayload } from '@/schemas/property-agent';

const API_BASE_URL = '/api';

const NETWORK_ERROR_MESSAGE =
  'Unable to reach the server. Check your connection and try again.';
const SERVER_ERROR_MESSAGE =
  'Something went wrong on our end. Please try again in a moment.';

const STATUS_MESSAGES: Record<number, string> = {
  400: 'Some of the details are invalid. Please review the form and try again.',
  409: 'A property agent with this email already exists.',
};

export interface PropertyAgent extends PropertyAgentPayload {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export class ApiError extends Error {
  readonly status: number | null;

  constructor(message: string, status: number | null = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const readServerMessage = async (
  response: Response,
): Promise<string | null> => {
  const body: unknown = await response.json().catch(() => null);

  if (typeof body !== 'object' || body === null || !('message' in body)) {
    return null;
  }

  const { message } = body as { message: unknown };

  if (Array.isArray(message)) {
    return (
      message.filter((entry) => typeof entry === 'string').join(', ') || null
    );
  }

  return typeof message === 'string' ? message : null;
};

const toApiError = async (response: Response): Promise<ApiError> => {
  if (response.status >= 500) {
    return new ApiError(SERVER_ERROR_MESSAGE, response.status);
  }

  const message =
    (await readServerMessage(response)) ??
    STATUS_MESSAGES[response.status] ??
    `Request failed with status ${response.status}.`;

  return new ApiError(message, response.status);
};

export const createPropertyAgent = async (
  agent: PropertyAgentPayload,
  signal?: AbortSignal,
): Promise<PropertyAgent> => {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}/property-agents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(agent),
      signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error;
    }

    throw new ApiError(NETWORK_ERROR_MESSAGE);
  }

  if (!response.ok) {
    throw await toApiError(response);
  }

  try {
    return (await response.json()) as PropertyAgent;
  } catch {
    throw new ApiError(
      'The server returned an unexpected response.',
      response.status,
    );
  }
};
