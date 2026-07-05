export default async function handler(req, res) {
  // Sirf POST requests allow
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { brandName, industry, style, colors, prompt } = req.body;

    const finalPrompt =
      prompt ||
      `Create a clean, professional vector logo for "${brandName || "a modern brand"}".
Industry: ${industry || "business"}.
Style: ${style || "minimal"}.
Preferred colors: ${colors || "modern colors"}.
No text mistakes, no watermark, centered logo, white background, high quality branding design.`;

    const response = await fetch(
      "https://api.stability.ai/v2beta/stable-image/generate/core",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
          Accept: "image/*",
        },
        body: createFormData(finalPrompt),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: "Stability AI generation failed",
        details: errorText,
      });
    }

    const imageBuffer = await response.arrayBuffer();

    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).send(Buffer.from(imageBuffer));
  } catch (error) {
    return res.status(500).json({
      error: "Server error",
      details: error.message,
    });
  }
}

function createFormData(prompt) {
  const formData = new FormData();

  formData.append("prompt", prompt);
  formData.append("output_format", "png");
  formData.append("aspect_ratio", "1:1");

  return formData;
}
