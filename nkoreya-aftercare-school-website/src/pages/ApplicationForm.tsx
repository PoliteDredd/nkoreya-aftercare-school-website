import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import {
  User, Users, School, Heart, Phone, FileUp, ChevronRight, ChevronLeft,
  Loader2, CheckCircle, Upload
} from 'lucide-react';
import { z } from 'zod';

const gradeOptions = [
  { value: 'pre_k', label: 'Pre-Kindergarten' },
  { value: 'kindergarten', label: 'Kindergarten' },
  { value: 'grade_1', label: 'Grade 1' },
  { value: 'grade_2', label: 'Grade 2' },
  { value: 'grade_3', label: 'Grade 3' },
  { value: 'grade_4', label: 'Grade 4' },
  { value: 'grade_5', label: 'Grade 5' },
  { value: 'grade_6', label: 'Grade 6' },
];

const steps = [
  { id: 1, title: 'Student Info', icon: User },
  { id: 2, title: 'Guardian Info', icon: Users },
  { id: 3, title: 'Previous School', icon: School },
  { id: 4, title: 'Medical & Emergency', icon: Heart },
  { id: 5, title: 'Documents', icon: FileUp },
];

const documentTypes = [
  { id: 'birth_certificate', label: 'Birth Certificate', required: true },
  { id: 'transcripts', label: 'School Transcripts', required: false },
  { id: 'medical_records', label: 'Medical Records / Immunization', required: false },
  { id: 'photo', label: 'Passport Photo', required: false },
];

