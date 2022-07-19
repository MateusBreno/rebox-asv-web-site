// ./src/components/forms/FormCustomerNew/index.tsx
import React, { useCallback, useRef, useState } from 'react';

import { FormHandles } from '@unform/core';
import { IoCheckmarkCircle, IoCloseCircle } from 'react-icons/io5';
import * as Yup from 'yup';

import {
  SubtitleSecondary,
  Paragraph,
  InputText,
  InputSelect,
  InputMask,
  ButtonMain,
} from '@components/index';
import {
  ConfigBase,
  ConfigLabel,
  ConfigRules,
  ConfigStyles,
  ConfigValues,
} from '@config/index';
import User from '@models/User';
import {
  apiRebox,
  apiViaCep,
  newContractStorageService,
} from '@services/index';
import { getValidationErrors } from '@utils/errors';
import {
  formatDate,
  formatText,
  formatCPF,
  formatCNPJ,
  formatCellphone,
} from '@utils/formatters';
import { hotToast, toastify } from '@utils/notifiers';
import { validatorEmail } from '@utils/validators';

import { schemaCustomer } from './schemaValidation';
import { IFormCustomer } from './typing';

import {
  Container,
  FormCustomer,
  Sections,
  SectionsGroup,
  SectionsItem,
  SectionsItemGroup,
  DividingLine,
  LinkSearchCep,
} from './styles';

interface IProps {
  forNewSale?: {
    advanceStep(): void;
  };
}

