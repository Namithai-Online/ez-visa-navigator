import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { MockAPI } from '@/lib/api';
import { SMVKonveyorAPI } from '@/lib/smv-api';
import { Country, VisaType, PersonalInfo, TravelDetails } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  ArrowRight, 
  User, 
  Calendar,
  Upload,
  CreditCard,
  CheckCircle,
  FileText,
  Clock
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';

type Step = 'personal' | 'travel' | 'documents' | 'review' | 'payment' | 'confirmation';

export default function Apply() {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState<Step>('personal');
  const [country, setCountry] = useState<Country | null>(null);
  const [visaType, setVisaType] = useState<VisaType | null>(null);
  const [loading, setLoading] = useState(true);
  const [documentChecklist, setDocumentChecklist] = useState<any[]>([]);
  
  // Form data
  const [personalInfo, setPersonalInfo] = useState<Partial<PersonalInfo>>({});
  const [travelDetails, setTravelDetails] = useState<Partial<TravelDetails>>({});
  const [uploadedDocuments, setUploadedDocuments] = useState<{[key: string]: string}>({});

  useEffect(() => {
    const loadData = async () => {
      const visaId = searchParams.get('visa');
      const countryId = searchParams.get('country');
      
      if (visaId && countryId) {
        try {
          const [visaData, countryData, checklists] = await Promise.all([
            MockAPI.getVisaTypeById(visaId),
            MockAPI.getCountryById(countryId),
            SMVKonveyorAPI.getDocumentChecklist(countryId, visaId)
          ]);
          setVisaType(visaData);
          setCountry(countryData);
          setDocumentChecklist(checklists);
        } catch (error) {
          console.error('Error loading application data:', error);
        }
      }
      setLoading(false);
    };

    loadData();
  }, [searchParams]);

  const steps: { key: Step; title: string; icon: React.ComponentType<any> }[] = [
    { key: 'personal', title: 'Personal Info', icon: User },
    { key: 'travel', title: 'Travel Details', icon: Calendar },
    { key: 'documents', title: 'Documents', icon: Upload },
    { key: 'review', title: 'Review', icon: FileText },
    { key: 'payment', title: 'Payment', icon: CreditCard }
  ];

  const currentStepIndex = steps.findIndex(step => step.key === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].key);
    } else {
      // Handle submission
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].key);
    }
  };

  const handleSubmit = async () => {
    setCurrentStep('confirmation');
    toast({
      title: "Application Submitted!",
      description: "Your visa application has been submitted successfully.",
    });
  };

  const handleFileUpload = (documentId: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      const fileName = files[0].name;
      setUploadedDocuments(prev => ({...prev, [documentId]: fileName}));
      toast({
        title: "Document uploaded",
        description: `${fileName} uploaded successfully.`,
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!visaType || !country) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Invalid Application</h1>
          <p className="text-muted-foreground mb-6">Please select a visa type to continue.</p>
          <Button asChild>
            <Link to="/visa">Browse Visas</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (currentStep === 'confirmation') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-24 h-24 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Application Submitted!</h1>
            <p className="text-xl text-muted-foreground">
              Your {visaType.name} application for {country.name} has been submitted successfully.
            </p>
          </div>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Application Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Application ID:</span>
                <span className="font-mono">APP-{Date.now()}</span>
              </div>
              <div className="flex justify-between">
                <span>Visa Type:</span>
                <span>{visaType.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Country:</span>
                <span>{country.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Processing Time:</span>
                <span>{visaType.processingTime}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <Badge>Submitted</Badge>
              </div>
            </CardContent>
          </Card>
          
          <div className="space-y-4">
            <Button asChild className="w-full">
              <Link to="/dashboard">View in Dashboard</Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link to="/visa">Apply for Another Visa</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link to={`/visa/${visaType.id}`}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Visa Details
            </Link>
          </Button>
          
          <div className="flex items-center space-x-4 mb-6">
            <img 
              src={country.flagUrl} 
              alt={`${country.name} flag`}
              className="w-12 h-8 rounded object-cover"
            />
            <div>
              <h1 className="text-3xl font-bold">{visaType.name} Application</h1>
              <p className="text-muted-foreground">{country.name}</p>
            </div>
          </div>
          
          {/* Progress */}
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Step {currentStepIndex + 1} of {steps.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} />
            
            <div className="flex justify-between">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === currentStepIndex;
                const isCompleted = index < currentStepIndex;
                
                return (
                  <div key={step.key} className={`flex flex-col items-center space-y-2 ${
                    isActive ? 'text-primary' : isCompleted ? 'text-success' : 'text-muted-foreground'
                  }`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isActive ? 'bg-primary text-white' : 
                      isCompleted ? 'bg-success text-white' : 'bg-muted'
                    }`}>
                      {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                    </div>
                    <span className="text-xs font-medium">{step.title}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Form Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {(() => {
                const Icon = steps[currentStepIndex].icon;
                return <Icon className="w-5 h-5" />;
              })()}
              <span>{steps[currentStepIndex].title}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentStep === 'personal' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName"
                    value={personalInfo.firstName || ''}
                    onChange={(e) => setPersonalInfo(prev => ({...prev, firstName: e.target.value}))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName"
                    value={personalInfo.lastName || ''}
                    onChange={(e) => setPersonalInfo(prev => ({...prev, lastName: e.target.value}))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email"
                    type="email"
                    value={personalInfo.email || ''}
                    onChange={(e) => setPersonalInfo(prev => ({...prev, email: e.target.value}))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone"
                    value={personalInfo.phone || ''}
                    onChange={(e) => setPersonalInfo(prev => ({...prev, phone: e.target.value}))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passportNumber">Passport Number</Label>
                  <Input 
                    id="passportNumber"
                    value={personalInfo.passportNumber || ''}
                    onChange={(e) => setPersonalInfo(prev => ({...prev, passportNumber: e.target.value}))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nationality">Nationality</Label>
                  <Select value={personalInfo.nationality || ''} onValueChange={(value) => setPersonalInfo(prev => ({...prev, nationality: value}))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select nationality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="american">American</SelectItem>
                      <SelectItem value="british">British</SelectItem>
                      <SelectItem value="canadian">Canadian</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {currentStep === 'travel' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="arrivalDate">Arrival Date</Label>
                    <Input 
                      id="arrivalDate"
                      type="date"
                      value={travelDetails.arrivalDate || ''}
                      onChange={(e) => setTravelDetails(prev => ({...prev, arrivalDate: e.target.value}))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="departureDate">Departure Date</Label>
                    <Input 
                      id="departureDate"
                      type="date"
                      value={travelDetails.departureDate || ''}
                      onChange={(e) => setTravelDetails(prev => ({...prev, departureDate: e.target.value}))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="purposeOfVisit">Purpose of Visit</Label>
                  <Select value={travelDetails.purposeOfVisit || ''} onValueChange={(value) => setTravelDetails(prev => ({...prev, purposeOfVisit: value}))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select purpose" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tourism">Tourism</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="transit">Transit</SelectItem>
                      <SelectItem value="medical">Medical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accommodation">Accommodation Details</Label>
                  <Textarea 
                    id="accommodation"
                    placeholder="Hotel name and address, or host details"
                    value={travelDetails.accommodation || ''}
                    onChange={(e) => setTravelDetails(prev => ({...prev, accommodation: e.target.value}))}
                  />
                </div>
              </div>
            )}

            {currentStep === 'documents' && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-4">Required Documents</h3>
                  <p className="text-muted-foreground mb-6">
                    Please upload the following documents for your {visaType.name} application:
                  </p>
                </div>
                
                {documentChecklist.length > 0 ? (
                  <div className="space-y-6">
                    {documentChecklist.map((checklist, checklistIndex) => (
                      <div key={checklistIndex}>
                        {checklist.categories.map((category: any, categoryIndex: number) => (
                          <div key={categoryIndex} className="mb-8">
                            <div className="flex items-center mb-4">
                              <span className="text-2xl mr-3">{category.icon}</span>
                              <h4 className="text-lg font-semibold">{category.name}</h4>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {category.documents.map((doc: any, docIndex: number) => {
                                const docKey = `${category.id}-${doc.id}`;
                                const isUploaded = uploadedDocuments[docKey];
                                
                                return (
                                  <div 
                                    key={docIndex} 
                                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                                      isUploaded 
                                        ? 'border-green-300 bg-green-50' 
                                        : doc.required 
                                          ? 'border-red-300 bg-red-50' 
                                          : 'border-gray-300 bg-gray-50'
                                    }`}
                                  >
                                    <div className="flex justify-between items-start mb-2">
                                      <h5 className="font-medium text-left flex-1">{doc.name}</h5>
                                      {doc.required && !isUploaded && (
                                        <Badge variant="destructive" className="ml-2">Required</Badge>
                                      )}
                                      {isUploaded && (
                                        <CheckCircle className="w-5 h-5 text-green-600 ml-2" />
                                      )}
                                    </div>
                                    
                                    {doc.description && (
                                      <p className="text-xs text-muted-foreground text-left mb-3">{doc.description}</p>
                                    )}
                                    
                                    <div className="space-y-2">
                                      <Input 
                                        type="file" 
                                        onChange={handleFileUpload(docKey)}
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        className="text-sm"
                                      />
                                      <p className="text-xs text-muted-foreground">PDF, JPG, PNG (Max 5MB)</p>
                                      
                                      {doc.sampleUrl && (
                                        <Button variant="link" size="sm" className="text-xs">
                                          View Sample
                                        </Button>
                                      )}
                                    </div>
                                    
                                    {isUploaded && (
                                      <p className="text-xs text-green-600 mt-2 font-medium">
                                        ✓ {isUploaded}
                                      </p>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                    
                    {/* Upload Summary */}
                    {Object.keys(uploadedDocuments).length > 0 && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-medium text-blue-800 mb-2">Upload Summary</h4>
                        <div className="text-sm text-blue-700">
                          <p>{Object.keys(uploadedDocuments).length} document(s) uploaded</p>
                          {documentChecklist[0] && (
                            <p className="mt-1">
                              Required documents: {
                                documentChecklist[0].categories.reduce((acc: number, cat: any) => 
                                  acc + cat.documents.filter((doc: any) => doc.required).length, 0
                                )
                              } | 
                              Uploaded required: {
                                Object.keys(uploadedDocuments).filter(key => {
                                  const [catId, docId] = key.split('-');
                                  return documentChecklist[0].categories
                                    .find((cat: any) => cat.id === catId)?.documents
                                    .find((doc: any) => doc.id === docId)?.required;
                                }).length
                              }
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  // Fallback to basic document list if checklist not available
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {visaType.requiredDocuments.map((doc, index) => (
                      <div key={index} className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                        <h4 className="font-medium mb-2">{doc.charAt(0).toUpperCase() + doc.slice(1).replace('-', ' ')}</h4>
                        <Input 
                          type="file" 
                          className="mb-2"
                          onChange={handleFileUpload(doc)}
                          accept=".pdf,.jpg,.jpeg,.png"
                        />
                        <p className="text-xs text-muted-foreground">PDF, JPG, PNG (Max 5MB)</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {currentStep === 'review' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Review Your Application</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-medium mb-4">Personal Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Name:</span>
                        <span>{personalInfo.firstName} {personalInfo.lastName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Email:</span>
                        <span>{personalInfo.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Passport:</span>
                        <span>{personalInfo.passportNumber}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-4">Travel Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Purpose:</span>
                        <span>{travelDetails.purposeOfVisit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Arrival:</span>
                        <span>{travelDetails.arrivalDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Departure:</span>
                        <span>{travelDetails.departureDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-medium mb-4">Payment Summary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Visa Fee:</span>
                      <span>${visaType.fee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Service Fee:</span>
                      <span>$15</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-medium text-lg">
                      <span>Total:</span>
                      <span>${visaType.fee + 15}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 'payment' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Payment Information</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800">
                    <strong>Demo Mode:</strong> This is a demonstration. No actual payment will be processed.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input id="expiryDate" placeholder="MM/YY" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input id="cvv" placeholder="123" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardName">Cardholder Name</Label>
                    <Input id="cardName" placeholder="John Doe" />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={currentStepIndex === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          <Button onClick={handleNext}>
            {currentStepIndex === steps.length - 1 ? 'Submit Application' : 'Next'}
            {currentStepIndex < steps.length - 1 && <ArrowRight className="w-4 h-4 ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  );
}