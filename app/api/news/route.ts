import { NextResponse } from "next/server";

type NewsItem = {
  id: string;
  title: string;
  url: string;
  source: "MBZHR";
  publishedAt?: string;
  excerpt?: string;
};

// Cache për 30 minuta (Next.js ISR)
export const revalidate = 1800;

export async function GET() {
  try {
    // Tre burime zyrtare nga Ministria e Bujqësisë
    const sources = [
      "https://www.bujqesia.gov.al/category/lajme-kryesore/",
      "https://www.bujqesia.gov.al/category/njoftime-per-shtyp/",
      "https://www.bujqesia.gov.al/category/njoftime/",
    ];

    const allItems: NewsItem[] = [];

    // Fetch nga të gjitha burimet në paralel
    const results = await Promise.allSettled(
      sources.map(async (sourceUrl) => {
        const res = await fetch(sourceUrl, {
          next: { revalidate: 60 * 30 },
          headers: { 
            "User-Agent": "AgroBeeBot/1.0 (+https://agrobee.al)",
            "Accept": "text/html",
          },
        });

        if (!res.ok) {
          console.error(`Failed to fetch from ${sourceUrl}: ${res.status}`);
          return [];
        }

        const html = await res.text();
        return parseNewsItems(html);
      })
    );

    // Kombinon rezultatet
    results.forEach((result) => {
      if (result.status === "fulfilled") {
        allItems.push(...result.value);
      }
    });

    // Heq duplikatet dhe merr 12 më të fundit
    const uniqueItems = Array.from(
      new Map(allItems.map((item) => [item.id, item])).values()
    ).slice(0, 12);

    return NextResponse.json({ items: uniqueItems });
  } catch (error: any) {
    console.error("Error fetching news:", error);
    return NextResponse.json(
      { items: [] as NewsItem[], error: "Failed to fetch news" },
      { status: 200 }
    );
  }
}

function parseNewsItems(html: string): NewsItem[] {
  const items: NewsItem[] = [];
  
  // Regex për entry-title (struktura standarde WordPress)
  const linkRe = /<h2[^>]*class="[^"]*entry-title[^"]*"[^>]*>[\s\S]*?<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
  let match: RegExpExecArray | null;

  while ((match = linkRe.exec(html)) && items.length < 8) {
    const url = match[1];
    const rawTitle = match[2];
    
    // Pastro HTML tags dhe entities nga titulli
    const title = stripTags(rawTitle).trim();
    
    // Filtro vetëm linket që janë nga bujqesia.gov.al dhe kanë titull të arsyeshëm
    if (url.includes("bujqesia.gov.al") && title.length > 15 && !url.includes("#")) {
      items.push({
        id: url,
        title,
        url,
        source: "MBZHR",
        excerpt: "Klikoni për të lexuar përmbajtjen e plotë në faqen zyrtare të Ministrisë së Bujqësisë.",
      });
    }
  }

  return items;
}

function stripTags(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))
    .trim();
}
