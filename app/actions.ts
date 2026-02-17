"use server";

import { prisma } from "@/lib/prisma";
import { s3Client } from "@/lib/s3";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";

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

export async function addPhotoRecordsToAlbum({ photosData }: { photosData: { name: string; s3Key: string }[] }) {
  const albumId = process.env.TEST_ALBUM_ID;

  try {
    const album = await prisma.album.findUnique({ where: { id: albumId } });
    if (!album) throw new Error("Album not found");

    const savedPhotos = await Promise.all(
      photosData.map((photo) =>
        prisma.photo.create({
          data: {
            albumId: album.id,
            photoName: photo.name,
            s3Key: photo.s3Key,
          },
        })
      )
    );

    // 2. Generate signed URLs for the newly created photos
    const photosWithUrls = await Promise.all(
      savedPhotos.map(async (photo) => {
        const command = new GetObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: photo.s3Key,
        });
        const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

        return {
          id: photo.id,
          photoName: photo.photoName,
          url,
        };
      })
    );

    // Return the new photo objects so the client can append them to the local state
    return photosWithUrls;
  } catch (error) {
    console.error("Database error during photo creation:", error);
    throw error;
  }
}

export async function generateUploadUrls(files: { name: string; type: string }[]) {
  const urls = await Promise.all(
    files.map(async (file) => {
      // For testing purpose we use always one folder
      const s3Key = `${process.env.TEST_ALBUM_ID}/${uuidv4()}__${file.name}`;

      const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: s3Key,
        ContentType: file.type,
      });

      const url = await getSignedUrl(s3Client, command, { expiresIn: 300 });

      return { url, s3Key, originalName: file.name };
    })
  );

  return urls;
}

export async function getPhotos(albumId: string) {
  const album = await prisma.album.findUnique({
    where: { id: albumId },
    include: { photos: true },
  });

  if (!album) {
    return [];
  }

  const photosWithUrls = await Promise.all(
    album.photos.map(async (photo) => {
      const command = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: photo.s3Key,
      });
      const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
      return { id: photo.id, photoName: photo.photoName, url };
    })
  );

  return photosWithUrls;
}
