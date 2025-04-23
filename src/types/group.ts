
export interface GroupData {
  id: string;
  name: string;
  description: string;
  members: string[];
  expenses: Expense[];
  settlements: Settlement[];
  createdAt: Date;
  memberPhones?: Record<string, string>; // New field to store verified phone numbers
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: string;
  date: Date;
  splits: ExpenseSplit[];
  category?: string;
}

export interface ExpenseSplit {
  memberId: string;
  amount: number;
  percentage: number;
  isEqual: boolean;
}

export interface Settlement {
  id: string;
  payer: string;
  payee: string;
  amount: number;
  date: Date;
  method: string;
  transactionId?: string; // Add transaction ID for online payments
  status?: 'pending' | 'completed' | 'failed'; // Add status for online payments
}

export interface MemberBalance {
  name: string;
  paid: number;
  shouldPay: number;
  balance: number;
}

export interface PaymentInstruction {
  payer: string;
  payee: string;
  amount: number;
}

export interface ExpenseSummary {
  totalAmount: number;
  averageAmount: number;
  largestExpense: {
    description: string;
    amount: number;
  };
  smallestExpense: {
    description: string;
    amount: number;
  };
}
