"use client";

import { useState } from "react";
import type { UploadStatus } from "@/app/types";
import Dropzone from "./Dropzone";
import PhotoGrid from "./PhotoGrid";
import { createAlbum } from "@/app/actions";

export default function FileUploader() {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const uploadFiles = async (files: File[]) => {
    if (files.length === 0) {
      return;
    }

    setFiles(files);
    setStatus("uploading");
    setUploadProgress(0);

    await createAlbum({ slug: "test", title: "test" });
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col items-center gap-16 lg:gap-20">
      <Dropzone handleUpload={uploadFiles} />
      {files.length > 0 && <PhotoGrid files={files} />}
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
