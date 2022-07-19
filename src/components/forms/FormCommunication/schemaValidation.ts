// ./src/components/forms/FormCommunication/schemaValidation.ts
import * as Yup from 'yup';

export const schema = Yup.object().shape({
  methodAndDays: Yup.string().required(
    'Por favor, informe uma das opções de notificação de cobrança.',
  ),
  status: Yup.string().when('methodAndDays', {
    is: value => value && value === 'UNDEFINED',
    then: Yup.string().required(
      'Por favor, informe uma das situações de cobrança.',
    ),
    otherwise: Yup.string().optional(),
  }),
  due_date: Yup.string().when('methodAndDays', {
    is: value => value && value === 'UNDEFINED',
    then: Yup.string().required(
      'Por favor, informe uma data de vencimento para notificação.',
    ),
    otherwise: Yup.string().optional(),
  }),
});
