import { ApiData } from '@/api/ApiData'

/**
 * Parameters for a revenue query. If `null`, then `event_params` must be given.
 */
export class MetricRevenueParams {
  /**
   * Number of days to use for the refund window.
   */
  public readonly refundDays?: number

  /**
   * Product slugs to consider. May be empty to include all product slugs.
   */
  public readonly productSlugs?: Array<string>

  /**
   * Transaction types to consider. May be empty to include all transaction types.
   */
  public readonly transactionTypes?: Array<TransactionTypes>

  /**
   * Constructs a new instance.
   */
  constructor(data: Readonly<MetricRevenueParams>) {
    Object.assign(this, data)
  }

  /**
   * Create an instance from raw API data (parsed JSON).
   *
   * @param apiData Raw API data.
   */
  static fromApiData(apiData: ApiData) {
    return new MetricRevenueParams({
      refundDays: apiData.refund_days,
      productSlugs: apiData.product_slugs,
      transactionTypes: apiData.transaction_types.map((transactionType: string) => transactionType as TransactionTypes),
    })
  }
}

export enum TransactionTypes {
  NewPurchase = 'new purchase',
  Recurring = 'recurring',
  Cancellation = 'cancellation',
  StopRecurring = 'stop recurring',
  UpdateCard = 'update card',
  Refund = 'refund',
  StartTrial = 'start trial',
  StartRecurring = 'start recurring',
  TransferOut = 'transfer out',
  TransferIn = 'transfer in',
  Reactivation = 'reactivation',
}
