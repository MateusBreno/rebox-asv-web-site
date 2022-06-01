import React, { useCallback, useState } from 'react';

import { Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import SwiperCore, {
  A11y,
  Autoplay,
  Lazy,
  Navigation,
  Pagination,
  Scrollbar,
} from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import { IconWallet, IconSnapOfFingers, IconClock } from '@assets/icons';
import {
  ImageQuestion,
  ImageBrokenCar,
  ImagePrintingInvoices,
  ImageSeparador,
  ImageFastCar,
} from '@assets/images';
import {
  HeaderNavigationPublic,
  FooterPublic,
  MenuSideBarPublic,
} from '@components/index';
import { ConfigBase } from '@config/index';

import 'swiper/swiper-bundle.css';

import {
  Container,
  QuestionInformation,
  QuestionTitle,
  QuestionItems,
  QuestionItem,
  SolutionsInformation,
  SolutionsInformationBox,
  SolutionsBox,
  SolutionsBoxItems,
  SolutionsItem,
  SolutionsItemDescription,
  SolutionsSubtitle,
  SolutionsTitle,
  Affiliate,
  ButtonChoosePlan,
  ChoosePlanLink,
} from './styles';

SwiperCore.use([A11y, Pagination, Navigation, Scrollbar, Autoplay, Lazy]);

const LandingPage: React.FC = () => {
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);

  const handleOpenSidebar = useCallback(() => {
    setSidebarIsOpen(!sidebarIsOpen);
  }, [sidebarIsOpen]);

  return (
    <Container sidebarIsOpen={sidebarIsOpen}>
      <MenuSideBarPublic
        handleOpenSidebar={handleOpenSidebar}
        sidebarIsOpen={sidebarIsOpen}
      />

      <HeaderNavigationPublic handleOpenSidebar={handleOpenSidebar} />

      <QuestionInformation>
        <QuestionTitle>
          Estamos preparados para o pior dia do seu carro!
        </QuestionTitle>
        <QuestionItems>
          <Swiper
            allowSlideNext={true}
            allowSlidePrev={true}
            draggable={true}
            lazy={true}
            autoplay={{
              delay: 8000,
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
                slidesPerView: 1,
                spaceBetween: 20,
              },
              1200: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              1440: {
                slidesPerView: 1,
                spaceBetween: 40,
              },
            }}
          >
            <SwiperSlide>
              <QuestionItem>
                <ImageBrokenCar />
                <div>
                  <span>Estamos curiosos para saber...</span>
                  <p>O que você faz quando seu carro quebra?</p>
                </div>
              </QuestionItem>
            </SwiperSlide>
            <SwiperSlide>
              <QuestionItem>
                <ImageQuestion />
                <div>
                  <span>Estamos curiosos para saber...</span>
                  <p>
                    O que você faz quando precisa de uma assistência veicular
                    24h?
                  </p>
                </div>
              </QuestionItem>
            </SwiperSlide>
            <SwiperSlide>
              <QuestionItem>
                <ImagePrintingInvoices />
                <div>
                  <span>Se em uma situação difícil...</span>
                  <p>Você não tem um seguro, porque é caro?</p>
                </div>
              </QuestionItem>
            </SwiperSlide>
          </Swiper>
        </QuestionItems>
      </QuestionInformation>

      <SolutionsInformation>
        <ImageSeparador />
        <SolutionsInformationBox>
          <SolutionsTitle>
            Conheça as soluções da Rebox Assistência 24h
          </SolutionsTitle>
          <SolutionsSubtitle>
            O plano de assistência que você sempre quis, mais barato do que você
            imagina!
          </SolutionsSubtitle>

          <SolutionsBox>
            <ImageFastCar />

            <SolutionsBoxItems>
              <SolutionsItem>
                <IconWallet />
                <SolutionsItemDescription>
                  <p>Soluções que cabem no seu bolso</p>
                  <span>
                    Criamos planos com preços populares, mas com atendimento de
                    excelência.
                  </span>
                </SolutionsItemDescription>
              </SolutionsItem>

              <SolutionsItem>
                <IconSnapOfFingers />
                <SolutionsItemDescription>
                  <p>É simples contratar e usar</p>
                  <span>
                    Não precisa possuir cartão de crédito e pode ser pago com
                    boleto bancário.
                  </span>
                </SolutionsItemDescription>
              </SolutionsItem>

              <SolutionsItem>
                <IconClock />
                <SolutionsItemDescription>
                  <p>Atendimento 24h em todo país</p>
                  <span>
                    Estamos preparados para te atender em qualquer lugar do
                    Brasil, 24h por dia, 7 dias por semana.
                  </span>
                </SolutionsItemDescription>
              </SolutionsItem>
            </SolutionsBoxItems>
          </SolutionsBox>

          <ChoosePlanLink to="/nossos-planos">
            <ButtonChoosePlan>Escolha um plano</ButtonChoosePlan>
          </ChoosePlanLink>
        </SolutionsInformationBox>
      </SolutionsInformation>

      <Affiliate>
        {/* <h1>Venha agora se tornar um afiliado na Rebox!</h1>
        <p>Você ganhará até R$ 25,00 por cada indicação efetivada!</p> */}
        <h1>Já pensou em ganhar uma renda extra indicando planos da Rebox?</h1>
        <p>
          Você pode ganhar até R$ 3.750,00 por mês, indicando apenas 5 clientes
          por dia!
        </p>
        <ChoosePlanLink
          to={{
            pathname: `${ConfigBase.rebox.externalLinks.affiliate}`,
          }}
          target="_blank"
        >
          <button>Quero ser afiliado</button>
        </ChoosePlanLink>
        <Link
          to={{
            pathname:
              'https://rebox.com.br/external/anexos/regras-afiliados.pdf',
          }}
          target="_blank"
        >
          <p className="legend">Leia atentamente o regulamento</p>
        </Link>
      </Affiliate>

      <FooterPublic />
      <ToastContainer />
    </Container>
  );
};

export default LandingPage;
