import React, { useCallback, useEffect, useState } from 'react';

import {
  FaLockOpen,
  FaMapMarkedAlt,
  FaPercent,
  FaRegCalendarAlt,
} from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
// import { EmailShareButton } from 'react-share';
import SwiperCore, {
  A11y,
  Autoplay,
  Lazy,
  Navigation,
  Pagination,
  Scrollbar,
} from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';

import {
  IconArrowLeftWhite,
  IconCar,
  IconDollar,
  IconPercentage,
  IconStar,
  IconTime,
  IconValidity,
  IconChoice,
  IconRegister,
  IconFormOfPayment,
  IconEmergencyCall,
  IconClock,
  IconHatchback,
  IconMoto,
  IconFurgao,
} from '@assets/icons/index';
import { ImageBenefits, ImageFaq } from '@assets/images/index';
import {
  FooterPublic,
  HeaderNavigationPublic,
  MenuSideBarPublic,
  TitleMain,
  TitleSecondary,
  SubtitleMain,
  SubtitleSecondary,
  Paragraph,
} from '@components/index';
import {
  ConfigValues,
  ConfigBase,
  ConfigStyles,
  ConfigStorage,
} from '@config/index';
import Product from '@models/Product';
import User from '@models/User';
import { apiRebox, sessionStorageService } from '@services/index';
import { toastify } from '@utils/notifiers';

import ProductItem from './ProductItem';

import {
  Container,
  SectionsTitles,
  SectionsVideo,
  SectionsVideoGroup,
  SectionsVideoPlay,
  SectionsVideoPlayOptions,
  SectionsVideoInformation,
  SectionsBenefits,
  SectionsBenefitsTitle,
  SectionsBenefitsDiscounts,
  SectionsBenefitsDiscountsImage,
  SectionsBenefitsDiscountsGroup,
  SectionsBenefitsDiscountsItem,
  SectionsBenefitsOffer,
  SectionsBenefitsOfferItem,
  SectionsBenefitsOfferItemIcon,
  SectionsSteps,
  SectionsStepsTitle,
  SectionsStepsGroup,
  SectionsStepsGroupItem,
  SectionsStepsGroupItemDescription,
  SectionsPlans,
  SectionsPlansTitle,
  SectionsPlansOptions,
  SectionsPlansOptionsGroup,
  SectionsPlansOptionsItem,
  SectionsPlansOptionsItemGroup,
  ButtonSpeakSupport,
  ButtonSpeakSupportOutline,
  MaterialLink,
  ButtonChoosePlan,
  ChoosePlanLink,
  OurPlansInformationLegend,
  SliderContainer,
  Support,
  SupportContainer,
  SupportImage,
  SupportInfo,
  SupportInfoDescription,
  SupportInfoTitle,
  TermosOfUses,
  TermosOfUsesLink,
} from './styles';

SwiperCore.use([A11y, Pagination, Navigation, Scrollbar, Autoplay, Lazy]);

