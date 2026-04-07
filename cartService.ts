// app/routes/api.upload.tsx
// Handles multipart file uploads from the configurator

import {
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
  json,
  type ActionFunctionArgs,
} from "@remix-run/node";
import { uploadFile, uploadPDF } from "~/services/uploadService.server";
import { v4 as uuidv4 } from "uuid";
import type { UploadedFile, FileWarning } from "~/types";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

const ALLOWED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "application/pdf",
];

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const uploadHandler = unstable_createMemoryUploadHandler({
      maxPartSize: MAX_FILE_SIZE,
    });

    const formData = await unstable_parseMultipartFormData(
      request,
      uploadHandler
    );

    const file = formData.get("file") as File | null;

    if (!file) {
      return json({ error: "No file provided" }, { status: 400 });
    }

    // Validate mime type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return json(
        {
          error: `File type ${file.type} not supported. Use PNG, JPG, WEBP or PDF.`,
        },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return json(
        { error: "File too large. Maximum size is 50MB." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    let uploadResult;
    if (file.type === "application/pdf") {
      uploadResult = await uploadPDF(buffer, file.name);
    } else {
      uploadResult = await uploadFile(buffer, file.name, file.type);
    }

    // Generate warnings
    const warnings: FileWarning[] = [];

    if (uploadResult.dpi < 150) {
      warnings.push({
        type: "low_dpi",
        message: `Lage resolutie (${uploadResult.dpi} DPI). Aanbevolen is minimaal 300 DPI voor scherp drukwerk.`,
        severity: "warning",
      });
    }

    if (!uploadResult.hasTransparency && file.type !== "application/pdf") {
      warnings.push({
        type: "has_background",
        message:
          "Afbeelding heeft geen transparante achtergrond. Verwijder de achtergrond voor optimale DTF print.",
        severity: "warning",
      });
    }

    if (file.size > 20 * 1024 * 1024) {
      warnings.push({
        type: "large_file",
        message: "Groot bestand. Verwerking kan iets langer duren.",
        severity: "warning",
      });
    }

    const uploadedFile: UploadedFile = {
      id: uploadResult.id,
      name: file.name,
      url: uploadResult.url,
      previewUrl: uploadResult.previewUrl,
      width: uploadResult.width,
      height: uploadResult.height,
      widthCm: uploadResult.widthCm,
      heightCm: uploadResult.heightCm,
      dpi: uploadResult.dpi,
      mimeType: file.type,
      fileSize: file.size,
      hasTransparency: uploadResult.hasTransparency,
      hasBackground: !uploadResult.hasTransparency,
      warnings,
    };

    return json({ success: true, file: uploadedFile });
  } catch (error) {
    console.error("Upload error:", error);
    return json({ error: "Upload failed. Please try again." }, { status: 500 });
  }
}
