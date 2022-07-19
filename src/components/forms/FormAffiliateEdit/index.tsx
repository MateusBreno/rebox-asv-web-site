// ./src/components/forms/FormAffiliateEdit/index.tsx
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

import { schemaAffiliate } from './schemaValidation';
import { IFormAffiliate } from './typing';

import {
  Container,
  FormAffiliate,
  Sections,
  SectionsGroup,
  SectionsItem,
  SectionsItemGroup,
  DividingLine,
} from './styles';

interface IProps {
  affiliate: User;
}

const FormAffiliateEdit: React.FC<IProps> = ({ affiliate: affiliateData }) => {
  const formRef = useRef<FormHandles>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [affiliate, setAffiliate] = useState<User>(affiliateData);
  const [subordinateOf, setSubordinateOf] = useState<User>();
  const [
    enabledCodeSubordinateOf,
    setEnabledCodeSubordinateOf,
  ] = useState<boolean>(
    affiliate.access_level !== ConfigValues.rebox.user.access_level.low,
  );
  const [alertCheckPartner, setAlertCheckPartner] = useState<number>(0);
  const [personType, setPersonType] = useState<string>(
    affiliate.cpf
      ? ConfigValues.rebox.user.person_type.physical_person
      : ConfigValues.rebox.user.person_type.legal_person,
  );

  const getPartner = useCallback(async () => {
    try {
      if (affiliate?.subordinate_of) {
        const { data: responsePartner } = await apiRebox.get(
          `/users/${affiliate?.subordinate_of}`,
        );
        setSubordinateOf(responsePartner.data);
      }
    } catch (error) {}
  }, [affiliate]);

  const handleUpdateAffiliate = useCallback(
    async (data: IFormAffiliate) => {
      try {
        setLoading(prevState => !prevState);
        formRef.current?.setErrors({});

        await schemaAffiliate.validate(data, {
          abortEarly: false,
        });

        const { data: responseUpdateAffiliate } = await apiRebox.put(
          `/users/${affiliate.id}`,
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
            role: affiliate.role,
            company_size: data.company_size ? data.company_size : null,
            access_level: data.access_level,
            subordinate_of: subordinateOf?.id || null,
            id_who_indicated: null,
            is_partner: affiliate.is_partner,
            accept_terms_of_use: affiliate.accept_terms_of_use,
            gateway_customers_id: affiliate.gateway_customers_id,
          },
        );

        const { header, data: affiliateUpdated } = responseUpdateAffiliate;

        setAffiliate(affiliateUpdated);

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
        } else if (error.response) {
          toastify(error.response.data.error, 'error');
        } else {
          toastify(
            'Houve um error ao tentar atualizar os dados deste afiliado.',
            'error',
          );
        }
      } finally {
        setLoading(prevState => !prevState);
      }
    },
    [affiliate, subordinateOf],
  );

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

  useEffect(() => {
    getPartner();
    // eslint-disable-next-line
  }, [affiliate]);

  return (
    <Container>
      <FormAffiliate
        ref={formRef}
        onSubmit={handleUpdateAffiliate}
        initialData={{
          ...affiliate,
          name: affiliate?.name ? affiliate.name.toUpperCase() : '',
          date_of_birth: affiliate?.date_of_birth
            ? formatDate.addMask(affiliate.date_of_birth)
            : '',
          cpf_cnpj: affiliate.cpf || affiliate.cnpj,
          code_subordinate_of: subordinateOf?.referral_code,
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
                Informe o nome do afiliado sem abreviações
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
                Informe o número do documento do afiliado
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
                Define o sexo de nascimento do afiliado
              </Paragraph>
              <InputSelect
                name="sex"
                options={ConfigLabel.rebox.others.user.sex}
                placeholder="Selecione"
                selectedDefault={affiliate.sex}
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
                Informe o endereço eletrônico de contato do afiliado
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
                Situação do afiliado
              </SubtitleSecondary>
              <Paragraph
                nameColor="black"
                textAlign="start"
                opacity={0.5}
                fontSize={13}
                style={{ marginBottom: '2vh' }}
              >
                Informa o status atual do afiliado
              </Paragraph>
              <InputSelect
                name="status"
                options={ConfigLabel.rebox.others.user.status}
                placeholder="Selecione"
                selectedDefault={affiliate.status}
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
                  affiliate?.company_size
                    ? affiliate.company_size
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
                selectedDefault={affiliate.access_level}
                tabIndex={9}
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
                Define de quem o afiliado está subordinado
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

          <ButtonMain
            type="submit"
            loading={loading}
            style={{ marginTop: '4vh', maxWidth: 250 }}
            tabIndex={12}
          >
            Salvar
          </ButtonMain>
        </Sections>
      </FormAffiliate>
    </Container>
  );
};

export default FormAffiliateEdit;
