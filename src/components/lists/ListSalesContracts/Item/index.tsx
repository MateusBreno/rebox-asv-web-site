// ./src/components/lists/ListSalesContracts/Item/index.tsx
import React, { useState, useEffect } from 'react';

import { FiRepeat, FiCornerUpRight } from 'react-icons/fi';
import {
  IoEllipsisHorizontal,
  IoBan,
  IoCheckmarkCircle,
  IoFlag,
  IoAlertCircle,
  IoStopCircle,
} from 'react-icons/io5';

import {
  Paragraph,
  ModalContractCancele,
  ModalContractRestore,
} from '@components/index';
import {
  ConfigRoutes,
  ConfigStyles,
  ConfigTransition,
  ConfigValues,
} from '@config/index';
import Contract from '@models/Contract';
import { formatDate } from '@utils/formatters';
import { generateDate } from '@utils/generators';
import { validatorDate } from '@utils/validators';

import {
  Container,
  CompositeItem,
  CompositeItemText,
  Dropdown,
  DropdownItem,
  DropdownButton,
} from './styles';

interface IProps {
  contract: Contract;
}

const ListSalesContractsItem: React.FC<IProps> = ({ contract }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [gracePeriod, setGracePeriod] = useState<string>('');

  const [
    modalContractCancelIsOpen,
    setModalContractRevertIsOpen,
  ] = useState<boolean>(false);

  const changeModalContractRevertIsOpen = () => {
    setModalContractRevertIsOpen(prevState => !prevState);
    setIsExpanded(prevState => !prevState);
  };

  const getLicensePlate = (): string => {
    const { contracts_vehicles } = contract;

    if (contracts_vehicles && contracts_vehicles.length > 0) {
      const [firstItem] = contracts_vehicles;
      return firstItem.vehicle.license_plate.toUpperCase();
    }
    return `-`;
  };

  const getGracePeriod = (date: string | null | undefined): string => {
    if (!date) return ConfigTransition.rebox_contracts_type_grace_period.onHold;

    const [gracePeriodDate] = date.split(' ');

    const isReleased = validatorDate.hasPassed(
      gracePeriodDate,
      generateDate.now().split(' ')[0],
    );
    return isReleased
      ? `${formatDate.addMask(gracePeriodDate)}`
      : ConfigTransition.rebox_contracts_type_grace_period.finished;
  };
  // eslint-disable-next-line
  useEffect(() => {
    setGracePeriod(getGracePeriod(contract.grace_period_release_date));
  });
  return (
    <Container onClick={() => setIsExpanded(prevState => !prevState)}>
      <Paragraph nameColor="black" textAlign="start" fontSize={12}>
        {formatDate.addMask(contract.date.split(' ')[0])}
      </Paragraph>
      <Paragraph nameColor="black" textAlign="start" fontSize={12}>
        {contract.product?.name.toUpperCase()}
      </Paragraph>
      <Paragraph nameColor="black" textAlign="start" fontSize={12}>
        {getLicensePlate()}
      </Paragraph>
      <Paragraph nameColor="black" textAlign="start" fontSize={12}>
        {contract.user?.name.toUpperCase()}
      </Paragraph>
      <Paragraph nameColor="black" textAlign="start" fontSize={12}>
        {contract.user?.cpf || contract.user?.cnpj}
      </Paragraph>
      <CompositeItem>
        {ConfigValues.rebox.contract.current_payments_status.in_day ===
          contract.current_payments_status && (
          <IoCheckmarkCircle
            size={12}
            color={ConfigStyles.rebox.colors.greenEmerald.main}
          />
        )}

        {ConfigValues.rebox.contract.current_payments_status.waiting ===
          contract.current_payments_status && (
          <IoFlag size={12} color={ConfigStyles.rebox.colors.lightBlue.main} />
        )}

        {ConfigValues.rebox.contract.current_payments_status.overdue ===
          contract.current_payments_status && (
          <IoAlertCircle size={12} color={ConfigStyles.rebox.colors.red.main} />
        )}

        {ConfigValues.rebox.contract.current_payments_status.stop ===
          contract.current_payments_status && (
          <IoStopCircle size={12} color={ConfigStyles.rebox.colors.gray.main} />
        )}

        <CompositeItemText>
          {
            ConfigTransition.rebox_contracts_current_payments_status[
              contract.current_payments_status?.toLowerCase() || 'undefined'
            ]
          }
        </CompositeItemText>
      </CompositeItem>
      <Paragraph
        nameColor="black"
        textAlign="start"
        fontSize={11}
        style={{
          fontWeight: 600,
          color:
            gracePeriod ===
            ConfigTransition.rebox_contracts_type_grace_period.onHold
              ? ConfigStyles.rebox.colors.orangeCarrot.main
              : ConfigStyles.rebox.colors.black.main,
        }}
      >
        {gracePeriod}
      </Paragraph>

      <Paragraph nameColor="black" className="btn-options">
        <IoEllipsisHorizontal
          size={16}
          color={ConfigStyles.rebox.colors.black.main}
          style={{ cursor: 'pointer' }}
        />
      </Paragraph>
      <Dropdown
        expande={isExpanded}
        subPositionTop={
          contract?.status === ConfigValues.rebox.contract.status.deleted
        }
      >
        {contract?.status === ConfigValues.rebox.contract.status.canceled ? (
          <>
            <DropdownButton onClick={changeModalContractRevertIsOpen}>
              <FiRepeat
                size={16}
                title="ícone de bloqueio"
                color={ConfigStyles.rebox.colors.black.main}
              />
              <Paragraph
                nameColor="black"
                textAlign="start"
                fontSize={11}
                style={{
                  marginLeft: '1vw',
                  fontWeight: 500,
                }}
              >
                Restaurar
              </Paragraph>
            </DropdownButton>
            <ModalContractRestore
              contract_id={contract?.id || ''}
              isOpen={modalContractCancelIsOpen}
              change={changeModalContractRevertIsOpen}
            />
          </>
        ) : (
          <>
            {contract?.status !==
              ConfigValues.rebox.contract.status.deleted && (
              <>
                <DropdownButton onClick={changeModalContractRevertIsOpen}>
                  <IoBan
                    size={16}
                    title="ícone de bloqueio"
                    color={ConfigStyles.rebox.colors.black.main}
                  />
                  <Paragraph
                    nameColor="black"
                    textAlign="start"
                    fontSize={11}
                    style={{
                      marginLeft: '1vw',
                      fontWeight: 500,
                    }}
                  >
                    Cancelar
                  </Paragraph>
                </DropdownButton>
                <ModalContractCancele
                  contract_id={contract?.id || ''}
                  isOpen={modalContractCancelIsOpen}
                  change={changeModalContractRevertIsOpen}
                />
              </>
            )}
          </>
        )}
        <DropdownItem
          to={`${ConfigRoutes.rebox.privates.sales.next.contracts.path}/${contract.id}`}
        >
          <FiCornerUpRight
            size={16}
            title="ícone de editar"
            color={ConfigStyles.rebox.colors.black.main}
          />
          <Paragraph
            nameColor="black"
            textAlign="start"
            fontSize={11}
            style={{
              marginLeft: '1vw',
              fontWeight: 500,
            }}
          >
            Abrir
          </Paragraph>
        </DropdownItem>
      </Dropdown>
    </Container>
  );
};

export default ListSalesContractsItem;
