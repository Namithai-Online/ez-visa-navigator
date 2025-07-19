import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MockAPI } from '@/lib/api';
import { Application, Country, VisaType } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  Eye,
  Download,
  Plus,
  Calendar,
  Globe
} from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export default function Dashboard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [visaTypes, setVisaTypes] = useState<VisaType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [appsData, countriesData, visaTypesData] = await Promise.all([
          MockAPI.getUserApplications('user_001'), // Mock user ID
          MockAPI.getCountries(),
          MockAPI.getVisaTypes()
        ]);
        
        setApplications(appsData);
        setCountries(countriesData);
        setVisaTypes(visaTypesData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const getCountryById = (id: string) => countries.find(c => c.id === id);
  const getVisaTypeById = (id: string) => visaTypes.find(v => v.id === id);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-destructive" />;
      case 'in-review':
        return <Clock className="w-5 h-5 text-warning" />;
      case 'submitted':
        return <FileText className="w-5 h-5 text-primary" />;
      default:
        return <AlertCircle className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "destructive" | "outline" | "secondary"> = {
      'approved': 'default',
      'rejected': 'destructive',
      'in-review': 'secondary',
      'submitted': 'outline',
      'draft': 'secondary'
    };
    
    return (
      <Badge variant={variants[status] || 'secondary'}>
        {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
      </Badge>
    );
  };

  const filterApplications = (status?: string) => {
    if (!status) return applications;
    return applications.filter(app => app.status === status);
  };

  const stats = {
    total: applications.length,
    pending: filterApplications('submitted').length + filterApplications('in-review').length,
    approved: filterApplications('approved').length,
    draft: filterApplications('draft').length
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="space-y-4">
            <Skeleton className="h-8 w-64" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-24" />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Dashboard</h1>
          <p className="text-muted-foreground">Track and manage your visa applications</p>
        </div>
        <Button asChild>
          <Link to="/visa">
            <Plus className="w-4 h-4 mr-2" />
            New Application
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approved}</div>
            <p className="text-xs text-muted-foreground">Ready to travel</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Draft</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.draft}</div>
            <p className="text-xs text-muted-foreground">Incomplete</p>
          </CardContent>
        </Card>
      </div>

      {/* Applications */}
      <Card>
        <CardHeader>
          <CardTitle>Your Applications</CardTitle>
          <CardDescription>
            View and manage all your visa applications in one place
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
              <TabsTrigger value="draft">Draft ({stats.draft})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
              <TabsTrigger value="approved">Approved ({stats.approved})</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4 mt-6">
              {applications.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                    <FileText className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No applications yet</h3>
                  <p className="text-muted-foreground mb-6">Start your visa journey by applying for your first visa</p>
                  <Button asChild>
                    <Link to="/visa">
                      <Plus className="w-4 h-4 mr-2" />
                      Apply for Visa
                    </Link>
                  </Button>
                </div>
              ) : (
                applications.map((application) => {
                  const country = getCountryById(application.countryId);
                  const visaType = getVisaTypeById(application.visaTypeId);
                  
                  return (
                    <Card key={application.id} className="hover:shadow-medium transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            {country && (
                              <img 
                                src={country.flagUrl} 
                                alt={`${country.name} flag`}
                                className="w-12 h-8 rounded object-cover mt-1"
                              />
                            )}
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="text-lg font-semibold">
                                  {visaType?.name} - {country?.name}
                                </h3>
                                {getStatusBadge(application.status)}
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center space-x-2">
                                  <Calendar className="w-4 h-4" />
                                  <span>Applied: {new Date(application.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Globe className="w-4 h-4" />
                                  <span>ID: {application.id}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  {getStatusIcon(application.status)}
                                  <span>{application.status.charAt(0).toUpperCase() + application.status.slice(1).replace('-', ' ')}</span>
                                </div>
                              </div>
                              
                              {application.status === 'approved' && (
                                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                                  <p className="text-sm text-green-800">
                                    🎉 Congratulations! Your visa has been approved. You can now download your e-visa.
                                  </p>
                                </div>
                              )}
                              
                              {application.status === 'in-review' && (
                                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                  <p className="text-sm text-blue-800">
                                    📋 Your application is currently under review. We'll notify you once there's an update.
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </Button>
                            {application.status === 'approved' && (
                              <Button size="sm">
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </Button>
                            )}
                            {application.status === 'draft' && (
                              <Button size="sm" asChild>
                                <Link to={`/apply?visa=${application.visaTypeId}&country=${application.countryId}`}>
                                  Continue
                                </Link>
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </TabsContent>
            
            {['draft', 'pending', 'approved', 'rejected'].map(status => (
              <TabsContent key={status} value={status} className="space-y-4 mt-6">
                {filterApplications(status === 'pending' ? undefined : status).filter(app => 
                  status === 'pending' ? ['submitted', 'in-review'].includes(app.status) : app.status === status
                ).map((application) => {
                  const country = getCountryById(application.countryId);
                  const visaType = getVisaTypeById(application.visaTypeId);
                  
                  return (
                    <Card key={application.id} className="hover:shadow-medium transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            {country && (
                              <img 
                                src={country.flagUrl} 
                                alt={`${country.name} flag`}
                                className="w-12 h-8 rounded object-cover mt-1"
                              />
                            )}
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="text-lg font-semibold">
                                  {visaType?.name} - {country?.name}
                                </h3>
                                {getStatusBadge(application.status)}
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center space-x-2">
                                  <Calendar className="w-4 h-4" />
                                  <span>Applied: {new Date(application.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Globe className="w-4 h-4" />
                                  <span>ID: {application.id}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  {getStatusIcon(application.status)}
                                  <span>{application.status.charAt(0).toUpperCase() + application.status.slice(1).replace('-', ' ')}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </Button>
                            {application.status === 'approved' && (
                              <Button size="sm">
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </Button>
                            )}
                            {application.status === 'draft' && (
                              <Button size="sm" asChild>
                                <Link to={`/apply?visa=${application.visaTypeId}&country=${application.countryId}`}>
                                  Continue
                                </Link>
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}