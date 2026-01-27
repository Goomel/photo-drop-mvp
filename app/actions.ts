"use server";

import { prisma } from "@/lib/prisma";
import { s3Client } from "@/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
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

export async function getPresignedUrls(files: { name: string; type: string }[]) {
  const urls = await Promise.all(
    files.map(async (file) => {
      const s3Key = `${uuidv4()}-${file.name}`;

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
