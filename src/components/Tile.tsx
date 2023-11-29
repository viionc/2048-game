interface TileProps {
    number: number;
}

const colorsMap: Record<number, string> = {
    0: "#a3a3a3",
    2: "#a5b4fc",
    4: "#818cf8",
    8: "#6366f1",
    16: "#4f46e5",
    32: "#4338ca",
    64: "#3730a3",
    128: "#312e81",
    256: "#1e1b4b",
    512: "#2e1065",
    1024: "#0f172a",
    2048: "#030712",
};
function Tile({number}: TileProps) {
    const color = colorsMap[number];
    return (
        <div className="w-16 h-16 md:w-24 md:h-24 rounded-md flex justify-center items-center text-2xl md:text-4xl" style={{backgroundColor: color}}>
            {number ? number : ""}
        </div>
    );
}

export default Tile;
