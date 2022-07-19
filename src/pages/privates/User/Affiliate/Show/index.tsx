// ./src/pages/privates/User/Affiliate/Show/index.tsx
import React, {
  ChangeEvent,
  useState,
  useCallback,
  useEffect,
  useRef,
} from 'react';

import { FormHandles } from '@unform/core';
import { FaUserAlt, FaHandshake, FaHandHoldingUsd } from 'react-icons/fa';
import {
  IoArrowBack,
  IoChevronBack,
  IoChevronForward,
  IoReload,
  IoPower,
  IoCamera,
} from 'react-icons/io5';
// eslint-disable-next-line
import { useHistory, useParams } from 'react-router-dom';
// eslint-disable-next-line
import {
  ButtonDefault,
  FormAffiliateEdit,
  FormUserAddress,
  HeaderNavigationPrivate,
  MenuSideBarPrivate,
  Paragraph,
  SubtitleSecondary,
  InputText,
  LoadingForm,
  LoadingProfile,
  ModalUserCloseAccount,
  ButtonCopy,
  ListRescues,
  ListIndications,
  FormAffiliateSettings,
} from '@components/index';

// Importações internas
import { ConfigBase, ConfigRules, ConfigStyles } from '@config/index';
import Address from '@models/Address';
import User from '@models/User';
import { apiRebox } from '@services/index';
import { formatMoney, formatText } from '@utils/formatters';
import { toastify } from '@utils/notifiers';

import { IUrlParams, IResponseRescues, IResponseIndications } from './typing';

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

