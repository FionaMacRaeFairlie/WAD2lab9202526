import bcrypt from "bcrypt";
import { userdb } from "../controllers/guestbookControllers.js";
import jwt from "jsonwebtoken";
import "../loadEnv.js";

/**
 * Login middleware: verifies username/password and sets a signed JWT cookie.
 * Expects `req.body.username` and `req.body.password`.
 *
 */

export const login = async (req, res, next) => {
  try {
    const username = req.body?.username;
    const password = req.body?.password;

    if (!username || !password) {
      // Missing credentials
      return res.status(400).render("login");
    }

    const entries = await userdb.lookup(username);

    // Case: user not found
    if (!entries || entries.length === 0) {
      console.log("User", username, "not found");
      return res.render("user/register");
    }

    // Case: user entry exists but malformed (should never happen)
    const userRecord = entries[0];

    if (!userRecord || typeof userRecord.password !== "string") {
      console.warn(`Malformed user record for ${username}:`, userRecord);
      return res.status(500).send("Internal Server Error");
    }

    const hashedPassword = entries[0]?.password;
    if (!hashedPassword) {
      console.warn(`No password hash stored for user ${username}`);
      return res.status(403).render("login");
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
    // Values for the SameSite attribute include "strict", "lax", or "none"
    //  "lax" enables only first-party cookies to be sent/accessed.
    //  "strict" is a subset of "lax" and won't fire if the incoming link is from an external site.
    res.cookie("jwt", accessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production", //This setting configures the Secure flag on a cookie to only enable when the application runs in a production environment, requiring HTTPS. It ensures cookies are transmitted securely over encrypted connections in production, while allowing them to be sent over HTTP during development
      maxAge: 300 * 1000, // 5 minutes
    });
    req.user = payload; // Attach user info to the request for downstream handlers
    // Proceed to next middleware/route handler
    return next();
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).send("Internal Server Error");
  }
};

export const verify = (req, res, next) => {
  const accessToken = req.cookies?.jwt;

  if (!accessToken) {
    return res.status(403).send();
  }

  try {
    const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    // Attach user info to the request for downstream handlers
    req.user = payload;
    console.log("Verified user:", payload);
    console.log("req.user set to:", req.user);
    return next();
  } catch (e) {
    return res.status(401).send();
  }
};
