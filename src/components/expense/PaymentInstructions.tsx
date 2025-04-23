import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MemberBalance, PaymentInstruction } from '@/types/group';
import SettleUpModal from './SettleUpModal';
import { IndianRupee, ArrowRight, CreditCard, CheckCircle2 } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface PaymentInstructionsProps {
  balances: MemberBalance[];
  onSettleUp: (payer: string, payee: string, amount: number, method: string) => Promise<boolean>;
}

const PaymentInstructions = ({ balances, onSettleUp }: PaymentInstructionsProps) => {
  // Format currency to always show two decimal places
  const formatCurrency = (amount: number) => {
    return amount.toFixed(2);
  };

  // Calculate simplified payment instructions
  const calculatePayments = (balances: MemberBalance[]): PaymentInstruction[] => {
    if (!balances || balances.length === 0) return [];
    
    const debtors = balances.filter(b => b.balance < 0)
      .sort((a, b) => a.balance - b.balance); // Most negative first
    
    const creditors = balances.filter(b => b.balance > 0)
      .sort((a, b) => b.balance - a.balance); // Most positive first
    
    const payments: PaymentInstruction[] = [];
    
    // Skip if no payments needed
    if (debtors.length === 0 || creditors.length === 0) {
      return payments;
    }
    
    let debtorIndex = 0;
    let creditorIndex = 0;
    
    // Deep copy balances to avoid modifying the original array
    const debtorsCopy = JSON.parse(JSON.stringify(debtors));
    const creditorsCopy = JSON.parse(JSON.stringify(creditors));
    
    while (debtorIndex < debtorsCopy.length && creditorIndex < creditorsCopy.length) {
      const debtor = debtorsCopy[debtorIndex];
      const creditor = creditorsCopy[creditorIndex];
      
      // How much the debtor still owes (abs because balance is negative)
      const debtorAmount = Math.abs(debtor.balance);
      // How much the creditor should receive
      const creditorAmount = creditor.balance;
      
      // The amount to settle in this transaction
      const amountToSettle = Math.min(debtorAmount, creditorAmount);
      
      if (amountToSettle > 0.01) { // Only add if amount is significant
        payments.push({
          payer: debtor.name,
          payee: creditor.name,
          amount: amountToSettle
        });
      }
      
      // Update balances
      debtor.balance += amountToSettle;
      creditor.balance -= amountToSettle;
      
      // Move to next debtor if this one has settled all debts
      if (Math.abs(debtor.balance) < 0.01) {
        debtorIndex++;
      }
      
      // Move to next creditor if this one has received all money
      if (Math.abs(creditor.balance) < 0.01) {
        creditorIndex++;
      }
    }
    
    return payments;
  };
  
  const payments = calculatePayments([...balances]);
  
  return (
    <Card className="shadow-lg border border-border/60 bg-card/95 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-primary/10">
            <CreditCard className="h-4 w-4 text-primary" />
          </span>
          Payment Instructions
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {payments.length === 0 ? (
          <div className="text-center py-10 px-4">
            <div className="h-12 w-12 rounded-full bg-secondary/60 mx-auto flex items-center justify-center mb-3">
              <CheckCircle2 className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-medium">No payments needed</p>
            <p className="text-sm text-muted-foreground mt-1">Everyone is settled up!</p>
          </div>
        ) : (
          <>
            <p className="mb-4 text-sm text-muted-foreground">
              To settle all debts in the group, the following payments need to be made:
            </p>
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader className="bg-secondary/50">
                  <TableRow>
                    <TableHead className="font-medium">From</TableHead>
                    <TableHead className="text-center font-medium">Direction</TableHead>
                    <TableHead className="font-medium">To</TableHead>
                    <TableHead className="font-medium">Amount</TableHead>
                    <TableHead className="text-right font-medium">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment, index) => (
                    <TableRow key={index} className="hover:bg-secondary/30">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium">
                            {payment.payer.charAt(0).toUpperCase()}
                          </div>
                          <span>{payment.payer}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center">
                          <ArrowRight className="h-5 w-5 text-primary" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium">
                            {payment.payee.charAt(0).toUpperCase()}
                          </div>
                          <span>{payment.payee}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-primary/5 text-foreground">
                          <IndianRupee className="h-3 w-3 mr-1" />
                          {formatCurrency(payment.amount)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <SettleUpModal
                          payer={payment.payer}
                          payee={payment.payee}
                          amount={payment.amount}
                          onSettleUp={onSettleUp}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentInstructions;
