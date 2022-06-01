// ./src/components/forms/FormContractEdit/schemaValidation.ts
import * as Yup from 'yup';

import { ConfigValues } from '@config/index';

export const schemaContract = Yup.object().shape({
  date: Yup.string().required(
    'Por favor, informe a data e hora de adesão do contrato.',
  ),
  covered_up: Yup.string().required(
    'Por favor, informe a data de expiração da cobertura do contrato.',
  ),
  products_id: Yup.string().required(
    'Por favor, escolha um de nossos produtos para o contrato.',
  ),
  form_of_payment: Yup.string().required(
    'Por favor, selecione a forma de pagamento escolhida pelo cliente.',
  ),
  gross_amount: Yup.string().required(
    'Por favor, informe o valor bruto do contrato.',
  ),
  amount: Yup.string().required(
    'Por favor, informe o valor líquido do contrato.',
  ),
  cycle: Yup.string().required(
    'Por favor, selecione o ciclo de cobrança do contrato.',
  ),
  due_date: Yup.string().required(
    'Por favor, selecione o dia de vencimento escolhido pelo cliente.',
  ),
  next_due_date: Yup.string().required(
    'Por favor, informe a data da próxima cobrança deste contrato.',
  ),
  current_payments_status: Yup.string().required(
    'Por favor, selecione o status de adimplência deste contrato.',
  ),
  status: Yup.string().required(
    'Por favor, selecione a situação deste contrato.',
  ),
  discount_type: Yup.string().optional(),
  discount_amount_installments: Yup.string().when('discount_type', {
    is: value =>
      value && value !== ConfigValues.rebox.contract.discount_type.undefined,
    then: Yup.string().required('Por favor, informe o valor do desconto.'),
    otherwise: Yup.string().optional(),
  }),
  number_installments_with_discount: Yup.number().when('discount_type', {
    is: value =>
      value && value !== ConfigValues.rebox.contract.discount_type.undefined,
    then: Yup.number().required(
      'Por favor, informe o número de parcelas que será aplicado o desconto.',
    ),
    otherwise: Yup.number().optional(),
  }),
  rate_type: Yup.string().optional(),
  rate_amount_installments: Yup.string().optional(),
  number_installments_with_rate: Yup.number().optional(),
  rate_description: Yup.string().optional(),
  number_of_uses_allowed: Yup.number().required(
    'Por favor, informe o número de acionamentos contratados.',
  ),
  available_uses: Yup.number().required(
    'Por favor, informe o número de acionamentos disponíveis.',
  ),
  allowed_seasonality_for_calls: Yup.string().optional(),
  number_calls_allowed_in_seasonality: Yup.number().optional(),
  interval_between_calls_in_days: Yup.number().optional(),
  grace_period_release_date: Yup.string().optional(),
});
