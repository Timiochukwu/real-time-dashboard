// src/types/index.ts
export interface User {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'user';
  }
  
  export interface AuthResponse {
    message: string;
    token: string;
    user: User;
  }
  
  export interface Transaction {
    _id: string;
    id: string;
    amount: number;
    type: 'credit' | 'debit';
    status: 'completed' | 'pending' | 'failed';
    description: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface TransactionResponse {
    transactions: Transaction[];
    pagination: {
      current: number;
      pages: number;
      total: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }
  
  export interface DashboardSummary {
    totalUsers: number;
    totalTransactions: number;
    totalBalance: number;
    totalCredits: number;
    totalDebits: number;
    transactionsByStatus: {
      completed: number;
      pending: number;
      failed: number;
    };
  }
  
  export interface FilterOptions {
    type?: 'credit' | 'debit';
    status?: 'pending' | 'completed' | 'failed';
    category?: string;
    search?: string;
  }
  
  export interface SortOptions {
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  }
  
  export interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
  }
  

  