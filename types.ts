
export enum EncryptionType {
  RSA = 'RSA (Classical Encryption)',
  AES128 = 'AES-128',
  AES256 = 'AES-256',
  HYBRID = 'Hybrid (RSA + Post-Quantum)',
  PQC_ONLY = 'Post-Quantum Only'
}

export enum AttackerType {
  CLASSICAL = 'Classical Attacker (Current Computing)',
  QUANTUM = 'Quantum Attacker (Future Quantum Computers)'
}

export enum ResultStatus {
  SECURE = 'SECURE (Current Knowledge)',
  IN_DANGER = 'DATA IN DANGER (Under Quantum Threat)'
}

export type InputDataType = 'Text' | 'Image' | 'File' | 'Video' | 'Audio';

export interface SimulationResult {
  id: string;
  timestamp: number;
  userEmail: string | null;
  inputType: InputDataType;
  inputPreview: string;
  encryption: EncryptionType;
  attacker: AttackerType;
  classicalProgress: number;
  quantumProgress: number;
  timeEstimate: string;
  status: ResultStatus;
  explanation: string;
  assumptions: string;
  impact: string;
}

export interface User {
  name: string;
  email: string;
  provider: 'google' | 'apple' | null;
  lastLogin: number;
}
