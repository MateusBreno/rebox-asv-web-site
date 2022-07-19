// ./src/pages/privates/Called/List/typing.ts
import Called from '@models/Called';

export interface IResponseCalled {
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
  data: Called[];
}

export interface ISearchCalledFormData {
  search: string;
}

export interface IFilterCalledFormData {
  services_id: string;
  status: string;
  vehicle_situation: string;
  location_type: string;
  period_type: string;
  defined_period: string;
  period_start: string;
  period_end: string;
}

export interface IExportData {
  called_code: string;
  called_date_created: string;
  called_appointment_date: string;
  services_name: string;
  called_vehicle_situation: string;
  called_location_type: string;
  called_status: string;
  called_call_initiation_date: string;
  called_service_start_date: string;
  called_closing_date: string;
  vehicle_license_plate: string;
  vehicle_brand: string;
  vehicle_model: string;
  called_source_address: string;
  called_destination_address: string;
  called_distance_between_points_in_km: string;
  customer_name: string;
  customer_cpf_or_cnpj: string;
  customer_email: string;
  customer_cellphone: string;
  provider_name: string;
  provider_cpf_or_cnpj: string;
  provider_email: string;
  provider_cellphone: string;
}

export interface ISelect {
  label: string;
  value: string;
}
