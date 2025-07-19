import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MockAPI } from '@/lib/api';
import { Application, Country, VisaType } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  Globe,
  User,
  MapPin,
  Phone,
  Mail,
  AlertCircle,
  Download,
  Eye
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ApplicationDetails() {
  const { id } = useParams<{ id: string }>();
  const [application, setApplication] = useState<Application | null>(null);
  const [country, setCountry] = useState<Country | null>(null);
  const [visaType, setVisaType] = useState<VisaType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadApplicationDetails = async () => {
      if (!id) return;
      
      try {
        const app = await MockAPI.getApplicationById(id);
        if (app) {
          setApplication(app);
          const [countryData, visaData] = await Promise.all([
            MockAPI.getCountryById(app.countryId),
            MockAPI.getVisaTypeById(app.visaTypeId)
          ]);
          setCountry(countryData);
          setVisaType(visaData);
        }
      } catch (error) {
        console.error('Error loading application details:', error);
      } finally {
        setLoading(false);
      }
    };

    loadApplicationDetails();
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

  if (!application || !country || !visaType) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Application not found</h1>
          <p className="text-muted-foreground mb-6">The application you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-success text-success-foreground';
      case 'rejected': return 'bg-destructive text-destructive-foreground';
      case 'submitted': return 'bg-travel-blue text-white';
      case 'in-review': return 'bg-travel-gold text-white';
      case 'draft': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getProgressValue = (status: string) => {
    switch (status) {
      case 'draft': return 25;
      case 'submitted': return 50;
      case 'in-review': return 75;
      case 'approved': return 100;
      case 'rejected': return 100;
      default: return 0;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <Button variant="ghost" asChild className="mb-6">
        <Link to="/dashboard" className="flex items-center space-x-2">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
      </Button>

      <Tabs defaultValue="overview" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
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
                <p className="text-sm text-muted-foreground mt-1">Application ID: {application.id}</p>
              </div>
              <Badge className={getStatusColor(application.status)}>
                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
              </Badge>
            </div>

            {/* Status Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Application Status</CardTitle>
                <CardDescription>
                  Track your application progress
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Progress value={getProgressValue(application.status)} className="w-full" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Submitted</span>
                  <span>Under Review</span>
                  <span>Decision</span>
                </div>
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Personal Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium">Full Name</p>
                    <p className="text-muted-foreground">{application.personalInfo.firstName} {application.personalInfo.lastName}</p>
                  </div>
                  <div>
                    <p className="font-medium">Date of Birth</p>
                    <p className="text-muted-foreground">{formatDate(application.personalInfo.dateOfBirth)}</p>
                  </div>
                  <div>
                    <p className="font-medium">Nationality</p>
                    <p className="text-muted-foreground">{application.personalInfo.nationality}</p>
                  </div>
                  <div>
                    <p className="font-medium">Passport Number</p>
                    <p className="text-muted-foreground">{application.personalInfo.passportNumber}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Travel Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="w-5 h-5" />
                  <span>Travel Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium">Purpose of Visit</p>
                    <p className="text-muted-foreground">{application.travelDetails.purposeOfVisit}</p>
                  </div>
                  <div>
                    <p className="font-medium">Duration</p>
                    <p className="text-muted-foreground">{application.travelDetails.duration} days</p>
                  </div>
                  <div>
                    <p className="font-medium">Arrival Date</p>
                    <p className="text-muted-foreground">{formatDate(application.travelDetails.arrivalDate)}</p>
                  </div>
                  <div>
                    <p className="font-medium">Departure Date</p>
                    <p className="text-muted-foreground">{formatDate(application.travelDetails.departureDate)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>Submitted Documents</span>
                </CardTitle>
                <CardDescription>
                  All documents uploaded for this application
                </CardDescription>
              </CardHeader>
              <CardContent>
                {application.documents.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No documents uploaded yet</p>
                ) : (
                  <div className="space-y-4">
                    {application.documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{doc.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Uploaded {formatDate(doc.uploadedAt)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge variant={doc.status === 'verified' ? 'default' : doc.status === 'rejected' ? 'destructive' : 'secondary'}>
                            {doc.status}
                          </Badge>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Application Timeline</span>
                </CardTitle>
                <CardDescription>
                  Track all activities on your application
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-travel-blue text-white">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Application Created</p>
                      <p className="text-sm text-muted-foreground">{formatDate(application.createdAt)}</p>
                    </div>
                  </div>
                  
                  {application.submittedAt && (
                    <div className="flex items-start space-x-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-travel-gold text-white">
                        <CheckCircle className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Application Submitted</p>
                        <p className="text-sm text-muted-foreground">{formatDate(application.submittedAt)}</p>
                      </div>
                    </div>
                  )}
                  
                  {application.reviewedAt && (
                    <div className="flex items-start space-x-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-success text-white">
                        <CheckCircle className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Application Reviewed</p>
                        <p className="text-sm text-muted-foreground">{formatDate(application.reviewedAt)}</p>
                      </div>
                    </div>
                  )}
                  
                  {application.status === 'draft' && (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Complete and submit your application to begin processing.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Info Card */}
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Application Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Visa Fee:</span>
                  <span>${visaType.fee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service Fee:</span>
                  <span>$15</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Processing Time:</span>
                  <span>{visaType.processingTime}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total Paid:</span>
                  <span>${visaType.fee + 15}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Phone className="w-5 h-5" />
                <span>Contact Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{application.personalInfo.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{application.personalInfo.phone}</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">
                  {application.personalInfo.address.city}, {application.personalInfo.address.country}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {application.status === 'draft' && (
                <Button asChild className="w-full">
                  <Link to={`/apply?applicationId=${application.id}`}>
                    Continue Application
                  </Link>
                </Button>
              )}
              <Button variant="outline" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Download Application
              </Button>
              <Button variant="outline" className="w-full">
                <Mail className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </Tabs>
    </div>
  );
}