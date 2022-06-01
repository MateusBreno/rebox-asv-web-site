// ./src/pages/privates/Contract/New/StepPayment/index.tsx
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { FormHandles } from '@unform/core';
import { FaLock } from 'react-icons/fa';
import { FiPercent } from 'react-icons/fi';
import {
  IoBarcodeOutline,
  IoCalendarOutline,
  IoCardOutline,
  IoCheckmarkCircle,
  IoCloseCircle,
  IoLockClosed,
} from 'react-icons/io5';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';

import {
  SubtitleSecondary,
  Paragraph,
  ButtonMain,
  ButtonDefault,
  CardSimpleButtonSelectable,
  InputSelect,
  AlertSimpleCustom,
  InputText,
  InputMask,
} from '@components/index';
import {
  ConfigAuth,
  ConfigLabel,
  ConfigRoutes,
  ConfigRules,
  ConfigStyles,
  ConfigTransition,
  ConfigValues,
} from '@config/index';
import Product from '@models/Product';
import {
  apiRebox,
  newContractStorageService,
  sessionStorageService,
} from '@services/index';
// import '@services/integrations/iugu/iuguCreditCardTokenService';
import { getValidationErrors } from '@utils/errors';
import { formatMoney, formatText } from '@utils/formatters';
import { hotToast, toastify } from '@utils/notifiers';

import { schema } from './schemaValidation';
import { IFormStepPayment, ISelect } from './typing';

