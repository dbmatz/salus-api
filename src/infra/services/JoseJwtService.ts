import { IJwtService } from "@domain/services/IJwtService";
import { jwtVerify, SignJWT } from "jose";
import { env } from "../../env";

export class JoseJwtService implements IJwtService {
  private readonly secret: Uint8Array;

  constructor() {
    this.secret = new TextEncoder().encode(env.JWT_SECRET);
  }
  async sign(payload: { sub: string; email: string }): Promise<string> {
    const result = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(this.secret);

    return result;
  }

  async verify(token: string): Promise<{ sub: string; email: string }> {
    const { payload } = await jwtVerify(token, this.secret);
    return payload as { sub: string; email: string };
  }
}
