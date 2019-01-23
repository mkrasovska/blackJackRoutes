type TPlayer = {
  cards: TCard[];
  isWinner: boolean;
  isFinished: boolean;
  class: string;
  score: number;
};

type TCard = {
  name: string;
  value: number;
  suit: string;
  symbol: string;
  face: string;
  back: string;
};