const AffiliateShow: React.FC = () => {
  const { goBack } = useHistory();
  const { id: affiliateId } = useParams<IUrlParams>();

  const formPageRescuesRef = useRef<FormHandles>(null);
  const formPageIndicationsRef = useRef<FormHandles>(null);

  const [loadingRescues, setLoadingRescues] = useState<boolean>(false);
  const [loadingIndications, setLoadingIndications] = useState<boolean>(false);
  const [loadingAffiliate, setLoadingAffiliate] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);

  const [tab, setTab] = useState<number>(1);
  const [subTab, setSubTab] = useState<number>(1);

  const [rescues, setRescues] = useState<IResponseRescues>();
  const [indications, setIndications] = useState<IResponseIndications>();
  const [affiliate, setAffiliate] = useState<User>({} as User);
  const [address, setAddress] = useState<Address>({} as Address);

  const [pageRescues, setPageRescues] = useState<number>(1);
  const [pageIndications, setPageIndications] = useState<number>(1);

  const [totalPagesRescues, setTotalPagesRescues] = useState<number>(1);
  const [totalPagesIndications, setTotalPagesIndications] = useState<number>(1);

  const [positionIndicatorTab, setPositionIndicatorTab] = useState<number>(0);
  const [enabledIndicatorTab, setEnabledIndicatorTab] = useState<boolean>(true);
  const [
    modalAffiliateRevertIsOpen,
    setModalAffiliateRevertIsOpen,
  ] = useState<boolean>(false);

  const changeModalAffiliateRevertIsOpen = () => {
    setModalAffiliateRevertIsOpen(prevState => !prevState);
  };

  const getIndications = async (desiredPage = 1) => {
    try {
      setLoadingIndications(prevState => !prevState);
      const { data: responseIndications } = await apiRebox.get(
        `/indications?page=${desiredPage}&per_page=${ConfigRules.rebox.pagination.indications.itemLimit}&details=all&id_who_indicated=${affiliateId}`,
      );
      setIndications(responseIndications);

      const { header }: IResponseIndications = responseIndications;
      setTotalPagesIndications(Math.ceil(header.total / header.per_page));
      formPageIndicationsRef.current?.setData({ currentPage: desiredPage });
    } catch (error) {
      toastify('Ops! Houve um erro ao tentar buscar as indicações.', 'error');
    } finally {
      setLoadingIndications(prevState => !prevState);
    }
  };

  const getRescues = async (desiredPage = 1) => {
    try {
      setLoadingRescues(prevState => !prevState);
      const { data: responseRescues } = await apiRebox.get(
        `/rescues?page=${desiredPage}&per_page=${ConfigRules.rebox.pagination.rescues.itemLimit}&details=all&users_id=${affiliateId}`,
      );
      setRescues(responseRescues);

      const { header }: IResponseRescues = responseRescues;
      setTotalPagesRescues(Math.ceil(header.total / header.per_page));
      formPageRescuesRef.current?.setData({ currentPage: desiredPage });
    } catch (error) {
      toastify('Ops! Houve um erro ao tentar buscar comissões.', 'error');
    } finally {
      setLoadingRescues(prevState => !prevState);
    }
  };

  const getAffiliate = useCallback(async () => {
    try {
      setLoadingAffiliate(prevState => !prevState);
      const { data: responseAffiliate } = await apiRebox.get(
        `/users/${affiliateId}?details=all`,
      );
      const affiliateFound: User = responseAffiliate.data;
      const [firstAddress] = affiliateFound.adresses;
      setAffiliate(affiliateFound);
      setAddress(firstAddress);
    } catch (error) {
      toastify(
        'Ops! Houve um erro ao tentar buscar as os dados do afiliado.',
        'error',
      );
    } finally {
      setLoadingAffiliate(prevState => !prevState);
    }
    // eslint-disable-next-line
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
            `/users/${affiliateId}/upload/avatar`,
            userData,
          );

          setAffiliate(responseAvatar.data);

          toastify(responseAvatar.header.message, 'success');
          // eslint-disable-next-line
        } catch (error: any) {
          toastify(error.response.data.error, 'error');
        }
      }
    },
    // eslint-disable-next-line
    [],
  );

  const handleGoBack = () => {
    goBack();
  };

  useEffect(() => {
    getAffiliate();
    // eslint-disable-next-line
  }, [refresh]);

  useEffect(() => {
    getIndications(pageIndications);
    // eslint-disable-next-line
  }, [refresh, pageIndications]);

  useEffect(() => {
    getRescues(pageRescues);
    // eslint-disable-next-line
  }, [refresh, pageRescues]);

  useEffect(() => {
    setSubTab(1);
    // eslint-disable-next-line
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
          <SubtitleSecondary textAlign="start">Afiliado</SubtitleSecondary>
          <Options>
            <OptionsGroup>
              <ButtonDefault iconLeft={IoArrowBack} onClick={handleGoBack} />
            </OptionsGroup>
            <OptionsGroup>
              <ButtonDefault
                className="btn-update"
                loading={loadingRescues && loadingAffiliate}
                iconLeft={IoReload}
                onClick={() => setRefresh(prevState => !prevState)}
              >
                Atualizar
              </ButtonDefault>

              <ButtonDefault
                iconLeft={IoPower}
                onClick={changeModalAffiliateRevertIsOpen}
              >
                Encerrar
              </ButtonDefault>
            </OptionsGroup>
          </Options>
          {loadingAffiliate ? (
            <LoadingProfile />
          ) : (
            <Details>
              <DetailsGroup>
                <Avatar>
                  <AvatarProfile>
                    {affiliate?.image_url ? (
                      <AvatarProfileGroup>
                        <AvatarProfileImage src={affiliate?.image_url} />
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
                    {affiliate.name
                      ? formatText.capitalizedFirstLetter(
                          affiliate.name.split(' ')[0],
                        )
                      : ''}
                  </Paragraph>
                  <Paragraph
                    nameColor="black"
                    fontSize={14}
                    textAlign="start"
                    style={{ margin: '6px 0 10px' }}
                  >
                    {affiliate.email}
                  </Paragraph>
                  <ButtonCopy
                    className="btn-copy-code"
                    textCopy={`${ConfigBase.rebox.externalLinks.shareProducts}${affiliate?.referral_code}`}
                    labelText={affiliate?.referral_code || ''}
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
                  {formatMoney.fromNumberToPrice(affiliate.balance || 0)}
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
                <FaHandshake size={20} />
                <Paragraph fontWeight={500}>Indicações</Paragraph>
              </TabLabelsButton>
              <TabLabelsButton isActive={tab === 3} onClick={() => setTab(3)}>
                <FaHandHoldingUsd size={18} />
                <Paragraph fontWeight={500}>Comissões</Paragraph>
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
                  {loadingAffiliate ? (
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
                          <FormAffiliateEdit affiliate={affiliate} />
                        )}
                        {subTab === 2 && (
                          <FormUserAddress
                            address={address}
                            usersId={affiliateId}
                          />
                        )}
                        {subTab === 3 && (
                          <FormAffiliateSettings userId={affiliate?.id || ''} />
                        )}
                      </SubTabItems>
                    </SubTabs>
                  )}
                </>
              )}
              {tab === 2 && (
                <TabItemsGroup>
                  <ListIndications
                    indications={indications?.data}
                    loading={loadingIndications}
                    showTotal={true}
                    totalValue={indications?.header.total}
                  />
                  <Pagination>
                    <ButtonDefault
                      style={{
                        borderRadius: '8px 0 0 8px',
                        maxWidth: 100,
                      }}
                      disabled={pageIndications === 1}
                      isDisable={pageIndications === 1}
                      onClick={() => setPageIndications(1)}
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
                      disabled={pageIndications === 1}
                      onClick={() => setPageIndications(pageIndications - 1)}
                    />
                    <PaginationGroup>
                      <FormPage
                        ref={formPageIndicationsRef}
                        onSubmit={() => console.log('')}
                        initialData={{ currentPage: pageIndications }}
                      >
                        <InputText
                          name="currentPage"
                          type="number"
                          min="1"
                          onChange={event => {
                            if (!(event.target.value === '')) {
                              setPageIndications(
                                Number.parseInt(event.target.value, 10),
                              );
                            }
                          }}
                        />
                      </FormPage>
                      <PaginationGroupText>
                        de {totalPagesIndications}
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
                      disabled={pageIndications === totalPagesIndications}
                      onClick={() => setPageIndications(pageIndications + 1)}
                    />
                    <ButtonDefault
                      style={{
                        borderRadius: '0 8px 8px 0',
                        maxWidth: 100,
                      }}
                      disabled={pageIndications === totalPagesIndications}
                      isDisable={pageIndications === totalPagesIndications}
                      onClick={() => setPageIndications(totalPagesIndications)}
                    >
                      Última
                    </ButtonDefault>
                  </Pagination>
                </TabItemsGroup>
              )}
              {tab === 3 && (
                <TabItemsGroup>
                  <ListRescues
                    rescues={rescues?.data}
                    loading={loadingRescues}
                    showTotal={true}
                    totalValue={rescues?.header.total}
                  />
                  <Pagination>
                    <ButtonDefault
                      style={{
                        borderRadius: '8px 0 0 8px',
                        maxWidth: 100,
                      }}
                      disabled={pageRescues === 1}
                      isDisable={pageRescues === 1}
                      onClick={() => setPageRescues(1)}
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
                      disabled={pageRescues === 1}
                      onClick={() => setPageRescues(pageRescues - 1)}
                    />
                    <PaginationGroup>
                      <FormPage
                        ref={formPageRescuesRef}
                        onSubmit={() => console.log('')}
                        initialData={{ currentPage: pageRescues }}
                      >
                        <InputText
                          name="currentPage"
                          type="number"
                          min="1"
                          onChange={event => {
                            if (!(event.target.value === '')) {
                              setPageRescues(
                                Number.parseInt(event.target.value, 10),
                              );
                            }
                          }}
                        />
                      </FormPage>
                      <PaginationGroupText>
                        de {totalPagesRescues}
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
                      disabled={pageRescues === totalPagesRescues}
                      onClick={() => setPageRescues(pageRescues + 1)}
                    />
                    <ButtonDefault
                      style={{
                        borderRadius: '0 8px 8px 0',
                        maxWidth: 100,
                      }}
                      disabled={pageRescues === totalPagesRescues}
                      isDisable={pageRescues === totalPagesRescues}
                      onClick={() => setPageRescues(totalPagesRescues)}
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
        userId={affiliateId}
        isOpen={modalAffiliateRevertIsOpen}
        change={changeModalAffiliateRevertIsOpen}
      />
    </Container>
  );
};

export default AffiliateShow;
