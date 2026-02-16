"use client";

import { useState } from "react";
import type { UploadStatus } from "@/app/types";
import Dropzone from "./Dropzone";
import { addPhotoRecordsToAlbum, getPresignedUrls } from "@/app/actions";

export default function FileUploader() {
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const uploadFiles = async (files: File[]) => {
    if (files.length === 0) {
      return;
    }

    setStatus("uploading");
    setUploadProgress(0);

    const fileInfo = files.map((file) => ({ name: file.name, type: file.type }));
    const presignedData = await getPresignedUrls(fileInfo);

    const uploadPromises = files.map(async (file, index) => {
      const { url, s3Key } = presignedData[index];

      await fetch(url, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      return { name: file.name, s3Key };
    });
    const uploadedPhotos = await Promise.all(uploadPromises);
    await addPhotoRecordsToAlbum({ photosData: uploadedPhotos });
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col items-center gap-16 lg:gap-20">
      <Dropzone handleUpload={uploadFiles} />
      {status === "uploading" && (
        <div className="w-full max-w-lg mx-auto">
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
          </div>
        </div>
      )}
    </div>
  );
}
