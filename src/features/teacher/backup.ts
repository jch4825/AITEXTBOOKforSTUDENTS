export interface BackupPayload {
  version: 1;
  exportedAt: string;
  values: Record<string, string | null>;
}

interface BackupEnvelope {
  format: 'ai-textbook-backup';
  version: 1;
  salt: string;
  iv: string;
  ciphertext: string;
}

export const BACKUP_KEYS = [
  'ai-students-progress',
  'ai-students-settings',
  'ai-students-teacher-settings-v2',
  'ai-students-studio-evidence-v2',
  'ai-students-generalization-v1',
] as const;

export const BACKUP_RESTORED_EVENT = 'ai-textbook-backup-restored';

function getStorage(): Storage {
  if (typeof window === 'undefined') throw new Error('브라우저 저장소를 사용할 수 없어요.');
  return window.localStorage;
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  for (let index = 0; index < bytes.length; index += 1) {
    binary += String.fromCharCode(bytes[index]);
  }
  return window.btoa(binary);
}

function base64ToBytes(value: string): Uint8Array<ArrayBuffer> {
  const binary = window.atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

async function deriveBackupKey(passphrase: string, salt: Uint8Array<ArrayBuffer>): Promise<CryptoKey> {
  const material = await window.crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(passphrase),
    'PBKDF2',
    false,
    ['deriveKey'],
  );
  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 250_000,
      hash: 'SHA-256',
    },
    material,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}

function assertPassphrase(passphrase: string): void {
  if (passphrase.length < 8) throw new Error('백업 암호는 8자 이상이어야 해요.');
}

function parseEnvelope(text: string): BackupEnvelope {
  const parsed = JSON.parse(text) as Partial<BackupEnvelope>;
  if (parsed.format !== 'ai-textbook-backup' || parsed.version !== 1) {
    throw new Error('지원하지 않는 백업 파일이에요.');
  }
  if (typeof parsed.salt !== 'string' || typeof parsed.iv !== 'string' || typeof parsed.ciphertext !== 'string') {
    throw new Error('백업 파일의 구조가 올바르지 않아요.');
  }
  return parsed as BackupEnvelope;
}

function validatePayload(value: unknown): BackupPayload {
  if (!value || typeof value !== 'object') throw new Error('백업 내용이 비어 있어요.');
  const payload = value as Partial<BackupPayload>;
  if (payload.version !== 1 || typeof payload.exportedAt !== 'string' || !payload.values || typeof payload.values !== 'object') {
    throw new Error('백업 내용의 구조가 올바르지 않아요.');
  }
  const allowed = new Set<string>(BACKUP_KEYS);
  for (const [key, storedValue] of Object.entries(payload.values)) {
    if (!allowed.has(key)) throw new Error('백업에 허용되지 않은 항목이 들어 있어요.');
    if (storedValue !== null && typeof storedValue !== 'string') throw new Error('백업 저장값의 형식이 올바르지 않아요.');
  }
  return payload as BackupPayload;
}

export async function createEncryptedBackup(passphrase: string): Promise<Blob> {
  assertPassphrase(passphrase);
  const storage = getStorage();
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveBackupKey(passphrase, salt);
  const payload: BackupPayload = {
    version: 1,
    exportedAt: new Date().toISOString(),
    values: Object.fromEntries(BACKUP_KEYS.map((storageKey) => [storageKey, storage.getItem(storageKey)])),
  };
  const plaintext = new TextEncoder().encode(JSON.stringify(payload));
  const encrypted = await window.crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, plaintext);
  const envelope: BackupEnvelope = {
    format: 'ai-textbook-backup',
    version: 1,
    salt: bytesToBase64(salt),
    iv: bytesToBase64(iv),
    ciphertext: bytesToBase64(new Uint8Array(encrypted)),
  };
  return new Blob([JSON.stringify(envelope)], { type: 'application/json' });
}

export async function decryptBackup(text: string, passphrase: string): Promise<BackupPayload> {
  assertPassphrase(passphrase);
  const envelope = parseEnvelope(text);
  const salt = base64ToBytes(envelope.salt);
  const iv = base64ToBytes(envelope.iv);
  if (salt.byteLength !== 16 || iv.byteLength !== 12) throw new Error('백업 암호화 정보가 올바르지 않아요.');
  const key = await deriveBackupKey(passphrase, salt);
  const plaintext = await window.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    base64ToBytes(envelope.ciphertext),
  );
  const decoded = new TextDecoder().decode(plaintext);
  return validatePayload(JSON.parse(decoded) as unknown);
}

function rollbackSnapshot(storage: Storage, snapshot: Record<string, string | null>): void {
  for (const key of BACKUP_KEYS) {
    const previous = snapshot[key];
    if (previous === null) storage.removeItem(key);
    else storage.setItem(key, previous);
  }
}

export function applyBackup(payload: BackupPayload): void {
  const validated = validatePayload(payload);
  const storage = getStorage();
  const snapshot = Object.fromEntries(BACKUP_KEYS.map((key) => [key, storage.getItem(key)]));
  try {
    for (const key of BACKUP_KEYS) {
      const next = validated.values[key] ?? null;
      if (next === null) storage.removeItem(key);
      else storage.setItem(key, next);
    }
  } catch (error) {
    rollbackSnapshot(storage, snapshot);
    throw error;
  }
  window.dispatchEvent(new Event(BACKUP_RESTORED_EVENT));
}
