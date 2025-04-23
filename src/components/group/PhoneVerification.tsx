
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { validatePhoneNumber, formatPhoneNumber } from '@/utils/otpService';
import { toast } from "sonner";
import { Phone } from 'lucide-react';

interface PhoneVerificationProps {
  onVerified: (phone: string) => void;
  onCancel: () => void;
}

const PhoneVerification = ({ onVerified, onCancel }: PhoneVerificationProps) => {
  const [phone, setPhone] = useState('');
  
  const handleSavePhone = () => {
    if (!validatePhoneNumber(phone)) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }
    
    toast.success("Phone number saved successfully!");
    onVerified(phone);
  };
  
  return (
    <div className="space-y-6 py-4">
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <div className="flex space-x-2">
          <Input
            id="phone"
            placeholder="Enter 10-digit phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            maxLength={10}
            className="flex-1"
          />
        </div>
      </div>
      
      <div className="text-sm text-muted-foreground">
        Enter a phone number for {formatPhoneNumber('9999999999')} (example format)
      </div>
      
      <div className="flex space-x-2 pt-2">
        <Button
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSavePhone} 
          className="flex-1"
          disabled={!phone || phone.length !== 10}
        >
          <Phone className="mr-2 h-4 w-4" />
          Save
        </Button>
      </div>
    </div>
  );
};

export default PhoneVerification;
