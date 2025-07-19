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
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

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

  // Filter countries only (not showing visas in initial view)
  const filteredCountries = countries.filter(country => {
    // Search filter
    const matchesSearch = country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         country.continent.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Continent filter
    const matchesContinent = selectedContinent === 'all' || country.continent === selectedContinent;
    
    // Special filter logic
    const matchesSpecialFilter = selectedFilter === 'all' || (() => {
      const countryVisas = visaTypes.filter(visa => visa.countryId === country.id);
      switch (selectedFilter) {
        case 'popular':
          return ['uae', 'singapore', 'thailand'].includes(country.id);
        case 'visa-in-week':
          return countryVisas.some(visa => visa.processingTime.includes('7 days') || visa.processingTime.includes('3-5') || visa.processingTime.includes('5-7'));
        case 'easy-visa':
          return countryVisas.some(visa => visa.requiredDocuments.length <= 3);
        case 'season':
          return country.continent === 'Asia' || country.continent === 'Europe';
        case 'schengen':
          return ['germany', 'france', 'italy', 'spain'].includes(country.id);
        case 'visa-free':
          return countryVisas.some(visa => visa.fee === 0);
        default:
          return true;
      }
    })();
    
    return matchesSearch && matchesContinent && matchesSpecialFilter;
  });

  // Get visa types for selected country
  const selectedCountryVisas = selectedCountry 
    ? visaTypes.filter(visa => visa.countryId === selectedCountry.id)
    : [];

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
        <h1 className="text-4xl font-bold">
          {selectedCountry ? `${selectedCountry.name} Visa Types` : 'Find Your Perfect Visa'}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {selectedCountry 
            ? `Choose from available visa types for ${selectedCountry.name}`
            : 'Browse visas for popular destinations and apply online with our streamlined process'
          }
        </p>
        {selectedCountry && (
          <Button 
            variant="outline" 
            onClick={() => setSelectedCountry(null)}
            className="mt-4"
          >
            ← Back to Countries
          </Button>
        )}
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-soft p-6 mb-6">
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Where to, captain?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 text-lg"
          />
        </div>
      </div>

      {/* Filter Buttons - Only show when viewing countries */}
      {!selectedCountry && (
        <div className="mb-8">
          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              variant={selectedFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedFilter('all')}
              className="rounded-full"
            >
              All
            </Button>
            <Button
              variant={selectedFilter === 'popular' ? 'default' : 'outline'}
              onClick={() => setSelectedFilter('popular')}
              className="rounded-full"
            >
              Popular
            </Button>
            <Button
              variant={selectedFilter === 'visa-in-week' ? 'default' : 'outline'}
              onClick={() => setSelectedFilter('visa-in-week')}
              className="rounded-full"
            >
              Visa in a week
            </Button>
            <Button
              variant={selectedFilter === 'easy-visa' ? 'default' : 'outline'}
              onClick={() => setSelectedFilter('easy-visa')}
              className="rounded-full"
            >
              Easy Visa
            </Button>
            <Button
              variant={selectedFilter === 'season' ? 'default' : 'outline'}
              onClick={() => setSelectedFilter('season')}
              className="rounded-full"
            >
              Season
            </Button>
            <Button
              variant={selectedFilter === 'schengen' ? 'default' : 'outline'}
              onClick={() => setSelectedFilter('schengen')}
              className="rounded-full"
            >
              Schengen Visa
            </Button>
            <Button
              variant={selectedFilter === 'visa-free' ? 'default' : 'outline'}
              onClick={() => setSelectedFilter('visa-free')}
              className="rounded-full"
            >
              Visa Free
            </Button>
          </div>
        </div>
      )}

      {/* Advanced Filters - Only show when viewing countries */}
      {!selectedCountry && (
        <div className="bg-white rounded-xl shadow-soft p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              setSelectedFilter('all');
            }}>
              Clear Filters
            </Button>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="space-y-8">
        {!selectedCountry ? (
          // Show country cards
          <>
            {filteredCountries.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No countries found</h3>
                <p className="text-muted-foreground">Try adjusting your search criteria</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCountries.map(country => (
                  <Card 
                    key={country.id} 
                    className="hover:shadow-medium transition-all duration-300 cursor-pointer hover-scale"
                    onClick={() => setSelectedCountry(country)}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <img 
                          src={country.flagUrl} 
                          alt={`${country.name} flag`}
                          className="w-8 h-6 rounded object-cover"
                        />
                        <Badge variant="outline" className="text-xs">
                          {country.continent}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl">{country.name}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {country.description}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Capital:</span>
                        <span className="font-medium">{country.capital}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Currency:</span>
                        <span className="font-medium">{country.currency}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Visa Types:</span>
                        <Badge variant="secondary">
                          {visaTypes.filter(v => v.countryId === country.id).length} available
                        </Badge>
                      </div>
                    </CardContent>
                    
                    <CardFooter>
                      <Button className="w-full">
                        View Visa Types
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </>
        ) : (
          // Show visa types for selected country
          <>
            <div className="flex items-center space-x-4 mb-6">
              <img 
                src={selectedCountry.flagUrl} 
                alt={`${selectedCountry.name} flag`}
                className="w-12 h-8 rounded object-cover"
              />
              <div>
                <h2 className="text-2xl font-bold">{selectedCountry.name}</h2>
                <p className="text-muted-foreground">{selectedCountry.description}</p>
              </div>
              <Badge variant="outline">{selectedCountry.continent}</Badge>
            </div>
            
            {selectedCountryVisas.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No visas available</h3>
                <p className="text-muted-foreground">No visa types found for this country</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {selectedCountryVisas.map(visa => (
                  <Card key={visa.id} className="hover:shadow-medium transition-shadow animate-fade-in">
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
            )}
          </>
        )}
      </div>
    </div>
  );
}