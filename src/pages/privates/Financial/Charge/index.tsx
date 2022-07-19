// ./src/pages/privates/Financial/Charge/index.tsx
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
  ListCharges,
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
import Payment from '@models/Payment';
import { apiRebox } from '@services/index';
import { formatDate, formatMoney } from '@utils/formatters';
import { generateDate, generateNumber } from '@utils/generators';
import { toastify } from '@utils/notifiers';

import {
  IResponseCharges,
  IFilterChargesFormData,
  ISearchChargesFormData,
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

const Charge: React.FC = () => {
  const { goBack } = useHistory();
  const formSearchRef = useRef<FormHandles>(null);
  const formFilterRef = useRef<FormHandles>(null);
  const formPageRef = useRef<FormHandles>(null);
  const formPageSecondaryRef = useRef<FormHandles>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [exporting, setExporting] = useState<boolean>(false);
  const [progressExportData, setProgressExportData] = useState<number>(0);
  const [charges, setCharges] = useState<IResponseCharges>();
  const [page, setPage] = useState<number>(
    Number.parseInt(
      sessionStorage.getItem(
        ConfigStorage.REBOX_PAGINATION_CHARGES_LIST_PAGE,
      ) || '1',
      10,
    ),
  );
  const [totalPages, setTotalPages] = useState<number>(1);
  const [search, setSearch] = useState<string>('');
  const [exportData, setExportData] = useState<IExportData[]>([]);
  const [filter, setFilter] = useState<IFilterChargesFormData>(
    JSON.parse(
      sessionStorage.getItem(ConfigStorage.REBOX_FILTERS_CHARGES_LIST) || '{}',
    ),
  );
  const [isDisabledFilter, setIsDisabledFilter] = useState<boolean>(true);
  const [isOpenModalFilter, setIsOpenModalFilter] = useState<boolean>(false);
  const [isOpenModalExportData, setIsOpenModalExportData] = useState<boolean>(
    false,
  );

  const buildTheQueryUrl = (value: number): string => {
    let url = `/payments?page=${value}&per_page=${ConfigRules.rebox.pagination.charges.itemLimit}&what_is_being_paid=${ConfigValues.rebox.payments.what_is_being_paid.contracts}&details=all`;

    if (search) {
      // Busca por nome, email, cpf etc...
      url = `${url}&query=${search}`;
    } else {
      // Buscar pelo filtro de status, estado etc
      const {
        current_payments_status,
        status,
        period_type,
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
            url = `${url}&period_start=${today}&period_end=${today}`;
          } else {
            const [before] = generateDate
              .beforeDays(Number.parseInt(defined_period, 10))
              .split(' ');
            url = `${url}&period_start=${before}&period_end=${today}`;
          }
        }
      }

      if (period_type) {
        url = `${url}&period_type=${period_type}`;
      }

      if (current_payments_status) {
        url = `${url}&current_payments_status=${current_payments_status}`;
      }

      if (status) {
        url = `${url}&status=${status}`;
      }
    }
    return url;
  };

  const getCharges = async (desiredPage = 1) => {
    try {
      setLoading(prevState => !prevState);

      const builtUrl = buildTheQueryUrl(desiredPage);
      const { data: responseCharges } = await apiRebox.get(builtUrl);
      setCharges(responseCharges);

      const { header }: IResponseCharges = responseCharges;
      setTotalPages(Math.ceil(header.total / header.per_page));
      formPageRef.current?.setData({ currentPage: desiredPage });
      formPageSecondaryRef.current?.setData({ currentPage: desiredPage });
    } catch (error) {
      toastify('Ops! Houve um erro ao tentar buscar comissões.', 'error');
    } finally {
      setLoading(prevState => !prevState);
    }
  };

  const handleSearchCharges = useCallback((data: ISearchChargesFormData) => {
    formFilterRef.current?.reset();
    setSearch(data.search.toLowerCase());
    setPage(1);
  }, []);

  const handleFilterCharges = useCallback((data: IFilterChargesFormData) => {
    formSearchRef.current?.reset();

    const allDataFilter: IFilterChargesFormData = {
      period_type: !data.period_type ? 'DATE_CREATED' : data.period_type,
      defined_period:
        data.defined_period === 'UNDEFINED' ? '' : data.defined_period,
      period_start: data.period_start
        ? formatDate.removeMask(data.period_start)
        : '',
      period_end: data.period_end ? formatDate.removeMask(data.period_end) : '',
      status: data.status === 'UNDEFINED' ? '' : data.status,
      current_payments_status:
        data.current_payments_status === 'UNDEFINED'
          ? ''
          : data.current_payments_status,
    };

    sessionStorage.setItem(
      ConfigStorage.REBOX_FILTERS_CHARGES_LIST,
      JSON.stringify(allDataFilter),
    );
    setFilter(allDataFilter);
    setIsOpenModalFilter(prevState => !prevState);
    setPage(1);
  }, []);

  const handleExportData = async () => {
    try {
      setExporting(prevState => !prevState);
      const chargesExportData: IExportData[] = [];
      const arrayUrls: string[] = [];
      const numberPages = Math.ceil(
        charges?.header.total ||
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
        const { data: responseCharges } = await apiRebox.get(url);
        const chargesExported: Payment[] = responseCharges.data;

        chargesExported.forEach(item => {
          const { contract } = item;
          let chargeExport: IExportData = {} as IExportData;
          if (contract) {
            const [firstVehicle] = contract.contracts_vehicles || [];
            const [contractDate] = contract?.date.split(' ');
            let contract_grace_period_release_date: string =
              ConfigTransition.rebox_contracts_type_grace_period.onHold;

            if (contract.grace_period_release_date) {
              const [
                gracePeriodDate,
              ] = contract.grace_period_release_date.split(' ');
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

            if (contract.user?.adresses) {
              const [firstAddress] = contract.user?.adresses;
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

            chargeExport = {
              ...chargeExport,
              contract_code: contract.code || '',
              contract_grace_period_release_date,
              contract_date: contractDate
                ? formatDate.addMask(contractDate)
                : '',
              product_name: contract.product?.name.toUpperCase() || '',
              contract_currentpaymentstatus:
                ConfigTransition.rebox_contracts_current_payments_status[
                  contract.current_payments_status?.toLowerCase() || 'undefined'
                ],
              user_name: item.contract?.user?.name.toUpperCase() || '',
              user_cpf_or_cnpj: contract.user?.cpf || contract.user?.cnpj || '',
              user_date_of_birth: contract.user?.date_of_birth
                ? formatDate.addMask(contract.user?.date_of_birth)
                : '',
              user_email: contract.user?.email || '',
              user_cellphone: contract.user?.cellphone || '',
              user_adresses_state,
              user_adresses_city,
              user_vehicle_licenseplate,
              user_vehicle_brand,
              user_vehicle_model,
              user_vehicle_classification,
            };
          }

          chargesExportData.push({
            ...chargeExport,
            payment_date_created: formatDate.addMask(item.date_created),
            payment_form_of_payment:
              ConfigTransition.rebox_payments_form_of_payment[
                item.form_of_payment.toLowerCase() || 'undefined'
              ],
            payment_amount: formatMoney.fromNumberToPrice(item.amount),
            payment_due_date: formatDate.addMask(item.due_date),
            payment_status:
              ConfigTransition.rebox_payments_status[
                item.status.toLowerCase() || 'undefined'
              ],
            payment_pay_day: item.pay_day
              ? formatDate.addMask(item.pay_day)
              : 'Em espera',
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
      setExportData(chargesExportData);
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
    toastify('Download do relatório de cobranças foi iniciado!', 'success');
  }, []);

  const cleanFilter = useCallback(() => {
    formFilterRef.current?.reset();
    sessionStorage.removeItem(ConfigStorage.REBOX_FILTERS_CHARGES_LIST);
    setFilter({} as IFilterChargesFormData);
    setIsOpenModalFilter(prevState => !prevState);
  }, []);

  const handleGoBack = () => {
    sessionStorage.removeItem(ConfigStorage.REBOX_PAGINATION_CHARGES_LIST_PAGE);
    sessionStorage.removeItem(ConfigStorage.REBOX_FILTERS_CHARGES_LIST);
    goBack();
  };

  useEffect(() => {
    getCharges(page);
    sessionStorage.setItem(
      ConfigStorage.REBOX_PAGINATION_CHARGES_LIST_PAGE,
      `${page}`,
    );
    // eslint-disable-next-line
  }, [page, search, filter]);

  return (
    <Container>
      <HeaderNavigationPrivate />
      <ContainerGroup>
        <MenuSideBarPrivate />
        <Content>
          <SubtitleSecondary textAlign="start">Cobranças</SubtitleSecondary>
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
            <FormSearch ref={formSearchRef} onSubmit={handleSearchCharges}>
              <InputText
                name="search"
                placeholder="Pesquisar..."
                title="Por contrato, placa, nome, e-mail, cel, CPF ou CNPJ"
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
          <ListCharges
            charges={charges?.data}
            loading={loading}
            showTotal={true}
            totalValue={charges?.header.total}
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
          onSubmit={handleFilterCharges}
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
                Situação da cobrança
              </Paragraph>
              <InputSelect
                name="status"
                placeholder="Selecione o status"
                tabIndex={1}
                options={ConfigLabel.rebox.filter.payment.status}
              />
            </FilterFieldSet>
            <FilterFieldSet>
              <Paragraph
                nameColor="black"
                textAlign="start"
                style={{ marginBottom: '1vh', fontWeight: 500 }}
              >
                Situação do contrato
              </Paragraph>
              <InputSelect
                name="current_payments_status"
                placeholder="Selecione a adimplência"
                tabIndex={1}
                options={
                  ConfigLabel.rebox.filter.contract.currentPaymentsStatus
                }
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
                placeholder="Selecione a coluna"
                tabIndex={1}
                options={ConfigLabel.rebox.filter.payment.periodType}
                onChange={event => {
                  if (event.target.value === 'OTHER') {
                    setIsDisabledFilter(prevState => !prevState);
                  } else {
                    setIsDisabledFilter(true);
                  }
                }}
              />
            </FilterFieldSet>
            <FilterFieldSet>
              <Paragraph
                nameColor="black"
                textAlign="start"
                style={{ marginBottom: '1vh', fontWeight: 500 }}
              >
                Definir período
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
            headers={ConfigLabel.rebox.export.excel.charge}
            data={exportData}
            filename={`cobrancas-${generateDate.now().split(' ')[0]}.xls`}
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

export default Charge;
