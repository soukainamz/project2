import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";

const openai = new OpenAI();

export const runtime = "edge";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    stream: true,
    messages: [
      {
        role: "system",
        content: `Evaluate the following joke based on the criteria provided:

**Joke:** [Insert generated joke here]

**Criteria for Evaluation:**
1. **Funny:** Is the joke humorous and likely to make people laugh or smile?
2. **Appropriate:** Is the joke suitable for all audiences and free from sensitive or controversial content?
3. **Offensive:** Does the joke contain content that could be considered disrespectful or inappropriate?
4. **Other Criteria:** Assess any additional aspects relevant to the joke's quality or suitability.

**Instructions:**
1. Review the joke.
2. Provide a brief summary of how the joke meets each of the evaluation criteria.
3. Include any additional comments or observations that might be relevant.

---

Feel free to adapt the prompt based on your specific evaluation needs or add more criteria if necessary.
`,
      },
      ...messages,
    ],
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}