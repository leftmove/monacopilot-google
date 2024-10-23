import {
  Message as AnthropicChatCompletion,
  MessageCreateParams as AnthropicChatCompletionCreateParamsBase,
} from '@anthropic-ai/sdk/resources';
import type {
  ChatCompletion as GroqChatCompletion,
  ChatCompletionCreateParamsBase as GroqChatCompletionCreateParamsBase,
} from 'groq-sdk/resources/chat/completions';
import {
  ChatCompletion as OpenAIChatCompletion,
  ChatCompletionCreateParamsBase as OpenAIChatCompletionCreateParamsBase,
} from 'openai/resources/chat/completions';

export type OpenAIModel = 'gpt-4o' | 'gpt-4o-mini' | 'o1-preview' | 'o1-mini';
export type GroqModel = 'llama-3-70b';
export type AnthropicModel =
  | 'claude-3-5-sonnet'
  | 'claude-3-opus'
  | 'claude-3-haiku'
  | 'claude-3-sonnet';

export type CopilotModel = OpenAIModel | GroqModel | AnthropicModel;

export type PickCopilotModel<T extends CopilotProvider> = T extends 'openai'
  ? OpenAIModel
  : T extends 'groq'
    ? GroqModel
    : T extends 'anthropic'
      ? AnthropicModel
      : never;

export type CopilotProvider = 'openai' | 'groq' | 'anthropic';

export type ChatCompletionCreateParams =
  | OpenAIChatCompletionCreateParamsBase
  | GroqChatCompletionCreateParamsBase
  | AnthropicChatCompletionCreateParamsBase;

export type ChatCompletion =
  | OpenAIChatCompletion
  | GroqChatCompletion
  | AnthropicChatCompletion;

export type PickChatCompletionCreateParams<T extends CopilotProvider> =
  T extends 'openai'
    ? OpenAIChatCompletionCreateParamsBase
    : T extends 'groq'
      ? GroqChatCompletionCreateParamsBase
      : T extends 'anthropic'
        ? AnthropicChatCompletionCreateParamsBase
        : never;

export type PickChatCompletion<T extends CopilotProvider> = T extends 'openai'
  ? OpenAIChatCompletion
  : T extends 'groq'
    ? GroqChatCompletion
    : T extends 'anthropic'
      ? AnthropicChatCompletion
      : never;

export type PromptData = {
  system: string;
  user: string;
};

/**
 * Options for configuring the Copilot instance.
 */
export interface CopilotOptions {
  /**
   * The provider to use (e.g., 'openai', 'anthropic', 'groq').
   * If not specified, a default provider will be used.
   */
  provider?: CopilotProvider;

  /**
   * The model to use for copilot AI requests.
   * This can be either:
   * 1. A predefined model name (e.g. 'claude-3-opus'): Use this option if you want to use a model that is built into Monacopilot.
   *    If you choose this option, also set the `provider` property to the corresponding provider of the model.
   * 2. A custom model configuration object: Use this option if you want to use a AI model from a third-party service or your own custom model.
   *
   * If not specified, a default model will be used.
   */
  model?: CopilotModel | CustomCopilotModel;
}

export type CustomCopilotModel = {
  /**
   * A function to configure the custom model.
   * This function takes the API key and the prompt data and returns the configuration for the custom model.
   *
   * @param {string} apiKey - The API key for authentication.
   * @param {Object} prompt - An object containing 'system' and 'user' messages generated by Monacopilot.
   * @returns {Object} An object that may include:
   *   - endpoint: The URL for the custom model's API (required)
   *   - headers: Additional HTTP headers for the API request (optional)
   *   - body: The request body data for the custom model API (optional)
   */
  config: CustomCopilotModelConfig;
  /**
   * A function to transform the response from the custom model.
   * This function takes the raw response from the custom model API
   * and returns the model generated text or null.
   *
   * @param response - The raw response from the custom model API.
   *                   The type is 'unknown' because different APIs
   *                   may return responses in different formats.
   * @returns The model generated text or null if no valid text could be extracted.
   */
  transformResponse: CustomCopilotModelTransformResponse;
};

export type CustomCopilotModelConfig = (
  apiKey: string,
  prompt: {
    system: string;
    user: string;
  },
) => {
  /**
   * The URL endpoint for the custom model's API.
   */
  endpoint: string;
  /**
   * Additional HTTP headers to include with the API request.
   * Use this to add any necessary authentication or custom headers.
   */
  headers?: Record<string, string>;
  /**
   * The data to be sent in the request body to the custom model API.
   */
  body?: Record<string, unknown>;
};

export type CustomCopilotModelTransformResponse = (response: unknown) => {
  /**
   * The text generated by the custom model.
   */
  text: string | null;
  /**
   * @deprecated Use `text` instead. This property will be removed in a future version.
   */
  completion?: string | null;
};
