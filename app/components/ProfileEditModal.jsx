"use client";

import DragDropUploader from "./DragDropUploader";
import { useState } from "react";

export default function ProfileEditModal({ user, setUser, onClose }) {
  const [nama, setNama] = useState(user.nama);
  const [bio, setBio] = useState(user.bio);

  const saveChanges = () => {
    const users = JSON.parse(localStorage.getItem("userDB")) || [];
    const updated = users.map((u) =>
      u.username === user.username ? { ...u, nama, bio } : u
    );

    localStorage.setItem("userDB", JSON.stringify(updated));
    setUser({ ...user, nama, bio });

    onClose(); // tutup modal
  };

  const updateFoto = (img) => {
    const users = JSON.parse(localStorage.getItem("userDB")) || [];
    const updated = users.map((u) =>
      u.username === user.username ? { ...u, foto: img } : u
    );

    localStorage.setItem("userDB", JSON.stringify(updated));
    setUser((prev) => ({ ...prev, foto: img }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center backdrop-blur-sm">
      <div className="bg-white p-6 rounded-xl w-[400px] space-y-4">
        <h2 className="text-xl font-semibold">Edit Profile</h2>

        {/* Upload Foto */}
        <div>
          <p className="font-semibold mb-1">Foto Profil</p>
          <DragDropUploader onUpload={updateFoto} />
        </div>

        {/* Nama */}
        <div>
          <p className="font-semibold mb-1">Nama</p>
          <input
            className="border rounded w-full p-2"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
          />
        </div>

        {/* Bio */}
        <div>
          <p className="font-semibold mb-1">Bio</p>
          <textarea
            className="border rounded w-full p-2"
            rows="3"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-between">
          <button className="px-4 py-2 bg-gray-300 rounded" onClick={onClose}>
            Batal
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={saveChanges}
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
