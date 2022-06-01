// ./src/components/lists/ListIndications/Item/index.tsx
import React, { useState, useEffect } from 'react';

import { FaHistory } from 'react-icons/fa';
import { FiCornerUpRight, FiDownload } from 'react-icons/fi';
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
import Indication from '@models/Indication';
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
  indication: Indication;
}

const ListIndicationsItem: React.FC<IProps> = ({ indication }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  return (
    <Container onClick={() => setIsExpanded(prevState => !prevState)}>
      <Paragraph nameColor="black" textAlign="start" fontSize={12}>
        {formatDate.addMask(indication.date.split(' ')[0])}
      </Paragraph>
      <Paragraph nameColor="black" textAlign="start" fontSize={12}>
        {indication.user_indicated?.name.toUpperCase()}
      </Paragraph>
      <Paragraph nameColor="black" textAlign="start" fontSize={12}>
        {indication?.user_indicated?.cpf || indication?.user_indicated?.cnpj}
      </Paragraph>
      <Paragraph nameColor="black" textAlign="start" fontSize={12}>
        {indication?.user_who_indicated?.cpf ||
          indication?.user_who_indicated?.cnpj}
      </Paragraph>
      <CompositeItem>
        {ConfigValues.rebox.indication.status.effective ===
          indication?.status && (
          <IoCheckmarkCircle
            size={12}
            color={ConfigStyles.rebox.colors.greenEmerald.main}
          />
        )}

        {ConfigValues.rebox.indication.status.created === indication.status && (
          <IoFlag size={12} color={ConfigStyles.rebox.colors.lightBlue.main} />
        )}

        {ConfigValues.rebox.indication.status.canceled ===
          indication.status && (
          <IoStopCircle size={12} color={ConfigStyles.rebox.colors.gray.main} />
        )}

        <CompositeItemText>
          {
            ConfigTransition.rebox_indications_status[
              indication.status?.toLowerCase() || 'undefined'
            ]
          }
        </CompositeItemText>
      </CompositeItem>
      <Paragraph nameColor="black" textAlign="start" fontSize={12}>
        {formatMoney.fromNumberToPrice(indication.cash_bonus)}
      </Paragraph>
      <CompositeItem>
        <FaHistory
          size={11}
          color={
            indication.renewal_number === 0
              ? ConfigStyles.rebox.colors.gray.main
              : ConfigStyles.rebox.colors.lightBlue.main
          }
        />

        <CompositeItemText>{indication.renewal_number}</CompositeItemText>
      </CompositeItem>

      <Paragraph nameColor="black" className="btn-options">
        <IoEllipsisHorizontal
          size={16}
          color={ConfigStyles.rebox.colors.black.main}
          style={{ cursor: 'pointer' }}
        />
      </Paragraph>
      <Dropdown expande={isExpanded}>
        {/* <DropdownItem to={`/usuarios/clientes/${indication.id}`}>
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

        <DropdownButton
          onClick={() =>
            toastify('Expansão da indicação está em manutenção.', 'info')
          }
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
        </DropdownButton>
      </Dropdown>
    </Container>
  );
};

export default ListIndicationsItem;
