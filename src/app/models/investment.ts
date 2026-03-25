// ─────────────────────────────────────────────
//  Investment Domain Models
// ─────────────────────────────────────────────

export enum InvestmentCategory {
    Banking        = 'Banking',
    Telecom        = 'Telecommunications',
    Manufacturing  = 'Manufacturing',
    Energy         = 'Energy',
    RealEstate     = 'Real Estate',
    Agriculture    = 'Agriculture',
  }
  
  export enum ActivityType {
    Buy      = 'buy',
    Sell     = 'sell',
    Dividend = 'dividend',
    Transfer = 'transfer',
  }
  
  
  // ─── Core Entities ───────────────────────────
  export interface Investment {
    id: string;
    name: string;
    ticker?: string;
    category: InvestmentCategory;
    currentValue: number;
    /** Replaces costBasis — computed as initialInvestment + (monthlyInvestment × months) */
    initialInvestment: number;
    monthlyInvestment: number;
    dividendsPerAnnum: number;
    entryDate: Date;
    changePercent: number;
    sharesOwned: number;
    pricePerShare: number;
    icon: string;
    color: string;
    lastUpdated: Date;
    isActive: boolean;
  }

  // ─────────────────────────────────────────────
//  Tranche — a single chunk of capital with
//  its own rate and start date
// ─────────────────────────────────────────────
export type TrancheType = 'share_capital' | 'deposit';

export interface InvestmentTranche {
  id: string;
  label: string;
  type: TrancheType;
  /** Amount placed into this tranche (KSH) */
  principal: number;
  /** Annual dividend/interest rate, e.g. 0.13 = 13% */
  annualDividendRate: number;
  startDate: Date;
  /** Computed: principal × rate × (months elapsed / 12) */
  dividendEarned: number;
  /** principal + dividendEarned */
  currentValue: number;
}

// ─────────────────────────────────────────────
//  InvestmentDetails extends Investment
//  with tranche breakdown + contribution data
// ─────────────────────────────────────────────
export interface InvestmentDetails extends Investment {
  tranches: InvestmentTranche[];
  /** Recurring top-up added each month (KSH) */
  monthlyContribution: number;
  /** When monthly contributions started */
  contributionStartDate: Date;
  /** Date the very first capital was deployed */
  investmentStartDate: Date;
  /** How many months since investmentStartDate */
  months: number;
  /** Sum of principal across all tranches + accumulated contributions */
  totalPrincipalInvested: number;
  /** Sum of dividendEarned across all tranches */
  totalDividendEarned: number;
  /** What you expect to earn in dividends over a full year at current balances */
  projectedAnnualDividend: number;
}
  
  export interface PortfolioSummary {
    totalValue: number;
    totalCostBasis: number;
    totalReturn: number;
    returnPercent: number;
    activeInvestments: number;
    diversificationScore: number;  // 0–10
    pendingActions: number;
  }
  
  export interface ActivityItem {
    id: string;
    title: string;
    date: string;                  // Human-readable relative date
    timestamp: Date;
    amount: number;                // Positive = credit, Negative = debit
    formattedAmount: string;       // e.g. "+KSH 12,500"
    isCredit: boolean;
    type: ActivityType;
    icon: string;
    investmentId?: string;
    sharesCount?: number;
  }