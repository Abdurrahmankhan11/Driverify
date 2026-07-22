import React, { useState } from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Check } from 'lucide-react';
import Step1VehicleDetails from './steps/Step1VehicleDetails';
import Step2ExteriorImages from './steps/Step2ExteriorImages';
import Step3InteriorImages from './steps/Step3InteriorImages';
import Step4Documents from './steps/Step4Documents';
import Step5Review from './steps/Step5Review';

// Steps are generated dynamically now

const PostVehicleFlow = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [listingId, setListingId] = useState(null);
  const [listingStatus, setListingStatus] = useState('');
  
  // To show details in the review step
  const [vehicleDetails, setVehicleDetails] = useState(null);

  const steps = [
    { id: 'details', title: 'Details' },
    { id: 'exterior', title: 'Exterior' },
    ...(!vehicleDetails || vehicleDetails?.vehicle_type_name === 'car' 
        ? [{ id: 'interior', title: 'Interior' }] 
        : []),
    { id: 'documents', title: 'Documents' },
    { id: 'review', title: 'Review' },
  ];

  const handleNext = () => {
    setCurrentStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleDetailsSubmitted = (data, createdListingId, status) => {
    setVehicleDetails(data);
    setListingId(createdListingId);
    if (status) setListingStatus(status);
    handleNext();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Post a Vehicle</h1>
        <p className="text-muted-foreground">Fill in the details to list your vehicle on SecondRide.</p>
      </div>

      {/* Stepper UI */}
      <div className="relative mb-8">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-muted -translate-y-1/2 z-0"></div>
        <div 
          className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 z-0 transition-all duration-300"
          style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
        ></div>
        
        <div className="relative z-10 flex justify-between">
          {steps.map((step, index) => {
            const isCompleted = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;
            
            return (
              <div key={step.id} className="flex flex-col items-center">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-colors
                    ${isCompleted ? 'bg-primary text-primary-foreground' : 
                      isCurrent ? 'bg-primary text-primary-foreground ring-4 ring-primary/20' : 
                      'bg-muted text-muted-foreground border-2 border-border'
                    }
                  `}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
                </div>
                <span className={`mt-2 text-xs font-medium ${isCurrent || isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          {steps[currentStepIndex].id === 'details' && (
            <Step1VehicleDetails 
              onSuccess={handleDetailsSubmitted} 
            />
          )}
          {steps[currentStepIndex].id === 'exterior' && (
            <Step2ExteriorImages 
              listingId={listingId} 
              onNext={handleNext} 
            />
          )}
          {steps[currentStepIndex].id === 'interior' && (
            <Step3InteriorImages 
              listingId={listingId} 
              onNext={handleNext} 
            />
          )}
          {steps[currentStepIndex].id === 'documents' && (
            <Step4Documents 
              listingId={listingId} 
              onNext={handleNext} 
            />
          )}
          {steps[currentStepIndex].id === 'review' && (
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
