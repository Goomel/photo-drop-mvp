"use client";

import { useState } from "react";
import FileUploader from "./FileUploader";
import Gallery from "./Gallery";

type Photo = {
  id: string;
  url: string;
  photoName: string;
};

export default function PhotoManager({ initialPhotos }: { initialPhotos: Photo[] }) {
  // Local state initialized with server-side data
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);

  // call when FileUploader finishes its job
  const handleNewPhotos = (newPhotos: Photo[]) => {
    setPhotos((prev) => [...newPhotos, ...prev]);
  };

  return (
    <div className="w-full">
      <FileUploader onUploadComplete={handleNewPhotos} />
      <h2 className="text-2xl font-bold text-white mt-12 mb-6">Photos</h2>
      <Gallery photos={photos} />
    </div>
  );
}
