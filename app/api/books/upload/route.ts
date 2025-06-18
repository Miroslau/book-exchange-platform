import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";
import { cloudinary } from "@/app/lib/cloudinary.config";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import slugify from "slugify";
import { checkImageExistsByPhash } from "@/app/lib/imageUtils";

type UploadResponse =
  | { success: true; result?: UploadApiResponse }
  | { success: false; error: UploadApiErrorResponse };

const uploadToCloudinary = (
  fileUri: string,
  fileName: string,
  folderPath: string,
): Promise<UploadResponse> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload(fileUri, {
        invalidate: true,
        resource_type: "auto",
        filename_override: fileName,
        folder: folderPath,
        use_filename: true,
        unique_filename: true,
        overwrite: false,
        phash: true,
      })
      .then((result) => {
        resolve({ success: true, result });
      })
      .catch((error) => {
        reject({ success: false, error });
      });
  });
};

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const rawFolderRoot = formData.get("folderRoot") as string;
    const rawFolderName = formData.get("folderName") as string;
    const allowDuplicates = formData.get("allowDuplicates") === "true";

    if (!rawFolderRoot || !rawFolderName) {
      return NextResponse.json(
        { error: "folderRoot and folderName are required" },
        { status: 400 },
      );
    }

    if (!file) {
      return NextResponse.json({ error: "File missing" }, { status: 400 });
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.",
        },
        { status: 400 },
      );
    }

    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10MB." },
        { status: 400 },
      );
    }

    const fileBuffer = await file.arrayBuffer();
    const mimeType = file.type;
    const encoding = "base64";
    const base64Data = Buffer.from(fileBuffer).toString("base64");
    const fileUri = "data:" + mimeType + ";" + encoding + "," + base64Data;

    const folderRoot = slugify(rawFolderRoot, { lower: true, strict: true });
    const folderName = slugify(rawFolderName, { lower: true, strict: true });
    const folderPath = `${folderRoot}/${folderName}`;

    const timestamp = Date.now();
    const fileExtension = file.name.split(".").pop();
    const uniqueFileName = `${slugify(file.name.replace(/\.[^/.]+$/, ""), { lower: true, strict: true })}_${timestamp}.${fileExtension}`;

    // Загружаем в Cloudinary
    const uploadResult = await uploadToCloudinary(
      fileUri,
      uniqueFileName,
      folderPath,
    );

    if (!uploadResult.success || !uploadResult.result) {
      return NextResponse.json(
        {
          message: "failure",
          error: "Failed to upload to Cloudinary",
        },
        { status: 500 },
      );
    }

    const phash = uploadResult.result.phash;

    if (phash && !allowDuplicates) {
      const existingImage = await checkImageExistsByPhash(phash);

      if (
        existingImage.exists &&
        existingImage.image &&
        existingImage.bookInfo
      ) {
        try {
          await cloudinary.uploader.destroy(uploadResult.result.public_id);
        } catch (error) {
          console.error("Error deleting duplicate upload:", error);
        }

        return NextResponse.json(
          {
            message: "duplicate",
            imgUrl: existingImage.image.url,
            existingBookTitle: existingImage.bookInfo.title,
            existingBookAuthor: existingImage.bookInfo.author,
            existingBookId: existingImage.bookInfo.id,
            warning: "This image already exists in the system",
          },
          { status: 200 },
        );
      }
    }
    return NextResponse.json({
      message: "success",
      imgUrl: uploadResult.result.secure_url,
      publicId: uploadResult.result.public_id,
      phash: phash, // Возвращаем phash для сохранения в БД
      originalFileName: file.name,
      uploadedFileName: uniqueFileName,
      width: uploadResult.result.width,
      height: uploadResult.result.height,
      format: uploadResult.result.format,
      bytes: uploadResult.result.bytes,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        message: "Something went wrong. Please try again later",
        error:
          process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 500 },
    );
  }
}
