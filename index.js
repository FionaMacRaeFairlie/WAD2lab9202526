import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import mustache from "mustache-express";
import router from "./routes/guestbookRoutes.js";
import "./loadEnv.js"; // Ensure environment variables are loaded early

const app = express();

// Resolve __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Static folders
const publicFolder = path.join(__dirname, "public");
const bootstrapCss = path.join(
  __dirname,
  "node_modules",
  "bootstrap",
  "dist",
  "css"
);
const bootstrapJs = path.join(
  __dirname,
  "node_modules",
  "bootstrap",
  "dist",
  "js"
);

// Trust proxy (useful if deployed behind reverse proxy like Nginx/Heroku)
app.set("trust proxy", 1);

// Static assets
app.use(express.static(publicFolder));
app.use("/css", express.static(bootstrapCss));
app.use("/js", express.static(bootstrapJs));

// Cookie parsing
app.use(cookieParser());

// Body parsing for forms (application/x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));

// Mustache view engine
app.engine("mustache", mustache());
app.set("view engine", "mustache");

// Optionally set views directory (defaults to ./views)
app.set("views", path.join(__dirname, "views"));

// app.use(express.json());

// Routes
app.use("/", router);

// 404 handler
app.use((req, res) => {
  res.status(404).render("errors/404", { title: "Page Not Found" });
});

// Generic error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).render("errors/500", { title: "Server Error" });
});

// Start server
const port = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(port, () => {
  const baseUrl = process.env.BASE_URL || `http://localhost:${port}`;
  console.log(`Server started at ${baseUrl} — press Ctrl+C to quit.`);
});
