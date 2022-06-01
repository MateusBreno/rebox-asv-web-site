import * as Yup from 'yup';

export const schema = Yup.object().shape({
  cpf: Yup.string().required(
    'Por favor, para realizar a consulta é obrigatório informar o CPF.',
  ),
});
