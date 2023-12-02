export interface IEmitters<Input, Output> {
  execute(data: Input): Promise<Output>;
}
