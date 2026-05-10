import { Router } from "express";
import { lifiQuoteStub } from "../controllers/lifi.controller";

export const lifiRouter = Router();

lifiRouter.get("/quote", lifiQuoteStub);
