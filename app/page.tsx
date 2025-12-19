import FileUploader from "./components/FileUploader";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-darkGray-400 font-sans py-10 lg:py-20">
      <main className="w-full container mx-auto px-5 lg:px-10 ">
        <FileUploader/>
      </main>
    </div>
  );
}
