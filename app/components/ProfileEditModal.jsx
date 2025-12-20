"use client";

import DragDropUploader from "./DragDropUploader";
import { useState } from "react";

export default function ProfileEditModal({
  user,
  setUser,
  onClose,
  currentUser,
  setCurrentUser,
}) {
  console.log("onclose", onClose);

  const [nama, setNama] = useState(user?.nama || "");
  const [email, setEmail] = useState(user?.email || "");
  const [telepon, setTelepon] = useState(user?.telepon || "");
  const [tanggalLahir, setTanggalLahir] = useState(user?.tanggalLahir || "");
  const [gender, setGender] = useState(user?.gender || "Laki-laki");
  const [foto, setFoto] = useState(user?.foto || "");
  const [password, setPassword] = useState(user?.password || "");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =====================
  //      SIMPAN DATA
  // =====================
  const saveChanges = () => {
    const users = JSON.parse(localStorage.getItem("userDB")) || [];

    const emailExists = users.find(
      (u) => u.email === email && u.username !== user.username
    );
    if (emailExists) {
      setError("Email sudah terdaftar oleh pengguna lain.");
      setSuccess("");
      return;
    }
    const updatedUsers = users.map((u) =>
      u.username === user.username
        ? {
            ...u,
            nama,
            email,
            telepon,
            tanggalLahir,
            gender,
          }
        : u
    );

    localStorage.setItem("userDB", JSON.stringify(updatedUsers));
    const updatedUser = updatedUsers.find((u) => u.username === user.username);

    setUser(updatedUser);

    const updateLoginSession =
      currentUser.username === user.username
        ? {
            ...currentUser,
            foto: setFoto(foto),
            nama,
            email,
            telepon,
            tanggalLahir,
            gender,
            password: setPassword(password),
          }
        : currentUser;
    localStorage.setItem("loginSessionDB", JSON.stringify(updateLoginSession));
    setCurrentUser(updateLoginSession);

    setError("");
    setSuccess("Profil berhasil diperbarui!");

    setTimeout(() => {
      onClose();
    }, 1500); // Tutup modal setelah 1.5 detik
  };

  // =====================
  //   UPDATE FOTO SAJA
  // =====================
  const updateFoto = (file) => {
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      const img = reader.result;
      const users = JSON.parse(localStorage.getItem("userDB")) || [];

      const updatedUsers = users.map((u) =>
        u.username === user.username ? { ...u, foto: img } : u
      );

      localStorage.setItem("userDB", JSON.stringify(updatedUsers));

      const updatedUser = updatedUsers.find(
        (u) => u.username === user.username
      );

      setUser(updatedUser);
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex justify-center items-center backdrop-blur-sm">
      <div className="bg-white p-2 rounded-xl shadow-2xl w-full h-fit max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          Edit Profile
        </h2>

        {/* Upload Foto */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Foto Profil
          </label>
          <DragDropUploader onUpload={updateFoto} />
        </div>

        {/* Form Fields */}
        <div className="space-y-1">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nama
            </label>
            <input
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Nama Lengkap"
              value={nama}
              type="text"
              onChange={(e) => setNama(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="email@contoh.com"
              value={email}
              type="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Telepon
            </label>
            <input
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="08xxxxxxxxxx"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={telepon}
              onChange={(e) => {
                const onlyNumber = e.target.value.replace(/\D/g, "");
                setTelepon(onlyNumber);
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tanggal Lahir
              </label>
              <input
                type="date"
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={tanggalLahir}
                onChange={(e) => setTanggalLahir(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Gender
              </label>
              <select
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && <p className="text-sm text-green-600">{success}</p>}

        <div className="flex justify-end gap-4 pt-4">
          <button
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            onClick={onClose}
          >
            Batal
          </button>
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            onClick={saveChanges}
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
