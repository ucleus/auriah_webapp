export type UserRecord = {
  id: number;
  name: string;
  email: string;
  role: "owner" | "admin" | "family" | "viewer";
  status: "active" | "invited";
};

export const USERS: UserRecord[] = [
  { id: 1, name: "Sean", email: "fiv4lab@gmail.com", role: "owner", status: "active" },
  { id: 2, name: "Asha", email: "asha@auirah.app", role: "admin", status: "active" },
  { id: 3, name: "Jordan", email: "jordan@auirah.app", role: "family", status: "invited" },
];
