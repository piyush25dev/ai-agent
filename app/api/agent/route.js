import { runAgent } from "../../../lib/agent";

export const runtime = "nodejs";

const ALLOWED_ORIGIN = "http://localhost:8081";

function corsHeaders(request) {
  const origin = request.headers.get("origin");

  return {
    ...(origin === ALLOWED_ORIGIN
      ? { "Access-Control-Allow-Origin": origin }
      : {}),
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    Vary: "Origin",
  };
}

export async function OPTIONS(request) {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(request),
  });
}

export async function POST(request) {
  const headers = corsHeaders(request);

  try {
    const body = await request.json();

    const task =
      typeof body.task === "string"
        ? body.task.trim()
        : "";

    const isNewChat = body.isNewChat === true;

    if (!task) {
      return Response.json(
        { error: "Task is required." },
        { status: 400, headers }
      );
    }

    const events = [];

    const result = await runAgent(
      task,
      (event) => {
        events.push(event);
      },
      {
        generateTitle: isNewChat,
      }
    );

    return Response.json(
      {
        title: result.title,
        answer: result.answer,
        events,
      },
      { headers }
    );
  } catch (error) {
    console.error("Agent API error:", error);

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      {
        status: 500,
        headers,
      }
    );
  }
}