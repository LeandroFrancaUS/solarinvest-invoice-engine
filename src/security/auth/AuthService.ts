import { PasswordHasher } from "./PasswordHasher";
import { User, seedUsers } from "./UserModel";

export class AuthService {
  private users: User[];

  constructor(users: User[] = seedUsers) {
    this.users = users;
  }

  public authenticate(username: string, password: string): User | null {
    const user = this.users.find((u) => u.username === username);
    if (!user) {
      return null;
    }

    const isValid = PasswordHasher.compare(password, user.passwordHash);
    return isValid ? user : null;
  }

  public register(userData: Omit<User, "passwordHash"> & { password: string }): User {
    const newUser: User = {
      id: userData.id,
      username: userData.username,
      roles: userData.roles,
      passwordHash: PasswordHasher.hash(userData.password),
    };

    this.users.push(newUser);
    return newUser;
  }

  public listUsers(): User[] {
    return [...this.users];
  }
}
