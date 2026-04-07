// app/hooks/useFileUpload.ts
import { useCallback, useState } from "react";
import { useConfiguratorStore } from "~/store/configuratorStore";
import type { UploadedFile } from "~/types";

interface UseFileUploadReturn {
  upload: (files: File[]) => Promise<void>;
  isUploading: boolean;
  errors: string[];
  clearErrors: () => void;
}

const ALLOWED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "application/pdf",
];
const MAX_SIZE_MB = 50;

export function useFileUpload(): UseFileUploadReturn {
  const { addUploadedFile, addItem, setIsUploading, isUploading } =
    useConfiguratorStore();
  const [errors, setErrors] = useState<string[]>([]);

  const upload = useCallback(
    async (files: File[]) => {
      const errs: string[] = [];

      const valid = files.filter((f) => {
        if (!ALLOWED_TYPES.includes(f.type)) {
          errs.push(`${f.name}: Type niet ondersteund (gebruik PNG, JPG, WEBP of PDF)`);
          return false;
        }
        if (f.size > MAX_SIZE_MB * 1024 * 1024) {
          errs.push(`${f.name}: Te groot (max ${MAX_SIZE_MB}MB)`);
          return false;
        }
        return true;
      });

      if (errs.length) setErrors(errs);
      if (!valid.length) return;

      setIsUploading(true);
      const newErrs: string[] = [...errs];

      await Promise.allSettled(
        valid.map(async (file) => {
          const fd = new FormData();
          fd.append("file", file);

          try {
            const res = await fetch("/apps/dtf-configurator/api/upload", {
              method: "POST",
              body: fd,
            });
            const data = await res.json();

            if (!res.ok || !data.success) {
              newErrs.push(`${file.name}: ${data.error ?? "Upload mislukt"}`);
              return;
            }

            const uploaded: UploadedFile = data.file;
            addUploadedFile(uploaded);
            addItem(uploaded);
          } catch {
            newErrs.push(`${file.name}: Netwerk fout`);
          }
        })
      );

      setIsUploading(false);
      if (newErrs.length) {
        setErrors(newErrs);
        setTimeout(() => setErrors([]), 6000);
      }
    },
    [addUploadedFile, addItem, setIsUploading]
  );

  return {
    upload,
    isUploading,
    errors,
    clearErrors: () => setErrors([]),
  };
}
