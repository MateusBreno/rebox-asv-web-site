// ./src/components/lists/ListUserProviders/Item/index.tsx
import React, { useState } from 'react';

import {
  IoEllipsisHorizontal,
  IoEllipse,
  IoCreate,
  IoTrash,
} from 'react-icons/io5';

import { Paragraph } from '@components/index';
import { ConfigStyles, ConfigTransition, ConfigValues } from '@config/index';
import User from '@models/User';

import {
  Container,
  CompositeItem,
  CompositeItemText,
  Dropdown,
  DropdownItem,
  DropdownButton,
} from './styles';

interface IProps {
  user: User;
}

const ListUserProvidersItem: React.FC<IProps> = ({ user }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  return (
    <Container onClick={() => setIsExpanded(prevState => !prevState)}>
      <Paragraph nameColor="black" textAlign="start" fontSize={12}>
        {user.name.toUpperCase()}
      </Paragraph>
      <Paragraph nameColor="black" textAlign="start" fontSize={12}>
        {user.cpf || user.cnpj}
      </Paragraph>
      <Paragraph nameColor="black" textAlign="start" fontSize={12}>
        {user.email}
      </Paragraph>
      <Paragraph nameColor="black" textAlign="start" fontSize={12}>
        {user.cellphone}
      </Paragraph>
      <CompositeItem>
        <IoEllipse
          size={10}
          color={
            ConfigValues.rebox.user.status.active === user.status
              ? ConfigStyles.rebox.colors.greenEmerald.main
              : ConfigStyles.rebox.colors.black.opacity.average
          }
        />
        <CompositeItemText>
          {
            ConfigTransition.rebox_user_status[
              user.status.toLowerCase() || 'undefined'
            ]
          }
        </CompositeItemText>
      </CompositeItem>

      <Paragraph nameColor="black" textAlign="start" fontSize={12}>
        Indisponível
      </Paragraph>
      <Paragraph nameColor="black" className="btn-options">
        <IoEllipsisHorizontal
          size={16}
          color={ConfigStyles.rebox.colors.black.main}
          style={{ cursor: 'pointer' }}
        />
      </Paragraph>
      <Dropdown expande={isExpanded}>
        <DropdownItem to={`/usuarios/clientes/${user.id}`}>
          <IoCreate
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
            Editar
          </Paragraph>
        </DropdownItem>

        <DropdownButton>
          <IoTrash
            size={16}
            title="ícone de lixeira"
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
            Excluir
          </Paragraph>
        </DropdownButton>
      </Dropdown>
    </Container>
  );
};

export default ListUserProvidersItem;
