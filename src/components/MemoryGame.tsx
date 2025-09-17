import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// Import player images
import wangChuqin from "@/assets/players/01_wang-chuqin.png";
import linShidong from "@/assets/players/02_lin-shidong.png";
import hugoCalderano from "@/assets/players/03_hugo-calderano.png";
import tomokazuHarimoto from "@/assets/players/04_tomokazu-harimoto.png";
import trulsMoregard from "@/assets/players/05_truls-moregard.png";
import liangJingkun from "@/assets/players/06_liang-jingkun.png";
import felixLebrun from "@/assets/players/07_felix-lebrun.png";
import benediktDuda from "@/assets/players/08_benedikt-duda.png";
import xiangPeng from "@/assets/players/09_xiang-peng.png";
import darkoJorgic from "@/assets/players/10_darko-jorgic.png";

interface Player {
  id: number;
  name: string;
  rank: number;
  image: string;
}

interface GameCard extends Player {
  cardId: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const players: Player[] = [
  { id: 1, name: "LIN Shidong", rank: 1, image: linShidong },
  { id: 2, name: "WANG Chuqin", rank: 2, image: wangChuqin },
  { id: 3, name: "Tomokazu HARIMOTO", rank: 3, image: tomokazuHarimoto },
  { id: 4, name: "Hugo CALDERANO", rank: 4, image: hugoCalderano },
  { id: 5, name: "Truls MOREGARD", rank: 5, image: trulsMoregard },
  { id: 6, name: "LIANG Jingkun", rank: 6, image: liangJingkun },
  { id: 7, name: "Felix LEBRUN", rank: 7, image: felixLebrun },
  { id: 8, name: "Benedikt DUDA", rank: 8, image: benediktDuda },
  { id: 9, name: "XIANG Peng", rank: 9, image: xiangPeng },
  { id: 10, name: "Darko JORGIC", rank: 10, image: darkoJorgic },
];

export const MemoryGame = () => {
  const { toast } = useToast();
  const [cards, setCards] = useState<GameCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [matches, setMatches] = useState(0);
  const [moves, setMoves] = useState(0);
  const [isGameComplete, setIsGameComplete] = useState(false);

  // Initialize game
  const initializeGame = () => {
    const gameCards: GameCard[] = [];
    players.forEach((player) => {
      // Create two cards for each player
      gameCards.push(
        {
          ...player,
          cardId: `${player.id}-1`,
          isFlipped: false,
          isMatched: false,
        },
        {
          ...player,
          cardId: `${player.id}-2`,
          isFlipped: false,
          isMatched: false,
        }
      );
    });
    
    // Shuffle cards
    const shuffledCards = gameCards.sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
    setFlippedCards([]);
    setMatches(0);
    setMoves(0);
    setIsGameComplete(false);
  };

  // Handle card click
  const handleCardClick = (cardId: string) => {
    if (flippedCards.length === 2) return;
    if (flippedCards.includes(cardId)) return;
    
    const card = cards.find(c => c.cardId === cardId);
    if (card?.isMatched) return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);
    
    // Flip the card
    setCards(prev => prev.map(card => 
      card.cardId === cardId 
        ? { ...card, isFlipped: true }
        : card
    ));

    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      
      const [firstCardId, secondCardId] = newFlippedCards;
      const firstCard = cards.find(c => c.cardId === firstCardId);
      const secondCard = cards.find(c => c.cardId === secondCardId);
      
      if (firstCard?.id === secondCard?.id) {
        // Match found
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            card.id === firstCard.id 
              ? { ...card, isMatched: true }
              : card
          ));
          setMatches(prev => prev + 1);
          setFlippedCards([]);
          
          toast({
            title: "¡Pareja encontrada!",
            description: `${firstCard.name} - Puesto #${firstCard.rank}`,
          });
        }, 500);
      } else {
        // No match - flip back after delay
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            newFlippedCards.includes(card.cardId)
              ? { ...card, isFlipped: false }
              : card
          ));
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  // Check for game completion
  useEffect(() => {
    if (matches === players.length && cards.length > 0) {
      setIsGameComplete(true);
      toast({
        title: "¡Felicidades!",
        description: `¡Has completado el juego en ${moves} movimientos!`,
      });
    }
  }, [matches, moves, cards.length, toast]);

  // Initialize game on mount
  useEffect(() => {
    initializeGame();
  }, []);

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Juego de Memoria
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Top 10 Jugadores de Tenis de Mesa Mundial
          </p>
          
          {/* Game Stats */}
          <div className="flex justify-center gap-8 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{matches}</div>
              <div className="text-sm text-muted-foreground">Parejas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{moves}</div>
              <div className="text-sm text-muted-foreground">Movimientos</div>
            </div>
          </div>
          
          <Button 
            onClick={initializeGame}
            variant="outline"
            className="mb-8"
          >
            Nuevo Juego
          </Button>
        </div>

        {/* Game Board */}
        <div className="grid grid-cols-4 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
          {cards.map((card) => (
            <Card
              key={card.cardId}
              className={`
                aspect-[5/8] cursor-pointer transition-all duration-300 hover:shadow-card
                ${card.isFlipped || card.isMatched 
                  ? 'bg-gradient-card' 
                  : 'bg-game-card hover:bg-game-card-hover'
                }
              `}
              onClick={() => handleCardClick(card.cardId)}
            >
              <div className="relative w-full h-full rounded-lg overflow-hidden">
                {card.isFlipped || card.isMatched ? (
                  <div className="relative w-full h-full">
                    <img
                      src={card.image}
                      alt={card.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <div className="text-center">
                        <div className="text-xs font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] 
                                        [text-shadow:_0_1px_0_rgb(255_255_255_/_40%),_0_2px_4px_rgb(0_0_0_/_80%)] mb-1">
                          {card.name}
                        </div>
                        <div className="text-xs font-bold text-primary drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]
                                        [text-shadow:_0_1px_0_rgb(255_255_255_/_60%),_0_2px_4px_rgb(0_0_0_/_80%)]
                                        bg-white/20 backdrop-blur-sm rounded-full px-2 py-1 inline-block">
                          #{card.rank}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full bg-gradient-primary">
                    <div className="text-4xl">🏓</div>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Game Complete Message */}
        {isGameComplete && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
            <Card className="p-8 text-center max-w-md animate-bounce-in">
              <div className="text-6xl mb-4">🏆</div>
              <h2 className="text-3xl font-bold mb-4 text-primary">
                ¡Felicidades!
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Has completado el juego de memoria en <span className="font-bold text-primary">{moves}</span> movimientos.
              </p>
              <Button 
                onClick={initializeGame}
                className="bg-gradient-primary hover:opacity-90"
              >
                Jugar de Nuevo
              </Button>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};