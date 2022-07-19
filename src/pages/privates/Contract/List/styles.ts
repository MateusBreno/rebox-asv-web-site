// ./src/pages/privates/Contract/List/styles.ts
import { Form } from '@unform/web';
import { CSVLink } from 'react-csv';
import Modal from 'react-modal';
import styled from 'styled-components';

interface IProgress {
  percentage: number;
}

export const Container = styled.main`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.whiteCloud.main};
`;

export const ContainerGroup = styled.div`
  flex: 1;
  display: flex;
`;

export const Content = styled.section`
  width: 100%;
  height: calc(100vh - 65px);
  background-color: ${({ theme }) => theme.colors.whiteCloud.main};
  padding: 3vh 4vw;
  overflow-y: scroll;
`;

export const Options = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 4vh;
`;

export const OptionsGroup = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;

  > button {
    margin-right: 0.5vw;
  }
`;

export const FormSearch = styled(Form)`
  margin-bottom: 2vh;
`;

export const FormPage = styled(Form)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  > div {
    height: 40px;
    border-radius: 0;

    > input {
      padding: 0 5px;
      max-width: 60px;
    }
  }
`;

export const Pagination = styled.div`
  display: flex;
  flex-direction: row;

  > button > p {
    font-size: ${({ theme }) => theme.fonts.size.paragraph.normal}px;
  }
`;

export const PaginationGroup = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export const PaginationGroupText = styled.p`
  margin: 0;
  padding: 0 5px;
  word-break: break-word;
  line-height: 16px;
  font-weight: 500;
  text-align: center;
  font-size: ${({ theme }) => theme.fonts.size.paragraph.large}px;
  color: ${({ theme }) => theme.colors.black.main};
`;

export const ModalFilter = styled(Modal)`
  background-color: ${({ theme }) => theme.colors.white.main};
  border-radius: 10px;
  box-shadow: 3px 3px 20px rgba(0, 0, 0, 0.1);
  border: 0.5px solid ${({ theme }) => theme.colors.black.opacity.low};
  max-height: 470px;
  max-width: 580px;
  width: 80%;
  padding: 8vh 4vw;
  margin: 15vh auto 0;
  position: relative;
  overflow-y: scroll;

  @media (max-width: 539.9px) {
    width: 90%;
    padding: 6vh 6vw;
  }
`;

export const FormFilter = styled(Form)`
  .special {
    grid-template-columns: 1fr;
  }
`;

export const FilterFieldGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 1vw;
  padding: 1.5vh 0;
`;

export const FilterFieldSet = styled.div``;

export const FilterFieldSetItems = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 2vw;
`;

export const FilterButtons = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 1vw;
  margin-top: 1.5vh;
`;

export const ModalExportData = styled(Modal)`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.white.main};
  border-radius: 10px;
  box-shadow: 3px 3px 20px rgba(0, 0, 0, 0.1);
  border: 0.5px solid ${({ theme }) => theme.colors.black.opacity.low};
  max-height: 600px;
  max-width: 580px;
  width: 80%;
  padding: 8vh 4vw;
  margin: 15vh auto 0;
  position: relative;

  @media (max-width: 539.9px) {
    width: 90%;
    padding: 6vh 6vw;
  }
`;

export const Progress = styled.div<IProgress>`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  width: 100%;
  position: relative;
  height: 30px;
  margin: 4vh 0;

  .active {
    background-color: ${({ theme }) => theme.colors.blue.main};
    width: ${({ percentage }) => `${percentage}%`};
  }
`;

export const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background-color: ${({ theme }) => theme.colors.black.opacity.veryLow};
  position: absolute;
`;

export const ProgressText = styled.span`
  top: 0;
  left: 0;
  position: absolute;
  margin: 0;
  padding: 0;
  word-break: break-word;
  line-height: 16px;
  font-weight: 500;
  text-align: start;
  font-size: ${({ theme }) => theme.fonts.size.paragraph.large}px;
  color: ${({ theme }) => theme.colors.black.main};
`;

export const ButtonExportToExcel = styled(CSVLink)`
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 0;
  padding: 1vh 1vw;
  word-break: break-word;
  line-height: 16px;
  font-weight: 500;
  text-align: center;
  font-size: ${({ theme }) => theme.fonts.size.paragraph.large}px;
  color: ${({ theme }) => theme.colors.blue.main};

  > svg {
    margin-right: 6px;
  }

  :hover {
    color: ${({ theme }) => theme.colors.black.main};

    > svg {
      color: ${({ theme }) => theme.colors.black.main};
    }
  }
`;