const SWIPER_LIMIT_DELAY_IN_MM = 10000;
const Plans: React.FC = () => {
  const useQuery = () => new URLSearchParams(useLocation().search);
  // const { signUpUserData, updateSignUpUserData } = useSignUp();
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [user, setUser] = useState<User | null>(
    sessionStorageService.getUser(),
  );

  // Parâmetros na URL
  const [codeOfWhoIsReferring, setCodeOfWhoIsReferring] = useState<
    string | null
  >(useQuery().get('i'));
  const [environment, setEnvironment] = useState<string>(
    useQuery().get('e') || ConfigValues.rebox.user.environment.landingPage,
  );

  const [showPlansByVehicleSize, setShowPlansByVehicleSize] =
    useState<number>(1);

  const getProducts = useCallback(async () => {
    try {
      // setLoading(true);

      const response = await apiRebox.get(
        `/products?details=all&per_page=1000&type=${ConfigValues.rebox.product.type.plan}&category=${ConfigValues.rebox.product.category.vehicle_assistance}`,
      );

      const { header, data } = response.data;

      setProducts(data);
    } catch (error) {
      toastify('Houve um erro no carregamento da página.', 'error');
    }
  }, []);

  useEffect(() => {
    getProducts();
    sessionStorage.setItem(ConfigStorage.REBOX_USER_ENVIRONMENT, environment);
    if (codeOfWhoIsReferring) {
      sessionStorage.setItem(
        ConfigStorage.REBOX_USER_CODE_WHO_INDICATED,
        codeOfWhoIsReferring,
      );
    }
  }, []);

  const handleOpenSidebar = useCallback(() => {
    setSidebarIsOpen(!sidebarIsOpen);
  }, [sidebarIsOpen]);

  return (
    <Container>
      <MenuSideBarPublic
        handleOpenSidebar={handleOpenSidebar}
        sidebarIsOpen={sidebarIsOpen}
      />

      <HeaderNavigationPublic handleOpenSidebar={handleOpenSidebar} />

      <SectionsTitles>
        <TitleMain style={{ marginBottom: '2vh' }}>
          Conheça nossos planos de assistência veicular 24h
        </TitleMain>
        <SubtitleSecondary nameColor="black" opacity={0.6} fontWeight={500}>
          Pague apenas alguns centavos por dia e fique tranquilo!
        </SubtitleSecondary>
      </SectionsTitles>

      <SectionsVideo>
        <SectionsVideoGroup>
          <SectionsVideoPlay autoPlay={true} controls>
            <SectionsVideoPlayOptions
              src="https://rebox.com.br/external/assets/videos/rebox-frase.mp4"
              type="video/mp4"
            />
            <SectionsVideoPlayOptions
              src="https://rebox.com.br/external/assets/videos/rebox-frase.ogg"
              type="video/ogg"
            />
            <SectionsVideoPlayOptions
              src="https://rebox.com.br/external/assets/videos/rebox-frase.webm"
              type="video/webm
              "
            />
          </SectionsVideoPlay>
          <SectionsVideoInformation>
            <TitleSecondary style={{ marginBottom: '2vh' }}>
              Conheça a Rebox
            </TitleSecondary>
            <Paragraph
              nameColor="black"
              fontSize={ConfigStyles.rebox.fonts.size.paragraph.extraLarge}
              fontWeight={500}
            >
              Não somos seguradora. Somos uma plataforma online de assistência
              veicular 24h, voltada para cuidar do seu carro no momento em que
              você mais precisar.
            </Paragraph>
          </SectionsVideoInformation>
        </SectionsVideoGroup>
      </SectionsVideo>

      <SectionsBenefits>
        <SectionsBenefitsTitle>
          <TitleMain style={{ marginBottom: '2vh' }}>
            Confira nossos diferenciais
          </TitleMain>
          <SubtitleSecondary nameColor="black" opacity={0.6} fontWeight={500}>
            O melhor lugar para cuidar do seu veículo é aqui, na Rebox!
          </SubtitleSecondary>
        </SectionsBenefitsTitle>

        <SectionsBenefitsDiscounts>
          <SectionsBenefitsDiscountsImage>
            <ImageBenefits />
          </SectionsBenefitsDiscountsImage>

          <SectionsBenefitsDiscountsGroup>
            <SectionsBenefitsDiscountsItem>
              <FaLockOpen
                color={ConfigStyles.rebox.colors.blue.main}
                size={24}
              />
              <Paragraph nameColor="black" fontWeight={600} textAlign="start">
                Sem fidelidade (Contrate e Cancele quando quiser)
              </Paragraph>
            </SectionsBenefitsDiscountsItem>

            <SectionsBenefitsDiscountsItem>
              <FaMapMarkedAlt
                color={ConfigStyles.rebox.colors.blue.main}
                size={24}
              />
              <Paragraph nameColor="black" fontWeight={600} textAlign="start">
                Atendimento em todo o Brasil
              </Paragraph>
            </SectionsBenefitsDiscountsItem>

            <SectionsBenefitsDiscountsItem>
              <FaRegCalendarAlt
                color={ConfigStyles.rebox.colors.blue.main}
                size={24}
              />
              <Paragraph nameColor="black" fontWeight={600} textAlign="start">
                Maior número de utilizações no ano
              </Paragraph>
            </SectionsBenefitsDiscountsItem>

            {/* <SectionsBenefitsDiscountsItem>
              <FaPercent
                color={ConfigStyles.rebox.colors.blue.main}
                size={20}
              />
              <Paragraph nameColor="black" fontWeight={600} textAlign="start">
                Descontos especiais em oficinas e autopeças
              </Paragraph>
            </SectionsBenefitsDiscountsItem>

            <SectionsBenefitsDiscountsItem>
              <FaPercent
                color={ConfigStyles.rebox.colors.blue.main}
                size={20}
              />
              <Paragraph nameColor="black" fontWeight={600} textAlign="start">
                Desconto de até 60% em faculdades
              </Paragraph>
            </SectionsBenefitsDiscountsItem> */}

            <SectionsBenefitsDiscountsItem>
              <FaPercent
                color={ConfigStyles.rebox.colors.blue.main}
                size={20}
              />
              <Paragraph nameColor="black" fontWeight={600} textAlign="start">
                Desconto de até 80% em medicamentos
              </Paragraph>
            </SectionsBenefitsDiscountsItem>

            {/* <SectionsBenefitsDiscountsItem>
              <FaPercent
                color={ConfigStyles.rebox.colors.blue.main}
                size={20}
              />
              <Paragraph nameColor="black" fontWeight={600} textAlign="start">
                Desconto em mais de 18 mil lojas pelo brasil
              </Paragraph>
            </SectionsBenefitsDiscountsItem> */}
          </SectionsBenefitsDiscountsGroup>
        </SectionsBenefitsDiscounts>

        <SectionsBenefitsOffer>
          <SectionsBenefitsOfferItem>
            <SectionsBenefitsOfferItemIcon>
              <IconValidity />
            </SectionsBenefitsOfferItemIcon>
            <Paragraph nameColor="black" fontWeight={600}>
              Vigência <br />
              anual
            </Paragraph>
          </SectionsBenefitsOfferItem>

          <SectionsBenefitsOfferItem>
            <SectionsBenefitsOfferItemIcon>
              <IconTime />
            </SectionsBenefitsOfferItemIcon>
            <Paragraph nameColor="black" fontWeight={600}>
              Carência de <br />3 dias úteis
            </Paragraph>
          </SectionsBenefitsOfferItem>

          <SectionsBenefitsOfferItem>
            <SectionsBenefitsOfferItemIcon>
              <IconCar />
            </SectionsBenefitsOfferItemIcon>
            <Paragraph nameColor="black" fontWeight={600}>
              Veículos de
              <br />
              até 30 anos
            </Paragraph>
          </SectionsBenefitsOfferItem>

          <SectionsBenefitsOfferItem>
            <SectionsBenefitsOfferItemIcon>
              <IconDollar />
            </SectionsBenefitsOfferItemIcon>
            <Paragraph nameColor="black" fontWeight={600}>
              Sem taxa <br />
              de adesão
            </Paragraph>
          </SectionsBenefitsOfferItem>
        </SectionsBenefitsOffer>
      </SectionsBenefits>

      <SectionsSteps>
        <SectionsStepsTitle>
          <SubtitleSecondary nameColor="white" fontWeight={500}>
            Nossos planos dão direito a assistência veicular 24 horas em todo o
            Brasil e uma rede de benefícios para nossos clientes!
          </SubtitleSecondary>
          <TitleMain
            nameColor="white"
            fontSize={ConfigStyles.rebox.fonts.size.title.medium}
            fontWeight={600}
            style={{ margin: '4vh 0' }}
          >
            Como funciona?
          </TitleMain>
        </SectionsStepsTitle>

        <SectionsStepsGroup>
          <SectionsStepsGroupItem>
            <IconChoice />
            <SectionsStepsGroupItemDescription>
              <Paragraph
                nameColor="white"
                textAlign="start"
                fontSize={ConfigStyles.rebox.fonts.size.paragraph.extraLarge}
                fontWeight={600}
                style={{ marginBottom: '1.5vh' }}
              >
                1º Escolha um dos nossos planos
              </Paragraph>
              <Paragraph
                nameColor="white"
                textAlign="start"
                fontSize={ConfigStyles.rebox.fonts.size.paragraph.big}
                fontWeight={400}
              >
                Escolha o plano perfeito para seu carro, e clique em
                {` "comprar"`}.
              </Paragraph>
            </SectionsStepsGroupItemDescription>
          </SectionsStepsGroupItem>

          <SectionsStepsGroupItem>
            <IconRegister />
            <SectionsStepsGroupItemDescription>
              <Paragraph
                nameColor="white"
                textAlign="start"
                fontSize={ConfigStyles.rebox.fonts.size.paragraph.extraLarge}
                fontWeight={600}
                style={{ marginBottom: '1.5vh' }}
              >
                2º Complete seu cadastro
              </Paragraph>
              <Paragraph
                nameColor="white"
                textAlign="start"
                fontSize={ConfigStyles.rebox.fonts.size.paragraph.big}
                fontWeight={400}
              >
                Sem burocracia, você contrata seu plano em apenas 2 minutos.
              </Paragraph>
            </SectionsStepsGroupItemDescription>
          </SectionsStepsGroupItem>

          <SectionsStepsGroupItem>
            <IconFormOfPayment />
            <SectionsStepsGroupItemDescription>
              <Paragraph
                nameColor="white"
                textAlign="start"
                fontSize={ConfigStyles.rebox.fonts.size.paragraph.extraLarge}
                fontWeight={600}
                style={{ marginBottom: '1.5vh' }}
              >
                3º Escolha a forma de pagamento
              </Paragraph>
              <Paragraph
                nameColor="white"
                textAlign="start"
                fontSize={ConfigStyles.rebox.fonts.size.paragraph.big}
                fontWeight={400}
              >
                Pode ser no cartão de crédito em até 12x sem juros ou no boleto.
                Caso escolha o boleto, enviaremos para seu e-mail todo mês. Não
                enviamos pelos correios!
              </Paragraph>
            </SectionsStepsGroupItemDescription>
          </SectionsStepsGroupItem>

          <SectionsStepsGroupItem>
            <IconClock />
            <SectionsStepsGroupItemDescription>
              <Paragraph
                nameColor="white"
                textAlign="start"
                fontSize={ConfigStyles.rebox.fonts.size.paragraph.extraLarge}
                fontWeight={600}
                style={{ marginBottom: '1.5vh' }}
              >
                4º Carência para usar o serviço
              </Paragraph>
              <Paragraph
                nameColor="white"
                textAlign="start"
                fontSize={ConfigStyles.rebox.fonts.size.paragraph.big}
                fontWeight={400}
              >
                Ao finalizar sua compra, nós geramos o seu contrato. Após a
                confirmação do pagamento da 1ª cobrança, seu contrato é ativado
                e inicia o prazo de carência.
              </Paragraph>
            </SectionsStepsGroupItemDescription>
          </SectionsStepsGroupItem>

          <SectionsStepsGroupItem>
            <IconEmergencyCall />
            <SectionsStepsGroupItemDescription>
              <Paragraph
                nameColor="white"
                textAlign="start"
                fontSize={ConfigStyles.rebox.fonts.size.paragraph.extraLarge}
                fontWeight={600}
                style={{ marginBottom: '1.5vh' }}
              >
                5º E pronto! Agora é só usar.
              </Paragraph>
              <Paragraph
                nameColor="white"
                textAlign="start"
                fontSize={ConfigStyles.rebox.fonts.size.paragraph.big}
                fontWeight={400}
              >
                Após cumprir o prazo de carência, você poderá solicitar os
                serviços quando precisar.
              </Paragraph>
            </SectionsStepsGroupItemDescription>
          </SectionsStepsGroupItem>
        </SectionsStepsGroup>
      </SectionsSteps>

      <SectionsPlans>
        <SectionsPlansTitle>
          <TitleMain
            fontSize={ConfigStyles.rebox.fonts.size.title.medium}
            fontWeight={600}
            style={{ marginBottom: '6vh' }}
          >
            Escolha seu plano
          </TitleMain>
        </SectionsPlansTitle>

        <SectionsPlansOptions>
          <SectionsPlansOptionsGroup>
            <SectionsPlansOptionsItem
              isButtonActive={showPlansByVehicleSize === 1}
              onClick={() => setShowPlansByVehicleSize(1)}
            >
              <SectionsPlansOptionsItemGroup>
                <IconMoto />
                <Paragraph
                  nameColor="black"
                  fontSize={ConfigStyles.rebox.fonts.size.paragraph.big}
                  fontWeight={500}
                >
                  Motos / Triciclos
                </Paragraph>
              </SectionsPlansOptionsItemGroup>
            </SectionsPlansOptionsItem>
            <SectionsPlansOptionsItem
              isButtonActive={showPlansByVehicleSize === 2}
              onClick={() => setShowPlansByVehicleSize(2)}
            >
              <SectionsPlansOptionsItemGroup>
                <IconHatchback />
                <Paragraph
                  nameColor="black"
                  fontSize={ConfigStyles.rebox.fonts.size.paragraph.big}
                  fontWeight={500}
                >
                  Carros leves
                </Paragraph>
              </SectionsPlansOptionsItemGroup>
            </SectionsPlansOptionsItem>
            <SectionsPlansOptionsItem
              isButtonActive={showPlansByVehicleSize === 3}
              onClick={() => setShowPlansByVehicleSize(3)}
            >
              <SectionsPlansOptionsItemGroup>
                <IconFurgao />
                <Paragraph
                  nameColor="black"
                  fontSize={ConfigStyles.rebox.fonts.size.paragraph.big}
                  fontWeight={500}
                >
                  Picapes / Suv
                </Paragraph>
              </SectionsPlansOptionsItemGroup>
            </SectionsPlansOptionsItem>
          </SectionsPlansOptionsGroup>
        </SectionsPlansOptions>

        <SliderContainer>
          <Swiper
            allowSlideNext={true}
            allowSlidePrev={true}
            draggable={true}
            navigation={true}
            lazy={true}
            autoplay={{
              delay: SWIPER_LIMIT_DELAY_IN_MM,
              waitForTransition: false,
              reverseDirection: false,
              stopOnLastSlide: false,
              disableOnInteraction: true,
            }}
            breakpoints={{
              540: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1200: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1440: {
                slidesPerView: 2,
                spaceBetween: 30,
              },
            }}
            style={{ display: false ? 'none' : 'flex' }}
          >
            {showPlansByVehicleSize === 1 &&
              products.map(
                product =>
                  product.status === ConfigValues.rebox.product.status.active &&
                  product.classification ===
                    ConfigValues.rebox.product.classification.moto_tricycle && (
                    <SwiperSlide
                      key={product.id}
                      style={{ paddingTop: '2vh', margin: '0 auto' }}
                    >
                      <ProductItem product={product} />
                    </SwiperSlide>
                  ),
              )}

            {showPlansByVehicleSize === 2 &&
              products.map(
                product =>
                  product.status === ConfigValues.rebox.product.status.active &&
                  product.classification ===
                    ConfigValues.rebox.product.classification.passenger_car && (
                    <SwiperSlide
                      key={product.id}
                      style={{ paddingTop: '2vh', margin: '0 auto' }}
                    >
                      <ProductItem product={product} />
                    </SwiperSlide>
                  ),
              )}

            {showPlansByVehicleSize === 3 &&
              products.map(
                product =>
                  product.status === ConfigValues.rebox.product.status.active &&
                  product.classification ===
                    ConfigValues.rebox.product.classification.pickup_suv && (
                    <SwiperSlide
                      key={product.id}
                      style={{ paddingTop: '2vh', margin: '0 auto' }}
                    >
                      <ProductItem product={product} />
                    </SwiperSlide>
                  ),
              )}
          </Swiper>
        </SliderContainer>
        <OurPlansInformationLegend>
          Planos em até 12x sem juros no cartão de crédito ou boleto.
        </OurPlansInformationLegend>
      </SectionsPlans>

      <Support>
        <SupportContainer>
          <SupportImage>
            <ImageFaq />
          </SupportImage>

          <SupportInfo>
            <SupportInfoTitle>
              Ficou com dúvida sobre nossos planos de assistência?
            </SupportInfoTitle>

            {/* <SupportInfoDescription>
              Estamos dispostos a te ajudar! Fale com a nossa equipe ou acesse o
              <MaterialLink to="/"> material de ajuda.</MaterialLink>
            </SupportInfoDescription> */}
            <SupportInfoDescription>
              Estamos dispostos a te ajudar! Fale com a nossa equipe.
            </SupportInfoDescription>

            {/* <EmailShareButton
              subject={'Preciso de ajuda com os planos!'}
              body={
                'Olá Rebox! Estou com dúvidas sobre os planos de assistência veicular 24h, podem me ajudar?'
              }
              url={ConfigBase.emailContactRebox}
            >
              <ButtonSpeakSupport>
                <p>Falar com um atendente</p>
                <IconArrowLeftWhite />
              </ButtonSpeakSupport>
            </EmailShareButton> */}
            <Link
              to={{
                pathname: `${ConfigBase.whatsapp.baseUrls.webApi}/send?phone=${
                  ConfigBase.rebox.whatsapp.commercial
                }&text=${'Olá! Gostaria de ser atendido.'}`,
              }}
              target="_blank"
            >
              <ButtonSpeakSupport>
                <p>Falar com um atendente</p>
                <IconArrowLeftWhite />
              </ButtonSpeakSupport>
            </Link>

            <Link
              to={{
                pathname: `tel:${ConfigBase.rebox.telephone.commercial}`,
              }}
              target="_blank"
            >
              <ButtonSpeakSupportOutline>
                <p>Ligar para {ConfigBase.rebox.telephone.commercial}</p>
                <IconArrowLeftWhite />
              </ButtonSpeakSupportOutline>
            </Link>
          </SupportInfo>
        </SupportContainer>

        {/* <TermosOfUses>
          <TermosOfUsesLink to="/politica-de-privacidade">
            Termos de uso e políticas de privacidade
          </TermosOfUsesLink>
        </TermosOfUses> */}
      </Support>
      <FooterPublic />
    </Container>
  );
};

export default Plans;
