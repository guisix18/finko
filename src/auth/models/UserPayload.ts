export interface UserPayload {
  id: number;
  sub: number;
  email: string;
  name: string;
  iat?: number;
  exp?: number;
}
