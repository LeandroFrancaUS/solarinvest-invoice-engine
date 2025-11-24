export interface User {
  id: string;
  username: string;
  passwordHash: string;
  roles: string[];
}

export const seedUsers: User[] = [
  {
    id: "1",
    username: "admin",
    passwordHash: "hash:admin",
    roles: ["ADMIN"],
  },
  {
    id: "2",
    username: "analista",
    passwordHash: "hash:analista",
    roles: ["ANALISTA"],
  },
];
