// app/services/previewService.server.ts
import sharp from "sharp";
import type { CanvasItem } from "~/types";
import { SHEET_WIDTH_PX } from "~/types";

interface PreviewOptions {
  usedLengthCm: number;
  trimMarginMm: number;
}

const PREVIEW_SCALE = 2; // 2x for retina
const CM_TO_PX = 10;

export async function generateLayoutPreview(
  items: CanvasItem[],
  options: PreviewOptions
): Promise<Buffer> {
  const { usedLengthCm, trimMarginMm } = options;
  const marginPx = trimMarginMm * CM_TO_PX * 0.1;

  const canvasWidth = SHEET_WIDTH_PX * PREVIEW_SCALE;
  const canvasHeight = Math.max(
    200,
    Math.ceil(usedLengthCm * CM_TO_PX * PREVIEW_SCALE)
  );

  // Create base canvas with white background (for preview — actual print is transparent)
  const base = sharp({
    create: {
      width: canvasWidth,
      height: canvasHeight,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    },
  });

  const compositeInputs: sharp.OverlayOptions[] = [];

  // Draw guidelines
  const guidelineSvg = buildGuidelineSVG(
    canvasWidth,
    canvasHeight,
    marginPx * PREVIEW_SCALE
  );
  compositeInputs.push({
    input: Buffer.from(guidelineSvg),
    top: 0,
    left: 0,
  });

  // Composite each item
  for (const item of items) {
    try {
      const itemBuffer = await fetchAndResizeItem(
        item,
        Math.round(item.width * PREVIEW_SCALE),
        Math.round(item.height * PREVIEW_SCALE)
      );

      compositeInputs.push({
        input: itemBuffer,
        top: Math.round(item.y * PREVIEW_SCALE),
        left: Math.round(item.x * PREVIEW_SCALE),
      });
    } catch (e) {
      console.error(`Failed to composite item ${item.id}:`, e);
    }
  }

  const finalBuffer = await base
    .composite(compositeInputs)
    .png({ compressionLevel: 6 })
    .toBuffer();

  return finalBuffer;
}

async function fetchAndResizeItem(
  item: CanvasItem,
  targetWidth: number,
  targetHeight: number
): Promise<Buffer> {
  // In production, fetch from S3 URL and process
  // For now, create a placeholder colored rectangle
  const response = await fetch(item.previewUrl || item.fileUrl);
  if (!response.ok) {
    return createPlaceholderItem(targetWidth, targetHeight, item.name);
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return sharp(buffer)
    .resize(targetWidth, targetHeight, { fit: "fill" })
    .rotate(item.rotation)
    .toBuffer();
}

async function createPlaceholderItem(
  width: number,
  height: number,
  name: string
): Promise<Buffer> {
  return sharp({
    create: {
      width: Math.max(1, width),
      height: Math.max(1, height),
      channels: 4,
      background: { r: 200, g: 200, b: 200, alpha: 0.5 },
    },
  })
    .png()
    .toBuffer();
}

function buildGuidelineSVG(
  width: number,
  height: number,
  margin: number
): string {
  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect x="${margin}" y="${margin}" width="${width - margin * 2}" height="${height - margin * 2}"
      fill="none" stroke="#ef4444" stroke-width="1" stroke-dasharray="4 4" opacity="0.5"/>
  </svg>`;
}

export async function generatePrintReadyPNG(
  items: CanvasItem[],
  usedLengthCm: number
): Promise<Buffer> {
  // Full resolution at 300 DPI
  // 55cm @ 300 DPI = 6496px wide
  const DPI = 300;
  const CM_PER_INCH = 2.54;
  const printWidth = Math.round((55 / CM_PER_INCH) * DPI);
  const printHeight = Math.round((usedLengthCm / CM_PER_INCH) * DPI);

  const scale = printWidth / SHEET_WIDTH_PX;

  const base = sharp({
    create: {
      width: printWidth,
      height: printHeight,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  });

  const compositeInputs: sharp.OverlayOptions[] = [];

  for (const item of items) {
    try {
      const response = await fetch(item.fileUrl);
      if (!response.ok) continue;
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const resized = await sharp(buffer)
        .resize(Math.round(item.width * scale), Math.round(item.height * scale))
        .rotate(item.rotation)
        .toBuffer();

      compositeInputs.push({
        input: resized,
        top: Math.round(item.y * scale),
        left: Math.round(item.x * scale),
      });
    } catch (e) {
      console.error(`Failed to process item ${item.id}:`, e);
    }
  }

  return base
    .composite(compositeInputs)
    .png({ compressionLevel: 9 })
    .toBuffer();
}
