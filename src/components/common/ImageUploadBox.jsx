import React, { useState, useRef } from 'react';
import { UploadCloud, X, File, Image as ImageIcon } from 'lucide-react';
import { Button } from '../ui/button';

const ImageUploadBox = ({
  label,
  description,
  onFileSelect,
  files = [],
  onRemove,
  uploadProgress = {},
  uploadStatus = {},
  minRequired = 0,
  maxFiles = 20,
  accept = "image/*",
  multiple = true
}) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    if (e.currentTarget.contains(e.relatedTarget)) {
      return;
    }
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (newFiles) => {
    if (files.length + newFiles.length > maxFiles) {
      alert(`You can only upload a maximum of ${maxFiles} files.`);
      return;
    }
    onFileSelect(newFiles);
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full space-y-4">
      <div>
        <h3 className="text-lg font-medium text-foreground">{label}</h3>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>

      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'
        }`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="flex flex-col items-center justify-center space-y-3 cursor-pointer">
          <div className="bg-primary/10 p-3 rounded-full text-primary">
            <UploadCloud className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-muted-foreground">
              {accept.includes('image') ? 'SVG, PNG, JPG or GIF' : 'PDF, DOC, DOCX'} (max. 10MB)
            </p>
          </div>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
        />
      </div>

      {files.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground">
            Selected Files ({files.length}{minRequired > 0 ? ` / Min ${minRequired} required` : ''})
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {files.map((file, index) => {
              const fileKey = file.name + file.lastModified;
              const progress = uploadProgress[fileKey] || 0;
              const status = uploadStatus[fileKey] || 'pending'; // pending, uploading, success, error
              const isImage = file.type.startsWith('image/');
              
              return (
                <div key={index} className="relative group border rounded-lg overflow-hidden bg-card">
                  {isImage ? (
                    <div className="aspect-square relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        {status !== 'success' && status !== 'uploading' && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onRemove(index);
                            }}
                            className="bg-destructive text-destructive-foreground p-1.5 rounded-full hover:bg-destructive/90 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-square flex flex-col items-center justify-center p-4 bg-muted relative">
                      <File className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-xs text-center text-foreground truncate w-full" title={file.name}>
                        {file.name}
                      </p>
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        {status !== 'success' && status !== 'uploading' && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onRemove(index);
                            }}
                            className="bg-destructive text-destructive-foreground p-1.5 rounded-full hover:bg-destructive/90 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Upload Progress Bar */}
                  {status === 'uploading' && (
                    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-muted">
                      <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  )}
                  
                  {/* Status Overlay */}
                  {status === 'success' && (
                    <div className="absolute top-1 right-1 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">
                      Uploaded
                    </div>
                  )}
                  {status === 'error' && (
                    <div className="absolute top-1 right-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">
                      Error
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploadBox;
