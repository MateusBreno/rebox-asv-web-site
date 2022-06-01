// ./src/pages/privates/Called/List/index.tsx
import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from 'react';

import { FormHandles } from '@unform/core';
import { FiDownload, FiPaperclip } from 'react-icons/fi';
import {
  IoChevronBack,
  IoChevronForward,
  IoClose,
  IoDownloadOutline,
  IoArrowBack,
  IoOptions,
} from 'react-icons/io5';
import { useHistory } from 'react-router-dom';
import { setInterval } from 'timers';

import { AlarmTruckHornCalledOpen } from '@assets/sounds';
import {
  HeaderNavigationPrivate,
  MenuSideBarPrivate,
  SubtitleSecondary,
  InputText,
  InputMask,
  InputSelect,
  ButtonDefault,
  Paragraph,
  ButtonMain,
  InputCheckBox,
  ListCalled,
  ButtonOutline,
} from '@components/index';
import {
  ConfigStorage,
  ConfigRules,
  ConfigLabel,
  ConfigTransition,
  ConfigValues,
} from '@config/index';
import Called from '@models/Called';
import Service from '@models/Service';
import User from '@models/User';
import { apiRebox, apiIbge } from '@services/index';
import { formatDate, formatText } from '@utils/formatters';
import { generateDate } from '@utils/generators';
import { toastify } from '@utils/notifiers';

import {
  IResponseCalled,
  IFilterCalledFormData,
  ISearchCalledFormData,
  ISelect,
  IExportData,
} from './typing';

import {
  Container,
  ContainerGroup,
  Content,
  Options,
  FormSearch,
  OptionsGroup,
  FormPage,
  Pagination,
  PaginationGroup,
  PaginationGroupText,
  ModalFilter,
  FormFilter,
  FilterFieldGroup,
  FilterFieldSet,
  FilterFieldSetItems,
  FilterButtons,
  ModalExportData,
  Progress,
  ProgressBar,
  ProgressText,
  ButtonExportToExcel,
} from './styles';

