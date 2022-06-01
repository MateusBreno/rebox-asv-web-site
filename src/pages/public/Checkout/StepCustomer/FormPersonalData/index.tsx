import React, { useCallback, useEffect, useRef, useState } from 'react';

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
  LinkMain,
} from '@components/index';
import {
  ConfigBase,
  ConfigLabel,
  ConfigRoutes,
  ConfigRules,
  ConfigStorage,
  ConfigStyles,
  ConfigValues,
} from '@config/index';
import Address from '@models/Address';
import User from '@models/User';
import {
  apiRebox,
  apiViaCep,
  newContractStorageService,
} from '@services/index';
import { getValidationErrors } from '@utils/errors';
import { formatCellphone, formatText } from '@utils/formatters';
import { hotToast, toastify } from '@utils/notifiers';
import { validatorEmail } from '@utils/validators';

import { schemaCustomer } from './schemaValidation';
import { IProps, IFormCustomer } from './typing';

import {
  Container,
  FormCustomer,
  Sections,
  SectionsGroup,
  SectionsItem,
  SectionsItemGroup,
  DividingLine,
} from './styles';

const FormPersonalData: React.FC<IProps> = ({ forNewSale }) => {
  const formRef = useRef<FormHandles>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [formAddressEnabled, setFormAddressEnabled] = useState<boolean>(false);
  const [whoIndicated, setWhoIndicated] = useState<User>();
  const [customer, setCustomer] = useState<User>();
  const [addressCustomer, setAddressCustomer] = useState<Address>();
  const [alertCheckIndicated, setAlertCheckIndicated] = useState<number>(0);
  const [alertCheckEmail, setAlertCheckEmail] = useState<number>(0);

  const getCustomerById = useCallback(async (id: string) => {
    try {
      const { data: responseCustomer } = await apiRebox.get(`/users/${id}`);
      const customerFound: User = responseCustomer.data;
      setCustomer(customerFound);

      const [fristAddress] = customerFound.adresses;
      setAddressCustomer(fristAddress);
      setFormAddressEnabled(true);

      formRef.current?.setData({
        cellphone: formatCellphone.addMask(customerFound.cellphone),
        zip_code: fristAddress.zip_code,
      });
    } catch (error: any) {}
  }, []);

  const handleGetAddressByZipcode = useCallback(async (cepText: string) => {
    try {
      if (cepText.length !== 8) {
        setFormAddressEnabled(false);
        return;
      }
      const { data: responseViaCep } = await apiViaCep.get(`/${cepText}/json/`);

      if (responseViaCep.logradouro) {
        setFormAddressEnabled(true);
        const currentData = formRef.current?.getData();

        formRef.current?.setData({
          ...currentData,
          state: responseViaCep.uf,
          city: responseViaCep.localidade,
          neighborhood: responseViaCep.bairro,
          street: responseViaCep.logradouro,
        });
      }
    } catch (error) {
      setFormAddressEnabled(false);
      toastify(
        'Não foi possível buscar seu endereço pelo cep. Por favor tente novamente.',
        'error',
      );
    }
  }, []);

  const handleGetCustomerByEmail = useCallback(async (email: string) => {
    const idHotToast = hotToast(`Verificando e-mail`, 'loading');
    try {
      // const { data: responseCustomer } = await apiRebox.get(
      //   `/users?email=${email}`,
      // );
      // const { header, data } = responseCustomer;

      // if (header.total > 0) {
      //   const users: User[] = data;
      //   const [firstUser] = users;

      //   if (firstUser.status !== ConfigValues.rebox.user.status.lead) {
      //     hotToast(idHotToast, 'dismiss');
      //     toastify(`Este e-mail já está sendo usado.`, 'error');
      //     setAlertCheckEmail(2);
      //     return;
      //   }
      // }

      // setAlertCheckEmail(1);

      // Resolvendo um bug provisório (Código comentado acima é o definitivo)
      const { admin, client, provider, partner, assistant } =
        ConfigValues.rebox.user.role;
      const { data: responseAdmin } = await apiRebox.get(
        `/users?role=${admin}&email=${email}`,
      );
      if (responseAdmin.header.total > 0) {
        hotToast(idHotToast, 'dismiss');
        toastify(`Este e-mail já está sendo usado.`, 'error');
        setAlertCheckEmail(2);
        return;
      }

      const { data: responseProvider } = await apiRebox.get(
        `/users?role=${provider}&email=${email}`,
      );
      if (responseProvider.header.total > 0) {
        hotToast(idHotToast, 'dismiss');
        toastify(`Este e-mail já está sendo usado.`, 'error');
        setAlertCheckEmail(2);
        return;
      }

      const { data: responsePartner } = await apiRebox.get(
        `/users?role=${partner}&email=${email}`,
      );

      if (responsePartner.header.total > 0) {
        hotToast(idHotToast, 'dismiss');
        toastify(`Este e-mail já está sendo usado.`, 'error');
        setAlertCheckEmail(2);
        return;
      }

      const { data: responseAssistant } = await apiRebox.get(
        `/users?role=${assistant}&email=${email}`,
      );

      if (responseAssistant.header.total > 0) {
        hotToast(idHotToast, 'dismiss');
        toastify(`Este e-mail já está sendo usado.`, 'error');
        setAlertCheckEmail(2);
        return;
      }

      const { data: responseCustomer } = await apiRebox.get(
        `/users?role=${client}&email=${email}`,
      );

      if (responseCustomer.header.total > 0) {
        const users: User[] = responseCustomer.data;
        const [firstUser] = users;

        if (firstUser.status !== ConfigValues.rebox.user.status.lead) {
          hotToast(idHotToast, 'dismiss');
          toastify(`Este e-mail já está sendo usado.`, 'error');
          setAlertCheckEmail(2);
          return;
        }
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
    const idHotToast = hotToast('Verificando...', 'loading');
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
      const idHotToast = hotToast(`Aguarde...`, 'loading');
      try {
        setLoading(prevState => !prevState);
        formRef.current?.setErrors({});

        await schemaCustomer.validate(data, {
          abortEarly: false,
        });

        const environment = sessionStorage.getItem(
          ConfigStorage.REBOX_USER_ENVIRONMENT,
        );

        const customerBody = {
          name: data.name.toLowerCase(),
          date_of_birth: null,
          person_type: null,
          cpf: null,
          cnpj: null,
          sex: null,
          email: data.email.toLowerCase(),
          cellphone: formatCellphone.removeMask(data.cellphone),
          telephone: null,
          status: ConfigValues.rebox.user.status.lead,
          role: ConfigValues.rebox.user.role.client,
          company_size: ConfigValues.rebox.user.company_size.undefined,
          access_level: ConfigValues.rebox.user.access_level.normal,
          subordinate_of: null,
          id_who_indicated: whoIndicated?.id || null,
          is_partner: true,
          accept_terms_of_use: true,
          environment,
        };

        let responseUser = null;

        if (customer?.id) {
          responseUser = await apiRebox.put(
            `/users/${customer?.id}`,
            customerBody,
          );
        } else {
          responseUser = await apiRebox.post(`/users`, customerBody);
        }

        const { header, data: customerSaved } = responseUser.data;
        const addressBody = {
          users_id: customerSaved.id,
          country: 'BR',
          state: data.state,
          city: data.city,
          neighborhood: data.neighborhood,
          zip_code: data.zip_code,
          street: data.street,
          number: data.number ? Number.parseInt(`${data.number}`, 10) : null,
          complement: data.complement || null,
        };

        if (addressCustomer?.id) {
          await apiRebox.put(
            `/users/address/${addressCustomer?.id}`,
            addressBody,
          );
        } else {
          await apiRebox.post('/users/address', addressBody);
        }

        // toastify(header.message, 'success');

        // Caso o cliente esteja sendo criado no momento da venda
        if (forNewSale) {
          newContractStorageService.updateCustomer({
            id: customerSaved.id,
            field_type:
              ConfigValues.rebox.default.outhers.checkout.stepCustomer
                .field_type.register,
            query: customerSaved.email,
          });
          forNewSale.advanceStep();
        }
      } catch (error: any) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);

          formRef.current?.setErrors(errors);

          const {
            name,
            email,
            cellphone,
            code_who_indicated,
            zip_code,
            state,
            city,
            neighborhood,
            street,
            number,
            complement,
          } = errors;

          if (name) toastify(name, 'error');
          if (email) toastify(email, 'error');
          if (cellphone) toastify(cellphone, 'error');
          if (complement) toastify(complement, 'error');
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
          toastify('Houve um error ao tentar processar seus dados.', 'error');
        }
      } finally {
        setLoading(prevState => !prevState);
        hotToast(idHotToast, 'dismiss');
      }
    },
    [customer, addressCustomer, whoIndicated, forNewSale],
  );

  useEffect(() => {
    const codeWhoIndicated = sessionStorage.getItem(
      ConfigStorage.REBOX_USER_CODE_WHO_INDICATED,
    );

    if (codeWhoIndicated) {
      formRef.current?.setData({ code_who_indicated: codeWhoIndicated });
      handleGetWhoIndicated(codeWhoIndicated);
    }
  }, []);

  useEffect(() => {
    const customerId = newContractStorageService.getCustomer().id;
    if (customerId) {
      getCustomerById(customerId);
    }
  }, []);

  return (
    <Container>
      <FormCustomer
        ref={formRef}
        onSubmit={handleRegisterCustomer}
        initialData={{
          name: customer?.name
            ? formatText.fullCapitalized(customer?.name)
            : '',
          email: customer?.email,
          state: addressCustomer?.state.toUpperCase(),
          city: addressCustomer?.city
            ? formatText.fullCapitalized(addressCustomer?.city)
            : '',
          neighborhood: addressCustomer?.neighborhood
            ? formatText.fullCapitalized(addressCustomer?.neighborhood)
            : '',
          street: addressCustomer?.street
            ? formatText.fullCapitalized(addressCustomer?.street)
            : '',
          number: addressCustomer?.number,
          complement: addressCustomer?.complement,
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
                opacity={0.7}
                fontSize={13}
                style={{ marginBottom: '2vh' }}
              >
                Informe seu nome sem abreviações
              </Paragraph>
              <InputText
                name="name"
                placeholder="Informe o nome"
                tabIndex={1}
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
                  tabIndex={2}
                  onChange={event => {
                    const email = event.target.value.toLowerCase();
                    event.target.value = email;
                    if (email === '') {
                      setAlertCheckEmail(0);
                    } else if (validatorEmail.check(email)) {
                      handleGetCustomerByEmail(email);
                    } else if (alertCheckEmail !== 2) setAlertCheckEmail(2);
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
          </SectionsGroup>

          <SectionsGroup>
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
                opacity={0.7}
                fontSize={13}
                style={{ marginBottom: '2vh' }}
              >
                Informe o celular e/ou whatsapp para contato
              </Paragraph>
              <InputMask
                name="cellphone"
                mask={'+55 (99) 99999-9999'}
                placeholder="Informe o celular"
                tabIndex={3}
              />
            </SectionsItem>

            {/* <SectionsItem>
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
                opacity={0.7}
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
            </SectionsItem> */}
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
                opacity={0.7}
                fontSize={13}
                style={{ marginBottom: '2vh' }}
              >
                Informe o código postal que localiza o endereço
              </Paragraph>
              <InputMask
                name="zip_code"
                placeholder="Informe o CEP"
                mask="99999-999"
                tabIndex={4}
                onChange={event => {
                  const cep = event.target.value;
                  handleGetAddressByZipcode(formatText.removeAllNonDigits(cep));
                }}
              />
              <LinkMain
                route={{
                  pathname: ConfigBase.correio.baseUrls.buscaCepInter,
                }}
                key="config"
                target="_blank"
                justifyContent="start"
              >
                <Paragraph style={{ marginTop: 10 }}>Não sei o cep</Paragraph>
              </LinkMain>
            </SectionsItem>

            <SectionsItem style={formAddressEnabled ? {} : { display: 'none' }}>
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
                opacity={0.7}
                fontSize={13}
                style={{ marginBottom: '2vh' }}
              >
                Informe a UF do estado brasileiro
              </Paragraph>
              <InputText
                name="state"
                placeholder="Informe o estado"
                // readOnly={!formIsEnabled}
                required
                tabIndex={5}
                onChange={event => {
                  event.target.value = event.target.value.toUpperCase();
                }}
              />
            </SectionsItem>
          </SectionsGroup>

          <SectionsGroup style={formAddressEnabled ? {} : { display: 'none' }}>
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
                opacity={0.7}
                fontSize={13}
                style={{ marginBottom: '2vh' }}
              >
                Informe o nome da cidade localizada no estado
              </Paragraph>
              <InputText
                name="city"
                placeholder="Informe a cidade"
                // readOnly={!formIsEnabled}
                required
                tabIndex={6}
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
                opacity={0.7}
                fontSize={13}
                style={{ marginBottom: '2vh' }}
              >
                Informe o nome do bairro localizado na cidade
              </Paragraph>
              <InputText
                name="neighborhood"
                placeholder="Informe o bairro"
                // readOnly={!formIsEnabled}
                required
                tabIndex={7}
                onChange={event => {
                  event.target.value = event.target.value.toUpperCase();
                }}
              />
            </SectionsItem>
          </SectionsGroup>
          <SectionsGroup style={formAddressEnabled ? {} : { display: 'none' }}>
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
                opacity={0.7}
                fontSize={13}
                style={{ marginBottom: '2vh' }}
              >
                Informe o nome completo da rua
              </Paragraph>
              <InputText
                name="street"
                placeholder="Informe a rua"
                // readOnly={!formIsEnabled}
                required
                tabIndex={8}
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
                opacity={0.7}
                fontSize={13}
                style={{ marginBottom: '2vh' }}
              >
                Informe o número da casa localizada na rua
              </Paragraph>
              <InputText name="number" placeholder="Número" tabIndex={9} />
            </SectionsItem>
          </SectionsGroup>

          <SectionsGroup style={formAddressEnabled ? {} : { display: 'none' }}>
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
                opacity={0.7}
                fontSize={13}
                style={{ marginBottom: '2vh' }}
              >
                Informações adicionais, como: Ponto de referência, casa 1 etc.
              </Paragraph>
              <InputText
                name="complement"
                placeholder="Complemento"
                tabIndex={10}
                onChange={event => {
                  event.target.value = formatText.capitalizedFirstLetter(
                    event.target.value,
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
                Indicado(a) por alguém?
              </SubtitleSecondary>
              <Paragraph
                nameColor="black"
                textAlign="start"
                opacity={0.7}
                fontSize={13}
                style={{ marginBottom: '2vh' }}
              >
                Informe o código de indicação do afiliado que o(a) indicou
              </Paragraph>
              <SectionsItemGroup>
                <InputText
                  name="code_who_indicated"
                  placeholder="Código de indicação"
                  tabIndex={11}
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
        </Sections>

        <LinkMain route={ConfigRoutes.rebox.publics.privacyPolicy.path}>
          <Paragraph textAlign="start" fontWeight={500}>
            Ao continuar você concorda com nossos <strong>termos de uso</strong>{' '}
            e <strong>políticas de privacidade</strong>.
          </Paragraph>
        </LinkMain>

        <ButtonMain
          type="submit"
          loading={loading}
          style={{ marginTop: '4vh', maxWidth: 250 }}
          tabIndex={12}
          disabled={alertCheckEmail === 2 || alertCheckIndicated === 2}
          isDisable={alertCheckEmail === 2 || alertCheckIndicated === 2}
        >
          Continuar
        </ButtonMain>
      </FormCustomer>
    </Container>
  );
};

export default FormPersonalData;
