import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Plane, 
  Menu, 
  User, 
  Home, 
  Search, 
  FileText,
  LogIn
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/visa', label: 'Visas', icon: Search },
    { href: '/dashboard', label: 'Dashboard', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-soft border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Plane className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">
                EZVisaPro
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? 'text-primary bg-accent'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <User className="w-4 h-4 mr-2" />
                Login
              </Button>
              <Button size="sm" className="bg-gradient-primary">
                Apply Now
              </Button>
            </div>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <div className="flex flex-col space-y-4 mt-8">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        to={item.href}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                          isActive(item.href)
                            ? 'text-primary bg-accent'
                            : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                  
                  <div className="pt-4 border-t">
                    <Button variant="ghost" className="w-full justify-start mb-2">
                      <LogIn className="w-4 h-4 mr-3" />
                      Login
                    </Button>
                    <Button className="w-full bg-gradient-primary">
                      Apply Now
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t mt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Plane className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">EZVisaPro</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Making visa applications simple and stress-free with AI-powered assistance.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/visa" className="hover:text-foreground">Tourist Visas</Link></li>
                <li><Link to="/visa" className="hover:text-foreground">Business Visas</Link></li>
                <li><Link to="/visa" className="hover:text-foreground">Transit Visas</Link></li>
                <li><Link to="/visa" className="hover:text-foreground">Medical Visas</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="#" className="hover:text-foreground">Help Center</Link></li>
                <li><Link to="#" className="hover:text-foreground">Contact Us</Link></li>
                <li><Link to="#" className="hover:text-foreground">Track Application</Link></li>
                <li><Link to="#" className="hover:text-foreground">FAQ</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="#" className="hover:text-foreground">About Us</Link></li>
                <li><Link to="#" className="hover:text-foreground">Privacy Policy</Link></li>
                <li><Link to="#" className="hover:text-foreground">Terms of Service</Link></li>
                <li><Link to="#" className="hover:text-foreground">Careers</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 EZVisaPro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}