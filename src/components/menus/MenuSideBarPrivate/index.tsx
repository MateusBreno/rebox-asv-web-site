// ./src/components/menus/MenuSideBarPrivate/index.tsx
import React, { useState } from 'react';

import { FaCarCrash } from 'react-icons/fa';
import {
  IoStatsChart,
  IoChevronForwardCircleSharp,
  IoPeople,
  IoWallet,
  IoCube,
  IoLogoUsd,
  IoCart,
  IoCarSport,
  IoHelpBuoy,
  IoBuild,
} from 'react-icons/io5';
import { useHistory } from 'react-router-dom';

import { Paragraph } from '@components/index';
import { ConfigRoutes, ConfigStyles } from '@config/index';

import {
  Container,
  ButtonExpande,
  Options,
  OptionNavigate,
  OptionNavigateItem,
  Divisor,
  Tag,
  Version,
} from './styles';

const MenuSideBarPrivate: React.FC = () => {
  const { location } = useHistory();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const activateMenuBasedOnRoute = (route: string): boolean => {
    return location.pathname.includes(route);
  };

  return (
    <Container isExpanded={isExpanded}>
      <ButtonExpande
        isExpanded={isExpanded}
        onClick={() => setIsExpanded(state => !state)}
      >
        <IoChevronForwardCircleSharp
          className={isExpanded ? 'to_spin' : 'normal'}
          size={22}
          title="ícone de expansão do menu"
          color={ConfigStyles.rebox.colors.black.main}
          opacity={0.3}
        />
      </ButtonExpande>
      {/* <Options>
        <OptionNavigate>
          {isExpanded && (
            <Paragraph
              nameColor="black"
              textAlign="start"
              opacity={0.3}
              style={{ fontWeight: 600, marginBottom: '4vh' }}
            >
              NAVEGAÇÃO
            </Paragraph>
          )}
          <OptionNavigateItem
            to={ConfigRoutes.rebox.privates.dashboad.path}
            isActive={activateMenuBasedOnRoute(
              ConfigRoutes.rebox.privates.dashboad.path,
            )}
            isExpanded={isExpanded}
          >
            <IoStatsChart
              size={isExpanded ? 20 : 24}
              title="ícone de dashboard"
              color={
                activateMenuBasedOnRoute(
                  ConfigRoutes.rebox.privates.dashboad.path,
                )
                  ? ConfigStyles.rebox.colors.blue.main
                  : ConfigStyles.rebox.colors.black.main
              }
            />
            {isExpanded && (
              <>
                <Paragraph
                  nameColor={
                    activateMenuBasedOnRoute(
                      ConfigRoutes.rebox.privates.dashboad.path,
                    )
                      ? 'blue'
                      : 'gray'
                  }
                  textAlign="start"
                  style={{
                    marginLeft: '1vw',
                    fontWeight: 500,
                  }}
                >
                  Dashboard
                </Paragraph>
                <Tag>Em breve</Tag>
              </>
            )}
          </OptionNavigateItem>

          <OptionNavigateItem
            to={ConfigRoutes.rebox.privates.users.path}
            isActive={activateMenuBasedOnRoute(
              ConfigRoutes.rebox.privates.users.path,
            )}
            isExpanded={isExpanded}
          >
            <IoPeople
              size={isExpanded ? 20 : 24}
              title="ícone de usuários"
              color={
                activateMenuBasedOnRoute(ConfigRoutes.rebox.privates.users.path)
                  ? ConfigStyles.rebox.colors.blue.main
                  : ConfigStyles.rebox.colors.black.main
              }
            />
            {isExpanded && (
              <Paragraph
                nameColor={
                  activateMenuBasedOnRoute(
                    ConfigRoutes.rebox.privates.users.path,
                  )
                    ? 'blue'
                    : 'gray'
                }
                textAlign="start"
                style={{
                  marginLeft: '1vw',
                  fontWeight: 500,
                }}
              >
                Usuários
              </Paragraph>
            )}
          </OptionNavigateItem>

          <OptionNavigateItem
            to={ConfigRoutes.rebox.privates.sales.path}
            isActive={activateMenuBasedOnRoute(
              ConfigRoutes.rebox.privates.sales.path,
            )}
            isExpanded={isExpanded}
          >
            <IoCart
              size={isExpanded ? 20 : 24}
              title="ícone de carrinho de compra"
              color={
                activateMenuBasedOnRoute(ConfigRoutes.rebox.privates.sales.path)
                  ? ConfigStyles.rebox.colors.blue.main
                  : ConfigStyles.rebox.colors.black.main
              }
            />
            {isExpanded && (
              <Paragraph
                nameColor={
                  activateMenuBasedOnRoute(
                    ConfigRoutes.rebox.privates.sales.path,
                  )
                    ? 'blue'
                    : 'gray'
                }
                textAlign="start"
                style={{
                  marginLeft: '1vw',
                  fontWeight: 500,
                }}
              >
                Vendas
              </Paragraph>
            )}
          </OptionNavigateItem>

          <OptionNavigateItem
            to={ConfigRoutes.rebox.privates.financial.path}
            isActive={activateMenuBasedOnRoute(
              ConfigRoutes.rebox.privates.financial.path,
            )}
            isExpanded={isExpanded}
          >
            <IoLogoUsd
              size={isExpanded ? 20 : 24}
              title="ícone de dinheiro"
              color={
                activateMenuBasedOnRoute(
                  ConfigRoutes.rebox.privates.financial.path,
                )
                  ? ConfigStyles.rebox.colors.blue.main
                  : ConfigStyles.rebox.colors.black.main
              }
            />
            {isExpanded && (
              <>
                <Paragraph
                  nameColor={
                    activateMenuBasedOnRoute(
                      ConfigRoutes.rebox.privates.financial.path,
                    )
                      ? 'blue'
                      : 'gray'
                  }
                  textAlign="start"
                  style={{
                    marginLeft: '1vw',
                    fontWeight: 500,
                  }}
                >
                  Financeiro
                </Paragraph>
              </>
            )}
          </OptionNavigateItem>

          <OptionNavigateItem
            to={ConfigRoutes.rebox.privates.called.path}
            isActive={activateMenuBasedOnRoute(
              ConfigRoutes.rebox.privates.called.path,
            )}
            isExpanded={isExpanded}
          >
            <FaCarCrash
              size={isExpanded ? 20 : 28}
              title="ícone de carro"
              color={
                activateMenuBasedOnRoute(
                  ConfigRoutes.rebox.privates.called.path,
                )
                  ? ConfigStyles.rebox.colors.blue.main
                  : ConfigStyles.rebox.colors.black.main
              }
            />
            {isExpanded && (
              <Paragraph
                nameColor={
                  activateMenuBasedOnRoute(
                    ConfigRoutes.rebox.privates.called.path,
                  )
                    ? 'blue'
                    : 'gray'
                }
                textAlign="start"
                style={{
                  marginLeft: '1vw',
                  fontWeight: 500,
                }}
              >
                Chamados
              </Paragraph>
            )}
          </OptionNavigateItem>

          <OptionNavigateItem
            to={ConfigRoutes.rebox.privates.tools.path}
            isActive={activateMenuBasedOnRoute(
              ConfigRoutes.rebox.privates.tools.path,
            )}
            isExpanded={isExpanded}
          >
            <IoBuild
              size={isExpanded ? 20 : 26}
              title="ícone de chave de boca"
              color={
                activateMenuBasedOnRoute(ConfigRoutes.rebox.privates.tools.path)
                  ? ConfigStyles.rebox.colors.blue.main
                  : ConfigStyles.rebox.colors.black.main
              }
            />
            {isExpanded && (
              <Paragraph
                nameColor={
                  activateMenuBasedOnRoute(
                    ConfigRoutes.rebox.privates.tools.path,
                  )
                    ? 'blue'
                    : 'gray'
                }
                textAlign="start"
                style={{
                  marginLeft: '1vw',
                  fontWeight: 500,
                }}
              >
                Ferramentas
              </Paragraph>
            )}
          </OptionNavigateItem>

          {/* <OptionNavigateItem
            to={ConfigRoutes.rebox.privates.products.path}
            isActive={activateMenuBasedOnRoute(
              ConfigRoutes.rebox.privates.products.path,
            )}
            isExpanded={isExpanded}
          >
            <IoCube
              size={isExpanded ? 20 : 24}
              title="ícone de caixa"
              color={
                activateMenuBasedOnRoute(
                  ConfigRoutes.rebox.privates.products.path,
                )
                  ? ConfigStyles.rebox.colors.blue.main
                  : ConfigStyles.rebox.colors.black.main
              }
            />
            {isExpanded && (
              <>
                <Paragraph
                  nameColor={
                    activateMenuBasedOnRoute(
                      ConfigRoutes.rebox.privates.products.path,
                    )
                      ? 'blue'
                      : 'gray'
                  }
                  textAlign="start"
                  style={{
                    marginLeft: '1vw',
                    fontWeight: 500,
                  }}
                >
                  Produtos
                </Paragraph>
                <Tag>Em breve</Tag>
              </>
            )}
          </OptionNavigateItem> * /}

          <OptionNavigateItem
            to={ConfigRoutes.rebox.privates.rescues.path}
            isActive={activateMenuBasedOnRoute(
              ConfigRoutes.rebox.privates.rescues.path,
            )}
            isExpanded={isExpanded}
          >
            <IoWallet
              size={isExpanded ? 20 : 24}
              title="ícone de carteira"
              color={
                activateMenuBasedOnRoute(
                  ConfigRoutes.rebox.privates.rescues.path,
                )
                  ? ConfigStyles.rebox.colors.blue.main
                  : ConfigStyles.rebox.colors.black.main
              }
            />
            {isExpanded && (
              <>
                <Paragraph
                  nameColor={
                    activateMenuBasedOnRoute(
                      ConfigRoutes.rebox.privates.rescues.path,
                    )
                      ? 'blue'
                      : 'gray'
                  }
                  textAlign="start"
                  style={{
                    marginLeft: '1vw',
                    fontWeight: 500,
                  }}
                >
                  Resgates
                </Paragraph>
              </>
            )}
          </OptionNavigateItem>

          <Divisor />

          <OptionNavigateItem
            to={ConfigRoutes.rebox.privates.help.path}
            isActive={activateMenuBasedOnRoute(
              ConfigRoutes.rebox.privates.help.path,
            )}
            isExpanded={isExpanded}
          >
            <IoHelpBuoy
              size={isExpanded ? 20 : 24}
              title="ícone de boia salva vidas"
              color={
                activateMenuBasedOnRoute(ConfigRoutes.rebox.privates.help.path)
                  ? ConfigStyles.rebox.colors.blue.main
                  : ConfigStyles.rebox.colors.black.main
              }
            />
            {isExpanded && (
              <>
                <Paragraph
                  nameColor={
                    activateMenuBasedOnRoute(
                      ConfigRoutes.rebox.privates.help.path,
                    )
                      ? 'blue'
                      : 'gray'
                  }
                  textAlign="start"
                  style={{
                    marginLeft: '1vw',
                    fontWeight: 500,
                  }}
                >
                  Ajuda
                </Paragraph>
                <Tag>Em breve</Tag>{' '}
              </>
            )}
          </OptionNavigateItem>
        </OptionNavigate>
      </Options> */}
      <Version isExpanded={isExpanded}>
        <Paragraph
          nameColor="black"
          fontSize={11}
          opacity={0.3}
          style={{ fontWeight: 500 }}
        >
          {isExpanded ? 'Versão 2.0' : 'v2.0'}
        </Paragraph>
      </Version>
    </Container>
  );
};

export default MenuSideBarPrivate;
