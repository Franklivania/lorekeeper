import { Router } from "express";
import {
  createProfileHandler,
  listCharactersHandler,
} from "../controllers/character.controller";
import { requireWallet } from "../middleware/auth.middleware";

export const characterRouter = Router();

characterRouter.get("/", requireWallet, listCharactersHandler);
characterRouter.post("/profile", requireWallet, createProfileHandler);
