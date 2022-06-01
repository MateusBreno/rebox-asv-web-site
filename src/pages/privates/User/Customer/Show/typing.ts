// ./src/pages/privates/User/Customer/Show/typing.ts
import Called from '@models/Called';
import Contract from '@models/Contract';
import Payment from '@models/Payment';

export interface IResponseContracts {
  header: {
    total: number;
    page: number;
    per_page: number;
    status_code: number;
    message: string;
  };
  data: Contract[];
}

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
