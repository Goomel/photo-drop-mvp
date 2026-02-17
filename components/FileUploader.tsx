"use client";

import { useState } from "react";
import { addPhotoRecordsToAlbum, generateUploadUrls } from "@/app/actions";
import Dropzone from "./Dropzone";

interface FileUploaderProps {
  onUploadComplete: (newPhotos: any[]) => void;
}

export default function FileUploader({ onUploadComplete }: FileUploaderProps) {
  const [status, setStatus] = useState<"idle" | "uploading">("idle");

  const uploadFiles = async (files: File[]) => {
    if (files.length === 0) return;

    setStatus("uploading");

    try {
      const fileInfo = files.map((f) => ({ name: f.name, type: f.type }));
      const presignedData = await generateUploadUrls(fileInfo);

      const uploadPromises = files.map(async (file, index) => {
        const { url, s3Key } = presignedData[index];
        await fetch(url, { method: "PUT", body: file, headers: { "Content-Type": file.type } });
        return { name: file.name, s3Key };
      });

      const uploadedPhotos = await Promise.all(uploadPromises);

      // Call server action and get the full photo objects (with IDs and URLs)
      const savedPhotos = await addPhotoRecordsToAlbum({ photosData: uploadedPhotos });

      // Update the parent's state directly
      onUploadComplete(savedPhotos);
    } catch (error) {
      console.error("Upload process failed:", error);
    } finally {
      setStatus("idle");
    }
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col items-center gap-10">
      <Dropzone handleUpload={uploadFiles} />
      {status === "uploading" && <p className="text-blue-400">Processing images...</p>}
    </div>
  );
}
