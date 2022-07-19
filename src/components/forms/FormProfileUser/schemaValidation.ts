// ./src/components/forms/FormProfileUser/schemaValidation.ts
import * as Yup from 'yup';

export const schema = Yup.object().shape({
  name: Yup.string().required('É obrigatório informa seu nome.'),
  cpf: Yup.string().required('É obrigatório informar seu CPF/CNPJ.'),
  date_of_birth: Yup.string().required(
    'É obrigatório informa sua data de nascimento.',
  ),
  email: Yup.string().email('Informe um endereço de e-mail válido.'),
  cellphone: Yup.string().required('É obrigatório informar seu celular.'),
});
