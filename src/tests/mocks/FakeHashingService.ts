import { IHashingService } from "@domain/services/IHashingService";

export class FakeHashingService implements IHashingService {
  async hash(plain: string): Promise<string> {
    return `hashed:${plain}`;
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return hash === `hashed:${plain}`;
  }
}