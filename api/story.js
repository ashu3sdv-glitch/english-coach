export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { phrases, topic } = req.body;

  const phraseList = phrases.map((w) => `"${w.word}"`).join(", ");

  const system = `You are an English story writer for language learners. Write a short engaging story (6-8 sentences) on the topic: "${topic}".

CRITICAL RULES:
- You MUST naturally include AT LEAST 6 of these exact phrases in the story: ${phraseList}
- Use the phrases EXACTLY as written (same case, same form)
- The story should feel natural, not forced
- Level: intermediate (B1), clear vocabulary
- Output ONLY the story text, nothing else, no title, no explanation`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-5",
        max_tokens: 600,
        system,
        messages: [{ role: "user", content: "Write the story now." }],
      }),
    });

    const data = await response.json();
    if (data.error) {
      console.error("Anthropic API error:", data.error);
      return res.status(200).json({ story: "", error: data.error.message });
    }
    const story = data.content?.[0]?.text?.trim() || "";
    res.status(200).json({ story });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}
