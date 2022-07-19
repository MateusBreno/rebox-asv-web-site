// ./src/components/forms/FormChargeEdit/schemaValidation.ts
import * as Yup from 'yup';

import { ConfigRules, ConfigValues } from '@config/index';
import { formatDate, formatText } from '@utils/formatters';
import { generateDate } from '@utils/generators';
import { validatorDate } from '@utils/validators';

export const schemaCharge = Yup.object().shape({
  date_created: Yup.string()
    .required('Por favor, informe a data de criação da cobrança.')
    .test(
      'date-valid',
      'Por favor, informe uma data de geração da cobrança válida.',
      value =>
        value ? formatText.removeAllNonDigits(value).length >= 8 : false,
    )
    .test(
      'date-max',
      'Sinto muito, a cobrança não pode ser gerada em data posterior a hoje.',
      value => {
        const [tomorrowDate] = generateDate.nextDays(1).split(' ');

        return value
          ? validatorDate.hasPassed(tomorrowDate, formatDate.removeMask(value))
          : false;
      },
    )
    .test(
      'date-min',
      `Sinto muito, aceitamos apenas cobranças geradas a partir de ${formatDate.addMask(
        ConfigRules.rebox.default.systemStartDate,
      )}.`,
      value => {
        return value
          ? validatorDate.hasPassed(
              formatDate.removeMask(value),
              ConfigRules.rebox.default.systemStartDate,
            )
          : false;
      },
    ),
  form_of_payment: Yup.string().required(
    'Por favor, escolha uma forma de pagamento para a cobrança.',
  ),
  amount: Yup.string().required('Por favor, informe o valor desta cobrança.'),
  due_date: Yup.string()
    .required('Por favor, informe a data de vencimento da cobrança.')
    .test(
      'date-valid',
      'Por favor, informe a data de vencimento da cobrança.',
      value =>
        value ? formatText.removeAllNonDigits(value).length >= 8 : false,
    ),
  status: Yup.string().required(
    'Por favor, informe a situação atual da cobrança.',
  ),
  pay_day: Yup.string().when('status', {
    is: value => value === ConfigValues.rebox.payments.status.received,
    then: Yup.string().required(
      'Por favor, informe a data de pagamento da cobrança.',
    ),
    otherwise: Yup.string().optional(),
  }),
  charge_type: Yup.string().required(
    'Por favor, informe o tipo desta cobrança.',
  ),
  // installment: Yup.number()
  //   .positive('A parcela correspondente precisa ser um número positivo.')
  //   .integer('A parcela correspondente precisa ser um número inteiro.')
  //   .optional(),
  description: Yup.string()
    .max(100, 'Por favor, reduza sua descrição até no máximo 100 caracteres.')
    .optional(),
});
