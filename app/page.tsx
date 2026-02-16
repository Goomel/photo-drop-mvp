import FileUploader from "../components/FileUploader";
import Gallery from "../components/Gallery";
import { getPhotos } from "./actions";

export default async function Home() {
  const photos = await getPhotos(process.env.TEST_ALBUM_ID!);

  return (
    <div className="flex min-h-screen items-center justify-center bg-darkGray-400 font-sans py-10 lg:py-20">
      <main className="w-full container mx-auto px-5 lg:px-10 ">
        <FileUploader />
        <h2 className="text-2xl font-bold text-white mt-12 mb-6">Photos</h2>
        <Gallery photos={photos} />
      </main>
    </div>
  );
}
