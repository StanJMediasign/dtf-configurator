// app/store/configuratorStore.ts
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import type {
  CanvasItem,
  UploadedFile,
  PriceCalculation,
  NestingResult,
} from "~/types";
import { calculatePrice } from "~/lib/pricingEngine";
import { calculateUsedLength } from "~/lib/nestingEngine";
import { CM_TO_PX } from "~/types";

interface HistoryState {
  items: CanvasItem[];
}

interface ConfiguratorStore {
  // Uploaded files
  uploadedFiles: UploadedFile[];
  addUploadedFile: (file: UploadedFile) => void;
  removeUploadedFile: (fileId: string) => void;

  // Canvas items
  items: CanvasItem[];
  addItem: (file: UploadedFile) => void;
  updateItem: (id: string, updates: Partial<CanvasItem>) => void;
  removeItem: (id: string) => void;
  duplicateItem: (id: string) => void;
  clearItems: () => void;

  // Selection
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
  selectItem: (id: string, multiSelect?: boolean) => void;
  clearSelection: () => void;

  // Canvas view
  zoom: number;
  panX: number;
  panY: number;
  setZoom: (zoom: number) => void;
  setPan: (x: number, y: number) => void;
  resetView: () => void;

  // Settings
  showGuidelines: boolean;
  trimMarginMm: number;
  setShowGuidelines: (show: boolean) => void;
  setTrimMarginMm: (mm: number) => void;

  // Derived pricing
  priceCalculation: PriceCalculation | null;
  usedLengthCm: number;
  updatePricing: () => void;

  // Nesting
  applyNesting: (result: NestingResult) => void;
  autoNest: () => void;

  // Undo/redo
  history: HistoryState[];
  historyIndex: number;
  undo: () => void;
  redo: () => void;
  pushHistory: () => void;

  // UI state
  isUploading: boolean;
  isNesting: boolean;
  isAddingToCart: boolean;
  setIsUploading: (v: boolean) => void;
  setIsNesting: (v: boolean) => void;
  setIsAddingToCart: (v: boolean) => void;
}

const MAX_HISTORY = 50;

export const useConfiguratorStore = create<ConfiguratorStore>()(
  subscribeWithSelector((set, get) => ({
    uploadedFiles: [],
    items: [],
    selectedIds: [],
    zoom: 1,
    panX: 0,
    panY: 0,
    showGuidelines: true,
    trimMarginMm: 3,
    priceCalculation: null,
    usedLengthCm: 0,
    history: [],
    historyIndex: -1,
    isUploading: false,
    isNesting: false,
    isAddingToCart: false,

    addUploadedFile: (file) =>
      set((state) => ({ uploadedFiles: [...state.uploadedFiles, file] })),

    removeUploadedFile: (fileId) =>
      set((state) => ({
        uploadedFiles: state.uploadedFiles.filter((f) => f.id !== fileId),
        items: state.items.filter((i) => i.fileId !== fileId),
      })),

    addItem: (file) => {
      const { items, trimMarginMm, pushHistory } = get();
      const marginPx = trimMarginMm * CM_TO_PX * 0.1;
      const newItem: CanvasItem = {
        id: uuidv4(),
        fileId: file.id,
        fileUrl: file.url,
        previewUrl: file.previewUrl,
        name: file.name,
        x: marginPx,
        y:
          items.length > 0
            ? Math.max(...items.map((i) => i.y + i.height)) + marginPx
            : marginPx,
        width: file.widthCm * CM_TO_PX,
        height: file.heightCm * CM_TO_PX,
        rotation: 0,
        widthCm: file.widthCm,
        heightCm: file.heightCm,
        dpi: file.dpi,
        scaleX: 1,
        scaleY: 1,
        isSelected: false,
        opacity: 1,
      };
      pushHistory();
      set((state) => ({ items: [...state.items, newItem] }));
      get().updatePricing();
    },

    updateItem: (id, updates) => {
      set((state) => ({
        items: state.items.map((item) =>
          item.id === id ? { ...item, ...updates } : item
        ),
      }));
      get().updatePricing();
    },

    removeItem: (id) => {
      get().pushHistory();
      set((state) => ({
        items: state.items.filter((item) => item.id !== id),
        selectedIds: state.selectedIds.filter((sid) => sid !== id),
      }));
      get().updatePricing();
    },

    duplicateItem: (id) => {
      const { items, pushHistory } = get();
      const item = items.find((i) => i.id === id);
      if (!item) return;
      pushHistory();
      const duplicate: CanvasItem = {
        ...item,
        id: uuidv4(),
        x: item.x + 10,
        y: item.y + 10,
        isSelected: false,
      };
      set((state) => ({ items: [...state.items, duplicate] }));
      get().updatePricing();
    },

    clearItems: () => {
      get().pushHistory();
      set({ items: [], selectedIds: [] });
      get().updatePricing();
    },

    setSelectedIds: (ids) => set({ selectedIds: ids }),

    selectItem: (id, multiSelect = false) => {
      set((state) => {
        if (multiSelect) {
          const already = state.selectedIds.includes(id);
          return {
            selectedIds: already
              ? state.selectedIds.filter((sid) => sid !== id)
              : [...state.selectedIds, id],
          };
        }
        return { selectedIds: [id] };
      });
    },

    clearSelection: () => set({ selectedIds: [] }),

    setZoom: (zoom) => set({ zoom: Math.min(3, Math.max(0.2, zoom)) }),

    setPan: (x, y) => set({ panX: x, panY: y }),

    resetView: () => set({ zoom: 1, panX: 0, panY: 0 }),

    setShowGuidelines: (show) => set({ showGuidelines: show }),

    setTrimMarginMm: (mm) => {
      set({ trimMarginMm: Math.max(0, Math.min(10, mm)) });
      get().updatePricing();
    },

    updatePricing: () => {
      const { items, trimMarginMm } = get();
      const usedLengthCm = calculateUsedLength(items, trimMarginMm);
      const priceCalculation = calculatePrice(usedLengthCm);
      set({ usedLengthCm, priceCalculation });
    },

    applyNesting: (result) => {
      get().pushHistory();
      set({ items: result.items });
      get().updatePricing();
    },

    autoNest: async () => {
      const { items, trimMarginMm, setIsNesting, applyNesting } = get();
      if (items.length === 0) return;
      setIsNesting(true);
      // Dynamic import to avoid SSR issues
      const { nestItems } = await import("~/lib/nestingEngine");
      const result = nestItems(items, trimMarginMm);
      applyNesting(result);
      setIsNesting(false);
    },

    pushHistory: () => {
      const { items, history, historyIndex } = get();
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push({ items: JSON.parse(JSON.stringify(items)) });
      if (newHistory.length > MAX_HISTORY) newHistory.shift();
      set({ history: newHistory, historyIndex: newHistory.length - 1 });
    },

    undo: () => {
      const { history, historyIndex } = get();
      if (historyIndex <= 0) return;
      const newIndex = historyIndex - 1;
      const state = history[newIndex];
      set({ items: state.items, historyIndex: newIndex });
      get().updatePricing();
    },

    redo: () => {
      const { history, historyIndex } = get();
      if (historyIndex >= history.length - 1) return;
      const newIndex = historyIndex + 1;
      const state = history[newIndex];
      set({ items: state.items, historyIndex: newIndex });
      get().updatePricing();
    },

    setIsUploading: (v) => set({ isUploading: v }),
    setIsNesting: (v) => set({ isNesting: v }),
    setIsAddingToCart: (v) => set({ isAddingToCart: v }),
  }))
);
