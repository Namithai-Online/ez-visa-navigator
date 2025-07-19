import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Search, 
  Filter,
  Users,
  TrendingUp
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Dummy admin data
const DUMMY_ADMIN_APPLICATIONS = [
  {
    id: '1',
    applicantName: 'John Doe',
    applicantEmail: 'john@example.com',
    type: 'Tourist Visa',
    country: 'United States',
    status: 'in-review',
    submittedDate: '2024-01-15',
    updatedDate: '2024-01-20',
    applicationNumber: 'US-TV-2024-001',
    priority: 'normal'
  },
  {
    id: '2',
    applicantName: 'Jane Smith',
    applicantEmail: 'jane@example.com',
    type: 'Business Visa',
    country: 'Canada',
    status: 'submitted',
    submittedDate: '2024-01-18',
    updatedDate: '2024-01-18',
    applicationNumber: 'CA-BV-2024-002',
    priority: 'high'
  },
  {
    id: '3',
    applicantName: 'Mike Johnson',
    applicantEmail: 'mike@example.com',
    type: 'Student Visa',
    country: 'United Kingdom',
    status: 'in-review',
    submittedDate: '2024-01-20',
    updatedDate: '2024-01-22',
    applicationNumber: 'UK-SV-2024-003',
    priority: 'normal'
  },
  {
    id: '4',
    applicantName: 'Sarah Wilson',
    applicantEmail: 'sarah@example.com',
    type: 'Work Visa',
    country: 'Germany',
    status: 'approved',
    submittedDate: '2024-01-10',
    updatedDate: '2024-01-15',
    applicationNumber: 'DE-WV-2024-004',
    priority: 'low'
  }
];

const statusConfig = {
  submitted: { 
    label: 'Submitted', 
    variant: 'default' as const, 
    className: 'status-submitted'
  },
  'in-review': { 
    label: 'In Review', 
    variant: 'secondary' as const, 
    className: 'status-in-review'
  },
  approved: { 
    label: 'Approved', 
    variant: 'default' as const, 
    className: 'status-approved'
  },
  rejected: { 
    label: 'Rejected', 
    variant: 'destructive' as const, 
    className: 'status-rejected'
  }
};

const priorityConfig = {
  high: { label: 'High', className: 'bg-red-100 text-red-800' },
  normal: { label: 'Normal', className: 'bg-blue-100 text-blue-800' },
  low: { label: 'Low', className: 'bg-gray-100 text-gray-800' }
};

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [applications, setApplications] = useState(DUMMY_ADMIN_APPLICATIONS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const handleStatusChange = (applicationId: string, newStatus: string) => {
    setApplications(prev => 
      prev.map(app => 
        app.id === applicationId 
          ? { ...app, status: newStatus, updatedDate: new Date().toISOString().split('T')[0] }
          : app
      )
    );
    
    toast({
      title: "Status Updated",
      description: `Application status changed to ${newStatus}`,
    });
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.applicationNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: applications.length,
    submitted: applications.filter(app => app.status === 'submitted').length,
    inReview: applications.filter(app => app.status === 'in-review').length,
    approved: applications.filter(app => app.status === 'approved').length,
    rejected: applications.filter(app => app.status === 'rejected').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage visa applications and user requests</p>
          </div>
          <Button variant="outline" onClick={logout}>
            Logout
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-orange-100 rounded-full">
                  <FileText className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Submitted</p>
                  <p className="text-2xl font-bold">{stats.submitted}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-yellow-100 rounded-full">
                  <Clock className="h-4 w-4 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">In Review</p>
                  <p className="text-2xl font-bold">{stats.inReview}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-green-100 rounded-full">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Approved</p>
                  <p className="text-2xl font-bold">{stats.approved}</p>
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
                  <p className="text-2xl font-bold">{stats.rejected}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Application Management</CardTitle>
            <CardDescription>Review and process visa applications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or application number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="in-review">In Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Applications Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Application</TableHead>
                    <TableHead>Type & Country</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.map((application) => (
                    <TableRow key={application.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{application.applicantName}</p>
                          <p className="text-sm text-muted-foreground">{application.applicantEmail}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-sm">{application.applicationNumber}</span>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{application.type}</p>
                          <p className="text-sm text-muted-foreground">{application.country}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={priorityConfig[application.priority as keyof typeof priorityConfig].className}
                        >
                          {priorityConfig[application.priority as keyof typeof priorityConfig].label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={statusConfig[application.status as keyof typeof statusConfig].variant}
                          className={statusConfig[application.status as keyof typeof statusConfig].className}
                        >
                          {statusConfig[application.status as keyof typeof statusConfig].label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(application.submittedDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={application.status}
                          onValueChange={(value) => handleStatusChange(application.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="submitted">Submitted</SelectItem>
                            <SelectItem value="in-review">In Review</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}