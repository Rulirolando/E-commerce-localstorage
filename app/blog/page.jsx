// app/blog/page.jsx
import Link from "next/link";

// Data statis untuk contoh ini
const allPosts = [
  {
    id: "1",
    title: "Postingan Pertama",
    content: "Isi dari postingan pertama.",
  },
  { id: "2", title: "Postingan Kedua", content: "Isi dari postingan kedua." },
  { id: "3", title: "Postingan Ketiga", content: "Isi dari postingan ketiga." },
];

export default function BlogPage() {
  return (
    <>
      <div>
        <h1>Daftar Postingan Blog</h1>
        <ul>
          {allPosts.map((post) => (
            <li key={post.id}>
              <Link href={`/blog/${post.id}`}>{post.title}</Link>
            </li>
          ))}
        </ul>
      </div>
      <Link href="/dashboard">Kembali ke dashboard</Link>
    </>
  );
}
