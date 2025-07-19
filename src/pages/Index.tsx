import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MockAPI } from '@/lib/api';
import { Country } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Plane, 
  Clock, 
  Shield, 
  Zap,
  CheckCircle,
  ArrowRight,
  Globe,
  Users,
  Award
} from 'lucide-react';

const Index = () => {
  const [countries, setCountries] = useState<Country[]>([]);

  useEffect(() => {
    const loadCountries = async () => {
      try {
        const data = await MockAPI.getCountries();
        setCountries(data.slice(0, 6)); // Show first 6 countries
      } catch (error) {
        console.error('Error loading countries:', error);
      }
    };

    loadCountries();
  }, []);

  const features = [
    {
      icon: Zap,
      title: "AI-Powered Processing",
      description: "Smart document verification and instant eligibility checks"
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Bank-grade security with 99.9% application success rate"
    },
    {
      icon: Clock,
      title: "Fast Processing",
      description: "Get your visa approved in as little as 24 hours"
    },
    {
      icon: Users,
      title: "Expert Support",
      description: "24/7 customer support from visa specialists"
    }
  ];

  const stats = [
    { number: "50K+", label: "Visas Processed" },
    { number: "120+", label: "Countries Supported" },
    { number: "99.8%", label: "Success Rate" },
    { number: "24/7", label: "Support Available" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-hero text-white py-20 lg:py-32">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Your Visa Journey 
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-white">
                Made Simple
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
              Apply for visas to 120+ countries with AI-powered assistance. 
              Fast, secure, and stress-free visa applications.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-white text-travel-blue hover:bg-white/90 text-lg px-8">
                <Link to="/visa">
                  <Plane className="w-5 h-5 mr-2" />
                  Apply for Visa
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8">
                <Clock className="w-5 h-5 mr-2" />
                Track Application
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-travel-blue mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose EZVisaPro?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We make visa applications simple with cutting-edge technology and expert support
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center hover:shadow-medium transition-shadow">
                  <CardHeader>
                    <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Popular Destinations
            </h2>
            <p className="text-xl text-muted-foreground">
              Start your journey to these amazing countries
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {countries.map((country) => (
              <Card key={country.id} className="group hover:shadow-medium transition-all cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={country.flagUrl} 
                      alt={`${country.name} flag`}
                      className="w-12 h-8 rounded object-cover"
                    />
                    <div className="flex-1">
                      <CardTitle className="text-lg">{country.name}</CardTitle>
                      <Badge variant="outline" className="mt-1">
                        {country.continent}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-muted-foreground text-sm mb-4">
                    {country.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {country.visaTypes.length} visa types
                    </span>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      asChild
                      className="group-hover:text-primary"
                    >
                      <Link to={`/visa?country=${country.id}`}>
                        View Visas
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center">
            <Button size="lg" asChild>
              <Link to="/visa">
                <Globe className="w-5 h-5 mr-2" />
                View All Countries
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple 4-Step Process
            </h2>
            <p className="text-xl text-muted-foreground">
              Get your visa approved in just a few simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Choose Destination", description: "Select your country and visa type" },
              { step: "2", title: "Fill Application", description: "Complete the form with your details" },
              { step: "3", title: "Upload Documents", description: "Submit required documents securely" },
              { step: "4", title: "Get Approved", description: "Receive your visa electronically" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-white/90">
              Join thousands of travelers who trust EZVisaPro for their visa applications
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-travel-blue hover:bg-white/90">
                <Link to="/visa" className="flex items-center">
                  <Plane className="w-5 h-5 mr-2" />
                  Apply Now
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Award className="w-5 h-5 mr-2" />
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
