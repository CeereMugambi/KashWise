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
    name: 'Kenya Commercial Bank',
    ticker: 'KCB',
    category: InvestmentCategory.Banking,
    currentValue: 450_000,
    costBasis: 400_000,
    changePercent: 12.5,
    sharesOwned: 900,
    pricePerShare: 500,
    icon: 'account_balance',
    color: '#4caf50',
    lastUpdated: new Date('2025-03-20T10:00:00'),
  },
  {
    id: 'inv-002',
    name: 'Safaricom PLC',
    ticker: 'SCOM',
    category: InvestmentCategory.Telecom,
    currentValue: 680_000,
    costBasis: 627_500,
    changePercent: 8.3,
    sharesOwned: 2_000,
    pricePerShare: 340,
    icon: 'phone_android',
    color: '#2196f3',
    lastUpdated: new Date('2025-03-20T10:00:00'),
  },
  {
    id: 'inv-003',
    name: 'Equity Bank',
    ticker: 'EQTY',
    category: InvestmentCategory.Banking,
    currentValue: 320_000,
    costBasis: 326_720,
    changePercent: -2.1,
    sharesOwned: 640,
    pricePerShare: 500,
    icon: 'account_balance',
    color: '#ff9800',
    lastUpdated: new Date('2025-03-20T10:00:00'),
  },
  {
    id: 'inv-004',
    name: 'East African Breweries',
    ticker: 'EABL',
    category: InvestmentCategory.Manufacturing,
    currentValue: 520_000,
    costBasis: 449_000,
    changePercent: 15.7,
    sharesOwned: 400,
    pricePerShare: 1_300,
    icon: 'local_drink',
    color: '#9c27b0',
    lastUpdated: new Date('2025-03-20T10:00:00'),
  },
  {
    id: 'inv-005',
    name: 'KenGen',
    ticker: 'KEGN',
    category: InvestmentCategory.Energy,
    currentValue: 275_000,
    costBasis: 250_000,
    changePercent: 10.0,
    sharesOwned: 5_000,
    pricePerShare: 55,
    icon: 'bolt',
    color: '#f44336',
    lastUpdated: new Date('2025-03-20T10:00:00'),
  },
  {
    id: 'inv-006',
    name: 'Stanlib Fahari I-REIT',
    ticker: 'FAHR',
    category: InvestmentCategory.RealEstate,
    currentValue: 205_000,
    costBasis: 200_000,
    changePercent: 2.5,
    sharesOwned: 10_250,
    pricePerShare: 20,
    icon: 'apartment',
    color: '#00bcd4',
    lastUpdated: new Date('2025-03-20T10:00:00'),
  },
];

// ─────────────────────────────────────────────
//  Derived Portfolio Summary
// ─────────────────────────────────────────────

const totalValue    = mockInvestments.reduce((s, i) => s + i.currentValue, 0);
const totalCost     = mockInvestments.reduce((s, i) => s + i.costBasis, 0);
const totalReturn   = totalValue - totalCost;
const returnPercent = parseFloat(((totalReturn / totalCost) * 100).toFixed(2));

export const mockPortfolioSummary: PortfolioSummary = {
  totalValue,
  totalCostBasis:      totalCost,
  totalReturn,
  returnPercent,
  activeInvestments:   mockInvestments.length,
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