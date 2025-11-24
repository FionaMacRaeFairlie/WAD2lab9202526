import bcrypt from "bcrypt";
import { userdb } from "../controllers/guestbookControllers.js";
import jwt from "jsonwebtoken";
import "../loadEnv.js";

/**
 * Login middleware: verifies username/password and sets a signed JWT cookie.
 * Expects `req.body.username` and `req.body.password`.
 *
 */

// const user = await this.db.findOne({ user: username });
// return user; // returns null if not found

export const login = async (req, res, next) => {
  try {
    const username = req.body?.username;
    const password = req.body?.password;

    if (!username || !password) {
      // Missing credentials
      return res.status(400).render("user/login");
    }

    const entries = await userdb.lookup(username);

    if (!Array.isArray(entries) || entries.length === 0) {
      console.log("user", username, "not found");
      // Redirect to register page if user is not found
      return res.render("user/register");
    }

    const hashedPassword = entries[0]?.password;
    if (!hashedPassword) {
      console.warn(`No password hash stored for user ${username}`);
      return res.status(403).render("user/login");
    }

    // bcrypt.compare returns a Promise when no callback is provided
    const isValid = await bcrypt.compare(password, hashedPassword);

    if (!isValid) {
      // Invalid credentials
      return res.status(403).render("user/login");
    }

    // Ensure secret exists
    const secret = process.env.ACCESS_TOKEN_SECRET;
    if (!secret) {
      console.error("ACCESS_TOKEN_SECRET is not set");
      return res.status(500).send("Server misconfiguration");
    }

    // Create JWT payload and token (expires in 5 minutes)
    const payload = { username };
    const accessToken = jwt.sign(payload, secret, { expiresIn: 300 });

    // Set cookie with secure defaults
    res.cookie("jwt", accessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 300 * 1000, // 5 minutes
    });

    // Proceed to next middleware/route handler
    return next();
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).send("Internal Server Error");
  }
};

/**
 * Verify middleware: checks the JWT cookie and allows the request if valid.
 * Adds `req.user` containing the decoded payload.
 */
export const verify = (req, res, next) => {
  const accessToken = req.cookies?.jwt;

  if (!accessToken) {
    return res.status(403).send();
  }

  try {
    const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    // Attach user info to the request for downstream handlers
    req.user = payload;
    return next();
  } catch (e) {
    // Token invalid/expired
    return res.status(401).send();
  }
};
