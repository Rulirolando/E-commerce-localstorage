// app/blog/[id]/page.jsx

const allPosts = [
  {
    id: "1",
    title: "Postingan Pertama",
    content: "Isi dari postingan pertama.",
  },
  { id: "2", title: "Postingan Kedua", content: "Isi dari postingan kedua." },
  { id: "3", title: "Postingan Ketiga", content: "Isi dari postingan ketiga." },
];

// Ubah komponen menjadi async dan gunakan `await`
export default async function BlogPostPage({ params }) {
  // Gunakan `await` untuk mendapatkan objek `params` yang sebenarnya
  const resolvedParams = await params;

  // Mencari postingan yang cocok dengan id dari URL
  const post = allPosts.find((p) => p.id === resolvedParams.id);

  // Menangani kasus jika postingan tidak ditemukan
  if (!post) {
    return <div>Postingan tidak ditemukan!</div>;
  }

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </div>
  );
}
