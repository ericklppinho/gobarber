import styled, { css } from 'styled-components';
import { animated } from 'react-spring';

interface ContainerProps {
  type?: 'success' | 'error' | 'info';
  hasDescription: boolean;
}

const toastTypeVariations = {
  info: css`
    background: #ebf8ff;
    color: #3172b7;
  `,
  success: css`
    background: #e6fffa;
    color: #2e656a;
  `,
  error: css`
    background: #fddede;
    color: #c53030;
  `,
};

export const Container = styled(animated.div)<ContainerProps>`
  position: relative;
  width: 360px;
  padding: 16px 30px 16px 16px;
  border-radius: 10px;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);

  display: flex;

  & + div {
    margin-top: 8px;
  }

  > svg {
    position: absolute;
    left: 16px;
    top: 16px;
  }

  div {
    flex: 1;
    margin: 0px 30px;
    p {
      margin-top: 4px;
      font-size: 14px;
      opacity: 0.8;
      line-height: 20px; // Distancia entre as linhas.
    }
  }

  button {
    position: absolute;
    right: 16px;
    top: 16px;
    opacity: 0.6;
    // Redefinir o padrão das propriedades.
    border: 0;
    background: transparent;
    // Pega a cor definida em algum container superior.
    color: inherit;
  }

  ${props => toastTypeVariations[props.type || 'info']}

  ${props =>
    !props.hasDescription &&
    css`
      align-items: center;

      svg {
        margin-top: 0;
      }
    `}
`;