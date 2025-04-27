import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { InputWrapper } from "@/components/ui/input-wrapper";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { MedicalRecord, BloodGroupType } from '@/types/recordTypes';
import { toast } from 'sonner';
import StepIndicator from './StepIndicator';
import { Phone, MapPin, IdCard, Check, X, ChevronLeft, ChevronRight, RefreshCw, Save } from 'lucide-react';
import ImageUpload from './ImageUpload';
import RecordActions from './RecordActions';
import RecordPreview from './RecordPreview';
import { isValidPhoneNumber, isValidUID, getCurrentDate, createRecord, getEmptyRecordData } from '@/utils/recordUtils';

interface ValidationState {
  name: boolean;
  uid: boolean;
  phone: boolean;
  emergencyContact: boolean;
}

interface RecordFormProps {
  onAddRecord: (record: MedicalRecord) => void;
  onExportPDF: () => void;
}

const bloodGroups: BloodGroupType[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const steps = [
  { title: "Personal Info", description: "Basic information" },
  { title: "Medical Info", description: "Health details" },
  { title: "Review", description: "Verify information" }
];

const RecordForm = ({ onAddRecord, onExportPDF }: RecordFormProps) => {
  const [formData, setFormData] = useState(getEmptyRecordData());
  const [currentStep, setCurrentStep] = useState(1);
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [validation, setValidation] = useState<ValidationState>({
    name: true,
    uid: true,
    phone: true,
    emergencyContact: true,
  });

  const validateField = (name: string, value: string): boolean => {
    switch (name) {
      case 'name':
        return value.length > 0 && value.length <= 50;
      case 'uid':
        return isValidUID(value);
      case 'phone':
        return value === '' || isValidPhoneNumber(value);
      case 'emergencyContact':
        return value === '' || isValidPhoneNumber(value);
      default:
        return true;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (touchedFields[name]) {
      setValidation(prev => ({
        ...prev,
        [name]: validateField(name, value)
      }));
    }
  };

  const handleBlur = (name: string, value: string) => {
    setTouchedFields(prev => ({ ...prev, [name]: true }));
    setValidation(prev => ({
      ...prev,
      [name]: validateField(name, value)
    }));
  };

  const handleReset = () => {
    setFormData(getEmptyRecordData());
    setCurrentStep(1);
    setTouchedFields({});
    setValidation({
      name: true,
      uid: true,
      phone: true,
      emergencyContact: true,
    });
    toast.info('Form has been reset');
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (imageUrl: string) => {
    setFormData((prev) => ({ ...prev, pictureUrl: imageUrl }));
  };

  const validateStep1 = (): boolean => {
    if (!formData.name || formData.name.length > 50) {
      toast.error('Name is required and must be less than 50 characters');
      return false;
    }

    if (!isValidUID(formData.uid)) {
      toast.error('UID must be exactly 11 digits');
      return false;
    }

    if (formData.phone && !isValidPhoneNumber(formData.phone)) {
      toast.error('Please enter a valid phone number');
      return false;
    }

    if (formData.emergencyContact && !isValidPhoneNumber(formData.emergencyContact)) {
      toast.error('Please enter a valid emergency contact number');
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (currentStep === 1 && !validateStep1()) {
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e: React.FormEvent | Event) => {
    if (e) {
      e.preventDefault();
    }
    const newRecord = createRecord(formData);
    onAddRecord(newRecord);
    toast.success('Record added successfully');
    setFormData(getEmptyRecordData());
    setCurrentStep(1);
  };

  const handleSubmitWithoutEvent = () => {
    const newRecord = createRecord(formData);
    onAddRecord(newRecord);
    toast.success('Record added successfully');
    setFormData(getEmptyRecordData());
    setCurrentStep(1);
  };

  const handlePrint = () => {
    window.print();
    toast.success('Preparing print view...');
  };

  const renderValidationIcon = (fieldName: keyof ValidationState) => {
    if (!touchedFields[fieldName]) return null;
    
    return validation[fieldName] ? (
      <Check className="w-4 h-4 text-green-500" />
    ) : (
      <X className="w-4 h-4 text-destructive" />
    );
  };

  const inputClasses = (fieldName: keyof ValidationState) => cn(
    'h-12 md:h-10 text-base md:text-sm',
    touchedFields[fieldName] && !validation[fieldName] && 'border-destructive focus:border-destructive'
  );

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  return (
    <div className="space-y-8">
      <StepIndicator 
        currentStep={currentStep}
        totalSteps={3}
        steps={steps}
      />
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {currentStep === 1 && (
          <Card className="form-section">
            <CardContent className="p-6 sm:p-8">
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-foreground">Patient Personal Details</h2>
                <p className="text-sm text-muted-foreground">Please fill in the patient's basic information</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InputWrapper
                  id="name"
                  name="name"
                  label="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={(e) => handleBlur('name', e.target.value)}
                  placeholder="Enter full name"
                  maxLength={50}
                  required
                  icon={<IdCard className="h-4 w-4" />}
                  isValid={touchedFields.name && validation.name}
                  error={touchedFields.name && !validation.name ? 
                    "Name is required and must be less than 50 characters" : undefined}
                  className="w-full"
                />

                <InputWrapper
                  id="uid"
                  name="uid"
                  label="UID"
                  value={formData.uid}
                  onChange={handleChange}
                  onBlur={(e) => handleBlur('uid', e.target.value)}
                  placeholder="11-digit UID"
                  required
                  pattern="\d{11}"
                  icon={<IdCard className="h-4 w-4" />}
                  tooltip="Enter your 11-digit Unique Identifier"
                  isValid={touchedFields.uid && validation.uid}
                  error={touchedFields.uid && !validation.uid ? 
                    "UID must be exactly 11 digits" : undefined}
                  className="w-full"
                />

                <InputWrapper
                  id="phone"
                  name="phone"
                  label="Phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={(e) => handleBlur('phone', e.target.value)}
                  placeholder="Phone Number"
                  icon={<Phone className="h-4 w-4" />}
                  isValid={touchedFields.phone && validation.phone}
                  error={touchedFields.phone && !validation.phone ? 
                    "Please enter a valid phone number" : undefined}
                  className="w-full"
                />

                <InputWrapper
                  id="address"
                  name="address"
                  label="Address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter address"
                  icon={<MapPin className="h-4 w-4" />}
                  className="w-full"
                />

                <InputWrapper
                  id="emergencyContact"
                  name="emergencyContact"
                  label="Emergency Contact"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  onBlur={(e) => handleBlur('emergencyContact', e.target.value)}
                  placeholder="Emergency Contact Number"
                  icon={<Phone className="h-4 w-4" />}
                  isValid={touchedFields.emergencyContact && validation.emergencyContact}
                  error={touchedFields.emergencyContact && !validation.emergencyContact ?
                    "Please enter a valid emergency contact number" : undefined}
                  className="w-full"
                />

                <div className="space-y-2">
                  <ImageUpload
                    onImageUpload={handleImageUpload}
                    currentImage={formData.pictureUrl}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 2 && (
          <Card className="form-section animate-slide-up">
            <CardContent className="p-6 sm:p-8">
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-foreground">Medical Information</h2>
                <p className="text-sm text-muted-foreground">Enter patient's health details</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InputWrapper
                  id="height"
                  name="height"
                  label="Height"
                  value={formData.height}
                  onChange={handleChange}
                  placeholder="Enter height"
                />

                <InputWrapper
                  id="weight"
                  name="weight"
                  label="Weight"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="Enter weight"
                />

                <div className="space-y-2">
                  <Label htmlFor="bloodGroup">Blood Group</Label>
                  <Select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onValueChange={(value) => handleSelectChange(value, 'bloodGroup')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                    <SelectContent>
                      {bloodGroups.map((group) => (
                        <SelectItem key={group} value={group}>
                          {group}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 3 && (
          <Card className="form-section animate-slide-up">
            <CardContent className="p-6 sm:p-8">
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-foreground">Review Information</h2>
                <p className="text-sm text-muted-foreground">Please verify all entered information</p>
              </div>
              <RecordPreview record={{
                ...formData,
                id: '',
                createdAt: getCurrentDate()
              }} />
              <div className="space-y-6 mt-8">
                <div className="space-y-2">
                  <Label htmlFor="medicalHistory">Allergies/Medical History</Label>
                  <Textarea
                    id="medicalHistory"
                    name="medicalHistory"
                    value={formData.medicalHistory}
                    onChange={handleChange}
                    placeholder="Enter allergies and medical history"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes/Comments</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Additional notes"
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-center gap-4 pt-4">
          <Button 
            type="button" 
            variant="outline"
            className={cn(
              "transition-all duration-200 hover:bg-secondary/80 min-w-[120px]",
              currentStep === 1 && "invisible"
            )}
            onClick={handleBack}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          <Button
            type="button"
            variant="outline"
            className="transition-all duration-200 hover:bg-secondary/80 min-w-[120px]"
            onClick={handleReset}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          
          {currentStep < 3 ? (
            <Button 
              type="button" 
              className="transition-all duration-200 hover:bg-primary/80 min-w-[120px]"
              onClick={handleNext}
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button 
              type="submit"
              className="transition-all duration-200 hover:bg-primary/80 min-w-[120px]"
            >
              Save Record
              <Save className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </form>

      <RecordActions
        onSave={handleSubmitWithoutEvent}
        onReset={handleReset}
        onExportPDF={onExportPDF}
        onPrint={handlePrint}
      />
    </div>
  );
};

export default RecordForm;
