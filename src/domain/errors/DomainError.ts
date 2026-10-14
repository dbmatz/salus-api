export class DomainError extends Error {
  readonly code: string;

  constructor(message: string, code: string = "DOMAIN_ERROR") {
    super(message);
    this.code = code;
    this.name = "DomainError";
  }
}
