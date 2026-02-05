import Link from "next/link";
import type { Post } from "../constants/demoData";

function roleLabel(role: Post["authorRole"]) {
  if (role === "farmer") return "Fermer";
  if (role === "agronomist") return "Agronom";
  return "Specialist";
}

export default function FeedItem({ post }: { post: Post }) {
  return (
    <div className="glass rounded-3xl p-5">
      <div className="flex flex-wrap gap-2">
        <span className="inline-flex items-center rounded-full border bg-white/70 px-3 py-1 text-xs font-medium text-black/70">
          {post.topic}
        </span>
        <span className="inline-flex items-center rounded-full border bg-white/70 px-3 py-1 text-xs font-medium text-black/70">
          {roleLabel(post.authorRole)}
        </span>
      </div>

      <h4 className="text-base font-semibold text-(--primary-dark)">
        {post.title}
      </h4>
      <p className="mt-2 text-sm text-black/70 line-clamp-2">{post.excerpt}</p>

      <div className="mt-4 flex items-center justify-between text-xs text-black/55">
        <span>{post.authorName}</span>
        <span>{new Date(post.publishedAt).toLocaleDateString("sq-AL")}</span>
      </div>

      <button
        className="mt-4 inline-flex items-center justify-center rounded-xl border bg-white/70 px-4 py-2 text-sm font-semibold hover:bg-white transition"
      >
        Lexo
      </button>
    </div>
  );
}
