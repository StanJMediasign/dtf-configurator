// app/hooks/useKeyboardShortcuts.ts
import { useEffect } from "react";
import { useConfiguratorStore } from "~/store/configuratorStore";

export function useKeyboardShortcuts() {
  const {
    undo,
    redo,
    selectedIds,
    removeItem,
    duplicateItem,
    updateItem,
    clearSelection,
  } = useConfiguratorStore();

  useEffect(() => {
    const MOVE_STEP = 2; // px per arrow key press (2px = 0.2cm)

    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return;

      const ctrl = e.ctrlKey || e.metaKey;

      // Undo
      if (ctrl && !e.shiftKey && e.key.toLowerCase() === "z") {
        e.preventDefault();
        undo();
        return;
      }

      // Redo
      if ((ctrl && e.shiftKey && e.key.toLowerCase() === "z") || (ctrl && e.key.toLowerCase() === "y")) {
        e.preventDefault();
        redo();
        return;
      }

      // Duplicate
      if (ctrl && e.key.toLowerCase() === "d") {
        e.preventDefault();
        selectedIds.forEach((id) => duplicateItem(id));
        return;
      }

      // Select all — no-op for now (requires store refactor)
      if (ctrl && e.key.toLowerCase() === "a") {
        e.preventDefault();
        // selectAll();
        return;
      }

      // Delete selected
      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        selectedIds.forEach((id) => removeItem(id));
        return;
      }

      // Escape = deselect
      if (e.key === "Escape") {
        clearSelection();
        return;
      }

      // Arrow keys — nudge selected items
      if (
        selectedIds.length > 0 &&
        ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)
      ) {
        e.preventDefault();
        const step = e.shiftKey ? MOVE_STEP * 5 : MOVE_STEP;
        const dx =
          e.key === "ArrowLeft" ? -step : e.key === "ArrowRight" ? step : 0;
        const dy =
          e.key === "ArrowUp" ? -step : e.key === "ArrowDown" ? step : 0;

        const { items } = useConfiguratorStore.getState();
        selectedIds.forEach((id) => {
          const item = items.find((i) => i.id === id);
          if (item) {
            updateItem(id, {
              x: Math.max(0, item.x + dx),
              y: Math.max(0, item.y + dy),
            });
          }
        });
        return;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [undo, redo, selectedIds, removeItem, duplicateItem, updateItem, clearSelection]);
}
