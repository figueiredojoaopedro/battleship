import { useState } from "react";

type ShipPosition = { row: number | null; col: number | null; hit: boolean };
type Grid = (null | boolean | String)[][];
type Ship = {
  name: string;
  size: number;
  positions: ShipPosition[];
  placed: boolean;
};
type Player = { ships: Ship[]; grid: Grid };
type Players = { player1: Player; player2: Player };
type Turn = "player1" | "player2";

const Game = () => {
  const [direcao, setDirecao] = useState<String>("horizontal");
  const [errorMessage, setErrorMessage] = useState<String>("");

  const [players, setPlayers] = useState<Players>({
    player1: {
      ships: [
        {
          name: "Porta Aviões",
          size: 4,
          positions: Array(4)
            .fill(null)
            .map(() => ({ row: null, col: null, hit: false })),
          placed: false,
        },
        {
          name: "Submarino",
          size: 3,
          positions: Array(3)
            .fill(null)
            .map(() => ({ row: null, col: null, hit: false })),
          placed: false,
        },
        {
          name: "Destróier",
          size: 2,
          positions: Array(2)
            .fill(null)
            .map(() => ({ row: null, col: null, hit: false })),
          placed: false,
        },
        {
          name: "Corveta",
          size: 2,
          positions: Array(2)
            .fill(null)
            .map(() => ({ row: null, col: null, hit: false })),
          placed: false,
        },
        {
          name: "Fragata",
          size: 1,
          positions: Array(1)
            .fill(null)
            .map(() => ({ row: null, col: null, hit: false })),
          placed: false,
        },
      ],
      grid: Array.from({ length: 10 }, () => Array(10).fill(null)), // se a pos for null, igual a vazio, se false, preenchida, mas não atingida, se true, atingida
    },
    player2: {
      ships: [
        {
          name: "Porta Aviões",
          size: 4,
          positions: Array(4)
            .fill(null)
            .map(() => ({ row: null, col: null, hit: false })),
          placed: false,
        },
        {
          name: "Submarino",
          size: 3,
          positions: Array(3)
            .fill(null)
            .map(() => ({ row: null, col: null, hit: false })),
          placed: false,
        },
        {
          name: "Destróier",
          size: 2,
          positions: Array(2)
            .fill(null)
            .map(() => ({ row: null, col: null, hit: false })),
          placed: false,
        },
        {
          name: "Corveta",
          size: 2,
          positions: Array(2)
            .fill(null)
            .map(() => ({ row: null, col: null, hit: false })),
          placed: false,
        },
        {
          name: "Fragata",
          size: 1,
          positions: Array(1)
            .fill(null)
            .map(() => ({ row: null, col: null, hit: false })),
          placed: false,
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
  };

  const handleShipDrop = (
    event: React.DragEvent<HTMLDivElement>,
    targetRow: number,
    targetCol: number
  ): void => {
    setErrorMessage("");
    const shipSize = parseInt(event.dataTransfer.getData("shipSize"));
    const shipName = event.dataTransfer.getData("shipName");

    const isHorizontal: boolean = direcao === "horizontal";
    let playerGridCopy = [...players[turn].grid.map((row) => [...row])];

    const currentShip = players[turn].ships.find(
      (ship) => ship.name === shipName
    );

    for (let i = 0; i < shipSize; i++) {
      const row = isHorizontal ? targetRow : targetRow + i;
      const col = isHorizontal ? targetCol + i : targetCol;

      if (row >= 10 || col >= 10) {
        console.error("Posição inválida! Está fora do tabuleiro.");
        setErrorMessage("Posição inválida! Está fora do tabuleiro.");
        return;
      }

      if (playerGridCopy[row][col] !== null) {
        console.error("Posição inválida! Este espaço já está ocupado.");
        setErrorMessage("Posição inválida! Este espaço já está ocupado.");
        return;
      }

      if (currentShip?.positions?.[i]) {
        currentShip.positions[i].row = row;
        currentShip.positions[i].col = col;
      }

      playerGridCopy[row][col] = false;
    }

    const ships = players[turn].ships.map((ship) => {
      if (ship.name === shipName) {
        ship.placed = true;
      }
      return ship;
    });

    const isSomeoneNotPlaced = ships.some((ship) => !ship.placed);

    if (!isSomeoneNotPlaced) {
      const newTurn = turn === "player1" ? "player2" : "player1";
      setTurn(newTurn);

      if (
        newTurn === "player1" &&
        players["player1"].ships.every((s) => s.placed) &&
        players["player2"].ships.every((s) => s.placed)
      ) {
        setIsGameStarted(true);
      }
    }

    setPlayers({
      ...players,
      [turn]: {
        ...players[turn],
        ships,
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

  const handleAttack = (row: number, col: number) => {
    if (!isGameStarted) {
      console.error("Game is not started yet");
      return;
    }

    const opponent = turn === "player1" ? "player2" : "player1";

    // creating new arrays out of the states to not affect their pointers in memory
    const opponentGrid = [...players[opponent].grid.map((r) => [...r])];
    const opponentShips = [...players[opponent].ships];

    if (opponentGrid[row][col] === true) {
      setErrorMessage("Você já atacou aqui.");
      return;
    }

    let hit = false;

    for (let ship of opponentShips) {
      for (let pos of ship.positions) {
        if (pos.row === row && pos.col === col) {
          pos.hit = true;
          hit = true;
        }
      }
    }

    opponentGrid[row][col] = hit ? true : "empty";
    // checking if everyone is sunk
    const allSunk = opponentShips.every((ship) =>
      ship.positions.every((pos) => pos.hit)
    );

    if (allSunk) {
      alert(`${turn.toUpperCase()} venceu o jogo!`);
      restartGame();
    } else {
      setTurn(opponent);
    }

    setPlayers({
      ...players,
      [opponent]: {
        ...players[opponent],
        grid: opponentGrid,
        ships: opponentShips,
      },
    });
  };

  const restartGame = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
      <div className="flex flex-col items-center mb-2">
        <h2 className="text-4xl font-bold mb-8">Campo de batalha</h2>
        <p className="text-xl font-bold">
          {turn}{" "}
          {isGameStarted ? "está atacando" : "está escolhendo as posições..."}
        </p>
        {errorMessage && (
          <p className="text-red-500 font-bold">{errorMessage}</p>
        )}
      </div>
      <div className="flex flex-row items-center justify-center">
        <div className="grid grid-cols-10 border-1">
          {!isGameStarted &&
            players[turn].grid.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => handleShipDrop(event, rowIndex, colIndex)}
                  style={{
                    backgroundColor:
                      cell === false ? "gray" : cell === true ? "red" : "",
                  }}
                  className="w-14 h-14 bg-blue-500 border border-white hover:bg-blue-400 cursor-pointer"
                />
              ))
            )}
          {isGameStarted &&
            players[turn === "player1" ? "player2" : "player1"].grid.map(
              (row, rowIndex) =>
                row.map((cell, colIndex) => {
                  return (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      onClick={() => handleAttack(rowIndex, colIndex)}
                      style={{
                        backgroundColor:
                          cell === true
                            ? "red"
                            : cell === "empty"
                            ? "black"
                            : undefined,
                      }}
                      className="w-14 h-14 bg-blue-500 border border-white hover:bg-blue-400 cursor-pointer"
                    />
                  );
                })
            )}
        </div>
        <div className="flex flex-col gap-3 ml-8">
          {!isGameStarted && (
            <div>
              <button
                onClick={handleRotacionar}
                className="transition duration-150 ease-in-out hover:bg-gray-200 bg-white rounded-sm p-4 text-black cursor-pointer"
              >
                Rotacionar
              </button>
            </div>
          )}
          <div>
            <div>
              {!isGameStarted &&
                players?.[turn]?.ships?.map((ship, index) => {
                  const isHorizontal = direcao === "horizontal";
                  return (
                    <span key={index + "spanShips"}>
                      {!ship.placed && (
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
                                height: isHorizontal
                                  ? "40px"
                                  : `${ship.size * 40}px`,
                                display: "flex",
                                flexDirection: "row",
                              }}
                              className={`border-1 border-white rounded-sm cursor-grab bg-gray-500`}
                            ></div>
                          </div>
                        </div>
                      )}
                    </span>
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