export default function ApplicationForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, { name: string; path: string }>>({});
  
  const [formData, setFormData] = useState({
    // Student
    student_first_name: '',
    student_last_name: '',
    student_date_of_birth: '',
    student_gender: '',
    applying_for_grade: '',
    // Parent
    parent_first_name: '',
    parent_last_name: '',
    parent_email: user?.email || '',
    parent_phone: '',
    parent_relationship: '',
    address: '',
    city: '',
    postal_code: '',
    // Secondary guardian
    secondary_guardian_name: '',
    secondary_guardian_phone: '',
    secondary_guardian_relationship: '',
    // Previous school
    previous_school_name: '',
    previous_school_address: '',
    previous_grade_completed: '',
    reason_for_leaving: '',
    // Medical
    medical_conditions: '',
    allergies: '',
    medications: '',
    special_needs: '',
    // Emergency
    emergency_contact_1_name: '',
    emergency_contact_1_phone: '',
    emergency_contact_1_relationship: '',
    emergency_contact_2_name: '',
    emergency_contact_2_phone: '',
    emergency_contact_2_relationship: '',
  });

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (docType: string, file: File) => {
    if (!user) return;
    
    const fileExt = file.name.split('.').pop();
    const filePath = `${user.id}/${docType}-${Date.now()}.${fileExt}`;
    
    const { error } = await supabase.storage
      .from('application-documents')
      .upload(filePath, file);
    
    if (error) {
      toast.error('Failed to upload file: ' + error.message);
      return;
    }
    
    setUploadedDocs(prev => ({
      ...prev,
      [docType]: { name: file.name, path: filePath }
    }));
    toast.success('File uploaded successfully');
  };

  const nextStep = () => {
    if (currentStep < steps.length) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    if (!user) return;
    setLoading(true);

    try {
      // Insert application
      const { data: application, error: appError } = await supabase
        .from('applications')
        .insert({
          user_id: user.id,
          student_first_name: formData.student_first_name,
          student_last_name: formData.student_last_name,
          student_date_of_birth: formData.student_date_of_birth,
          student_gender: formData.student_gender || null,
          applying_for_grade: formData.applying_for_grade as any,
          parent_first_name: formData.parent_first_name,
          parent_last_name: formData.parent_last_name,
          parent_email: formData.parent_email,
          parent_phone: formData.parent_phone,
          parent_relationship: formData.parent_relationship,
          address: formData.address,
          city: formData.city,
          postal_code: formData.postal_code || null,
          secondary_guardian_name: formData.secondary_guardian_name || null,
          secondary_guardian_phone: formData.secondary_guardian_phone || null,
          secondary_guardian_relationship: formData.secondary_guardian_relationship || null,
          previous_school_name: formData.previous_school_name || null,
          previous_school_address: formData.previous_school_address || null,
          previous_grade_completed: formData.previous_grade_completed || null,
          reason_for_leaving: formData.reason_for_leaving || null,
          medical_conditions: formData.medical_conditions || null,
          allergies: formData.allergies || null,
          medications: formData.medications || null,
          special_needs: formData.special_needs || null,
          emergency_contact_1_name: formData.emergency_contact_1_name,
          emergency_contact_1_phone: formData.emergency_contact_1_phone,
          emergency_contact_1_relationship: formData.emergency_contact_1_relationship,
          emergency_contact_2_name: formData.emergency_contact_2_name || null,
          emergency_contact_2_phone: formData.emergency_contact_2_phone || null,
          emergency_contact_2_relationship: formData.emergency_contact_2_relationship || null,
        })
        .select()
        .single();

      if (appError) throw appError;

      // Insert document records
      const docRecords = Object.entries(uploadedDocs).map(([type, doc]) => ({
        application_id: application.id,
        document_type: type,
        file_name: doc.name,
        file_path: doc.path,
      }));

      console.log('Uploading doc records:', docRecords);

      if (docRecords.length > 0) {
        const { error: docError } = await supabase
          .from('application_documents')
          .insert(docRecords);
        if (docError) {
          console.error('Document insert failed:', docError.message);
          toast.error('Documents failed to save: ' + docError.message);
        } else {
          console.log('Documents saved successfully');
        }
      } else {
        console.log('No documents to save - uploadedDocs:', uploadedDocs);
      }

      // Create notification for parent
      await supabase.from('notifications').insert({
        user_id: user.id,
        title: 'Application Submitted',
        message: `Your application for ${formData.student_first_name} ${formData.student_last_name} has been received. We will review it and get back to you soon.`,
        type: 'submission',
        application_id: application.id,
      });

      toast.success('Application submitted successfully!');
      navigate('/parent/dashboard');
    } catch (error: any) {
      toast.error('Failed to submit application: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20 bg-muted/30 pb-12">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-display text-foreground mb-2">Application Form</h1>
            <p className="text-muted-foreground">Complete all sections to submit your child's application</p>
          </div>

          {/* Steps Progress */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex justify-between relative">
              <div className="absolute top-6 left-0 right-0 h-0.5 bg-border -z-10" />
              {steps.map((step) => {
                const StepIcon = step.icon;
                const isActive = step.id === currentStep;
                const isCompleted = step.id < currentStep;
                return (
                  <button
                    key={step.id}
                    onClick={() => step.id < currentStep && setCurrentStep(step.id)}
                    className={`flex flex-col items-center ${step.id < currentStep ? 'cursor-pointer' : 'cursor-default'}`}
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                        isCompleted
                          ? 'bg-grass text-white'
                          : isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {isCompleted ? <CheckCircle className="w-6 h-6" /> : <StepIcon className="w-5 h-5" />}
                    </div>
                    <span className={`text-xs mt-2 font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                      {step.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Card */}
          <div className="max-w-3xl mx-auto bg-card rounded-2xl shadow-card p-8">
            {/* Step 1: Student Info */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">Student Information</h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <Label>First Name *</Label>
                    <Input
                      value={formData.student_first_name}
                      onChange={(e) => updateField('student_first_name', e.target.value)}
                      placeholder="Child's first name"
                      className="mt-1 rounded-xl"
                    />
                  </div>
                  <div>
                    <Label>Last Name *</Label>
                    <Input
                      value={formData.student_last_name}
                      onChange={(e) => updateField('student_last_name', e.target.value)}
                      placeholder="Child's last name"
                      className="mt-1 rounded-xl"
                    />
                  </div>
                  <div>
                    <Label>Date of Birth *</Label>
                    <Input
                      type="date"
                      value={formData.student_date_of_birth}
                      onChange={(e) => updateField('student_date_of_birth', e.target.value)}
                      className="mt-1 rounded-xl"
                    />
                  </div>
                  <div>
                    <Label>Gender</Label>
                    <Select value={formData.student_gender} onValueChange={(v) => updateField('student_gender', v)}>
                      <SelectTrigger className="mt-1 rounded-xl">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="sm:col-span-2">
                    <Label>Applying for Grade *</Label>
                    <Select value={formData.applying_for_grade} onValueChange={(v) => updateField('applying_for_grade', v)}>
                      <SelectTrigger className="mt-1 rounded-xl">
                        <SelectValue placeholder="Select grade" />
                      </SelectTrigger>
                      <SelectContent>
                        {gradeOptions.map((g) => (
                          <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Guardian Info */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">Parent/Guardian Information</h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <Label>First Name *</Label>
                    <Input
                      value={formData.parent_first_name}
                      onChange={(e) => updateField('parent_first_name', e.target.value)}
                      placeholder="Your first name"
                      className="mt-1 rounded-xl"
                    />
                  </div>
                  <div>
                    <Label>Last Name *</Label>
                    <Input
                      value={formData.parent_last_name}
                      onChange={(e) => updateField('parent_last_name', e.target.value)}
                      placeholder="Your last name"
                      className="mt-1 rounded-xl"
                    />
                  </div>
                  <div>
                    <Label>Email *</Label>
                    <Input
                      type="email"
                      value={formData.parent_email}
                      onChange={(e) => updateField('parent_email', e.target.value)}
                      placeholder="your@email.com"
                      className="mt-1 rounded-xl"
                    />
                  </div>
                  <div>
                    <Label>Phone *</Label>
                    <Input
                      value={formData.parent_phone}
                      onChange={(e) => updateField('parent_phone', e.target.value)}
                      placeholder="(555) 123-4567"
                      className="mt-1 rounded-xl"
                    />
                  </div>
                  <div>
                    <Label>Relationship to Child *</Label>
                    <Select value={formData.parent_relationship} onValueChange={(v) => updateField('parent_relationship', v)}>
                      <SelectTrigger className="mt-1 rounded-xl">
                        <SelectValue placeholder="Select relationship" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mother">Mother</SelectItem>
                        <SelectItem value="father">Father</SelectItem>
                        <SelectItem value="guardian">Legal Guardian</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Postal Code</Label>
                    <Input
                      value={formData.postal_code}
                      onChange={(e) => updateField('postal_code', e.target.value)}
                      placeholder="12345"
                      className="mt-1 rounded-xl"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label>Address *</Label>
                    <Input
                      value={formData.address}
                      onChange={(e) => updateField('address', e.target.value)}
                      placeholder="Street address"
                      className="mt-1 rounded-xl"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label>City *</Label>
                    <Input
                      value={formData.city}
                      onChange={(e) => updateField('city', e.target.value)}
                      placeholder="City"
                      className="mt-1 rounded-xl"
                    />
                  </div>
                </div>

                <div className="border-t pt-6 mt-6">
                  <h3 className="font-medium text-foreground mb-4">Secondary Guardian (Optional)</h3>
                  <div className="grid sm:grid-cols-3 gap-6">
                    <div>
                      <Label>Full Name</Label>
                      <Input
                        value={formData.secondary_guardian_name}
                        onChange={(e) => updateField('secondary_guardian_name', e.target.value)}
                        className="mt-1 rounded-xl"
                      />
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <Input
                        value={formData.secondary_guardian_phone}
                        onChange={(e) => updateField('secondary_guardian_phone', e.target.value)}
                        className="mt-1 rounded-xl"
                      />
                    </div>
                    <div>
                      <Label>Relationship</Label>
                      <Input
                        value={formData.secondary_guardian_relationship}
                        onChange={(e) => updateField('secondary_guardian_relationship', e.target.value)}
                        className="mt-1 rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Previous School */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">Previous School Information</h2>
                <p className="text-muted-foreground text-sm mb-4">
                  If your child has attended school before, please provide details. Leave blank if not applicable.
                </p>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="sm:col-span-2">
                    <Label>School Name</Label>
                    <Input
                      value={formData.previous_school_name}
                      onChange={(e) => updateField('previous_school_name', e.target.value)}
                      placeholder="Previous school name"
                      className="mt-1 rounded-xl"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label>School Address</Label>
                    <Input
                      value={formData.previous_school_address}
                      onChange={(e) => updateField('previous_school_address', e.target.value)}
                      placeholder="School address"
                      className="mt-1 rounded-xl"
                    />
                  </div>
                  <div>
                    <Label>Grade Completed</Label>
                    <Input
                      value={formData.previous_grade_completed}
                      onChange={(e) => updateField('previous_grade_completed', e.target.value)}
                      placeholder="e.g., Grade 2"
                      className="mt-1 rounded-xl"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label>Reason for Leaving</Label>
                    <Textarea
                      value={formData.reason_for_leaving}
                      onChange={(e) => updateField('reason_for_leaving', e.target.value)}
                      placeholder="Please explain the reason for changing schools"
                      className="mt-1 rounded-xl"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Medical & Emergency */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">Medical & Emergency Information</h2>
                
                <div className="space-y-6">
                  <div>
                    <Label>Medical Conditions</Label>
                    <Textarea
                      value={formData.medical_conditions}
                      onChange={(e) => updateField('medical_conditions', e.target.value)}
                      placeholder="List any medical conditions we should be aware of"
                      className="mt-1 rounded-xl"
                    />
                  </div>
                  <div>
                    <Label>Allergies</Label>
                    <Textarea
                      value={formData.allergies}
                      onChange={(e) => updateField('allergies', e.target.value)}
                      placeholder="List any allergies (food, medicine, environmental)"
                      className="mt-1 rounded-xl"
                    />
                  </div>
                  <div>
                    <Label>Current Medications</Label>
                    <Textarea
                      value={formData.medications}
                      onChange={(e) => updateField('medications', e.target.value)}
                      placeholder="List any medications your child takes regularly"
                      className="mt-1 rounded-xl"
                    />
                  </div>
                  <div>
                    <Label>Special Needs / Learning Support</Label>
                    <Textarea
                      value={formData.special_needs}
                      onChange={(e) => updateField('special_needs', e.target.value)}
                      placeholder="Any special needs or learning support requirements"
                      className="mt-1 rounded-xl"
                    />
                  </div>
                </div>

                <div className="border-t pt-6 mt-6">
                  <h3 className="font-medium text-foreground mb-4">Emergency Contacts *</h3>
                  <div className="space-y-6">
                    <div className="bg-muted/50 p-4 rounded-xl">
                      <p className="text-sm font-medium mb-3">Emergency Contact 1 (Required)</p>
                      <div className="grid sm:grid-cols-3 gap-4">
                        <div>
                          <Label>Full Name *</Label>
                          <Input
                            value={formData.emergency_contact_1_name}
                            onChange={(e) => updateField('emergency_contact_1_name', e.target.value)}
                            className="mt-1 rounded-xl"
                          />
                        </div>
                        <div>
                          <Label>Phone *</Label>
                          <Input
                            value={formData.emergency_contact_1_phone}
                            onChange={(e) => updateField('emergency_contact_1_phone', e.target.value)}
                            className="mt-1 rounded-xl"
                          />
                        </div>
                        <div>
                          <Label>Relationship *</Label>
                          <Input
                            value={formData.emergency_contact_1_relationship}
                            onChange={(e) => updateField('emergency_contact_1_relationship', e.target.value)}
                            className="mt-1 rounded-xl"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-muted/50 p-4 rounded-xl">
                      <p className="text-sm font-medium mb-3">Emergency Contact 2 (Optional)</p>
                      <div className="grid sm:grid-cols-3 gap-4">
                        <div>
                          <Label>Full Name</Label>
                          <Input
                            value={formData.emergency_contact_2_name}
                            onChange={(e) => updateField('emergency_contact_2_name', e.target.value)}
                            className="mt-1 rounded-xl"
                          />
                        </div>
                        <div>
                          <Label>Phone</Label>
                          <Input
                            value={formData.emergency_contact_2_phone}
                            onChange={(e) => updateField('emergency_contact_2_phone', e.target.value)}
                            className="mt-1 rounded-xl"
                          />
                        </div>
                        <div>
                          <Label>Relationship</Label>
                          <Input
                            value={formData.emergency_contact_2_relationship}
                            onChange={(e) => updateField('emergency_contact_2_relationship', e.target.value)}
                            className="mt-1 rounded-xl"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Documents */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">Upload Documents</h2>
                <p className="text-muted-foreground text-sm mb-4">
                  Please upload the required documents. Accepted formats: PDF, JPG, PNG (max 10MB each)
                </p>

                <div className="space-y-4">
                  {documentTypes.map((doc) => (
                    <div key={doc.id} className="border rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">
                            {doc.label} {doc.required && <span className="text-destructive">*</span>}
                          </p>
                          {uploadedDocs[doc.id] && (
                            <p className="text-sm text-grass flex items-center gap-1 mt-1">
                              <CheckCircle className="w-4 h-4" />
                              {uploadedDocs[doc.id].name}
                            </p>
                          )}
                        </div>
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload(doc.id, file);
                            }}
                          />
                          <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                            <Upload className="w-4 h-4" />
                            <span className="text-sm">{uploadedDocs[doc.id] ? 'Replace' : 'Upload'}</span>
                          </div>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-sunshine/10 rounded-xl p-4 mt-6">
                  <p className="text-sm text-foreground">
                    <strong>Note:</strong> You can submit your application now and upload additional documents later.
                    Our admissions team may request additional documents if needed.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="rounded-xl"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>

              {currentStep < steps.length ? (
                <Button onClick={nextStep} className="rounded-xl">
                  Next Step
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  variant="hero"
                  className="rounded-xl"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Submit Application
                      <CheckCircle className="w-4 h-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
