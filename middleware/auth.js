import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { HttpError } from "./errorHandler.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export async function authenticate(req, _res, next) {
  // TODO:
  // Hint: read Authorization: Bearer <token>. Verify with jwt.verify(token, JWT_SECRET).
  // Load User.findById(payload.sub). Attach to req.user. Any failure -> 401.
  // See: docs/API.md "Authentication", tester/tests/auth.test.js
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer "))
    throw new HttpError(401, "Unauthorized");
  try {
    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(payload.sub).select("-passwordHash");
    if (!req.user) throw new HttpError(401, "Unauthorized");
    next();
  } catch {
    throw new HttpError(401, "Unauthorized");
  }
  // throw new Error("not implemented");
}

export function signToken(user) {
  // TODO:
  // Hint: jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN || '7d' })
  return jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  // throw new Error('not implemented');
}
