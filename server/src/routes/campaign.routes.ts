import { Router } from "express";
import { listCampaignsHandler } from "../controllers/campaign.controller";

export const campaignRouter = Router();

campaignRouter.get("/", listCampaignsHandler);
