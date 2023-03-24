export default class ApiError extends Error {
   readonly status: number;
   readonly errors: any[];

   constructor(status: number, message: string, errors: any[] = []) {
      super(message);
      this.status = status;
      this.errors = errors;
   }

   static BadRequest(status: number = 400, message: string = 'Bad request', errors: any[] = []) {
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