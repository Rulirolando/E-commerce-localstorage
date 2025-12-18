"use client";

import { useState } from "react";

export default function DragDropUploader({ onUpload }) {
  const [dragging, setDragging] = useState(false);

  const handleFile = (file) => {
    if (!file || !(file instanceof Blob)) {
      console.warn("File tidak valid:", file);
      return;
    }

    onUpload(file);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);

        const file = e.dataTransfer?.files?.[0];
        if (!file) return;

        handleFile(file);
      }}
      className={`border-2 border-dashed w-full h-1/4 flex flex-col justify-center items-center rounded-xl text-center cursor-pointer
        ${dragging ? "bg-blue-100" : "bg-gray-100"}`}
    >
      <p className="text-gray-700">
        Drag & Drop untuk upload foto
        <br />
        atau klik area ini
      </p>

      <input
        type="file"
        accept="image/*"
        className="hidden"
        id="fileInput"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          handleFile(file);
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
