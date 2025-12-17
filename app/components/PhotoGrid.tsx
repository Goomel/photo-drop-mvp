'use client';

export default function PhotoGrid({files}: {files: File[]}){
    return(
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-10">
  {files.map((file, index) => {
    const previewUrl = URL.createObjectURL(file);

    return (
      <div
        key={index}
        className="relative w-full aspect-square rounded-lg overflow-hidden"
      >
        <img className="object-cover" key={index} src={previewUrl} alt={file.name} />
      </div>
    );
  })}
</div>

    )
}