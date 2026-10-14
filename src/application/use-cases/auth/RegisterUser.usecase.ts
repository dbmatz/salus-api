import { User } from "@domain/entities/User";
import { ConflictError } from "@domain/errors/ConflictError";
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { IHashingService } from "@domain/services/IHashingService";
import { Email } from "@domain/value-objects/Email";
import { Password } from "@domain/value-objects/Password";

interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
  birthDate: Date;
}

interface RegisterUserDeps {
  userRepository: IUserRepository;
  hashingService: IHashingService;
}

export class RegisterUserUseCase {
  constructor(private readonly deps: RegisterUserDeps) {}

  async execute(input: RegisterUserInput): Promise<void> {
    const email = Email.create(input.email);
    const password = Password.create(input.password);

    const existingEmail = await this.deps.userRepository.findByEmail(
      email.value,
    );

    if (existingEmail) {
      throw new ConflictError("Email already in use");
    }

    const passwordHash = await this.deps.hashingService.hash(password.value);

    const user = User.create({ name: input.name, email, passwordHash, birthDate: input.birthDate });
    await this.deps.userRepository.create(user);
  }
}
