/**
 * Parameters for a revenue query. If `null`, then `event_params` must be given.
 */
export interface MetricRevenueParams {
  /**
   * Number of days to use for the refund window.
   */
  refundDays?: number

  /**
   * Product slugs to consider. May be empty to include all product slugs.
   */
  productSlugs?: Array<string>

  /**
   * Transaction types to consider. May be empty to include all transaction types.
   */
  transactionTypes?: Array<MetricRevenueParamsTransactionTypesEnum>
}

export enum MetricRevenueParamsTransactionTypesEnum {
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
