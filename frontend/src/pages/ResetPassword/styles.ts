import styled, { keyframes } from 'styled-components';

import signInBackground from '../../assets/sign-in-background.png';

export const Container = styled.div`
  height: 100vh; // wiewport height, 100% da parte visível da tela do usuário.

  display: flex; // Organiza dos itens na vertical.
  align-items: stretch; // Estica os subitens para o tamanho do Container.
`;

export const Content = styled.div`
  padding: 16px 0;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  max-width: 700px;
`;

const appearFromLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

export const AnimatedContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  animation: ${appearFromLeft} 1s;

  form {
    margin: 65px 0;
    width: 340px;
    text-align: center;

    h1 {
      margin-bottom: 24px;
    }
  }
`;

export const Background = styled.div`
  flex: 1; // Faz ocupar todo o espaço restante;
  background: url(${signInBackground}) no-repeat center;
  background-size: cover;
`;
