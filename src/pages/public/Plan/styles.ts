import { Link } from 'react-router-dom';
import styled, { css, keyframes } from 'styled-components';
/* VERSÃO MOBILE
 * - 1024px
 * - 960px
 * - 768px
 * - 540px
 * - 480px
 * - 360px
 * - 320px
 */
const textAnimation = keyframes`
  0% {
    letter-spacing: -0.5em;
    opacity: 0;
  }
  40% {
    opacity: 0.6;
  }
  100% {
    opacity: 1;
  }
`;

interface IButtonsFilterPlans {
  isButtonActive: boolean;
}

export const Container = styled.div``;

export const SectionsTitles = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  text-align: center;

  width: 100%;
  padding: 5vh 15vw;

  animation: ${textAnimation} 0.7s cubic-bezier(0.215, 0.61, 0.355, 1) both;

  @media (max-width: 539.9px) {
    padding: 4vh 6vw;
  }
`;

export const SectionsVideo = styled.section`
  display: flex;
  justify-content: center;
  padding: 0 10vw;
`;

export const SectionsVideoGroup = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
  }
`;

export const SectionsVideoPlay = styled.video`
  height: 100%;
  width: 100%;
`;

export const SectionsVideoPlayOptions = styled.source``;

export const SectionsVideoInformation = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 6vh 3vw;

  @media (max-width: 960px) {
    padding: 4vh 4vw;
  }
`;

export const SectionsBenefits = styled.section`
  padding: 10vh 12vw;
`;

export const SectionsBenefitsTitle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 100%;
  animation: ${textAnimation} 0.7s cubic-bezier(0.215, 0.61, 0.355, 1) both;

  @media (max-width: 539.9px) {
    padding: 4vh 6vw;
  }
`;

export const SectionsBenefitsDiscounts = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  padding: 5vh 0;

  @media (max-width: 767.9px) {
    flex-direction: column;
    justify-content: center;
  }
`;

export const SectionsBenefitsDiscountsImage = styled.div`
  > svg {
    max-width: 250px;
    margin-right: 4vw;

    @media (max-width: 767.9px) {
      /* max-width: 180px; */
      width: 200px;
      height: 200px;
      margin-right: 0;
      margin-bottom: 4vh;
    }
  }
`;

export const SectionsBenefitsDiscountsGroup = styled.div``;

export const SectionsBenefitsDiscountsItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2vh;

  > svg {
    width: 24px;
    margin-right: 1vw;

    @media (max-width: 767.9px) {
      margin-right: 2vw;
    }
  }
`;

export const SectionsBenefitsOffer = styled.div`
  display: flex;
  justify-content: space-evenly;

  @media (max-width: 767.9px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    grid-gap: 5vh 0;
  }

  @media (max-width: 319.9px) {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr 1fr 1fr;
  }
`;

export const SectionsBenefitsOfferItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const SectionsBenefitsOfferItemIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.blue.opacity.veryLow};
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-bottom: 2vh;

  > svg {
    width: 35px;
  }
`;

export const SectionsSteps = styled.section`
  background-color: ${({ theme }) => theme.colors.blue.main};
  padding: 8vh 12vw;
`;

export const SectionsStepsTitle = styled.div``;

export const SectionsStepsGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 4vh 12vw 6vh;

  @media (max-width: 768px) {
    padding: 4vh 0 6vh;
  }
`;

export const SectionsStepsGroupItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10vh;

  > svg {
    max-width: 70px;
    max-height: 70px;
    margin-right: 3vw;
  }

  @media (max-width: 540px) {
    flex-direction: column;
    margin-bottom: 12vh;

    > svg {
      max-width: 90px;
      max-height: 90px;
      margin-right: 0;
      margin-bottom: 6vh;
    }
  }
`;

export const SectionsStepsGroupItemDescription = styled.div``;

export const SectionsPlans = styled.div`
  background-color: ${({ theme }) => theme.colors.whiteCloud.main};
  min-height: 400px;
  padding: 6vh 6vw;
`;

export const SectionsPlansTitle = styled.div``;

export const SectionsPlansOptions = styled.div`
  padding: 4vh 8vw;

  @media (min-width: 768px) {
    padding: 4vh 16vw;
  }
`;

export const SectionsPlansOptionsGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;

  @media (max-width: 539.9px) {
    grid-template-columns: 1fr;
  }
`;

export const SectionsPlansOptionsItem = styled.button<IButtonsFilterPlans>`
  padding: 1.5vh 2vw;
  border-bottom: 3px solid ${({ theme }) => theme.colors.blue.opacity.veryLow};
  font-weight: 500;
  ${props =>
    props.isButtonActive &&
    css`
      border-bottom: 3px solid ${({ theme }) => theme.colors.blue.main};
    `}

  :hover {
    background-color: ${({ theme }) => theme.colors.blue.opacity.veryLow};
  }

  @media (max-width: 539.9px) {
    padding-top: 4vh;
    :hover {
      background-color: none;
    }

    ${props =>
      props.isButtonActive &&
      css`
        p {
          color: ${({ theme }) => theme.colors.blue.main};
        }
      `}
  }
`;

