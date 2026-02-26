import "express-async-errors";
import express from "express";
import path from "path";
import cors from "cors";
import { env } from "./config/env";
import { connectDatabase } from "./config/db";
import { errorHandler } from "./middlewares/errorHandler";
import apiRoutes from "./routes";

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// Static serving for uploaded CVs
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api", apiRoutes);

app.use(errorHandler);

import { startJobMatcherCron } from "./jobs/matcher.job";

async function bootstrap() {
  await connectDatabase();
  
  // Start background jobs
  startJobMatcherCron();

  app.listen(env.PORT, () => {
    console.log(`[SERVER] Running on http://localhost:${env.PORT}`);
  });
}

bootstrap();
