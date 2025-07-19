import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { MockAPI } from '@/lib/api';
import { Application, Country, VisaType } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { FileText, Clock, CheckCircle, XCircle, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const statusConfig = {
  approved: { 
    label: 'Approved', 
    variant: 'default' as const, 
    icon: CheckCircle,
    className: 'status-approved'
  },
  'in-review': { 
    label: 'In Review', 
    variant: 'secondary' as const, 
    icon: Clock,
    className: 'status-in-review'
  },
  submitted: { 
    label: 'Submitted', 
    variant: 'secondary' as const, 
    icon: Clock,
    className: 'status-submitted'
  },
  draft: { 
    label: 'Draft', 
    variant: 'outline' as const, 
    icon: FileText,
    className: 'status-draft'
  },
  rejected: { 
    label: 'Rejected', 
    variant: 'destructive' as const, 
    icon: XCircle,
    className: 'status-rejected'
  }
};

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [visaTypes, setVisaTypes] = useState<VisaType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
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

    loadData();
  }, []);

  const getCountryName = (countryId: string) => {
    const country = countries.find(c => c.id === countryId);
    return country?.name || countryId;
  };

  const getVisaTypeName = (visaTypeId: string) => {
    const visaType = visaTypes.find(vt => vt.id === visaTypeId);
    return visaType?.name || visaTypeId;
  };

  const getStatusCounts = () => {
    const counts = {
      approved: applications.filter(app => app.status === 'approved').length,
      'in-review': applications.filter(app => app.status === 'in-review').length,
      draft: applications.filter(app => app.status === 'draft').length,
      rejected: applications.filter(app => app.status === 'rejected').length
    };
    return counts;
  };

  const getStatusIcon = (status: string) => {
    const IconComponent = statusConfig[status as keyof typeof statusConfig]?.icon || FileText;
    return <IconComponent className="h-4 w-4" />;
  };

  const getStatusBadge = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge variant={config?.variant || 'outline'} className={config?.className}>
        {getStatusIcon(status)}
        <span className="ml-1">{config?.label || status}</span>
      </Badge>
    );
  };

  const statusCounts = getStatusCounts();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto p-6">
          <div className="text-center py-12">
            <p>Loading your applications...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Welcome back, {user?.name}!</h1>
            <p className="text-muted-foreground">Manage your visa applications</p>
          </div>
          <div className="flex gap-3">
            <Link to="/apply">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New Application
              </Button>
            </Link>
            <Button variant="outline" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-green-100 rounded-full">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Approved</p>
                  <p className="text-2xl font-bold">{statusCounts.approved}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-orange-100 rounded-full">
                  <Clock className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">In Review</p>
                  <p className="text-2xl font-bold">{statusCounts['in-review']}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 rounded-full">
                  <FileText className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Drafts</p>
                  <p className="text-2xl font-bold">{statusCounts.draft}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-red-100 rounded-full">
                  <XCircle className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Rejected</p>
                  <p className="text-2xl font-bold">{statusCounts.rejected}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Applications List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Applications</CardTitle>
            <CardDescription>
              Track the status of your visa applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {applications.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No applications found</p>
                  <Link to="/apply">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Start Your First Application
                    </Button>
                  </Link>
                </div>
              ) : (
                applications.map((application, index) => (
                  <div key={application.id}>
                    <div className="flex items-center justify-between p-4 hover:bg-muted/50 rounded-lg transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{getVisaTypeName(application.visaTypeId)}</h3>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-muted-foreground">{getCountryName(application.countryId)}</span>
                          {getStatusBadge(application.status)}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>App #: {application.id}</span>
                          {application.submittedAt && (
                            <span>Submitted: {new Date(application.submittedAt).toLocaleDateString()}</span>
                          )}
                          <span>Updated: {new Date(application.updatedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        {application.status === 'draft' ? (
                          <Link to={`/apply?edit=${application.id}`}>
                            <Button variant="outline" size="sm">
                              Continue
                            </Button>
                          </Link>
                        ) : (
                          <Link to={`/application/${application.id}`}>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                    
                    {index < applications.length - 1 && <Separator />}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}