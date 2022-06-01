// ./src/components/lists/ListRescues/Item/index.tsx
import React, { useState, useEffect } from 'react';

import { FiDownload } from 'react-icons/fi';
import {
  IoEllipsisHorizontal,
  IoCheckmarkCircle,
  IoCheckmarkCircleOutline,
  IoFlag,
  IoAlertCircle,
  IoStopCircle,
} from 'react-icons/io5';

import { Paragraph } from '@components/index';
import { ConfigStyles, ConfigTransition, ConfigValues } from '@config/index';
import Rescue from '@models/Rescue';
import { apiRebox } from '@services/index';
import { formatDate, formatMoney } from '@utils/formatters';
import { generateDate } from '@utils/generators';
import { toastify } from '@utils/notifiers';
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
  rescue: Rescue;
}

const ListRescuesItem: React.FC<IProps> = ({ rescue: rescueData }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [rescue, setRescue] = useState<Rescue>(rescueData);

  const handlePayRescue = async () => {
    try {
      const { data: responseRescue } = await apiRebox.put(
        `/rescues/${rescue?.id}`,
        {
          ...rescue,
          status: ConfigValues.rebox.rescue.status.paid,
          date_payment: generateDate.now(),
        },
      );
      const { header, data } = responseRescue;
      setRescue(data);
      toastify(header.message, 'success');
      setIsExpanded(prevState => !prevState);
    } catch (error: any) {
      toastify(
        error.response.data.error ||
          'Sinto muito, não foi possível registrar o pagamento do resgate.',
        'error',
      );
    }
  };

  return (
    <Container onClick={() => setIsExpanded(prevState => !prevState)}>
      <Paragraph nameColor="black" textAlign="start" fontSize={12}>
        {formatDate.addMask(rescue.date.split(' ')[0])}
      </Paragraph>
      <Paragraph nameColor="black" textAlign="start" fontSize={12}>
        {rescue.code}
      </Paragraph>
      <Paragraph nameColor="black" textAlign="start" fontSize={12}>
        {rescue.user?.name.toUpperCase()}
      </Paragraph>
      <Paragraph nameColor="black" textAlign="start" fontSize={12}>
        {rescue.user?.cpf || rescue.user?.cnpj}
      </Paragraph>
      <Paragraph nameColor="black" textAlign="start" fontSize={12}>
        {formatMoney.fromNumberToPrice(rescue.amount)}
      </Paragraph>
      <CompositeItem>
        {ConfigValues.rebox.rescue.status.paid === rescue.status && (
          <IoCheckmarkCircle
            size={12}
            color={ConfigStyles.rebox.colors.greenEmerald.main}
          />
        )}

        {ConfigValues.rebox.rescue.status.pending === rescue.status && (
          <IoFlag size={12} color={ConfigStyles.rebox.colors.lightBlue.main} />
        )}

        {ConfigValues.rebox.rescue.status.reject === rescue.status && (
          <IoAlertCircle size={12} color={ConfigStyles.rebox.colors.red.main} />
        )}

        {ConfigValues.rebox.rescue.status.canceled === rescue.status && (
          <IoStopCircle size={12} color={ConfigStyles.rebox.colors.gray.main} />
        )}

        <CompositeItemText>
          {
            ConfigTransition.rebox_rescues_status[
              rescue.status?.toLowerCase() || 'undefined'
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
          color: rescue.date_payment
            ? ConfigStyles.rebox.colors.black.main
            : ConfigStyles.rebox.colors.orangeCarrot.main,
        }}
      >
        {rescue.date_payment
          ? formatDate.addMask(rescue.date_payment.split(' ')[0])
          : 'Em espera'}
      </Paragraph>

      <Paragraph nameColor="black" className="btn-options">
        <IoEllipsisHorizontal
          size={16}
          color={ConfigStyles.rebox.colors.black.main}
          style={{ cursor: 'pointer' }}
        />
      </Paragraph>
      <Dropdown expande={isExpanded}>
        {/* <DropdownItem to={`/usuarios/clientes/${rescue.id}`}>
          <IoCreate size={16} title="ícone de editar" color={ConfigStyles.rebox.colors.black.main} />
          <Paragraph
            nameColor="black"
            textAlign="start"
            fontSize={11}
            style={{
              marginLeft: '1vw',
              fontWeight: 500,
            }}
          >
            Editar
          </Paragraph>
        </DropdownItem> */}

        {ConfigValues.rebox.rescue.status.paid === rescue.status ? (
          <DropdownButton
            onClick={() =>
              toastify('Emissão de comprovante em manutenção.', 'info')
            }
          >
            <FiDownload
              size={16}
              title="ícone de download"
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
              Comprov.
            </Paragraph>
          </DropdownButton>
        ) : (
          <DropdownButton onClick={handlePayRescue}>
            <IoCheckmarkCircleOutline
              size={16}
              title="ícone de check"
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
              Paguei
            </Paragraph>
          </DropdownButton>
        )}
      </Dropdown>
    </Container>
  );
};

export default ListRescuesItem;
