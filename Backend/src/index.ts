import "express-async-errors";
import express from "express";
import cors from "cors";
import { env } from "./config/env";
import { connectDatabase } from "./config/db";
import { errorHandler } from "./middlewares/errorHandler";
import apiRoutes from "./routes";

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api", apiRoutes);

app.use(errorHandler);

async function bootstrap() {
  await connectDatabase();
  app.listen(env.PORT, () => {
    console.log(`[SERVER] Running on http://localhost:${env.PORT}`);
  });
}

bootstrap();
