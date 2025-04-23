import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settlement } from '@/types/group';
import { format } from 'date-fns';
import { IndianRupee, CreditCard, Banknote, ArrowRight, CheckCircle2, Clock, Trash2 } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useState } from "react";

interface SettlementHistoryProps {
  settlements: Settlement[];
  onDeleteSettlement: (settlementId: string) => Promise<boolean>;
}

const SettlementHistory = ({ settlements, onDeleteSettlement }: SettlementHistoryProps) => {
  const [selectedSettlementId, setSelectedSettlementId] = useState<string | null>(null);
  
  const formatCurrency = (amount: number) => {
    return amount.toFixed(2);
  };
  
  const formatDate = (date: Date) => {
    return format(new Date(date), 'MMM d, yyyy');
  };
  
  const getMethodIcon = (method: string) => {
    if (method.includes('online')) {
      return <CreditCard className="h-4 w-4" />;
    }
    return <Banknote className="h-4 w-4" />;
  };
  
  const getStatusBadge = (settlement: Settlement) => {
    if (!settlement.status || settlement.status === 'completed') {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
          Completed
        </Badge>
      );
    }
    if (settlement.status === 'pending') {
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          <Clock className="h-3.5 w-3.5 mr-1" />
          Pending
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
        Failed
      </Badge>
    );
  };

  const handleDeleteSettlement = async () => {
    if (selectedSettlementId) {
      await onDeleteSettlement(selectedSettlementId);
      setSelectedSettlementId(null);
    }
  };

  return (
    <Card className="shadow-lg border border-border/60 bg-card/95 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold">Settlement History</CardTitle>
      </CardHeader>
      <CardContent>
        {settlements.length === 0 ? (
          <div className="text-center py-10 px-4">
            <p className="text-muted-foreground">No settlements recorded yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {settlements
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((settlement, index) => (
                <div 
                  key={settlement.id || index}
                  className="p-4 border rounded-lg bg-secondary/40"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-semibold text-sm">{settlement.payer}</span>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold text-sm">{settlement.payee}</span>
                      </div>
                      
                      <div className="flex items-center text-md font-medium">
                        <IndianRupee className="h-3.5 w-3.5 mr-1" />
                        {formatCurrency(settlement.amount)}
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-start md:items-end gap-2">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <span>{formatDate(settlement.date)}</span>
                      </div>
                      
                      <div className="flex items-center text-xs text-muted-foreground space-x-2">
                        <div className="flex items-center">
                          {getMethodIcon(settlement.method)}
                          <span className="ml-1 capitalize">
                            {settlement.method.includes('online') 
                              ? 'Online Payment' 
                              : settlement.method}
                          </span>
                        </div>
                        
                        {settlement.status && (
                          <div className="ml-2">
                            {getStatusBadge(settlement)}
                          </div>
                        )}
                      </div>
                      
                      {settlement.transactionId && (
                        <div className="text-xs text-muted-foreground mt-1">
                          <span className="font-medium">Tx ID:</span> {settlement.transactionId}
                        </div>
                      )}
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                            onClick={() => setSelectedSettlementId(settlement.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Settlement</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this settlement record? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <Button 
                              variant="outline" 
                              onClick={() => setSelectedSettlementId(null)}
                            >
                              Cancel
                            </Button>
                            <Button 
                              variant="destructive"
                              onClick={handleDeleteSettlement}
                            >
                              Delete
                            </Button>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SettlementHistory;
