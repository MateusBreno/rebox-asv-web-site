// ./src/pages/privates/Contract/List/typing.ts
import Contract from '@models/Contract';

export interface IResponseContracts {
  header: {
    count_total_sales: number;
    count_sales_today: number;
    total: number;
    role: string;
    page: number;
    per_page: number;
    status_code: number;
    message: string;
  };
  data: Contract[];
}

export interface ISearchContractsFormData {
  search: string;
}

export interface IFilterContractsFormData {
  current_payments_status: string;
  products_id: string;
  state: string;
  city: string;
  defined_period: string;
  period_start: string;
  period_end: string;
}

export interface IFilterCurrentPaymentsStatus {
  waiting: boolean;
  overdue: boolean;
  in_day: boolean;
  stop: boolean;
}

export interface IExportData {
  contract_date: string;
  contract_code: string;
  product_name: string;
  contract_status: string;
  contract_currentpaymentstatus: string;
  contract_duedate: string;
  contract_grace_period_release_date: string;
  contract_number_of_uses_allowed: string;
  contract_available_uses: string;
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

export interface IIbgeStates {
  id: number;
  sigla: string;
  nome: string;
  regiao: {
    id: number;
    sigla: string;
    nome: string;
  };
}

export interface IIbgeCities {
  id: number;
  nome: string;
}
