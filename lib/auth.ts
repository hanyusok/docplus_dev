// Temporary auth utilities - replace with bcrypt when installed
export async function hashPassword(password: string): Promise<string> {
  // WARNING: This is NOT secure - only for testing
  return password;
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  // WARNING: This is NOT secure - only for testing
  return password === hashedPassword;
}

export function generateRandomPassword(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
} 