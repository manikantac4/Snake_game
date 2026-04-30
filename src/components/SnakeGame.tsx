import { useState, useEffect, useCallback, useRef } from 'react';
import { Gamepad2, RotateCcw } from 'lucide-react';

type Point = { x: number; y: number };

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
const INITIAL_DIRECTION = { x: 0, y: -1 }; // UP
const BASE_SPEED = 150;

export function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Use refs to avoid closures with stale state in keyboard event listener
  const directionRef = useRef(direction);
  const nextDirectionRef = useRef(direction); // Prevent multi-key rapid succession suicides
  
  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    let isOccupied = true;
    while (isOccupied) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      isOccupied = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    }
    return newFood!;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    nextDirectionRef.current = INITIAL_DIRECTION;
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setFood(generateFood(INITIAL_SNAKE));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for arrow keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (gameOver) {
        if (e.key === 'Enter' || e.key === ' ') resetGame();
        return;
      }

      if (e.key === ' ') {
        setIsPaused(p => !p);
        return;
      }

      const { x, y } = nextDirectionRef.current;
      
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (y !== 1) nextDirectionRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (y !== -1) nextDirectionRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (x !== 1) nextDirectionRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (x !== -1) nextDirectionRef.current = { x: 1, y: 0 };
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setDirection(nextDirectionRef.current);
      const currentDir = nextDirectionRef.current;
      
      setSnake(prevSnake => {
        const head = prevSnake[0];
        let newX = head.x + currentDir.x;
        let newY = head.y + currentDir.y;

        // Wrap around logic (passthrough walls)
        if (newX < 0) newX = GRID_SIZE - 1;
        else if (newX >= GRID_SIZE) newX = 0;
        
        if (newY < 0) newY = GRID_SIZE - 1;
        else if (newY >= GRID_SIZE) newY = 0;

        const newHead = { x: newX, y: newY };

        // Check self collision
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood(newSnake));
          // Don't pop the tail, so it grows
        } else {
          newSnake.pop(); // Remove tail if no food eaten
        }

        return newSnake;
      });
    };

    // Calculate speed based on score to increase difficulty slightly
    const speed = Math.max(50, BASE_SPEED - Math.floor(score / 50) * 10);
    const intervalId = setInterval(moveSnake, speed);
    
    return () => clearInterval(intervalId);
  }, [food, gameOver, isPaused, generateFood, score]);

  return (
    <div className="flex flex-col items-center w-full max-w-[480px]">
      <div className="flex gap-8 items-center justify-center mb-6">
        <div className="flex flex-col items-center">
          <span className="text-[10px] uppercase tracking-widest text-[#ff00ff] mb-1 font-bold animate-glitch" style={{animationDuration: '2s'}}>Current Score</span>
          <span 
            className="text-5xl font-digital text-[#00ffff] leading-none animate-glitch relative"
            style={{textShadow: "3px 3px 0px #ff00ff"}}
          >
            {score.toString().padStart(6, '0')}
          </span>
        </div>
      </div>

      <div className="relative border-4 border-[#ff00ff] bg-black p-1 shadow-[4px_4px_0px_#00ffff] w-full aspect-square mb-12">
        <div className="w-full h-full bg-black relative overflow-hidden" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,0,255,0.15) 2px, transparent 4px)" }}>
          {/* Game Grid Background */}
          <div 
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(to right, #00ffff 1px, transparent 1px), linear-gradient(to bottom, #00ffff 1px, transparent 1px)`,
              backgroundSize: `${100 / GRID_SIZE}% ${100 / GRID_SIZE}%`
            }}
          />

          {/* Food */}
          <div
            className="absolute bg-[#ff00ff] animate-pulse"
            style={{
              left: `${(food.x / GRID_SIZE) * 100}%`,
              top: `${(food.y / GRID_SIZE) * 100}%`,
              width: `${100 / GRID_SIZE}%`,
              height: `${100 / GRID_SIZE}%`,
              boxShadow: "0 0 10px #ff00ff"
            }}
          />

          {/* Snake */}
          {snake.map((segment, i) => {
            const isHead = i === 0;
            return (
              <div
                key={`${segment.x}-${segment.y}-${i}`}
                className={`absolute ${
                  isHead 
                    ? 'bg-[#00ffff] z-10' 
                    : 'bg-[#00ffff] opacity-80 border-2 border-black'
                }`}
                style={{
                  left: `${(segment.x / GRID_SIZE) * 100}%`,
                  top: `${(segment.y / GRID_SIZE) * 100}%`,
                  width: `${100 / GRID_SIZE}%`,
                  height: `${100 / GRID_SIZE}%`,
                  boxShadow: isHead ? "0 0 10px #00ffff" : "none"
                }}
              />
            );
          })}

          {/* Overlays */}
          {isPaused && !gameOver && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-20">
              <div className="text-2xl font-black text-[#ff00ff] tracking-widest uppercase border-4 border-[#00ffff] px-4 py-2 bg-black animate-glitch object-contain">
                PAUSED.SYS
              </div>
            </div>
          )}
        </div>

        {/* Overlay Controls Hint */}
        <div className="absolute -bottom-14 left-0 right-0 flex justify-center gap-4">
          {gameOver ? (
            <span className="text-[12px] text-black px-3 py-2 bg-[#ff00ff] border-2 border-[#00ffff] font-bold animate-pulse uppercase cursor-pointer" onClick={resetGame}>
              FATAL ERROR // CLICK TO REBOOT
            </span>
          ) : (
            <>
              <span className="text-[10px] text-[#00ffff] px-2 py-1 bg-black border-2 border-[#ff00ff]">WASD=MOVE</span>
              <span className="text-[10px] text-[#00ffff] px-2 py-1 bg-black border-2 border-[#ff00ff]">SPACE=HALT</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
