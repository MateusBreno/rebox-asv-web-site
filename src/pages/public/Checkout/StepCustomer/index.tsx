// ./src/pages/privates/Contract/New/Step/index.tsx
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { FormHandles } from '@unform/core';
import { IoCart, IoPersonCircleOutline } from 'react-icons/io5';
import { useLocation, useHistory } from 'react-router-dom';
import * as Yup from 'yup';

import {
  SubtitleSecondary,
  Paragraph,
  ButtonMain,
  ButtonDefault,
  InputSelect,
  InputMask,
  InputText,
  AlertSimpleCustom,
  ModalUserAuthenticate,
  ButtonOutline,
} from '@components/index';
import {
  ConfigLabel,
  ConfigRoutes,
  ConfigStorage,
  ConfigStyles,
  ConfigTransition,
  ConfigValues,
} from '@config/index';
import Product from '@models/Product';
import User from '@models/User';
import {
  apiRebox,
  newContractStorageService,
  sessionStorageService,
} from '@services/index';
import { getValidationErrors } from '@utils/errors';
import {
  formatCellphone,
  formatCNPJ,
  formatCPF,
  formatDate,
  formatMoney,
  formatText,
} from '@utils/formatters';
import { hotToast, toastify } from '@utils/notifiers';

import FormPersonalData from './FormPersonalData';
import { IStepsSale } from './typing';

import {
  Container,
  SectionsProduct,
  SectionsProductTitle,
  SectionsProductGroup,
  SectionsProductItem,
  SectionsIdentification,
  SectionsIdentificationGroup,
  SectionsIdentificationTitle,
  SectionsIdentificationResume,
  SectionsIdentificationResumeGroup,
  SectionsIdentificationResumeImage,
  SectionsIdentificationResumeImageAvatar,
  SectionsIdentificationResumeText,
  Buttons,
} from './styles';

interface IProps {
  myStep: number;
  currentStep: number;
  changeStep(newStep: number, willChangeHistory?: boolean): void;
}

