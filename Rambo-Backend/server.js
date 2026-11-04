import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";

dotenv.config();

const app = express();
app.set("trust proxy", 1);
const PORT = process.env.PORT || 5000;

const isProduction = process.env.NODE_ENV === "production";

// Configure allowed frontend origins in CLIENT_URL.
// Multiple origins can be comma-separated (no trailing slash).
const allowedOrigins = (
  process.env.CLIENT_URL || "http://localhost:5173"
)
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);

// Security headers
app.use(helmet());

// CORS
app.use(
  cors({
    origin(origin, callback) {
      // Allow requests without an Origin header, such as
      // certain server-to-server and command-line requests.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Limit incoming request body sizes
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));

// ---- MongoDB connection (serverless-friendly) ----
// On Vercel there is no long-running server, so we connect on demand
// and reuse the same connection promise between requests.
let dbPromise = null;
const ensureDB = () => {
  if (!dbPromise) {
    dbPromise = connectDB().catch((err) => {
      dbPromise = null; // allow retry on next request
      throw err;
    });
  }
  return dbPromise;
};

// Health check (does not need the database)
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "OK",
    message: "Rambo Backend is running!",
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Rambo Bath Accessories API",
  });
});

// Make sure the DB is connected before any API route runs
app.use("/api", async (req, res, next) => {
  try {
    await ensureDB();
    next();
  } catch (error) {
    console.error("Database connection failed:", error.message);
    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

// General API rate limit
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

app.use("/api", apiLimiter);

// Stricter rate limit for Contact Us submissions
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many contact messages. Please try again in 15 minutes.",
  },
});

// API routes
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/contact", contactLimiter, contactRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  // Invalid JSON submitted in a request body
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON request body",
    });
  }

  // Log details on the server, not in the response.
  console.error("Request error:", err);

  if (err.message === "Origin not allowed by CORS") {
    return res.status(403).json({
      success: false,
      message: "Origin not allowed",
    });
  }

  const status =
    Number.isInteger(err.status) &&
    err.status >= 400 &&
    err.status < 500
      ? err.status
      : 500;

  res.status(status).json({
    success: false,
    message:
      !isProduction && status !== 500
        ? err.message
        : "An unexpected server error occurred",
  });
});

// Local development only: Vercel runs the exported app as a serverless
// function, so it must NOT call app.listen there.
if (!process.env.VERCEL) {
  ensureDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Rambo API listening on port ${PORT}`);
      });
    })
    .catch((error) => {
      console.error("Failed to start server:", error.message);
      process.exit(1);
    });
}

// Required by Vercel
export default app;