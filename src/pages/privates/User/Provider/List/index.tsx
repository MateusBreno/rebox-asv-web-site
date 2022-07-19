// ./src/pages/privates/User/Provider/List/index.tsx
import React, { useEffect, useState, useRef, useCallback } from 'react';

import { FormHandles } from '@unform/core';
import { FiDownload, FiPaperclip } from 'react-icons/fi';
import {
  IoOptions,
  // IoPersonAdd,
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
  ListUserProviders,
  InputText,
  InputMask,
  InputSelect,
  ButtonOutline,
  ButtonDefault,
  Paragraph,
  ButtonMain,
} from '@components/index';
import {
  ConfigStorage,
  ConfigRules,
  ConfigLabel,
  ConfigTransition,
  ConfigValues,
} from '@config/index';
import Service from '@models/Service';
import User from '@models/User';
import { apiRebox, apiIbge } from '@services/index';
import { formatDate, formatText } from '@utils/formatters';
import { generateDate, generateNumber } from '@utils/generators';
import { toastify } from '@utils/notifiers';

import {
  IResponseUsers,
  IFilterProvidersFormData,
  ISearchProvidersFormData,
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
  FilterButtons,
  ModalExportData,
  Progress,
  ProgressBar,
  ProgressText,
  ButtonExportToExcel,
} from './styles';

