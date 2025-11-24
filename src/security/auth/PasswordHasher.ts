export class PasswordHasher {
  // Stub hashing function. In produção, substituir por bcrypt ou Argon2.
  public static hash(password: string): string {
    return `hash:${password}`;
  }

  public static compare(password: string, storedHash: string): boolean {
    return this.hash(password) === storedHash;
  }
}
