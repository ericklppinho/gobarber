import React from 'react';
import { useTransition } from 'react-spring';

import { ToastMessage } from '../../hooks/toast';

import Toast from './Toast';

import { RightContainer, LeftContainer } from './styles';

interface ToastContainerProps {
  messages: ToastMessage[];
}

const ToastContainer: React.FC<ToastContainerProps> = ({ messages }) => {
  const [right, left] = [
    messages.filter(message => {
      return message.appearFrom !== 'left';
    }),
    messages.filter(message => {
      return message.appearFrom === 'left';
    }),
  ];

  const messagesFromRightWithTransitions = useTransition(
    right,
    message => message.id,
    {
      from: { right: '-120%', opacity: 0 },
      enter: { right: '0%', opacity: 1 },
      leave: { right: '-120%', opacity: 0 },
    },
  );

  const messagesFromLeftWithTransitions = useTransition(
    left,
    message => message.id,
    {
      from: { right: '120%', opacity: 0 },
      enter: { right: '0%', opacity: 1 },
      leave: { right: '120%', opacity: 0 },
    },
  );

  return (
    <>
      <LeftContainer>
        {messagesFromLeftWithTransitions.map(({ key, item, props }) => (
          <Toast key={key} message={item} style={props} />
        ))}
      </LeftContainer>
      <RightContainer>
        {messagesFromRightWithTransitions.map(({ key, item, props }) => (
          <Toast key={key} message={item} style={props} />
        ))}
      </RightContainer>
    </>
  );
};

export default ToastContainer;
