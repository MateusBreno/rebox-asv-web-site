// ./src/pages/privates/User/Customer/Show/typing.ts
import Indication from '@models/Indication';
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

export interface IResponseIndications {
  header: {
    total: number;
    page: number;
    per_page: number;
    status_code: number;
    message: string;
  };
  data: Indication[];
}

export interface IUrlParams {
  id: string;
}
