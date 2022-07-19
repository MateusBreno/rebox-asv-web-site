// ./src/pages/privates/User/Provider/List/typing.ts
import User from '@models/User';

export interface IResponseUsers {
  header: {
    total: number;
    role: string;
    page: number;
    per_page: number;
    status_code: number;
    message: string;
  };
  data: User[];
}

export interface ISearchProvidersFormData {
  search: string;
}

export interface IFilterProvidersFormData {
  services_id: string;
  state: string;
  city: string;
  defined_period: string;
  period_start: string;
  period_end: string;
}

export interface IExportData {
  user_name: string;
  user_cpf_or_cnpj: string;
  user_date_of_birth: string;
  user_email: string;
  user_cellphone: string;
  user_status: string;
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
