"use client";

import { useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { MAX_IMAGE_DIMENSION } from "@/lib/constants";
import { Camera, RotateCcw } from "lucide-react";

interface PhotoCaptureProps {
  imagePreview: string | null;
  onImageCapture: (base64: string, mediaType: string) => void;
  onClear: () => void;
  disabled?: boolean;
}

function resizeImage(file: File): Promise<{ base64: string; mediaType: string }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = () => {
      img.onload = () => {
        const { width, height } = img;
        let newWidth = width;
        let newHeight = height;

        if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
          if (width > height) {
            newWidth = MAX_IMAGE_DIMENSION;
            newHeight = Math.round((height / width) * MAX_IMAGE_DIMENSION);
          } else {
            newHeight = MAX_IMAGE_DIMENSION;
            newWidth = Math.round((width / height) * MAX_IMAGE_DIMENSION);
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = newWidth;
        canvas.height = newHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas not supported"));

        ctx.drawImage(img, 0, 0, newWidth, newHeight);

        const outputType = file.type === "image/png" ? "image/png" : "image/jpeg";
        const dataUrl = canvas.toDataURL(outputType, 0.85);
        const base64 = dataUrl.split(",")[1];

        resolve({ base64, mediaType: outputType });
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

export function PhotoCapture({ imagePreview, onImageCapture, onClear, disabled }: PhotoCaptureProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) return;

      const maxSizeBytes = 20 * 1024 * 1024;
      if (file.size > maxSizeBytes) {
        alert("Image is too large. Please use an image under 20MB.");
        return;
      }

      try {
        const { base64, mediaType } = await resizeImage(file);
        onImageCapture(base64, mediaType);
      } catch {
        alert("Failed to process image. Please try another.");
      }
    },
    [onImageCapture]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
      e.target.value = "";
    },
    [handleFile]
  );

  if (imagePreview) {
    return (
      <div className="relative w-full">
        <div className="overflow-hidden rounded-2xl border border-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imagePreview}
            alt="Food photo"
            className="w-full max-h-80 object-cover"
          />
        </div>
        <Button
          variant="secondary"
          size="sm"
          className="absolute top-3 right-3 rounded-full shadow-md"
          onClick={onClear}
          disabled={disabled}
        >
          <RotateCcw className="h-4 w-4 mr-1" />
          Retake
        </Button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      disabled={disabled}
      className="flex w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border bg-muted/30 p-12 transition-colors hover:border-teal-400 hover:bg-teal-50/50 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-100 text-teal-600">
        <Camera className="h-7 w-7" />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-foreground">Tap to take a photo or upload</p>
        <p className="text-xs text-muted-foreground mt-1">JPG, PNG, or WebP up to 20MB</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleChange}
        className="hidden"
      />
    </button>
  );
}
