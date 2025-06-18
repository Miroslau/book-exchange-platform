import { cloudinary } from "@/app/lib/cloudinary.config";
import { db } from "@/app/lib/db";

export const getPhashFromCloudinary = async (
  publicId: string,
): Promise<string | null> => {
  try {
    const result = await cloudinary.api.resource(publicId, {
      phash: true,
    });
    return result.phash || null;
  } catch (error) {
    console.error("Error getting phash from Cloudinary:", error);
    return null;
  }
};

export const generateImageHash = (publicId: string): Promise<string | null> => {
  return getPhashFromCloudinary(publicId);
};

export const checkImageExistsByPhash = async (phash: string) => {
  try {
    const existingImage = await db.bookImage.findFirst({
      where: {
        hash: phash, // Используем поле hash для хранения phash
      },
      include: {
        book: {
          select: {
            id: true,
            title: true,
            author: true,
          },
        },
      },
    });

    if (existingImage) {
      return {
        exists: true,
        image: existingImage,
        bookInfo: existingImage.book,
      };
    }

    return { exists: false };
  } catch (error) {
    console.error("Error checking image existence by phash:", error);
    return { exists: false };
  }
};

export const extractImageIdFromUrl = (url: string): string => {
  const matches = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/);
  return matches ? matches[1] : url;
};

export const extractPublicIdFromCloudinaryUrl = (
  url: string,
): string | null => {
  try {
    const regex = /\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/;
    const match = url.match(regex);
    return match ? match[1] : null;
  } catch (error) {
    console.error("Error extracting public_id from URL:", error);
    return null;
  }
};

export const createBookImageFolderPath = (bookTitle: string): string => {
  const slugify = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-"); // Replace multiple hyphens with single hyphen

  const folderRoot = "books";
  const folderName = slugify(bookTitle);

  return `${folderRoot}/${folderName}`;
};

export const deleteImageFromCloudinary = async (
  publicId: string,
): Promise<boolean> => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === "ok";
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    return false;
  }
};

export const deleteImagesFromCloudinary = async (
  publicIds: string[],
): Promise<{
  deleted: string[];
  failed: string[];
}> => {
  const results = await Promise.allSettled(
    publicIds.map(async (publicId) => {
      const success = await deleteImageFromCloudinary(publicId);
      return { publicId, success };
    }),
  );

  const deleted: string[] = [];
  const failed: string[] = [];

  results.forEach((result, index) => {
    if (result.status === "fulfilled" && result.value.success) {
      deleted.push(publicIds[index]);
    } else {
      failed.push(publicIds[index]);
    }
  });

  return { deleted, failed };
};

export const deleteFolderFromCloudinary = async (
  folderPath: string,
): Promise<boolean> => {
  try {
    // Сначала получаем все ресурсы в папке
    const resources = await cloudinary.api.resources({
      type: "upload",
      prefix: folderPath,
      max_results: 500,
    });

    if (resources.resources.length > 0) {
      const publicIds = resources.resources.map(
        (resource: any) => resource.public_id,
      );

      // Удаляем все ресурсы
      const deleteResult = await cloudinary.api.delete_resources(publicIds);

      // Удаляем саму папку
      await cloudinary.api.delete_folder(folderPath);

      return Object.keys(deleteResult.deleted).length === publicIds.length;
    }

    return true;
  } catch (error) {
    console.error("Error deleting folder from Cloudinary:", error);
    return false;
  }
};
