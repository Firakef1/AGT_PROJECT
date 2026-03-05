import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import authRoutes from "./routes/authRoutes";
import memberRoutes from "./routes/memberRoutes";
import divisionRoutes from "./routes/divisionRoutes";
import eventRoutes from "./routes/eventRoutes";
import attendanceRoutes from "./routes/attendanceRoutes";
import financeRoutes from "./routes/financeRoutes";
import inventoryRoutes from "./routes/inventoryRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import { swaggerSpec } from "./config/swagger";
import passport from "./config/googleAuth";
import { ensureInitialAdmin } from "./utils/seedAdmin";
import { errorHandler } from "./middleware/errorHandler";
import { env } from "./config/env";

const app = express();

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/auth", authRoutes);
app.use("/members", memberRoutes);
app.use("/divisions", divisionRoutes);
app.use("/events", eventRoutes);
app.use("/attendance", attendanceRoutes);
app.use("/finance", financeRoutes);
app.use("/inventory", inventoryRoutes);
app.use("/dashboard", dashboardRoutes);

app.use(errorHandler);

async function start() {
  try {
    await ensureInitialAdmin();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[seed] Failed to ensure initial admin:", err);
  }

  app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`GubaeTech backend listening on port ${env.port}`);
  });
}

start();
