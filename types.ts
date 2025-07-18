
export type TransactionType = 'income' | 'expense';

export type Category = 'Food' | 'Bills' | 'Entertainment' | 'Transport' | 'Shopping' | 'Health' | 'Income' | 'Other';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: Category;
  note: string;
  date: string; // YYYY-MM-DD
}

export interface GeminiResponse {
  amount: number;
  vendor: string;
  date: string; // YYYY-MM-DD
  category: Category;
}

export interface ToastMessage {
  message: string;
  type: 'success' | 'error';
}
