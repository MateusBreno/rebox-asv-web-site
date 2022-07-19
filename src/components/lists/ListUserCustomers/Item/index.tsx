// ./src/components/lists/ListUserCustomers/Item/index.tsx
import React, { useState } from 'react';

import { FiCornerUpRight } from 'react-icons/fi';
import { IoEllipsisHorizontal, IoEllipse, IoGiftSharp } from 'react-icons/io5';

import { Paragraph } from '@components/index';
import {
  ConfigRoutes,
  ConfigStyles,
  ConfigTransition,
  ConfigValues,
} from '@config/index';
import User from '@models/User';

import {
  Container,
  CompositeItem,
  CompositeItemText,
  Dropdown,
  DropdownItem,
} from './styles';

interface IProps {
  user: User;
}

const ListUserCustomersItem: React.FC<IProps> = ({ user }) => {
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
      {user.epharma_holder_id ? (
        <CompositeItem>
          <IoGiftSharp size={10} color={ConfigStyles.rebox.colors.blue.main} />
          <CompositeItemText>Cadastrado</CompositeItemText>
        </CompositeItem>
      ) : (
        <CompositeItem>
          <IoGiftSharp
            size={10}
            color={ConfigStyles.rebox.colors.black.opacity.average}
            opacity={0.6}
          />
          <CompositeItemText>Aguardando</CompositeItemText>
        </CompositeItem>
      )}

      <Paragraph nameColor="black" className="btn-options">
        <IoEllipsisHorizontal
          size={16}
          color={ConfigStyles.rebox.colors.black.main}
          style={{ cursor: 'pointer' }}
        />
      </Paragraph>
      <Dropdown expande={isExpanded}>
        {/* <DropdownButton>
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
            Suspender
          </Paragraph>
        </DropdownButton> */}
        <DropdownItem
          to={`${ConfigRoutes.rebox.privates.users.next.customers.path}/${user.id}`}
        >
          <FiCornerUpRight
            size={16}
            title="ícone de seta"
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

export default ListUserCustomersItem;
