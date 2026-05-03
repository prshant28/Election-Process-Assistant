import { Router } from "express";
import {
  electionTopics,
  electionPhases,
  electionQuickStats,
} from "../../data/electionKnowledge.js";

const router = Router();

router.get("/topics", (req, res) => {
  const topics = electionTopics.map(({ id, title, titleHindi, description, icon, tags }) => ({
    id,
    title,
    titleHindi,
    description,
    icon,
    tags,
  }));
  res.json(topics);
});

router.get("/topics/:id", (req, res) => {
  const topic = electionTopics.find((t) => t.id === req.params.id);
  if (!topic) {
    res.status(404).json({ error: "Topic not found" });
    return;
  }
  res.json(topic);
});

router.get("/timeline", (req, res) => {
  res.json(electionPhases);
});

router.get("/quick-stats", (req, res) => {
  res.json(electionQuickStats);
});

export default router;
