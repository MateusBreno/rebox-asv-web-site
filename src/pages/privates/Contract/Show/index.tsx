// ./src/pages/privates/Contract/Show/index.tsx
import React, { useState, useCallback, useEffect, useRef } from 'react';

import { FormHandles } from '@unform/core';
import { FaCarCrash } from 'react-icons/fa';
import { IoLogoUsd } from 'react-icons/io';
import {
  IoArrowBack,
  IoChevronBack,
  IoChevronForward,
  IoReload,
  IoBan,
  IoRepeatOutline,
  IoInformationCircleOutline,
  IoCarSport,
  IoCreate,
} from 'react-icons/io5';
import { useHistory, useParams } from 'react-router-dom';

import {
  ButtonDefault,
  FormContractEdit,
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
  ModalContractCancele,
  ModalContractRestore,
} from '@components/index';

// Importações internas
import { ConfigRules, ConfigValues } from '@config/index';
import Contract from '@models/Contract';
import Vehicle from '@models/Vehicle';
import { apiRebox } from '@services/index';
import { toastify } from '@utils/notifiers';

import { IUrlParams, IResponseCalled, IResponseCharges } from './typing';

import {
  Container,
  ContainerGroup,
  Content,
  Options,
  OptionsGroup,
  Tabs,
  TabLabels,
  TabLabelsButton,
  TabItems,
  TabItemsGroup,
  FormPage,
  Pagination,
  PaginationGroup,
  PaginationGroupText,
} from './styles';

