import { NextRequest, NextResponse } from "next/server";
import { cloudinary } from "@/app/lib/cloudinary.config";
import { UploadApiResponse, UploadApiErrorResponse } from "cloudinary";
import { getToken } from "next-auth/jwt";
import slugify from "slugify";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

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

    console.log("rawFolderRoot: ", rawFolderRoot);
    console.log("rawFolderName: ", rawFolderName);
    if (!rawFolderRoot || !rawFolderName) {
      return NextResponse.json(
        { error: "folderRoot and folderName are required" },
        { status: 400 },
      );
    }

    if (!file) {
      return NextResponse.json({ error: "File missing" }, { status: 400 });
    }

    const fileBuffer = await file.arrayBuffer();

    const mimeType = file.type;
    const encoding = "base64";
    const base64Data = Buffer.from(fileBuffer).toString("base64");

    const fileUri = "data:" + mimeType + ";" + encoding + "," + base64Data;

    const folderRoot = slugify(rawFolderRoot, { lower: true, strict: true });
    const folderName = slugify(rawFolderName, { lower: true, strict: true });

    const folderPath = `${folderRoot}/${folderName}`;

    const res = await uploadToCloudinary(fileUri, file.name, folderPath);

    if (res.success && res.result) {
      return NextResponse.json({
        message: "success",
        imgUrl: res.result.secure_url,
      });
    } else
      return NextResponse.json({
        message: "failure",
      });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Something went wrong. Please try again later",
        error: error,
      },
      { status: 500 },
    );
  }
}
