// ./src/components/forms/FormCustomerEdit/typing.ts

export interface IFormCustomer {
  name: string;
  date_of_birth?: string;
  person_type: string;
  cpf_cnpj: string;
  sex?: string;
  email: string;
  cellphone: string;
  telephone?: string;
  status: string;
  company_size?: string;
  access_level: string;
  code_subordinate_of?: string;
  code_who_indicated?: string;
}