const ProviderList: React.FC = () => {
  const { goBack } = useHistory();
  const formSearchRef = useRef<FormHandles>(null);
  const formFilterRef = useRef<FormHandles>(null);
  const formPageRef = useRef<FormHandles>(null);
  const formPageSecondaryRef = useRef<FormHandles>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [exporting, setExporting] = useState<boolean>(false);
  const [progressExportData, setProgressExportData] = useState<number>(0);
  const [providers, setProviders] = useState<IResponseUsers>();
  const [page, setPage] = useState<number>(
    Number.parseInt(
      sessionStorage.getItem(
        ConfigStorage.REBOX_PAGINATION_PROVIDERS_LIST_PAGE,
      ) || '1',
      10,
    ),
  );
  const [totalPages, setTotalPages] = useState<number>(1);
  const [search, setSearch] = useState<string>('');
  const [exportData, setExportData] = useState<IExportData[]>([]);
  const [filter, setFilter] = useState<IFilterProvidersFormData>(
    JSON.parse(
      sessionStorage.getItem(ConfigStorage.REBOX_FILTERS_PROVIDERS_LIST) ||
        '{}',
    ),
  );
  const [states, setStates] = useState<ISelect[]>([]);
  const [cities, setCities] = useState<ISelect[]>([]);
  const [services, setServices] = useState<ISelect[]>([]);
  const [isDisabledFilter, setIsDisabledFilter] = useState<boolean>(true);
  const [isOpenModalFilter, setIsOpenModalFilter] = useState<boolean>(false);
  const [isOpenModalExportData, setIsOpenModalExportData] = useState<boolean>(
    false,
  );

  const buildTheQueryUrl = (value: number): string => {
    let url = `/users?role=${ConfigValues.rebox.user.role.provider}&page=${value}&per_page=${ConfigRules.rebox.pagination.users.itemLimit}&details=all`;

    if (search) {
      // Busca por nome, email, cpf etc...
      url = `${url}&query=${search}`;
    } else {
      // Buscar pelo filtro de status, estado etc
      const {
        services_id,
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

      if (services_id) {
        url = `${url}&services_id=${services_id}`;
      }

      if (state && city) {
        url = `${url}&state=${state.toLowerCase()}&city=${city.toLowerCase()}`;
      } else if (state) {
        url = `${url}&state=${state.toLowerCase()}`;
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

  const getProviders = async (desiredPage = 1) => {
    try {
      setLoading(prevState => !prevState);

      const builtUrl = buildTheQueryUrl(desiredPage);
      const { data: responseProviders } = await apiRebox.get(builtUrl);
      setProviders(responseProviders);

      const { header }: IResponseUsers = responseProviders;
      setTotalPages(Math.ceil(header.total / header.per_page));
      formPageRef.current?.setData({ currentPage: desiredPage });
      formPageSecondaryRef.current?.setData({ currentPage: desiredPage });
    } catch (error) {
      toastify('Ops! Houve um erro ao tentar buscar prestadores.', 'error');
    } finally {
      setLoading(prevState => !prevState);
    }
  };

  const handleSearchProviders = useCallback(
    (data: ISearchProvidersFormData) => {
      formFilterRef.current?.reset();
      setSearch(data.search.toLowerCase());
      setPage(1);
    },
    [],
  );

  const handleFilterProviders = useCallback(
    (data: IFilterProvidersFormData) => {
      formSearchRef.current?.reset();

      const allDataFilter: IFilterProvidersFormData = {
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
        services_id: data.services_id === 'UNDEFINED' ? '' : data.services_id,
      };

      sessionStorage.setItem(
        ConfigStorage.REBOX_FILTERS_PROVIDERS_LIST,
        JSON.stringify(allDataFilter),
      );
      setFilter(allDataFilter);
      setIsOpenModalFilter(prevState => !prevState);
      setPage(1);
    },
    [],
  );

  const handleExportData = async () => {
    try {
      setExporting(prevState => !prevState);
      const providersExportData: IExportData[] = [];
      const arrayUrls: string[] = [];
      const numberPages = Math.ceil(
        providers?.header.total ||
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
        const { data: responseProvider } = await apiRebox.get(url);
        const providersExported: User[] = responseProvider.data;

        providersExported.forEach(item => {
          // const [address] = item.adresses;
          providersExportData.push({
            user_name: item.name,
            user_cpf_or_cnpj: item.cpf || item.cnpj || '',
            user_date_of_birth: formatDate.addMask(item.date_of_birth || ''),
            user_email: item.email,
            user_cellphone: item.cellphone,
            user_status: ConfigTransition.rebox_user_status[item.status],
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
      setExportData(providersExportData);
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
    toastify('Download do relatório de prestadores foi iniciado!', 'success');
  }, []);

  const cleanFilter = useCallback(() => {
    formFilterRef.current?.reset();
    sessionStorage.removeItem(ConfigStorage.REBOX_FILTERS_PROVIDERS_LIST);
    setFilter({} as IFilterProvidersFormData);
    setIsOpenModalFilter(prevState => !prevState);
  }, []);

  const handleGoBack = () => {
    sessionStorage.removeItem(
      ConfigStorage.REBOX_PAGINATION_PROVIDERS_LIST_PAGE,
    );
    sessionStorage.removeItem(ConfigStorage.REBOX_FILTERS_PROVIDERS_LIST);
    goBack();
  };

  useEffect(() => {
    getProviders(page);
    sessionStorage.setItem(
      ConfigStorage.REBOX_PAGINATION_PROVIDERS_LIST_PAGE,
      `${page}`,
    );
    // eslint-disable-next-line
  }, [page, search, filter]);

  useEffect(() => {
    getServices();
    getStates();
  });

  return (
    <Container>
      <HeaderNavigationPrivate />
      <ContainerGroup>
        <MenuSideBarPrivate />
        <Content>
          <SubtitleSecondary textAlign="start">Prestadores</SubtitleSecondary>
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
            <FormSearch ref={formSearchRef} onSubmit={handleSearchProviders}>
              <InputText
                name="search"
                placeholder="Pesquisar..."
                title="Por nome, e-mail, cel ou cnpj"
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
                onSubmit={() => null}
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
          <ListUserProviders
            users={providers?.data}
            loading={loading}
            showTotal={true}
            totalValue={providers?.header.total}
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
                onSubmit={() => null}
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
          onSubmit={handleFilterProviders}
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
                placeholder="Selecione o serviço"
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
            headers={ConfigLabel.rebox.export.excel.provider}
            data={exportData}
            filename={`prestadores-${generateDate.now().split(' ')[0]}.xls`}
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

export default ProviderList;
