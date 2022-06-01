// ./src\pages\public\Checkout\StepCustomer\FormPersonalData\typing.ts
export interface IProps {
  forNewSale?: {
    advanceStep(): void;
  };
}

export interface IFormCustomer {
  name: string;
  email: string;
  cellphone: string;
  zip_code: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  number?: number;
  complement?: string;
  code_who_indicated?: string;
}
