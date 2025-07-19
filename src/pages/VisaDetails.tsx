import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MockAPI } from '@/lib/api';
import { Country, VisaType } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { 
  Clock, 
  DollarSign, 
  Calendar,
  FileText,
  ArrowLeft,
  CheckCircle,
  Info,
  Globe
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function VisaDetails() {
  const { id } = useParams<{ id: string }>();
  const [visaType, setVisaType] = useState<VisaType | null>(null);
  const [country, setCountry] = useState<Country | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVisaDetails = async () => {
      if (!id) return;
      
      try {
        const visa = await MockAPI.getVisaTypeById(id);
        if (visa) {
          setVisaType(visa);
          const countryData = await MockAPI.getCountryById(visa.countryId);
          setCountry(countryData);
        }
      } catch (error) {
        console.error('Error loading visa details:', error);
      } finally {
        setLoading(false);
      }
    };

    loadVisaDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-32 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64" />
            <Skeleton className="h-48" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-80" />
          </div>
        </div>
      </div>
    );
  }

  if (!visaType || !country) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Visa not found</h1>
          <p className="text-muted-foreground mb-6">The visa you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/visa">Browse All Visas</Link>
          </Button>
        </div>
      </div>
    );
  }

  const documentTypes = {
    'passport': 'Valid Passport',
    'photo': 'Passport Photo',
    'bank-statement': 'Bank Statement',
    'itinerary': 'Travel Itinerary',
    'invitation-letter': 'Invitation Letter',
    'company-letter': 'Company Letter',
    'hotel-booking': 'Hotel Booking',
    'ticket': 'Flight Ticket'
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <Button variant="ghost" asChild className="mb-6">
        <Link to="/visa" className="flex items-center space-x-2">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Visas</span>
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div className="flex items-start space-x-4">
            <img 
              src={country.flagUrl} 
              alt={`${country.name} flag`}
              className="w-16 h-12 rounded object-cover"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{visaType.name}</h1>
              <p className="text-xl text-muted-foreground">{country.name}</p>
              <p className="text-muted-foreground mt-2">{visaType.description}</p>
            </div>
          </div>

          {/* Visa Details */}
          <Card>
            <CardHeader>
              <CardTitle>Visa Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-3">
                  <DollarSign className="w-5 h-5 text-travel-blue" />
                  <div>
                    <p className="font-medium">Visa Fee</p>
                    <p className="text-2xl font-bold text-travel-blue">${visaType.fee}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-travel-teal" />
                  <div>
                    <p className="font-medium">Processing Time</p>
                    <p className="text-lg">{visaType.processingTime}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-travel-sky" />
                  <div>
                    <p className="font-medium">Validity Period</p>
                    <p className="text-lg">{visaType.validity}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Globe className="w-5 h-5 text-travel-gold" />
                  <div>
                    <p className="font-medium">Maximum Stay</p>
                    <p className="text-lg">{visaType.maxStay}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Required Documents */}
          <Card>
            <CardHeader>
              <CardTitle>Required Documents</CardTitle>
              <CardDescription>
                Please prepare the following documents before starting your application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {visaType.requiredDocuments.map((doc, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-success" />
                    <span>{documentTypes[doc as keyof typeof documentTypes] || doc}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Important Information */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Processing times may vary depending on your nationality and current application volume. 
              We recommend applying at least 2 weeks before your intended travel date.
            </AlertDescription>
          </Alert>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Application Card */}
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Start Application
                <Badge variant="secondary">${visaType.fee}</Badge>
              </CardTitle>
              <CardDescription>
                Complete your visa application in just a few steps
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Visa Fee:</span>
                  <span>${visaType.fee}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Service Fee:</span>
                  <span>$15</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total:</span>
                  <span>${visaType.fee + 15}</span>
                </div>
              </div>
              
              <Button asChild className="w-full bg-gradient-primary">
                <Link to={`/apply?visa=${visaType.id}&country=${country.id}`}>
                  Start Application
                </Link>
              </Button>
              
              <p className="text-xs text-muted-foreground text-center">
                Secure payment • 256-bit SSL encryption
              </p>
            </CardContent>
          </Card>

          {/* Country Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="w-5 h-5" />
                <span>About {country.name}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Capital:</span>
                <span>{country.capital}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Currency:</span>
                <span>{country.currency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Continent:</span>
                <span>{country.continent}</span>
              </div>
              <Separator />
              <p className="text-sm text-muted-foreground">
                {country.description}
              </p>
            </CardContent>
          </Card>

          {/* Help Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Need Help?</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-2" />
                Document Checklist
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Info className="w-4 h-4 mr-2" />
                Application Guide
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Clock className="w-4 h-4 mr-2" />
                Track Application
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}