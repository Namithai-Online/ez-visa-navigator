import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search, Download, Eye, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

// Mock orders data based on the screenshot
const ordersData = [
  {
    id: 'SMV-USA-00530',
    country: { name: 'United States of America', flag: '🇺🇸' },
    purpose: 'Tourism',
    travelers: 1,
    pointOfContact: 'Mohammed Anas',
    travelDates: 'Aug 05 - Aug 15',
    invoice: 'EST-USA-00530',
    dateCreated: 'May 15, 10:53 AM',
    status: 'ongoing'
  },
  {
    id: 'SMV-UZB-00143',
    country: { name: 'Uzbekistan', flag: '🇺🇿' },
    purpose: 'Tourism',
    travelers: 1,
    pointOfContact: 'Mohammed Anas',
    travelDates: 'Jan 17 - Jan 31',
    invoice: 'SMV-UZB-00143',
    dateCreated: 'Jan 06, 08:49 AM',
    status: 'ongoing'
  },
  {
    id: 'SMV-USA-00528',
    country: { name: 'United States of America', flag: '🇺🇸' },
    purpose: 'Tourism',
    travelers: 1,
    pointOfContact: 'Mohammed Anas',
    travelDates: 'Aug 06 - Aug 13',
    invoice: 'EST-USA-00528',
    dateCreated: 'May 15, 10:50 AM',
    status: 'ongoing'
  },
  {
    id: 'SMV-IDN-04551',
    country: { name: 'Indonesia', flag: '🇮🇩' },
    purpose: 'Business',
    travelers: 1,
    pointOfContact: 'Mohammed Anas',
    travelDates: 'Feb 05 - Feb 12',
    invoice: 'Not created',
    dateCreated: 'Jan 28, 02:19 PM',
    status: 'ongoing'
  },
  {
    id: 'SMV-IDN-04550',
    country: { name: 'Indonesia', flag: '🇮🇩' },
    purpose: 'Business',
    travelers: 1,
    pointOfContact: 'Mohammed Anas',
    travelDates: 'Feb 05 - Feb 12',
    invoice: 'Not created',
    dateCreated: 'Jan 28, 02:16 PM',
    status: 'ongoing'
  },
  {
    id: 'SMV-UZB-00143',
    country: { name: 'Uzbekistan', flag: '🇺🇿' },
    purpose: 'Tourism',
    travelers: 1,
    pointOfContact: 'Mohammed Anas',
    travelDates: 'Jan 17 - Jan 31',
    invoice: 'SMV-UZB-00143',
    dateCreated: 'Jan 06, 08:49 AM',
    status: 'ongoing'
  },
  {
    id: 'SMV-USA-00325',
    country: { name: 'United States of America', flag: '🇺🇸' },
    purpose: 'Business',
    travelers: 1,
    pointOfContact: 'Mohammed Anas',
    travelDates: 'Feb 05 - Feb 11',
    invoice: 'MUM2024-251391',
    dateCreated: 'Dec 14, 09:40 AM',
    status: 'completed'
  },
  {
    id: 'SMV-USA-00323',
    country: { name: 'United States of America', flag: '🇺🇸' },
    purpose: 'Business',
    travelers: 1,
    pointOfContact: 'Mohammed Anas',
    travelDates: 'Jan 12 - Jan 31',
    invoice: 'MUM2024-250390',
    dateCreated: 'Dec 14, 09:49 AM',
    status: 'completed'
  },
  {
    id: 'SMV-VNM-02388',
    country: { name: 'Vietnam', flag: '🇻🇳' },
    purpose: 'Tourism',
    travelers: 1,
    pointOfContact: 'Mohammed Anas',
    travelDates: 'Dec 01 - Dec 31',
    invoice: 'MUM2024-250390',
    dateCreated: 'Nov 23, 08:13 AM',
    status: 'completed'
  },
  {
    id: 'SMV-VNM-02385',
    country: { name: 'Vietnam', flag: '🇻🇳' },
    purpose: 'Tourism',
    travelers: 1,
    pointOfContact: 'Mohammed Anas',
    travelDates: 'Dec 02 - Dec 31',
    invoice: 'Not created',
    dateCreated: 'Nov 23, 08:15 AM',
    status: 'cancelled'
  }
];

const statusConfig = {
  ongoing: { label: 'On-going', variant: 'default' as const, className: 'bg-blue-100 text-blue-800' },
  completed: { label: 'Completed', variant: 'default' as const, className: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Cancelled', variant: 'destructive' as const, className: 'bg-red-100 text-red-800' },
  demo: { label: 'Demo', variant: 'secondary' as const, className: 'bg-gray-100 text-gray-800' }
};

const purposeConfig = {
  tourism: { label: 'Tourism', className: 'bg-green-100 text-green-800' },
  business: { label: 'Business', className: 'bg-orange-100 text-orange-800' }
};

export function OrdersTable() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = ordersData.filter(order => {
    const matchesTab = activeTab === 'all' || order.status === activeTab;
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.pointOfContact.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getOrderCounts = () => {
    return {
      all: ordersData.length,
      ongoing: ordersData.filter(o => o.status === 'ongoing').length,
      completed: ordersData.filter(o => o.status === 'completed').length,
      cancelled: ordersData.filter(o => o.status === 'cancelled').length,
      demo: ordersData.filter(o => o.status === 'demo').length
    };
  };

  const counts = getOrderCounts();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Orders</CardTitle>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-64"
              />
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All ({counts.all})</TabsTrigger>
            <TabsTrigger value="ongoing">On-going ({counts.ongoing})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({counts.completed})</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled ({counts.cancelled})</TabsTrigger>
            <TabsTrigger value="demo">Demo ({counts.demo})</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Country</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Travellers</TableHead>
                    <TableHead>Point of Contact</TableHead>
                    <TableHead>Order Id</TableHead>
                    <TableHead>Travel Dates</TableHead>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Date Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{order.country.flag}</span>
                          <span className="font-medium">{order.country.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={purposeConfig[order.purpose.toLowerCase() as keyof typeof purposeConfig].className}
                        >
                          {order.purpose}
                        </Badge>
                      </TableCell>
                      <TableCell>{order.travelers}</TableCell>
                      <TableCell className="font-medium">{order.pointOfContact}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm">{order.id}</span>
                          <Badge 
                            variant={statusConfig[order.status as keyof typeof statusConfig].variant}
                            className={statusConfig[order.status as keyof typeof statusConfig].className}
                          >
                            {statusConfig[order.status as keyof typeof statusConfig].label}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>{order.travelDates}</TableCell>
                      <TableCell>
                        {order.invoice === 'Not created' ? (
                          <span className="text-muted-foreground">Not created</span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm">{order.invoice}</span>
                            <Button variant="ghost" size="sm">
                              <Download className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{order.dateCreated}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Download Invoice
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Page 1/1 • {filteredOrders.length} Orders
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  Prev
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Next
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}