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
import familyRoutes from "./routes/familyRoutes";
import settingRoutes from "./routes/settingRoutes";
import reportRoutes from "./routes/reportRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import { swaggerSpec } from "./config/swagger";
import passport from "./config/googleAuth";
import { ensureInitialAdmin } from "./utils/seedAdmin";
import { errorHandler } from "./middleware/errorHandler";
import { env } from "./config/env";

const app = express();

// Allow frontend origin: Vite default is 5173, or use FRONTEND_ORIGIN in production
const allowedOrigins =
  process.env.FRONTEND_ORIGIN
    ? process.env.FRONTEND_ORIGIN.split(",").map((o) => o.trim())
    : ["http://localhost:3000", "http://localhost:5173"];
app.use(cors({ origin: allowedOrigins }));
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
app.use("/families", familyRoutes);
app.use("/settings", settingRoutes);
app.use("/reports", reportRoutes);
app.use("/notifications", notificationRoutes);

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
