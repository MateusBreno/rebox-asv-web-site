// ./src/pages/privates/Contract/New/StepPayment/schemaValidation.ts
import * as Yup from 'yup';

import { ConfigValues } from '@config/index';
import { formatCNPJ, formatCPF } from '@utils/formatters';
import { validatorCnpj, validatorCpf } from '@utils/validators';

export const schema = Yup.object().shape({
  number_installments: Yup.string().optional(),
  person_type: Yup.string().required(
    'Por favor, informe o tipo de pessoa (física/jurídica).',
  ),
  cpf_cnpj: Yup.string().when('person_type', {
    is: value => value === ConfigValues.rebox.user.person_type.physical_person,
    then: Yup.string()
      .required('Por favor, informe o CPF do cliente.')
      .test('cpf-valid', 'Por favor, informe um CPF válido.', value =>
        validatorCpf.check(formatCPF.removeMask(value || '')),
      ),
    otherwise: Yup.string()
      .required('Por favor, informe o CNPJ do cliente.')
      .test(
        'cnpj-valid',
        'Por favor, informe um CNPJ válido.',
        value => !validatorCnpj.check(formatCNPJ.removeMask(value || '')),
      ),
  }),
  // discount_type: Yup.string().optional(),
  // discount_amount_installments: Yup.string().when('discount_type', {
  //   is: value =>
  //     value && value !== ConfigValues.rebox.contract.discount_type.undefined,
  //   then: Yup.string().required('Por favor, informe o valor do desconto.'),
  //   otherwise: Yup.string().optional(),
  // }),
  // number_installments_with_discount: Yup.number().when('discount_type', {
  //   is: value =>
  //     value && value !== ConfigValues.rebox.contract.discount_type.undefined,
  //   then: Yup.number().required(
  //     'Por favor, informe o número de parcelas que será aplicado o desconto.',
  //   ),
  //   otherwise: Yup.number().optional(),
  // }),
});
