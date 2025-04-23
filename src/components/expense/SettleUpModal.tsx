
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { CreditCard, Banknote, IndianRupee, ArrowRight, LoaderCircle } from 'lucide-react';

interface SettleUpModalProps {
  payer: string;
  payee: string;
  amount: number;
  onSettleUp: (payer: string, payee: string, amount: number, method: string, transactionId?: string) => Promise<boolean>;
}

const SettleUpModal = ({ payer, payee, amount, onSettleUp }: SettleUpModalProps) => {
  const [open, setOpen] = useState(false);
  const [method, setMethod] = useState<'cash' | 'online'>('cash');
  const [reference, setReference] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const formatCurrency = (amount: number) => {
    return amount.toFixed(2);
  };
  
  const handleSettleUp = async () => {
    if (method === 'online' && !reference.trim()) {
      toast.error("Please enter a reference/transaction ID");
      return;
    }
    
    setIsLoading(true);
    const success = await onSettleUp(
      payer, 
      payee, 
      amount, 
      method === 'online' ? `online (${reference})` : 'cash',
      method === 'online' ? reference : undefined
    );
    setIsLoading(false);
    
    if (success) {
      toast.success(`Payment recorded: ${payer} paid ${payee}`);
      setOpen(false);
      resetForm();
    }
  };
  
  const resetForm = () => {
    setReference('');
    setMethod('cash');
  };
  
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetForm();
    }
    setOpen(newOpen);
  };
  
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-1 w-full"
        >
          Record Payment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Record Payment</DialogTitle>
          <DialogDescription>
            <div className="py-2">
              <div className="flex items-center justify-center space-x-2 my-4">
                <span className="font-semibold text-base">{payer}</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold text-base">{payee}</span>
              </div>
              
              <div className="text-lg font-semibold flex items-center justify-center pt-2 pb-4">
                <IndianRupee className="h-4 w-4 mr-1" />
                {formatCurrency(amount)}
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="payment-method">Payment Method</Label>
            <Select 
              value={method} 
              onValueChange={(value) => setMethod(value as 'cash' | 'online')}
            >
              <SelectTrigger id="payment-method">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">
                  <div className="flex items-center">
                    <Banknote className="mr-2 h-4 w-4" />
                    <span>Cash</span>
                  </div>
                </SelectItem>
                <SelectItem value="online">
                  <div className="flex items-center">
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Online Payment</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {method === 'online' && (
            <div className="grid gap-2">
              <Label htmlFor="reference">Reference/Transaction ID</Label>
              <Input
                id="reference"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="Enter payment reference"
              />
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSettleUp} 
            disabled={isLoading || (method === 'online' && !reference)}
          >
            {isLoading ? (
              <>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Record Payment"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SettleUpModal;
