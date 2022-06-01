// ./src/components/forms/FormCustomerNew/schemaValidation.ts
import * as Yup from 'yup';

import { formatText } from '@utils/formatters';

export const schemaCustomer = Yup.object().shape({
  name: Yup.string().required('Por favor, informe seu nome completo.'),
  email: Yup.string()
    .required('Por favor, informe seu e-mail.')
    .email('Por favor, informe um endereço de e-mail válido.'),
  cellphone: Yup.string()
    .required('Por favor, informe seu celular/whatsapp.')
    .test(
      'cellphone-valid',
      'Por favor, informe um celular/whatsapp válido.',
      value => formatText.removeAllNonDigits(value || '').length === 13,
    ),
  zip_code: Yup.string().required('É obrigatório informar seu CEP.'),
  state: Yup.string().required('É obrigatório a UF do seu estado.'),
  city: Yup.string().required('É obrigatório informar sua cidade.'),
  street: Yup.string().required('É obrigatório informar a sua rua.'),
  neighborhood: Yup.string().required('É obrigatório informar seu bairro.'),
  number: Yup.string().optional(),
  complement: Yup.string().optional(),
  code_who_indicated: Yup.string().optional(),
});
