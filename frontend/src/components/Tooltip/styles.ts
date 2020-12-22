import styled from 'styled-components';

export const Container = styled.div`
  // Relative: ocupa um espaço dentro de outro elemento.
  position: relative;

  span {
    width: 160px;
    background: #ff9000;
    padding: 8px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    color: #312e38;

    visibility: hidden;
    opacity: 0;
    -webkit-animation: item-hover-off 0.4s;
    -moz-animation: item-hover-off 0.4s;
    animation: item-hover-off 0.4s;
    transition: visibility 0.4s;

    // Abssolute: Flutuante no layout.
    position: absolute;
    // Especifica quanto deslocar para acima da borda inferior, sendo 100% altura do span mais 12px.
    bottom: calc(100% + 12px);
    // Hack para centralizar ao centro do ícone. Obs: Estava a direita.
    left: 50%;
    transform: translateX(-50%);

    &::before {
      content: '';
      border-style: solid;
      border-color: #ff9000 transparent;
      border-width: 6px 6px 0 6px;
      bottom: 20px;
      position: absolute;
      top: 100%;
      // Hack para centralizar ao centro do ícone. Obs: Estava a direita.
      left: 50%;
      transform: translateX(-50%);
    }

    @keyframes item-hover-off {
      from {
        opacity: 1;
      }
      to {
        opacity: 0;
      }
    }

    @-webkit-keyframes item-hover-off {
      from {
        opacity: 1;
      }
      to {
        opacity: 0;
      }
    }

    @-moz-keyframes item-hover-off {
      from {
        opacity: 1;
      }
      to {
        opacity: 0;
      }
    }
  }

  &:hover span {
    visibility: visible;
    opacity: 1;
    -webkit-animation: item-hover 0.4s;
    -moz-animation: item-hover 0.4s;
    animation: item-hover 0.4s;
    transition: visibility none;
  }

  @keyframes item-hover {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @-webkit-keyframes item-hover {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @-moz-keyframes item-hover {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;
