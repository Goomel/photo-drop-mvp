import { getPhotos } from "./actions";
import PhotoManager from "../components/PhotoManager";

export default async function Home() {
  // Fetch initial data once on the server
  const initialPhotos = await getPhotos(process.env.TEST_ALBUM_ID!);

  return (
    <div className="flex min-h-screen items-center justify-center bg-darkGray-400 py-10 lg:py-20">
      <main className="w-full container mx-auto px-5 lg:px-10">
        <PhotoManager initialPhotos={initialPhotos} />
      </main>
    </div>
  );
}
