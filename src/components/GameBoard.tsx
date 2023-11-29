import {useEffect, useMemo, useState} from "react";
import Tile from "./Tile";
import {addNumberToRandomTile, checkGameState, handleSlideTiles} from "../helpers";

export type GameState = "won" | "lost" | "ongoing";
export type Position = {x: number; y: number};

const INITIAL_BOARD = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
];
const KEYS = ["arrowdown", "arrowup", "arrowleft", "arrowright", "w", "a", "s", "d"];

function GameBoard() {
    const [board, setBoard] = useState<number[][]>(JSON.parse(JSON.stringify(INITIAL_BOARD)));
    const [busy, setBusy] = useState(false);
    const [gameState, setGameState] = useState<GameState>("ongoing");
    const [touchStart, setTouchStart] = useState<Position>({x: 0, y: 0});

    const score = useMemo(() => board.flat().reduce((acc, cur) => acc + cur, 0), [board]);
    const bestScore = parseInt(localStorage.getItem("bestScore") || "0");

    const handleKeyDown = (e: KeyboardEvent) => {
        const lowerCase = e.key.toLowerCase();
        if (busy || gameState !== "ongoing" || !KEYS.includes(lowerCase)) return;
        moveTiles(lowerCase);
    };

    const handleTouchStart = (e: TouchEvent) => {
        const x = e.touches[0].clientX;
        const y = e.touches[0].clientY;
        setTouchStart({x, y});
    };
    const handleTouchEnd = (e: TouchEvent) => {
        console.log(e);
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const diffX = endX - touchStart.x;
        const diffXAbs = Math.abs(diffX);
        const diffY = endY - touchStart.y;
        const diffYAbs = Math.abs(diffY);
        if (Math.max(diffXAbs, diffYAbs) < 10) return;
        const key = diffXAbs > diffYAbs ? (diffX > 0 ? "arrowright" : "arrowleft") : diffY > 0 ? "arrowdown" : "arrowup";
        moveTiles(key);
    };

    const moveTiles = (key: string) => {
        setBusy(true);
        const copy = [...board];
        const movedTile = handleSlideTiles(key, copy);
        if (movedTile) {
            addNumberToRandomTile(copy);
            setBoard([...copy]);
        }
        setBusy(false);
    };

    const resetGame = () => {
        if (score > bestScore) localStorage.setItem("bestScore", score.toString());
        const copy = JSON.parse(JSON.stringify(INITIAL_BOARD));
        addNumberToRandomTile(copy);
        setBoard([...copy]);
        setGameState("ongoing");
    };

    useEffect(() => {
        setGameState(checkGameState(board));
        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("touchstart", handleTouchStart);
        window.addEventListener("touchend", handleTouchEnd);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("touchstart", handleTouchStart);
            window.removeEventListener("touchend", handleTouchEnd);
        };
    }, [board, busy]);

    useEffect(() => {
        const copy = [...board];
        addNumberToRandomTile(copy);
        setBoard([...copy]);
    }, []);

    return (
        <>
            <div className="w-full flex justify-center items-center flex-col md:flex-row md:gap-4">
                <h1>Score: {score}</h1>
                <h1>Best: {bestScore}</h1>
            </div>
            <div className="p-4 bg-zinc-700 rounded-lg grid grid-rows-4 gap-2">
                {board.map((row, i) => (
                    <div className="flex gap-2" key={i}>
                        {row.map((num, cellIndex) => (
                            <Tile key={`${i}-${cellIndex}`} number={num} />
                        ))}
                    </div>
                ))}
            </div>
            {gameState !== "ongoing" && (
                <div className="flex gap-4 items-center">
                    <h2>Game {gameState === "lost" ? "Lost" : "Won"}</h2> <button onClick={resetGame}>Reset</button>
                </div>
            )}
            <p>Controls: Arrow Keys, WSAD or Touch Screen</p>
        </>
    );
}

export default GameBoard;
