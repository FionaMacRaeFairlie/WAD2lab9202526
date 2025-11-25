import express from "express";
import * as controller from "../controllers/guestbookControllers.js";

const router = express.Router();

router.get("/", controller.entries_list);
router.get("/guestbook", controller.entries_list);

router.get("/new", controller.show_new_entries);
router.post("/new", controller.post_new_entry);

router.get("/posts/:author", controller.show_user_entries);
// router.get("/comments", (req, res) => {
//   console.log("filtering for author ", req.query.author);
// });

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
