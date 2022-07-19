// ./src/pages/privates/Rescue/List/typing.ts
import Rescue from '@models/Rescue';

export interface IResponseRescues {
  header: {
    total: number;
    page: number;
    per_page: number;
    status_code: number;
    message: string;
  };
  data: Rescue[];
}

export interface ISearchRescuesFormData {
  search: string;
}

export interface IFilterRescuesFormData {
  status: string;
  defined_period: string;
  period_start: string;
  period_end: string;
}

export interface IExportData {
  rescue_date: string;
  rescue_code: string;
  user_name: string;
  user_cpf_or_cnpj: string;
  user_email: string;
  user_cellphone: string;
  rescue_amount: string;
  rescue_status: string;
  rescue_date_payment: string;
}

export interface ISelect {
  label: string;
  value: string;
}