const ContractShow: React.FC = () => {
  const { goBack } = useHistory();
  const { id: contractId } = useParams<IUrlParams>();

  const formPageCalledRef = useRef<FormHandles>(null);
  const formPageChargesRef = useRef<FormHandles>(null);

  const [loadingCalled, setLoadingCalled] = useState<boolean>(false);
  const [loadingCharges, setLoadingCharges] = useState<boolean>(false);
  const [loadingContract, setLoadingContract] = useState<boolean>(false);
  const [loadingCancel, setLoadingCancel] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [tab, setTab] = useState<number>(1);

  const [calleds, setCalleds] = useState<IResponseCalled>();
  const [charges, setCharges] = useState<IResponseCharges>();
  const [contract, setContract] = useState<Contract>();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  const [pageCalled, setPageCalled] = useState<number>(1);
  const [pageCharges, setPageCharges] = useState<number>(1);
  const [totalPagesCalled, setTotalPagesCalled] = useState<number>(1);
  const [totalPagesCharges, setTotalPagesCharges] = useState<number>(1);

  const [modalContractRevertIsOpen, setModalContractRevertIsOpen] =
    useState<boolean>(false);

  const changeModalContractRevertIsOpen = () => {
    setModalContractRevertIsOpen(prevState => !prevState);
  };

  const getCalleds = async (desiredPage = 1) => {
    try {
      setLoadingCalled(prevState => !prevState);
      let url = `/called?page=${desiredPage}&details=all`;
      url += `&per_page=${ConfigRules.rebox.pagination.called.itemLimit}`;
      url += `&contracts_id=${contractId}`;
      const { data: responseCalled } = await apiRebox.get(url);
      setCalleds(responseCalled);

      const { header }: IResponseCalled = responseCalled;
      setTotalPagesCalled(Math.ceil(header.total / header.per_page));
      formPageCalledRef.current?.setData({ currentPage: desiredPage });
    } catch (error) {
      toastify(
        'Ops! Houve um erro ao tentar buscar as chamados do contrato.',
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
      url += `&paying_item_with_id=${contractId}`;
      const { data: responseCharges } = await apiRebox.get(url);
      setCharges(responseCharges);

      const { header }: IResponseCharges = responseCharges;
      setTotalPagesCharges(Math.ceil(header.total / header.per_page));
      formPageChargesRef.current?.setData({ currentPage: desiredPage });
    } catch (error) {
      toastify(
        'Ops! Houve um erro ao tentar buscar cobranças do contrato.',
        'error',
      );
    } finally {
      setLoadingCharges(prevState => !prevState);
    }
  };

  const getContract = useCallback(async () => {
    try {
      setLoadingContract(prevState => !prevState);
      const { data: responseContract } = await apiRebox.get(
        `/contracts/${contractId}`,
      );
      const contractFound: Contract = responseContract.data;
      setContract(contractFound);

      contractFound.contracts_vehicles?.forEach(item => {
        setVehicles([{ ...item.vehicle }]);
      });
    } catch (error) {
      toastify(
        'Ops! Houve um erro ao tentar buscar as os dados do contrato.',
        'error',
      );
    } finally {
      setLoadingContract(prevState => !prevState);
    }
  }, []);

  const handleGoBack = () => {
    goBack();
  };

  useEffect(() => {
    getContract();
  }, [refresh]);

  useEffect(() => {
    getCalleds(pageCalled);
  }, [refresh, pageCalled]);

  useEffect(() => {
    getCharges(pageCharges);
  }, [refresh, pageCharges]);

  return (
    <Container>
      <HeaderNavigationPrivate />
      <ContainerGroup>
        <MenuSideBarPrivate />
        <Content>
          <SubtitleSecondary textAlign="start">Contrato</SubtitleSecondary>
          <Options>
            <OptionsGroup>
              <ButtonDefault iconLeft={IoArrowBack} onClick={handleGoBack} />
            </OptionsGroup>
            <OptionsGroup>
              <ButtonDefault
                className="btn-update"
                loading={loadingCalled && loadingCharges && loadingContract}
                iconLeft={IoReload}
                onClick={() => setRefresh(prevState => !prevState)}
              >
                Atualizar
              </ButtonDefault>
              {contract?.status ===
              ConfigValues.rebox.contract.status.canceled ? (
                <ButtonDefault
                  iconLeft={IoRepeatOutline}
                  onClick={changeModalContractRevertIsOpen}
                >
                  Restaurar
                </ButtonDefault>
              ) : (
                <>
                  {contract?.status !==
                    ConfigValues.rebox.contract.status.deleted && (
                    <ButtonDefault
                      iconLeft={IoBan}
                      onClick={changeModalContractRevertIsOpen}
                    >
                      Cancelar
                    </ButtonDefault>
                  )}
                </>
              )}
            </OptionsGroup>
          </Options>
          <Tabs>
            <TabLabels>
              <TabLabelsButton isActive={tab === 1} onClick={() => setTab(1)}>
                <IoCreate size={18} />
                <Paragraph style={{ fontWeight: 500 }}>Informações</Paragraph>
              </TabLabelsButton>
              <TabLabelsButton isActive={tab === 2} onClick={() => setTab(2)}>
                <IoCarSport size={22} />
                <Paragraph style={{ fontWeight: 500 }}>Veículos</Paragraph>
              </TabLabelsButton>
              <TabLabelsButton isActive={tab === 3} onClick={() => setTab(3)}>
                <IoLogoUsd size={20} />
                <Paragraph style={{ fontWeight: 500 }}>Cobranças</Paragraph>
              </TabLabelsButton>
              <TabLabelsButton isActive={tab === 4} onClick={() => setTab(4)}>
                <FaCarCrash size={20} />
                <Paragraph style={{ fontWeight: 500 }}>Chamados</Paragraph>
              </TabLabelsButton>
              {/* <TabLabelsButton isActive={tab === 3} onClick={() => setTab(3)}>
                <Paragraph style={{ fontWeight: 500 }}>Notificações</Paragraph>
              </TabLabelsButton> */}
            </TabLabels>
            <TabItems>
              {tab === 1 && (
                <>
                  {loadingContract ? (
                    <LoadingForm />
                  ) : (
                    <FormContractEdit contract={contract} />
                  )}
                </>
              )}
              {tab === 2 && (
                <ListVehicles
                  vehicles={vehicles}
                  loading={loadingContract}
                  showTotal={true}
                  totalValue={contract?.contracts_vehicles?.length}
                />
              )}
              {tab === 3 && (
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
              {tab === 4 && (
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
      {contract?.status === ConfigValues.rebox.contract.status.canceled ? (
        <ModalContractRestore
          contract_id={contractId}
          isOpen={modalContractRevertIsOpen}
          change={changeModalContractRevertIsOpen}
        />
      ) : (
        <ModalContractCancele
          contract_id={contractId}
          isOpen={modalContractRevertIsOpen}
          change={changeModalContractRevertIsOpen}
        />
      )}
    </Container>
  );
};

export default ContractShow;
