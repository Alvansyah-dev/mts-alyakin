'use client';

import React, { useState, ChangeEvent, DragEvent } from 'react';
import { useFormContext } from 'react-hook-form';
import { Upload, X } from 'lucide-react';
import axios from 'axios';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  name: string;
  maxSizeMB?: number;
  accept?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ name, maxSizeMB = 5, accept = 'image/*' }) => {
  const { setValue, watch } = useFormContext();
  const [preview, setPreview] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const file = watch(name);

  const handleFiles = (files: FileList) => {
    const selected = files[0];
    if (!selected) return;
    if (!selected.type.startsWith('image/')) {
      alert('Only image files are allowed');
      return;
    }
    if (selected.size > maxSizeMB * 1024 * 1024) {
      alert(`File exceeds ${maxSizeMB}MB limit`);
      return;
    }
    const url = URL.createObjectURL(selected);
    setPreview(url);
    setValue(name, selected, { shouldValidate: true });
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handleFiles(e.target.files);
  };

  const uploadImage = async () => {
    if (!file) return;
    const form = new FormData();
    form.append('file', file);
    setUploading(true);
    try {
      const response = await axios.post('/api/upload/image', form, {
        onUploadProgress: (p) => {
          if (p.total) setProgress(Math.round((p.loaded * 100) / p.total));
        },
      });
      // handle response url if needed
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const removeImage = () => {
    setPreview('');
    setValue(name, null);
  };

  return (
    <div className="space-y-2">
      <div
        className={cn(
          'border-2 border-dashed rounded-lg p-6 flex items-center justify-center cursor-pointer transition-colors',
          'hover:border-primary',
          preview ? 'hidden' : ''
        )}
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => document.getElementById(`file-${name}`)?.click()}
      >
        <Upload className="h-8 w-8 text-muted" />
        <p className="ml-2 text-muted">Drag & drop or click to select an image</p>
        <input
          id={`file-${name}`}
          type="file"
          accept={accept}
          className="hidden"
          onChange={onChange}
        />
      </div>

      {preview && (
        <div className="relative">
          <img src={preview} alt="preview" className="rounded-lg max-h-60 object-cover w-full" />
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-2 right-2 bg-bg-primary/80 rounded-full p-1 hover:bg-bg-primary"
          >
            <X className="h-5 w-5 text-muted" />
          </button>
        </div>
      )}

      {file && !uploading && (
        <button
          type="button"
          onClick={uploadImage}
          className="w-full py-2 bg-accent text-accent-text rounded-lg hover:bg-accent-hover transition"
        >
          Upload Image
        </button>
      )}

      {uploading && (
        <div className="w-full bg-bg-subtle rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-accent transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};
