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
    /** Current market value in KSH */
    currentValue: number;
    /** Original amount invested in KSH */
    costBasis: number;
    /** Percentage change (positive = gain) */
    changePercent: number;
    sharesOwned: number;
    pricePerShare: number;
    icon: string;
    color: string;
    lastUpdated: Date;
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