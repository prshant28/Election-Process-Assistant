import { Router, type Request, type Response } from "express";
import { eq } from "drizzle-orm";
import {
  CreateGeminiConversationBody,
  SendGeminiMessageBody,
  GetGeminiConversationParams,
  DeleteGeminiConversationParams,
  ListGeminiMessagesParams,
  SendGeminiMessageParams,
} from "@workspace/api-zod";
import { getElectionSystemPrompt, isSafeQuery } from "../../lib/electionSystemPrompt.js";

const router = Router();

type GeminiDependencies = {
  db: typeof import("@workspace/db").db;
  conversations: typeof import("@workspace/db").conversations;
  messages: typeof import("@workspace/db").messages;
  ai: typeof import("@workspace/integrations-gemini-ai").ai;
};

function hasGeminiConfiguration(): boolean {
  return Boolean(
    process.env.DATABASE_URL &&
      process.env.AI_INTEGRATIONS_GEMINI_BASE_URL &&
      process.env.AI_INTEGRATIONS_GEMINI_API_KEY,
  );
}

async function getGeminiDependencies(): Promise<GeminiDependencies | null> {
  if (!hasGeminiConfiguration()) {
    return null;
  }

  const [dbModule, geminiModule] = await Promise.all([
    import("@workspace/db"),
    import("@workspace/integrations-gemini-ai"),
  ]);

  return {
    db: dbModule.db,
    conversations: dbModule.conversations,
    messages: dbModule.messages,
    ai: geminiModule.ai,
  };
}

async function requireGeminiDependencies(
  req: Request,
  res: Response,
): Promise<GeminiDependencies | null> {
  const dependencies = await getGeminiDependencies();

  if (dependencies) {
    return dependencies;
  }

  req.log.warn(
    "Gemini routes are unavailable. Set DATABASE_URL, AI_INTEGRATIONS_GEMINI_BASE_URL, and AI_INTEGRATIONS_GEMINI_API_KEY.",
  );
  res.status(503).json({
    error:
      "Gemini chat is unavailable. Configure DATABASE_URL, AI_INTEGRATIONS_GEMINI_BASE_URL, and AI_INTEGRATIONS_GEMINI_API_KEY.",
  });
  return null;
}

router.get("/conversations", async (req, res) => {
  try {
    const deps = await requireGeminiDependencies(req, res);
    if (!deps) {
      return;
    }

    const all = await deps.db
      .select()
      .from(deps.conversations)
      .orderBy(deps.conversations.createdAt);
    res.json(all);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/conversations", async (req, res) => {
  try {
    const deps = await requireGeminiDependencies(req, res);
    if (!deps) {
      return;
    }

    const parsed = CreateGeminiConversationBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid request body" });
      return;
    }
    const [conv] = await deps.db
      .insert(deps.conversations)
      .values({ title: parsed.data.title })
      .returning();
    res.status(201).json(conv);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/conversations/:id", async (req, res) => {
  try {
    const deps = await requireGeminiDependencies(req, res);
    if (!deps) {
      return;
    }

    const params = GetGeminiConversationParams.safeParse({ id: req.params.id });
    if (!params.success) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    const conv = await deps.db
      .select()
      .from(deps.conversations)
      .where(eq(deps.conversations.id, params.data.id))
      .limit(1);
    if (!conv.length) {
      res.status(404).json({ error: "Conversation not found" });
      return;
    }
    const msgs = await deps.db
      .select()
      .from(deps.messages)
      .where(eq(deps.messages.conversationId, params.data.id))
      .orderBy(deps.messages.createdAt);
    res.json({ ...conv[0], messages: msgs });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/conversations/:id", async (req, res) => {
  try {
    const deps = await requireGeminiDependencies(req, res);
    if (!deps) {
      return;
    }

    const params = DeleteGeminiConversationParams.safeParse({ id: req.params.id });
    if (!params.success) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    const deleted = await deps.db
      .delete(deps.conversations)
      .where(eq(deps.conversations.id, params.data.id))
      .returning();
    if (!deleted.length) {
      res.status(404).json({ error: "Conversation not found" });
      return;
    }
    res.status(204).send();
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/conversations/:id/messages", async (req, res) => {
  try {
    const deps = await requireGeminiDependencies(req, res);
    if (!deps) {
      return;
    }

    const params = ListGeminiMessagesParams.safeParse({ id: req.params.id });
    if (!params.success) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    const msgs = await deps.db
      .select()
      .from(deps.messages)
      .where(eq(deps.messages.conversationId, params.data.id))
      .orderBy(deps.messages.createdAt);
    res.json(msgs);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/conversations/:id/messages", async (req, res) => {
  try {
    const deps = await requireGeminiDependencies(req, res);
    if (!deps) {
      return;
    }

    const params = SendGeminiMessageParams.safeParse({ id: req.params.id });
    const body = SendGeminiMessageBody.safeParse(req.body);
    if (!params.success || !body.success) {
      res.status(400).json({ error: "Invalid request" });
      return;
    }

    const convId = params.data.id;
    const userContent = body.data.content;

    const conv = await deps.db
      .select()
      .from(deps.conversations)
      .where(eq(deps.conversations.id, convId))
      .limit(1);
    if (!conv.length) {
      res.status(404).json({ error: "Conversation not found" });
      return;
    }

    if (!isSafeQuery(userContent)) {
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      const safeMsg =
        "I can only help with election process information, not political opinions or candidate recommendations. Please ask me about voter registration, voting procedures, EVMs, or the election timeline!";
      res.write(`data: ${JSON.stringify({ content: safeMsg })}\n\n`);
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
      return;
    }

    await deps.db.insert(deps.messages).values({
      conversationId: convId,
      role: "user",
      content: userContent,
    });

    const chatHistory = await deps.db
      .select()
      .from(deps.messages)
      .where(eq(deps.messages.conversationId, convId))
      .orderBy(deps.messages.createdAt);

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const systemPrompt = getElectionSystemPrompt();

    const geminiMessages = chatHistory.map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" ? "model" : ("user" as "user" | "model"),
      parts: [{ text: m.content }],
    }));

    let fullResponse = "";

    const stream = await deps.ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: geminiMessages,
      config: {
        maxOutputTokens: 8192,
        systemInstruction: systemPrompt,
      },
    });

    for await (const chunk of stream) {
      const text = chunk.text;
      if (text) {
        fullResponse += text;
        res.write(`data: ${JSON.stringify({ content: text })}\n\n`);
      }
    }

    await deps.db.insert(deps.messages).values({
      conversationId: convId,
      role: "assistant",
      content: fullResponse,
    });

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err) {
    req.log.error(err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.write(`data: ${JSON.stringify({ error: "Stream error" })}\n\n`);
      res.end();
    }
  }
});

export default router;