const CalledList: React.FC = () => {
  const { goBack } = useHistory();
  const formSearchRef = useRef<FormHandles>(null);
  const formFilterRef = useRef<FormHandles>(null);
  const formPageRef = useRef<FormHandles>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [exporting, setExporting] = useState<boolean>(false);
  const [progressExportData, setProgressExportData] = useState<number>(0);
  const [calleds, setCalleds] = useState<IResponseCalled>();
  const [page, setPage] = useState<number>(
    Number.parseInt(
      sessionStorage.getItem(ConfigStorage.REBOX_PAGINATION_CALLED_LIST_PAGE) ||
        '1',
      10,
    ),
  );
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCalled, setTotalCalled] = useState<number>(
    Number.parseInt(
      sessionStorage.getItem(ConfigStorage.REBOX_CALLED_LIST_TOTAL) || '0',
      10,
    ),
  );
  const [search, setSearch] = useState<string>('');
  const [exportData, setExportData] = useState<IExportData[]>([]);
  const [filter, setFilter] = useState<IFilterCalledFormData>(
    JSON.parse(
      sessionStorage.getItem(ConfigStorage.REBOX_FILTERS_CALLED_LIST) || '{}',
    ),
  );
  const [filterIsActive, setFilterIsActive] = useState<boolean>(
    !!sessionStorage.getItem(ConfigStorage.REBOX_FILTERS_CALLED_LIST),
  );
  const [services, setServices] = useState<ISelect[]>([]);
  const [isDisabledFilter, setIsDisabledFilter] = useState<boolean>(true);
  const [isOpenModalFilter, setIsOpenModalFilter] = useState<boolean>(false);
  const [isOpenModalExportData, setIsOpenModalExportData] = useState<boolean>(
    false,
  );

  // Uso temporário - Correçào de bug
  const [tmpCalleds, setTmpCalleds] = useState<IResponseCalled>();
  const [tmpPage, setTmpPage] = useState<number>(
    Number.parseInt(
      sessionStorage.getItem(ConfigStorage.REBOX_PAGINATION_CALLED_LIST_PAGE) ||
        '1',
      10,
    ),
  );
  const [tmpTotalPages, setTmpTotalPages] = useState<number>(1);
  const [tmpTotalCalled, setTmpTotalCalled] = useState<number>(
    Number.parseInt(
      sessionStorage.getItem(ConfigStorage.REBOX_CALLED_LIST_TOTAL) || '0',
      10,
    ),
  );

  const song = useMemo(() => {
    return new Audio(AlarmTruckHornCalledOpen);
  }, []);

  const buildTheQueryUrl = (value: number): string => {
    let url = `/called?page=${value}&per_page=${ConfigRules.rebox.pagination.called.itemLimit}&details=all`;

    if (search) {
      // Busca por nome, email, cpf etc...
      url = `${url}&query=${search}`;
    } else {
      // Buscar pelo filtro de status, estado etc
      const {
        services_id,
        status,
        vehicle_situation,
        location_type,
        period_type,
        defined_period,
        period_start,
        period_end,
      } = filter;

      if (defined_period) {
        if (defined_period === 'OTHER') {
          url = `${url}&period_start=${period_start}&period_end=${period_end}`;
        } else {
          const [today] = generateDate.now().split(' ');
          if (defined_period === '0') {
            url = `${url}&period_start=${today} 00:00&period_end=${today} 23:59`;
          } else {
            const [before] = generateDate
              .beforeDays(Number.parseInt(defined_period, 10))
              .split(' ');
            url = `${url}&period_start=${before} 00:00&period_end=${today} 23:59`;
          }
        }
      }

      if (services_id) {
        url = `${url}&services_id=${services_id}`;
      }

      if (status) {
        url = `${url}&status=${status}`;
      }

      if (vehicle_situation) {
        url = `${url}&vehicle_situation=${vehicle_situation}`;
      }

      if (location_type) {
        url = `${url}&location_type=${location_type}`;
      }

      if (period_type) {
        url = `${url}&period_type=${period_type}`;
      }
    }
    return url;
  };

  const getServices = useCallback(async () => {
    try {
      const { data: response } = await apiRebox.get(`/services`);

      const responseServices: Service[] = response.data;
      const servicesUpdated: ISelect[] = [
        {
          label: 'Todos',
          value: 'UNDEFINED',
        },
      ];

      responseServices.forEach(element => {
        servicesUpdated.push({
          label: formatText.capitalizedFirstLetter(element.name),
          value: element.id,
        });
      });

      setServices(servicesUpdated);
    } catch (error) {
      toastify(`Houve um error ao buscar os serviços.`, 'error');
    }
  }, []);

  const getCalleds = async (desiredPage = 1) => {
    try {
      setLoading(prevState => !prevState);

      const builtUrl = buildTheQueryUrl(desiredPage);
      const { data: responseContracts } = await apiRebox.get(builtUrl);
      setCalleds(responseContracts);

      const { header }: IResponseCalled = responseContracts;
      setTotalCalled(header.total);
      setTotalPages(Math.ceil(header.total / header.per_page));
      formPageRef.current?.setData({ currentPage: desiredPage });
    } catch (error) {
      toastify('Ops! Houve um erro ao tentar buscar clientes.', 'error');
    } finally {
      setLoading(prevState => !prevState);
    }
  };

  const handleSearchCalleds = useCallback((data: ISearchCalledFormData) => {
    formFilterRef.current?.reset();
    setSearch(data.search.toLowerCase());
    setPage(1);
  }, []);

  const handleFilterCalleds = (data: IFilterCalledFormData) => {
    formSearchRef.current?.reset();
    const allDataFilter: IFilterCalledFormData = {
      services_id: data.services_id ? data.services_id : '',
      status: data.status ? data.status : '',
      vehicle_situation: data.vehicle_situation ? data.vehicle_situation : '',
      location_type: data.location_type ? data.location_type : '',
      period_type: data.period_type ? data.period_type : 'DATE_CREATED',
      defined_period:
        data.defined_period === 'UNDEFINED' ? '' : data.defined_period,
      period_start: data.period_start
        ? `${formatDate.removeMask(data.period_start)} 00:00`
        : '',
      period_end: data.period_end
        ? `${formatDate.removeMask(data.period_end)} 23:59`
        : '',
    };

    sessionStorage.setItem(
      ConfigStorage.REBOX_FILTERS_CALLED_LIST,
      JSON.stringify(allDataFilter),
    );
    setFilter(allDataFilter);
    setIsOpenModalFilter(prevState => !prevState);
    setPage(1);
    setFilterIsActive(true);
  };

  const handleExportData = useCallback(async () => {
    try {
      setExporting(prevState => !prevState);
      const calledsExportData: IExportData[] = [];
      let calledsReturns: Called[] = [];
      const arrayUrls: string[] = [];
      const numberPages = Math.ceil(
        totalPages ||
          ConfigRules.rebox.pagination.called.itemLimit /
            ConfigRules.rebox.pagination.called.itemLimit,
      );

      for (let i = 1; i <= numberPages; i++) {
        arrayUrls.push(buildTheQueryUrl(i));
      }

      // (page / totalPage) * 100 = x%
      const calc = (1 / arrayUrls.length) * 100;
      const percentage = Number.parseFloat(
        (Math.round((Math.floor(calc) * 1000) / 10) / 100).toFixed(1),
      );

      for await (const url of arrayUrls) {
        const { data: responseCalled } = await apiRebox.get(url);
        calledsReturns = [...calledsReturns, ...responseCalled.data];
        setProgressExportData(prevValue => {
          let valueDefined = prevValue;
          if (percentage === 0) {
            valueDefined += calc;
          } else {
            valueDefined += percentage;
          }
          const [units, decimals] = valueDefined.toFixed(1).split('.');
          return Number.parseFloat(
            decimals ? `${units}.${decimals.substring(0, 2)}` : units,
          );
        });
      }
      calledsReturns.forEach(item => {
        calledsExportData.push({
          called_code: item.code || '',
          called_date_created: formatDate.addMask(item.date_created),
          called_appointment_date: formatDate.addMask(
            item.appointment_date || item.date_created,
          ),
          services_name: item.service?.name || '',
          called_vehicle_situation:
            ConfigTransition.rebox_called_vehicle_situation[
              item.vehicle_situation
                ? item.vehicle_situation.toLowerCase()
                : 'undefined'
            ],
          called_location_type:
            ConfigTransition.rebox_called_location_type[
              item.location_type
                ? item.location_type?.toLowerCase()
                : 'undefined'
            ],
          called_status:
            ConfigTransition.rebox_called_status[
              item.status ? item.status.toLowerCase() : 'undefined'
            ],
          called_call_initiation_date: formatDate.addMask(
            item.call_initiation_date || '0000-00-00',
          ),
          called_service_start_date: formatDate.addMask(
            item.service_start_date || '0000-00-00',
          ),
          called_closing_date: formatDate.addMask(
            item.closing_date || '0000-00-00',
          ),
          vehicle_license_plate: item.vehicle
            ? item.vehicle.license_plate.toUpperCase()
            : '',
          vehicle_brand: item.vehicle ? item.vehicle.brand.toUpperCase() : '',
          vehicle_model: item.vehicle ? item.vehicle.model.toUpperCase() : '',
          called_source_address: item.source_address?.full_address
            ? item.source_address.full_address
            : '',
          called_destination_address: item.destination_address?.full_address
            ? item.destination_address.full_address
            : '',
          called_distance_between_points_in_km: `${
            item.distance_between_points_in_km || 0
          }`,
          customer_name: item.customer?.name || '',
          customer_cpf_or_cnpj: item.customer?.cpf || item.customer?.cnpj || '',
          customer_email: item.customer?.email || '',
          customer_cellphone: item.customer?.cellphone || '',
          provider_name: item.who_is_answering?.name || '',
          provider_cpf_or_cnpj:
            item.who_is_answering?.cpf || item.who_is_answering?.cnpj || '',
          provider_email: item.who_is_answering?.email || '',
          provider_cellphone: item.who_is_answering?.cellphone || '',
        });
      });
      setProgressExportData(100);
      setExportData(calledsExportData);
    } catch (error) {
      toastify('Sinto muito, não conseguimos exportar os dados.', 'error');
    } finally {
      setExporting(prevState => !prevState);
    }
  }, [totalPages]);

  const handleDownloadFile = useCallback(() => {
    setProgressExportData(0);
    setExportData([]);
    setIsOpenModalExportData(prevState => !prevState);
    toastify('Download do relatório de clientes foi iniciado!', 'success');
  }, []);

  const cleanFilter = useCallback(() => {
    formFilterRef.current?.reset();
    sessionStorage.removeItem(ConfigStorage.REBOX_FILTERS_CALLED_LIST);
    setFilter({} as IFilterCalledFormData);
    setFilterIsActive(false);
    setIsOpenModalFilter(prevState => !prevState);
  }, []);

  const handleGoBack = useCallback(() => {
    sessionStorage.removeItem(ConfigStorage.REBOX_PAGINATION_CALLED_LIST_PAGE);
    sessionStorage.removeItem(ConfigStorage.REBOX_FILTERS_CALLED_LIST);
    goBack();
  }, []);

  const handleRefreshList = useCallback(async () => {
    try {
      const { data: responseContracts } = await apiRebox.get(`/called`);
      setTmpCalleds(responseContracts);

      const { total, per_page } = responseContracts.header;
      setTmpTotalCalled(total);
      setTmpTotalPages(Math.ceil(total / per_page));
      // formPageRef.current?.setData({ currentPage: 1 });
    } catch (error) {
      console.error(`Refresh não realizado`);
    }
  }, [filter]);

  const handleSoundAlarm = useCallback(() => {
    if (calleds) {
      const { header, data } = calleds;
      let whistle = false;
      data.forEach(item => {
        if (item.status === ConfigValues.rebox.called.status.open)
          whistle = true;
      });

      if (whistle) {
        song.play();
        // song.loop = true;
        // song.playbackRate = 2;
        setTimeout(() => song.pause(), 4000);
      }
    }
  }, [calleds]);

  useEffect(() => {
    getCalleds(page);
    handleRefreshList();
    sessionStorage.setItem(
      ConfigStorage.REBOX_PAGINATION_CALLED_LIST_PAGE,
      `${page}`,
    );
  }, [page, search, filter]);

  useEffect(() => {
    getServices();
    setInterval(() => handleRefreshList(), 1000 * 15);
  }, []);

  useEffect(() => {
    if (totalCalled !== 0) {
      handleSoundAlarm();
      sessionStorage.setItem(
        ConfigStorage.REBOX_CALLED_LIST_TOTAL,
        `${totalCalled}`,
      );
    }
  }, [totalCalled]);

  return (
    <Container>
      <HeaderNavigationPrivate />
      <ContainerGroup>
        <MenuSideBarPrivate />
        <Content>
          <SubtitleSecondary textAlign="start">Acionamentos</SubtitleSecondary>
          <Options>
            <OptionsGroup>
              <ButtonDefault iconLeft={IoArrowBack} onClick={handleGoBack} />
              <ButtonOutline
                iconLeft={IoOptions}
                onClick={() => setIsOpenModalFilter(prevState => !prevState)}
              />

              {progressExportData === 100 || exporting ? (
                <ButtonOutline
                  iconLeft={FiDownload}
                  onClick={() =>
                    setIsOpenModalExportData(prevState => !prevState)
                  }
                >
                  {isOpenModalExportData ? '' : `${progressExportData}%`}
                </ButtonOutline>
              ) : (
                <ButtonOutline
                  iconLeft={FiPaperclip}
                  onClick={() =>
                    setIsOpenModalExportData(prevState => !prevState)
                  }
                />
              )}
            </OptionsGroup>
            <FormSearch ref={formSearchRef} onSubmit={handleSearchCalleds}>
              <InputText
                name="search"
                placeholder="Pesquisar..."
                title="Por nome, e-mail, CPF ou CNPJ do cliente e outros"
                showIconSearch={true}
                widthIconSearch={16}
                nameColorIconSearch={'gray'}
                opacityIconSearch={0.5}
                onChange={event => {
                  if (event.target.value === '') {
                    setSearch('');
                  }
                }}
              />
            </FormSearch>
          </Options>
          {filterIsActive ? (
            // Quando for implementar o tempo real no sistema, manter o código
            // da condicional true, logo abaixo
            <>
              <Pagination>
                <ButtonDefault
                  style={{
                    borderRadius: '8px 0 0 8px',
                    maxWidth: 100,
                  }}
                  disabled={page === 1}
                  isDisable={page === 1}
                  onClick={() => setPage(1)}
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
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                />
                <PaginationGroup>
                  <FormPage
                    ref={formPageRef}
                    onSubmit={() => console.log('')}
                    initialData={{ currentPage: page }}
                  >
                    <InputText
                      name="currentPage"
                      type="number"
                      min="1"
                      onChange={event => {
                        if (!(event.target.value === '')) {
                          setPage(Number.parseInt(event.target.value, 10));
                        }
                      }}
                    />
                  </FormPage>
                  <PaginationGroupText>de {totalPages}</PaginationGroupText>
                </PaginationGroup>

                <ButtonDefault
                  iconLeft={IoChevronForward}
                  style={{
                    borderRadius: '0',
                    maxWidth: 30,
                    padding: '0 5px',
                    margin: '0 5px',
                  }}
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                />
                <ButtonDefault
                  style={{
                    borderRadius: '0 8px 8px 0',
                    maxWidth: 100,
                  }}
                  disabled={page === totalPages}
                  isDisable={page === totalPages}
                  onClick={() => setPage(totalPages)}
                >
                  Última
                </ButtonDefault>
              </Pagination>
              <ListCalled
                calleds={calleds?.data}
                loading={loading}
                showTotal={true}
                totalValue={calleds?.header.total}
              />
              <Pagination>
                <ButtonDefault
                  style={{
                    borderRadius: '8px 0 0 8px',
                    maxWidth: 100,
                  }}
                  disabled={page === 1}
                  isDisable={page === 1}
                  onClick={() => setPage(1)}
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
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                />
                <PaginationGroup>
                  <FormPage
                    ref={formPageRef}
                    onSubmit={() => console.log('')}
                    initialData={{ currentPage: page }}
                  >
                    <InputText
                      name="currentPage"
                      type="number"
                      min="1"
                      onChange={event => {
                        if (!(event.target.value === '')) {
                          setPage(Number.parseInt(event.target.value, 10));
                        }
                      }}
                    />
                  </FormPage>
                  <PaginationGroupText>de {totalPages}</PaginationGroupText>
                </PaginationGroup>

                <ButtonDefault
                  iconLeft={IoChevronForward}
                  style={{
                    borderRadius: '0',
                    maxWidth: 30,
                    padding: '0 5px',
                    margin: '0 5px',
                  }}
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                />
                <ButtonDefault
                  style={{
                    borderRadius: '0 8px 8px 0',
                    maxWidth: 100,
                  }}
                  disabled={page === totalPages}
                  isDisable={page === totalPages}
                  onClick={() => setPage(totalPages)}
                >
                  Última
                </ButtonDefault>
              </Pagination>
            </>
          ) : (
            // Código abaixo implementado apenas para corrigir temporariamente um erro.
            // AO simular o tempo real com setInterval, gerou um bug ao filtrar
            // Essa condicional resolveu o problema temporariamente
            <>
              <Pagination>
                <ButtonDefault
                  style={{
                    borderRadius: '8px 0 0 8px',
                    maxWidth: 100,
                  }}
                  disabled={tmpPage === 1}
                  isDisable={tmpPage === 1}
                  onClick={() => setTmpPage(1)}
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
                  disabled={tmpPage === 1}
                  onClick={() => setTmpPage(tmpPage - 1)}
                />
                <PaginationGroup>
                  <FormPage
                    ref={formPageRef}
                    onSubmit={() => console.log('')}
                    initialData={{ currentPage: tmpPage }}
                  >
                    <InputText
                      name="currentPage"
                      type="number"
                      min="1"
                      onChange={event => {
                        if (!(event.target.value === '')) {
                          setTmpPage(Number.parseInt(event.target.value, 10));
                        }
                      }}
                    />
                  </FormPage>
                  <PaginationGroupText>de {tmpTotalPages}</PaginationGroupText>
                </PaginationGroup>

                <ButtonDefault
                  iconLeft={IoChevronForward}
                  style={{
                    borderRadius: '0',
                    maxWidth: 30,
                    padding: '0 5px',
                    margin: '0 5px',
                  }}
                  disabled={tmpPage === tmpTotalPages}
                  onClick={() => setTmpPage(tmpPage + 1)}
                />
                <ButtonDefault
                  style={{
                    borderRadius: '0 8px 8px 0',
                    maxWidth: 100,
                  }}
                  disabled={tmpPage === tmpTotalPages}
                  isDisable={tmpPage === tmpTotalPages}
                  onClick={() => setTmpPage(tmpTotalPages)}
                >
                  Última
                </ButtonDefault>
              </Pagination>
              <ListCalled
                calleds={tmpCalleds?.data}
                loading={loading}
                showTotal={true}
                totalValue={tmpCalleds?.header.total}
              />
              <Pagination>
                <ButtonDefault
                  style={{
                    borderRadius: '8px 0 0 8px',
                    maxWidth: 100,
                  }}
                  disabled={tmpPage === 1}
                  isDisable={tmpPage === 1}
                  onClick={() => setTmpPage(1)}
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
                  disabled={tmpPage === 1}
                  onClick={() => setTmpPage(tmpPage - 1)}
                />
                <PaginationGroup>
                  <FormPage
                    ref={formPageRef}
                    onSubmit={() => console.log('')}
                    initialData={{ currentPage: tmpPage }}
                  >
                    <InputText
                      name="currentPage"
                      type="number"
                      min="1"
                      onChange={event => {
                        if (!(event.target.value === '')) {
                          setTmpPage(Number.parseInt(event.target.value, 10));
                        }
                      }}
                    />
                  </FormPage>
                  <PaginationGroupText>de {tmpTotalPages}</PaginationGroupText>
                </PaginationGroup>

                <ButtonDefault
                  iconLeft={IoChevronForward}
                  style={{
                    borderRadius: '0',
                    maxWidth: 30,
                    padding: '0 5px',
                    margin: '0 5px',
                  }}
                  disabled={tmpPage === tmpTotalPages}
                  onClick={() => setTmpPage(page + 1)}
                />
                <ButtonDefault
                  style={{
                    borderRadius: '0 8px 8px 0',
                    maxWidth: 100,
                  }}
                  disabled={tmpPage === tmpTotalPages}
                  isDisable={tmpPage === tmpTotalPages}
                  onClick={() => setTmpPage(tmpTotalPages)}
                >
                  Última
                </ButtonDefault>
              </Pagination>
            </>
          )}
        </Content>
      </ContainerGroup>
      <ModalFilter
        isOpen={isOpenModalFilter}
        onRequestClose={() => setIsOpenModalFilter(prevState => !prevState)}
        contentLabel="FilterCustomer"
      >
        <ButtonDefault
          iconLeft={IoClose}
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            maxWidth: 50,
            padding: 0,
          }}
          onClick={() => setIsOpenModalFilter(prevState => !prevState)}
        />
        <FormFilter
          ref={formFilterRef}
          onSubmit={handleFilterCalleds}
          initialData={{
            ...filter,
            period_start: filter.period_start
              ? formatDate.addMask(filter.period_start.split(' ')[0])
              : '',
            period_end: filter.period_end
              ? formatDate.addMask(filter.period_end.split(' ')[0])
              : '',
          }}
        >
          <FilterFieldGroup>
            <FilterFieldSet>
              <Paragraph
                nameColor="black"
                textAlign="start"
                style={{ marginBottom: '1vh', fontWeight: 500 }}
              >
                Por serviço
              </Paragraph>
              <InputSelect
                name="services_id"
                placeholder="Selecione"
                tabIndex={1}
                options={services}
              />
            </FilterFieldSet>

            <FilterFieldSet>
              <Paragraph
                nameColor="black"
                textAlign="start"
                style={{ marginBottom: '1vh', fontWeight: 500 }}
              >
                Por status
              </Paragraph>
              <InputSelect
                name="status"
                placeholder="Selecione"
                tabIndex={1}
                options={ConfigLabel.rebox.filter.called.status}
              />
            </FilterFieldSet>
          </FilterFieldGroup>

          <FilterFieldGroup>
            <FilterFieldSet>
              <Paragraph
                nameColor="black"
                textAlign="start"
                style={{ marginBottom: '1vh', fontWeight: 500 }}
              >
                Por situação do veículo
              </Paragraph>
              <InputSelect
                name="vehicle_situation"
                placeholder="Selecione"
                tabIndex={1}
                options={ConfigLabel.rebox.filter.called.vehicleSituation}
              />
            </FilterFieldSet>

            <FilterFieldSet>
              <Paragraph
                nameColor="black"
                textAlign="start"
                style={{ marginBottom: '1vh', fontWeight: 500 }}
              >
                Por local da remoção
              </Paragraph>
              <InputSelect
                name="location_type"
                placeholder="Selecione"
                tabIndex={1}
                options={ConfigLabel.rebox.filter.called.locationType}
              />
            </FilterFieldSet>
          </FilterFieldGroup>

          <FilterFieldGroup>
            <FilterFieldSet>
              <Paragraph
                nameColor="black"
                textAlign="start"
                style={{ marginBottom: '1vh', fontWeight: 500 }}
              >
                Filtrar data por
              </Paragraph>
              <InputSelect
                name="period_type"
                placeholder="Selecione"
                tabIndex={1}
                options={ConfigLabel.rebox.filter.called.periodType}
                selectedDefault="DATE_CREATED"
              />
            </FilterFieldSet>

            <FilterFieldSet>
              <Paragraph
                nameColor="black"
                textAlign="start"
                style={{ marginBottom: '1vh', fontWeight: 500 }}
              >
                Por período
              </Paragraph>
              <InputSelect
                name="defined_period"
                placeholder="Selecione"
                tabIndex={1}
                options={ConfigLabel.rebox.filter.period.days}
                onChange={event => {
                  if (event.target.value === 'OTHER') {
                    setIsDisabledFilter(prevState => !prevState);
                  } else {
                    setIsDisabledFilter(true);
                  }
                }}
              />
            </FilterFieldSet>
          </FilterFieldGroup>

          <FilterFieldGroup>
            <FilterFieldSet>
              <Paragraph
                nameColor="black"
                textAlign="start"
                style={{ marginBottom: '1vh', fontWeight: 500 }}
              >
                Data inicial
              </Paragraph>
              <InputMask
                name="period_start"
                mask="99/99/9999"
                placeholder="Período inicial"
                isDisable={isDisabledFilter}
                disabled={isDisabledFilter}
              />
            </FilterFieldSet>

            <FilterFieldSet>
              <Paragraph
                nameColor="black"
                textAlign="start"
                style={{ marginBottom: '1vh', fontWeight: 500 }}
              >
                Data final
              </Paragraph>
              <InputMask
                name="period_end"
                mask="99/99/9999"
                placeholder="Período final"
                isDisable={isDisabledFilter}
                disabled={isDisabledFilter}
              />
            </FilterFieldSet>
          </FilterFieldGroup>

          <FilterButtons>
            <ButtonMain type="submit">Filtrar</ButtonMain>
            <ButtonDefault type="reset" onClick={cleanFilter}>
              Resetar
            </ButtonDefault>
          </FilterButtons>
        </FormFilter>
      </ModalFilter>
      <ModalExportData
        isOpen={isOpenModalExportData}
        onRequestClose={() => setIsOpenModalExportData(prevState => !prevState)}
        contentLabel="ExportData"
      >
        <ButtonDefault
          iconLeft={IoClose}
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            maxWidth: 50,
            padding: 0,
          }}
          onClick={() => setIsOpenModalExportData(prevState => !prevState)}
        />
        <Paragraph style={{ fontWeight: 600, marginBottom: '1.5vh' }}>
          Exportar resultado
        </Paragraph>
        <Paragraph nameColor="black" opacity={0.6}>
          Os registros retornados do filtro ou da pesquisa serão exportados para
          um arquivo excel.
        </Paragraph>
        <Progress percentage={progressExportData}>
          <ProgressText>{progressExportData}%</ProgressText>
          <ProgressBar className="active" />
          <ProgressBar />
        </Progress>
        {progressExportData < 100 && (
          <ButtonMain
            loading={exporting}
            style={{ maxWidth: 200, margin: '0 auto' }}
            onClick={() => handleExportData()}
          >
            Iniciar
          </ButtonMain>
        )}
        {progressExportData === 100 && (
          <ButtonExportToExcel
            headers={ConfigLabel.rebox.export.excel.called}
            data={exportData}
            filename={`acionamentos-${generateDate.now().split(' ')[0]}.xls`}
            onClick={handleDownloadFile}
          >
            <IoDownloadOutline size={18} />
            Baixar
          </ButtonExportToExcel>
        )}
      </ModalExportData>
    </Container>
  );
};

export default CalledList;
