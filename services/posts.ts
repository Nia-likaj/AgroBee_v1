import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
  getDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export type PostStatus = "draft" | "pending" | "published";
export type AuthorRole = "farmer" | "agronomist" | "specialist" | "admin";

export type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  topic: string;
  status: PostStatus;
  authorId: string;
  authorName: string;
  authorRole: AuthorRole;
  createdAt?: any;
  publishedAt?: any;
};

const COL = "posts";

function mapPost(id: string, data: any): Post {
  return {
    id,
    title: data?.title ?? "",
    slug: data?.slug ?? id,
    excerpt: data?.excerpt ?? "",
    content: data?.content ?? "",
    coverImage: data?.coverImage,
    topic: data?.topic ?? "General",
    status: (data?.status ?? "draft") as PostStatus,
    authorId: data?.authorId ?? "",
    authorName: data?.authorName ?? "—",
    authorRole: (data?.authorRole ?? "farmer") as AuthorRole,
    createdAt: data?.createdAt,
    publishedAt: data?.publishedAt,
  };
}

export async function getPublishedPosts(max = 30): Promise<Post[]> {
  const qy = query(
    collection(db, COL),
    where("status", "==", "published"),
    orderBy("publishedAt", "desc"),
    limit(max)
  );
  const snap = await getDocs(qy);
  return snap.docs.map((d) => mapPost(d.id, d.data()));
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const qy = query(collection(db, COL), where("slug", "==", slug), limit(1));
  const snap = await getDocs(qy);
  if (!snap.empty) {
    const d = snap.docs[0];
    return mapPost(d.id, d.data());
  }

  const ref = doc(db, COL, slug);
  const byId = await getDoc(ref);
  if (!byId.exists()) return null;
  return mapPost(byId.id, byId.data());
}

/** Admin use: list all posts regardless status */
export async function getAllPostsAdmin(max = 100): Promise<Post[]> {
  const qy = query(collection(db, COL), orderBy("createdAt", "desc"), limit(max));
  const snap = await getDocs(qy);
  return snap.docs.map((d) => mapPost(d.id, d.data()));
}
