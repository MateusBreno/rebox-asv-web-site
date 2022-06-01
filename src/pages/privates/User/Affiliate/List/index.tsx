// ./src/pages/privates/User/Affiliate/List/index.tsx
import React, { useEffect, useState, useRef, useCallback } from 'react';

import { FormHandles } from '@unform/core';
import { FiDownload, FiPaperclip } from 'react-icons/fi';
import {
  IoOptions,
  IoPersonAdd,
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
  ListUserAffiliates,
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
import User from '@models/User';
import { apiRebox, apiIbge } from '@services/index';
import { formatDate } from '@utils/formatters';
import { generateDate, generateNumber } from '@utils/generators';
import { toastify } from '@utils/notifiers';

import {
  IResponseUsers,
  IFilterAffiliatesFormData,
  ISearchAffiliatesFormData,
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

const AffiliateList: React.FC = () => {
  const { goBack } = useHistory();
  const formSearchRef = useRef<FormHandles>(null);
  const formFilterRef = useRef<FormHandles>(null);
  const formPageRef = useRef<FormHandles>(null);
  const formPageSecondaryRef = useRef<FormHandles>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [exporting, setExporting] = useState<boolean>(false);
  const [progressExportData, setProgressExportData] = useState<number>(0);
  const [affiliates, setAffiliates] = useState<IResponseUsers>();
  const [page, setPage] = useState<number>(
    Number.parseInt(
      sessionStorage.getItem(
        ConfigStorage.REBOX_PAGINATION_AFFILIATES_LIST_PAGE,
      ) || '1',
      10,
    ),
  );
  const [totalPages, setTotalPages] = useState<number>(1);
  const [search, setSearch] = useState<string>('');
  const [exportData, setExportData] = useState<IExportData[]>([]);
  const [filter, setFilter] = useState<IFilterAffiliatesFormData>(
    JSON.parse(
      sessionStorage.getItem(ConfigStorage.REBOX_FILTERS_AFFILIATES_LIST) ||
        '{}',
    ),
  );
  const [states, setStates] = useState<ISelect[]>([]);
  const [cities, setCities] = useState<ISelect[]>([]);
  const [isDisabledFilter, setIsDisabledFilter] = useState<boolean>(true);
  const [isOpenModalFilter, setIsOpenModalFilter] = useState<boolean>(false);
  const [isOpenModalExportData, setIsOpenModalExportData] = useState<boolean>(
    false,
  );

  const buildTheQueryUrl = (value: number): string => {
    let url = `/users?role=${ConfigValues.rebox.user.role.partner}&page=${value}&per_page=${ConfigRules.rebox.pagination.users.itemLimit}&details=all`;

    if (search) {
      // Busca por nome, email, cpf etc...
      url = `${url}&query=${search}`;
    } else {
      // Buscar pelo filtro de status, estado etc
      const {
        current_payments_status,
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

  const getAffiliates = async (desiredPage = 1) => {
    try {
      setLoading(prevState => !prevState);

      const builtUrl = buildTheQueryUrl(desiredPage);
      const { data: responseAffiliates } = await apiRebox.get(builtUrl);
      setAffiliates(responseAffiliates);

      const { header }: IResponseUsers = responseAffiliates;
      setTotalPages(Math.ceil(header.total / header.per_page));
      formPageRef.current?.setData({ currentPage: desiredPage });
      formPageSecondaryRef.current?.setData({ currentPage: desiredPage });
    } catch (error) {
      toastify('Ops! Houve um erro ao tentar buscar afiliados.', 'error');
    } finally {
      setLoading(prevState => !prevState);
    }
  };

  const handleSearchAffiliates = useCallback(
    (data: ISearchAffiliatesFormData) => {
      formFilterRef.current?.reset();
      setSearch(data.search.toLowerCase());
      setPage(1);
    },
    [],
  );

  const handleFilterAffiliates = useCallback(
    (data: IFilterAffiliatesFormData) => {
      formSearchRef.current?.reset();

      const allDataFilter: IFilterAffiliatesFormData = {
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
          data.current_payments_status === 'UNDEFINED'
            ? ''
            : data.current_payments_status,
      };

      sessionStorage.setItem(
        ConfigStorage.REBOX_FILTERS_AFFILIATES_LIST,
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
      const affiliatesExportData: IExportData[] = [];
      const arrayUrls: string[] = [];
      const numberPages = Math.ceil(
        affiliates?.header.total ||
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
        const { data: responseAffiliate } = await apiRebox.get(url);
        const affiliatesExported: User[] = responseAffiliate.data;

        affiliatesExported.forEach(item => {
          const [address] = item.adresses;
          affiliatesExportData.push({
            user_name: item.name,
            user_cpf_or_cnpj: item.cpf || item.cnpj || '',
            user_date_of_birth: formatDate.addMask(item.date_of_birth || ''),
            user_email: item.email,
            user_cellphone: item.cellphone,
            user_status: ConfigTransition.rebox_user_status[item.status],
            user_adresses_state: address.state.toUpperCase(),
            user_adresses_city: address.city.toUpperCase(),
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
      setExportData(affiliatesExportData);
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
    toastify('Download do relatório de afiliados foi iniciado!', 'success');
  }, []);

  const cleanFilter = useCallback(() => {
    formFilterRef.current?.reset();
    sessionStorage.removeItem(ConfigStorage.REBOX_FILTERS_AFFILIATES_LIST);
    setFilter({} as IFilterAffiliatesFormData);
    setIsOpenModalFilter(prevState => !prevState);
  }, []);

  const handleGoBack = () => {
    sessionStorage.removeItem(
      ConfigStorage.REBOX_PAGINATION_AFFILIATES_LIST_PAGE,
    );
    sessionStorage.removeItem(ConfigStorage.REBOX_FILTERS_AFFILIATES_LIST);
    goBack();
  };

  useEffect(() => {
    getAffiliates(page);
    sessionStorage.setItem(
      ConfigStorage.REBOX_PAGINATION_AFFILIATES_LIST_PAGE,
      `${page}`,
    );
  }, [page, search, filter]);

  useEffect(() => {
    getStates();
  }, []);

  return (
    <Container>
      <HeaderNavigationPrivate />
      <ContainerGroup>
        <MenuSideBarPrivate />
        <Content>
          <SubtitleSecondary textAlign="start">Afiliados</SubtitleSecondary>
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
            <FormSearch ref={formSearchRef} onSubmit={handleSearchAffiliates}>
              <InputText
                name="search"
                placeholder="Pesquisar..."
                title="Por nome, placa, CPF, cel ou e-mail"
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
          <ListUserAffiliates
            users={affiliates?.data}
            loading={loading}
            showTotal={true}
            totalValue={affiliates?.header.total}
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
          onSubmit={handleFilterAffiliates}
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
            <FilterFieldSet style={{ display: 'none' }}>
              <Paragraph
                nameColor="black"
                textAlign="start"
                style={{ marginBottom: '1vh', fontWeight: 500 }}
              >
                Por adimplência
              </Paragraph>
              <InputSelect
                name="current_payments_status"
                placeholder="Selecione o status"
                tabIndex={1}
                options={
                  ConfigLabel.rebox.filter.contract.currentPaymentsStatus
                }
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
            headers={ConfigLabel.rebox.export.excel.affiliate}
            data={exportData}
            filename={`afiliados-${generateDate.now().split(' ')[0]}.xls`}
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

export default AffiliateList;
