type CryptationEnvs = {
  privateKey: string;
  publicKey: string;
  baasPublicKey: string;
};

export const cryptoEnv: CryptationEnvs = {
  privateKey: process.env.CRYPTO_PRIVATE_KEY,
  publicKey: process.env.CRYPTO_PUBLIC_KEY,
  baasPublicKey: process.env.CRYPTO_BAAS_PUBLIC_KEY,
};
