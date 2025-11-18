export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <p className="text-xl font-semibold mb-2">Dashboard sedang dimuat...</p>
      <div className="animate-spin h-10 w-10 border-4 border-blue-400 border-t-transparent rounded-full"></div>
    </div>
  );
}
