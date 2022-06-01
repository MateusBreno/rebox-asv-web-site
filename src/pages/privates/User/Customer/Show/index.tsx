// ./src/pages/privates/User/Customer/Show/index.tsx
import React, {
  ChangeEvent,
  useState,
  useCallback,
  useEffect,
  useRef,
} from 'react';

import { FormHandles } from '@unform/core';
import { FaUserAlt, FaCarCrash } from 'react-icons/fa';
import {
  IoArrowBack,
  IoChevronBack,
  IoChevronForward,
  IoReload,
  IoPower,
  IoCamera,
  IoCarSport,
  IoBagHandle,
  IoLogoUsd,
} from 'react-icons/io5';
import { useHistory, useParams } from 'react-router-dom';

import {
  ButtonDefault,
  FormCustomerEdit,
  FormUserAddress,
  HeaderNavigationPrivate,
  MenuSideBarPrivate,
  Paragraph,
  SubtitleSecondary,
  ListCharges,
  InputText,
  ListCalled,
  ListVehicles,
  LoadingForm,
  ButtonOutline,
  ListSalesContracts,
  LoadingProfile,
  ModalUserCloseAccount,
  ButtonCopy,
  FormCustomerSettings,
} from '@components/index';

// Importações internas
import {
  ConfigBase,
  ConfigRules,
  ConfigStyles,
  ConfigValues,
} from '@config/index';
import Address from '@models/Address';
import User from '@models/User';
import Vehicle from '@models/Vehicle';
import { apiRebox } from '@services/index';
import { formatMoney, formatText } from '@utils/formatters';
import { hotToast, toastify } from '@utils/notifiers';

import {
  IUrlParams,
  IResponseCalled,
  IResponseCharges,
  IResponseContracts,
} from './typing';

import {
  Container,
  ContainerGroup,
  Content,
  Options,
  OptionsGroup,
  Details,
  DetailsGroup,
  DetailsInformation,
  Avatar,
  AvatarProfile,
  AvatarProfileGroup,
  AvatarProfileImage,
  AvatarProfileLabel,
  AvatarProfileAttachment,
  AvatarInputAttachment,
  Balance,
  Tabs,
  TabLabels,
  TabLabelsButton,
  TabLabelsIndicator,
  TabItems,
  TabItemsGroup,
  SubTabs,
  SubTabLabels,
  SubTabLabelsDivisor,
  SubTabLabelsButton,
  SubTabItems,
  FormPage,
  Pagination,
  PaginationGroup,
  PaginationGroupText,
} from './styles';

