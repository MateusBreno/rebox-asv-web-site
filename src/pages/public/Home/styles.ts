// src/pages/Home/styles.ts
import styled from 'styled-components';

interface IContainerProps {
  sidebarIsOpen: boolean;
}

export const Container = styled.div<IContainerProps>`
  background: ${({ theme }) => theme.colors.white.main};
  height: 100vh;

  overflow: ${({ sidebarIsOpen }) => (sidebarIsOpen ? 'hidden' : 'auto')};
`;
