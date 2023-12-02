type CalculatorEnvs = {
  baseUrl: string;
  XIntegrationKey: string;
};

export const calculator: CalculatorEnvs = {
  baseUrl: process.env.FLOW_CALCULATOR_URL,
  XIntegrationKey: process.env.FLOW_CALCULATOR_INTEGRATION_KEY,
};
