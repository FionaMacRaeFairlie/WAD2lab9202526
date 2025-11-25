import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import mustache from "mustache-express";
import router from "./routes/guestbookRoutes.js";

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

// Static assets
app.use(express.static(publicFolder));
app.use("/css", express.static(bootstrapCss));
app.use("/js", express.static(bootstrapJs));

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

// Start server
const port = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(port, () => {
  const baseUrl = process.env.BASE_URL || `http://localhost:${port}`;
  console.log(`Server started at ${baseUrl} — press Ctrl+C to quit.`);
});
