import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MockAPI } from '@/lib/api';
import { Country, VisaType } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Search, 
  Clock, 
  DollarSign, 
  Calendar,
  Globe,
  Filter
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Visa() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [visaTypes, setVisaTypes] = useState<VisaType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContinent, setSelectedContinent] = useState<string>('all');
  const [selectedVisaType, setSelectedVisaType] = useState<string>('all');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [countriesData, visaTypesData] = await Promise.all([
          MockAPI.getCountries(),
          MockAPI.getVisaTypes()
        ]);
        setCountries(countriesData);
        setVisaTypes(visaTypesData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredData = countries.map(country => {
    const countryVisas = visaTypes.filter(visa => visa.countryId === country.id);
    return { country, visas: countryVisas };
  }).filter(({ country, visas }) => {
    // Search filter
    const matchesSearch = country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         country.continent.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Continent filter
    const matchesContinent = selectedContinent === 'all' || country.continent === selectedContinent;
    
    // Visa type filter
    const matchesVisaType = selectedVisaType === 'all' || 
                           visas.some(visa => visa.name.toLowerCase().includes(selectedVisaType.toLowerCase()));
    
    return matchesSearch && matchesContinent && matchesVisaType && visas.length > 0;
  });

  const continents = [...new Set(countries.map(c => c.continent))];

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="space-y-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl font-bold">Find Your Perfect Visa</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Browse visas for popular destinations and apply online with our streamlined process
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-soft p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search countries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedContinent} onValueChange={setSelectedContinent}>
            <SelectTrigger>
              <Globe className="w-4 h-4 mr-2" />
              <SelectValue placeholder="All Continents" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Continents</SelectItem>
              {continents.map(continent => (
                <SelectItem key={continent} value={continent}>{continent}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedVisaType} onValueChange={setSelectedVisaType}>
            <SelectTrigger>
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="All Visa Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Visa Types</SelectItem>
              <SelectItem value="tourist">Tourist</SelectItem>
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="transit">Transit</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={() => {
            setSearchQuery('');
            setSelectedContinent('all');
            setSelectedVisaType('all');
          }}>
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-8">
        {filteredData.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No visas found</h3>
            <p className="text-muted-foreground">Try adjusting your search criteria</p>
          </div>
        ) : (
          filteredData.map(({ country, visas }) => (
            <div key={country.id} className="space-y-4">
              <div className="flex items-center space-x-4">
                <img 
                  src={country.flagUrl} 
                  alt={`${country.name} flag`}
                  className="w-8 h-6 rounded object-cover"
                />
                <div>
                  <h2 className="text-2xl font-bold">{country.name}</h2>
                  <p className="text-muted-foreground">{country.description}</p>
                </div>
                <Badge variant="outline">{country.continent}</Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {visas.map(visa => (
                  <Card key={visa.id} className="hover:shadow-medium transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        {visa.name}
                        <Badge variant="secondary">${visa.fee}</Badge>
                      </CardTitle>
                      <CardDescription>{visa.description}</CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-3">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{visa.processingTime}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>Valid for {visa.validity}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <DollarSign className="w-4 h-4" />
                        <span>Stay up to {visa.maxStay}</span>
                      </div>
                    </CardContent>
                    
                    <CardFooter>
                      <Button asChild className="w-full">
                        <Link to={`/visa/${visa.id}`}>
                          View Details & Apply
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}