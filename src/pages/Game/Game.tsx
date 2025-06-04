import React, { useState } from "react";
import frigate from "../../assets/frigate.svg";
import destroyer from "../../assets/destroyer.svg";
import aircraftcarrier from "../../assets/aircraftcarrier.svg";
import submarine from "../../assets/submarine.svg";
import corvette from "../../assets/corvette.svg";

// Tipos para as posições dos navios, grid, navio, jogador e jogadores
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
  // Estado para direção do navio (horizontal/vertical) e mensagens de erro
  const [direcao, setDirecao] = useState<String>("horizontal");
  const [errorMessage, setErrorMessage] = useState<String>("");

  // Estado dos jogadores, navios e grids
  const [players, setPlayers] = useState<Players>({
    player1: {
      ships: [
        // Lista de navios do player1
        {
          name: "Porta Aviões",
          size: 4,
          positions: Array(4)
            .fill(null)
            .map(() => ({ row: null, col: null, hit: false })),
          placed: false,
        },
        // ...outros navios...
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
      grid: Array.from({ length: 10 }, () => Array(10).fill(null)), // Grid 10x10
    },
    player2: {
      ships: [
        // Lista de navios do player2 (igual ao player1)
        {
          name: "Porta Aviões",
          size: 4,
          positions: Array(4)
            .fill(null)
            .map(() => ({ row: null, col: null, hit: false })),
          placed: false,
        },
        // ...outros navios...
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

  // Estado para saber se o jogo começou e de quem é a vez
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [turn, setTurn] = useState<Turn>("player1");

  // Função para calcular largura do navio para exibição
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

  // Função chamada ao começar a arrastar um navio
  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    ship: Ship
  ): void => {
    event.dataTransfer.setData("shipName", ship.name);
    event.dataTransfer.setData("shipSize", ship.size.toString());
  };

  // Função chamada ao soltar um navio no grid
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

    // Verifica se a posição é válida e não está ocupada
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

    // Marca o navio como colocado
    const ships = players[turn].ships.map((ship) => {
      if (ship.name === shipName) {
        ship.placed = true;
      }
      return ship;
    });

    // Se todos os navios foram colocados, troca o turno
    const isSomeoneNotPlaced = ships.some((ship) => !ship.placed);

    if (!isSomeoneNotPlaced) {
      const newTurn = turn === "player1" ? "player2" : "player1";
      setTurn(newTurn);

      // Se ambos já colocaram, inicia o jogo
      if (
        newTurn === "player1" &&
        players["player1"].ships.every((s) => s.placed) &&
        players["player2"].ships.every((s) => s.placed)
      ) {
        setIsGameStarted(true);
      }
    }

    // Atualiza o estado dos jogadores
    setPlayers({
      ...players,
      [turn]: {
        ...players[turn],
        ships,
        grid: playerGridCopy,
      },
    });
  };

  // Alterna a direção do navio
  const handleRotacionar = () => {
    if (direcao === "horizontal") {
      setDirecao("vertical");
    }

    if (direcao === "vertical") {
      setDirecao("horizontal");
    }
  };

  // Função para atacar uma célula do oponente
  const handleAttack = (row: number, col: number) => {
    if (!isGameStarted) {
      console.error("Game is not started yet");
      return;
    }

    const opponent = turn === "player1" ? "player2" : "player1";

    // Cria cópias dos arrays para não alterar diretamente o estado
    const opponentGrid = [...players[opponent].grid.map((r) => [...r])];
    const opponentShips = [...players[opponent].ships];

    // Verifica se já atacou essa célula
    if (opponentGrid[row][col] === true) {
      setErrorMessage("Você já atacou aqui.");
      return;
    }

    let hit = false;

    // Marca como atingido se acertou um navio
    for (let ship of opponentShips) {
      for (let pos of ship.positions) {
        if (pos.row === row && pos.col === col) {
          pos.hit = true;
          hit = true;
        }
      }
    }

    opponentGrid[row][col] = hit ? true : "empty";
    // Verifica se todos os navios foram afundados
    const allSunk = opponentShips.every((ship) =>
      ship.positions.every((pos) => pos.hit)
    );

    if (allSunk) {
      alert(`${turn.toUpperCase()} venceu o jogo!`);
      restartGame();
    } else {
      setTurn(opponent);
    }

    // Atualiza o estado dos jogadores
    setPlayers({
      ...players,
      [opponent]: {
        ...players[opponent],
        grid: opponentGrid,
        ships: opponentShips,
      },
    });
  };

  // Reinicia o jogo recarregando a página
  const restartGame = () => {
    window.location.reload();
  };

  // Renderização do componente
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
      <div className="flex flex-row justify-center items-center">
        <div
          className="grid"
          style={{
            gridTemplateColumns: "40px repeat(10, 56px)",
            gridAutoRows: "56px",
          }}
        >
          {/* Cabeçalho das colunas */}
          <div></div>
          {"ABCDEFGHIJ".split("").map((letter, i) => (
            <div
              key={`col-${i}`}
              className="flex items-center justify-center font-bold"
            >
              {letter}
            </div>
          ))}

          {/* Renderiza as linhas do grid */}
          {players[turn].grid.map((row, rowIndex) => (
            <React.Fragment key={`row-${rowIndex}`}>
              {/* Cabeçalho da linha */}
              <div className="flex items-center justify-center font-bold">
                {rowIndex + 1}
              </div>
              {row.map((cell, colIndex) => {
                // Desabilita célula se o jogo começou e é a vez do player1
                const isCellDisabled = isGameStarted && turn === "player1";
                // Mostra o conteúdo correto da célula dependendo do estado do jogo
                const cellContent = isGameStarted
                  ? players[turn === "player1" ? "player2" : "player1"].grid[
                      rowIndex
                    ][colIndex]
                  : players[turn].grid[rowIndex][colIndex];

                // Define cor de fundo da célula
                const backgroundColor = !isGameStarted
                  ? cellContent === false
                    ? "gray"
                    : ""
                  : cellContent === true
                  ? "red"
                  : cellContent === "empty"
                  ? "black"
                  : "";

                return (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    onClick={
                      isGameStarted
                        ? () => handleAttack(rowIndex, colIndex)
                        : undefined
                    }
                    onDrop={
                      !isGameStarted
                        ? (event) => handleShipDrop(event, rowIndex, colIndex)
                        : undefined
                    }
                    onDragOver={
                      !isGameStarted
                        ? (event) => event.preventDefault()
                        : undefined
                    }
                    style={{ backgroundColor }}
                    className="w-14 h-14 bg-blue-500 border border-white hover:bg-blue-400 cursor-pointer"
                  >
                    <svg></svg>
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
        <div className="flex flex-col gap-3 ml-8">
          {/* Botão de rotacionar navio */}
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
              {/* Lista de navios para arrastar */}
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
                              className={`border-1 border-white rounded-sm cursor-grab bg-blue-300`}
                            >
                              {/* Render SVG based on ship name */}
                              {ship.name === "Porta Aviões" && (
                                <img
                                  className="scale-200"
                                  src={aircraftcarrier}
                                  alt="Porta Aviões"
                                  style={{
                                    minWidth: "100%",
                                    minHeight: "100%",
                                    transform: isHorizontal
                                      ? ""
                                      : "rotate(90deg)",
                                  }}
                                />
                              )}
                              {ship.name === "Submarino" && (
                                <img
                                  className="scale-200"
                                  src={submarine}
                                  alt="Submarino"
                                  style={{
                                    minWidth: "100%",
                                    minHeight: "100%",
                                    transform: isHorizontal
                                      ? ""
                                      : "rotate(90deg)",
                                  }}
                                />
                              )}
                              {ship.name === "Destróier" && (
                                <img
                                  src={destroyer}
                                  className="scale-150"
                                  alt="Destróier"
                                  style={{
                                    minWidth: "100%",
                                    minHeight: "100%",
                                    transform: isHorizontal
                                      ? ""
                                      : "rotate(90deg)",
                                  }}
                                />
                              )}
                              {ship.name === "Corveta" && (
                                <img
                                  src={corvette}
                                  className="scale-200"
                                  alt="Corveta"
                                  style={{
                                    minWidth: "100%",
                                    minHeight: "100%",
                                    transform: isHorizontal
                                      ? ""
                                      : "rotate(90deg)",
                                  }}
                                />
                              )}
                              {ship.name === "Fragata" && (
                                <img
                                  src={frigate}
                                  className="scale-200"
                                  alt="Fragata"
                                  style={{
                                    minWidth: "100%",
                                    minHeight: "100%",
                                    transform: isHorizontal
                                      ? ""
                                      : "rotate(90deg)",
                                  }}
                                />
                              )}
                            </div>
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
