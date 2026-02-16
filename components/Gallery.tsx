"use client";

type Photo = {
  id: string;
  url: string;
  photoName: string;
};

export default function Gallery({ photos }: { photos: Photo[] }) {
  if (photos.length === 0) {
    return (
      <div className="text-center text-gray-400 mt-10">
        <p>No photos uploaded yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-10 mt-10">
      {photos.map((photo) => (
        <div key={photo.id} className="relative w-full aspect-square rounded-lg overflow-hidden group">
          <img
            src={photo.url}
            alt={photo.photoName}
            crossOrigin="anonymous"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      ))}
    </div>
  );
}
