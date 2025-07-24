export interface PRData {
    id: string;
    title: string;
    status: string;
    assignedReviewer: string;
    assignedTester: string;
    daysSinceStatusChange: number;
    createdAt: string;
    updatedAt: string;
    userId: number;
    author: string;
    repository: string;
    branch: string;
}

export interface ExciseData {
  index: number;
  excise_duty_value?: number;
  custom_duty_value?: number;
  vat_on_wholesale_trade_margin?: number;
  splOnWholesaleTradeMargin?: number;
  wholesale_trade_margin?: number;
  Aret60?: number;
  assessment_value?: number;
  RET?: number;
  code?: number;
  dispatchDateTime?: string;
  supplierCode?: string;
  productCode?: string;
  baiscPricepercase?: number;
  brandName?: string;
  brandCode?: string;
  productSize?: string;
  unitPerCase?: number;
  sold_cases?: number;
  sold_part_bottles?: number;
  rate_of_special_margin_value?: number;
  landing_cost?: number;
  sold_total_bottles?: number;
  basic_value?: number;
  sp_fee_value?: number;
  vat_value?: number;
  aed_value?: number;
  issue_price_value?: number;
  additional_privilege_value?: number;
  aret_value?: number;
  cess_value?: number;
  sale_value?: number;
  splFeeIcdc?: number;
  size?: number;
  assignedDepot?: string;
  vendorType?: string;
  districtName?: string;
  cirleName?: string;
  mandalName?: string;
  mrp?: number;
  custom_duty_percase?: number;
  basicPrice?: number;
  brandType?: string;
}

export interface chartData {
    name: string;
    value: number;
}

export interface WeeklyCount {
    week: string;
    count: number;
}

export interface TestsData {
    testId: string;
    prId: string;
    title: string;
    status: 'idle' | 'passed' | 'failed' | 'in_progress';
    testCases: TestCase[];
    totalTestCases: number;
    passedTestCases: number;
    failedTestCases: number;
    skippedTestCases: number;
    coverage: number;
    createdAt: string;
    updatedAt: string;
    executedBy: string;
    shortDescription?: string;
    codeSnippet?: string;
}

interface TestCase {
    id: string;
    name: string;
    status: 'passed' | 'failed' | 'in_progress' | 'pending';
    executionTime: string;
    createdAt: string;
    updatedAt: string;
    environment: string;
    browser?: string;
    device?: string;
    testSteps: string[];
    failureReason?: string;
}

    