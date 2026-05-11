// Cliente directo a la Anthropic Messages API desde el browser.
//
// IMPORTANTE: la API key vive en localStorage del navegador de la doctora.
// Esto es aceptable porque:
//   1. El admin es uso personal de una persona (no multitenant)
//   2. La key nunca sale del browser de ella
//   3. El módulo es opcional — el generador con plantilla funciona sin key
//
// Si en el futuro el admin se expone a más usuarios o se hace multitenant,
// hay que mover esta llamada a un edge function que guarde la key del lado
// del servidor.

import { buildClaudePrompt } from './templates/copy.js';

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_VERSION = '2023-06-01';

export class ClaudeError extends Error {
  constructor(message, { status, code, retryable = false } = {}) {
    super(message);
    this.name = 'ClaudeError';
    this.status = status;
    this.code = code;
    this.retryable = retryable;
  }
}

function looksLikeAnthropicKey(key) {
  return typeof key === 'string' && key.startsWith('sk-ant-') && key.length > 30;
}

export function isApiKeyValid(key) {
  return looksLikeAnthropicKey(key);
}

// Llama a Claude para reescribir el draft del generador en el tono de la marca.
export async function variateCopyWithClaude({
  topic,
  angle,
  format,
  brand,
  currentDraft,
  apiKey,
  model = 'claude-haiku-4-5-20251001',
  signal,
}) {
  if (!looksLikeAnthropicKey(apiKey)) {
    throw new ClaudeError(
      'Configurá una API key válida en Ajustes para usar esta opción.',
      { code: 'no_key' }
    );
  }

  const prompt = buildClaudePrompt({ topic, angle, format, brand, currentDraft });

  let response;
  try {
    response = await fetch(ANTHROPIC_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': ANTHROPIC_VERSION,
        // Habilita uso directo desde el browser. Solo encendemos esto cuando
        // la doctora explícitamente configuró su key.
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model,
        max_tokens: format === 'carousel' ? 1000 : 600,
        messages: [{ role: 'user', content: prompt }],
      }),
      signal,
    });
  } catch (e) {
    if (e?.name === 'AbortError') {
      throw new ClaudeError('Generación cancelada.', { code: 'aborted' });
    }
    throw new ClaudeError(
      'No pudimos conectar con Anthropic. Revisá tu conexión.',
      { code: 'network', retryable: true }
    );
  }

  if (!response.ok) {
    let detail = `HTTP ${response.status}`;
    try {
      const errBody = await response.json();
      detail = errBody?.error?.message ?? detail;
    } catch {
      /* respuesta no JSON */
    }

    if (response.status === 401) {
      throw new ClaudeError(
        'API key inválida. Revisala en Ajustes.',
        { status: 401, code: 'unauthorized' }
      );
    }
    if (response.status === 429) {
      throw new ClaudeError(
        'Anthropic devolvió límite de uso. Probá en un minuto.',
        { status: 429, code: 'rate_limit', retryable: true }
      );
    }
    if (response.status >= 500) {
      throw new ClaudeError(
        'Anthropic está respondiendo lento. Volvé a intentar en un momento.',
        { status: response.status, code: 'server_error', retryable: true }
      );
    }
    throw new ClaudeError(detail, { status: response.status, code: 'http_error' });
  }

  const data = await response.json();
  const text = data?.content?.[0]?.text?.trim() ?? '';
  if (!text) {
    throw new ClaudeError('Claude devolvió una respuesta vacía. Probá de nuevo.', {
      code: 'empty_response',
      retryable: true,
    });
  }

  return {
    caption: text,
    usage: data?.usage ?? null,
  };
}

// Para tests
export const _internals = { looksLikeAnthropicKey, ANTHROPIC_URL };
