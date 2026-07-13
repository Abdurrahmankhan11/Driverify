import React, { useState } from 'react';
import { Button } from '../../../../components/ui/button';
import { vehicleService } from '../../../../services/api';
import ImageUploadBox from '../../../../components/common/ImageUploadBox';

const Step3InteriorImages = ({ listingId, onNext }) => {
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadStatus, setUploadStatus] = useState({});
  const [apiMessage, setApiMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [totalUploaded, setTotalUploaded] = useState(0);

  const MIN_REQUIRED = 3;

  const handleFileSelect = (newFiles) => {
    const existingNames = files.map(f => f.name + f.size);
    const uniqueNewFiles = newFiles.filter(f => !existingNames.includes(f.name + f.size));
    
    setFiles(prev => [...prev, ...uniqueNewFiles]);
  };

  const handleRemove = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async () => {
    const pendingFiles = files.filter((file) => {
      const fileKey = file.name + file.lastModified;
      return uploadStatus[fileKey] !== 'success';
    });

    if (pendingFiles.length === 0) return;

    setIsUploading(true);
    setApiMessage('');

    let currentUploaded = totalUploaded;

    for (const file of pendingFiles) {
      const fileKey = file.name + file.lastModified;
      
      setUploadStatus(prev => ({ ...prev, [fileKey]: 'uploading' }));
      
      const formData = new FormData();
      formData.append('image', file);

      try {
        const response = await vehicleService.uploadInteriorImage(
          listingId, 
          formData, 
          (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(prev => ({ ...prev, [fileKey]: percentCompleted }));
          }
        );

        setUploadStatus(prev => ({ ...prev, [fileKey]: 'success' }));
        
        if (response.uploaded !== undefined) {
          currentUploaded = response.uploaded;
          setTotalUploaded(response.uploaded);
        } else {
          currentUploaded++;
          setTotalUploaded(currentUploaded);
        }

        if (response.message) {
          setApiMessage(response.message);
        }

      } catch (err) {
        console.error('Upload error', err);
        setUploadStatus(prev => ({ ...prev, [fileKey]: 'error' }));
        setApiMessage(`Error uploading ${file.name}.`);
        break; 
      }
    }

    setIsUploading(false);
  };

  const isComplete = totalUploaded >= MIN_REQUIRED;

  return (
    <div className="space-y-6">
      <div className="bg-muted p-4 rounded-lg">
        <h3 className="font-semibold text-foreground mb-1">Interior Images</h3>
        <p className="text-sm text-muted-foreground">
          Upload at least {MIN_REQUIRED} interior images of your vehicle. 
          Currently uploaded: <span className="font-bold text-foreground">{totalUploaded}</span> / {MIN_REQUIRED}
        </p>
        {apiMessage && (
          <p className="text-sm font-medium text-primary mt-2">{apiMessage}</p>
        )}
      </div>

      <ImageUploadBox
        label="Select Interior Images"
        description="Drag and drop or click to select files."
        files={files}
        onFileSelect={handleFileSelect}
        onRemove={handleRemove}
        uploadProgress={uploadProgress}
        uploadStatus={uploadStatus}
        minRequired={MIN_REQUIRED}
        accept="image/*"
        multiple={true}
      />

      <div className="pt-4 flex justify-between border-t border-border mt-6">
        <Button 
          type="button" 
          variant="outline"
          onClick={uploadImages}
          disabled={isUploading || files.length === 0 || files.every(f => uploadStatus[f.name + f.lastModified] === 'success')}
        >
          {isUploading ? 'Uploading...' : 'Upload Selected Images'}
        </Button>
        
        <Button 
          type="button" 
          onClick={onNext}
          disabled={!isComplete || isUploading}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Next: Documents
        </Button>
      </div>
    </div>
  );
};

export default Step3InteriorImages;
