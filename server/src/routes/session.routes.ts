import { Router } from "express";
import { postSessionEventHandler } from "../controllers/session.controller";

export const sessionRouter = Router();

sessionRouter.post("/:id/events", postSessionEventHandler);
