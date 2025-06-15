// src/components/TransactionTable.tsx
'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { Transaction } from '@/types'
import { 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Filter, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  CheckCircle, 
  XCircle,
  MoreVertical,
  Calendar,
  DollarSign
} from 'lucide-react'

interface TransactionTableProps {
  transactions: Transaction[]
  onTransactionClick?: (transaction: Transaction) => void
}

export default function TransactionTable({ transactions, onTransactionClick }: TransactionTableProps) {
  const [sortField, setSortField] = useState<keyof Transaction>('createdAt')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [filter, setFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [showFilters, setShowFilters] = useState(false)

  const handleSort = (field: keyof Transaction) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const filteredAndSortedTransactions = transactions
    .filter((transaction) => {
      const matchesSearch = Object.values(transaction).some((value) =>
        value?.toString().toLowerCase().includes(filter.toLowerCase())
      )
      const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter
      const matchesType = typeFilter === 'all' || transaction.type === typeFilter
      return matchesSearch && matchesStatus && matchesType
    })
    .sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
      }

      if (sortField === 'createdAt') {
        const dateA = new Date(a.createdAt).getTime()
        const dateB = new Date(b.createdAt).getTime()
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA
      }

      return 0
    })

  const getSortIcon = (field: keyof Transaction) => {
    if (sortField === field) {
      return sortDirection === 'asc' ? 
        <ChevronUp className="ml-1 h-4 w-4 text-primary-600" /> : 
        <ChevronDown className="ml-1 h-4 w-4 text-primary-600" />
    }
    return <ChevronDown className="ml-1 h-4 w-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getTypeIcon = (type: string) => {
    return type === 'credit' ? 
      <ArrowDownLeft className="h-4 w-4 text-green-500" /> :
      <ArrowUpRight className="h-4 w-4 text-red-500" />
  }

  const formatAmount = (amount: number, type: string) => {
    const formatted = Math.abs(amount).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
    return type === 'credit' ? `+$${formatted}` : `-$${formatted}`
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-50 to-primary-100 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Transactions</h2>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow-sm border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <Filter className="h-4 w-4" />
            Filters
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search transactions..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 shadow-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 transition-all duration-300 ${showFilters || window.innerWidth >= 1024 ? 'block' : 'hidden lg:block'}`}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
          
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
          >
            <option value="all">All Types</option>
            <option value="credit">Credit</option>
            <option value="debit">Debit</option>
          </select>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="group px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('createdAt')}
              >
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  Date
                  {getSortIcon('createdAt')}
                </div>
              </th>
              <th
                className="group px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('description')}
              >
                <div className="flex items-center">
                  Description
                  {getSortIcon('description')}
                </div>
              </th>
              <th
                className="group px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('amount')}
              >
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                  Amount
                  {getSortIcon('amount')}
                </div>
              </th>
              <th
                className="group px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('type')}
              >
                <div className="flex items-center">
                  Type
                  {getSortIcon('type')}
                </div>
              </th>
              <th
                className="group px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center">
                  Status
                  {getSortIcon('status')}
                </div>
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAndSortedTransactions.map((transaction) => (
              <tr
                key={transaction._id}
                className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer group"
                onClick={() => onTransactionClick?.(transaction)}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {format(new Date(transaction.createdAt), 'MMM d, yyyy')}
                    </span>
                    <span className="text-xs text-gray-500">
                      {format(new Date(transaction.createdAt), 'HH:mm')}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="font-medium text-gray-900 truncate max-w-xs">
                    {transaction.description}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(transaction.type)}
                    <span
                      className={`font-bold text-lg ${
                        transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {formatAmount(transaction.amount, transaction.type)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${
                      transaction.type === 'credit'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {transaction.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(transaction.status)}
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${
                        transaction.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : transaction.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <button className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden">
        <div className="divide-y divide-gray-200">
          {filteredAndSortedTransactions.map((transaction) => (
            <div
              key={transaction._id}
              className="p-4 hover:bg-gray-50 transition-colors cursor-pointer active:bg-gray-100"
              onClick={() => onTransactionClick?.(transaction)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {getTypeIcon(transaction.type)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">
                      {transaction.description}
                    </div>
                    <div className="text-xs text-gray-500">
                      {format(new Date(transaction.createdAt), 'MMM d, yyyy • HH:mm')}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`font-bold text-lg ${
                      transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {formatAmount(transaction.amount, transaction.type)}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(transaction.status)}
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${
                      transaction.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : transaction.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {transaction.status}
                  </span>
                </div>
                <button className="text-gray-400 hover:text-gray-600 p-1">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {filteredAndSortedTransactions.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No transactions found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Results Summary */}
      {filteredAndSortedTransactions.length > 0 && (
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Showing {filteredAndSortedTransactions.length} of {transactions.length} transactions
          </p>
        </div>
      )}
    </div>
  )
}