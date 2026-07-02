import { UnauthorizedError } from "@domain/errors/UnauthorizedError";
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { IHashingService } from "@domain/services/IHashingService";
import { IJwtService } from "@domain/services/IJwtService";

interface LoginInput {
  email: string;
  password: string;
}

interface LoginDeps {
  userRepository: IUserRepository;
  hashingService: IHashingService;
  jwtService: IJwtService;
}

export class LoginUseCase {
  constructor(private readonly deps: LoginDeps) {}

  async execute(input: LoginInput): Promise<{ token: string }> {
    const foundUserByEmail = await this.deps.userRepository.findByEmail(
      input.email,
    );

    if (!foundUserByEmail) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const passwordMatch = await this.deps.hashingService.compare(
      input.password,
      foundUserByEmail.passwordHash,
    );

    if (!passwordMatch) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const token = await this.deps.jwtService.sign({
      sub: foundUserByEmail.id,
      email: foundUserByEmail.email.value,
    });

    return { token };
  }
}