const FormCustomerNew: React.FC<IProps> = ({ forNewSale }) => {
  const formRef = useRef<FormHandles>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [whoIndicated, setWhoIndicated] = useState<User>();
  const [alertCheckIndicated, setAlertCheckIndicated] = useState<number>(0);
  const [alertCheckCpfCnpj, setAlertCheckCpfCnpj] = useState<number>(0);
  const [alertCheckEmail, setAlertCheckEmail] = useState<number>(0);
  const [personType, setPersonType] = useState<string>(
    ConfigValues.rebox.user.person_type.physical_person,
  );
  const [
    fieldsAdressesIsEnabled,
    setFieldsAdressesIsEnabled,
  ] = useState<boolean>(false);
  const [showAllAddressFields, setShowAllAddressFields] = useState<boolean>(
    false,
  );

  const handleGetAddressByZipcode = useCallback(async (cepText: string) => {
    try {
      if (cepText.length !== 8) {
        return;
      }

      const { data: responseViaCep } = await apiViaCep.get(`/${cepText}/json/`);
      const { uf, localidade, bairro, logradouro } = responseViaCep;

      setShowAllAddressFields(true);

      if (uf && localidade && bairro && logradouro) {
        // Mostre os campos de endereço, desabilitados
        setFieldsAdressesIsEnabled(false);

        const currentData = formRef.current?.getData();

        formRef.current?.setData({
          ...currentData,
          state: uf,
          city: localidade,
          neighborhood: bairro,
          street: logradouro,
        });
      } else setFieldsAdressesIsEnabled(true);
    } catch (error) {
      setShowAllAddressFields(true);
      setFieldsAdressesIsEnabled(true);
      toastify(
        'Não foi possível buscar o endereço pelo cep. Por favor tente novamente.',
        'error',
      );
    }
  }, []);

  const handleGetCustomerByCpfCnpj = useCallback(
    async (cpfCnpj: string) => {
      const typeDoc =
        personType === ConfigValues.rebox.user.person_type.physical_person
          ? 'CPF'
          : 'CNPJ';
      const idHotToast = hotToast(`Verificando ${typeDoc}`, 'loading');
      try {
        const { data: responseCustomer } = await apiRebox.get(
          `/users?query=${formatText.removeAllNonDigits(cpfCnpj)}`,
        );

        const { header } = responseCustomer;

        if (header.total > 0) {
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

  const handleGetCustomerByEmail = useCallback(async (email: string) => {
    const idHotToast = hotToast(`Verificando e-mail`, 'loading');
    try {
      const { data: responseCustomer } = await apiRebox.get(
        `/users?email=${email}`,
      );
      const { header } = responseCustomer;

      if (header.total > 0) {
        hotToast(idHotToast, 'dismiss');
        toastify(
          `Este e-mail não pode ser usado. Já pertence a um usuário cadastrado.`,
          'error',
        );
        setAlertCheckEmail(2);
        return;
      }

      setAlertCheckEmail(1);
    } catch (error: any) {
      toastify(
        error.response
          ? error.response.data.error
          : `Houve um error ao tentar verificar o e-mail informado.`,
        'error',
      );
      setAlertCheckEmail(2);
    } finally {
      hotToast(idHotToast, 'dismiss');
    }
  }, []);

  const handleGetWhoIndicated = useCallback(async (referralCode: string) => {
    const idHotToast = hotToast('Carregando...', 'loading');
    try {
      const { data: responseUserWhoIndicated } = await apiRebox.get(
        `/users/null?referral_code=${referralCode}`,
      );
      setWhoIndicated(responseUserWhoIndicated.data);
      setAlertCheckIndicated(1);
    } catch (error) {
      hotToast(idHotToast, 'dismiss');
      toastify('Não encontramos nenhum afiliado com este código.', 'error');
      setAlertCheckIndicated(2);
    } finally {
      hotToast(idHotToast, 'dismiss');
    }
  }, []);

  const handleRegisterCustomer = useCallback(
    async (data: IFormCustomer) => {
      const idHotToast = hotToast(`Registrando cliente`, 'loading');
      try {
        setLoading(prevState => !prevState);
        formRef.current?.setErrors({});

        await schemaCustomer.validate(data, {
          abortEarly: false,
        });

        const { data: responseCreatedCustomer } = await apiRebox.post(
          `/users`,
          {
            name: data.name.toLowerCase(),
            date_of_birth: data.date_of_birth
              ? formatDate.removeMask(data.date_of_birth)
              : null,
            person_type: data.person_type,
            cpf:
              data.person_type ===
              ConfigValues.rebox.user.person_type.physical_person
                ? formatCPF.removeMask(data.cpf_cnpj)
                : null,
            cnpj:
              data.person_type ===
              ConfigValues.rebox.user.person_type.legal_person
                ? formatCNPJ.removeMask(data.cpf_cnpj)
                : null,
            sex: data.sex,
            email: data.email.toLowerCase(),
            cellphone: formatCellphone.removeMask(data.cellphone),
            telephone: data.telephone
              ? formatText.removeAllNonDigits(data.telephone)
              : null,
            status: data.status,
            role: ConfigValues.rebox.user.role.client,
            company_size: data.company_size ? data.company_size : null,
            access_level: data.access_level,
            subordinate_of: null,
            id_who_indicated: whoIndicated?.id || null,
            is_partner: true,
            accept_terms_of_use: true,
            gateway_customers_id: null,
          },
        );

        const { header, data: customerCreated } = responseCreatedCustomer;

        await apiRebox.post('/users/address', {
          users_id: customerCreated.id,
          country: 'BR',
          state: data.state,
          city: data.city,
          neighborhood: data.neighborhood,
          zip_code: data.zip_code,
          street: data.street,
          number: Number.parseInt(`${data.number}`, 10),
          complement: data.complement,
        });

        toastify(header.message, 'success');

        // Caso o cliente esteja sendo criado no momento da venda
        if (forNewSale) {
          newContractStorageService.updateCustomer({
            id: customerCreated.id,
            field_type: 'USER_EMAIL',
            query: customerCreated.email,
          });
          forNewSale.advanceStep();
        }
      } catch (error: any) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);

          formRef.current?.setErrors(errors);

          const {
            name,
            date_of_birth,
            person_type,
            cpf_cnpj,
            sex,
            email,
            cellphone,
            telephone,
            status,
            company_size,
            access_level,
            code_who_indicated,
            zip_code,
            state,
            city,
            neighborhood,
            street,
            number,
          } = errors;

          if (name) toastify(name, 'error');
          if (date_of_birth) toastify(date_of_birth, 'error');
          if (person_type) toastify(person_type, 'error');
          if (cpf_cnpj) toastify(cpf_cnpj, 'error');
          if (sex) toastify(sex, 'error');
          if (email) toastify(email, 'error');
          if (cellphone) toastify(cellphone, 'error');
          if (telephone) toastify(telephone, 'error');
          if (status) toastify(status, 'error');
          if (company_size) toastify(company_size, 'error');
          if (access_level) toastify(access_level, 'error');
          if (code_who_indicated) toastify(code_who_indicated, 'error');
          if (zip_code) toastify(zip_code, 'error');
          if (state) toastify(state, 'error');
          if (city) toastify(city, 'error');
          if (neighborhood) toastify(neighborhood, 'error');
          if (street) toastify(street, 'error');
          if (number) toastify(number, 'error');
        } else if (error.response) {
          toastify(error.response.data.error, 'error');
        } else {
          toastify('Houve um error ao tentar cadastrar este cliente.', 'error');
        }
      } finally {
        setLoading(prevState => !prevState);
        hotToast(idHotToast, 'dismiss');
      }
    },
    // eslint-disable-next-line
    [whoIndicated],
  );

  return (
    <Container>
      <FormCustomer
        ref={formRef}
        onSubmit={handleRegisterCustomer}
        initialData={{
          email: '',
          cpf_cnpj: '',
        }}
      >
        <Sections>
          <SectionsGroup>
            <SectionsItem>
              <SubtitleSecondary
                textAlign="start"
                nameColor="black"
                fontSize={14}
              >
                Nome completo
              </SubtitleSecondary>
              <Paragraph
                nameColor="black"
                textAlign="start"
                opacity={0.5}
                fontSize={13}
                style={{ marginBottom: '2vh' }}
              >
                Informe o nome do cliente sem abreviações
              </Paragraph>
              <InputText
                name="name"
                placeholder="Informe o nome"
                tabIndex={1}
                autoFocus
                onChange={event => {
                  event.target.value = event.target.value.toUpperCase();
                }}
              />
            </SectionsItem>

            <SectionsItem>
              <SubtitleSecondary
                textAlign="start"
                nameColor="black"
                fontSize={14}
              >
                Data de nascimento
              </SubtitleSecondary>
              <Paragraph
                nameColor="black"
                textAlign="start"
                opacity={0.5}
                fontSize={13}
                style={{ marginBottom: '2vh' }}
              >
                Se pessoa jurídica, será a data de abertura da empresa
              </Paragraph>
              <InputMask
                name="date_of_birth"
                mask={'99/99/9999'}
                placeholder="Informe a data"
                tabIndex={2}
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
                Tipo de pessoa
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
                onChange={event => {
                  setPersonType(event.target.value);
                  setAlertCheckCpfCnpj(0);
                  formRef.current?.setData({ cpf_cnpj: '' });
                }}
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

          <SectionsGroup>
            <SectionsItem>
              <SubtitleSecondary
                textAlign="start"
                nameColor="black"
                fontSize={14}
              >
                Sexo
              </SubtitleSecondary>
              <Paragraph
                nameColor="black"
                textAlign="start"
                opacity={0.5}
                fontSize={13}
                style={{ marginBottom: '2vh' }}
              >
                Define o sexo de nascimento do cliente
              </Paragraph>
              <InputSelect
                name="sex"
                options={ConfigLabel.rebox.others.user.sex}
                placeholder="Selecione"
                selectedDefault={
                  personType ===
                  ConfigValues.rebox.user.person_type.physical_person
                    ? ''
                    : ConfigValues.rebox.user.sex.undefined
                }
                tabIndex={5}
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
                E-mail
              </SubtitleSecondary>
              <Paragraph
                nameColor="black"
                textAlign="start"
                opacity={0.5}
                fontSize={13}
                style={{ marginBottom: '2vh' }}
              >
                Informe o endereço eletrônico de contato do cliente
              </Paragraph>
              <SectionsItemGroup>
                <InputText
                  name="email"
                  placeholder="Informe o e-mail"
                  tabIndex={6}
                  onChange={event => {
                    const email = event.target.value;
                    if (validatorEmail.check(email)) {
                      handleGetCustomerByEmail(email);
                    } else if (alertCheckEmail !== 2) setAlertCheckEmail(2);
                    else if (email === '') setAlertCheckEmail(0);
                  }}
                />
                {alertCheckEmail === 1 && (
                  <IoCheckmarkCircle
                    color={ConfigStyles.rebox.colors.greenEmerald.main}
                    size={20}
                  />
                )}
                {alertCheckEmail === 2 && (
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
                Celular/Whatsapp
              </SubtitleSecondary>
              <Paragraph
                nameColor="black"
                textAlign="start"
                opacity={0.5}
                fontSize={13}
                style={{ marginBottom: '2vh' }}
              >
                Informe o celular e/ou whatsapp para contato
              </Paragraph>
              <InputMask
                name="cellphone"
                mask={'+55 (99) 99999-9999'}
                placeholder="Informe o celular"
                tabIndex={7}
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
                Telefone
              </SubtitleSecondary>
              <Paragraph
                nameColor="black"
                textAlign="start"
                opacity={0.5}
                fontSize={13}
                style={{ marginBottom: '2vh' }}
              >
                Pode ser telefone residencial, comercial, coorporativo etc.
              </Paragraph>
              <InputMask
                name="telephone"
                mask={'(99) 9999-9999'}
                placeholder="Informe o telefone"
                tabIndex={8}
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
                Situação do cliente
              </SubtitleSecondary>
              <Paragraph
                nameColor="black"
                textAlign="start"
                opacity={0.5}
                fontSize={13}
                style={{ marginBottom: '2vh' }}
              >
                Informa o status atual do cliente
              </Paragraph>
              <InputSelect
                name="status"
                options={ConfigLabel.rebox.others.user.status}
                placeholder="Selecione"
                selectedDefault={ConfigValues.rebox.user.status.active}
                tabIndex={9}
              />
            </SectionsItem>

            <SectionsItem>
              <SubtitleSecondary
                textAlign="start"
                nameColor="black"
                fontSize={14}
              >
                Tamanho da empresa
              </SubtitleSecondary>
              <Paragraph
                nameColor="black"
                textAlign="start"
                opacity={0.5}
                fontSize={13}
                style={{ marginBottom: '2vh' }}
              >
                Define o tamanho da companhia pelo número de colaboradores
              </Paragraph>
              <InputSelect
                name="company_size"
                options={ConfigLabel.rebox.others.user.company_size}
                placeholder="Selecione"
                selectedDefault={
                  personType ===
                  ConfigValues.rebox.user.person_type.legal_person
                    ? ''
                    : ConfigValues.rebox.user.company_size.undefined
                }
                tabIndex={10}
                disabled={
                  personType ===
                  ConfigValues.rebox.user.person_type.physical_person
                }
                isDisable={
                  personType ===
                  ConfigValues.rebox.user.person_type.physical_person
                }
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
                Nível de acesso
              </SubtitleSecondary>
              <Paragraph
                nameColor="black"
                textAlign="start"
                opacity={0.5}
                fontSize={13}
                style={{ marginBottom: '2vh' }}
              >
                Restringe ou disponibiliza recursos no portal do afiliado
              </Paragraph>
              <InputSelect
                name="access_level"
                options={ConfigLabel.rebox.others.user.access_level}
                placeholder="Selecione"
                selectedDefault={ConfigValues.rebox.user.access_level.normal}
                tabIndex={11}
              />
            </SectionsItem>

            <SectionsItem>
              <SubtitleSecondary
                textAlign="start"
                nameColor="black"
                fontSize={14}
              >
                Indicado(a) por
              </SubtitleSecondary>
              <Paragraph
                nameColor="black"
                textAlign="start"
                opacity={0.5}
                fontSize={13}
                style={{ marginBottom: '2vh' }}
              >
                Informa o código de indicação do afiliado que o(a) indicou
              </Paragraph>
              <SectionsItemGroup>
                <InputText
                  name="code_who_indicated"
                  placeholder="Código de quem indicou"
                  tabIndex={12}
                  disabled={!!whoIndicated}
                  isDisable={!!whoIndicated}
                  onChange={event => {
                    if (
                      event.target.value.length >=
                      ConfigRules.rebox.user.referralCode.minimumCharacterSize
                    ) {
                      handleGetWhoIndicated(event.target.value);
                    } else setAlertCheckIndicated(0);
                  }}
                />
                {alertCheckIndicated === 1 && (
                  <IoCheckmarkCircle
                    color={ConfigStyles.rebox.colors.greenEmerald.main}
                    size={20}
                  />
                )}
                {alertCheckIndicated === 2 && (
                  <IoCloseCircle
                    color={ConfigStyles.rebox.colors.red.main}
                    size={20}
                  />
                )}
              </SectionsItemGroup>
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
                CEP
              </SubtitleSecondary>
              <Paragraph
                nameColor="black"
                textAlign="start"
                opacity={0.5}
                fontSize={13}
                style={{ marginBottom: '2vh' }}
              >
                Informe o código postal que localiza o endereço
              </Paragraph>
              <InputMask
                name="zip_code"
                placeholder="Informe o CEP"
                mask="99999-999"
                tabIndex={13}
                onChange={event => {
                  const cep = event.target.value;
                  handleGetAddressByZipcode(formatText.removeAllNonDigits(cep));
                }}
              />
              <LinkSearchCep
                to={{
                  pathname: ConfigBase.correio.baseUrls.buscaCepInter,
                }}
                key="config"
                target="_blank"
                tabIndex={14}
              >
                Não sei o cep
              </LinkSearchCep>
            </SectionsItem>
            {showAllAddressFields && (
              <SectionsItem>
                <SubtitleSecondary
                  textAlign="start"
                  nameColor="black"
                  fontSize={14}
                >
                  Estado
                </SubtitleSecondary>
                <Paragraph
                  nameColor="black"
                  textAlign="start"
                  opacity={0.5}
                  fontSize={13}
                  style={{ marginBottom: '2vh' }}
                >
                  Informe a UF do estado brasileiro
                </Paragraph>
                <InputText
                  name="state"
                  placeholder="Informe o estado"
                  readOnly={!fieldsAdressesIsEnabled}
                  tabIndex={15}
                  autoFocus
                  onChange={event => {
                    event.target.value = event.target.value.toUpperCase();
                  }}
                />
              </SectionsItem>
            )}
          </SectionsGroup>

          {showAllAddressFields && (
            <>
              <SectionsGroup>
                <SectionsItem>
                  <SubtitleSecondary
                    textAlign="start"
                    nameColor="black"
                    fontSize={14}
                  >
                    Cidade
                  </SubtitleSecondary>
                  <Paragraph
                    nameColor="black"
                    textAlign="start"
                    opacity={0.5}
                    fontSize={13}
                    style={{ marginBottom: '2vh' }}
                  >
                    Informe o nome da cidade localizada no estado
                  </Paragraph>
                  <InputText
                    name="city"
                    placeholder="Informe a cidade"
                    readOnly={!fieldsAdressesIsEnabled}
                    tabIndex={16}
                    onChange={event => {
                      event.target.value = event.target.value.toUpperCase();
                    }}
                  />
                </SectionsItem>

                <SectionsItem>
                  <SubtitleSecondary
                    textAlign="start"
                    nameColor="black"
                    fontSize={14}
                  >
                    Bairro
                  </SubtitleSecondary>
                  <Paragraph
                    nameColor="black"
                    textAlign="start"
                    opacity={0.5}
                    fontSize={13}
                    style={{ marginBottom: '2vh' }}
                  >
                    Informe o nome do bairro localizado na cidade
                  </Paragraph>
                  <InputText
                    name="neighborhood"
                    placeholder="Informe o bairro"
                    readOnly={!fieldsAdressesIsEnabled}
                    tabIndex={17}
                    onChange={event => {
                      event.target.value = event.target.value.toUpperCase();
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
                    Rua
                  </SubtitleSecondary>
                  <Paragraph
                    nameColor="black"
                    textAlign="start"
                    opacity={0.5}
                    fontSize={13}
                    style={{ marginBottom: '2vh' }}
                  >
                    Informe o nome completo da rua
                  </Paragraph>
                  <InputText
                    name="street"
                    placeholder="Informe a rua"
                    readOnly={!fieldsAdressesIsEnabled}
                    tabIndex={18}
                    onChange={event => {
                      event.target.value = event.target.value.toUpperCase();
                    }}
                  />
                </SectionsItem>

                <SectionsItem>
                  <SubtitleSecondary
                    textAlign="start"
                    nameColor="black"
                    fontSize={14}
                  >
                    Número
                  </SubtitleSecondary>
                  <Paragraph
                    nameColor="black"
                    textAlign="start"
                    opacity={0.5}
                    fontSize={13}
                    style={{ marginBottom: '2vh' }}
                  >
                    Informe o número da casa localizada na rua
                  </Paragraph>
                  <InputText name="number" placeholder="Número" tabIndex={19} />
                </SectionsItem>
              </SectionsGroup>

              <SectionsGroup>
                <SectionsItem>
                  <SubtitleSecondary
                    textAlign="start"
                    nameColor="black"
                    fontSize={14}
                  >
                    Complemento
                  </SubtitleSecondary>
                  <Paragraph
                    nameColor="black"
                    textAlign="start"
                    opacity={0.5}
                    fontSize={13}
                    style={{ marginBottom: '2vh' }}
                  >
                    Informações adicionais, como: Ponto de referência, casa 1
                    etc.
                  </Paragraph>
                  <InputText
                    name="complement"
                    placeholder="Complemento"
                    tabIndex={20}
                    onChange={event => {
                      event.target.value = formatText.capitalizedFirstLetter(
                        event.target.value,
                      );
                    }}
                  />
                </SectionsItem>
              </SectionsGroup>
            </>
          )}

          <ButtonMain
            type="submit"
            loading={loading}
            style={{ marginTop: '4vh', maxWidth: 250 }}
            tabIndex={21}
            disabled={alertCheckCpfCnpj === 2 || alertCheckEmail === 2}
            isDisable={alertCheckCpfCnpj === 2 || alertCheckEmail === 2}
          >
            Cadastrar
          </ButtonMain>
        </Sections>
      </FormCustomer>
    </Container>
  );
};

export default FormCustomerNew;
