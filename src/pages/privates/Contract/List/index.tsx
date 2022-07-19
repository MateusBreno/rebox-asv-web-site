// ./src/pages/privates/Contract/List/index.tsx
import React, { useEffect, useState, useRef, useCallback } from 'react';

import { FormHandles } from '@unform/core';
import { FiDownload, FiPaperclip } from 'react-icons/fi';
import {
  IoOptions,
  IoChevronBack,
  IoChevronForward,
  IoClose,
  IoDownloadOutline,
  IoArrowBack,
} from 'react-icons/io5';
import { useHistory } from 'react-router-dom';

import {
  HeaderNavigationPrivate,
  MenuSideBarPrivate,
  SubtitleSecondary,
  ListSalesContracts,
  InputText,
  InputMask,
  InputSelect,
  ButtonOutline,
  ButtonDefault,
  Paragraph,
  ButtonMain,
  InputCheckBox,
} from '@components/index';
import {
  ConfigStorage,
  ConfigRules,
  ConfigLabel,
  ConfigTransition,
  ConfigValues,
} from '@config/index';
import Contract from '@models/Contract';
import Product from '@models/Product';
import { apiRebox, apiIbge } from '@services/index';
import { formatDate } from '@utils/formatters';
import { generateDate, generateNumber } from '@utils/generators';
import { toastify } from '@utils/notifiers';

import {
  IResponseContracts,
  IFilterContractsFormData,
  IFilterCurrentPaymentsStatus,
  ISearchContractsFormData,
  ISelect,
  IIbgeStates,
  IIbgeCities,
  IExportData,
} from './typing';

