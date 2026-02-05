export type Farm = {
  id: string;
  name: string;
  slug: string;
  location: { qarku: string; qyteti: string };
  category: string;
  isFeatured: boolean;
  rating: number;
  coverImage?: string; // later -> Firebase Storage / Next Image
  tags?: string[];
};

export type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  authorName: string;
  authorRole: "farmer" | "agronomist" | "specialist";
  topic: string;
  publishedAt: string; // ISO string
};

export const demoFarms: Farm[] = [
  {
    id: "f1",
    name: "Ferma e Gjelbër",
    slug: "ferma-e-gjelber",
    location: { qarku: "Lushnjë", qyteti: "Lushnjë" },
    category: "Perime",
    isFeatured: true,
    rating: 4.8,
    tags: ["Sera", "Perime sezonale"],
  },
  {
    id: "f2",
    name: "Bletaria Arden",
    slug: "bletaria-arden",
    location: { qarku: "Korçë", qyteti: "Korçë" },
    category: "Mjaltë",
    isFeatured: true,
    rating: 4.7,
    tags: ["Mjaltë", "Propolis"],
  },
  {
    id: "f3",
    name: "Ullishtat e Jugut",
    slug: "ullishtat-e-jugut",
    location: { qarku: "Vlorë", qyteti: "Himarë" },
    category: "Vaj ulliri",
    isFeatured: false,
    rating: 4.5,
    tags: ["Extra virgin", "Cold-pressed"],
  },
  {
    id: "f4",
    name: "Bio Herbs Albania",
    slug: "bio-herbs-albania",
    location: { qarku: "Elbasan", qyteti: "Elbasan" },
    category: "Bimë mjekësore",
    isFeatured: false,
    rating: 4.6,
    tags: ["Çajra", "BIO"],
  },
];

export const demoPosts: Post[] = [
  {
    id: "p1",
    title: "Si të rrisësh rendimentin në sera me menaxhim të thjeshtë",
    slug: "rendimenti-ne-sera-menaxhim-i-thjeshte",
    excerpt:
      "Një udhëzues praktik për ujitje, ajrosje, ushqim të bimës dhe kontroll të sëmundjeve në sera.",
    content:
      "Ky është përmbajtje demo. Më pas e lidhim me Firestore dhe editor të thjeshtë.\n\nPikat kryesore:\n- Monitorimi i temperaturës\n- Skedulimi i ujitjes\n- Ushqimi i bimës sipas fazës\n- Higjiena dhe parandalimi",
    authorName: "Arben K.",
    authorRole: "agronomist",
    topic: "Sera",
    publishedAt: "2026-01-01T09:00:00.000Z",
  },
  {
    id: "p2",
    title: "Checklist për aplikim në AZHBR: çfarë dokumentesh duhen",
    slug: "checklist-aplikim-azhbr-dokumente",
    excerpt:
      "Lista bazë e dokumenteve dhe këshilla për të shmangur gabimet më të zakonshme gjatë aplikimit.",
    content:
      "Përmbajtje demo.\n\n- NIPT / dokument identifikimi\n- Dëshmi pronësie / qira\n- Preventiv / oferta\n- Plan-biznes (kur kërkohet)\n- Afatet dhe formatet",
    authorName: "Nia Hysnie",
    authorRole: "specialist",
    topic: "Grante",
    publishedAt: "2025-12-28T10:30:00.000Z",
  },
];
