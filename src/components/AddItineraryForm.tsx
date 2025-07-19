import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar, CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface AddItineraryFormProps {
  onClose?: () => void;
}

export function AddItineraryForm({ onClose }: AddItineraryFormProps) {
  const { toast } = useToast();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [formData, setFormData] = useState({
    country: '',
    purpose: '',
    travelers: '1',
    pointOfContact: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.country || !formData.purpose || !startDate || !endDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Process the form
    console.log('Submitting itinerary:', {
      ...formData,
      startDate,
      endDate
    });

    toast({
      title: "Itinerary Added",
      description: "Travel itinerary has been successfully created",
    });

    // Reset form
    setFormData({
      country: '',
      purpose: '',
      travelers: '1',
      pointOfContact: '',
      notes: ''
    });
    setStartDate(undefined);
    setEndDate(undefined);

    if (onClose) {
      onClose();
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Add Itinerary</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Country Selection */}
          <div className="space-y-2">
            <Label htmlFor="country">Country to travel *</Label>
            <Select value={formData.country} onValueChange={(value) => setFormData({...formData, country: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Choose country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="uae">United Arab Emirates</SelectItem>
                <SelectItem value="singapore">Singapore</SelectItem>
                <SelectItem value="malaysia">Malaysia</SelectItem>
                <SelectItem value="thailand">Thailand</SelectItem>
                <SelectItem value="vietnam">Vietnam</SelectItem>
                <SelectItem value="indonesia">Indonesia</SelectItem>
                <SelectItem value="philippines">Philippines</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Purpose of Travel */}
          <div className="space-y-3">
            <Label>Purpose of travel (select one) *</Label>
            <RadioGroup 
              value={formData.purpose} 
              onValueChange={(value) => setFormData({...formData, purpose: value})}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="tourism" id="tourism" />
                <Label htmlFor="tourism">Tourism</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="business" id="business" />
                <Label htmlFor="business">Business</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Travel Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>End date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Number of Travelers */}
          <div className="space-y-2">
            <Label htmlFor="travelers">No. of travellers</Label>
            <Input
              id="travelers"
              type="number"
              min="1"
              max="10"
              value={formData.travelers}
              onChange={(e) => setFormData({...formData, travelers: e.target.value})}
              placeholder="1"
            />
          </div>

          {/* Point of Contact */}
          <div className="space-y-2">
            <Label htmlFor="contact">Point of Contact</Label>
            <Input
              id="contact"
              value={formData.pointOfContact}
              onChange={(e) => setFormData({...formData, pointOfContact: e.target.value})}
              placeholder="Mohamed Riyas"
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Note to our Visa Expert (optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Type here..."
              rows={3}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3">
            {onClose && (
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            )}
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              Continue →
            </Button>
          </div>

          {/* Footer Note */}
          <div className="text-center text-sm text-muted-foreground pt-4 border-t">
            🛡️ StampMyVisa your visa partner
          </div>
        </form>
      </CardContent>
    </Card>
  );
}