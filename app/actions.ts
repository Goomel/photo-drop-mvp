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
