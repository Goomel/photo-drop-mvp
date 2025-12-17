'use client';

import Dropzone from "./components/Dropzone";
import PhotoGrid from "./components/PhotoGrid";
import { useState } from "react";

export default function Home() {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-darkGray-400 font-sans py-10 lg:py-20">
      <main className="w-full container mx-auto px-5 lg:px-10 ">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-16 lg:gap-20">
        <Dropzone setFiles={setFiles}/>
        <PhotoGrid files={files}/>
        </div>
      </main>
    </div>
  );
}
