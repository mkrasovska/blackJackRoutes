import { Component } from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent {
  public playerOne: TPlayer = {
    cards: [],
    isFinished: false,
    class: '.your-cards',
    isWinner: false,
    score: 0
  };

  public playerTwo: TPlayer = {
    cards: [],
    isFinished: false,
    class: '.opponent-cards',
    isWinner: false,
    score: 0
  };

  public gameInProgress: boolean = false;
  public allMessages: string[] = [];
  public messageText: string;


  private _newDeck: TCard[] = this._createDeck();
  private _myDeck: TCard[] = this._shuffleDeck(this._newDeck);


  public blackJackInit(): void {
    this.gameInProgress = true;
    this.startNewGame();
  }

  public startNewGame(): void {
    let takenCard: TCard;
    this._myDeck = this._shuffleDeck(this._myDeck);
    this._clearBoard();
    this.playerOne.cards = [];
    this.playerTwo.cards = [];
    this.playerOne.isFinished = false;
    this.playerTwo.isFinished = false;
    this.playerOne.isWinner = false;
    this.playerTwo.isWinner = false;
    this.playerOne.score = 0;
    this.playerTwo.score = 0;
    takenCard = this._takeNewCard(this.playerOne);
    this._writeMessage(`You took ${takenCard.name} ${takenCard.symbol}`);
    this._takeNewCard(this.playerTwo);
    this._writeMessage(`Dealer took a card`);
    this.messageText = `Take your choice!`;
  }

  public stopGame(): void {
    this.playerOne.isFinished = true;

    if (!this.playerTwo.isFinished) {
      this._writeMessage(`You stopped the game. Dealer can take one more card`);
    }

    this._playerTwoRound();
  }

  public nextRound(): void {
    this._playerOneRound();
    this._playerTwoRound();
  }


  private _createDeck(): TCard[] {
    const newDeck: TCard[] = [];
    const suits: { name: string; symbol: string }[] = [
      { name: 'club', symbol: '♣' },
      { name: 'spade', symbol: '♠' },
      { name: 'diamond', symbol: '♦' },
      { name: 'heart', symbol: '♥' }
    ];
    const cards: { name: string; value: number }[] = [
      { name: '6', value: 6 },
      { name: '7', value: 7 },
      { name: '8', value: 8 },
      { name: '9', value: 9 },
      { name: '10', value: 10 },
      { name: 'J', value: 2 },
      { name: 'Q', value: 3 },
      { name: 'K', value: 4 },
      { name: 'A', value: 11 }
    ];

    suits.forEach((suit: { name: string; symbol: string }) => {
      cards.forEach((card: { name: string; value: number }) => {
        const newCardObj: TCard = {
          name: card.name,
          suit: suit.name,
          symbol: suit.symbol,
          value: card.value,
          face: `../assets/img/${suit.name}_${card.name}.svg`,
          back: `../assets/img/back.png`
        };

        newDeck.push(newCardObj);
      });
    });

    return newDeck;
  }

  private _shuffleDeck(myDeck: TCard[]): TCard[] {
    myDeck.forEach((card: TCard, i: number, deck: TCard[]) => {
      const randomNumber: number = Math.floor(Math.random() * myDeck.length);
      const changeCard: TCard = card;
      deck[i] = deck[randomNumber];
      deck[randomNumber] = changeCard;
    });

    return myDeck;
  }

  private _clearBoard(): void {
    this.gameInProgress = true;
    this.allMessages = [];
  }

  private _takeNewCard(player: TPlayer): TCard {
    const takenCard: TCard = this._myDeck.pop();
    player.cards.push(takenCard);
    player.score = this._scoreSum(player);

    return takenCard;
  }

  private _playerOneRound(): void {
    let takenCard: TCard;
    takenCard = this._takeNewCard(this.playerOne);
    this._writeMessage(`You took ${takenCard.name} ${takenCard.symbol}`);

    if (this.playerTwo.isFinished) {
      this.playerOne.isFinished = true;
    }

    if (this.playerOne.score > 21) {
      this._finishGame(this.playerTwo);
      this._writeMessage(`You have too much! Looser!`);

      return;
    }

    if (this.playerOne.score === 21) {
      this._finishGame(this.playerOne);
    }
  }

  private _playerTwoRound(): void {
    if (this.playerTwo.score >= 15) {
      this.playerTwo.isFinished = true;
      if (!this.playerOne.isFinished) {
        this._writeMessage(`Dealer stopped the game. You can take one more card`);
      }
    }

    if (!this.playerTwo.isFinished) {
      this._takeNewCard(this.playerTwo);
      this._writeMessage(`Dealer took a card`);
    }

    if (this.playerTwo.score > 21) {
      this._finishGame(this.playerOne);
      this._writeMessage(`Dealer has too much`);
    }

    if (this.playerTwo.score === 21) {
      this._finishGame(this.playerTwo);
    }

    if (this.playerOne.isFinished) {
      this._evaluateWinner();
      this._refillDeck();
      this._showNewGameButton();
    }
  }

  private _scoreSum(player: TPlayer): number {
    let sum: number = 0;

    player.cards.forEach((card: TCard) => {
      sum += card.value;
    });

    return sum;
  }


  private _evaluateWinner(): void {

    const winner: string = (this.playerOne.isWinner) ? 'You' :
      (this.playerTwo.isWinner) ? 'Dealer' :
        (this.playerOne.score > this.playerTwo.score) ? 'You' :
          (this.playerTwo.score > this.playerOne.score) ? 'Dealer' : 'Nobody';

    this._writeMessage(`${winner} have won! Cheers!`);
  }

  private _showNewGameButton(): void {
    this.gameInProgress = false;
  }

  private _refillDeck(): void {
    this._myDeck = this._myDeck.concat(this.playerOne.cards, this.playerTwo.cards);
  }

  private _finishGame(winner: TPlayer): void {
    this.playerTwo.isFinished = true;
    this.playerOne.isFinished = true;
    winner.isWinner = true;
  }

  private _writeMessage(message: string): void {
    this.messageText = message;
    this.allMessages.push(message);
  }
}
