export interface Permission {
  authority: string;
}

export interface User {
  id: number;
  username: string;
  fullName: string;
  enabled: boolean;
  permissions: Permission[];
}
