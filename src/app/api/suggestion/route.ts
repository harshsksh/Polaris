import { generateText, Output } from "ai";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
// import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";

const suggestionSchema = z.object({
  suggestion: z
    .string()
    .describe(
      "The code to insert at cursor, or empty string if no completion needed"
    ),
});

const SUGGESTION_PROMPT = `You are an inline code completion engine for an IDE.
Your job: return ONLY code that should be inserted at the cursor position, OR an empty string if no completion is needed.

<context>
file_name: {fileName}

previous_lines:
{previousLines}

current_line (number {lineNumber}):
{currentLine}

before_cursor:
{textBeforeCursor}

after_cursor:
{textAfterCursor}

next_lines:
{nextLines}

full_code:
{code}
</context>

<rules>
- Output MUST be a JSON object with exactly one key: "suggestion".
- "suggestion" MUST be a string.
- Do NOT include explanations, comments about what you're doing, markdown fences, or extra keys.
- The suggestion is inserted immediately AFTER the cursor. Therefore:
  - NEVER repeat text that already exists in before_cursor, after_cursor, next_lines, or full_code.
  - Return ONLY the missing characters/snippet to complete the intent.
- If unsure, return empty string.
</rules>

<decision_steps>
1) Look at next_lines.
   - If next_lines contains ANY non-whitespace code that clearly continues what should come after the cursor (e.g. the completion is already written below), then return {"suggestion": ""}.

2) If before_cursor ends with a complete statement or closing token, return {"suggestion": ""}.
   Treat these as "complete":
   - Ends with ';'
   - Ends with '}'
   - Ends with ')'
   - Ends with ']'
   - Ends with a completed import/export line
   - Ends with a full JSX/TSX tag closure on the same line

3) Otherwise, generate a minimal completion that fits the local style of full_code.
   - Prefer small, safe completions (closing brackets, completing function call args, finishing a line).
   - Keep it short: ideally <= 120 characters, unless a few lines are clearly required.
   - If you add new lines, preserve indentation based on current_line.
</decision_steps>

Now produce the JSON output.`;

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 },
      );
    }

    const {
      fileName,
      code,
      currentLine,
      previousLines,
      textBeforeCursor,
      textAfterCursor,
      nextLines,
      lineNumber,
    } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: "Code is required" },
        { status: 400 }
      );
    }

    const prompt = SUGGESTION_PROMPT
      .replace("{fileName}", fileName)
      .replace("{code}", code)
      .replace("{currentLine}", currentLine)
      .replace("{previousLines}", previousLines || "")
      .replace("{textBeforeCursor}", textBeforeCursor)
      .replace("{textAfterCursor}", textAfterCursor)
      .replace("{nextLines}", nextLines || "")
      .replace("{lineNumber}", lineNumber.toString());

    const { output } = await generateText({
        model: google("gemini-2.5-pro"),
        output: Output.object({ schema: suggestionSchema }),
        prompt,
        // stop: ["</context>", "</rules>", "</decision_steps>"], // if supported
    });

    return NextResponse.json({ suggestion: output.suggestion })
  } catch (error) {
    console.error("Suggestion error: ", error);
    return NextResponse.json(
      { error: "Failed to generate suggestion" },
      { status: 500 },
    );
  }
}