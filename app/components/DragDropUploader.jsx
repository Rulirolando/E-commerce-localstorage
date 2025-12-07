"use client";

import { useState } from "react";

export default function DragDropUploader({ onUpload }) {
  const [dragging, setDragging] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);

    const file = e.dataTransfer.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => onUpload(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={`border-2 border-dashed w-full p-6 rounded-xl text-center cursor-pointer
          ${dragging ? "bg-blue-100" : "bg-gray-100"}`}
    >
      <p className="text-gray-700">
        Drag & Drop untuk upload foto
        <br />
        atau klik area ini
      </p>

      <input
        type="file"
        className="hidden"
        id="fileInput"
        onChange={(e) => {
          const file = e.target.files[0];
          const reader = new FileReader();
          reader.onload = () => onUpload(reader.result);
          reader.readAsDataURL(file);
        }}
      />

      <button
        className="mt-2 px-4 py-2 rounded bg-blue-500 text-white"
        onClick={() => document.getElementById("fileInput").click()}
      >
        Pilih File
      </button>
    </div>
  );
}
