export interface AccountCredentials {
  username: string;
  password: string;
}

export interface Token {
  username: string;
  authenticated: boolean;
  created: string;
  expiration: string;
  accessToken: string;
  refreshToken: string;
}
