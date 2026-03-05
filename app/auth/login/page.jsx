"use client"; // Wajib untuk Client Side

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  // Handler untuk Login Credentials (Email/Password)
  const handleCredentialsLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      // Kita panggil signIn credentials bawaan NextAuth
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false, // Supaya kita bisa tangkap error manual
      });

      if (res?.error) {
        // Cek jika error-nya adalah "EMAIL_NOT_VERIFIED" (dari auth.ts)
        if (res.error.includes("EMAIL_NOT_VERIFIED")) {
          router.push(`/auth/verify?email=${encodeURIComponent(email)}`);
        } else {
          setError("Email atau password salah");
        }
      } else {
        // Login Berhasil
        router.push("/");
        router.refresh();
      }
    } catch {
      setError("Terjadi kesalahan sistem");
    } finally {
      setLoading(false);
    }
  };

  // Handler untuk Google Login
  const handleGoogleLogin = async () => {
    await signIn("google", { callbackUrl: "/" });
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-blue-50">
      <div className="w-64 h-3/4 rounded-lg shadow-lg flex flex-col p-4 bg-white">
        <div className="flex justify-center">
          <p className="text-blue-400 text-3xl font-bold">Rulshop</p>
        </div>

        <p className="text-blue-400 text-xl font-bold mt-4">Masuk</p>
        {error && (
          <div className="bg-red-50 text-red-500 text-xs p-3 rounded-lg mb-4 border border-red-100 text-center font-medium">
            ⚠️ {error}
          </div>
        )}
        <form
          onSubmit={handleCredentialsLogin}
          className="flex flex-col gap-3 mt-4"
        >
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="p-2 border-2 border-blue-400 rounded-md"
          />

          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="Password"
              className="p-2 border-2 border-blue-400 rounded-md w-full text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-2 text-xs text-blue-500"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="p-2 bg-blue-400 text-white rounded-md hover:bg-blue-500 disabled:bg-gray-300"
          >
            {loading ? "Proses..." : "Masuk"}
          </button>
        </form>

        <div className="my-4 text-center text-sm text-gray-400">atau</div>

        {/* GOOGLE LOGIN */}
        <button
          onClick={handleGoogleLogin}
          type="button"
          className="p-2 border border-blue-400 rounded-md text-blue-500 hover:bg-blue-50 w-full"
        >
          Masuk dengan Google
        </button>

        <p className="text-blue-400 text-sm mt-4">
          Belum punya akun?{" "}
          <a href="/auth/daftar" className="text-blue-500">
            Daftar
          </a>
        </p>
      </div>
    </div>
  );
}
