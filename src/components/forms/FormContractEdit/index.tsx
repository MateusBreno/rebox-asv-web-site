// ./src/components/forms/FormContractEdit/index.tsx
import React, { useCallback, useRef, useState, useEffect } from 'react';

import { FormHandles } from '@unform/core';
import { IoMdCopy } from 'react-icons/io';
import * as Yup from 'yup';

import {
  SubtitleSecondary,
  Paragraph,
  InputText,
  InputSelect,
  InputMask,
  ButtonMain,
  ButtonCopy,
} from '@components/index';
import { ConfigLabel, ConfigValues } from '@config/index';
import Contract from '@models/Contract';
import Product from '@models/Product';
import { apiRebox } from '@services/index';
import { getValidationErrors } from '@utils/errors';
import { formatDate, formatText, formatMoney } from '@utils/formatters';
import { generateDate } from '@utils/generators';
import { toastify } from '@utils/notifiers';

import { schemaContract } from './schemaValidation';
import { ISelect, IFormContract } from './typing';

import {
  Container,
  FormContract,
  Sections,
  SectionsGroup,
  SectionsItem,
  SectionsItemGroup,
  DividingLine,
} from './styles';

interface IProps {
  contract?: Contract;
}

const FormContractEdit: React.FC<IProps> = ({ contract: contractData }) => {
  const formRef = useRef<FormHandles>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [products, setProducts] = useState<ISelect[]>([]);
  const [contract, setContract] = useState<Contract>(
    contractData || ({} as Contract),
  );
  const [disabledForEditing, setDisabledForEditing] = useState<boolean>(
    contract?.status === ConfigValues.rebox.contract.status.deleted,
  );
  const [enabledFieldsDiscountNumber, setEnabledFieldsDiscountNumber] =
    useState<boolean>(
      contract.discount_type !==
        ConfigValues.rebox.contract.discount_type.recurrent,
    );
  const [enabledFieldsDiscountAmount, setEnabledFieldsDiscountAmount] =
    useState<boolean>(
      contract.discount_type ===
        ConfigValues.rebox.contract.discount_type.undefined,
    );

  const [enabledFieldsRateNumber, setEnabledFieldsRateNumber] =
    useState<boolean>(
      contract.rate_type !== ConfigValues.rebox.contract.rate_type.recurrent,
    );
  const [enabledFieldsRateAmount, setEnabledFieldsRateAmount] =
    useState<boolean>(
      contract.rate_type === ConfigValues.rebox.contract.rate_type.undefined,
    );
  const [enabledFieldsRateDescription, setEnabledFieldsRateDescription] =
    useState<boolean>(
      contract.rate_type === ConfigValues.rebox.contract.rate_type.undefined,
    );

  const getProducts = useCallback(async () => {
    try {
      const { data: response } = await apiRebox.get(`/products`);

      const responseProducts: Product[] = response.data;
      const productsUpdated: ISelect[] = [];

      responseProducts.forEach(element => {
        productsUpdated.push({
          label: formatText.capitalizedFirstLetter(element.name),
          value: element.id || '',
        });
      });

      setProducts(productsUpdated);
    } catch (error) {
      toastify(
        `Houve um error ao buscar lista de opções de produtos.`,
        'error',
      );
    }
  }, []);

  const changeDiscountType = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    const { discount_type } = ConfigValues.rebox.contract;

    setEnabledFieldsDiscountNumber(false);
    setEnabledFieldsDiscountAmount(false);

    if (value === discount_type.undefined) {
      formRef.current?.setData({
        discount_amount_installments: 'R$ 0,00',
        number_installments_with_discount: 0,
      });
      setEnabledFieldsDiscountNumber(true);
      setEnabledFieldsDiscountAmount(true);
    }

    if (value === discount_type.single) {
      formRef.current?.setData({
        number_installments_with_discount: 1,
      });
      setEnabledFieldsDiscountNumber(true);
    }

    if (value === discount_type.recurrent) {
      formRef.current?.setData({
        number_installments_with_discount:
          contract.product?.coverage_months_limit,
      });
    }
  };

  const changeRateType = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    const { rate_type } = ConfigValues.rebox.contract;

    setEnabledFieldsRateNumber(false);
    setEnabledFieldsRateAmount(false);
    setEnabledFieldsRateDescription(false);

    if (value === rate_type.undefined) {
      formRef.current?.setData({
        rate_amount_installments: 'R$ 0,00',
        number_installments_with_rate: 0,
        rate_description: '',
      });
      setEnabledFieldsRateNumber(true);
      setEnabledFieldsRateAmount(true);
      setEnabledFieldsRateDescription(true);
    }

    if (value === rate_type.single) {
      formRef.current?.setData({
        number_installments_with_rate: 1,
        rate_description: '',
      });
      setEnabledFieldsRateNumber(true);
    }

    if (value === rate_type.recurrent) {
      formRef.current?.setData({
        number_installments_with_rate: contract.product?.coverage_months_limit,
      });
    }

    if (value === rate_type.pro_rata_add || value === rate_type.pro_rata_sub) {
      formRef.current?.setData({
        rate_amount_installments: 'R$ 0,00',
        number_installments_with_rate: 1,
        rate_description: '',
      });
      setEnabledFieldsRateNumber(true);
    }
  };

  const handleUpdateFormByProduct = async (products_id: string) => {
    try {
      const { data: responseProduct } = await apiRebox.get(
        `/products/${products_id}`,
      );
      const product: Product = responseProduct.data;

      const date: string =
        formRef.current?.getFieldValue('date') || contractData?.date;
      const [gracePeriodExpirationDate, gracePeriodExpirationHour] =
        date.split(' ');

      const days =
        product.coverage_months_limit === 12
          ? 365
          : product.coverage_months_limit * 30;

      const [dateNew, hourNew] = generateDate
        .nextDays(
          days,
          `${formatDate.removeMask(
            gracePeriodExpirationDate,
          )} ${gracePeriodExpirationHour}`,
        )
        .split(' ');

      // Legenda:
      // - AR (ACIONAMENTOS RESTANTES)
      // - ADAP (ACIONAMENTOS DE DIREITO DO ANTIGO PRODUTO)
      // - ANP (ACIONAMENTOS DO NOVO PRODUTO)
      // Fórmula: AR - (ADAP - ANP)
      const ar = contractData?.available_uses || 0;
      const adap = contractData?.number_of_uses_allowed || 0;
      const anp = product.available_uses;

      // const uses = product.available_uses - contractData?.available_uses
      formRef.current?.setData({
        gross_amount: formatMoney.fromNumberToPrice(
          product.promotional_price || product.current_price || 0,
        ),
        amount: formatMoney.fromNumberToPrice(
          product.promotional_price || product.current_price || 0,
        ),
        number_of_uses_allowed: product.available_uses,
        available_uses: ar - (adap - anp),
        allowed_seasonality_for_calls: product.allowed_seasonality_for_calls,
        number_calls_allowed_in_seasonality:
          product.number_calls_allowed_in_seasonality,
        interval_between_calls_in_days: product.interval_between_calls_in_days,
        covered_up: `${formatDate.addMask(dateNew)} ${hourNew}`,
      });
    } catch (error) {}
  };

  const handleUpdateContract = async (data: IFormContract) => {
    try {
      setLoading(prevState => !prevState);
      formRef.current?.setErrors({});

      await schemaContract.validate(data, {
        abortEarly: false,
      });

      if (formatText.removeAllNonDigits(data.date).length < 12) {
        toastify(
          'Por favor, informe uma data/hora válida de adesão do contrato.',
          'error',
        );
        throw new Error('');
      }

      if (formatText.removeAllNonDigits(data.covered_up).length < 12) {
        toastify(
          'Por favor, informe uma data/hora válida para o prazo de cobertura.',
          'error',
        );
        throw new Error('');
      }

      if (
        data.grace_period_release_date &&
        formatText.removeAllNonDigits(data.grace_period_release_date).length >
          0 &&
        formatText.removeAllNonDigits(data.grace_period_release_date).length <
          12
      ) {
        toastify(
          'Por favor, informe uma data/hora válida para o período de carência.',
          'error',
        );
        throw new Error('');
      }

      const [accessionDate, accessionHour] = data.date.split(' ');
      const [coverageDate, coverageHour] = data.covered_up.split(' ');
      let gracePeriodExpiration = '';
      if (data.grace_period_release_date) {
        const [gracePeriodExpirationDate, gracePeriodExpirationHour] =
          data.grace_period_release_date.split(' ');
        gracePeriodExpiration = `${formatDate.removeMask(
          gracePeriodExpirationDate,
        )} ${gracePeriodExpirationHour}`;
      }

      const { data: responseUpdateContract } = await apiRebox.put(
        `/contracts/${contract?.id}`,
        {
          date: `${formatDate.removeMask(accessionDate)} ${accessionHour}`,
          covered_up: `${formatDate.removeMask(coverageDate)} ${coverageHour}`,
          products_id: data.products_id,
          form_of_payment: data.form_of_payment,
          gross_amount: formatMoney.revertToFloat(data.gross_amount),
          amount: formatMoney.revertToFloat(data.amount),
          cycle: data.cycle,
          due_date: data.due_date,
          next_due_date: data.next_due_date
            ? formatDate.removeMask(data.next_due_date)
            : '',
          current_payments_status: data.current_payments_status,
          status: data.status,
          discount_type:
            data.discount_type ||
            ConfigValues.rebox.contract.discount_type.undefined,
          discount_amount_installments: data.discount_amount_installments
            ? formatMoney.revertToFloat(data.discount_amount_installments)
            : 0,
          number_installments_with_discount:
            data.number_installments_with_discount
              ? Number.parseInt(`${data.number_installments_with_discount}`, 10)
              : 0,
          rate_type: data.rate_type
            ? data.rate_type
            : ConfigValues.rebox.contract.rate_type.undefined,
          rate_amount_installments: data.rate_amount_installments
            ? formatMoney.revertToFloat(data.rate_amount_installments)
            : 0,
          number_installments_with_rate: data.number_installments_with_rate
            ? Number.parseInt(`${data.number_installments_with_rate}`, 10)
            : 0,
          rate_description: data.rate_description || '',
          number_of_uses_allowed: data.number_of_uses_allowed
            ? Number.parseInt(`${data.number_of_uses_allowed}`, 10)
            : 0,
          available_uses: data.available_uses
            ? Number.parseInt(`${data.available_uses}`, 10)
            : 0,
          allowed_seasonality_for_calls: data.allowed_seasonality_for_calls,
          number_calls_allowed_in_seasonality:
            data.number_calls_allowed_in_seasonality
              ? Number.parseInt(
                  `${data.number_calls_allowed_in_seasonality}`,
                  10,
                )
              : 0,
          interval_between_calls_in_days: data.interval_between_calls_in_days
            ? Number.parseInt(`${data.interval_between_calls_in_days}`, 10)
            : 0,
          grace_period_release_date: gracePeriodExpiration,
        },
      );

      const { header, data: contractUpdated } = responseUpdateContract;

      setContract(contractUpdated);

      toastify(header.message, 'success');
    } catch (error: any) {
      if (error instanceof Yup.ValidationError) {
        const errors = getValidationErrors(error);

        formRef.current?.setErrors(errors);

        const {
          date,
          covered_up,
          products_id,
          form_of_payment,
          gross_amount,
          amount,
          cycle,
          due_date,
          next_due_date,
          current_payments_status,
          status,
          discount_type,
          discount_amount_installments,
          number_installments_with_discount,
          rate_type,
          rate_amount_installments,
          number_installments_with_rate,
          rate_description,
          number_of_uses_allowed,
          available_uses,
          allowed_seasonality_for_calls,
          number_calls_allowed_in_seasonality,
          interval_between_calls_in_days,
          grace_period_release_date,
        } = errors;

        if (date) toastify(date, 'error');
        if (covered_up) toastify(covered_up, 'error');
        if (products_id) toastify(products_id, 'error');
        if (form_of_payment) toastify(form_of_payment, 'error');
        if (gross_amount) toastify(gross_amount, 'error');
        if (amount) toastify(amount, 'error');
        if (cycle) toastify(cycle, 'error');
        if (due_date) toastify(due_date, 'error');
        if (next_due_date) toastify(next_due_date, 'error');
        if (current_payments_status) toastify(current_payments_status, 'error');
        if (status) toastify(status, 'error');
        if (discount_type) toastify(discount_type, 'error');
        if (number_installments_with_discount)
          toastify(number_installments_with_discount, 'error');
        if (discount_amount_installments)
          toastify(discount_amount_installments, 'error');
        if (rate_type) toastify(rate_type, 'error');
        if (rate_amount_installments)
          toastify(rate_amount_installments, 'error');
        if (number_installments_with_rate)
          toastify(number_installments_with_rate, 'error');
        if (rate_description) toastify(rate_description, 'error');
        if (number_of_uses_allowed) toastify(number_of_uses_allowed, 'error');
        if (available_uses) toastify(available_uses, 'error');
        if (allowed_seasonality_for_calls)
          toastify(allowed_seasonality_for_calls, 'error');
        if (number_calls_allowed_in_seasonality)
          toastify(number_calls_allowed_in_seasonality, 'error');
        if (interval_between_calls_in_days)
          toastify(interval_between_calls_in_days, 'error');
        if (grace_period_release_date)
          toastify(grace_period_release_date, 'error');
      } else if (error.response) {
        toastify(error.response.data.error, 'error');
      } else {
        toastify(
          'Houve um error ao tentar atualizar os dados deste contrato.',
          'error',
        );
      }
    } finally {
      setLoading(prevState => !prevState);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <Container>
      <FormContract
        ref={formRef}
        onSubmit={handleUpdateContract}
        initialData={{
          ...contract,
          date: contract?.date
            ? `${formatDate.addMask(contract.date.split(' ')[0])} ${
                contract.date.split(' ')[1]
              }`
            : '',
          covered_up: contract?.covered_up
            ? `${formatDate.addMask(contract.covered_up.split(' ')[0])} ${
                contract.covered_up.split(' ')[1]
              }`
            : '',
          next_due_date: contract?.next_due_date
            ? formatDate.addMask(contract?.next_due_date)
            : '',
          available_uses: contract?.available_uses,
          gross_amount: formatMoney.fromNumberToPrice(
            contract?.gross_amount || 0,
          ),
          amount: formatMoney.fromNumberToPrice(contract?.amount || 0),
          discount_amount_installments: formatMoney.fromNumberToPrice(
            contract?.discount_amount_installments || 0,
          ),
          rate_amount_installments: formatMoney.fromNumberToPrice(
            contract?.rate_amount_installments || 0,
          ),
          grace_period_release_date: contract?.grace_period_release_date
            ? `${formatDate.addMask(
                contract.grace_period_release_date.split(' ')[0],
              )} ${contract.grace_period_release_date.split(' ')[1]}`
            : '',
        }}
      >
        <Sections>
          <ButtonCopy
            textCopy={contract?.code || ''}
            labelText={contract.code}
            labelColor="black"
            labelAlign="start"
            labelSize={11}
            labelOpacity={0.4}
            iconColor="black"
            iconSize={12}
            iconOpacity={0.8}
          />
          <SectionsGroup>
            <SectionsItem>
              <SubtitleSecondary
                textAlign="start"
                nameColor="black"
                fontSize={14}
              >
                Data de adesão
              </SubtitleSecondary>
              <Paragraph
                nameColor="black"
                textAlign="start"
                opacity={0.5}
                fontSize={13}
                style={{ marginBottom: '2vh' }}
              >
                Data/hora em que o cliente realizou a compra do plano
              </Paragraph>
              <InputMask
                name="date"
                mask="99/99/9999 99:99"
                placeholder="Informe a data e hora"
                tabIndex={1}
                disabled={disabledForEditing}
                isDisable={disabledForEditing}
                onChange={event => {
                  if (
                    formatText.removeAllNonDigits(event.target.value).length ===
                    12
                  ) {
                    const [date, hour] = event.target.value.split(' ');
                    const [dateUp, hourUp] = generateDate
                      .nextDays(
                        contractData?.renew_in_days || 365,
                        `${formatDate.removeMask(date)} ${hour}`,
                      )
                      .split(' ');
                    formRef.current?.setData({
                      covered_up: `${formatDate.addMask(dateUp)} ${hourUp}`,
                    });
                  }
                }}
              />
            </SectionsItem>

            <SectionsItem>
              <SubtitleSecondary
                textAlign="start"
                nameColor="black"
                fontSize={14}
              >
                Prazo de cobertura
              </SubtitleSecondary>
              <Paragraph
                nameColor="black"
                textAlign="start"
                opacity={0.5}
                fontSize={13}
                style={{ marginBottom: '2vh' }}
              >
                Data/hora que o contrato deverá ser renovado
              </Paragraph>
              <InputMask
                name="covered_up"
                mask="99/99/9999 99:99"
                placeholder="Informe a data e hora"
                tabIndex={2}
                disabled={disabledForEditing}
                isDisable={disabledForEditing}
              />
            </SectionsItem>
          </SectionsGroup>

          <SectionsGroup>
            <SectionsItem>
              <SubtitleSecondary
                textAlign="start"
                nameColor="black"
                fontSize={14}
              >
                Produto vendido
              </SubtitleSecondary>
              <Paragraph
                nameColor="black"
                textAlign="start"
                opacity={0.5}
                fontSize={13}
                style={{ marginBottom: '2vh' }}
              >
                Plano/Assinatura que o cliente escolheu comprar
              </Paragraph>

              <InputSelect
                name="products_id"
                options={products}
                placeholder="Selecione"
                selectedDefault={contract?.products_id}
                tabIndex={3}
                disabled={disabledForEditing}
                isDisable={disabledForEditing}
                onChange={event =>
                  handleUpdateFormByProduct(event.target.value)
                }
              />
            </SectionsItem>

            <SectionsItem>
              <SubtitleSecondary
                textAlign="start"
                nameColor="black"
                fontSize={14}
              >
                Forma de pagamento
              </SubtitleSecondary>
              <Paragraph
                nameColor="black"
                textAlign="start"
                opacity={0.5}
                fontSize={13}
                style={{ marginBottom: '2vh' }}
              >
                Método de cobrança a ser considerado no ciclo
              </Paragraph>

              <InputSelect
                name="form_of_payment"
                options={ConfigLabel.rebox.others.contract.form_of_payment}
                placeholder="Selecione"
                selectedDefault={contract?.form_of_payment}
                tabIndex={4}
                disabled={disabledForEditing}
                isDisable={disabledForEditing}
              />
            </SectionsItem>
          </SectionsGroup>

          <SectionsGroup>
            <SectionsItem>
              <SubtitleSecondary
                textAlign="start"
                nameColor="black"
                fontSize={14}
              >
                Valor bruto
              </SubtitleSecondary>
              <Paragraph
                nameColor="black"
                textAlign="start"
                opacity={0.5}
                fontSize={13}
                style={{ marginBottom: '2vh' }}
              >
                Valor do produto comprado pelo cliente
              </Paragraph>

              <InputText
                name="gross_amount"
                placeholder="Apenas números"
                tabIndex={5}
                disabled={disabledForEditing}
                isDisable={disabledForEditing}
                onChange={value => {
                  value.target.value = formatMoney.replaceFloatPatternsForMoney(
                    value.target.value,
                  );
                }}
              />
            </SectionsItem>

            <SectionsItem>
              <SubtitleSecondary
                textAlign="start"
                nameColor="black"
                fontSize={14}
              >
                Valor líquido
              </SubtitleSecondary>
              <Paragraph
                nameColor="black"
                textAlign="start"
                opacity={0.5}
                fontSize={13}
                style={{ marginBottom: '2vh' }}
              >
                Valor a ser pago pelo cliente no ciclo de cobrança
              </Paragraph>

              <InputText
                name="amount"
                placeholder="Apenas números"
                tabIndex={6}
                disabled={disabledForEditing}
                isDisable={disabledForEditing}
                onChange={value => {
                  value.target.value = formatMoney.replaceFloatPatternsForMoney(
                    value.target.value,
                  );
                }}
              />
            </SectionsItem>
          </SectionsGroup>

          <DividingLine />

          <SectionsGroup>
            <SectionsItem>
              <SubtitleSecondary
                textAlign="start"
                nameColor="black"
                fontSize={14}
              >
                Ciclo de cobrança
              </SubtitleSecondary>
              <Paragraph
                nameColor="black"
                textAlign="start"
                opacity={0.5}
                fontSize={13}
                style={{ marginBottom: '2vh' }}
              >
                Define o clico em que as cobranças serão geradas
              </Paragraph>
              <InputSelect
                name="cycle"
                options={ConfigLabel.rebox.others.contract.cycle}
                placeholder="Selecione"
                selectedDefault={contract?.cycle}
                tabIndex={7}
                disabled={disabledForEditing}
                isDisable={disabledForEditing}
              />
            </SectionsItem>

            <SectionsItem>
              <SubtitleSecondary
                textAlign="start"
                nameColor="black"
                fontSize={14}
              >
                Dia do vencimento
              </SubtitleSecondary>
              <Paragraph
                nameColor="black"
                textAlign="start"
                opacity={0.5}
                fontSize={13}
                style={{ marginBottom: '2vh' }}
              >
                A cobrança será gerada a cada ciclo com este dia do mês
              </Paragraph>
              <InputSelect
                name="due_date"
                options={ConfigLabel.rebox.others.contract.due_date}
                placeholder="Selecione"
                selectedDefault={contract?.due_date}
                tabIndex={8}
                disabled={disabledForEditing}
                isDisable={disabledForEditing}
              />
            </SectionsItem>
          </SectionsGroup>

          <SectionsGroup>
            <SectionsItem>
              <SubtitleSecondary
                textAlign="start"
                nameColor="black"
                fontSize={14}
              >
                Data da próxima cobrança
              </SubtitleSecondary>
              <Paragraph
                nameColor="black"
                textAlign="start"
                opacity={0.5}
                fontSize={13}
                style={{ marginBottom: '2vh' }}
              >
                Data da cobrança a ser gerada no próximo ciclo
              </Paragraph>
              <InputMask
                name="next_due_date"
                mask="99/99/9999"
                placeholder="Informe a data"
                tabIndex={9}
                disabled={disabledForEditing}
                isDisable={disabledForEditing}
              />
            </SectionsItem>

            <SectionsItem>
              <SubtitleSecondary
                textAlign="start"
                nameColor="black"
                fontSize={14}
              >
                Adimplência
              </SubtitleSecondary>
              <Paragraph
                nameColor="black"
                textAlign="start"
                opacity={0.5}
                fontSize={13}
                style={{ marginBottom: '2vh' }}
              >
                Status geral da situação das cobranças
              </Paragraph>
              <InputSelect
                name="current_payments_status"
                options={
                  ConfigLabel.rebox.others.contract.current_payments_status
                }
                placeholder="Selecione"
                selectedDefault={contract?.current_payments_status}
                tabIndex={10}
                disabled={disabledForEditing}
                isDisable={disabledForEditing}
              />
            </SectionsItem>
          </SectionsGroup>

          <SectionsGroup>
            <SectionsItem>
              <SubtitleSecondary
                textAlign="start"
                nameColor="black"
                fontSize={14}
              >
                Situação do contrato
              </SubtitleSecondary>
              <Paragraph
                nameColor="black"
                textAlign="start"
                opacity={0.5}
                fontSize={13}
                style={{ marginBottom: '2vh' }}
              >
                Define o status atual deste contrato
              </Paragraph>
              <InputSelect
                name="status"
                options={ConfigLabel.rebox.others.contract.status}
                placeholder="Selecione"
                selectedDefault={contract?.status}
                tabIndex={11}
                disabled={true}
                isDisable={true}
              />
            </SectionsItem>
          </SectionsGroup>

          <DividingLine />

          <SectionsGroup>
            <SectionsItem>
              <SubtitleSecondary
                textAlign="start"
                nameColor="black"
                fontSize={14}
              >
                Tipo de desconto
              </SubtitleSecondary>
              <Paragraph
                nameColor="black"
                textAlign="start"
                opacity={0.5}
                fontSize={13}
                style={{ marginBottom: '2vh' }}
              >
                Define o ciclo de vida da aplicação do desconto
              </Paragraph>
              <InputSelect
                name="discount_type"
                options={ConfigLabel.rebox.others.contract.discount_type}
                placeholder="Selecione"
                selectedDefault={contract?.discount_type}
                tabIndex={12}
                disabled={disabledForEditing}
                isDisable={disabledForEditing}
                onChange={changeDiscountType}
              />
            </SectionsItem>

            <SectionsItem>
              <SubtitleSecondary
                textAlign="start"
                nameColor="black"
                fontSize={14}
              >
                Valor de desconto
              </SubtitleSecondary>
              <Paragraph
                nameColor="black"
                textAlign="start"
                opacity={0.5}
                fontSize={13}
                style={{ marginBottom: '2vh' }}
              >
                Este valor será diminuído da cobrança do cliente
              </Paragraph>

              <InputText
                name="discount_amount_installments"
                placeholder="Apenas números"
                tabIndex={13}
                disabled={disabledForEditing || enabledFieldsDiscountAmount}
                isDisable={disabledForEditing || enabledFieldsDiscountAmount}
                onChange={value => {
                  value.target.value = formatMoney.replaceFloatPatternsForMoney(
                    value.target.value,
                  );
                }}
              />
            </SectionsItem>
          </SectionsGroup>

          <SectionsGroup>
            <SectionsItem>
              <SubtitleSecondary
                textAlign="start"
                nameColor="black"
                fontSize={14}
              >
                Número de parcelas
              </SubtitleSecondary>
              <Paragraph
                nameColor="black"
                textAlign="start"
                opacity={0.5}
                fontSize={13}
                style={{ marginBottom: '2vh' }}
              >
                Limite máximo de parcelas a ser aplicado o desconto
              </Paragraph>

              <InputText
                name="number_installments_with_discount"
                placeholder="Limite máximo"
                tabIndex={14}
                disabled={disabledForEditing || enabledFieldsDiscountNumber}
                isDisable={disabledForEditing || enabledFieldsDiscountNumber}
              />
            </SectionsItem>
          </SectionsGroup>

          <DividingLine />

          <SectionsGroup>
            <SectionsItem>
              <SubtitleSecondary
                textAlign="start"
                nameColor="black"
                fontSize={14}
              >
                Tipo de taxa
              </SubtitleSecondary>
              <Paragraph
                nameColor="black"
                textAlign="start"
                opacity={0.5}
                fontSize={13}
                style={{ marginBottom: '2vh' }}
              >
                Define o ciclo de vida da aplicação de taxas
              </Paragraph>
              <InputSelect
                name="rate_type"
                options={ConfigLabel.rebox.others.contract.rate_type}
                placeholder="Selecione"
                selectedDefault={contract?.rate_type}
                tabIndex={15}
                disabled={disabledForEditing}
                isDisable={disabledForEditing}
                onChange={changeRateType}
              />
            </SectionsItem>

            <SectionsItem>
              <SubtitleSecondary
                textAlign="start"
                nameColor="black"
                fontSize={14}
              >
                Valor da taxa
              </SubtitleSecondary>
              <Paragraph
                nameColor="black"
                textAlign="start"
                opacity={0.5}
                fontSize={13}
                style={{ marginBottom: '2vh' }}
              >
                Este valor será aplicado na cobrança do cliente
              </Paragraph>

              <InputText
                name="rate_amount_installments"
                placeholder="Apenas números"
                tabIndex={16}
                disabled={disabledForEditing || enabledFieldsRateAmount}
                isDisable={disabledForEditing || enabledFieldsRateAmount}
                onChange={value => {
                  value.target.value = formatMoney.replaceFloatPatternsForMoney(
                    value.target.value,
                  );
                }}
              />
            </SectionsItem>
          </SectionsGroup>

          <SectionsGroup>
            <SectionsItem>
              <SubtitleSecondary
                textAlign="start"
                nameColor="black"
                fontSize={14}
              >
                Número de parcelas
              </SubtitleSecondary>
              <Paragraph
                nameColor="black"
                textAlign="start"
                opacity={0.5}
                fontSize={13}
                style={{ marginBottom: '2vh' }}
              >
                Limite máximo de parcelas a ser aplicada a taxa
              </Paragraph>

              <InputText
                name="number_installments_with_rate"
                placeholder="Limite máximo"
                tabIndex={17}
                disabled={disabledForEditing || enabledFieldsRateNumber}
                isDisable={disabledForEditing || enabledFieldsRateNumber}
              />
            </SectionsItem>

            <SectionsItem>
              <SubtitleSecondary
                textAlign="start"
                nameColor="black"
                fontSize={14}
              >
                Observação
              </SubtitleSecondary>
              <Paragraph
                nameColor="black"
                textAlign="start"
                opacity={0.5}
                fontSize={13}
                style={{ marginBottom: '2vh' }}
              >
                Informação adicional sobre a aplicação de taxas
              </Paragraph>

              <InputText
                name="rate_description"
                placeholder="Escreva aqui"
                tabIndex={18}
                disabled={disabledForEditing || enabledFieldsRateDescription}
                isDisable={disabledForEditing || enabledFieldsRateDescription}
              />
            </SectionsItem>
          </SectionsGroup>

          <DividingLine />

          <SectionsGroup>
            <SectionsItem>
              <SubtitleSecondary
                textAlign="start"
                nameColor="black"
                fontSize={14}
              >
                Acionamentos contratados
              </SubtitleSecondary>
              <Paragraph
                nameColor="black"
                textAlign="start"
                opacity={0.5}
                fontSize={13}
                style={{ marginBottom: '2vh' }}
              >
                Número máximo de chamados que cliente tem direito
              </Paragraph>

              <InputText
                name="number_of_uses_allowed"
                placeholder="Número de acionamentos"
                tabIndex={19}
                disabled={disabledForEditing}
                isDisable={disabledForEditing}
              />
            </SectionsItem>

            <SectionsItem>
              <SubtitleSecondary
                textAlign="start"
                nameColor="black"
                fontSize={14}
              >
                Acionamentos disponíveis
              </SubtitleSecondary>
              <Paragraph
                nameColor="black"
                textAlign="start"
                opacity={0.5}
                fontSize={13}
                style={{ marginBottom: '2vh' }}
              >
                Limite total de chamados que o cliente pode solicitar
              </Paragraph>

              <InputText
                name="available_uses"
                placeholder="Número de acionamentos"
                tabIndex={20}
                disabled={disabledForEditing}
                isDisable={disabledForEditing}
              />
            </SectionsItem>
          </SectionsGroup>

          <SectionsGroup>
            <SectionsItem>
              <SubtitleSecondary
                textAlign="start"
                nameColor="black"
                fontSize={14}
              >
                Período para acionamentos
              </SubtitleSecondary>
              <Paragraph
                nameColor="black"
                textAlign="start"
                opacity={0.5}
                fontSize={13}
                style={{ marginBottom: '2vh' }}
              >
                Define o intervalo entre um acionamento e outro
              </Paragraph>
              <InputSelect
                name="allowed_seasonality_for_calls"
                options={
                  ConfigLabel.rebox.others.contract
                    .allowed_seasonality_for_calls
                }
                placeholder="Selecione"
                selectedDefault={contract?.allowed_seasonality_for_calls}
                tabIndex={21}
                disabled={true}
                isDisable={true}
              />
            </SectionsItem>

            <SectionsItem>
              <SubtitleSecondary
                textAlign="start"
                nameColor="black"
                fontSize={14}
              >
                Acionamentos liberados
              </SubtitleSecondary>
              <Paragraph
                nameColor="black"
                textAlign="start"
                opacity={0.5}
                fontSize={13}
                style={{ marginBottom: '2vh' }}
              >
                Define o número de acionamentos permitidos dentro do período
              </Paragraph>

              <InputText
                name="number_calls_allowed_in_seasonality"
                placeholder="Número de acionamentos"
                tabIndex={22}
                readOnly={true}
                disabled={disabledForEditing}
                isDisable={disabledForEditing}
              />
            </SectionsItem>
          </SectionsGroup>

          <SectionsGroup>
            <SectionsItem>
              <SubtitleSecondary
                textAlign="start"
                nameColor="black"
                fontSize={14}
              >
                Período de dias Off
              </SubtitleSecondary>
              <Paragraph
                nameColor="black"
                textAlign="start"
                opacity={0.5}
                fontSize={13}
                style={{ marginBottom: '2vh' }}
              >
                Quantidade de dias que cliente deve aguardar para acionar
                novamente
              </Paragraph>

              <InputText
                name="interval_between_calls_in_days"
                placeholder="Quantidade de dias"
                tabIndex={23}
                readOnly={true}
                disabled={disabledForEditing}
                isDisable={disabledForEditing}
              />
            </SectionsItem>

            <SectionsItem>
              <SubtitleSecondary
                textAlign="start"
                nameColor="black"
                fontSize={14}
              >
                Vecimento da carência
              </SubtitleSecondary>
              <Paragraph
                nameColor="black"
                textAlign="start"
                opacity={0.5}
                fontSize={13}
                style={{ marginBottom: '2vh' }}
              >
                Prazo de espera para o contrato ser ativado
              </Paragraph>
              <InputMask
                name="grace_period_release_date"
                mask="99/99/9999 99:99"
                placeholder="Informe a data e hora"
                tabIndex={24}
                disabled={disabledForEditing}
                isDisable={disabledForEditing}
              />
            </SectionsItem>
          </SectionsGroup>

          <ButtonMain
            type="submit"
            loading={loading}
            style={{ marginTop: '4vh', maxWidth: 250 }}
            tabIndex={25}
            disabled={disabledForEditing}
            isDisable={disabledForEditing}
          >
            Salvar
          </ButtonMain>
        </Sections>
      </FormContract>
    </Container>
  );
};

export default FormContractEdit;
