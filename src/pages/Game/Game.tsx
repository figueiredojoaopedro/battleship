import { useState } from "react";

type ShipPosition = { row: number | null; col: number | null; hit: boolean };
type Grid = (null | boolean)[][];
type Ship = {
  name: string;
  size: number;
  positions: ShipPosition[];
};
type Player = { ready: boolean; ships: Ship[]; grid: Grid };
type Players = { player1: Player; player2: Player };
type Turn = "player1" | "player2";

const Game = () => {
  const [direcao, setDirecao] = useState<String>("horizontal");
  const [errorMessage, setErrorMessage] = useState<String>("");

  const [players, setPlayers] = useState<Players>({
    player1: {
      ready: false,
      ships: [
        {
          name: "Porta Aviões",
          size: 4,
          positions: Array(4).fill({ row: null, col: null, hit: false }),
        },
        {
          name: "Submarino",
          size: 3,
          positions: Array(3).fill({ row: null, col: null, hit: false }),
        },
        {
          name: "Destróier",
          size: 2,
          positions: Array(2).fill({ row: null, col: null, hit: false }),
        },
        {
          name: "Destróier",
          size: 2,
          positions: Array(2).fill({ row: null, col: null, hit: false }),
        },
        {
          name: "Fragata",
          size: 1,
          positions: Array(1).fill({ row: null, col: null, hit: false }),
        },
      ],
      grid: Array.from({ length: 10 }, () => Array(10).fill(null)), // se a pos for null, igual a vazio, se false, preenchida, mas não atingida, se true, atingida
    },
    player2: {
      ready: false,
      ships: [
        {
          name: "Porta Aviões",
          size: 4,
          positions: Array(4).fill({ row: null, col: null, hit: false }),
        },
        {
          name: "Submarino",
          size: 3,
          positions: Array(3).fill({ row: null, col: null, hit: false }),
        },
        {
          name: "Destróier",
          size: 2,
          positions: Array(2).fill({ row: null, col: null, hit: false }),
        },
        {
          name: "Destróier",
          size: 2,
          positions: Array(2).fill({ row: null, col: null, hit: false }),
        },
        {
          name: "Fragata",
          size: 1,
          positions: Array(1).fill({ row: null, col: null, hit: false }),
        },
      ],
      grid: Array.from({ length: 10 }, () => Array(10).fill(null)),
    },
  });

  const [isGameStarted, setIsGameStarted] = useState(false);
  const [turn, setTurn] = useState<Turn>("player1");

  const getShipWidth = (size: number): string => {
    const widthMap: { [key: number]: number } = {
      1: 10,
      2: 20,
      3: 30,
      4: 40,
      5: 50,
    };

    return (widthMap[size] * 5).toString() + "px" || (14 * 2).toString() + "px";
  };

  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    ship: Ship
  ): void => {
    event.dataTransfer.setData("shipName", ship.name);
    event.dataTransfer.setData("shipSize", ship.size.toString());

    console.log("test ship", event.dataTransfer.getData("shipName"));
    console.log("test shipSize", event.dataTransfer.getData("shipSize"));
  };

  const handleShipDrop = (
    event: React.DragEvent<HTMLDivElement>,
    targetRow: number,
    targetCol: number
  ): void => {
    setErrorMessage("");
    const shipSize = parseInt(event.dataTransfer.getData("shipSize"));

    const isHorizontal: boolean = direcao === "horizontal";
    console.log("test", [...players[turn].grid.map((row) => [...row])]);
    let playerGridCopy = [...players[turn].grid.map((row) => [...row])];

    for (let i = 0; i < shipSize; i++) {
      const row = isHorizontal ? targetRow : targetRow + i;
      const col = isHorizontal ? targetCol + i : targetCol;

      if (row >= 10 || col >= 10) {
        console.log("Posição inválida! Está fora do tabuleiro.");
        setErrorMessage("Posição inválida! Está fora do tabuleiro.");
        return;
      }

      if (playerGridCopy[row][col] !== null) {
        console.log("Posição inválida! Este espaço já está ocupado.");
        setErrorMessage("Posição inválida! Este espaço já está ocupado.");
        return;
      }

      playerGridCopy[row][col] = false;
    }

    setPlayers({
      ...players,
      [turn]: {
        ...players[turn],
        grid: playerGridCopy,
      },
    });
  };

  const handleRotacionar = () => {
    if (direcao === "horizontal") {
      setDirecao("vertical");
    }

    if (direcao === "vertical") {
      setDirecao("horizontal");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
      <div className="flex flex-col items-center mb-2">
        <h2 className="text-4xl font-bold mb-8">Campo de batalha</h2>
        <p className="text-xl font-bold">
          {turn} está escolhendo as posições...
        </p>
        {errorMessage && (
          <p className="text-red-500 font-bold">{errorMessage}</p>
        )}
      </div>
      <div className="flex flex-row items-center justify-center">
        <div className="grid grid-cols-10 border-1">
          {players[turn].grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => handleShipDrop(event, rowIndex, colIndex)}
                className="w-14 h-14 bg-blue-500 border border-white hover:bg-blue-400 cursor-pointer"
              />
            ))
          )}
        </div>
        <div className="flex flex-col gap-3 ml-8">
          <div>
            <button
              onClick={handleRotacionar}
              className="transition duration-150 ease-in-out hover:bg-gray-200 bg-white rounded-sm p-4 text-black cursor-pointer"
            >
              Rotacionar
            </button>
          </div>
          <div>
            <div>
              {players[turn].ships.map((ship, index) => {
                const isHorizontal = direcao === "horizontal";
                return (
                  <div key={index}>
                    <h4>{ship.name}</h4>
                    <div className="flex">
                      <div
                        draggable
                        onDragStart={(event) => onDragStart(event, ship)}
                        style={{
                          width: isHorizontal
                            ? getShipWidth(ship.size)
                            : "40px",
                          height: isHorizontal ? "40px" : `${ship.size * 40}px`,
                          display: "flex",
                          flexDirection: "row",
                        }}
                        className={`border-1 border-white rounded-sm cursor-grab bg-red-500`}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;
