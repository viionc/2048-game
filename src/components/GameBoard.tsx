import {useEffect, useMemo, useState} from "react";
import Tile from "./Tile";
import {slideDown, slideLeft, slideRight, slideUp} from "../movingLogic";
import {addNumberToRandomTile, checkGameState} from "../helpers";

const KEYS = ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "W", "A", "S", "D"];
const INITIAL_BOARD = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
];

export type GameState = "won" | "lost" | "ongoing";

function GameBoard() {
    const [board, setBoard] = useState<number[][]>(INITIAL_BOARD);
    const [busy, setBusy] = useState(false);
    const [gameState, setGameState] = useState<GameState>("ongoing");

    const score = useMemo(() => board.flat().reduce((acc, cur) => acc + cur, 0), [board]);
    const bestScore = parseInt(localStorage.getItem("bestScore") || "0");

    const handleKeyDown = (e: KeyboardEvent) => {
        if (busy || gameState !== "ongoing") return;
        const {key} = e;
        if (!KEYS.includes(key)) return;
        setBusy(true);
        const copy = [...board];
        let movedTile = false;
        switch (key) {
            case "ArrowDown":
            case "S":
                movedTile = slideDown(copy);
                break;
            case "ArrowUp":
            case "W":
                movedTile = slideUp(copy);
                break;
            case "ArrowLeft":
            case "A":
                movedTile = slideLeft(copy);
                break;
            case "ArrowRight":
            case "D":
                movedTile = slideRight(copy);
                break;
        }
        if (movedTile) {
            addNumberToRandomTile(copy);
            setBoard([...copy]);
        }
        setBusy(false);
    };
    const resetGame = () => {
        if (score > bestScore) localStorage.setItem("bestScore", score.toString());
        const copy = [...INITIAL_BOARD];
        addNumberToRandomTile(copy);
        setBoard([...copy]);
        setGameState("ongoing");
    };

    useEffect(() => {
        setGameState(checkGameState(board));
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [board, busy]);

    useEffect(() => {
        const copy = [...board];
        addNumberToRandomTile(copy);
        setBoard([...copy]);
    }, []);

    return (
        <>
            <h1>
                Score: {score} Best: {bestScore}
            </h1>
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
        </>
    );
}

export default GameBoard;
