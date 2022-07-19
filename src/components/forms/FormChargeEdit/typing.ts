// ./src/components/forms/FormChargeEdit/typing.ts
export interface ISelect {
  label: string;
  value: string;
}

export interface IFormCharge {
  date_created: string;
  form_of_payment: string;
  amount: string;
  due_date: string;
  pay_day?: string;
  status: string;
  charge_type: string;
  installment?: string;
  description?: string;
}
