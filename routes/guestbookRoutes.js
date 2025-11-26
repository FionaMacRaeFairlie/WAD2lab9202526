import express from "express";
import * as controller from "../controllers/guestbookControllers.js";
import { login, verify } from "../auth/auth.js";

// ...

const router = express.Router();
console.log("login middleware:", login);

router.get("/", controller.entries_list);
router.get("/guestbook", controller.entries_list);

router.get("/new", controller.show_new_entries);
router.post("/new", controller.post_new_entry);

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
router.use(function (req, res) {
  res.status(404);
  res.type("text/plain");
  res.send("404 Not found.");
});

// Generic error handler
router.use(function (err, req, res, next) {
  res.status(500);
  res.type("text/plain");
  res.send("Internal Server Error.");
});

export default router;
