export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { messages, system } = req.body;

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
        max_tokens: 1000,
        system,
        messages,
      }),
    });

    const data = await response.json();
    if (data.error) {
      console.error("Anthropic API error:", data.error);
      return res.status(200).json({ reply: "Sorry, something went wrong.", error: data.error.message });
    }
    const textBlock = Array.isArray(data.content) ? data.content.find((b) => b.type === "text") : null;
    const reply = textBlock?.text || "";
    if (!reply) {
      // Temporary diagnostics: surface the raw API response so we can see why it's empty.
      return res.status(200).json({ reply: "Sorry, something went wrong.", debug: JSON.stringify(data).slice(0, 800) });
    }
    res.status(200).json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}
