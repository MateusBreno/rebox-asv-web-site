// ./src/pages/privates/Contract/New/StepPayment/index.tsx
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { FormHandles } from '@unform/core';
import { FiPercent } from 'react-icons/fi';
import {
  IoBarcodeOutline,
  IoCalendarOutline,
  IoCardOutline,
} from 'react-icons/io5';

import {
  SubtitleSecondary,
  Paragraph,
  ButtonMain,
  ButtonDefault,
  CardSimpleButtonSelectable,
  InputSelect,
  AlertSimpleCustom,
  InputText,
} from '@components/index';
import {
  ConfigLabel,
  ConfigRules,
  ConfigStyles,
  ConfigTransition,
  ConfigValues,
} from '@config/index';
import Product from '@models/Product';
import { apiRebox, newContractStorageService } from '@services/index';
import { formatMoney } from '@utils/formatters';
import { toastify } from '@utils/notifiers';

import { schema } from './schemaValidation';
import { IFormStepPayment } from './typing';

import {
  Container,
  SectionsPayment,
  FormPayment,
  DueDate,
  DueDateGroup,
  PaymentMethod,
  PaymentMethodOptions,
  PaymentMethodGroup,
  PaymentMethodGroupFields,
  Discount,
  DiscountButton,
  DiscountGroup,
  DiscountFields,
  DiscountItem,
  Buttons,
} from './styles';

interface IProps {
  myStep: number;
  currentStep: number;
  changeStep(newStep: number, willChangeHistory?: boolean): void;
}

const LIMIT_MAX_INSTALLMENTS = 12;

