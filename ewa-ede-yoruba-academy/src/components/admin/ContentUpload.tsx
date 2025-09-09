'use client';

import { useState, useRef } from 'react';
import { Upload, File, Video, Image, FileText, X, CheckCircle, AlertCircle } from 'lucide-react';

interface UploadProgress {
  file: File;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  url?: string;
  error?: string;
}

interface ContentUploadProps {
  onUploadComplete?: (files: UploadProgress[]) => void;
  acceptedTypes?: string[];
  maxFileSize?: number; // in MB
  maxFiles?: number;
  uploadPath?: string;
}

export default function ContentUpload({
  onUploadComplete,
  acceptedTypes = ['image/*', 'video/*', 'audio/*', '.pdf', '.doc', '.docx', '.txt'],
  maxFileSize = 100, // 100MB default
  maxFiles = 10,
  uploadPath = 'content'
}: ContentUploadProps) {
  const [uploads, setUploads] = useState<UploadProgress[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileIcon = (file: File) => {
    const type = file.type;
    if (type.startsWith('image/')) return <Image className="h-8 w-8 text-blue-500" aria-hidden="true" />;
    if (type.startsWith('video/')) return <Video className="h-8 w-8 text-red-500" />;
    if (type.includes('pdf')) return <FileText className="h-8 w-8 text-red-600" />;
    return <File className="h-8 w-8 text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      return `File size exceeds ${maxFileSize}MB limit`;
    }

    // Check file type
    const isAccepted = acceptedTypes.some(type => {
      if (type.startsWith('.')) {
        return file.name.toLowerCase().endsWith(type.toLowerCase());
      }
      return file.type.match(type.replace('*', '.*'));
    });

    if (!isAccepted) {
      return 'File type not supported';
    }

    return null;
  };

  const uploadFile = async (file: File): Promise<UploadProgress> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', uploadPath);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const result = await response.json();

      return {
        file,
        progress: 100,
        status: 'completed',
        url: result.url,
      };
    } catch (error) {
      return {
        file,
        progress: 0,
        status: 'error',
        error: error instanceof Error ? error.message : 'Upload failed',
      };
    }
  };

  const handleFiles = async (files: FileList) => {
    const fileArray = Array.from(files);

    // Validate files
    const validFiles: File[] = [];
    const errors: string[] = [];

    for (const file of fileArray) {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    }

    // Check total file count
    if (uploads.length + validFiles.length > maxFiles) {
      errors.push(`Maximum ${maxFiles} files allowed`);
      return;
    }

    // Show validation errors
    if (errors.length > 0) {
      alert(errors.join('\n'));
      return;
    }

    // Initialize upload progress
    const newUploads: UploadProgress[] = validFiles.map(file => ({
      file,
      progress: 0,
      status: 'uploading' as const,
    }));

    setUploads(prev => [...prev, ...newUploads]);

    // Upload files
    const uploadPromises = validFiles.map(uploadFile);
    const results = await Promise.all(uploadPromises);

    setUploads(prev => {
      const updated = [...prev];
      results.forEach(result => {
        const index = updated.findIndex(u => u.file.name === result.file.name);
        if (index !== -1) {
          updated[index] = result;
        }
      });
      return updated;
    });

    // Notify parent component
    if (onUploadComplete) {
      const completedUploads = results.filter(r => r.status === 'completed');
      onUploadComplete(completedUploads);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  const removeUpload = (index: number) => {
    setUploads(prev => prev.filter((_, i) => i !== index));
  };

  const clearCompleted = () => {
    setUploads(prev => prev.filter(upload => upload.status !== 'completed'));
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <div className="flex flex-col items-center">
          <Upload className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Upload Content Files
          </h3>
          <p className="text-gray-500 mb-4">
            Drag and drop files here, or click to select files
          </p>
          <div className="text-sm text-gray-400">
            <p>Supported formats: Images, Videos, PDFs, Documents</p>
            <p>Maximum file size: {maxFileSize}MB per file</p>
            <p>Maximum files: {maxFiles}</p>
          </div>
        </div>
      </div>

      {/* Upload Progress */}
      {uploads.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-gray-900">Upload Progress</h4>
            <button
              onClick={clearCompleted}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Clear Completed
            </button>
          </div>

          <div className="space-y-3">
            {uploads.map((upload, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 p-4 bg-white border border-gray-200 rounded-lg"
              >
                <div className="flex-shrink-0">
                  {getFileIcon(upload.file)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {upload.file.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(upload.file.size)}
                    </p>
                  </div>

                  <div className="mt-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className={`font-medium ${
                        upload.status === 'completed' ? 'text-green-600' :
                        upload.status === 'error' ? 'text-red-600' :
                        'text-blue-600'
                      }`}>
                        {upload.status === 'completed' ? 'Completed' :
                         upload.status === 'error' ? 'Error' :
                         'Uploading...'}
                      </span>
                      <span className="text-gray-500">
                        {upload.progress}%
                      </span>
                    </div>

                    <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          upload.status === 'completed' ? 'bg-green-500' :
                          upload.status === 'error' ? 'bg-red-500' :
                          'bg-blue-500'
                        }`}
                        style={{ width: `${upload.progress}%` }}
                      />
                    </div>

                    {upload.error && (
                      <p className="mt-1 text-sm text-red-600">{upload.error}</p>
                    )}
                  </div>
                </div>

                <div className="flex-shrink-0 flex items-center space-x-2">
                  {upload.status === 'completed' && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                  {upload.status === 'error' && (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  )}
                  <button
                    onClick={() => removeUpload(index)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Summary */}
      {uploads.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              {uploads.filter(u => u.status === 'completed').length} of {uploads.length} files uploaded
            </span>
            <span className="text-gray-600">
              Total size: {formatFileSize(uploads.reduce((sum, u) => sum + u.file.size, 0))}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}