import {
  Container,
  ContainerGroup,
  Content,
  Options,
  OptionsGroup,
  FormSearch,
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

const ContractList: React.FC = () => {
  const { goBack } = useHistory();
  const formSearchRef = useRef<FormHandles>(null);
  const formFilterRef = useRef<FormHandles>(null);
  const formPageRef = useRef<FormHandles>(null);
  const formPageSecondaryRef = useRef<FormHandles>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [exporting, setExporting] = useState<boolean>(false);
  const [progressExportData, setProgressExportData] = useState<number>(0);
  const [contracts, setContracts] = useState<IResponseContracts>();
  const [page, setPage] = useState<number>(
    Number.parseInt(
      sessionStorage.getItem(
        ConfigStorage.REBOX_PAGINATION_CONTRACTS_LIST_PAGE,
      ) || '1',
      10,
    ),
  );
  const [totalPages, setTotalPages] = useState<number>(1);
  const [search, setSearch] = useState<string>('');
  const [exportData, setExportData] = useState<IExportData[]>([]);
  const [filter, setFilter] = useState<IFilterContractsFormData>(
    JSON.parse(
      sessionStorage.getItem(ConfigStorage.REBOX_FILTERS_CONTRACTS_LIST) ||
        '{}',
    ),
  );
  const [
    filterCurrentPaymentsStatus,
    setFilterCurrentPaymentsStatus,
  ] = useState<IFilterCurrentPaymentsStatus>({
    waiting: false,
    in_day: false,
    overdue: false,
    stop: false,
  });
  const [states, setStates] = useState<ISelect[]>([]);
  const [cities, setCities] = useState<ISelect[]>([]);
  const [products, setProducts] = useState<ISelect[]>([]);
  const [isDisabledFilter, setIsDisabledFilter] = useState<boolean>(true);
  const [isOpenModalFilter, setIsOpenModalFilter] = useState<boolean>(false);
  const [isOpenModalExportData, setIsOpenModalExportData] = useState<boolean>(
    false,
  );

  const buildTheQueryUrl = (value: number): string => {
    let url = `/contracts?page=${value}&per_page=${ConfigRules.rebox.pagination.contracts.itemLimit}&details=all`;

    if (search) {
      // Busca por nome, email, cpf etc...
      url = `${url}&query=${search}`;
    } else {
      // Buscar pelo filtro de status, estado etc
      const {
        current_payments_status,
        products_id,
        state,
        city,
        defined_period,
        period_end,
        period_start,
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

      if (current_payments_status) {
        url = `${url}&current_payments_status=${current_payments_status}`;
      }

      if (state && city) {
        url = `${url}&state=${state.toLowerCase()}&city=${city.toLowerCase()}`;
      } else if (state) {
        url = `${url}&state=${state.toLowerCase()}`;
      }

      if (products_id) {
        url = `${url}&products_id=${products_id}`;
      }
    }
    return url;
  };

  const getStates = useCallback(async () => {
    try {
      const { data: response } = await apiIbge.get(
        `/localidades/estados?orderBy=nome`,
      );

      const ibgeStates: IIbgeStates[] = response;
      const statesUpdated: ISelect[] = [
        {
          label: 'Todos',
          value: 'UNDEFINED',
        },
      ];

      ibgeStates.forEach(element => {
        statesUpdated.push({
          label: element.sigla,
          value: element.sigla,
        });
      });

      setStates(statesUpdated);
    } catch (error) {
      toastify(`Houve um error ao buscar os estados.`, 'error');
    }
  }, []);

  const getCity = useCallback(async (uf: string) => {
    try {
      const { data: response } = await apiIbge.get(
        `localidades/estados/${uf}/municipios`,
      );

      const ibgeCities: IIbgeCities[] = response;
      const citiesUpdated: ISelect[] = [
        {
          label: 'Todos',
          value: 'UNDEFINED',
        },
      ];

      ibgeCities.forEach(element => {
        citiesUpdated.push({
          label: element.nome,
          value: element.nome.toLowerCase(),
        });
      });

      setCities(citiesUpdated);
    } catch (error) {
      toastify(`Houve um error ao buscar os municípios de ${uf}`, 'error');
    }
  }, []);

  const getProducts = useCallback(async () => {
    try {
      const { data: response } = await apiRebox.get(`/products?per_page=20`);
      const products_found: Product[] = response.data;
      const productsUpdate: ISelect[] = [
        {
          label: 'Todos',
          value: 'UNDEFINED',
        },
      ];
      products_found.forEach(item => {
        productsUpdate.push({
          label: item.name.toUpperCase(),
          value: item.id || '',
        });
      });
      setProducts(productsUpdate);
    } catch (error) {
      toastify('Houve um erro ao buscar os produtos disponíveis.', 'error');
    }
  }, []);

  const getContracts = async (desiredPage = 1) => {
    try {
      setLoading(prevState => !prevState);

      const builtUrl = buildTheQueryUrl(desiredPage);
      const { data: responseContracts } = await apiRebox.get(builtUrl);
      setContracts(responseContracts);

      const { header }: IResponseContracts = responseContracts;
      setTotalPages(Math.ceil(header.total / header.per_page));
      formPageRef.current?.setData({ currentPage: desiredPage });
      formPageSecondaryRef.current?.setData({ currentPage: desiredPage });
    } catch (error) {
      toastify('Ops! Houve um erro ao tentar buscar clientes.', 'error');
    } finally {
      setLoading(prevState => !prevState);
    }
  };

  const handleSearchContracts = useCallback(
    (data: ISearchContractsFormData) => {
      formFilterRef.current?.reset();
      setSearch(data.search.toLowerCase());
      setPage(1);
    },
    [],
  );

  const handleFilterContracts = (data: IFilterContractsFormData) => {
    formSearchRef.current?.reset();

    const badDebt: string[] = [];
    if (filterCurrentPaymentsStatus.waiting) {
      badDebt.push(ConfigValues.rebox.contract.current_payments_status.waiting);
    }
    if (filterCurrentPaymentsStatus.in_day) {
      badDebt.push(ConfigValues.rebox.contract.current_payments_status.in_day);
    }
    if (filterCurrentPaymentsStatus.overdue) {
      badDebt.push(ConfigValues.rebox.contract.current_payments_status.overdue);
    }
    if (filterCurrentPaymentsStatus.stop) {
      badDebt.push(ConfigValues.rebox.contract.current_payments_status.stop);
    }

    const allDataFilter: IFilterContractsFormData = {
      state: data.state === 'UNDEFINED' ? '' : data.state,
      city: data.city === 'UNDEFINED' ? '' : data.city,
      defined_period:
        data.defined_period === 'UNDEFINED' ? '' : data.defined_period,
      period_start: data.period_start
        ? `${formatDate.removeMask(data.period_start)} 00:00`
        : '',
      period_end: data.period_end
        ? `${formatDate.removeMask(data.period_end)} 23:59`
        : '',
      current_payments_status:
        badDebt.length > 1
          ? badDebt.join(',')
          : badDebt.length === 1
          ? badDebt[0]
          : '',
      products_id: data.products_id === 'UNDEFINED' ? '' : data.products_id,
    };

    sessionStorage.setItem(
      ConfigStorage.REBOX_FILTERS_CONTRACTS_LIST,
      JSON.stringify(allDataFilter),
    );
    sessionStorage.setItem(
      ConfigStorage.REBOX_FILTERS_CONTRACTS_LIST_BAD_DEBT,
      JSON.stringify(filterCurrentPaymentsStatus),
    );
    setFilter(allDataFilter);
    setIsOpenModalFilter(prevState => !prevState);
    setPage(1);
  };

  const handleExportData = async () => {
    try {
      setExporting(prevState => !prevState);
      const contractsExportData: IExportData[] = [];
      const arrayUrls: string[] = [];
      const numberPages = Math.ceil(
        contracts?.header.total ||
          ConfigRules.rebox.pagination.users.itemLimit /
            ConfigRules.rebox.pagination.users.itemLimit,
      );

      for (let i = 1; i <= numberPages; i++) {
        arrayUrls.push(buildTheQueryUrl(i));
      }

      const percentage: number = generateNumber.getPercentageByValue(
        arrayUrls.length,
        1,
      );

      for await (const url of arrayUrls) {
        const { data: responseContracts } = await apiRebox.get(url);
        const contractsExported: Contract[] = responseContracts.data;

        contractsExported.forEach(item => {
          const [firstVehicle] = item.contracts_vehicles || [];
          const [contractDate] = item.date.split(' ');
          let contract_grace_period_release_date: string =
            ConfigTransition.rebox_contracts_type_grace_period.onHold;

          if (item?.grace_period_release_date) {
            const [gracePeriodDate] = item?.grace_period_release_date.split(
              ' ',
            );

            contract_grace_period_release_date = formatDate.addMask(
              gracePeriodDate,
            );
          }

          let user_adresses_state = '';
          let user_adresses_city = '';
          let user_vehicle_licenseplate = '';
          let user_vehicle_brand = '';
          let user_vehicle_model = '';
          let user_vehicle_classification = '';

          if (item.user?.adresses) {
            const [firstAddress] = item.user?.adresses;
            user_adresses_state = firstAddress.state.toUpperCase();
            user_adresses_city = firstAddress.city.toUpperCase();
          }

          if (firstVehicle && firstVehicle.vehicle) {
            const {
              license_plate,
              brand,
              model,
              classification,
            } = firstVehicle.vehicle;

            user_vehicle_licenseplate = license_plate
              .replace('-', '')
              .toUpperCase();
            user_vehicle_brand = brand.toUpperCase();
            user_vehicle_model = model.toUpperCase();
            user_vehicle_classification =
              ConfigTransition.rebox_vehicles_classifications[
                classification.toLowerCase()
              ];
          }

          contractsExportData.push({
            contract_date: contractDate ? formatDate.addMask(contractDate) : '',
            contract_code: item.code || '',
            product_name: item.product?.name.toUpperCase() || '',
            contract_status:
              ConfigTransition.rebox_contracts_status[
                item.status?.toLowerCase() || ''
              ],
            contract_currentpaymentstatus:
              ConfigTransition.rebox_contracts_current_payments_status[
                item.current_payments_status?.toLowerCase() || 'undefined'
              ],
            contract_duedate: item.due_date,
            contract_grace_period_release_date,
            contract_number_of_uses_allowed: `${item.number_of_uses_allowed}`,
            contract_available_uses: `${item.available_uses}`,
            user_name: item.user?.name.toUpperCase() || '',
            user_cpf_or_cnpj: item.user?.cpf || item.user?.cnpj || '',
            user_date_of_birth: item.user?.date_of_birth
              ? formatDate.addMask(item.user?.date_of_birth)
              : '',
            user_email: item.user?.email || '',
            user_cellphone: item.user?.cellphone || '',
            user_adresses_state,
            user_adresses_city,
            user_vehicle_licenseplate,
            user_vehicle_brand,
            user_vehicle_model,
            user_vehicle_classification,
          });
        });

        setProgressExportData(prevValue => {
          if (prevValue < 99) {
            const progress: number = prevValue + percentage;
            const [units, decimals] = progress.toFixed(1).split('.');
            const progressUpdated = Number.parseFloat(
              decimals ? `${units}.${decimals.substring(0, 2)}` : units,
            );
            return progressUpdated;
          }
          return 99;
        });
      }

      setProgressExportData(100);
      setExportData(contractsExportData);
    } catch (error) {
      toastify('Sinto muito, não conseguimos exportar os dados.', 'error');
      setProgressExportData(0);
      setExportData([]);
    } finally {
      setExporting(prevState => !prevState);
    }
  };

  const handleDownloadFile = useCallback(() => {
    setProgressExportData(0);
    setExportData([]);
    setIsOpenModalExportData(prevState => !prevState);
    toastify('Download do relatório de contratos foi iniciado!', 'success');
  }, []);

  const cleanFilter = useCallback(() => {
    formFilterRef.current?.reset();
    sessionStorage.removeItem(ConfigStorage.REBOX_FILTERS_CONTRACTS_LIST);
    sessionStorage.removeItem(
      ConfigStorage.REBOX_FILTERS_CONTRACTS_LIST_BAD_DEBT,
    );
    setFilterCurrentPaymentsStatus({
      waiting: false,
      in_day: false,
      overdue: false,
      stop: false,
    });
    setFilter({} as IFilterContractsFormData);
    setIsOpenModalFilter(prevState => !prevState);
  }, []);

  const handleGoBack = () => {
    sessionStorage.removeItem(
      ConfigStorage.REBOX_PAGINATION_CONTRACTS_LIST_PAGE,
    );
    sessionStorage.removeItem(ConfigStorage.REBOX_FILTERS_CONTRACTS_LIST);
    sessionStorage.removeItem(
      ConfigStorage.REBOX_FILTERS_CONTRACTS_LIST_BAD_DEBT,
    );
    goBack();
  };

  useEffect(() => {
    getContracts(page);
    sessionStorage.setItem(
      ConfigStorage.REBOX_PAGINATION_CONTRACTS_LIST_PAGE,
      `${page}`,
    );
    // eslint-disable-next-line
  }, [page, search, filter]);

  useEffect(() => {
    // eslint-disable-next-line
    getProducts();
    getStates();
    const storageBadDebt = sessionStorage.getItem(
      ConfigStorage.REBOX_FILTERS_CONTRACTS_LIST_BAD_DEBT,
    );
    if (storageBadDebt) {
      setFilterCurrentPaymentsStatus(JSON.parse(storageBadDebt));
    }
  }, [getProducts, getStates]);

  return (
    <Container>
      <HeaderNavigationPrivate />
      <ContainerGroup>
        <MenuSideBarPrivate />
        <Content>
          <SubtitleSecondary textAlign="start">Contratos</SubtitleSecondary>
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
            <FormSearch ref={formSearchRef} onSubmit={handleSearchContracts}>
              <InputText
                name="search"
                placeholder="Pesquisar..."
                title="Por código, nome, placa, e-mail ou CPF"
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
                ref={formPageSecondaryRef}
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
          <ListSalesContracts
            contracts={contracts?.data}
            loading={loading}
            showTotal={true}
            totalValue={contracts?.header.total}
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
          onSubmit={handleFilterContracts}
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
                Por produto
              </Paragraph>
              <InputSelect
                name="products_id"
                placeholder="Selecione o produto"
                tabIndex={1}
                options={products}
                selectedDefault={filter.products_id}
              />
            </FilterFieldSet>
            <FilterFieldSet>
              <Paragraph
                nameColor="black"
                textAlign="start"
                style={{ marginBottom: '1vh', fontWeight: 500 }}
              >
                Por estado
              </Paragraph>
              <InputSelect
                name="state"
                placeholder="Selecione o estado"
                tabIndex={1}
                options={states}
                onChange={event => {
                  getCity(event.target.value.toUpperCase());
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
                Por cidade
              </Paragraph>
              <InputSelect
                name="city"
                placeholder="Selecione a cidade"
                tabIndex={1}
                options={cities}
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
                placeholder="Selecione um período"
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
          <FilterFieldGroup className="special">
            <FilterFieldSet>
              <Paragraph
                nameColor="black"
                textAlign="start"
                style={{ marginBottom: '1vh', fontWeight: 500 }}
              >
                Por adimplência
              </Paragraph>
              <FilterFieldSetItems>
                <InputCheckBox
                  label={
                    <Paragraph
                      nameColor="black"
                      textAlign="start"
                      style={{ fontWeight: 500 }}
                    >
                      Aguardando
                    </Paragraph>
                  }
                  onChange={() => {
                    filterCurrentPaymentsStatus.waiting = !filterCurrentPaymentsStatus.waiting;
                    setFilterCurrentPaymentsStatus(filterCurrentPaymentsStatus);
                  }}
                  defaultChecked={filterCurrentPaymentsStatus.waiting}
                />

                <InputCheckBox
                  label={
                    <Paragraph
                      nameColor="black"
                      textAlign="start"
                      style={{ fontWeight: 500 }}
                    >
                      Em dia
                    </Paragraph>
                  }
                  onChange={() => {
                    filterCurrentPaymentsStatus.in_day = !filterCurrentPaymentsStatus.in_day;
                    setFilterCurrentPaymentsStatus(filterCurrentPaymentsStatus);
                  }}
                  defaultChecked={filterCurrentPaymentsStatus.in_day}
                />

                <InputCheckBox
                  label={
                    <Paragraph
                      nameColor="black"
                      textAlign="start"
                      style={{ fontWeight: 500 }}
                    >
                      Em atraso
                    </Paragraph>
                  }
                  onChange={() => {
                    filterCurrentPaymentsStatus.overdue = !filterCurrentPaymentsStatus.overdue;
                    setFilterCurrentPaymentsStatus(filterCurrentPaymentsStatus);
                  }}
                  defaultChecked={filterCurrentPaymentsStatus.overdue}
                />

                <InputCheckBox
                  label={
                    <Paragraph
                      nameColor="black"
                      textAlign="start"
                      style={{ fontWeight: 500 }}
                    >
                      Cancelado
                    </Paragraph>
                  }
                  onChange={() => {
                    filterCurrentPaymentsStatus.stop = !filterCurrentPaymentsStatus.stop;
                    setFilterCurrentPaymentsStatus(filterCurrentPaymentsStatus);
                  }}
                  defaultChecked={filterCurrentPaymentsStatus.stop}
                />
              </FilterFieldSetItems>
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
            headers={ConfigLabel.rebox.export.excel.contract}
            data={exportData}
            filename={`contratos-${generateDate.now().split(' ')[0]}.xls`}
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

export default ContractList;
