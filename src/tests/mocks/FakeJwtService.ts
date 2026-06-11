import { IJwtService } from "@domain/services/IJwtService";

export class FakeJwtService implements IJwtService {
  async sign(payload: { sub: string; email: string }): Promise<string> {
    return `fake-token:${payload.sub}`;
  }

  async verify(token: string): Promise<{ sub: string; email: string }> {
    const sub = token.replace("fake-token:", "");
    return { sub, email: "fake@email.com" };
  }
}