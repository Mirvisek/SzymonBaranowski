'use client';

import { useState } from 'react';
import { Upload, Image as ImageIcon, Loader2 } from 'lucide-react';

export default function ImageUploader({
    onUpload,
    value
}: {
    onUpload: (url: string) => void,
    value?: string
}) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | undefined>(value);
    const [dragActive, setDragActive] = useState(false);

    const handleFile = async (file: File) => {
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (data.success) {
                setPreview(data.url);
                onUpload(data.url);
            } else {
                alert('Błąd wysyłania: ' + data.message);
            }
        } catch (e) {
            alert('Wystąpił błąd podczas wysyłania pliku');
        } finally {
            setUploading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleFile(file);
    };

    return (
        <div className="space-y-4">
            <div
                className={`relative rounded-xl p-8 text-center transition-colors ${dragActive ? 'bg-primary/5' : 'hover:bg-gray-50'
                    }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    onChange={handleChange}
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />

                {uploading ? (
                    <div className="flex flex-col items-center py-4">
                        <Loader2 className="animate-spin text-primary mb-2" size={32} />
                        <span className="text-sm text-gray-500">Wysyłanie...</span>
                    </div>
                ) : preview ? (
                    <div className="relative group">
                        <img
                            src={preview}
                            alt="Preview"
                            className="max-h-64 mx-auto rounded-lg shadow-md object-contain"
                        />
                        <div className="absolute inset-0 bg-dark/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                            <span className="text-white font-medium flex items-center">
                                <Upload size={20} className="mr-2" />
                                Zmień zdjęcie
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center py-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                            <ImageIcon className="text-primary" size={24} />
                        </div>
                        <p className="text-sm font-medium text-gray-900 mb-2">
                            Przeciągnij zdjęcie tutaj
                        </p>
                        <div className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
                            Wybierz plik z dysku
                        </div>
                        <p className="text-xs text-gray-500 mt-3">
                            PNG, JPG, WEBP do 5MB
                        </p>
                    </div>
                )}
            </div>
            {preview && (
                <p className="text-xs text-center text-gray-400 break-all">URL: {preview}</p>
            )}
        </div>
    );
}
