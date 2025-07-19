import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  Users, 
  CreditCard, 
  Settings, 
  HelpCircle, 
  Globe, 
  Calendar,
  Package,
  BarChart3,
  Shield,
  File
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const menuItems = [
  { 
    title: 'Home', 
    icon: Home, 
    path: '/admin', 
    exact: true 
  },
  { 
    title: 'Orders', 
    icon: FileText, 
    path: '/admin/orders' 
  },
  { 
    title: 'Documents & Pricing', 
    icon: File, 
    path: '/admin/documents' 
  },
  { 
    title: 'Users', 
    icon: Users, 
    path: '/admin/users' 
  },
  { 
    title: 'API', 
    icon: Globe, 
    path: '/admin/api' 
  },
  { 
    title: 'First eSIM Free', 
    icon: Package, 
    path: '/admin/esim' 
  },
  { 
    title: 'Insure', 
    icon: Shield, 
    path: '/admin/insure',
    badge: 'New' 
  },
  { 
    title: '0% Credit', 
    icon: CreditCard, 
    path: '/admin/credit' 
  },
  { 
    title: 'Holiday Packages', 
    icon: Calendar, 
    path: '/admin/packages' 
  },
  { 
    title: 'Support & Contact', 
    icon: HelpCircle, 
    path: '/admin/support' 
  },
  { 
    title: 'Settings', 
    icon: Settings, 
    path: '/admin/settings' 
  }
];

interface AdminSidebarProps {
  collapsed: boolean;
}

export function AdminSidebar({ collapsed }: AdminSidebarProps) {
  const location = useLocation();

  const isActive = (path: string, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className={cn(
      "bg-white border-r border-border h-full transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Logo/Brand */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Globe className="w-5 h-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div>
              <h2 className="font-bold text-lg">NAMTHAI TRAVELS</h2>
            </div>
          )}
        </div>
      </div>

      {/* Quick Action */}
      {!collapsed && (
        <div className="p-4 border-b border-border">
          <NavLink 
            to="/admin/apply"
            className="w-full bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            <Globe className="w-4 h-4" />
            Apply for Visa
          </NavLink>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="p-2">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path, item.exact);
            
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    active 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    collapsed && "justify-center"
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="flex-1">{item.title}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}