import {
  Container,
  DividingLine,
  SectionsPayment,
  FormPayment,
  DueDate,
  DueDateGroup,
  PaymentMethod,
  PaymentMethodOptions,
  PaymentMethodGroup,
  PaymentMethodGroupFields,
  SectionsGroup,
  SectionsItem,
  SectionsItemGroup,
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

const StepPayment: React.FC<IProps> = ({ myStep, currentStep, changeStep }) => {
  Iugu.setAccountID(ConfigAuth.iugu.keys.accountId);
  const { push } = useHistory();

  const formRef = useRef<FormHandles>(null);
  const paymentMethodRef = useRef<HTMLDivElement>(null);

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
  const [brandCreditCard, setBrandCreditCard] = useState<string>('');
  const [alertCreditCard, setAlertCreditCard] = useState<number>(0);
  const [alertValidate, setAlertValidate] = useState<number>(0);
  const [alertCvv, setAlertCvv] = useState<number>(0);

  const [personType, setPersonType] = useState<string>(
    ConfigValues.rebox.user.person_type.physical_person,
  );
  const [alertCheckCpfCnpj, setAlertCheckCpfCnpj] = useState<number>(0);
  const [product, setProduct] = useState<Product>({} as Product);
  const [installmentOptions, setInstallmentOptions] = useState<ISelect[]>([]);
  const [showDiscount, setShowDiscount] = useState<boolean>(
    !!(
      paymentSaved.discount_type &&
      paymentSaved.discount_type !==
        ConfigValues.rebox.contract.discount_type.undefined
    ),
  );
  const [enabledFieldsDiscountNumber, setEnabledFieldsDiscountNumber] =
    useState<boolean>(true);
  const [enabledFieldsDiscountAmount, setEnabledFieldsDiscountAmount] =
    useState<boolean>(true);

  const initialData = useMemo(() => {
    const { discount_amount_installments, number_installments_with_discount } =
      newContractStorageService.getPayment();
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

  const changeCreditCardNumber = useCallback((numberCard: string) => {
    const numberCardUpdated = formatText.removeAllNonDigits(numberCard);
    const isNumberCardValid: boolean =
      Iugu.utils.validateCreditCardNumber(numberCardUpdated);
    setAlertCreditCard(isNumberCardValid ? 1 : 2);
    const brandCard: string =
      Iugu.utils.getBrandByCreditCardNumber(numberCardUpdated);
    setBrandCreditCard(brandCard);
  }, []);

  const changeCreditCardValidate = useCallback((validate: string) => {
    const [month, year] = validate.split('/');
    const isValidateValid: boolean = Iugu.utils.validateExpiration(month, year);
    setAlertValidate(isValidateValid ? 1 : 2);
  }, []);

  const changeCreditCardCvv = useCallback(
    (cvv: string) => {
      const isCvvValid: boolean = Iugu.utils.validateCVV(cvv, brandCreditCard);
      setAlertCvv(isCvvValid ? 1 : 2);
    },
    [brandCreditCard],
  );

  const generateInstallmentOptions = useCallback(() => {
    const { promotional_price, current_price, coverage_months_limit } = product;
    const amount = promotional_price || current_price || 0;

    const installments: ISelect[] = [];
    for (let index = 0; index < coverage_months_limit; index++) {
      const installmentCurrent = index + 1;
      let installmentValue = amount * coverage_months_limit;
      installmentValue /= installmentCurrent;
      installments.push({
        label: `${installmentCurrent}x de ${formatMoney.fromNumberToPrice(
          installmentValue,
        )} sem juros`,
        value: `${installmentCurrent}`,
      });
    }
    setInstallmentOptions(installments);
  }, [product]);

  const handleGetCustomerByCpfCnpj = useCallback(
    async (cpfCnpj: string) => {
      const typeDoc =
        personType === ConfigValues.rebox.user.person_type.physical_person
          ? 'CPF'
          : 'CNPJ';
      const idHotToast = hotToast(`Verificando ${typeDoc}`, 'loading');
      try {
        //   const { data: responseCustomer } = await apiRebox.get(
        //     `/users?query=${formatText.removeAllNonDigits(cpfCnpj)}`,
        //   );
        //   const { header } = responseCustomer;
        //   if (header.total > 0) {
        //     hotToast(idHotToast, 'dismiss');
        //     toastify(
        //       `Este ${typeDoc} não pode ser usado. Já pertence a um usuário cadastrado.`,
        //       'error',
        //     );
        //     setAlertCheckCpfCnpj(2);
        //     return;
        //   }
        //   setAlertCheckCpfCnpj(1);

        // Resolvendo um bug provisório (Código comentado acima é o definitivo)
        const { admin, client, provider, partner, assistant } =
          ConfigValues.rebox.user.role;
        const { data: responseAdmin } = await apiRebox.get(
          `/users?role=${admin}&query=${formatText.removeAllNonDigits(
            cpfCnpj,
          )}`,
        );
        if (responseAdmin.header.total > 0) {
          hotToast(idHotToast, 'dismiss');
          toastify(
            `Este ${typeDoc} não pode ser usado. Já pertence a um usuário cadastrado.`,
            'error',
          );
          setAlertCheckCpfCnpj(2);
          return;
        }

        const { data: responseProvider } = await apiRebox.get(
          `/users?role=${provider}&query=${formatText.removeAllNonDigits(
            cpfCnpj,
          )}`,
        );
        if (responseProvider.header.total > 0) {
          hotToast(idHotToast, 'dismiss');
          toastify(
            `Este ${typeDoc} não pode ser usado. Já pertence a um usuário cadastrado.`,
            'error',
          );
          setAlertCheckCpfCnpj(2);
          return;
        }

        const { data: responsePartner } = await apiRebox.get(
          `/users?role=${partner}&query=${formatText.removeAllNonDigits(
            cpfCnpj,
          )}`,
        );

        if (responsePartner.header.total > 0) {
          hotToast(idHotToast, 'dismiss');
          toastify(
            `Este ${typeDoc} não pode ser usado. Já pertence a um usuário cadastrado.`,
            'error',
          );
          setAlertCheckCpfCnpj(2);
          return;
        }

        const { data: responseAssistant } = await apiRebox.get(
          `/users?role=${assistant}&query=${formatText.removeAllNonDigits(
            cpfCnpj,
          )}`,
        );

        if (responseAssistant.header.total > 0) {
          hotToast(idHotToast, 'dismiss');
          toastify(
            `Este ${typeDoc} não pode ser usado. Já pertence a um usuário cadastrado.`,
            'error',
          );
          setAlertCheckCpfCnpj(2);
          return;
        }

        const { data: responseCustomer } = await apiRebox.get(
          `/users?role=${client}&query=${formatText.removeAllNonDigits(
            cpfCnpj,
          )}`,
        );

        if (responseCustomer.header.total > 0) {
          hotToast(idHotToast, 'dismiss');
          toastify(
            `Este ${typeDoc} não pode ser usado. Já pertence a um usuário cadastrado.`,
            'error',
          );
          setAlertCheckCpfCnpj(2);
          return;
        }

        setAlertCheckCpfCnpj(1);
      } catch (error: any) {
        toastify(
          error.response
            ? error.response.data.error
            : `Houve um error ao tentar verificar o ${typeDoc} informado.`,
          'error',
        );
        setAlertCheckCpfCnpj(2);
      } finally {
        hotToast(idHotToast, 'dismiss');
      }
    },
    [personType],
  );

  const sentDataContract = useCallback(
    async (data: IFormStepPayment, token?: string) => {
      const { data: responseContract } = await apiRebox.post(`/contracts`, {
        users_id: newContractStorageService.getCustomer().id,
        users_person_type: data.person_type,
        users_cpf_cnpj: data.cpf_cnpj,
        products_id: newContractStorageService.getProduct().id,
        available_uses: null,
        covered_up: null,
        status: ConfigValues.rebox.contract.status.pending,
        renew_in_days: null,
        form_of_payment: selectedFormOfPayment,
        due_date: selectedDueDate,
        cycle: ConfigValues.rebox.contract.cycle.monthly,
        amount: null,
        installments: Number.parseInt(data.number_installments, 10),
        discount_type: ConfigValues.rebox.contract.discount_type.undefined,
        discount_amount_installments: null,
        number_installments_with_discount: 0,
        who_gave_discount_type:
          ConfigValues.rebox.contract.who_gave_discount_type.undefined,
        who_gave_discount_id: null,
        who_made_the_sale_id: null,
        insured_vehicles: [
          {
            id: newContractStorageService.getVehicle().id,
          },
        ],
        card:
          selectedFormOfPayment ===
          ConfigValues.rebox.contract.form_of_payment.credit_card
            ? {
                brand: brandCreditCard,
                type: selectedFormOfPayment,
                printed_name: data.name,
                number: formatText.removeAllNonDigits(data.number_card || ''),
                validity: data.validity,
                token,
              }
            : null,
      });

      toastify('Uhuuu! Sua compra foi efetuada.', 'success');

      newContractStorageService.cleanMany('all');
      changeStep(currentStep + 1);
      push(ConfigRoutes.rebox.publics.checkout.next.thanks.path);
    },
    [selectedFormOfPayment, selectedDueDate, brandCreditCard],
  );

  const handleRegisterSale = useCallback(
    async (data: IFormStepPayment) => {
      const idHotToast = hotToast('Finalizando...', 'loading');
      try {
        setLoading(prevState => !prevState);
        formRef.current?.setErrors({});

        await schema.validate(data, {
          abortEarly: false,
        });

        if (
          selectedFormOfPayment ===
          ConfigValues.rebox.contract.form_of_payment.credit_card
        ) {
          if (!data.number_card)
            throw new Error(
              'Por favor, informe o número do cartão de crédito.',
            );

          if (!data.name)
            throw new Error(
              'Por favor, informe o nome impresso no cartão de crédito.',
            );

          if (!data.validity)
            throw new Error(
              'Por favor, informe a data de válidade do cartão de crédito.',
            );

          if (!data.cvv)
            throw new Error(
              'Por favor, informe o código de segurança do cartão de crédito.',
            );

          const [month, year] = data.validity.split('/');
          const abbreviatedYear = year.substring(year.length - 2, year.length);
          const arrayName = data.name.split(' ');
          const numberCard = formatText.removeAllNonDigits(data.number_card);

          const cc = Iugu.CreditCard(
            numberCard,
            month,
            abbreviatedYear,
            arrayName[0],
            arrayName[arrayName.length - 1],
            data.cvv,
          );

          Iugu.createPaymentToken(cc, async function (response: any) {
            if (response.errors) {
              console.error(
                'Erro: Os dados do cartão de crédito não estão válidos.',
              );
            } else {
              await sentDataContract(data, response.id);
            }
          });

          // if (!tokenCreditCard)
          //   throw new Error(
          //     'Oops, verifique os dados do cartão de crédito. Não foi possível validar.',
          //   );
        } else {
          await sentDataContract(data);
        }
      } catch (error: any) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);
          formRef.current?.setErrors(errors);

          const { number_installments, person_type, cpf_cnpj } = errors;

          if (number_installments) toastify(number_installments, 'error');
          if (person_type) toastify(person_type, 'error');
          if (cpf_cnpj) toastify(cpf_cnpj, 'error');
        } else if (error.response) {
          toastify(error.response.data.error, 'error');
        } else
          toastify(
            typeof error === 'string'
              ? error
              : 'Sinto muito, não foi possível finalizar esta compra.',
            'error',
          );
      } finally {
        hotToast(idHotToast, 'dismiss');
        setLoading(prevState => !prevState);
      }
    },
    [selectedFormOfPayment, selectedDueDate, brandCreditCard],
  );

  useEffect(() => {
    generateInstallmentOptions();
  }, [product]);

  useEffect(() => {
    paymentMethodRef.current?.scrollIntoView();
  }, [selectedDueDate]);

  useEffect(() => {
    getProduct();

    const userLogged = sessionStorageService.getUser();
    const customerSale = newContractStorageService.getCustomer();
    if (userLogged && customerSale && userLogged.id === customerSale.id) {
      formRef.current?.setData({
        cpf_cnpj: userLogged.cpf || userLogged.cnpj || '',
      });
      setPersonType(userLogged.person_type || '');
    }
  }, []);

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
          onSubmit={handleRegisterSale}
          initialData={initialData}
          className="form-123"
        >
          {/* <AlertSimpleCustom
            text={`Estamos considerando por padrão o ciclo de cobrança "mensal".`}
            type="info"
          /> */}
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
                    size: 22,
                  }}
                  label={{
                    text: item,
                    colorDefault:
                      ConfigStyles.rebox.colors.black.opacity.average,
                    colorActive: ConfigStyles.rebox.colors.white.main,
                    size: ConfigStyles.rebox.fonts.size.paragraph.large,
                  }}
                  positionContent="center"
                  isSelected={selectedDueDate === item}
                  onClick={() => setSelectedDueDate(item)}
                />
              ))}
            </DueDateGroup>
          </DueDate>
          <PaymentMethod ref={paymentMethodRef}>
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
                    size: 22,
                  }}
                  label={{
                    text: ConfigTransition.rebox_contracts_form_of_payment[
                      item.toLowerCase()
                    ],
                    colorDefault:
                      ConfigStyles.rebox.colors.black.opacity.average,
                    colorActive: ConfigStyles.rebox.colors.white.main,
                    size: ConfigStyles.rebox.fonts.size.paragraph.large,
                  }}
                  width={{ size: '240px', maxSize: '100%' }}
                  onClick={() => setSelectedFormOfPayment(item)}
                  isSelected={selectedFormOfPayment === item}
                  positionContent="flex-start"
                  style={{ marginRight: '2vh' }}
                />
              ))}
            </PaymentMethodOptions>

            <PaymentMethodGroup>
              {selectedFormOfPayment ===
                ConfigValues.rebox.contract.form_of_payment.boleto && (
                <>
                  <Paragraph
                    nameColor="black"
                    textAlign="start"
                    fontWeight={600}
                  >
                    Dados do boleto
                  </Paragraph>
                  <Paragraph
                    nameColor="black"
                    textAlign="start"
                    opacity={0.8}
                    style={{ margin: '1.5vh 0 3vh' }}
                  >
                    Esta compra irá gerar um contrato, que será ativado somente
                    após o pagamento do 1º boleto. A compensação de pagamento
                    ocorre em até{' '}
                    {ConfigRules.rebox.charge.maximumDaysForCompensation} dias
                    úteis.
                  </Paragraph>
                  <AlertSimpleCustom
                    text="Nossas cobranças são recorrentes. Iremos enviar o boleto no valor da parcela que escolher abaixo, sempre no dia do vencimento."
                    type="warning"
                  />
                </>
              )}

              {selectedFormOfPayment ===
                ConfigValues.rebox.contract.form_of_payment.credit_card && (
                <>
                  <Paragraph
                    nameColor="black"
                    textAlign="start"
                    fontWeight={600}
                  >
                    Dados do cartão de crédito
                  </Paragraph>
                  <Paragraph
                    nameColor="black"
                    textAlign="start"
                    opacity={0.8}
                    style={{ margin: '1.5vh 0 3vh' }}
                  >
                    Esta compra irá gerar um contrato, que será ativado no
                    momento que recebermos a confirmação de pagamento.
                  </Paragraph>

                  <Paragraph
                    nameColor="greenEmerald"
                    textAlign="start"
                    fontSize={ConfigStyles.rebox.fonts.size.paragraph.large}
                    fontWeight={600}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor:
                        ConfigStyles.rebox.colors.greenEmerald.opacity.veryLow,
                      padding: '2vh 2vw',
                      marginTop: '1.5vh',
                    }}
                  >
                    <FaLock
                      color={ConfigStyles.rebox.colors.greenEmerald.main}
                      size={16}
                      style={{ marginRight: 8 }}
                    />
                    {/* <IoLockClosed
                      color={ConfigStyles.rebox.colors.greenEmerald.main}
                      size={20}
                      style={{ marginRight: 8 }}
                    /> */}
                    Você está em um ambiente seguro!
                  </Paragraph>

                  <SectionsGroup>
                    <SectionsItem>
                      <SubtitleSecondary
                        textAlign="start"
                        nameColor="black"
                        fontSize={14}
                      >
                        Número do cartão
                      </SubtitleSecondary>
                      <Paragraph
                        nameColor="black"
                        textAlign="start"
                        opacity={0.7}
                        fontSize={13}
                        style={{ marginBottom: '2vh' }}
                      >
                        Informe o número impresso em seu cartão de crédito
                      </Paragraph>

                      <SectionsItemGroup>
                        <InputMask
                          name="number_card"
                          placeholder="XXXX XXXX XXXX XXXX"
                          alertVisible
                          mask="9999 9999 9999 9999"
                          onChange={event => {
                            const cardNumber = formatText.removeAllNonDigits(
                              event.target.value,
                            );
                            if (cardNumber.length === 16) {
                              changeCreditCardNumber(cardNumber);
                            } else {
                              setAlertCreditCard(0);
                            }
                          }}
                        />
                        {alertCreditCard === 1 && (
                          <IoCheckmarkCircle
                            color={ConfigStyles.rebox.colors.greenEmerald.main}
                            size={20}
                          />
                        )}
                        {alertCreditCard === 2 && (
                          <IoCloseCircle
                            color={ConfigStyles.rebox.colors.red.main}
                            size={20}
                          />
                        )}
                      </SectionsItemGroup>
                    </SectionsItem>

                    <SectionsItem>
                      <SubtitleSecondary
                        textAlign="start"
                        nameColor="black"
                        fontSize={14}
                      >
                        Nome no cartão
                      </SubtitleSecondary>
                      <Paragraph
                        nameColor="black"
                        textAlign="start"
                        opacity={0.7}
                        fontSize={13}
                        style={{ marginBottom: '2vh' }}
                      >
                        Informe o nome conforme impresso no cartão de crédito
                      </Paragraph>
                      <InputText
                        name="name"
                        placeholder="Nome impresso no cartão"
                        style={{ textTransform: 'uppercase' }}
                        alertVisible
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
                        Data de validade
                      </SubtitleSecondary>
                      <Paragraph
                        nameColor="black"
                        textAlign="start"
                        opacity={0.7}
                        fontSize={13}
                        style={{ marginBottom: '2vh' }}
                      >
                        Informe o mês e o ano de validade
                      </Paragraph>
                      <SectionsItemGroup>
                        <InputMask
                          name="validity"
                          alertVisible
                          placeholder="MM/AAAA"
                          mask="99/9999"
                          onChange={event => {
                            const validity = formatText.removeAllNonDigits(
                              event.target.value,
                            );
                            if (validity.length === 6) {
                              changeCreditCardValidate(event.target.value);
                            } else {
                              setAlertValidate(0);
                            }
                          }}
                        />
                        {alertValidate === 1 && (
                          <IoCheckmarkCircle
                            color={ConfigStyles.rebox.colors.greenEmerald.main}
                            size={20}
                          />
                        )}
                        {alertValidate === 2 && (
                          <IoCloseCircle
                            color={ConfigStyles.rebox.colors.red.main}
                            size={20}
                          />
                        )}
                      </SectionsItemGroup>
                    </SectionsItem>

                    <SectionsItem>
                      <SubtitleSecondary
                        textAlign="start"
                        nameColor="black"
                        fontSize={14}
                      >
                        CVV
                      </SubtitleSecondary>
                      <Paragraph
                        nameColor="black"
                        textAlign="start"
                        opacity={0.7}
                        fontSize={13}
                        style={{ marginBottom: '2vh' }}
                      >
                        Informe o código de segurança do seu cartão de crédito
                      </Paragraph>
                      <SectionsItemGroup>
                        <InputText
                          name="cvv"
                          placeholder="CVV"
                          alertVisible
                          maxLength={4}
                          onChange={event => {
                            const creditCardCvv = formatText.removeAllNonDigits(
                              event.target.value,
                            );
                            if (
                              creditCardCvv.length > 2 &&
                              creditCardCvv.length < 5
                            ) {
                              changeCreditCardCvv(creditCardCvv);
                            } else {
                              setAlertCvv(0);
                            }
                          }}
                        />
                        {alertCvv === 1 && (
                          <IoCheckmarkCircle
                            color={ConfigStyles.rebox.colors.greenEmerald.main}
                            size={20}
                          />
                        )}
                        {alertCvv === 2 && (
                          <IoCloseCircle
                            color={ConfigStyles.rebox.colors.red.main}
                            size={20}
                          />
                        )}
                      </SectionsItemGroup>
                    </SectionsItem>
                  </SectionsGroup>

                  <DividingLine />

                  <AlertSimpleCustom
                    text={`Nossas cobranças são recorrentes. Iremos cobrar apenas o valor da parcela que escolher abaixo, sempre no dia do vencimento, sem comprometer o limite do seu cartão de crédito.`}
                    type="warning"
                  />
                </>
              )}

              <SectionsGroup>
                <SectionsItem>
                  <SubtitleSecondary
                    textAlign="start"
                    nameColor="black"
                    fontSize={14}
                  >
                    {/* Parcelamento */}
                    Mensalidade
                  </SubtitleSecondary>
                  <Paragraph
                    nameColor="black"
                    textAlign="start"
                    opacity={0.7}
                    fontSize={13}
                    style={{ marginBottom: '2vh' }}
                  >
                    Se desejar, você pode antecipar as cobranças
                  </Paragraph>
                  <InputSelect
                    name="number_installments"
                    options={installmentOptions}
                    placeholder="Selecione"
                    selectedDefault={`${LIMIT_MAX_INSTALLMENTS}`}
                    tabIndex={1}
                    disabled={true}
                    isDisable={true}
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
                    Gerar contrato para
                  </SubtitleSecondary>
                  <Paragraph
                    nameColor="black"
                    textAlign="start"
                    opacity={0.5}
                    fontSize={13}
                    style={{ marginBottom: '2vh' }}
                  >
                    Define o documento exigido para registro
                  </Paragraph>
                  <InputSelect
                    name="person_type"
                    options={ConfigLabel.rebox.others.user.person_type}
                    placeholder="Selecione"
                    selectedDefault={personType}
                    tabIndex={3}
                    onChange={event => setPersonType(event.target.value)}
                  />
                </SectionsItem>

                <SectionsItem>
                  <SubtitleSecondary
                    textAlign="start"
                    nameColor="black"
                    fontSize={14}
                  >
                    CPF/CNPJ
                  </SubtitleSecondary>
                  <Paragraph
                    nameColor="black"
                    textAlign="start"
                    opacity={0.5}
                    fontSize={13}
                    style={{ marginBottom: '2vh' }}
                  >
                    Informe o número do documento do cliente
                  </Paragraph>
                  <SectionsItemGroup>
                    <InputMask
                      name="cpf_cnpj"
                      mask={
                        personType ===
                        ConfigValues.rebox.user.person_type.physical_person
                          ? '999.999.999-99'
                          : '99.999.999/9999-99'
                      }
                      placeholder="Número do documento"
                      tabIndex={4}
                      onChange={event => {
                        const cpfCnpj = formatText.removeAllNonDigits(
                          event.target.value,
                        );
                        if (cpfCnpj.length === 11 || cpfCnpj.length === 14) {
                          handleGetCustomerByCpfCnpj(cpfCnpj);
                        } else if (alertCheckCpfCnpj !== 0) {
                          setAlertCheckCpfCnpj(0);
                        }
                      }}
                    />
                    {alertCheckCpfCnpj === 1 && (
                      <IoCheckmarkCircle
                        color={ConfigStyles.rebox.colors.greenEmerald.main}
                        size={20}
                      />
                    )}
                    {alertCheckCpfCnpj === 2 && (
                      <IoCloseCircle
                        color={ConfigStyles.rebox.colors.red.main}
                        size={20}
                      />
                    )}
                  </SectionsItemGroup>
                </SectionsItem>
              </SectionsGroup>
            </PaymentMethodGroup>
          </PaymentMethod>

          {/* <Discount>
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
          </Discount> */}
        </FormPayment>
      </SectionsPayment>
      <Buttons>
        <ButtonMain
          loading={loading}
          onClick={() => formRef.current?.submitForm()}
          style={{ maxWidth: 200 }}
          disabled={alertCheckCpfCnpj === 2}
          isDisable={alertCheckCpfCnpj === 2}
        >
          Finalizar
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
