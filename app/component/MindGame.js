/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect, useRef} from 'react';
import {Dimensions, Text, TouchableHighlight, View} from 'react-native';
import styled from 'styled-components';
import {CardListData} from '../data/card-list';
import Card from './Card';
const window = Dimensions.get('window');

const Wrapper = styled(View)`
  position: relative;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #ecf0f1;
  padding: 16px 0px;
`;

const TitleWrapper = styled(View)`
  position: relative;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 10px;
`;
const Title = styled(Text)`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 4px 10px;
  font-size: 24px;
  color: #7f8c8d;
`;

const GameStatusWrapper = styled(View)`
  position: relative;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background-color: #e74c3c;
  border: 1px solid #c0392b;
  width: 100%;
  margin-bottom: 16px;
  padding: 8px 16px;
`;

const GameStatusText = styled(Text)`
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  font-size: 18px;
  color: #ffffff;
`;

const ScoresWrapper = styled(View)`
  position: relative;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background-color: #f1c40f;
  border: 1px solid #f39c12;
  width: 100%;
  margin-bottom: 16px;
`;
const ScoresDevider = styled(View)`
  background-color: #f39c12;
  width: 100%;
  height: 1px;
`;

const AttemptsWrapper = styled(View)`
  position: relative;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 8px 16px;
  margin-bottom: 0px;
`;
const AttemptsLabel = styled(Text)`
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  font-size: 18px;
  color: #ffffff;
`;
const AttemptsValue = styled(Text)`
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  font-size: 18px;
  color: #ffffff;
`;

const MatchedWrapper = styled(View)`
  position: relative;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 8px 16px;
`;
const MatchedLabel = styled(Text)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  color: #ffffff;
`;
const MatchedValue = styled(Text)`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  color: #ffffff;
`;

const Button = styled(TouchableHighlight)`
  position: relative;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 10px;
  background-color: #1abc9c;
  border: 1px solid #16a085;
  padding: 8px 16px;
  margin: 0px;
  border-radius: 10px;
`;

const Label = styled(Text)`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  color: #ffffff;
`;

const GameWrapper = styled(View)`
  position: relative;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
`;

const MindGame = props => {
  const {id} = props;

  const shuffleCards = list => {
    const length = list.length;
    for (let i = length; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * i);
      const currentIndex = i - 1;
      const temp = list[currentIndex];
      list[currentIndex] = list[randomIndex];
      list[randomIndex] = temp;
    }
    return list;
  };

  const [cards, setCards] = useState(
    shuffleCards(CardListData.concat(CardListData)),
  );

  const [openCards, setOpenCards] = useState([]);
  const [clearedCards, setClearedCards] = useState({});
  const [shouldDisableAllCards, setShouldDisableAllCards] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [matched, setMatched] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const timeout = useRef(null);

  const disable = () => {
    setShouldDisableAllCards(true);
  };
  const enable = () => {
    setShouldDisableAllCards(false);
  };

  const checkCompletion = () => {
    setMatched(Object.keys(clearedCards).length);

    if (Object.keys(clearedCards).length === CardListData.length) {
      setGameOver(true);
    }
  };

  const evaluate = () => {
    const [first, second] = openCards;
    console.log('openCards');
    console.log(openCards);
    console.log('----------------------');
    enable();
    if (cards[first].type === cards[second].type) {
      setClearedCards(prev => ({...prev, [cards[first].type]: true}));
      setOpenCards([]);
      return;
    }
    timeout.current = setTimeout(() => {
      setOpenCards([]);
    }, 500);
  };

  const handleCardPress = index => {
    console.log('>>>>');
    if (openCards.length === 1) {
      setOpenCards(prev => [...prev, index]);
      setAttempts(attempts => attempts + 1);
      disable();
    } else {
      clearTimeout(timeout.current);
      setOpenCards([index]);
    }
  };

  useEffect(() => {
    let timeout = null;
    if (openCards.length === 2) {
      timeout = setTimeout(evaluate, 300);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [evaluate, openCards]);

  useEffect(() => {
    checkCompletion();
  }, [checkCompletion, clearedCards]);
  const checkIsFlipped = index => {
    return openCards.includes(index);
  };

  const checkIsInactive = card => {
    return Boolean(clearedCards[card.type]);
  };

  const handleRestart = () => {
    setClearedCards({});
    setOpenCards([]);
    setGameOver(false);
    setAttempts(0);
    setShouldDisableAllCards(false);
    setCards(shuffleCards(CardListData.concat(CardListData)));
  };

  return (
    <Wrapper>
      {gameOver && (
        <GameStatusWrapper>
          <GameStatusText>Game Over</GameStatusText>
        </GameStatusWrapper>
      )}
      <TitleWrapper>
        <Title>Leap Mind Game</Title>
      </TitleWrapper>
      <GameWrapper>
        {cards.map((card, index) => {
          return (
            <Card
              key={index}
              data={card}
              index={index}
              isDisabled={shouldDisableAllCards}
              isInactive={checkIsInactive(card)}
              isFlipped={checkIsFlipped(index)}
              onPress={() => handleCardPress(index)}
            />
          );
        })}
      </GameWrapper>
      <ScoresWrapper>
        <AttemptsWrapper>
          <AttemptsLabel>Attempts</AttemptsLabel>
          <AttemptsValue>{attempts}</AttemptsValue>
        </AttemptsWrapper>
        <ScoresDevider />
        <MatchedWrapper>
          <MatchedLabel>Matched</MatchedLabel>
          <MatchedValue>{matched}</MatchedValue>
        </MatchedWrapper>
      </ScoresWrapper>

      <Button onPress={() => handleRestart()} underlayColor="#16a085">
        <Label>RESTART</Label>
      </Button>
    </Wrapper>
  );
};

MindGame.defaultProps = {};

export default MindGame;
