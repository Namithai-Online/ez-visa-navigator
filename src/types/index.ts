export interface Country {
  id: string;
  name: string;
  code: string;
  continent: string;
  visaTypes: string[];
  flagUrl: string;
  description?: string;
  capital?: string;
  currency?: string;
}

export interface VisaType {
  id: string;
  name: string;
  description: string;
  fee: number;
  processingTime: string;
  validity: string;
  maxStay: string;
  requiredDocuments: string[];
  countryId: string;
}

export interface Application {
  id: string;
  userId: string;
  countryId: string;
  visaTypeId: string;
  status: 'draft' | 'submitted' | 'in-review' | 'approved' | 'rejected';
  personalInfo: PersonalInfo;
  travelDetails: TravelDetails;
  documents: DocumentInfo[];
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
  reviewedAt?: string;
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  nationality: string;
  passportNumber: string;
  passportExpiry: string;
  gender: 'male' | 'female' | 'other';
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
  occupation: string;
  address: Address;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface TravelDetails {
  purposeOfVisit: string;
  arrivalDate: string;
  departureDate: string;
  duration: number;
  accommodation: string;
  previousVisits: boolean;
  emergencyContact: EmergencyContact;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email: string;
}

export interface DocumentInfo {
  id: string;
  type: string;
  name: string;
  url: string;
  uploadedAt: string;
  status: 'pending' | 'verified' | 'rejected';
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  applications: Application[];
}