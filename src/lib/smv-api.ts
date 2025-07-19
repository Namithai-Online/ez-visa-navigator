// Mock SMV Konveyor API integration
// This simulates the SMV API for document checklist functionality

export interface DocumentRequirement {
  id: string;
  name: string;
  required: boolean;
  description?: string;
  sampleUrl?: string;
}

export interface DocumentCategory {
  id: string;
  name: string;
  icon: string;
  documents: DocumentRequirement[];
}

export interface VisaDocumentChecklist {
  countryId: string;
  countryName: string;
  visaTypeId: string;
  visaTypeName: string;
  categories: DocumentCategory[];
  lastUpdated: string;
}

class SMVKonveyorAPI {
  private static baseUrl = 'https://api.smvkonveyor.com'; // Mock URL
  
  // Mock document requirements data
  private static mockDocumentData: Record<string, VisaDocumentChecklist[]> = {
    'uae': [
      {
        countryId: 'uae',
        countryName: 'United Arab Emirates',
        visaTypeId: 'uae-tourist',
        visaTypeName: 'Tourist Visa',
        lastUpdated: '2024-01-15',
        categories: [
          {
            id: 'mandatory',
            name: 'Mandatory docs',
            icon: 'FileText',
            documents: [
              { id: 'passport', name: 'Valid Passport', required: true, description: 'Passport with at least 6 months validity' },
              { id: 'passport-copy', name: 'Passport front and back pages', required: true },
              { id: 'photo', name: 'Passport Size Photo', required: true, description: '2 recent passport size photos' },
              { id: 'application-form', name: 'Visa Application Form', required: true },
              { id: 'flight-ticket', name: 'Flight Reservation', required: true },
              { id: 'hotel-booking', name: 'Hotel Booking Confirmation', required: true }
            ]
          },
          {
            id: 'financial',
            name: 'Financial Documents',
            icon: 'CreditCard',
            documents: [
              { id: 'bank-statement', name: 'Bank Statement (3 months)', required: true },
              { id: 'salary-certificate', name: 'Salary Certificate', required: false },
              { id: 'income-tax', name: 'Income Tax Returns', required: false }
            ]
          },
          {
            id: 'employed',
            name: 'For Employed',
            icon: 'Briefcase',
            documents: [
              { id: 'employment-letter', name: 'Employment Letter', required: true },
              { id: 'noc', name: 'No Objection Certificate', required: true },
              { id: 'leave-approval', name: 'Leave Approval Letter', required: false }
            ]
          },
          {
            id: 'student',
            name: 'For Students',
            icon: 'GraduationCap',
            documents: [
              { id: 'student-id', name: 'Student ID Card', required: true },
              { id: 'enrollment-letter', name: 'College Enrollment Letter', required: true },
              { id: 'parent-consent', name: 'Parent Consent Letter', required: true }
            ]
          }
        ]
      }
    ],
    'singapore': [
      {
        countryId: 'singapore',
        countryName: 'Singapore',
        visaTypeId: 'sg-tourist',
        visaTypeName: 'Tourist Visa',
        lastUpdated: '2024-01-15',
        categories: [
          {
            id: 'mandatory',
            name: 'Mandatory docs',
            icon: 'FileText',
            documents: [
              { id: 'passport', name: 'Valid Passport', required: true },
              { id: 'form14a', name: 'Form 14A', required: true },
              { id: 'photo', name: 'Passport Photo', required: true },
              { id: 'itinerary', name: 'Detailed Itinerary', required: true },
              { id: 'accommodation', name: 'Accommodation Proof', required: true }
            ]
          },
          {
            id: 'financial',
            name: 'Financial Proof',
            icon: 'CreditCard',
            documents: [
              { id: 'bank-statement', name: 'Bank Statement (6 months)', required: true },
              { id: 'income-proof', name: 'Income Proof', required: true },
              { id: 'sponsorship', name: 'Sponsorship Letter (if applicable)', required: false }
            ]
          }
        ]
      }
    ]
  };

  static async getDocumentChecklist(
    countryId: string, 
    visaTypeId?: string
  ): Promise<VisaDocumentChecklist[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const countryData = this.mockDocumentData[countryId] || [];
    
    if (visaTypeId) {
      return countryData.filter(item => item.visaTypeId === visaTypeId);
    }
    
    return countryData;
  }

  static async downloadDocumentChecklist(
    countryId: string, 
    visaTypeId: string
  ): Promise<string> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return mock download URL
    return `https://api.smvkonveyor.com/downloads/${countryId}-${visaTypeId}-checklist.pdf`;
  }

  static async getRequiredDocuments(
    countryId: string,
    visaTypeId: string,
    applicantProfile?: {
      employmentStatus?: 'employed' | 'student' | 'self-employed' | 'retired';
      maritalStatus?: 'single' | 'married';
      hasMinors?: boolean;
    }
  ): Promise<DocumentRequirement[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const checklists = await this.getDocumentChecklist(countryId, visaTypeId);
    if (checklists.length === 0) return [];
    
    const checklist = checklists[0];
    let allDocuments: DocumentRequirement[] = [];
    
    // Always include mandatory documents
    const mandatoryCategory = checklist.categories.find(cat => cat.id === 'mandatory');
    if (mandatoryCategory) {
      allDocuments.push(...mandatoryCategory.documents);
    }
    
    // Include profile-specific documents
    if (applicantProfile?.employmentStatus) {
      const employmentCategory = checklist.categories.find(
        cat => cat.id === applicantProfile.employmentStatus
      );
      if (employmentCategory) {
        allDocuments.push(...employmentCategory.documents);
      }
    }
    
    return allDocuments;
  }
}

export { SMVKonveyorAPI };