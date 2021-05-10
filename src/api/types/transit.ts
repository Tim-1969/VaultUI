export const enum TransitKeyTypes {
  AES128_GCM96 = "aes128-gcm96",
  AES256_GCM96 = "aes256-gcm96",
  CHACHA20_POLY1305 = "chacha20-poly1305",
  ED25519 = "ed25519",
  ECDSA_P256 = "ecdsa-p256",
  ECDSA_P384 = "ecdsa-p384",
  ECDSA_P521 = "ecdsa-p521",
  RSA_2048 = "rsa-2048",
  RSA_3072 = "rsa-3072",
  RSA_4096 = "rsa-4096",
}

// Type when used to make new transit keys.
export type TransitKeyBaseType = {
  name: string;
  convergent_encryption: boolean;
  derived: boolean;
  exportable: boolean;
  allow_plaintext_backup: boolean;
  type: keyof typeof TransitKeyTypes;
}

// Type returned when calling getTransitKey
export type TransitKeyType = TransitKeyBaseType & {
  keys: {
    [version: number]: number;
  };
  min_decryption_version: number;
  min_encryption_version: number;
  supports_encryption: boolean;
  supports_decryption: boolean;
  supports_derivation: boolean;
  supports_signing: boolean;
}