import { Router } from "express";
import { toolsEcho } from "../controllers/tools.controller";

export const toolsRouter = Router();

toolsRouter.post("/echo", toolsEcho);
