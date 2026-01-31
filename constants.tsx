
import { EncryptionType, AttackerType, ResultStatus } from './types';

export const ENCRYPTION_OPTIONS = [
  { value: EncryptionType.RSA, icon: '🔑' },
  { value: EncryptionType.AES128, icon: '🔐' },
  { value: EncryptionType.AES256, icon: '🔒' },
  { value: EncryptionType.HYBRID, icon: '🛡️' },
  { value: EncryptionType.PQC_ONLY, icon: '⚛️' },
];

export const ATTACKER_OPTIONS = [
  { value: AttackerType.CLASSICAL, icon: '💻' },
  { value: AttackerType.QUANTUM, icon: '⚛️' },
];

export const GET_RESULT_LOGIC = (enc: EncryptionType, att: AttackerType) => {
  // Classical attackers cannot break modern encryption
  if (att === AttackerType.CLASSICAL) {
    return {
      status: ResultStatus.SECURE,
      classicalProgress: 5,
      quantumProgress: 2,
      timeToBreak: '>10^15 Years',
      explanation: 'Modern classical computers are completely incapable of breaking modern encryption standards like RSA-2048 or AES-256 via brute force.',
      assumptions: 'Assumes current computational limits and no mathematical backdoors in classical hardware.',
      impact: 'The encrypted data is secure with today\'s technology.'
    };
  }

  // Quantum Attacker Path
  if (enc === EncryptionType.RSA) {
    return {
      status: ResultStatus.IN_DANGER,
      classicalProgress: 5,
      quantumProgress: 100,
      timeToBreak: 'Minutes',
      explanation: 'Shor\'s Algorithm allows a sufficiently large quantum computer to factorize large integers in polynomial time, making RSA completely obsolete.',
      assumptions: 'Assumes a Cryptographically Relevant Quantum Computer (CRQC) with millions of qubits.',
      impact: 'Your private data would be instantly decrypted by a quantum adversary.'
    };
  }

  if (enc === EncryptionType.AES128) {
    return {
      status: ResultStatus.IN_DANGER,
      classicalProgress: 5,
      quantumProgress: 75,
      timeToBreak: 'Feasible (Under specific conditions)',
      explanation: 'Grover\'s Algorithm provides a square-root speedup for brute-force searches. For AES-128, this reduces effective security to 64-bits, which is critically low.',
      assumptions: 'Assumes quantum search capability at scale.',
      impact: 'Data security is critically degraded; attackers can likely brute-force the key.'
    };
  }

  if (enc === EncryptionType.AES256) {
    return {
      status: ResultStatus.SECURE,
      classicalProgress: 5,
      quantumProgress: 15,
      timeToBreak: 'Trillions of Years',
      explanation: 'Even with Grover\'s Algorithm, the search space for AES-256 remains astronomically large (128-bit quantum security), which is currently considered safe.',
      assumptions: 'Quantum search remains the most efficient known attack strategy.',
      impact: 'Data remains secure even against quantum adversaries in the foreseeable future.'
    };
  }

  // Hybrid or PQC
  return {
    status: ResultStatus.SECURE,
    classicalProgress: 3,
    quantumProgress: 5,
    timeToBreak: 'Unknown (Extremely High)',
    explanation: 'Post-Quantum Cryptography (PQC) relies on mathematical problems (like Lattice-based crypto) that are believed to be hard for both classical and quantum computers.',
    assumptions: 'Assumes the underlying PQC mathematical problems remain difficult.',
    impact: 'The highest level of future-proof protection available today.'
  };
};
