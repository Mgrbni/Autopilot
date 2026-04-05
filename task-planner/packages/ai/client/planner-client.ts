export type JsonModeRequest = {
  prompt: string;
  schemaName: string;
};

export interface PlannerClient {
  runJsonMode<T>(request: JsonModeRequest): Promise<T>;
}

export class OpenAIPlannerClient implements PlannerClient {
  async runJsonMode<T>(_request: JsonModeRequest): Promise<T> {
    throw new Error("OpenAI client not wired yet. Implement typed Responses API wrapper.");
  }
}