const CustomerShow: React.FC = () => {
  const { goBack } = useHistory();
  const { id: customerId } = useParams<IUrlParams>();

  const formPageContractsRef = useRef<FormHandles>(null);
  const formPageCalledRef = useRef<FormHandles>(null);
  const formPageChargesRef = useRef<FormHandles>(null);

  const [loadingContracts, setLoadingContracts] = useState<boolean>(false);
  const [loadingCalled, setLoadingCalled] = useState<boolean>(false);
  const [loadingCharges, setLoadingCharges] = useState<boolean>(false);
  const [loadingCustomer, setLoadingCustomer] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);

  const [tab, setTab] = useState<number>(1);
  const [subTab, setSubTab] = useState<number>(1);

  const [contracts, setContracts] = useState<IResponseContracts>();
  const [calleds, setCalleds] = useState<IResponseCalled>();
  const [charges, setCharges] = useState<IResponseCharges>();
  const [customer, setCustomer] = useState<User>({} as User);
  const [address, setAddress] = useState<Address>({} as Address);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  const [pageContracts, setPageContracts] = useState<number>(1);
  const [pageCalled, setPageCalled] = useState<number>(1);
  const [pageCharges, setPageCharges] = useState<number>(1);
  const [totalPagesContracts, setTotalPagesContracts] = useState<number>(1);
  const [totalPagesCalled, setTotalPagesCalled] = useState<number>(1);
  const [totalPagesCharges, setTotalPagesCharges] = useState<number>(1);

  const [positionIndicatorTab, setPositionIndicatorTab] = useState<number>(0);
  const [enabledIndicatorTab, setEnabledIndicatorTab] = useState<boolean>(true);
  const [
    modalCustomerRevertIsOpen,
    setModalCustomerRevertIsOpen,
  ] = useState<boolean>(false);

  const changeModalCustomerRevertIsOpen = () => {
    setModalCustomerRevertIsOpen(prevState => !prevState);
  };

  const getContracts = async (desiredPage = 1) => {
    try {
      setLoadingContracts(prevState => !prevState);
      let url = `/contracts?page=${desiredPage}&details=all`;
      url += `&per_page=${ConfigRules.rebox.pagination.contracts.itemLimit}`;
      url += `&users_id=${customerId}`;
      const { data: responseContracts } = await apiRebox.get(url);
      setContracts(responseContracts);

      const { header }: IResponseContracts = responseContracts;
      setTotalPagesContracts(Math.ceil(header.total / header.per_page));
      formPageCalledRef.current?.setData({ currentPage: desiredPage });
    } catch (error) {
      toastify(
        'Ops! Houve um erro ao tentar buscar os contratos do cliente.',
        'error',
      );
    } finally {
      setLoadingContracts(prevState => !prevState);
    }
  };

  const getCalleds = async (desiredPage = 1) => {
    try {
      setLoadingCalled(prevState => !prevState);
      let url = `/called?page=${desiredPage}&details=all`;
      url += `&per_page=${ConfigRules.rebox.pagination.called.itemLimit}`;
      url += `&users_id=${customerId}`;
      const { data: responseCalled } = await apiRebox.get(url);
      setCalleds(responseCalled);

      const { header }: IResponseCalled = responseCalled;
      setTotalPagesCalled(Math.ceil(header.total / header.per_page));
      formPageCalledRef.current?.setData({ currentPage: desiredPage });
    } catch (error) {
      toastify(
        'Ops! Houve um erro ao tentar buscar os chamados do cliente.',
        'error',
      );
    } finally {
      setLoadingCalled(prevState => !prevState);
    }
  };

  const getCharges = async (desiredPage = 1) => {
    try {
      setLoadingCharges(prevState => !prevState);

      let url = `/payments?page=${desiredPage}&details=all`;
      url += `&per_page=${ConfigRules.rebox.pagination.charges.itemLimit}`;
      url += `&what_is_being_paid=${ConfigValues.rebox.payments.what_is_being_paid.contracts}`;
      url += `&query=${customer?.cpf || customer?.cnpj}`;
      const { data: responseCharges } = await apiRebox.get(url);
      setCharges(responseCharges);

      const { header }: IResponseCharges = responseCharges;
      setTotalPagesCharges(Math.ceil(header.total / header.per_page));
      formPageChargesRef.current?.setData({ currentPage: desiredPage });
    } catch (error) {
      toastify(
        'Ops! Houve um erro ao tentar buscar cobranças do cliente.',
        'error',
      );
    } finally {
      setLoadingCharges(prevState => !prevState);
    }
  };

  const getCustomer = useCallback(async () => {
    try {
      setLoadingCustomer(prevState => !prevState);
      const { data: responseCustomer } = await apiRebox.get(
        `/users/${customerId}?details=all`,
      );
      const customerFound: User = responseCustomer.data;
      const [firstAddress] = customerFound.adresses;
      setCustomer(customerFound);
      setVehicles(customerFound.vehicles);
      setAddress(firstAddress);
    } catch (error) {
      toastify(
        'Ops! Houve um erro ao tentar buscar as os dados do cliente.',
        'error',
      );
    } finally {
      setLoadingCustomer(prevState => !prevState);
    }
  }, []);

  const handleAvatarChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      // Ver a imagem que foi selecionada
      if (e.target.files) {
        const userData = new FormData();

        // O name do campo input, e pegar o valor da imagem selecionada.
        userData.append('attachment_profile', e.target.files[0]);

        try {
          const { data: responseAvatar } = await apiRebox.post(
            `/users/${customerId}/upload/avatar`,
            userData,
          );

          setCustomer(responseAvatar.data);

          toastify(responseAvatar.header.message, 'success');
        } catch (error: any) {
          toastify(error.response.data.error, 'error');
        }
      }
    },
    [],
  );

  const handleGoBack = () => {
    goBack();
  };

  useEffect(() => {
    getCustomer();
  }, [refresh]);

  useEffect(() => {
    getCalleds(pageCalled);
  }, [refresh, pageCalled]);

  useEffect(() => {
    getCharges(pageCharges);
  }, [refresh, pageCharges, customer]);

  useEffect(() => {
    getContracts(pageContracts);
  }, [refresh, pageContracts]);

  useEffect(() => {
    setSubTab(1);
  }, [tab]);

  useEffect(() => {
    const controlIndicatorTab = setInterval(() => {
      setPositionIndicatorTab(value => {
        return value === 3 ? 0 : value + 1;
      });
    }, 200);

    setTimeout(() => {
      setEnabledIndicatorTab(false);
      clearInterval(controlIndicatorTab);
    }, 5000);
  }, []);

  return (
    <Container>
      <HeaderNavigationPrivate />
      <ContainerGroup>
        <MenuSideBarPrivate />
        <Content>
          <SubtitleSecondary textAlign="start">Cliente</SubtitleSecondary>
          <Options>
            <OptionsGroup>
              <ButtonDefault iconLeft={IoArrowBack} onClick={handleGoBack} />
            </OptionsGroup>
            <OptionsGroup>
              <ButtonDefault
                className="btn-update"
                loading={loadingCalled && loadingCharges && loadingCustomer}
                iconLeft={IoReload}
                onClick={() => setRefresh(prevState => !prevState)}
              >
                Atualizar
              </ButtonDefault>

              <ButtonDefault
                iconLeft={IoPower}
                onClick={changeModalCustomerRevertIsOpen}
              >
                Encerrar
              </ButtonDefault>
            </OptionsGroup>
          </Options>
          {loadingCustomer ? (
            <LoadingProfile />
          ) : (
            <Details>
              <DetailsGroup>
                <Avatar>
                  <AvatarProfile>
                    {customer?.image_url ? (
                      <AvatarProfileGroup>
                        <AvatarProfileImage src={customer?.image_url} />
                        <AvatarProfileLabel htmlFor="avatar">
                          <IoCamera size={24} />
                          <AvatarInputAttachment
                            type="file"
                            name="attachment_profile"
                            id="avatar"
                            onChange={handleAvatarChange}
                          />
                        </AvatarProfileLabel>
                      </AvatarProfileGroup>
                    ) : (
                      <AvatarProfileAttachment htmlFor="avatar">
                        <IoCamera size={30} opacity={0.3} />
                        <Paragraph
                          nameColor="black"
                          fontSize={10}
                          opacity={0.7}
                        >
                          Clique aqui para alterar
                        </Paragraph>
                        <AvatarInputAttachment
                          type="file"
                          name="attachment_profile"
                          id="avatar"
                          onChange={handleAvatarChange}
                        />
                      </AvatarProfileAttachment>
                    )}
                  </AvatarProfile>
                </Avatar>
                <DetailsInformation>
                  <Paragraph
                    nameColor="black"
                    fontSize={16}
                    textAlign="start"
                    style={{ fontWeight: 600 }}
                  >
                    {customer.name
                      ? formatText.capitalizedFirstLetter(
                          customer.name.split(' ')[0],
                        )
                      : ''}
                  </Paragraph>
                  <Paragraph
                    nameColor="black"
                    fontSize={14}
                    textAlign="start"
                    style={{ margin: '6px 0 10px' }}
                  >
                    {customer.email}
                  </Paragraph>
                  <ButtonCopy
                    className="btn-copy-code"
                    textCopy={`${ConfigBase.rebox.externalLinks.shareProducts}${customer?.referral_code}`}
                    labelText={customer?.referral_code || ''}
                  />
                </DetailsInformation>
              </DetailsGroup>
              <Balance>
                <Paragraph
                  nameColor="black"
                  textAlign="end"
                  fontSize={13}
                  style={{ marginBottom: '5px' }}
                >
                  Saldo atual
                </Paragraph>
                <Paragraph
                  textAlign="end"
                  fontSize={16}
                  style={{
                    color: ConfigStyles.rebox.colors.greenEmerald.main,
                    fontWeight: 600,
                  }}
                >
                  {formatMoney.fromNumberToPrice(customer.balance || 0)}
                </Paragraph>
              </Balance>
            </Details>
          )}
          <Tabs>
            <TabLabels>
              <TabLabelsButton isActive={tab === 1} onClick={() => setTab(1)}>
                <FaUserAlt size={13} />
                <Paragraph fontWeight={500}>Informações</Paragraph>
              </TabLabelsButton>
              <TabLabelsButton isActive={tab === 2} onClick={() => setTab(2)}>
                <IoCarSport size={20} />
                <Paragraph fontWeight={500}>Veículos</Paragraph>
              </TabLabelsButton>
              <TabLabelsButton isActive={tab === 3} onClick={() => setTab(3)}>
                <IoBagHandle size={18} />
                <Paragraph fontWeight={500}>Contratos</Paragraph>
              </TabLabelsButton>
              <TabLabelsButton isActive={tab === 4} onClick={() => setTab(4)}>
                <IoLogoUsd size={20} />
                <Paragraph fontWeight={500}>Cobranças</Paragraph>
              </TabLabelsButton>
              <TabLabelsButton isActive={tab === 5} onClick={() => setTab(5)}>
                <FaCarCrash size={20} />
                <Paragraph fontWeight={500}>Chamados</Paragraph>
              </TabLabelsButton>
              <TabLabelsIndicator
                countAnimated={positionIndicatorTab}
                enable={enabledIndicatorTab}
              >
                <IoChevronForward
                  size={16}
                  color={ConfigStyles.rebox.colors.black.main}
                  opacity={1}
                />
              </TabLabelsIndicator>
            </TabLabels>
            <TabItems>
              {tab === 1 && (
                <>
                  {loadingCustomer ? (
                    <LoadingForm />
                  ) : (
                    <SubTabs>
                      <SubTabLabels>
                        <SubTabLabelsButton
                          isActive={subTab === 1}
                          onClick={() => setSubTab(1)}
                        >
                          <Paragraph>Informações</Paragraph>
                        </SubTabLabelsButton>
                        <SubTabLabelsDivisor />
                        <SubTabLabelsButton
                          isActive={subTab === 2}
                          onClick={() => setSubTab(2)}
                        >
                          <Paragraph>Endereço</Paragraph>
                        </SubTabLabelsButton>
                        <SubTabLabelsDivisor />
                        <SubTabLabelsButton
                          isActive={subTab === 3}
                          onClick={() => setSubTab(3)}
                        >
                          <Paragraph>Configurações</Paragraph>
                        </SubTabLabelsButton>
                      </SubTabLabels>
                      <SubTabItems>
                        {subTab === 1 && (
                          <FormCustomerEdit customer={customer} />
                        )}
                        {subTab === 2 && (
                          <FormUserAddress
                            address={address}
                            usersId={customerId}
                          />
                        )}
                        {subTab === 3 && (
                          <FormCustomerSettings userId={customer?.id || ''} />
                        )}
                      </SubTabItems>
                    </SubTabs>
                  )}
                </>
              )}
              {tab === 2 && (
                <ListVehicles
                  vehicles={vehicles}
                  loading={loadingCustomer}
                  showTotal={true}
                  totalValue={customer?.vehicles?.length}
                />
              )}
              {tab === 3 && (
                <TabItemsGroup>
                  <ListSalesContracts
                    contracts={contracts?.data}
                    loading={loadingContracts}
                    showTotal={true}
                    totalValue={contracts?.header.total}
                  />
                  <Pagination>
                    <ButtonDefault
                      style={{
                        borderRadius: '8px 0 0 8px',
                        maxWidth: 100,
                      }}
                      disabled={pageContracts === 1}
                      isDisable={pageContracts === 1}
                      onClick={() => setPageContracts(1)}
                    >
                      Primeira
                    </ButtonDefault>
                    <ButtonDefault
                      iconLeft={IoChevronBack}
                      style={{
                        borderRadius: '0',
                        maxWidth: 30,
                        padding: '0 5px',
                        margin: '0 5px',
                      }}
                      disabled={pageContracts === 1}
                      onClick={() => setPageContracts(pageContracts - 1)}
                    />
                    <PaginationGroup>
                      <FormPage
                        ref={formPageContractsRef}
                        onSubmit={() => console.log('')}
                        initialData={{ currentPage: pageContracts }}
                      >
                        <InputText
                          name="currentPage"
                          type="number"
                          min="1"
                          onChange={event => {
                            if (!(event.target.value === '')) {
                              setPageContracts(
                                Number.parseInt(event.target.value, 10),
                              );
                            }
                          }}
                        />
                      </FormPage>
                      <PaginationGroupText>
                        de {totalPagesContracts}
                      </PaginationGroupText>
                    </PaginationGroup>

                    <ButtonDefault
                      iconLeft={IoChevronForward}
                      style={{
                        borderRadius: '0',
                        maxWidth: 30,
                        padding: '0 5px',
                        margin: '0 5px',
                      }}
                      disabled={pageContracts === totalPagesContracts}
                      onClick={() => setPageContracts(pageContracts + 1)}
                    />
                    <ButtonDefault
                      style={{
                        borderRadius: '0 8px 8px 0',
                        maxWidth: 100,
                      }}
                      disabled={pageContracts === totalPagesContracts}
                      isDisable={pageContracts === totalPagesContracts}
                      onClick={() => setPageContracts(totalPagesContracts)}
                    >
                      Última
                    </ButtonDefault>
                  </Pagination>
                </TabItemsGroup>
              )}
              {tab === 4 && (
                <TabItemsGroup>
                  <ListCharges
                    charges={charges?.data}
                    loading={loadingCharges}
                    showTotal={true}
                    totalValue={charges?.header.total}
                  />
                  <Pagination>
                    <ButtonDefault
                      style={{
                        borderRadius: '8px 0 0 8px',
                        maxWidth: 100,
                      }}
                      disabled={pageCharges === 1}
                      isDisable={pageCharges === 1}
                      onClick={() => setPageCharges(1)}
                    >
                      Primeira
                    </ButtonDefault>
                    <ButtonDefault
                      iconLeft={IoChevronBack}
                      style={{
                        borderRadius: '0',
                        maxWidth: 30,
                        padding: '0 5px',
                        margin: '0 5px',
                      }}
                      disabled={pageCharges === 1}
                      onClick={() => setPageCharges(pageCharges - 1)}
                    />
                    <PaginationGroup>
                      <FormPage
                        ref={formPageChargesRef}
                        onSubmit={() => console.log('')}
                        initialData={{ currentPage: pageCharges }}
                      >
                        <InputText
                          name="currentPage"
                          type="number"
                          min="1"
                          onChange={event => {
                            if (!(event.target.value === '')) {
                              setPageCharges(
                                Number.parseInt(event.target.value, 10),
                              );
                            }
                          }}
                        />
                      </FormPage>
                      <PaginationGroupText>
                        de {totalPagesCharges}
                      </PaginationGroupText>
                    </PaginationGroup>

                    <ButtonDefault
                      iconLeft={IoChevronForward}
                      style={{
                        borderRadius: '0',
                        maxWidth: 30,
                        padding: '0 5px',
                        margin: '0 5px',
                      }}
                      disabled={pageCharges === totalPagesCharges}
                      onClick={() => setPageCharges(pageCharges + 1)}
                    />
                    <ButtonDefault
                      style={{
                        borderRadius: '0 8px 8px 0',
                        maxWidth: 100,
                      }}
                      disabled={pageCharges === totalPagesCharges}
                      isDisable={pageCharges === totalPagesCharges}
                      onClick={() => setPageCharges(totalPagesCharges)}
                    >
                      Última
                    </ButtonDefault>
                  </Pagination>
                </TabItemsGroup>
              )}
              {tab === 5 && (
                <TabItemsGroup>
                  <ListCalled
                    calleds={calleds?.data}
                    loading={loadingCalled}
                    showTotal={true}
                    totalValue={calleds?.header.total}
                  />
                  <Pagination>
                    <ButtonDefault
                      style={{
                        borderRadius: '8px 0 0 8px',
                        maxWidth: 100,
                      }}
                      disabled={pageCalled === 1}
                      isDisable={pageCalled === 1}
                      onClick={() => setPageCalled(1)}
                    >
                      Primeira
                    </ButtonDefault>
                    <ButtonDefault
                      iconLeft={IoChevronBack}
                      style={{
                        borderRadius: '0',
                        maxWidth: 30,
                        padding: '0 5px',
                        margin: '0 5px',
                      }}
                      disabled={pageCalled === 1}
                      onClick={() => setPageCalled(pageCalled - 1)}
                    />
                    <PaginationGroup>
                      <FormPage
                        ref={formPageCalledRef}
                        onSubmit={() => console.log('')}
                        initialData={{ currentPage: pageCalled }}
                      >
                        <InputText
                          name="currentPage"
                          type="number"
                          min="1"
                          onChange={event => {
                            if (!(event.target.value === '')) {
                              setPageCalled(
                                Number.parseInt(event.target.value, 10),
                              );
                            }
                          }}
                        />
                      </FormPage>
                      <PaginationGroupText>
                        de {totalPagesCalled}
                      </PaginationGroupText>
                    </PaginationGroup>

                    <ButtonDefault
                      iconLeft={IoChevronForward}
                      style={{
                        borderRadius: '0',
                        maxWidth: 30,
                        padding: '0 5px',
                        margin: '0 5px',
                      }}
                      disabled={pageCalled === totalPagesCalled}
                      onClick={() => setPageCalled(pageCalled + 1)}
                    />
                    <ButtonDefault
                      style={{
                        borderRadius: '0 8px 8px 0',
                        maxWidth: 100,
                      }}
                      disabled={pageCalled === totalPagesCalled}
                      isDisable={pageCalled === totalPagesCalled}
                      onClick={() => setPageCalled(totalPagesCalled)}
                    >
                      Última
                    </ButtonDefault>
                  </Pagination>
                </TabItemsGroup>
              )}
            </TabItems>
          </Tabs>
        </Content>
      </ContainerGroup>
      <ModalUserCloseAccount
        userId={customerId}
        isOpen={modalCustomerRevertIsOpen}
        change={changeModalCustomerRevertIsOpen}
      />
    </Container>
  );
};

export default CustomerShow;