const StepCustomer: React.FC<IProps> = ({
  myStep,
  currentStep,
  changeStep,
}) => {
  const { push } = useHistory();
  const useQuery = () => new URLSearchParams(useLocation().search);
  const params = useQuery();
  const formValidationRef = useRef<FormHandles>(null);

  const [loadingProduct, setLoadingProduct] = useState<boolean>(false);
  const [product, setProduct] = useState<Product>();
  const [fieldTypeChosen, setFieldTypeChosen] = useState<string>(
    newContractStorageService.getCustomer().field_type ||
      ConfigValues.rebox.default.outhers.sales_new.field_type.user_cpf,
  );
  const [customerStorage, setCustomerStorage] = useState<IStepsSale | null>(
    newContractStorageService.getCustomer(),
  );
  const [customerLoggedIn, setCustomerLoggedIn] = useState<User | null>(
    sessionStorageService.getUser(),
  );
  const [environment, setEnvironment] = useState<string>(() => {
    const {
      appCustomer,
      attendanceWhatsapp,
      landingPage,
      marketing,
      operacional,
    } = ConfigValues.rebox.user.environment;
    const cutOff: any = {
      lp: landingPage,
      mk: marketing,
      op: operacional,
      aw: attendanceWhatsapp,
      ap: appCustomer,
    };

    const env = params.get('e') || 'lp';

    return cutOff[env.toLowerCase()];
  });
  const [productSelected, setProductSelected] = useState<string>(
    params.get('p') || '',
  );
  const [sessionOpenedId, setSessionOpenedId] = useState<string>(
    params.get('s') || '',
  );

  const [modalSignIn, setModalSignIn] = useState<boolean>(false);

  const changeModalSignIn = () => {
    setModalSignIn(prevState => !prevState);
  };

  const getProduct = useCallback(async () => {
    let idHotToast = null;
    try {
      setLoadingProduct(prevState => !prevState);
      let productSave: Product = {} as Product;
      const productStorage = newContractStorageService.getProduct();
      let productId = productSelected || productStorage.id;

      // Se for o código do produto
      if (productId.length === 8) {
        const { data: responseProduct } = await apiRebox.get(
          `/products?code=${productId}`,
        );
        const [firstProduct] = responseProduct.data;
        if (firstProduct) {
          productSave = firstProduct;
          productId = firstProduct.id;
        }
      }

      if (productId) {
        const cartSale = newContractStorageService.getCart();
        if (!cartSale || (cartSale && cartSale.id !== productId)) {
          idHotToast = hotToast(
            'Adicionando produto no carrinho...',
            'loading',
          );
          if (!productSave.id) {
            const { data: responseProduct } = await apiRebox.get(
              `/products/${productId}`,
            );
            productSave = responseProduct.data;
          }
          newContractStorageService.updateProduct({
            id: productId,
            field_type: productStorage.field_type,
            query: productSave.classification,
          });
          newContractStorageService.updateCart(productSave);
          toastify('Produto adicionado no carrinho.', 'success');
        } else {
          productSave = cartSale;
        }
        setProduct(productSave);
      }
    } catch (error) {
      toastify('Não foi possível inserir produto no carrinho.', 'error');
    } finally {
      hotToast(idHotToast, 'dismiss');
      setLoadingProduct(prevState => !prevState);
    }
  }, [productSelected]);

  const handleLogOut = useCallback(async () => {
    const idHotToast = hotToast('Saindo...', 'loading');
    try {
      await apiRebox.put(`/sessions/${sessionStorageService.getId()}`, {});

      sessionStorageService.clean();
      newContractStorageService.cleanMany('customer');
      setCustomerStorage(null);
    } catch (error) {
      toastify('Sinto muito, houve um erro ao tentar fazer o logout.', 'error');
    } finally {
      hotToast(idHotToast, 'dismiss');
    }
  }, [customerLoggedIn]);

  const handleChooseProduct = useCallback(() => {
    push(ConfigRoutes.rebox.publics.plan.path);
  }, []);

  const customerSessionLauncher = useCallback(async () => {
    try {
      let userSessionOpened: User | null = null;
      if (sessionOpenedId) {
        const { data: responseSession } = await apiRebox.get(
          `/sessions/${sessionOpenedId}`,
        );
        const session = responseSession.data;
        sessionStorageService.updateRemember();
        sessionStorageService.update({
          sessions_id: session.id,
          token: session.token,
          user: session.user,
        });
        userSessionOpened = session.user;
        setCustomerLoggedIn(userSessionOpened);
      } else {
        userSessionOpened = sessionStorageService.getUser();
      }

      if (userSessionOpened) {
        const dataStorage: IStepsSale = {
          id: userSessionOpened.id || '',
          field_type:
            ConfigValues.rebox.default.outhers.checkout.stepCustomer.field_type
              .signIn,
          query: userSessionOpened.email,
        };
        newContractStorageService.updateCustomer(dataStorage);
        setCustomerStorage(dataStorage);
      }
    } catch (error) {}
  }, [sessionOpenedId]);

  useEffect(() => {
    const customerExist = newContractStorageService.getCustomer();
    if (customerExist.field_type !== fieldTypeChosen) {
      formValidationRef.current?.setData({
        query: '',
      });
    }
  }, [fieldTypeChosen]);

  useEffect(() => {
    sessionStorage.setItem(ConfigStorage.REBOX_USER_ENVIRONMENT, environment);
    getProduct();
    customerSessionLauncher();
  }, []);

  return (
    <Container>
      <SectionsProduct>
        <SectionsProductTitle>
          <IoCart
            size={24}
            title="ícone de carrinho de compra"
            color={ConfigStyles.rebox.colors.blue.main}
          />
          <SubtitleSecondary textAlign="start">Seu carrinho</SubtitleSecondary>
        </SectionsProductTitle>
        {loadingProduct ? (
          <Paragraph
            nameColor="black"
            textAlign="start"
            fontSize={ConfigStyles.rebox.fonts.size.paragraph.large}
            fontWeight={500}
          >
            Por favor, aguarde...
          </Paragraph>
        ) : (
          <>
            {product ? (
              <SectionsProductGroup>
                <SectionsProductItem>
                  <Paragraph
                    nameColor="black"
                    fontSize={ConfigStyles.rebox.fonts.size.paragraph.big}
                    fontWeight={600}
                    textAlign="start"
                  >
                    {`${product?.name}`.toUpperCase()}
                  </Paragraph>
                  <Paragraph
                    nameColor="black"
                    fontSize={ConfigStyles.rebox.fonts.size.paragraph.big}
                    fontWeight={500}
                    textAlign="end"
                  >
                    {formatMoney.fromNumberToPrice(
                      product?.promotional_price || product?.current_price || 0,
                    )}{' '}
                    / mês
                  </Paragraph>
                </SectionsProductItem>
                <Paragraph
                  nameColor="black"
                  fontSize={ConfigStyles.rebox.fonts.size.paragraph.big}
                  fontWeight={400}
                  textAlign="start"
                >
                  {product?.description
                    ? formatText.capitalizedFirstLetter(product.description)
                    : `Direito a ${product?.available_uses} utilizações durante um ano.`}
                </Paragraph>
              </SectionsProductGroup>
            ) : (
              <Paragraph
                nameColor="black"
                textAlign="start"
                fontSize={ConfigStyles.rebox.fonts.size.paragraph.large}
                fontWeight={500}
              >
                Seu carrinho está vazio
              </Paragraph>
            )}
          </>
        )}
      </SectionsProduct>

      {product ? (
        <>
          <SectionsIdentification>
            <SubtitleSecondary textAlign="start">Seus dados</SubtitleSecondary>
            <Paragraph
              textAlign="start"
              nameColor="black"
              opacity={0.8}
              fontWeight={500}
            >
              Antes de continuar, precisamos de alguns dados seus.
            </Paragraph>

            {customerStorage?.id ? (
              <>
                {customerStorage?.field_type ===
                  ConfigValues.rebox.default.outhers.checkout.stepCustomer
                    .field_type.signIn && (
                  <SectionsIdentificationResume>
                    <SectionsIdentificationResumeGroup>
                      <SectionsIdentificationResumeImage>
                        {customerLoggedIn?.image_url ? (
                          <SectionsIdentificationResumeImageAvatar
                            src={customerLoggedIn?.image_url}
                          />
                        ) : (
                          <IoPersonCircleOutline
                            color={ConfigStyles.rebox.colors.black.main}
                            size={80}
                          />
                        )}
                      </SectionsIdentificationResumeImage>

                      <SectionsIdentificationResumeText>
                        <Paragraph
                          nameColor="black"
                          textAlign="start"
                          fontWeight={600}
                        >
                          {formatText.fullCapitalized(
                            customerLoggedIn?.name || '',
                          )}
                        </Paragraph>
                        <Paragraph nameColor="black" textAlign="start">
                          {customerLoggedIn?.email}
                        </Paragraph>
                        <Paragraph
                          nameColor="greenEmerald"
                          textAlign="start"
                          fontWeight={600}
                        >
                          Logado
                        </Paragraph>
                      </SectionsIdentificationResumeText>
                    </SectionsIdentificationResumeGroup>
                    <ButtonOutline
                      onClick={handleLogOut}
                      style={{ maxWidth: '100px' }}
                    >
                      Sair
                    </ButtonOutline>
                  </SectionsIdentificationResume>
                )}
                {customerStorage?.field_type ===
                  ConfigValues.rebox.default.outhers.checkout.stepCustomer
                    .field_type.register && (
                  <FormPersonalData
                    forNewSale={{
                      advanceStep: () => {
                        changeStep(currentStep + 1);
                      },
                    }}
                  />
                )}
              </>
            ) : (
              <>
                <AlertSimpleCustom
                  text={`Se você já é CLIENTE REBOX, clique abaixo no botão "Entrar" e prossiga com a sua conta.`}
                  type="warning"
                />

                <ButtonMain
                  style={{ maxWidth: '200px' }}
                  onClick={changeModalSignIn}
                >
                  Entrar
                </ButtonMain>

                <SectionsIdentificationTitle>
                  <SubtitleSecondary
                    textAlign="start"
                    nameColor="black"
                    fontWeight={600}
                  >
                    Cadastre-se
                  </SubtitleSecondary>
                  <Paragraph
                    textAlign="start"
                    nameColor="black"
                    opacity={0.8}
                    fontWeight={500}
                  >
                    Se essa for a sua 1ª vez na Rebox, cadastre-se abaixo:
                  </Paragraph>
                </SectionsIdentificationTitle>

                <FormPersonalData
                  forNewSale={{
                    advanceStep: () => {
                      changeStep(currentStep + 1);
                    },
                  }}
                />
              </>
            )}
          </SectionsIdentification>

          <Buttons>
            {customerStorage?.field_type === 'SIGN_IN' && (
              <ButtonMain
                onClick={() => changeStep(currentStep + 1)}
                style={{ marginRight: '10px', maxWidth: 200 }}
              >
                Continuar
              </ButtonMain>
            )}

            <ButtonDefault
              onClick={handleChooseProduct}
              style={{ maxWidth: 200 }}
            >
              Voltar
            </ButtonDefault>
          </Buttons>

          <ModalUserAuthenticate
            isOpen={modalSignIn}
            change={changeModalSignIn}
            forNewSale={{ advanceStep: () => changeStep(currentStep + 1) }}
          />
        </>
      ) : (
        <>
          <AlertSimpleCustom
            text={`Para continuar em sua compra, por favor escolha um de nossos produtos.`}
            type="warning"
          />
          <ButtonMain onClick={handleChooseProduct} style={{ maxWidth: 250 }}>
            Ir escolher produto
          </ButtonMain>
        </>
      )}
    </Container>
  );
};

export default StepCustomer;
