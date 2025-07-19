import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { 
  FileText, 
  Download, 
  ChevronDown,
  ChevronRight,
  CreditCard,
  Briefcase,
  GraduationCap,
  Heart,
  User,
  Calendar
} from 'lucide-react';

interface DocumentChecklistProps {
  countryName: string;
  countryFlag: string;
  visaTypes: Array<{
    id: string;
    name: string;
    type: string;
  }>;
}

interface DocumentCategory {
  id: string;
  name: string;
  icon: typeof FileText;
  documents: Array<{
    id: string;
    name: string;
    required: boolean;
    description?: string;
  }>;
  isOpen: boolean;
}

export default function DocumentChecklist({ 
  countryName, 
  countryFlag, 
  visaTypes 
}: DocumentChecklistProps) {
  const [selectedVisaType, setSelectedVisaType] = useState<string>(visaTypes[0]?.id || '');
  const [categories, setCategories] = useState<DocumentCategory[]>([
    {
      id: 'mandatory',
      name: 'Mandatory docs',
      icon: FileText,
      isOpen: true,
      documents: [
        { id: 'birth-cert', name: 'Birth Certificate', required: true },
        { id: 'visa-stamps', name: 'Visa Stamps', required: true },
        { id: 'passport-pages', name: 'Passport front and back pages', required: true },
        { id: 'aadhaar', name: 'Aadhaar card', required: true },
        { id: 'travel-itinerary', name: 'Travel Itinerary', required: true },
        { id: 'it-return', name: 'IT return', required: true },
        { id: 'cover-letter', name: 'Cover letter', required: true },
        { id: 'bank-statement', name: 'Bank statement', required: true }
      ]
    },
    {
      id: 'student',
      name: 'Student',
      icon: GraduationCap,
      isOpen: false,
      documents: [
        { id: 'student-id', name: 'Student ID Card', required: true },
        { id: 'enrollment-letter', name: 'Enrollment Letter', required: true },
        { id: 'academic-transcript', name: 'Academic Transcript', required: true },
        { id: 'financial-support', name: 'Financial Support Letter', required: true }
      ]
    },
    {
      id: 'employed',
      name: 'Employed',
      icon: Briefcase,
      isOpen: false,
      documents: [
        { id: 'employment-letter', name: 'Employment Letter', required: true },
        { id: 'salary-certificate', name: 'Salary Certificate', required: true },
        { id: 'leave-approval', name: 'Leave Approval Letter', required: true },
        { id: 'company-registration', name: 'Company Registration', required: false }
      ]
    },
    {
      id: 'self-employed',
      name: 'Self Employed',
      icon: User,
      isOpen: false,
      documents: [
        { id: 'business-license', name: 'Business License', required: true },
        { id: 'tax-returns', name: 'Tax Returns (Last 2 years)', required: true },
        { id: 'business-bank-statement', name: 'Business Bank Statement', required: true },
        { id: 'business-registration', name: 'Business Registration Certificate', required: true }
      ]
    },
    {
      id: 'married',
      name: 'Is Married',
      icon: Heart,
      isOpen: false,
      documents: [
        { id: 'marriage-certificate', name: 'Marriage Certificate', required: true },
        { id: 'spouse-passport', name: 'Spouse Passport Copy', required: true },
        { id: 'spouse-visa', name: 'Spouse Visa (if traveling together)', required: false }
      ]
    },
    {
      id: 'retired',
      name: 'Retired',
      icon: Calendar,
      isOpen: false,
      documents: [
        { id: 'pension-certificate', name: 'Pension Certificate', required: true },
        { id: 'retirement-letter', name: 'Retirement Letter', required: true },
        { id: 'pension-bank-statement', name: 'Pension Bank Statement', required: true }
      ]
    }
  ]);

  const toggleCategory = (categoryId: string) => {
    setCategories(prev => 
      prev.map(cat => 
        cat.id === categoryId 
          ? { ...cat, isOpen: !cat.isOpen }
          : cat
      )
    );
  };

  const selectedVisaName = visaTypes.find(v => v.id === selectedVisaType)?.name || 'Tourist visa';

  const handleDownloadChecklist = () => {
    // This would integrate with SMV API to download the actual checklist
    console.log(`Downloading ${countryName} checklist for ${selectedVisaName}`);
  };

  return (
    <Card className="w-full">
      <CardHeader className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <img 
            src={countryFlag} 
            alt={`${countryName} flag`}
            className="w-8 h-6 rounded object-cover"
          />
          <CardTitle className="text-2xl">
            Tourist & Business Visa Requirements for {countryName}
          </CardTitle>
        </div>
        
        <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
          <span>Showing documents for</span>
          <Select value={selectedVisaType} onValueChange={setSelectedVisaType}>
            <SelectTrigger className="w-auto min-w-[140px] h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {visaTypes.map(visa => (
                <SelectItem key={visa.id} value={visa.id}>
                  {visa.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img 
              src={countryFlag} 
              alt={`${countryName} flag`}
              className="w-6 h-4 rounded object-cover"
            />
            <h3 className="text-lg font-semibold">
              Documents required for a {countryName} Visa
            </h3>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleDownloadChecklist}
            className="text-blue-600 border-blue-600 hover:bg-blue-50"
          >
            <Download className="w-4 h-4 mr-2" />
            Download {countryName} Checklist
          </Button>
        </div>

        <div className="space-y-4">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Collapsible
                key={category.id}
                open={category.isOpen}
                onOpenChange={() => toggleCategory(category.id)}
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <div className="flex items-center space-x-3">
                    <IconComponent className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-800">
                      {category.name}
                    </span>
                  </div>
                  {category.isOpen ? (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  )}
                </CollapsibleTrigger>
                
                <CollapsibleContent className="mt-2">
                  <div className="space-y-2 pl-8">
                    {category.documents.map((doc) => (
                      <div 
                        key={doc.id}
                        className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <FileText className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700">
                            {doc.name}
                          </span>
                          <ChevronDown className="w-3 h-3 text-gray-400" />
                        </div>
                        {doc.required && (
                          <Badge variant="destructive" className="text-xs">
                            Required
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>

        <Separator />
        
        <div className="text-center text-sm text-muted-foreground">
          <p>
            Document requirements may vary based on your nationality and visa type. 
            Please verify with the embassy or consulate before submission.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}