import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Search, 
  Filter,
  Users,
  TrendingUp,
  Plus,
  Menu,
  Globe,
  CreditCard,
  Package,
  Shield,
  Calendar,
  Settings,
  BarChart3,
  DollarSign,
  Activity
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AdminSidebar } from '@/components/AdminSidebar';
import { AddItineraryForm } from '@/components/AddItineraryForm';
import { OrdersTable } from '@/components/OrdersTable';

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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddItinerary, setShowAddItinerary] = useState(false);

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

  const dashboardStats = [
    {
      title: "Total Orders",
      value: "₹0.00",
      subtitle: "Wallet Balance",
      icon: DollarSign,
      className: "bg-green-50 text-green-600"
    },
    {
      title: "SMV Wise",
      value: "₹0.00",
      subtitle: "SMV Wise",
      icon: CreditCard,
      className: "bg-blue-50 text-blue-600"
    },
    {
      title: "Add Money",
      value: "All transactions",
      subtitle: "",
      icon: Plus,
      className: "bg-purple-50 text-purple-600"
    }
  ];

  const renderDashboardContent = () => (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Hello, NAMTHAI TRAVELS!</h1>
          <p className="text-muted-foreground">Place your next Visa order</p>
          <p className="text-sm text-muted-foreground">We've got you covered for all countries</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">₹0.00</div>
          <div className="text-muted-foreground">Wallet Balance</div>
          <div className="flex gap-2 mt-2">
            <Button size="sm" variant="outline">Add Money</Button>
            <Button size="sm" variant="outline">All transactions</Button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Globe className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Place your next Visa order</h3>
                <p className="text-sm text-muted-foreground">We've got you covered for all countries</p>
                <Button 
                  className="mt-2" 
                  size="sm"
                  onClick={() => setShowAddItinerary(true)}
                >
                  New Order
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Documents & Pricing</h3>
                <p className="text-sm text-muted-foreground">Visa details and prices for all countries</p>
                <Button className="mt-2" size="sm" variant="outline">
                  Check details
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Service Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold">USA Visa Appointment</h3>
                <p className="text-sm text-muted-foreground">Early appointments starting at ₹15,362/-</p>
                <Button className="mt-2 p-0" size="sm" variant="link">
                  Apply Now →
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">VFS at your Doorstep</h3>
                <p className="text-sm text-muted-foreground">Exclusively for UK, Schengen</p>
                <Button className="mt-2 p-0" size="sm" variant="link">
                  Book Now →
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold">Konveyor – Travel APIs</h3>
                <p className="text-sm text-muted-foreground">Reach out to our team for details about this product</p>
                <Button className="mt-2 p-0" size="sm" variant="link">
                  Apply Now →
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Services */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold">StampMyVisa's Travel eSIM</h3>
                <p className="text-sm text-muted-foreground">Flawless 5G network across the globe</p>
                <Button className="mt-2 p-0" size="sm" variant="link">
                  Buy eSIM →
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">StampMyVisa Insure</h3>
                <p className="text-sm text-muted-foreground">Travel Insurance starting at ₹12/day</p>
                <Button className="mt-2 p-0" size="sm" variant="link">
                  Buy Insurance →
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold">0% Credit</h3>
                <p className="text-sm text-muted-foreground">Zero Cost Credit Card payments with StampMyVisa</p>
                <Button className="mt-2 p-0" size="sm" variant="link">
                  Create Payout →
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Your recent orders</CardTitle>
            <Button variant="link" className="p-0">
              View all orders →
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <OrdersTable />
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'orders':
        return <OrdersTable />;
      case 'add-itinerary':
        return <AddItineraryForm />;
      default:
        return renderDashboardContent();
    }
  };

  return (
    <div className="min-h-screen bg-background flex w-full">
      {/* Sidebar */}
      <AdminSidebar collapsed={sidebarCollapsed} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              
              {/* Navigation Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="bg-muted">
                  <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                  <TabsTrigger value="orders">Orders</TabsTrigger>
                  <TabsTrigger value="add-itinerary">Add Itinerary</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="flex items-center gap-4">
              <Dialog open={showAddItinerary} onOpenChange={setShowAddItinerary}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="h-4 w-4 mr-2" />
                    New Order
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Itinerary</DialogTitle>
                  </DialogHeader>
                  <AddItineraryForm onClose={() => setShowAddItinerary(false)} />
                </DialogContent>
              </Dialog>
              
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}