export const SectionsPlansOptionsItemGroup = styled.div`
  > svg {
    width: 40px;
    max-height: 40px;
  }
`;

export const OurPlansInformationLegend = styled.p`
  color: ${({ theme }) => theme.colors.blue.opacity.high};
  font-size: ${({ theme }) => theme.fonts.size.paragraph.big}px;
  font-weight: 500;
  text-align: center;
  line-height: 26px;
  margin-bottom: 4vh;
`;

export const ChoosePlanLink = styled(Link)``;

export const ButtonChoosePlan = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60px;
  width: 100%;
  max-width: 300px;
  padding: 0 15px;
  margin: 0 auto;
  border: 2px solid ${({ theme }) => theme.colors.white.main};
  border-radius: 30px;
  color: ${({ theme }) => theme.colors.white.main};
  font-size: ${({ theme }) => theme.fonts.size.paragraph.big}px;
  font-weight: 600;

  :hover {
    color: ${({ theme }) => theme.colors.black.main};
    border: 2px solid ${({ theme }) => theme.colors.black.main};
  }
`;

export const SliderContainer = styled.div`
  display: flex;
  justify-content: center;

  width: 100%;

  margin: 32px auto;

  position: relative;

  .swiper-container {
    position: unset;
    width: 1350px;
    height: fit-content;

    @media (min-width: 1000px) {
      margin: 0 100px;
    }
  }

  .swiper-slide {
    width: 300px;
    height: 100%;
  }
`;

export const Support = styled.section`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.white.main};
`;

export const SupportContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 15vw;

  @media (max-width: 767.9px) {
    flex-direction: column;
    margin-bottom: 8vh;
  }
`;

export const SupportImage = styled.div`
  margin-right: 8vw;

  @media (max-width: 767.9px) {
    margin-right: 0;
  }

  > svg {
    max-width: 300px;
  }
`;

export const SupportInfo = styled.div``;

export const SupportInfoTitle = styled.h1`
  color: ${({ theme }) => theme.colors.blue.main};
  font-size: ${({ theme }) => theme.fonts.size.subtitle.large}px;
  font-weight: 600;
  margin-bottom: 2vh;

  @media (max-width: 767.9px) {
    font-size: ${({ theme }) => theme.fonts.size.subtitle.normal}px;
  }
`;

export const SupportInfoDescription = styled.p`
  color: ${({ theme }) => theme.colors.black.main};
  font-size: ${({ theme }) => theme.fonts.size.paragraph.large}px;
  font-weight: 500;
  margin-bottom: 4vh;
`;

export const MaterialLink = styled(Link)`
  color: ${({ theme }) => theme.colors.blue.main};
  font-size: ${({ theme }) => theme.fonts.size.paragraph.large}px;
  font-weight: 600;
`;

export const ButtonSpeakSupport = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2vh 1.5vw;
  background-color: ${({ theme }) => theme.colors.blue.main};
  border-radius: 8px;
  margin-bottom: 1vh;

  @media (max-width: 767.9px) {
    padding: 2vh 4vw;
  }

  > p {
    font-weight: 500;
    font-size: ${({ theme }) => theme.fonts.size.paragraph.large}px;
    color: ${({ theme }) => theme.colors.white.main};
  }

  > svg {
    width: 14px;
    margin-left: 4vw;

    @media (max-width: 767.9px) {
      margin-left: 8vw;
    }
  }
`;

export const ButtonSpeakSupportOutline = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2vh 1.5vw;
  border: 1px solid ${({ theme }) => theme.colors.blue.main};
  border-radius: 8px;

  @media (max-width: 767.9px) {
    padding: 2vh 4vw;
  }

  > p {
    font-weight: 600;
    font-size: ${({ theme }) => theme.fonts.size.paragraph.large}px;
    color: ${({ theme }) => theme.colors.blue.main};
  }

  > svg {
    width: 14px;
    margin-left: 4vw;

    path {
      fill: ${({ theme }) => theme.colors.blue.main};
    }

    @media (max-width: 767.9px) {
      margin-left: 8vw;
    }
  }
`;

export const TermosOfUses = styled.div`
  padding: 0 3vw 3vh;
`;

export const TermosOfUsesLink = styled(Link)`
  color: ${({ theme }) => theme.colors.blue.main};
  font-size: ${({ theme }) => theme.fonts.size.paragraph.large}px;
  font-weight: 500;
`;
