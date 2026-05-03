import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import geminiRouter from "./gemini/index.js";
import electionRouter from "./election/index.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/gemini", geminiRouter);
router.use("/election", electionRouter);

export default router;
