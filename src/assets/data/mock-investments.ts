import {
  Investment,
  PortfolioSummary,
  ActivityItem,
  ActivityType,
  InvestmentCategory,
} from 'src/app/models/investment';

// ─────────────────────────────────────────────
//  Mock Investments
// ─────────────────────────────────────────────

export const mockInvestments: Investment[] = [
  {
    id: 'inv-001',
    name: 'Equity Bank Sacco',
    ticker: 'EQBS',
    category: InvestmentCategory.Banking,
    currentValue: 226_000,
    changePercent: 10,
    sharesOwned: 137.46,
    pricePerShare: 72.75,
    icon: 'account_balance',
    color: '#4caf50',
    lastUpdated: new Date('2026-03-24T10:00:00'),
    initialInvestment: 180_000,
    monthlyInvestment: 5_000,
    dividendsPerAnnum: 0.10,
    entryDate: new Date('2026-02-21'),
    isActive: true,
  },
  {
    id: 'inv-002',
    name: 'Safaricom PLC',
    ticker: 'Zidii',
    category: InvestmentCategory.Telecom,
    currentValue: 20_000,
    changePercent: 6.25,
    sharesOwned: 20_000,
    pricePerShare: 1,
    icon: 'phone_android',
    color: '#2196f3',
    lastUpdated: new Date('2026-03-24T10:00:00'),
    initialInvestment: 20_000,
    monthlyInvestment: 0,
    dividendsPerAnnum: 0.0625,
    entryDate: new Date('2026-03-24'),
    isActive: true,
  },
  {
    id: 'inv-003',
    name: 'Equity Bank Shares',
    ticker: 'EQTY',
    category: InvestmentCategory.Banking,
    currentValue: 10_000,
    changePercent: 13,
    sharesOwned: 137.46,
    pricePerShare: 72.75,
    icon: 'account_balance',
    color: '#ff9800',
    lastUpdated: new Date('2026-03-24T10:00:00'),
    initialInvestment: 10_000,
    monthlyInvestment: 0,
    dividendsPerAnnum: 0.13,
    entryDate: new Date('2026-02-24'),
    isActive: true,
  },
  {
    id: 'inv-004',
    name: 'East African Breweries',
    ticker: 'EABL',
    category: InvestmentCategory.Manufacturing,
    currentValue: 520_000,
    changePercent: 15.7,
    sharesOwned: 400,
    pricePerShare: 1_300,
    icon: 'local_drink',
    color: '#9c27b0',
    lastUpdated: new Date('2025-03-20T10:00:00'),
    initialInvestment: 400_000,
    monthlyInvestment: 10_000,
    dividendsPerAnnum: 0.12,
    entryDate: new Date('2020-03-10'),
    isActive: false,
  },
  {
    id: 'inv-005',
    name: 'KenGen',
    ticker: 'KEGN',
    category: InvestmentCategory.Energy,
    currentValue: 275_000,
    changePercent: 10.0,
    sharesOwned: 5_000,
    pricePerShare: 55,
    icon: 'bolt',
    color: '#f44336',
    lastUpdated: new Date('2025-03-20T10:00:00'),
    initialInvestment: 250_000,
    monthlyInvestment: 0,
    dividendsPerAnnum: 0.10,
    entryDate: new Date('2022-08-20'),
    isActive: false,
  },
  {
    id: 'inv-006',
    name: 'Stanlib Fahari I-REIT',
    ticker: 'FAHR',
    category: InvestmentCategory.RealEstate,
    currentValue: 205_000,
    changePercent: 2.5,
    sharesOwned: 10_250,
    pricePerShare: 20,
    icon: 'apartment',
    color: '#00bcd4',
    lastUpdated: new Date('2025-03-20T10:00:00'),
    initialInvestment: 200_000,
    monthlyInvestment: 3_000,
    dividendsPerAnnum: 0.09,
    entryDate: new Date('2023-04-01'),
    isActive: false,
  },
];
// ─────────────────────────────────────────────
//  Derived Portfolio Summary
// ─────────────────────────────────────────────

function monthsElapsed(from: Date): number {
  return Math.floor(
    (new Date().getTime() - from.getTime()) / (1000 * 60 * 60 * 24 * 30.44)
  );
}

function costBasis(inv: Investment): number {
  return inv.initialInvestment + inv.monthlyInvestment * monthsElapsed(inv.entryDate);
}

const activeInvestments = mockInvestments.filter(i => i.isActive);

const totalValue    = activeInvestments.reduce((s, i) => s + i.currentValue, 0);
const totalCost     = activeInvestments.reduce((s, i) => s + costBasis(i), 0);
const totalReturn   = totalValue - totalCost;
const returnPercent = parseFloat(((totalReturn / totalCost) * 100).toFixed(2));

export const mockPortfolioSummary: PortfolioSummary = {
  totalValue,
  totalCostBasis:       totalCost,
  totalReturn,
  returnPercent,
  activeInvestments:    activeInvestments.length,   // counts only active
  diversificationScore: 8.5,
  pendingActions:       3,
};
// ─────────────────────────────────────────────
//  Mock Recent Activity
// ─────────────────────────────────────────────

export const mockRecentActivities: ActivityItem[] = [
  {
    id: 'act-001',
    title: 'Bought 100 shares of KCB',
    date: '2 hours ago',
    timestamp: new Date('2025-03-20T08:00:00'),
    amount: -45_000,
    formattedAmount: '-KSH 45,000',
    isCredit: false,
    type: ActivityType.Buy,
    icon: 'arrow_upward',
    investmentId: 'inv-001',
    sharesCount: 100,
  },
  {
    id: 'act-002',
    title: 'Dividend received from Safaricom',
    date: '1 day ago',
    timestamp: new Date('2025-03-19T14:00:00'),
    amount: 12_500,
    formattedAmount: '+KSH 12,500',
    isCredit: true,
    type: ActivityType.Dividend,
    icon: 'payments',
    investmentId: 'inv-002',
  },
  {
    id: 'act-003',
    title: 'Sold 50 shares of Equity',
    date: '3 days ago',
    timestamp: new Date('2025-03-17T11:00:00'),
    amount: -28_000,
    formattedAmount: '-KSH 28,000',
    isCredit: false,
    type: ActivityType.Sell,
    icon: 'arrow_downward',
    investmentId: 'inv-003',
    sharesCount: 50,
  },
  {
    id: 'act-004',
    title: 'Bought 75 shares of EABL',
    date: '5 days ago',
    timestamp: new Date('2025-03-15T09:30:00'),
    amount: -38_750,
    formattedAmount: '-KSH 38,750',
    isCredit: false,
    type: ActivityType.Buy,
    icon: 'arrow_upward',
    investmentId: 'inv-004',
    sharesCount: 75,
  },
  {
    id: 'act-005',
    title: 'Dividend received from KenGen',
    date: '1 week ago',
    timestamp: new Date('2025-03-13T10:00:00'),
    amount: 5_500,
    formattedAmount: '+KSH 5,500',
    isCredit: true,
    type: ActivityType.Dividend,
    icon: 'payments',
    investmentId: 'inv-005',
  },
];