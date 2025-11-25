import express from "express";
import * as controller from "../controllers/guestbookControllers.js";
import { login, verify } from "../auth/auth.js";

const router = express.Router();

// Authentication routes
router.get("/login", controller.show_login);
router.post("/login", login, controller.handle_login);

// Guestbook routes
// router.get("/", controller.static_landing_page);
router.get("/", controller.landing_page);
router.get("/new", verify, controller.show_new_entries);
router.post("/new", verify, controller.post_new_entry);
router.get("/posts/:author", controller.show_user_entries);

// User registration routes
router.get("/register", controller.show_register_page);
router.post("/register", controller.post_new_user);

// Logged-in landing page
router.get("/loggedIn", verify, controller.loggedIn_landing);

// Logout
router.get("/logout", controller.logout);

// 404 handler
router.use((req, res) => {
  res.status(404).render("errors/error", { title: "Page Not Found" });
});

// Generic error handler
router.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).render("errors/error", { title: "Internal Server Error" });
});

export default router;
