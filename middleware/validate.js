import { HttpError } from "./errorHandler.js";

export const validate = (schema) => (req, res, next) => {
  // TODO:
  // Hint: schema.safeParse(req.body). On failure: 400 with { error: { message, details } }.
  // On success: replace req.body with result.data and call next().
  const result = schema.safeParse(req.body);

  if (!result.success) {
    return next(
      new HttpError(
        400,
        "Validation failed",
        result.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      ),
    );
  }

  req.body = result.data;
  next();
  // throw new Error("not implemented");
};
