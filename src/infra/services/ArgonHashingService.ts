import { IHashingService } from "@domain/services/IHashingService";
import argon2 from "argon2";

export class ArgonHashingService implements IHashingService {
  async hash(plain: string): Promise<string> {
    return argon2.hash(plain);
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return argon2.verify(hash, plain);
  }
}
