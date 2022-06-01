// ./src/pages/privates/Contract/Show/typing.ts
import Called from '@models/Called';
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

export interface IUrlParams {
  id: string;
}
