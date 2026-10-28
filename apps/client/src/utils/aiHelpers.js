import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // for dev mode
});

export const analyzeBlogContent = async (content) => {
  try {
    const prompt = `
    Analyze the following blog content and return:
    1. A concise summary (2-3 sentences)
    2. 10 SEO keywords
    3. A relevant category
    Respond strictly in this JSON format:
    {
      "summary": "...",
      "keywords": ["...", "..."],
      "category": "..."
    }
    Content: ${content}
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.choices[0].message.content;
    return JSON.parse(text);
  } catch (err) {
    console.error("AI analysis failed:", err);
    return { summary: "", keywords: [], category: "" };
  }
};
