// ./src/pages/privates/Contract/New/StepCustomer/schemaValidation.ts
import * as Yup from 'yup';

import { ConfigValues } from '@config/index';
import { formatCNPJ, formatCPF } from '@utils/formatters';
import { validatorCnpj, validatorCpf } from '@utils/validators';

export const schemaFormValidation = Yup.object().shape({
  field_type: Yup.string().required(
    'Por favor, informe o tipo de campo que deseja validar.',
  ),
  query: Yup.string().when('field_type', {
    is: value =>
      value ===
      ConfigValues.rebox.default.outhers.sales_new.field_type.user_email,
    then: Yup.string()
      .required('Por favor, informe o e-mail do cliente.')
      .email('Por favor, informe um endereço de e-mail válido.'),
    otherwise: Yup.string().when('field_type', {
      is: value =>
        value ===
        ConfigValues.rebox.default.outhers.sales_new.field_type.user_cpf,
      then: Yup.string()
        .required('Por favor, informe o CPF do cliente.')
        .test('cpf-valid', 'Por favor, informe um CPF válido.', value => {
          if (value) {
            return validatorCpf.check(formatCPF.removeMask(value));
          }
          return false;
        }),
      otherwise: Yup.string()
        .required('Por favor, informe o CNPJ do cliente.')
        .test('cnpj-valid', 'Por favor, informe um CNPJ válido.', value => {
          if (value) {
            return !validatorCnpj.check(formatCNPJ.removeMask(value));
          }
          return false;
        }),
    }),
  }),
});