const StepPayment: React.FC<IProps> = ({ currentStep, changeStep }) => {
  const formRef = useRef<FormHandles>(null);

  const paymentSaved = useMemo(
    () => newContractStorageService.getPayment(),
    [],
  );

  const [loading, setLoading] = useState<boolean>(false);
  const [selectedDueDate, setSelectedDueDate] = useState<string>(
    paymentSaved.due_date || ConfigValues.rebox.contract.due_date.five,
  );
  const [selectedFormOfPayment, setSelectedFormOfPayment] = useState<string>(
    paymentSaved.form_of_payment ||
      ConfigValues.rebox.contract.form_of_payment.boleto,
  );
  const [product, setProduct] = useState<Product>({} as Product);
  const [showDiscount, setShowDiscount] = useState<boolean>(
    !!(
      paymentSaved.discount_type &&
      paymentSaved.discount_type !==
        ConfigValues.rebox.contract.discount_type.undefined
    ),
  );
  const [
    enabledFieldsDiscountNumber,
    setEnabledFieldsDiscountNumber,
  ] = useState<boolean>(true);
  const [
    enabledFieldsDiscountAmount,
    setEnabledFieldsDiscountAmount,
  ] = useState<boolean>(true);

  const initialData = useMemo(() => {
    const {
      discount_amount_installments,
      number_installments_with_discount,
    } = newContractStorageService.getPayment();
    return {
      discount_amount_installments: discount_amount_installments
        ? formatMoney.fromNumberToPrice(discount_amount_installments)
        : 'R$ 0,00',
      number_installments_with_discount: number_installments_with_discount || 0,
    };
  }, []);

  const getProduct = useCallback(async () => {
    try {
      const { data: response } = await apiRebox.get(
        `/products/${newContractStorageService.getProduct().id}`,
      );
      setProduct(response.data);
    } catch (error) {
      console.log(
        `Passo "Pagamento": Houve um error ao buscar o produto selecionado.`,
      );
    }
  }, []);

  const changeDiscountType = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    const { discount_type } = ConfigValues.rebox.contract;

    setEnabledFieldsDiscountNumber(false);
    setEnabledFieldsDiscountAmount(false);
    const discountData = {
      discount_amount_installments: 'R$ 0,00',
      number_installments_with_discount: 0,
    };

    if (value === discount_type.undefined) {
      setEnabledFieldsDiscountNumber(true);
      setEnabledFieldsDiscountAmount(true);
    }

    if (value === discount_type.single) {
      discountData.number_installments_with_discount = 1;
      setEnabledFieldsDiscountNumber(true);
    }

    if (value === discount_type.recurrent) {
      discountData.number_installments_with_discount = LIMIT_MAX_INSTALLMENTS;
    }

    formRef.current?.setData(discountData);
  };

  const handleSavePayment = useCallback(
    async (data: IFormStepPayment) => {
      try {
        setLoading(prevState => !prevState);
        formRef.current?.setErrors({});

        await schema.validate(data, {
          abortEarly: false,
        });

        newContractStorageService.updatePayment({
          due_date: selectedDueDate,
          form_of_payment: selectedFormOfPayment,
          cycle: ConfigValues.rebox.contract.cycle.monthly,
          discount_type:
            data.discount_type ||
            ConfigValues.rebox.contract.discount_type.undefined,
          discount_amount_installments: data.discount_amount_installments
            ? formatMoney.revertToFloat(data.discount_amount_installments)
            : 0,
          number_installments_with_discount:
            data.number_installments_with_discount || 0,
        });

        changeStep(currentStep + 1);
      } catch (error) {
        toastify(
          'Oops! Houve um erro ao tent salvar os dados de pagamento.',
          'error',
        );
        console.log(error);
      } finally {
        setLoading(prevState => !prevState);
      }
    },
    // eslint-disable-next-line
    [selectedDueDate, selectedFormOfPayment],
  );

  useEffect(() => {
    getProduct();
  });

  return (
    <Container>
      <SubtitleSecondary textAlign="start" nameColor="black">
        Pagamento
      </SubtitleSecondary>
      <Paragraph
        textAlign="start"
        nameColor="black"
        opacity={0.8}
        fontWeight={500}
      >
        Escolha uma forma de pagamento e o vencimento da fatura
      </Paragraph>
      <SectionsPayment>
        <FormPayment
          ref={formRef}
          onSubmit={handleSavePayment}
          initialData={initialData}
        >
          <AlertSimpleCustom
            text={`Estamos considerando por padrão o ciclo de cobrança "mensal".`}
            type="info"
          />
          <DueDate>
            <SubtitleSecondary textAlign="start" fontSize={16}>
              Selecione o vencimento
            </SubtitleSecondary>
            <DueDateGroup>
              {ConfigValues.rebox.contract.due_date.array.map(item => (
                <CardSimpleButtonSelectable
                  key={item}
                  icon={{
                    element: IoCalendarOutline,
                    colorDefault:
                      ConfigStyles.rebox.colors.black.opacity.average,
                    colorActive: ConfigStyles.rebox.colors.white.main,
                    opacity: 1,
                    size: 20,
                  }}
                  label={{
                    text: item,
                    colorDefault:
                      ConfigStyles.rebox.colors.black.opacity.average,
                    colorActive: ConfigStyles.rebox.colors.white.main,
                  }}
                  positionContent="center"
                  isSelected={selectedDueDate === item}
                  onClick={() => setSelectedDueDate(item)}
                />
              ))}
            </DueDateGroup>
          </DueDate>
          <PaymentMethod>
            <SubtitleSecondary textAlign="start" fontSize={16}>
              Forma de pagamento
            </SubtitleSecondary>
            <PaymentMethodOptions>
              {[
                ConfigValues.rebox.contract.form_of_payment.credit_card,
                ConfigValues.rebox.contract.form_of_payment.boleto,
              ].map(item => (
                <CardSimpleButtonSelectable
                  key={item}
                  icon={{
                    element:
                      ConfigValues.rebox.contract.form_of_payment.boleto ===
                      item
                        ? IoBarcodeOutline
                        : IoCardOutline,
                    colorDefault:
                      ConfigStyles.rebox.colors.black.opacity.average,
                    colorActive: ConfigStyles.rebox.colors.white.main,
                    opacity: 1,
                    size: 20,
                  }}
                  label={{
                    text:
                      ConfigTransition.rebox_contracts_form_of_payment[
                        item.toLowerCase()
                      ],
                    colorDefault:
                      ConfigStyles.rebox.colors.black.opacity.average,
                    colorActive: ConfigStyles.rebox.colors.white.main,
                  }}
                  width={{ size: '240px', maxSize: '100%' }}
                  onClick={() => setSelectedFormOfPayment(item)}
                  isSelected={selectedFormOfPayment === item}
                  positionContent="flex-start"
                  style={{ marginRight: '2vh' }}
                />
              ))}
            </PaymentMethodOptions>

            {selectedFormOfPayment ===
              ConfigValues.rebox.contract.form_of_payment.boleto && (
              <PaymentMethodGroup>
                <Paragraph nameColor="black" textAlign="start" fontWeight={500}>
                  Dados do boleto
                </Paragraph>
                <Paragraph
                  nameColor="black"
                  textAlign="start"
                  opacity={0.8}
                  style={{ margin: '1.5vh 0 3vh' }}
                >
                  Esta venda será efetivada somente após o pagamento do 1º
                  boleto. A compensação de pagamento ocorre em até{' '}
                  {ConfigRules.rebox.charge.maximumDaysForCompensation} dias
                  úteis.
                </Paragraph>
                <AlertSimpleCustom
                  text="Independente do parcelamento, os boletos serão enviados ao cliente ciclo a ciclo desta venda."
                  type="warning"
                />
                <PaymentMethodGroupFields>
                  <InputSelect
                    name="number_installments"
                    options={[
                      {
                        label: `${LIMIT_MAX_INSTALLMENTS}x sem juros de ${formatMoney.fromNumberToPrice(
                          product.promotional_price || product.current_price,
                        )}`,
                        value: `${LIMIT_MAX_INSTALLMENTS}`,
                      },
                    ]}
                    placeholder="Selecione"
                    selectedDefault={`${LIMIT_MAX_INSTALLMENTS}`}
                    tabIndex={1}
                    disabled={true}
                    isDisable={true}
                  />
                </PaymentMethodGroupFields>
              </PaymentMethodGroup>
            )}

            {selectedFormOfPayment ===
              ConfigValues.rebox.contract.form_of_payment.credit_card && (
              <PaymentMethodGroup>
                <Paragraph nameColor="black" textAlign="start" fontWeight={500}>
                  Por enquanto indisponível
                </Paragraph>
              </PaymentMethodGroup>
            )}
          </PaymentMethod>

          <Discount>
            <DiscountButton
              type="button"
              onClick={() => setShowDiscount(prevState => !prevState)}
              tabIndex={2}
            >
              <FiPercent
                size={20}
                color={ConfigStyles.rebox.colors.blue.main}
              />
              <Paragraph nameColor="blue" textAlign="start" fontWeight={500}>
                Oferecer desconto?
              </Paragraph>
            </DiscountButton>
            {showDiscount && (
              <DiscountGroup>
                <Paragraph nameColor="black" textAlign="start" fontWeight={500}>
                  Dados de desconto
                </Paragraph>
                <Paragraph
                  nameColor="black"
                  textAlign="start"
                  opacity={0.8}
                  style={{ margin: '1.5vh 0' }}
                >
                  {`Apenas se definir um desconto, que invalida a aplicação automática
                do mesmo segundo critérios pré-definidos.`}
                </Paragraph>
                <DiscountFields>
                  <DiscountItem>
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
                      selectedDefault={
                        paymentSaved.discount_type ||
                        ConfigValues.rebox.contract.discount_type.undefined
                      }
                      tabIndex={3}
                      onChange={changeDiscountType}
                    />
                  </DiscountItem>

                  <DiscountItem>
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
                      tabIndex={4}
                      disabled={enabledFieldsDiscountAmount}
                      isDisable={enabledFieldsDiscountAmount}
                      onChange={value => {
                        value.target.value = formatMoney.replaceFloatPatternsForMoney(
                          value.target.value,
                        );
                      }}
                    />
                  </DiscountItem>
                </DiscountFields>

                <DiscountFields>
                  <DiscountItem>
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
                      tabIndex={5}
                      disabled={enabledFieldsDiscountNumber}
                      isDisable={enabledFieldsDiscountNumber}
                    />
                  </DiscountItem>
                </DiscountFields>
              </DiscountGroup>
            )}
          </Discount>
        </FormPayment>
      </SectionsPayment>
      <Buttons>
        <ButtonMain
          loading={loading}
          onClick={() => formRef.current?.submitForm()}
          style={{ marginRight: '10px', maxWidth: 200 }}
        >
          Avançar
        </ButtonMain>
        <ButtonDefault
          onClick={() => changeStep(currentStep - 1)}
          style={{ maxWidth: 200 }}
          disabled={currentStep <= 1}
          isDisable={currentStep <= 1}
        >
          Voltar
        </ButtonDefault>
      </Buttons>
    </Container>
  );
};

export default StepPayment;
