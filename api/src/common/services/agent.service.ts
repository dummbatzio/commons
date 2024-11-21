import { AgentInput } from '../dtos/agent.input';

export interface AgentService<T> {
  verify(id: string): Promise<T>;
  transformInput(input: AgentInput);
}
