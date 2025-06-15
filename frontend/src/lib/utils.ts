
  // src/lib/utils.ts
  import { type ClassValue, clsx } from 'clsx';
  
  export function cn(...inputs: ClassValue[]) {
    return clsx(inputs);
  }
  
  export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  export const formatDate = (date: string): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };
  
  export const getStatusColor = (status: string): string => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'failed':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };
  
  export const getTypeColor = (type: string): string => {
    return type === 'credit' ? 'text-green-600' : 'text-red-600';
  };