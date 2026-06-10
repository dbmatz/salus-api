export interface IJwtService {
  sign(payload: { sub: string; email: string }): Promise<string>;
  verify(token: string): Promise<{ sub: string; email: string }>;
}