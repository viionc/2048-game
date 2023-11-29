let movedTile = false;

export const slideLeft = (board: number[][]) => {
    movedTile = false;
    for (let i = 0; i < board.length; i++) {
        const row = board[i];
        const filteredRow = slide(row);
        while (filteredRow.length < row.length) {
            filteredRow.push(0);
        }
        board[i] = filteredRow;
        if (!movedTile && JSON.stringify(row) !== JSON.stringify(filteredRow)) {
            movedTile = true;
        }
    }
    return movedTile;
};

export const slideRight = (board: number[][]) => {
    movedTile = false;
    for (let i = 0; i < board.length; i++) {
        const row = board[i];
        const filteredRow = slide(row);
        while (filteredRow.length < row.length) {
            filteredRow.unshift(0);
        }
        board[i] = filteredRow;
        if (!movedTile && JSON.stringify(row) !== JSON.stringify(filteredRow)) {
            movedTile = true;
        }
    }
    return movedTile;
};

export const slideUp = (board: number[][]) => {
    movedTile = false;
    for (let i = 0; i < board.length; i++) {
        const column = [];
        for (let j = 0; j < board.length; j++) {
            column.push(board[j][i]);
        }
        const filteredColumn = slide(column);
        while (filteredColumn.length < column.length) {
            filteredColumn.push(0);
        }
        for (let k = 0; k < board.length; k++) {
            board[k][i] = filteredColumn[k];
        }
        if (!movedTile && JSON.stringify(column) !== JSON.stringify(filteredColumn)) {
            movedTile = true;
        }
    }
    return movedTile;
};

export const slideDown = (board: number[][]) => {
    movedTile = false;
    for (let i = 0; i < board.length; i++) {
        const column = [];
        for (let j = board.length - 1; j >= 0; j--) {
            column.push(board[j][i]);
        }
        const reversedColumn = column.slice().reverse();
        const filteredColumn = slide(reversedColumn);
        while (filteredColumn.length < board.length) {
            filteredColumn.unshift(0);
        }
        const filteredColumnCopy = [...filteredColumn];
        filteredColumn.reverse();
        for (let k = board.length - 1; k >= 0; k--) {
            board[k][i] = filteredColumn.shift() as number;
        }
        if (!movedTile && JSON.stringify(reversedColumn) !== JSON.stringify(filteredColumnCopy)) {
            movedTile = true;
        }
    }
    return movedTile;
};

const slide = (row: number[]) => {
    const _row = row.filter((num) => num !== 0);
    for (let j = 0; j < _row.length - 1; j++) {
        if (_row[j] === _row[j + 1]) {
            _row[j] *= 2;
            _row[j + 1] = 0;
            movedTile = true;
        }
    }
    const filteredRow = _row.filter((num) => num !== 0);
    return filteredRow;
};
