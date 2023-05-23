export default class ApiError extends Error {
  readonly status: number;
  readonly errors: unknown[];

  constructor(status: number, message: string, errors: unknown[] = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static BadRequest(status = 400, message = 'Bad request', errors: unknown[] = []) {
    return new ApiError(status, message, errors);
  }

  static Unauthorized() {
    return new ApiError(401, 'Unauthorized');
  }

  static Forbidden() {
    return new ApiError(403, 'Forbidden');
  }

  static Internal() {
    return new ApiError(500, 'Internal');
  }
}
