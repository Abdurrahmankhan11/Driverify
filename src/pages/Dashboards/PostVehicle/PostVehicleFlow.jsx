import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Check, FileText, Camera, Images, Clipboard, Eye } from 'lucide-react';
import Step1VehicleDetails from './steps/Step1VehicleDetails';
import Step2ExteriorImages from './steps/Step2ExteriorImages';
import Step3InteriorImages from './steps/Step3InteriorImages';
import Step4Documents from './steps/Step4Documents';
import Step5Review from './steps/Step5Review';

const steps = [
  { id: 1, title: 'Details', icon: FileText },
  { id: 2, title: 'Exterior', icon: Camera },
  { id: 3, title: 'Interior', icon: Images },
  { id: 4, title: 'Documents', icon: Clipboard },
  { id: 5, title: 'Review', icon: Eye },
];

const PostVehicleFlow = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentStep = currentStepIndex + 1;
  const [listingId, setListingId] = useState(null);
  const [listingStatus, setListingStatus] = useState('');
  
  // To show details in the review step
  const [vehicleDetails, setVehicleDetails] = useState(null);

  // Global drag-and-drop state
  const [isGlobalDragging, setIsGlobalDragging] = useState(false);
  const dragCounter = useRef(0);
  const fileHandlerRef = useRef(null);

  const handleNext = () => {
    setCurrentStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleDetailsSubmitted = (data, createdListingId, status) => {
    setVehicleDetails(data);
    setListingId(createdListingId);
    if (status) setListingStatus(status);
    handleNext();
  };

  // Register file handler callback (used by Step2 and Step3)
  const registerFileHandler = (handler) => {
    fileHandlerRef.current = handler;
  };

  // Global drag-and-drop handlers
  useEffect(() => {
    if (currentStep !== 2 && currentStep !== 3) return; // Only enable on image steps

    const handleDragEnter = (e) => {
      e.preventDefault();
      dragCounter.current++;
      
      // Check if dragged items include files
      if (e.dataTransfer.items) {
        let hasFiles = false;
        for (let i = 0; i < e.dataTransfer.items.length; i++) {
          if (e.dataTransfer.items[i].kind === 'file') {
            hasFiles = true;
            break;
          }
        }
        if (hasFiles) {
          setIsGlobalDragging(true);
        }
      }
    };

    const handleDragOver = (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    };

    const handleDragLeave = (e) => {
      e.preventDefault();
      dragCounter.current--;
      if (dragCounter.current === 0) {
        setIsGlobalDragging(false);
      }
    };

    const handleDrop = (e) => {
      e.preventDefault();
      dragCounter.current = 0;
      setIsGlobalDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const files = Array.from(e.dataTransfer.files);
        // Filter for image files only
        const imageFiles = files.filter(file => file.type.startsWith('image/'));
        
        if (imageFiles.length > 0 && fileHandlerRef.current) {
          fileHandlerRef.current(imageFiles);
        }
      }
    };

    document.addEventListener('dragenter', handleDragEnter);
    document.addEventListener('dragover', handleDragOver);
    document.addEventListener('dragleave', handleDragLeave);
    document.addEventListener('drop', handleDrop);

    return () => {
      document.removeEventListener('dragenter', handleDragEnter);
      document.removeEventListener('dragover', handleDragOver);
      document.removeEventListener('dragleave', handleDragLeave);
      document.removeEventListener('drop', handleDrop);
    };
  }, [currentStep]);
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Global Drop Overlay */}
      {isGlobalDragging && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-primary text-primary-foreground px-8 py-6 rounded-lg shadow-xl text-center">
            <p className="text-lg font-semibold">Drop images here to upload</p>
            <p className="text-sm mt-2 opacity-90">Release to add images to your listing</p>
          </div>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Post a Vehicle</h1>
        <p className="text-muted-foreground">Fill in the details to list your vehicle on SecondRide.</p>
      </div>

      {/* Stepper UI */}
      <div className="mb-12 px-4">
        <div className="relative flex items-start justify-between">
          {/* Background Line */}
          <div className="absolute top-5 left-0 right-0 h-1 bg-muted z-0"></div>
          
          {/* Progress Line */}
          <div 
            className="absolute top-5 left-0 h-1 bg-primary z-0 transition-all duration-500"
            style={{ width: `calc(${((currentStep - 1) / (steps.length - 1)) * 100}% + 20px)` }}
          ></div>
          
          {/* Steps Container */}
          <div className="relative z-10 flex w-full justify-between">
            {steps.map((step, index) => {
              const isCompleted = step.id < currentStep;
              const isCurrent = step.id === currentStep;
              const IconComponent = step.icon;
              
              return (
                <div key={step.id} className="flex flex-col items-center w-full">
                  {/* Circle */}
                  <div 
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-lg transition-all duration-300 border-2 ${
                      isCompleted 
                        ? 'bg-primary border-primary text-white shadow-md' 
                        : isCurrent 
                        ? 'bg-primary border-primary text-white shadow-lg scale-110' 
                        : 'bg-muted border-muted text-muted-foreground'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      <IconComponent className="w-6 h-6" />
                    )}
                  </div>
                  
                  {/* Label */}
                  <span className={`mt-3 text-sm font-semibold text-center transition-colors ${
                    isCurrent || isCompleted 
                      ? 'text-foreground' 
                      : 'text-gray-500'
                  }`}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          {currentStep === 1 && (
            <Step1VehicleDetails 
              onSuccess={handleDetailsSubmitted} 
            />
          )}
          {currentStep === 2 && (
            <Step2ExteriorImages 
              listingId={listingId} 
              onNext={handleNext}
              onRegisterFileHandler={registerFileHandler}
            />
          )}
          {currentStep === 3 && (
            <Step3InteriorImages 
              listingId={listingId} 
              onNext={handleNext}
              onRegisterFileHandler={registerFileHandler}
            />
          )}
          {currentStep === 4 && (
            <Step4Documents 
              listingId={listingId} 
              onNext={handleNext} 
            />
          )}
          {currentStep === 5 && (
            <Step5Review 
              listingId={listingId} 
              vehicleDetails={vehicleDetails}
              listingStatus={listingStatus}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PostVehicleFlow;
