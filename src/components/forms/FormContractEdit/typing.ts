// ./src/components/forms/FormContractEdit/typing.ts
export interface ISelect {
  label: string;
  value: string;
}

export interface IFormContract {
  date: string;
  covered_up: string;
  products_id: string;
  form_of_payment: string;
  gross_amount: number;
  amount: number;
  cycle: string;
  due_date: string;
  next_due_date?: string;
  current_payments_status?: string;
  status: string;
  discount_type?: string;
  discount_amount_installments?: number;
  number_installments_with_discount?: number;
  rate_type?: string;
  rate_amount_installments?: number;
  number_installments_with_rate?: number;
  rate_description?: string;
  number_of_uses_allowed?: number;
  available_uses?: number;
  allowed_seasonality_for_calls?: string;
  number_calls_allowed_in_seasonality?: number;
  interval_between_calls_in_days?: number;
  grace_period_release_date?: string;
}
