// ./src/components/forms/FormCustomerEdit/index.tsx
import React, { useCallback, useRef, useState, useEffect } from 'react';

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
  ConfigLabel,
  ConfigRules,
  ConfigStyles,
  ConfigValues,
} from '@config/index';
import User from '@models/User';
import { apiRebox } from '@services/index';
import { getValidationErrors } from '@utils/errors';
import {
  formatDate,
  formatText,
  formatCPF,
  formatCNPJ,
  formatCellphone,
} from '@utils/formatters';
import { hotToast, toastify } from '@utils/notifiers';

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
} from './styles';

interface IProps {
  customer: User;
}

const FormCustomerEdit: React.FC<IProps> = ({ customer: customerData }) => {
  const formRef = useRef<FormHandles>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [customer, setCustomer] = useState<User>(customerData);
  const [whoIndicated, setWhoIndicated] = useState<User>();
  const [subordinateOf, setSubordinateOf] = useState<User>();
  const [
    enabledCodeSubordinateOf,
    setEnabledCodeSubordinateOf,
  ] = useState<boolean>(
    customer.access_level !== ConfigValues.rebox.user.access_level.low,
  );
  const [alertCheckIndicated, setAlertCheckIndicated] = useState<number>(0);
  const [alertCheckPartner, setAlertCheckPartner] = useState<number>(0);
  const [personType, setPersonType] = useState<string>(
    customer.cpf
      ? ConfigValues.rebox.user.person_type.physical_person
      : ConfigValues.rebox.user.person_type.legal_person,
  );

  const getIndicated = useCallback(async () => {
    try {
      if (customer?.id) {
        const { data: responseIndication } = await apiRebox.get(
          `/indications?details=all&id_indicated=${customer?.id}`,
        );
        const [{ user_who_indicated }] = responseIndication.data;
        setWhoIndicated(user_who_indicated);
      }
    } catch (error) {}
  }, [customer]);

  const getPartner = useCallback(async () => {
    try {
      if (customer?.subordinate_of) {
        const { data: responsePartner } = await apiRebox.get(
          `/users/${customer?.subordinate_of}`,
        );
        setSubordinateOf(responsePartner.data);
      }
    } catch (error) {}
  }, [customer]);

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

  const handleGetPartner = useCallback(async (referralCode: string) => {
    const idHotToast = hotToast('Carregando...', 'loading');
    try {
      const { data: responsePartner } = await apiRebox.get(
        `/users/null?referral_code=${referralCode}`,
      );
      setSubordinateOf(responsePartner.data);
      setAlertCheckPartner(1);
    } catch (error) {
      hotToast(idHotToast, 'dismiss');
      toastify(
        'Não encontramos nenhum afiliado/parceiro com este código.',
        'error',
      );
      setAlertCheckPartner(2);
    } finally {
      hotToast(idHotToast, 'dismiss');
    }
  }, []);

  const handleUpdateCustomer = useCallback(
    async (data: IFormCustomer) => {
      try {
        setLoading(prevState => !prevState);
        formRef.current?.setErrors({});

        await schemaCustomer.validate(data, {
          abortEarly: false,
        });

        const { data: responseUpdateCustomer } = await apiRebox.put(
          `/users/${customer.id}`,
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
            sex: data.sex ? data.sex : null,
            email: data.email.toLowerCase(),
            cellphone: formatCellphone.removeMask(data.cellphone),
            telephone: data.telephone
              ? formatText.removeAllNonDigits(data.telephone)
              : null,
            status: data.status,
            role: customer.role,
            company_size: data.company_size ? data.company_size : null,
            access_level: data.access_level,
            subordinate_of: subordinateOf?.id || null,
            id_who_indicated: whoIndicated?.id || null,
            is_partner: customer?.is_partner,
            accept_terms_of_use: customer?.accept_terms_of_use,
            gateway_customers_id: customer?.gateway_customers_id,
          },
        );

        const { header, data: customerUpdated } = responseUpdateCustomer;

        setCustomer(customerUpdated);

        toastify(header.message, 'success');
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
            code_subordinate_of,
            code_who_indicated,
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
          if (code_subordinate_of) toastify(code_subordinate_of, 'error');
          if (code_who_indicated) toastify(code_who_indicated, 'error');
        } else if (error.response) {
          toastify(error.response.data.error, 'error');
        } else {
          toastify(
            'Houve um error ao tentar atualizar os dados deste cliente.',
            'error',
          );
        }
      } finally {
        setLoading(prevState => !prevState);
      }
    },
    [customer, whoIndicated, subordinateOf],
  );

  useEffect(() => {
    getIndicated();
    getPartner();
    // eslint-disable-next-line
  }, [customer]);

  return (
    <Container>
      <FormCustomer
        ref={formRef}
        onSubmit={handleUpdateCustomer}
        initialData={{
          ...customer,
          name: customer?.name ? customer.name.toUpperCase() : '',
          date_of_birth: customer?.date_of_birth
            ? formatDate.addMask(customer.date_of_birth)
            : '',
          cpf_cnpj: customer.cpf || customer.cnpj,
          code_subordinate_of: subordinateOf?.referral_code,
          code_who_indicated: whoIndicated?.referral_code,
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
                selectedDefault={customer.sex}
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
              <InputText
                name="email"
                placeholder="Informe o e-mail"
                tabIndex={6}
              />
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
                selectedDefault={customer.status}
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
                  customer?.company_size
                    ? customer.company_size
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
                selectedDefault={customer.access_level}
                tabIndex={11}
                onChange={event => {
                  if (
                    event.target.value !==
                    ConfigValues.rebox.user.access_level.low
                  )
                    formRef.current?.setData({ code_subordinate_of: '' });
                  else
                    formRef.current?.setData({
                      code_subordinate_of: subordinateOf?.referral_code || '',
                    });

                  setEnabledCodeSubordinateOf(
                    event.target.value !==
                      ConfigValues.rebox.user.access_level.low,
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
                Vinculado a
              </SubtitleSecondary>
              <Paragraph
                nameColor="black"
                textAlign="start"
                opacity={0.5}
                fontSize={13}
                style={{ marginBottom: '2vh' }}
              >
                Define de quem o cliente (como afiliado) está subordinado
              </Paragraph>
              <SectionsItemGroup>
                <InputText
                  name="code_subordinate_of"
                  placeholder="Código de um parceiro"
                  tabIndex={11}
                  disabled={enabledCodeSubordinateOf}
                  isDisable={enabledCodeSubordinateOf}
                  onChange={event => {
                    if (
                      event.target.value.length >=
                      ConfigRules.rebox.user.referralCode.minimumCharacterSize
                    ) {
                      handleGetPartner(event.target.value);
                    } else setAlertCheckPartner(0);
                  }}
                />
                {alertCheckPartner === 1 && (
                  <IoCheckmarkCircle
                    color={ConfigStyles.rebox.colors.greenEmerald.main}
                    size={20}
                  />
                )}
                {alertCheckPartner === 2 && (
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

          <ButtonMain
            type="submit"
            loading={loading}
            style={{ marginTop: '4vh', maxWidth: 250 }}
            tabIndex={13}
          >
            Salvar
          </ButtonMain>
        </Sections>
      </FormCustomer>
    </Container>
  );
};

export default FormCustomerEdit;
