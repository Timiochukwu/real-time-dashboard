// src/components/SummaryCards.tsx
'use client'

import { Transaction } from '@/types'
import { 
  ArrowUp, 
  ArrowDown, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  Zap,
  Eye,
  BarChart3,
  Wifi,
  Star,
  Activity
} from 'lucide-react'

interface SummaryCardsProps {
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
  pendingTransactions: number;
}

export default function SummaryCards({
  totalBalance,
  totalCredits,
  totalDebits,
  pendingTransactions,
}: SummaryCardsProps) {
  // Calculate trends (mock data for demo)
  const trends = [12.5, 8.3, -4.2, 15.7]

  const cards = [
    {
      title: 'Total Balance',
      value: totalBalance.formatted,
      icon: DollarSign,
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50',
      iconBg: 'bg-blue-500',
      trend: trends[0],
      subtitle: 'Available balance',
      sparkline: [45, 52, 48, 61, 55, 62, 58, 65, 70]
    },
    {
      title: 'Total Income',
      value: totalCredits.formatted,
      icon: TrendingUp,
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50',
      iconBg: 'bg-green-500',
      trend: trends[1],
      subtitle: 'This month',
      sparkline: [30, 35, 32, 45, 40, 48, 52, 58, 65]
    },
    {
      title: 'Total Expenses',
      value: totalDebits.formatted,
      icon: ArrowDown,
      gradient: 'from-red-500 to-pink-500',
      bgGradient: 'from-red-50 to-pink-50',
      iconBg: 'bg-red-500',
      trend: trends[2],
      subtitle: 'This month',
      sparkline: [60, 58, 62, 55, 48, 45, 50, 47, 42]
    },
    {
      title: 'Pending',
      value: pendingTransactions.toString(),
      icon: Clock,
      gradient: 'from-amber-500 to-orange-500',
      bgGradient: 'from-amber-50 to-orange-50',
      iconBg: 'bg-amber-500',
      trend: trends[3],
      subtitle: 'Transactions',
      sparkline: [5, 8, 6, 12, 10, 15, 18, 14, 16]
    },
  ]

  // Mini sparkline component
  const Sparkline = ({ data, color }: { data: number[], color: string }) => {
    const max = Math.max(...data)
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * 100
      const y = 100 - (value / max) * 100
      return `${x},${y}`
    }).join(' ')

    return (
      <svg className="w-16 h-8" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="3"
          points={points}
        />
      </svg>
    )
  }

  return (
    <div className="space-y-8">
      {/* Main Balance Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-3xl p-8 text-white shadow-2xl">
        {/* Animated background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-cyan-500/10 to-blue-500/10 rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
                <p className="text-slate-300 text-sm font-medium">Main Account</p>
              </div>
              <div className="flex items-center space-x-2">
                <p className="text-white text-sm opacity-80">•••• •••• •••• 4629</p>
                <div className="flex space-x-1">
                  <div className="h-1 w-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></div>
                  <div className="h-1 w-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-2 bg-white/10 rounded-xl backdrop-blur-sm hover:bg-white/20 transition-all duration-200">
                <Eye className="h-4 w-4 text-slate-300" />
              </button>
              <button className="p-2 bg-white/10 rounded-xl backdrop-blur-sm hover:bg-white/20 transition-all duration-200">
                <BarChart3 className="h-5 w-5 text-slate-300" />
              </button>
              <button className="p-2 bg-white/10 rounded-xl backdrop-blur-sm hover:bg-white/20 transition-all duration-200">
                <Wifi className="h-4 w-4 text-green-400" />
              </button>
            </div>
          </div>
          
          <div className="mb-8">
            <p className="text-5xl md:text-6xl font-bold mb-3 bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
              {totalBalance.formatted}
            </p>
            <div className="flex items-center space-x-3">
              <div className={`flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${
                trends[0] >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              }`}>
                <Activity className="h-3 w-3 mr-1" />
                {trends[0] >= 0 ? '↗' : '↘'} {Math.abs(trends[0])}%
              </div>
              <span className="text-slate-300 text-sm">from last month</span>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-3 w-3 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-slate-500'}`} />
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 hover:bg-white/15 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <ArrowUp className="h-4 w-4 text-green-400" />
                  <span className="text-slate-300 text-sm font-medium">Income</span>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Sparkline data={[30, 35, 32, 45, 40, 48, 52, 58, 65]} color="#10b981" />
                </div>
              </div>
              <p className="text-2xl font-bold text-white">
                {totalCredits.formatted}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 hover:bg-white/15 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <ArrowDown className="h-4 w-4 text-red-400" />
                  <span className="text-slate-300 text-sm font-medium">Expenses</span>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Sparkline data={[60, 58, 62, 55, 48, 45, 50, 47, 42]} color="#ef4444" />
                </div>
              </div>
              <p className="text-2xl font-bold text-white">
                {totalDebits.formatted}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <div
            key={card.title}
            className={`relative overflow-hidden bg-gradient-to-br ${card.bgGradient} rounded-3xl p-6 border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer group`}
            style={{
              animationDelay: `${index * 100}ms`,
              animation: 'fadeIn 0.6s ease-out forwards'
            }}
          >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-700"></div>
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <p className="text-gray-600 text-sm font-semibold mb-1">{card.title}</p>
                  <p className="text-gray-500 text-xs">{card.subtitle}</p>
                </div>
                <div className={`p-3 rounded-2xl ${card.iconBg} bg-opacity-15 group-hover:bg-opacity-25 group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                  <card.icon className={`h-6 w-6 ${card.iconBg.replace('bg-', 'text-')}`} />
                </div>
              </div>

              <div className="mb-6">
                <p className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {card.value}
                </p>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Sparkline data={card.sparkline} color={card.iconBg.includes('blue') ? '#3b82f6' : card.iconBg.includes('green') ? '#10b981' : card.iconBg.includes('red') ? '#ef4444' : '#f59e0b'} />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className={`flex items-center px-3 py-1.5 rounded-full text-xs font-bold ${
                  card.trend >= 0 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {card.trend >= 0 ? '↗' : '↘'} {Math.abs(card.trend)}%
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Zap className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}