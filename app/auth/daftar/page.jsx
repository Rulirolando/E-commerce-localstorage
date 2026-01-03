"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

export default function Daftar() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      user.username === "" ||
      user.email === "" ||
      user.password === "" ||
      user.confirmPassword === ""
    ) {
      alert("Semua field harus diisi");
      return;
    }

    const UserData = localStorage.getItem("userDB");
    const users = UserData ? JSON.parse(UserData) : [];

    const usernameExists = users.find((p) => p.username === user.username);
    if (usernameExists) return alert("Username sudah terdaftar");

    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(user.email)) {
      alert("Email tidak valid");
      return;
    }

    const emailExists = users.find((p) => p.email === user.email);
    if (emailExists) return alert("Email sudah terdaftar");

    if (user.password !== user.confirmPassword) {
      alert("Password tidak sama");
      return;
    }
    const newUser = {
      id: uuidv4(),
      username: user.username,
      email: user.email,
      password: user.password,
      foto: "",
    };

    const update = users ? [...users, newUser] : [newUser];

    localStorage.setItem("userDB", JSON.stringify(update));
    alert("Selamat akun anda berhasil dibuat");
    setUser({ username: "", email: "", password: "", confirmPassword: "" });
    //console.log("alluser", allUser);
    router.push("/products");
  };

  useEffect(() => {
    try {
      const data = localStorage.getItem("userDB");
      console.log(data);
    } catch {
    } finally {
      setLoading(true);
    }
  }, []);

  if (!loading) {
    return (
      <div className=" w-full h-screen flex justify-center items-center bg-blue-50">
        <div className="w-64 h-3/4 border-blue-50 rounded-lg shadow-blue-950 shadow-lg flex flex-col p-2">
          <div className="flex justify-center items-center">
            <p className="text-blue-400 text-3xl font-bold">Rulshop</p>
          </div>

          <p className="text-blue-400 text-xl font-bold mt-4">Daftar</p>
          <p className="text-blue-400 text-xl font-bold mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className=" w-full h-screen flex justify-center items-center bg-blue-50">
        <div className="w-64 h-3/4 border-blue-50 rounded-lg shadow-blue-950 shadow-lg flex flex-col p-2">
          <div className="flex justify-center items-center">
            <p className="text-blue-400 text-3xl font-bold">Rulshop</p>
          </div>

          <p className="text-blue-400 text-xl font-bold mt-4">Daftar</p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-4">
            <input
              type="text"
              placeholder="Username"
              className="p-2 border-2 border-blue-400 rounded-md"
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
            />
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

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Konfirmasi Password"
                className="p-2 border-2 border-blue-400 rounded-md w-full"
                value={user.confirmPassword}
                onChange={(e) =>
                  setUser({ ...user, confirmPassword: e.target.value })
                }
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2 top-2 text-sm text-blue-500"
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>

            <button
              type="submit"
              className="p-2 bg-blue-400 text-white rounded-md cursor-pointer hover:bg-blue-500"
            >
              Daftar
            </button>
          </form>

          <p className="text-blue-400 text-sm mt-4">
            Sudah punya akun?{" "}
            <a href="/auth/login" className="text-blue-500 cursor-pointer">
              Masuk
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
