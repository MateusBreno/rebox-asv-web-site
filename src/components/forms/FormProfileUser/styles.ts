// ./src/components/forms/FormProfileUser/styles.ts
import { Form } from '@unform/web';
import styled from 'styled-components';

export const Container = styled.div``;

export const Avatar = styled.div`
  width: 100%;
`;

export const AvatarProfile = styled.div`
  width: 100%;
  position: relative;
  input {
    display: none;
  }
`;

export const AvatarProfileGroup = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 100px;
`;

export const AvatarProfileLabel = styled.label`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 0px;
  right: -8px;
  cursor: pointer;
  background-color: ${({ theme }) => theme.colors.white.main};
  width: 30px;
  height: 30px;
  border-radius: 50%;
`;

export const AvatarProfileImage = styled.img`
  margin-right: 1vw;
  width: 100px;
  height: 100px;
  border-radius: 50%;

  @media (max-width: 359.9px) {
    width: 28px;
    height: 28px;
  }
`;

export const AvatarProfileAttachment = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
  border: 2px dashed rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  cursor: pointer;
`;

export const AvatarInputAttachment = styled.input``;

export const FormUser = styled(Form)`
  max-width: 550px;
  margin-top: 4vh;
`;

export const FieldGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 3vh;
  padding: 0 0 2vh;
`;
