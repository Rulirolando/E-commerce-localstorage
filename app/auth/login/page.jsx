"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (user.email === "" || user.password === "") {
      alert("Semua field harus diisi");
      return;
    }
    const UserData = localStorage.getItem("userDB");
    const users = UserData ? JSON.parse(UserData) : [];
    const userExists = users.find((p) => p.email === user.email);
    if (!userExists) return alert("Email belum terdaftar");
    if (userExists.password !== user.password) return alert("Password salah");

    // Login berhasil, simpan login session
    localStorage.setItem("loginSessionDB", JSON.stringify(userExists));

    alert("Login berhasil");
    router.push("/");
  };

  useEffect(() => {
    try {
      const loginSession = localStorage.getItem("loginSessionDB");
      if (loginSession) {
        window.location.href = "/";
      }
    } catch {
    } finally {
      setLoading(true);
    }
  }, []);

  if (!loading) return <p>Loading...</p>;
  return (
    <>
      <div className=" w-full h-screen flex justify-center items-center bg-blue-50">
        <div className="w-64 h-3/4 border-blue-50 rounded-lg shadow-blue-950 shadow-lg flex flex-col p-2">
          <div className="flex justify-center items-center">
            <p className="text-blue-400 text-3xl font-bold">Rulshop</p>
          </div>

          <p className="text-blue-400 text-xl font-bold mt-4">Masuk</p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-4">
            <input
              type="email"
              placeholder="Email"
              className="p-2 border-2 border-blue-400 rounded-md"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="p-2 border-2 border-blue-400 rounded-md w-full"
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-2 text-sm text-blue-500"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <button
              type="submit"
              className="p-2 bg-blue-400 text-white rounded-md cursor-pointer hover:bg-blue-500"
            >
              Masuk
            </button>
          </form>
          <p className="text-blue-400 text-sm mt-4">
            Belum punya akun?{" "}
            <a href="/auth/daftar" className="text-blue-500 cursor-pointer">
              Daftar
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
