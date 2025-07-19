import { Country, VisaType, Application } from '@/types';
import countriesData from '@/data/countries.json';
import visaTypesData from '@/data/visaTypes.json';
import applicationsData from '@/data/applications.json';

// Mock API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class MockAPI {
  // Countries
  static async getCountries(): Promise<Country[]> {
    await delay(300);
    return countriesData as Country[];
  }

  static async getCountryById(id: string): Promise<Country | null> {
    await delay(200);
    const country = countriesData.find(c => c.id === id);
    return country ? country as Country : null;
  }

  static async searchCountries(query: string): Promise<Country[]> {
    await delay(300);
    const filtered = countriesData.filter(country =>
      country.name.toLowerCase().includes(query.toLowerCase()) ||
      country.continent.toLowerCase().includes(query.toLowerCase())
    );
    return filtered as Country[];
  }

  // Visa Types
  static async getVisaTypes(): Promise<VisaType[]> {
    await delay(300);
    return visaTypesData as VisaType[];
  }

  static async getVisaTypeById(id: string): Promise<VisaType | null> {
    await delay(200);
    const visaType = visaTypesData.find(vt => vt.id === id);
    return visaType ? visaType as VisaType : null;
  }

  static async getVisaTypesByCountry(countryId: string): Promise<VisaType[]> {
    await delay(300);
    const filtered = visaTypesData.filter(vt => vt.countryId === countryId);
    return filtered as VisaType[];
  }

  // Applications
  static async getApplications(): Promise<Application[]> {
    await delay(300);
    return applicationsData as Application[];
  }

  static async getApplicationById(id: string): Promise<Application | null> {
    await delay(200);
    const application = applicationsData.find(app => app.id === id);
    return application ? application as Application : null;
  }

  static async getUserApplications(userId: string): Promise<Application[]> {
    await delay(300);
    const filtered = applicationsData.filter(app => app.userId === userId);
    return filtered as Application[];
  }

  static async createApplication(applicationData: Partial<Application>): Promise<Application> {
    await delay(500);
    
    const newApplication: Application = {
      id: `app_${Date.now()}`,
      userId: 'user_001', // Mock user ID
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      documents: [],
      ...applicationData
    } as Application;

    // In a real app, this would save to a database
    return newApplication;
  }

  static async updateApplication(id: string, updates: Partial<Application>): Promise<Application | null> {
    await delay(400);
    
    const application = await this.getApplicationById(id);
    if (!application) return null;

    const updatedApplication = {
      ...application,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    // In a real app, this would update the database
    return updatedApplication;
  }

  static async submitApplication(id: string): Promise<Application | null> {
    await delay(600);
    
    const application = await this.getApplicationById(id);
    if (!application) return null;

    const submittedApplication = {
      ...application,
      status: 'submitted' as const,
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // In a real app, this would update the database
    return submittedApplication;
  }

  // Document upload simulation
  static async uploadDocument(file: File, applicationId: string): Promise<string> {
    await delay(1000); // Simulate upload time
    
    // In a real app, this would upload to cloud storage
    const mockUrl = `/documents/${file.name}`;
    return mockUrl;
  }
}