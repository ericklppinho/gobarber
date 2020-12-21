import styled from 'styled-components';
import { shade } from 'polished';

import signUpBackground from '../../assets/sign-up-background.png';

export const Container = styled.div`
  height: 100vh; // wiewport height, 100% da parte visível da tela do usuário.

  display: flex; // Organiza dos itens na vertical.
  align-items: stretch; // Estica os subitens para o tamanho do Container.
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 700px;

  form {
    margin: 80px 0;
    width: 340px;
    text-align: center;

    h1 {
      margin-bottom: 24px;
    }
  }

  a {
    // ">" é usado para a estilização do "a" não descer níveis.
    // Estilizar somente o nível atual.
    color: #f4ede8;
    display: block;
    text-decoration: none;
    transition: color 0.2s;

    display: flex;
    align-items: center;

    svg {
      margin-right: 16px;
    }

    &:hover {
      color: ${shade(0.2, '#f4ede8')};
    }
  }
`;

export const Background = styled.div`
  flex: 1; // Faz ocupar todo o espaço restante;
  background: url(${signUpBackground}) no-repeat center;
  background-size: cover;
`;
