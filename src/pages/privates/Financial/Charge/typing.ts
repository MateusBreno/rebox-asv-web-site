// ./src/pages/privates/Financial/Charge/typing.ts
import Payment from '@models/Payment';

export interface IResponseCharges {
  header: {
    total: number;
    page: number;
    per_page: number;
    status_code: number;
    message: string;
  };
  data: Payment[];
}

export interface ISearchChargesFormData {
  search: string;
}

export interface IFilterChargesFormData {
  current_payments_status: string;
  status: string;
  period_type: string;
  defined_period: string;
  period_start: string;
  period_end: string;
}

export interface IExportData {
  payment_date_created: string;
  payment_form_of_payment: string;
  payment_amount: string;
  payment_due_date: string;
  payment_status: string;
  payment_pay_day: string;
  contract_code: string;
  contract_date: string;
  product_name: string;
  contract_currentpaymentstatus: string;
  contract_grace_period_release_date: string;
  user_name: string;
  user_cpf_or_cnpj: string;
  user_date_of_birth: string;
  user_email: string;
  user_cellphone: string;
  user_adresses_state: string;
  user_adresses_city: string;
  user_vehicle_licenseplate: string;
  user_vehicle_brand: string;
  user_vehicle_model: string;
  user_vehicle_classification: string;
}

export interface ISelect {
  label: string;
  value: string;
}
