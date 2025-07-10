import express from "express";
import {
  startAudio,
  createAudio,
  listAudios,
} from "../controllers/audio.controller.js";

const router = express.Router();

router.get("/start", startAudio);
router.post("/create", createAudio);
router.get("/list", listAudios);

export default router;
