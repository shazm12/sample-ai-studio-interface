"use client"
import React, { useState, useRef, useCallback } from 'react';

interface FileUploadProps {
    maxSizeMB?: number;
}

const FileUpload: React.FC<FileUploadProps> = ({
    maxSizeMB = 10
}) => {
    const [file, setFile] = useState<File | null>(null);
    const [dragging, setDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Validate file type and size
    const validateFile = useCallback((file: File): boolean => {
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
        if (!allowedTypes.includes(file.type)) {
            setError('Only PNG and JPG files are allowed');
            return false;
        }
        // Check file size
        const maxSizeBytes = maxSizeMB * 1024 * 1024;
        if (file.size > maxSizeBytes) {
            setError(`File size must be less than ${maxSizeMB}MB`);
            return false;
        }
        setError(null);
        return true;
    }, [maxSizeMB]);

    // Downscale image if needed (returns a Promise)
    const downscaleImage = useCallback((file: File): Promise<File> => {
        return new Promise((resolve) => {
            const img = new window.Image();
            img.src = URL.createObjectURL(file);
            img.onload = () => {
                let { width, height } = img;
                const maxDimension = 1920;
                if (width > maxDimension || height > maxDimension) {
                    if (width > height) {
                        height = (height * maxDimension) / width;
                        width = maxDimension;
                    } else {
                        width = (width * maxDimension) / height;
                        height = maxDimension;
                    }
                    const canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);
                    canvas.toBlob((blob) => {
                        if (blob) {
                            const downscaledFile = new File([blob], file.name, { type: file.type, lastModified: Date.now() });
                            resolve(downscaledFile);
                        } else {
                            resolve(file);
                        }
                    }, file.type, 0.9);
                } else {
                    resolve(file);
                }
            };
            img.onerror = () => {
                resolve(file);
            };
        });
    }, []);

    // Handle file selection
    const handleFileSelect = useCallback(
        async (selectedFile: File) => {
            if (validateFile(selectedFile)) {
                // Optionally downscale image before setting
                const processedFile = await downscaleImage(selectedFile);
                setFile(processedFile);

                // Create preview
                const reader = new FileReader();
                reader.onload = (e) => {
                    setPreview(e.target?.result as string);
                };
                reader.readAsDataURL(processedFile);
            }
        },
        [validateFile, downscaleImage]
    );

    // Handle drag and drop
    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragging(false);
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setDragging(false);

            const droppedFiles = Array.from(e.dataTransfer.files);
            if (droppedFiles.length > 0) {
                handleFileSelect(droppedFiles[0]);
            }
        },
        [handleFileSelect]
    );

    // Handle file input change
    const handleFileInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const selectedFile = e.target.files?.[0];
            if (selectedFile) {
                handleFileSelect(selectedFile);
            }
        },
        [handleFileSelect]
    );

    // Handle click to upload
    const handleClickUpload = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    // Clear file
    const clearFile = useCallback(() => {
        setFile(null);
        setPreview(null);
        setError(null);
        setProgress(0);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, []);

    return (
        <div className="w-full max-w-md mx-auto">
            {!file ? (
                <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                        dragging
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={handleClickUpload}
                >
                    <div className="flex flex-col items-center space-y-4">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                {dragging ? 'Drop your image here' : 'Upload an image'}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Drag and drop or click to browse
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                                Supported formats: PNG, JPG (max {maxSizeMB}MB)
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                            Selected Image
                        </h3>
                        <button
                            onClick={clearFile}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            aria-label="Remove file"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {preview && (
                        <div className="mb-4">
                            <img
                                src={preview}
                                alt="Preview"
                                className="w-full h-48 object-cover rounded-lg"
                            />
                        </div>
                    )}

                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        <p><strong>Name:</strong> {file.name}</p>
                        <p><strong>Size:</strong> {(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        <p><strong>Type:</strong> {file.type}</p>
                    </div>
                </div>
            )}

            {/* Error message */}
            {error && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
            )}

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".png,.jpg,.jpeg,image/png,image/jpeg"
                onChange={handleFileInputChange}
            />
        </div>
    );
};

export default FileUpload;