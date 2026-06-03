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
}

export class RegisterUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private hashingService: IHashingService,
  ) {}

  async execute(input: RegisterUserInput) {
    const email = Email.create(input.email);
    const password = Password.create(input.password);

    const existingEmail = await this.userRepository.findByEmail(email.value);

    if (existingEmail) {
      throw new ConflictError("Email already in use");
    }

    const passwordHash = await this.hashingService.hash(password.value);

    const user = User.create({ name: input.name, email, passwordHash });
    await this.userRepository.create(user);
  }
}
