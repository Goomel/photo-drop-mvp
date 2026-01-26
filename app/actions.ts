"use server";

import { prisma } from "@/lib/prisma";

export async function createAlbum({ slug, title }: { slug: string; title: string }) {
  let uniqueSlug = slug;
  let count = 1;

  while (await prisma.album.findUnique({ where: { slug: uniqueSlug } })) {
    uniqueSlug = `${slug}-${count}`;
    count++;
  }

  return prisma.album.create({
    data: {
      slug: uniqueSlug,
      title,
      eventDate: new Date(),
      uploadUntil: new Date(),
      viewUntil: new Date(),
    },
  });
}

export async function addPhotosToAlbum({
  albumSlug,
  photosData,
}: {
  albumSlug: string;
  photosData: { name: string; s3Key: string }[];
}) {
  try {
    const album = await prisma.album.findUnique({ where: { slug: albumSlug } });

    if (!album) {
      throw new Error("Album not found");
    }
    return await prisma.photo.createMany({
      data: photosData.map((photo) => ({
        albumId: album.id,
        photoName: photo.name,
        s3Key: photo.s3Key,
      })),
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}
