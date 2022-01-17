import React, {FC, ReactNode} from 'react';
import {Text, TouchableHighlight, View} from 'react-native';
import styled, {css} from 'styled-components/native';
import PropTypes from 'prop-types';

const Wrapper = styled(TouchableHighlight)`
  position: relative;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 80px;
  flex-basis: 20%;
  border-radius: 0px;
  margin: 4px;
  opacity: ${props => (props.isInactive ? 0 : 1)};

  ${props => {
    if (props.isFlipped) {
      return css`
        border: 2px solid #16a085;
        background-color: #1abc9c;
      `;
    } else {
      return css`
        border: 2px solid #7f8c8d;
        background-color: #95a5a6;
      `;
    }
  }}
`;

const CardLabel = styled(Text)`
  position: relative;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-size: 48px;
  color: #ffffff;
`;

export const CardProps = {
  onPress: PropTypes.func,
  data: PropTypes.any,
  index: PropTypes.number,
  isInactive: PropTypes.bool,
  isFlipped: PropTypes.bool,
  isDisabled: PropTypes.bool,
};

const Card = props => {
  const {onPress, data, ...rest} = props;
  return (
    <Wrapper {...rest} onPress={onPress} underlayColor="#16a085">
      <CardLabel>{props.isFlipped ? data.label : '*'}</CardLabel>
    </Wrapper>
  );
};

Card.propTypes = CardProps;

Card.defaultProps = {
  isInactive: false,
  isFlipped: false,
  isDisabled: false,
};

export default Card;
