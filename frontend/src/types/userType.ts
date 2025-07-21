export type UserRole = "technologist" | "physician" | "admin" | string;

export type User = {
  id: string;
  name: string;
  role: UserRole;
};
