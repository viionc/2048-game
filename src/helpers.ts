import {GameState} from "./components/GameBoard";
import {slideDown, slideUp, slideLeft, slideRight} from "./movingLogic";

export const addNumberToRandomTile = (boardCopy: number[][]) => {
    const emptyCells = boardCopy
        .flat()
        .map((num, index) => (num === 0 ? index : null))
        .filter((index) => index !== null);
    if (!emptyCells.length) return;
    const index = Math.floor(Math.random() * emptyCells.length);
    const randomEmptyCellIndex = emptyCells[index] as number;
    const i = Math.floor(randomEmptyCellIndex / 4);
    const cellIndex = randomEmptyCellIndex % 4;
    boardCopy[i][cellIndex] = 2;
};

export const checkGameState = (board: number[][]): GameState => {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
            if (board[i][j] === 2048) return "won";
            if (board[i][j] === 0) return "ongoing";
        }
    }
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length - 1; j++) {
            if (board[i][j] === board[i][j + 1]) {
                return "ongoing";
            }
        }
    }
    for (let j = 0; j < board.length; j++) {
        for (let i = 0; i < board.length - 1; i++) {
            if (board[i][j] === board[i + 1][j]) {
                return "ongoing";
            }
        }
    }
    return "lost";
};

export const handleSlideTiles = (key: string, board: number[][]) => {
    let movedTile = false;
    switch (key) {
        case "arrowdown":
        case "s":
            movedTile = slideDown(board);
            break;
        case "arrowup":
        case "w":
            movedTile = slideUp(board);
            break;
        case "arrowleft":
        case "a":
            movedTile = slideLeft(board);
            break;
        case "arrowright":
        case "d":
            movedTile = slideRight(board);
            break;
    }
    return movedTile;
};
