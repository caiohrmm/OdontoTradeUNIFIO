"use client";

import { useMemo, useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { uploadListingImage } from "@/services/api/upload.service";

const MAX_FILE_MB = 5;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/gif", "image/webp"]);

type PendingPreview = {
  id: string;
  previewUrl: string;
  name: string;
};

type ListingImageUploaderProps = {
  token?: string | null;
  value: string[];
  onChange: (urls: string[]) => void;
  maxFiles?: number;
  disabled?: boolean;
};

export function ListingImageUploader({
  token,
  value,
  onChange,
  maxFiles = 20,
  disabled = false,
}: ListingImageUploaderProps) {
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [pending, setPending] = useState<PendingPreview[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const remaining = useMemo(() => Math.max(maxFiles - value.length, 0), [maxFiles, value.length]);

  const validateFile = (file: File) => {
    if (!ALLOWED_TYPES.has(file.type)) {
      return "Formato inv?lido. Use JPEG, PNG, GIF ou WebP.";
    }
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      return `Arquivo muito grande. M?ximo ${MAX_FILE_MB}MB.`;
    }
    return null;
  };

  const handlePickClick = () => {
    if (disabled || isUploading) return;
    inputRef.current?.click();
  };

  const handleFilesSelected = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    if (!token) {
      toast({
        variant: "error",
        title: "Autentica??o necess?ria",
        description: "Entre na sua conta para enviar imagens.",
      });
      return;
    }
    if (remaining <= 0) {
      toast({
        variant: "error",
        title: "Limite atingido",
        description: `Voc? pode enviar no m?ximo ${maxFiles} imagens por an?ncio.`,
      });
      return;
    }

    const selected = Array.from(files).slice(0, remaining);
    const validFiles: File[] = [];
    let invalidCount = 0;

    selected.forEach((file) => {
      const validationError = validateFile(file);
      if (validationError) {
        invalidCount += 1;
        toast({
          variant: "error",
          title: `Arquivo rejeitado: ${file.name}`,
          description: validationError,
        });
        return;
      }
      validFiles.push(file);
    });

    if (validFiles.length === 0) return;

    setIsUploading(true);
    const pendingItems = validFiles.map((file) => ({
      id: `${file.name}-${file.size}-${Date.now()}`,
      previewUrl: URL.createObjectURL(file),
      name: file.name,
    }));
    setPending((current) => [...current, ...pendingItems]);

    let nextUrls = [...value];
    let successCount = 0;
    let failedCount = 0;

    for (let index = 0; index < validFiles.length; index += 1) {
      const file = validFiles[index];
      const preview = pendingItems[index];
      try {
        const uploadedUrl = await uploadListingImage(file, token);
        nextUrls = [...nextUrls, uploadedUrl];
        onChange(nextUrls);
        successCount += 1;
      } catch (error) {
        failedCount += 1;
        toast({
          variant: "error",
          title: `Falha no upload: ${file.name}`,
          description: error instanceof Error ? error.message : "N?o foi poss?vel enviar imagem.",
        });
      } finally {
        setPending((current) => current.filter((item) => item.id !== preview.id));
        URL.revokeObjectURL(preview.previewUrl);
      }
    }

    setIsUploading(false);
    if (inputRef.current) inputRef.current.value = "";

    if (successCount > 0) {
      toast({
        variant: "success",
        title: "Upload conclu?do",
        description: `${successCount} imagem(ns) enviada(s) com sucesso${failedCount ? `, ${failedCount} com falha` : ""}.`,
      });
    } else if (invalidCount > 0 || failedCount > 0) {
      toast({
        variant: "error",
        title: "Nenhuma imagem enviada",
        description: "Revise os arquivos e tente novamente.",
      });
    }
  };

  const handleRemoveUploaded = (url: string) => {
    onChange(value.filter((item) => item !== url));
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          multiple
          className="hidden"
          onChange={(event) => void handleFilesSelected(event.target.files)}
        />
        <Button
          type="button"
          variant="outline"
          className="gap-2"
          disabled={disabled || isUploading || remaining <= 0}
          onClick={handlePickClick}
        >
          {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
          Selecionar imagens
        </Button>
        <span className="text-xs text-slate-500">
          {value.length}/{maxFiles} imagens ? JPEG/PNG/GIF/WebP ? m?ximo {MAX_FILE_MB}MB
        </span>
      </div>

      {value.length === 0 && pending.length === 0 ? (
        <div className="flex min-h-28 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500">
          <ImagePlus className="mr-2 h-4 w-4" />
          Nenhuma imagem selecionada
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {value.map((url) => (
            <div key={url} className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white">
              <img src={url} alt="Imagem do an?ncio" className="h-28 w-full object-cover md:h-32" />
              <button
                type="button"
                onClick={() => handleRemoveUploaded(url)}
                className="absolute right-2 top-2 rounded-lg bg-white/90 p-1.5 text-slate-600 shadow transition hover:bg-white"
                aria-label="Remover imagem"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}

          {pending.map((item) => (
            <div key={item.id} className="relative overflow-hidden rounded-xl border border-sky-200 bg-sky-50">
              <img src={item.previewUrl} alt={item.name} className="h-28 w-full object-cover opacity-70 md:h-32" />
              <div className="absolute inset-0 flex items-center justify-center bg-sky-900/20">
                <div className="rounded-full bg-white/90 p-2">
                  <Loader2 className="h-4 w-4 animate-spin text-sky-700" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
