import React, { useCallback, useRef, useState } from 'react';

import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import { ToastContainer } from 'react-toastify';
import * as Yup from 'yup';

import { IconArrowBottom } from '@assets/icons';
import { ImageDuplicateBillet } from '@assets/images';
import {
  ButtonMain,
  InputMask,
  HeaderNavigationPublic,
  FooterPublic,
  MenuSideBarPublic,
  Paragraph,
} from '@components/index';
import { ConfigValues } from '@config/index';
import Payment from '@models/Payment';
import { apiRebox } from '@services/index';
import { getValidationErrors } from '@utils/errors';
import { formatCPF, formatMoney } from '@utils/formatters';
import { toastify } from '@utils/notifiers';

import { SearchContracts } from './constants';
import PaymentItem from './PaymentItem';
import { schema } from './schemaValidation';

import {
  Container,
  Content,
  Information,
  InformationText,
  InformationTextTitle,
  InformationTextSubtitle,
  Contracts,
  ContractsTitle,
  ContractsSubtitle,
  ContractsItems,
  ContractsItemsNoInfo,
  ContractsItemsList,
  ContractsItemsListItem,
  ContractsItemsListItemTouch,
  ContractsItemsListItemDescription,
} from './styles';

interface ISearchFormData {
  cpf: string;
}

const ConsultDebts: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [contracts, setContracts] = useState<SearchContracts[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDetailsCommonQuestions, setIsDetailsCommonQuestions] =
    useState<number>(0);

  const showDetailsCommonQuestions = (value: number) => {
    setIsDetailsCommonQuestions(value);
  };

  const handleOpenSidebar = useCallback(() => {
    setSidebarIsOpen(!sidebarIsOpen);
  }, [sidebarIsOpen]);

  const handleSubmitUser = useCallback(async (data: ISearchFormData) => {
    try {
      setLoading(prevState => !prevState);

      formRef.current?.setErrors({});

      await schema.validate(data, {
        abortEarly: false,
      });

      toastify('Por favor aguarde, estamos realizando a consulta.', 'info');

      const {
        data: { data: response_users },
      } = await apiRebox.get(`/users?cpf=${formatCPF.removeMask(data.cpf)}`);

      if (response_users.length > 0) {
        const [user] = response_users;

        const {
          data: { data: response_contracts },
        } = await apiRebox.get(`/contracts?users_id=${user.id}`);

        if (response_contracts.length > 0) {
          const new_array_contracts: SearchContracts[] = [];

          for await (const contract of response_contracts) {
            const {
              data: { data: response_payments },
            } = await apiRebox.get(
              `/payments?what_is_being_paid=contracts&paying_item_with_id=${contract.id}`,
            );

            const payments_updated: Payment[] = [];

            for await (const payment of response_payments) {
              if (
                payment.status === ConfigValues.rebox.payments.status.overdue ||
                payment.status === ConfigValues.rebox.payments.status.pending
              ) {
                const { data: asaas_payment } = await apiRebox.get(
                  `/asaas/payment/${payment.gateway_id}`,
                );

                payments_updated.push({
                  ...payment,
                  asaas_payment: asaas_payment.data,
                });
              }
            }

            contract.payments = payments_updated;

            new_array_contracts.push(contract);
          }

          toastify(
            'Tudo certo! Seus contratos estão logo abaixo na tela.',
            'success',
          );

          setContracts(new_array_contracts);
        } else {
          toastify(
            'Este CPF não possui nenhum contrato efetuado, por favor tente mais tarde.',
            'success',
          );
        }
      } else {
        toastify(
          'Nenhum cliente encontrado com este CPF, por favor tente mais tarde.',
          'info',
        );
      }
    } catch (error: any) {
      if (error instanceof Yup.ValidationError) {
        const errors = getValidationErrors(error);

        formRef.current?.setErrors(errors);

        const { cpf } = errors;

        if (cpf) toastify(cpf, 'error');
      } else if (error.response) {
        toastify(
          error.response.data.error ||
            'Sinto muito, não foi possível localizar os dados',
          'error',
        );
      }
    } finally {
      setLoading(prevState => !prevState);
    }
  }, []);

  return (
    <Container sidebarIsOpen={sidebarIsOpen}>
      <MenuSideBarPublic
        handleOpenSidebar={handleOpenSidebar}
        sidebarIsOpen={sidebarIsOpen}
      />

      <HeaderNavigationPublic handleOpenSidebar={handleOpenSidebar} />
      <Content>
        <Information>
          <InformationText>
            <InformationTextTitle>
              Consulte seus pagamentos pendentes
            </InformationTextTitle>

            <InformationTextSubtitle>
              Informe abaixo o seu CPF e gere a 2ª via dos seus boletos.
            </InformationTextSubtitle>

            <Form ref={formRef} onSubmit={handleSubmitUser}>
              <InputMask
                name="cpf"
                mask="999.999.999-99"
                placeholder="Digite o seu CPF"
              />
              <ButtonMain loading={loading}>Buscar</ButtonMain>
            </Form>
          </InformationText>
          <ImageDuplicateBillet />
        </Information>

        <Contracts>
          <ContractsTitle>
            Visualize abaixo todos os seus contratos
          </ContractsTitle>
          <ContractsSubtitle>
            Pegue aqui a 2ª via do seu boleto
          </ContractsSubtitle>

          <ContractsItems>
            {contracts.length === 0 ? (
              <ContractsItemsNoInfo>
                Nenhum contrato foi encontrado
              </ContractsItemsNoInfo>
            ) : (
              <ContractsItemsList>
                {contracts.map((item, index) => (
                  <>
                    {(item.status &&
                      item.status.toUpperCase() ===
                        ConfigValues.rebox.contract.status.pending) ||
                    (item.status &&
                      item.status.toUpperCase() ===
                        ConfigValues.rebox.contract.status.released) ? (
                      <ContractsItemsListItem key={index}>
                        <ContractsItemsListItemTouch
                          isActive={isDetailsCommonQuestions === index + 1}
                          onClick={() =>
                            showDetailsCommonQuestions(
                              isDetailsCommonQuestions === index + 1
                                ? 0
                                : index + 1,
                            )
                          }
                        >
                          <div>
                            <span>
                              Assinatura{' '}
                              {`${item.product?.name.toUpperCase()} (${formatMoney.fromNumberToPrice(
                                item.amount || 0,
                              )})`}
                            </span>
                            <p>
                              Veículo{' '}
                              {item.contracts_vehicles &&
                              item.contracts_vehicles?.length > 0
                                ? item.contracts_vehicles[0].vehicle.license_plate.toUpperCase()
                                : ''}
                            </p>
                            <p>{`${item.code}`}</p>
                          </div>
                          <IconArrowBottom />
                        </ContractsItemsListItemTouch>
                        <ContractsItemsListItemDescription
                          isActive={isDetailsCommonQuestions === index + 1}
                        >
                          {item.payments?.length === 0 ? (
                            <Paragraph nameColor="black">
                              Nenhuma cobrança encontrada
                            </Paragraph>
                          ) : (
                            <>
                              {item.payments?.map(charge => (
                                <PaymentItem key={charge.id} payment={charge} />
                              ))}
                            </>
                          )}
                        </ContractsItemsListItemDescription>
                      </ContractsItemsListItem>
                    ) : (
                      <></>
                    )}
                  </>
                ))}
              </ContractsItemsList>
            )}
          </ContractsItems>
        </Contracts>
      </Content>
      <FooterPublic />
      <ToastContainer />
    </Container>
  );
};

export default ConsultDebts;
