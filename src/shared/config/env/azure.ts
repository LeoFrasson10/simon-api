type AzureEnvs = {
  AzureAccountName: string;
  AzureAccountKey: string;
  AzureContainerName: string;
  AzureUrl: string;
};

export const Azure: AzureEnvs = {
  AzureAccountName: process.env.AZURE_ACCOUNT_NAME,
  AzureAccountKey: process.env.AZURE_ACCOUNT_KEY,
  AzureContainerName: process.env.AZURE_CONTAINER_NAME,
  AzureUrl: `https://${process.env.AZURE_ACCOUNT_NAME}.blob.core.windows.net/`,
};
