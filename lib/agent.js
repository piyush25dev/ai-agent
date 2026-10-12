const calculatorTool = {
  type: "function",
  function: {
    name: "calculator",
    description:
      "Evaluate a basic arithmetic expression. Use this when accurate calculation is needed.",
    parameters: {
      type: "object",
      properties: {
        expression: {
          type: "string",
          description:
            "Arithmetic expression such as (1250*0.18)+1250",
        },
      },
      required: ["expression"],
      additionalProperties: false,
    },
  },
};

const chatTitleTool = {
  type: "function",
  function: {
    name: "set_chat_title",
    description:
      "Create a short title based on the user's first request. The title must contain exactly 4 or 5 words.",
    parameters: {
      type: "object",
      properties: {
        title: {
          type: "string",
          description:
            "A clear 4 or 5 word title describing the user's request. Do not use quotes, emojis, or punctuation.",
        },
      },
      required: ["title"],
      additionalProperties: false,
    },
  },
};

function calculator(expression) {
  if (!/^[0-9+\-*/().%\s]+$/.test(expression)) {
    throw new Error(
      "Only basic arithmetic is allowed."
    );
  }

  // eslint-disable-next-line no-new-func
  const result = Function(
    `"use strict"; return (${expression})`
  )();

  if (
    typeof result !== "number" ||
    !Number.isFinite(result)
  ) {
    throw new Error("Invalid calculation.");
  }

  return String(result);
}

function cleanTitle(title) {
  if (!title || typeof title !== "string") {
    return "New Chat";
  }

  let cleaned = title
    .replace(/["'`]/g, "")
    .replace(/[.!?,:;]+/g, "")
    .replace(/\s+/g, " ")
    .trim();

  let words = cleaned.split(" ");

  /*
   * Keep the title between 4 and 5 words.
   */
  if (words.length > 5) {
    words = words.slice(0, 5);
  }

  if (words.length < 4) {
    return "New Chat";
  }

  return words.join(" ");
}

export async function runAgent(
  userTask,
  onEvent,
  options = {}
) {
  const key = process.env.OPENROUTER_API_KEY;

  if (!key) {
    throw new Error(
      "OPENROUTER_API_KEY is missing. Add it to .env.local."
    );
  }

  const model =
    process.env.OPENROUTER_MODEL ||
    "openrouter/free";

  const generateTitle =
    options.generateTitle === true;

  const tools = generateTitle
    ? [chatTitleTool, calculatorTool]
    : [calculatorTool];

  let messages = [
    {
      role: "system",
      content: generateTitle
        ? `
You are a practical task agent.

Solve the user's task accurately.

This is the first message of a new conversation.

You MUST call the set_chat_title tool exactly once before completing the task.

The title must:
- contain exactly 4 or 5 words
- describe the user's main request
- be clear and natural
- not contain quotes
- not contain emojis
- not contain punctuation

Use other tools when they improve accuracy.

Do not invent tool results.

After completing the task, provide a concise and useful final answer.
`
        : `
You are a practical task agent.

Solve the user's task accurately.

Use tools when they improve accuracy.

Do not invent tool results.

Keep the final answer concise but useful.
`,
    },

    {
      role: "user",
      content: userTask,
    },
  ];

  let chatTitle = null;

  onEvent({
    type: "status",
    message: "Understanding the task",
  });

  for (let step = 0; step < 8; step++) {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",

        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "JavaScript AI Agent",
        },

        body: JSON.stringify({
          model,
          messages,
          tools,
          tool_choice: "auto",
        }),
      }
    );

    if (!response.ok) {
      const body = await response.text();

      throw new Error(
        `OpenRouter API error (${response.status}): ${body}`
      );
    }

    const data = await response.json();

    const message =
      data.choices?.[0]?.message;

    if (!message) {
      throw new Error(
        "OpenRouter returned an unexpected response."
      );
    }

    /*
     * AI has finished.
     */
    if (!message.tool_calls?.length) {
      onEvent({
        type: "status",
        message: "Task completed",
      });

      return {
        title: chatTitle,
        answer:
          message.content ||
          "The agent completed the task but returned no text.",
      };
    }

    /*
     * Keep the assistant tool-call message
     * in the conversation.
     */
    messages.push(message);

    for (const call of message.tool_calls) {
      const toolName =
        call.function?.name;

      let args = {};

      try {
        args = JSON.parse(
          call.function?.arguments || "{}"
        );
      } catch {
        args = {};
      }

      /*
       * Chat title
       */
      if (toolName === "set_chat_title") {
        chatTitle = cleanTitle(args.title);

        onEvent({
          type: "status",
          message: `Chat title: ${chatTitle}`,
        });

        messages.push({
          role: "tool",
          tool_call_id: call.id,
          content: chatTitle,
        });

        continue;
      }

      /*
       * Calculator
       */
      if (toolName === "calculator") {
        onEvent({
          type: "tool",
          message: `Using calculator: ${
            args.expression || ""
          }`,
        });

        let result;

        try {
          result = calculator(
            String(args.expression || "")
          );
        } catch (error) {
          result = `Tool error: ${
            error instanceof Error
              ? error.message
              : "Unknown error"
          }`;
        }

        messages.push({
          role: "tool",
          tool_call_id: call.id,
          content: result,
        });

        continue;
      }

      /*
       * Unknown tool
       */
      messages.push({
        role: "tool",
        tool_call_id: call.id,
        content: "Unknown tool.",
      });
    }
  }

  throw new Error(
    "Agent stopped after reaching its safety step limit."
  );
}