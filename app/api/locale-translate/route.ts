import { readTranslationProvider } from "@/features/translation/provider";

interface TranslateRequestBody {
  text: string;
  from: "zh" | "en";
  to: "zh" | "en";
}

async function translateWithGoogleGtx(
  body: TranslateRequestBody,
): Promise<string> {
  const query = encodeURIComponent(body.text);
  const response = await fetch(
    `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${body.from}&tl=${body.to}&dt=t&q=${query}`,
    {
      headers: {
        "user-agent": "Mozilla/5.0 (compatible; GoodPapers-Admin/1.0)",
      },
    },
  );

  if (!response.ok) {
    throw new Error(`google_gtx translation failed: ${response.status}`);
  }

  const data = (await response.json()) as unknown;

  if (!Array.isArray(data) || !Array.isArray(data[0])) {
    throw new Error("google_gtx returned an unexpected payload");
  }

  let translatedText = "";

  for (const row of data[0] as unknown[]) {
    if (Array.isArray(row) && typeof row[0] === "string") {
      translatedText += row[0];
    }
  }

  return translatedText;
}

export async function POST(request: Request) {
  const provider = readTranslationProvider({
    LOCALE_TRANSLATION_PROVIDER: process.env.LOCALE_TRANSLATION_PROVIDER,
  });
  const body = (await request.json()) as TranslateRequestBody;

  if (body.from === body.to) {
    return Response.json({ text: body.text });
  }

  if (provider !== "google_gtx") {
    return Response.json(
      {
        error: `Unsupported translation provider: ${provider}`,
      },
      { status: 400 },
    );
  }

  try {
    return Response.json({
      text: await translateWithGoogleGtx(body),
    });
  } catch (error) {
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Translation failed",
      },
      { status: 502 },
    );
  }
}
