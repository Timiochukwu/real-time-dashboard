// src/app/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import SummaryCards from '@/components/SummaryCards';
import TransactionTable from '@/components/TransactionTable';
import { Transaction } from '@/types';
import { io } from 'socket.io-client';

interface PaginationInfo {
  current: number;
  pages: number;
  total: number;
  hasNext: boolean;
  hasPrev: boolean;
  limit: number;
}

interface SummaryData {
  totalBalance: {
    raw: number;
    formatted: string;
  };
  totalCredits: {
    raw: number;
    formatted: string;
  };
  totalDebits: {
    raw: number;
    formatted: string;
  };
  transactionsByStatus: {
    completed: number;
    pending: number;
    failed: number;
  };
}

export default function DashboardPage() {
  const { user, token } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);

  const fetchSummary = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/transactions/summary`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch summary data');
      }

      const data = await response.json();
      setSummaryData(data);
    } catch (err) {
      console.error('Error fetching summary:', err);
    }
  };

  const fetchTransactions = async (page: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/transactions?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }

      const data = await response.json();
      setTransactions(data.transactions);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchTransactions(currentPage);
      fetchSummary();

      const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:1000', {
        auth: { token },
      });

      socket.on('connect', () => {
        console.log('Connected to WebSocket server');
      });

      socket.on('newTransaction', (newTransaction: Transaction) => {
        console.log('New transaction received:', newTransaction);
        // Only add new transaction if we're on the first page
        if (currentPage === 1) {
          setTransactions((prevTransactions) => [newTransaction, ...prevTransactions]);
        }
        // Refresh summary data when a new transaction is received
        fetchSummary();
      });

      socket.on('disconnect', () => {
        console.log('Disconnected from WebSocket server');
      });

      socket.on('connect_error', (err) => {
        console.error('WebSocket connection error:', err.message);
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [token, currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    fetchTransactions(newPage);
  };

  const handleTransactionClick = (transaction: Transaction) => {
    // Handle transaction click - could open a modal with details
    console.log('Transaction clicked:', transaction);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">
          Welcome back, {user?.name}
        </h1>
      </div>

      {summaryData && (
        <SummaryCards
          totalBalance={summaryData.totalBalance}
          totalCredits={summaryData.totalCredits}
          totalDebits={summaryData.totalDebits}
          pendingTransactions={summaryData.transactionsByStatus.pending}
        />
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Transactions
        </h2>
        <TransactionTable
          transactions={transactions}
          onTransactionClick={handleTransactionClick}
        />
        
        {pagination && (
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {((currentPage - 1) * pagination.limit) + 1} to {Math.min(currentPage * pagination.limit, pagination.total)} of {pagination.total} transactions
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!pagination.hasPrev}
                className={`px-3 py-1 rounded-md ${
                  pagination.hasPrev
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!pagination.hasNext}
                className={`px-3 py-1 rounded-md ${
                  pagination.hasNext
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}