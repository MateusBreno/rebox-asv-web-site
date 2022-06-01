import React, { useCallback, useState, useEffect } from 'react';

import ReactPixel from 'react-facebook-pixel';
import { Redirect } from 'react-router-dom';
import { WhatsappShareButton } from 'react-share';
import { ToastContainer } from 'react-toastify';

import { IconArrowLeftWhite } from '@assets/icons';
import { ImageLogotipo, ImageThanks } from '@assets/images';
import facebook from '@config/integrations/facebook';
import { ConfigValues, ConfigBase } from '@config/index';
import api from '@services/apis/apiRebox';
import sessionService from '@services/storage/session/sessionStorageService';
import notify from '@utils/notifiers/';

import {
  Container,
  Content,
  Title,
  Subtitle,
  Box,
  ButtonAccess,
  ButtonShare,
} from './styles';

const Thanks: React.FC = () => {
  // DEVE PERMANECER COMENTADO NO AMBIENTE DE DESENVOLVIMENTO
  ReactPixel.init(
    facebook.pixelId,
    facebook.advancedMatching,
    facebook.options,
  );
  ReactPixel.pageView();
  ReactPixel.track(facebook.track.event, facebook.track.value);

  const [email, setEmail] = useState(
    sessionStorage.getItem('@Rebox:Client:email') || '',
  );
  const [password, setPassword] = useState(
    sessionStorage.getItem('@Rebox:Client:password') || '',
  );
  const [loggedIn, setLoggedIn] = useState(false);

  const openSession = useCallback(async () => {
    try {
      if (email && password) {
        notify('Estamos efetuando o seu login. Por favor aguarde...', 'info');

        const response = await api.post('/sessions', {
          email,
          password,
        });

        const { user, token, id } = response.data.data;

        // Autorizado a acessar apenas usuários do tipo cliente
        if (user.role !== ConfigValues.user.role.client) {
          notify('Usuário sem autorização para acessar.', 'error');
          await api.put(`/sessions/${id}`);
          return;
        }

        if (user.status !== ConfigValues.user.status.active) {
          notify('Sem permissão para acessar o sistema', 'error');
          await api.put(`/sessions/${id}`);
          return;
        }

        sessionStorage.clear();

        sessionService.updateLocalOrSessionStorage({
          user,
          token,
          sessions_id: id,
        });

        notify(response.data.header.message, 'success');
        setLoggedIn(true);
      }
    } catch (error) {}
  }, []);

  useEffect(() => {
    localStorage.removeItem('@Rebox-Client:signup-data');
    sessionStorage.removeItem('@Rebox:SelectedProduct');
  }, []);

  return (
    <Container>
      {loggedIn && <Redirect to="/painel" exact />}
      <Content>
        <ImageLogotipo width={200} height={50} />

        <Title>Deu tudo certo! Compra concluída com sucesso.</Title>

        <Subtitle>
          Agora, você faz parte dessa família! E juntos vamos cuidar bem do seu
          carro. Conte com a gente no momento que mais precisar. Acesse seu
          email cadastrado na compra e veja nossa mensagem de Boas-vindas e mais
          informações.
        </Subtitle>

        <Box>
          <div>
            <ImageThanks />
          </div>
          <div className="buttons">
            <ButtonAccess onClick={openSession}>
              <p>Acessar o sistema</p>
              <IconArrowLeftWhite />
            </ButtonAccess>

            <WhatsappShareButton
              className="btn-outline"
              title={
                'Oie, tudo bem? Eu vim aqui te convidar para utilizar a *REBOX*. Lá tem planos de assistência veicular 24h e com um preço que cabe no bolso. Eu já assinei, falta só você! '
              }
              url={'https://rebox.com.br'}
            >
              <ButtonShare>
                <p>Convidar meus amigos</p>
                <IconArrowLeftWhite />
              </ButtonShare>
            </WhatsappShareButton>
          </div>
        </Box>
      </Content>
      <ToastContainer />
    </Container>
  );
};

export default Thanks;
