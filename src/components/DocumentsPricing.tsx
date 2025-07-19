import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import countries from '@/data/countries.json';
import visaTypes from '@/data/visaTypes.json';

interface VisaType {
  id: string;
  name: string;
  description: string;
  fee: number;
  processingTime: string;
  validity: string;
  maxStay: string;
  requiredDocuments: string[];
  countryId: string;
}

interface Country {
  id: string;
  name: string;
  code: string;
  continent: string;
  visaTypes: string[];
  flagUrl: string;
  description: string;
  capital: string;
  currency: string;
}

export function DocumentsPricing() {
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedPurpose, setSelectedPurpose] = useState<string>('tourist');
  
  const typedCountries = countries as Country[];
  const typedVisaTypes = visaTypes as VisaType[];
  
  const selectedCountryData = typedCountries.find(c => c.id === selectedCountry);
  const availableVisaTypes = typedVisaTypes.filter(vt => vt.countryId === selectedCountry);
  const selectedVisaType = availableVisaTypes.find(vt => 
    vt.id.includes(selectedPurpose) || 
    (selectedPurpose === 'tourist' && vt.id === 'tourist') ||
    (selectedPurpose === 'business' && vt.id === 'business')
  );

  const getDocumentRequirements = () => {
    if (selectedCountry === 'argentina') {
      return {
        travelerDetails: [
          {
            title: "Passport",
            items: [
              "The Current & Old Passport must be completely color scanned including passport first page, last page, all stamped pages, white and unused pages (do not skip any of the pages).",
              "Passport must be valid for at least 300 dpi quality.",
              "The Image scanned must be at least 300 dpi quality.",
              "The Current & Old Passport must be completely scanned including passport first page, last page, all stamped pages, white and unused pages (do not skip any of the pages).",
              "Old passport validity must be valid for a minimum of six (6) months from the intended date of entry and have at least two (2) completely free pages left, must be presented at the time of submission.",
              "The image scanned must be at least 300 dpi quality."
            ]
          }
        ],
        applicationForm: [
          "Application for duly filled."
        ],
        personalDetails: [
          "Current work activity with address.",
          "Last level of Education.",
          "Education place (Name).",
          "Monthly income.",
          "Personal contact and email ID."
        ],
        travelDetails: [
          {
            title: "Flight Tickets",
            items: [
              "Copy of confirmed Arrival and Departure tickets.",
              "Travel Itinerary in detail required"
            ]
          },
          {
            title: "Hotel Reservation",
            items: [
              "Copy of confirmed Hotel reservation showcasing the Hotel Address, Contact Number, Applicant's Name and Dates of Reservation for all days of travel.",
              "If applicant is travelling to multiple location in Argentina then all destination Hotel Confirmation is required.",
              "If applicant is travelling to multiple location in Argentina then All destination Hotel Confirmation is required."
            ]
          }
        ],
        additionalInfo: [
          {
            title: "Application Form",
            items: [
              "While filling the form, if an Indian passport contains no surname then the given name can be used again to add in the surname column of the form."
            ]
          }
        ],
        additionalDetails: [
          {
            title: "Special Information",
            items: [
              "We can apply for this eVisa only three months prior to the applicant's departure, as the visa is issued with a validity of three months.",
              "This visa will be used exclusively for tourist purposes. For business meetings and Business visa, applicants need to apply to the visa at the nearest Argentina Embassy.",
              "The applicant must hold a valid ordinary passport and a valid B2 / J / F / D / P (PI-P2-P3) / E / I-18 category visa issued by the United States of America or; the applicant must be a foreigner national from a jurisdiction that is not required a visa to enter the above mentioned country, holder of a valid ordinary, diplomatic, official or service passport and has entered the UNITED STATES OF AMERICA at least ONCE in the last TWO (2) years or; the applicant must be holder of a valid entry authorization for the above mentioned country (ESTA or B2 / B1 / B1 / B1 (PI-P2-P3) / E / I-18 visa issued by the United States of America)."
            ]
          }
        ]
      };
    }
    return null;
  };

  const documentRequirements = getDocumentRequirements();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Documents & Pricing</h1>
        <p className="text-muted-foreground">Discover the requirements for all your travel destinations.</p>
      </div>

      {/* Selection Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Country Selection */}
        <div className="space-y-2">
          <Label>Country to travel*</Label>
          <Select value={selectedCountry} onValueChange={setSelectedCountry}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="argentina">
                <div className="flex items-center gap-2">
                  <img src="https://flagcdn.com/w20/ar.png" alt="Argentina" className="w-5 h-3 object-cover" />
                  Argentina (E-visa)
                </div>
              </SelectItem>
              {typedCountries.map((country) => (
                <SelectItem key={country.id} value={country.id}>
                  <div className="flex items-center gap-2">
                    <img src={country.flagUrl} alt={country.name} className="w-5 h-3 object-cover" />
                    {country.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Purpose Selection */}
        <div className="space-y-3">
          <Label>Purpose of travel (select one)*</Label>
          <RadioGroup value={selectedPurpose} onValueChange={setSelectedPurpose} className="flex gap-6">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="tourist" id="tourist" />
              <Label htmlFor="tourist">Tourism</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="business" id="business" />
              <Label htmlFor="business">Business</Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      {/* Country Details */}
      {selectedCountry === 'argentina' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Requirements */}
          <div className="lg:col-span-2 space-y-6">
            {/* Argentina E-visa Header */}
            <div className="flex items-center gap-2">
              <img src="https://flagcdn.com/w20/ar.png" alt="Argentina" className="w-6 h-4 object-cover" />
              <span className="font-medium">Argentina (E-visa)</span>
            </div>

            {documentRequirements && (
              <div className="space-y-6">
                {/* Traveller Details */}
                <div>
                  <h3 className="font-semibold text-lg mb-4">TRAVELLER DETAILS</h3>
                  {documentRequirements.travelerDetails.map((section, index) => (
                    <div key={index} className="space-y-3">
                      <h4 className="font-medium">{section.title}</h4>
                      <ul className="space-y-2">
                        {section.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Application Form */}
                <div>
                  <h4 className="font-medium mb-3">Application Form</h4>
                  <ul className="space-y-2">
                    {documentRequirements.applicationForm.map((item, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Personal Details */}
                <div>
                  <h4 className="font-medium mb-3">Personal Details</h4>
                  <ul className="space-y-2">
                    {documentRequirements.personalDetails.map((item, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Travel Details */}
                <div>
                  <h3 className="font-semibold text-lg mb-4">TRAVEL DETAILS</h3>
                  {documentRequirements.travelDetails.map((section, index) => (
                    <div key={index} className="space-y-3 mb-4">
                      <h4 className="font-medium">{section.title}</h4>
                      <ul className="space-y-2">
                        {section.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Additional Information */}
                <div>
                  <h3 className="font-semibold text-lg mb-4">ADDITIONAL INFORMATION</h3>
                  {documentRequirements.additionalInfo.map((section, index) => (
                    <div key={index} className="space-y-3 mb-4">
                      <h4 className="font-medium">{section.title}</h4>
                      <ul className="space-y-2">
                        {section.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Additional Details */}
                <div>
                  <h3 className="font-semibold text-lg mb-4">ADDITIONAL DETAILS</h3>
                  {documentRequirements.additionalDetails.map((section, index) => (
                    <div key={index} className="space-y-3">
                      <h4 className="font-medium">{section.title}</h4>
                      <ul className="space-y-2">
                        {section.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Visa Type Card */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Share requirements</span>
              <Button variant="ghost" size="sm">
                <span className="text-sm">⟲</span>
              </Button>
            </div>

            <div className="space-y-2">
              <span className="text-sm text-muted-foreground">Select Visa Type</span>
              <div className="text-sm text-muted-foreground">Show prices including taxes</div>
            </div>

            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-blue-900">Tourist Visa - 1 Month</h4>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Entries permitted</span>
                      <div className="font-medium">90 days</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Maximum stay</span>
                      <div className="font-medium">90 days</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Visa validity</span>
                      <div className="font-medium">90 days</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Get your visa within</span>
                      <div className="font-medium">30 working days</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-900">₹ 36,630 <span className="text-sm font-normal">/ per visa</span></div>
                    <div className="text-xs text-muted-foreground">💎</div>
                  </div>

                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Apply for Visa →
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Default State */}
      {!selectedCountry && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Please select a country to view documents and pricing information.</p>
          </CardContent>
        </Card>
      )}

      {/* Other Countries */}
      {selectedCountry && selectedCountry !== 'argentina' && selectedCountryData && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <img src={selectedCountryData.flagUrl} alt={selectedCountryData.name} className="w-6 h-4 object-cover" />
                  {selectedCountryData.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{selectedCountryData.description}</p>
                <div className="space-y-2">
                  <p><strong>Capital:</strong> {selectedCountryData.capital}</p>
                  <p><strong>Currency:</strong> {selectedCountryData.currency}</p>
                  <p><strong>Available Visa Types:</strong> {selectedCountryData.visaTypes.join(', ')}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            {selectedVisaType && (
              <Card>
                <CardHeader>
                  <CardTitle>{selectedVisaType.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{selectedVisaType.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Processing Time</span>
                      <div className="font-medium">{selectedVisaType.processingTime}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Validity</span>
                      <div className="font-medium">{selectedVisaType.validity}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Max Stay</span>
                      <div className="font-medium">{selectedVisaType.maxStay}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-bold">₹ {selectedVisaType.fee.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">per visa</div>
                  </div>

                  <Button className="w-full">
                    Apply for Visa →
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
