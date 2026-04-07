// app/lib/nestingEngine.ts
import type { CanvasItem, NestingResult } from "~/types";
import { SHEET_WIDTH_PX, CM_TO_PX } from "~/types";

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface PackedItem extends CanvasItem {
  packed: boolean;
}

/**
 * Row-based bin-packing (FFDH - First Fit Decreasing Height variant)
 * Sorts items by height descending, packs into rows left-to-right.
 * Minimises vertical sheet usage.
 */
export function nestItems(
  items: CanvasItem[],
  trimMarginMm: number
): NestingResult {
  if (items.length === 0) {
    return { items: [], usedLengthCm: 0, efficiency: 0 };
  }

  const marginPx = trimMarginMm * CM_TO_PX * 0.1; // mm to px
  const sheetWidth = SHEET_WIDTH_PX - marginPx * 2;

  // Sort by height descending (tallest first for better packing)
  const sorted = [...items]
    .map((item) => ({ ...item, packed: false } as PackedItem))
    .sort((a, b) => b.height - a.height);

  const rows: Array<{
    y: number;
    height: number;
    items: Array<{ item: PackedItem; x: number }>;
    usedWidth: number;
  }> = [];

  let currentY = marginPx;

  for (const item of sorted) {
    const itemW = item.width + marginPx;
    const itemH = item.height + marginPx;

    // Try to fit in an existing row (FFDH)
    let placed = false;
    for (const row of rows) {
      if (row.usedWidth + itemW <= sheetWidth && itemH <= row.height + marginPx) {
        row.items.push({ item, x: marginPx + row.usedWidth });
        row.usedWidth += itemW;
        placed = true;
        break;
      }
    }

    if (!placed) {
      // Open a new row
      rows.push({
        y: currentY,
        height: item.height,
        items: [{ item, x: marginPx }],
        usedWidth: itemW,
      });
      currentY += itemH;
    }
  }

  // Flatten rows back to items
  const packedItems: CanvasItem[] = [];
  for (const row of rows) {
    for (const { item, x } of row.items) {
      packedItems.push({
        ...item,
        x,
        y: row.y,
      });
    }
  }

  const totalHeightPx = currentY + marginPx;
  const usedLengthCm = totalHeightPx * 0.1; // px to cm (10px per cm)

  // Calculate efficiency
  const totalItemArea = items.reduce((sum, i) => sum + i.width * i.height, 0);
  const sheetArea = SHEET_WIDTH_PX * totalHeightPx;
  const efficiency = sheetArea > 0 ? (totalItemArea / sheetArea) * 100 : 0;

  return {
    items: packedItems,
    usedLengthCm,
    efficiency,
  };
}

export function calculateUsedLength(
  items: CanvasItem[],
  trimMarginMm: number
): number {
  if (items.length === 0) return 0;
  const marginPx = trimMarginMm * CM_TO_PX * 0.1;
  const maxBottom = Math.max(...items.map((item) => item.y + item.height));
  const totalPx = maxBottom + marginPx;
  return Math.max(0, totalPx * 0.1); // px to cm
}

export function checkCollisions(
  items: CanvasItem[],
  movingId: string,
  newX: number,
  newY: number
): boolean {
  const moving = items.find((i) => i.id === movingId);
  if (!moving) return false;

  const bounds: Rect = {
    x: newX,
    y: newY,
    width: moving.width,
    height: moving.height,
  };

  for (const item of items) {
    if (item.id === movingId) continue;
    const other: Rect = {
      x: item.x,
      y: item.y,
      width: item.width,
      height: item.height,
    };
    if (rectsOverlap(bounds, other)) return true;
  }
  return false;
}

function rectsOverlap(a: Rect, b: Rect): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

export function snapToGrid(value: number, gridSize: number): number {
  return Math.round(value / gridSize) * gridSize;
}

export function clampToBounds(
  x: number,
  y: number,
  width: number,
  height: number,
  marginPx: number
): { x: number; y: number } {
  return {
    x: Math.max(marginPx, Math.min(SHEET_WIDTH_PX - width - marginPx, x)),
    y: Math.max(marginPx, y),
  };
}
