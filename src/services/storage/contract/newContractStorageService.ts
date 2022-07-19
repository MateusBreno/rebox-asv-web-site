// ./src/services/storage/contract/newContractStorageService.ts

import { ConfigStorage } from '@config/index';

interface IStepsSale {
  id: string;
  field_type: string;
  query: string;
}

interface IPayment {
  due_date: string;
  form_of_payment: string;
  cycle: string;
  discount_type: string;
  discount_amount_installments: number;
  number_installments_with_discount: number;
}

const updateProduct = (data: IStepsSale): void => {
  sessionStorage.setItem(
    ConfigStorage.REBOX_SALE_NEW_PRODUCT,
    JSON.stringify(data),
  );
};

const getProduct = (): IStepsSale => {
  const data =
    sessionStorage.getItem(ConfigStorage.REBOX_SALE_NEW_PRODUCT) || '';
  if (data) {
    const product: IStepsSale = JSON.parse(data);
    return product;
  }

  return {} as IStepsSale;
};

const updateCustomer = (data: IStepsSale): void => {
  sessionStorage.setItem(
    ConfigStorage.REBOX_SALE_NEW_CUSTOMER,
    JSON.stringify(data),
  );
};

const getCustomer = (): IStepsSale => {
  const data =
    sessionStorage.getItem(ConfigStorage.REBOX_SALE_NEW_CUSTOMER) || '';
  if (data) {
    const customer: IStepsSale = JSON.parse(data);
    return customer;
  }

  return {} as IStepsSale;
};

const updateVehicle = (data: IStepsSale): void => {
  sessionStorage.setItem(
    ConfigStorage.REBOX_SALE_NEW_VEHICLE,
    JSON.stringify(data),
  );
};

const getVehicle = (): IStepsSale => {
  const data =
    sessionStorage.getItem(ConfigStorage.REBOX_SALE_NEW_VEHICLE) || '';
  if (data) {
    const customer: IStepsSale = JSON.parse(data);
    return customer;
  }

  return {} as IStepsSale;
};

const updatePayment = (data: IPayment): void => {
  sessionStorage.setItem(
    ConfigStorage.REBOX_SALE_NEW_PAYMENT,
    JSON.stringify(data),
  );
};

const getPayment = (): IPayment => {
  const data =
    sessionStorage.getItem(ConfigStorage.REBOX_SALE_NEW_PAYMENT) || '';
  if (data) {
    const customer: IPayment = JSON.parse(data);
    return customer;
  }

  return {} as IPayment;
};

const cleanMany = (
  untilWhatStep: 'all' | 'customer' | 'vehicle' | 'payment',
): void => {
  const cleanOptions = {
    all: () => {
      sessionStorage.removeItem(ConfigStorage.REBOX_SALE_NEW_PRODUCT);
      sessionStorage.removeItem(ConfigStorage.REBOX_SALE_NEW_CUSTOMER);
      sessionStorage.removeItem(ConfigStorage.REBOX_SALE_NEW_VEHICLE);
      sessionStorage.removeItem(ConfigStorage.REBOX_SALE_NEW_PAYMENT);
    },
    customer: () => {
      sessionStorage.removeItem(ConfigStorage.REBOX_SALE_NEW_CUSTOMER);
      sessionStorage.removeItem(ConfigStorage.REBOX_SALE_NEW_VEHICLE);
      sessionStorage.removeItem(ConfigStorage.REBOX_SALE_NEW_PAYMENT);
    },
    vehicle: () => {
      sessionStorage.removeItem(ConfigStorage.REBOX_SALE_NEW_VEHICLE);
      sessionStorage.removeItem(ConfigStorage.REBOX_SALE_NEW_PAYMENT);
    },
    payment: () => {
      sessionStorage.removeItem(ConfigStorage.REBOX_SALE_NEW_PAYMENT);
    },
  };
  cleanOptions[untilWhatStep]();
};

export default {
  updateProduct,
  getProduct,
  updateCustomer,
  getCustomer,
  updateVehicle,
  getVehicle,
  updatePayment,
  getPayment,
  cleanMany,
};
