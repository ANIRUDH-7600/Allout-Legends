import { useState } from "react";

const WILD_POKEMON = [
  { name: "BULBASAUR", level: 5, hp: 45, maxHp: 45, emoji: "🌿" },
  { name: "RATTATA",   level: 3, hp: 30, maxHp: 30, emoji: "🐭" },
  { name: "PIDGEY",    level: 4, hp: 35, maxHp: 35, emoji: "🐦" },
  { name: "CATERPIE",  level: 2, hp: 20, maxHp: 20, emoji: "🐛" },
];

const MOVES = ["TACKLE", "GROWL", "TAIL WHIP", "SCRATCH"];

export default function Battle({ exitBattle }) {
  const [enemy] = useState(() => {
    const e = WILD_POKEMON[Math.floor(Math.random() * WILD_POKEMON.length)];
    return { ...e };
  });
  const [enemyHp, setEnemyHp] = useState(enemy.hp);
  const [message, setMessage] = useState(`A wild ${enemy.name} appeared!`);
  const [selectedAction, setSelectedAction] = useState(0);
  const [phase, setPhase] = useState("action"); // action | fight | fled
  const [playerHp] = useState(50);
  const [selectedMove, setSelectedMove] = useState(0);

  const actions = ["FIGHT", "BAG", "POKEMON", "RUN"];

  const handleAction = (idx) => {
    setSelectedAction(idx);
    if (actions[idx] === "FIGHT") {
      setPhase("fight");
      setMessage("Choose a move!");
    } else if (actions[idx] === "RUN") {
      setMessage("Got away safely!");
      setTimeout(exitBattle, 1200);
    } else if (actions[idx] === "BAG") {
      setMessage("Your bag is empty!");
    } else {
      setMessage("No other Pokémon!");
    }
  };

  const handleMove = (idx) => {
    setSelectedMove(idx);
    const dmg = Math.floor(Math.random() * 12) + 5;
    const newHp = Math.max(0, enemyHp - dmg);
    setEnemyHp(newHp);

    if (newHp <= 0) {
      setMessage(`${enemy.name} fainted! You win!`);
      setTimeout(exitBattle, 1500);
    } else {
      setMessage(`You used ${MOVES[idx]}! It dealt ${dmg} damage!`);
    }
    setPhase("action");
    setSelectedAction(0);
  };

  const hpPercent = (enemyHp / enemy.maxHp) * 100;
  const hpClass = hpPercent > 50 ? "" : hpPercent > 20 ? "medium" : "low";

  return (
    <div className="battle-container">
      <div className="battle-scene">
        {/* Enemy */}
        <div className="enemy-area">
          <div className="enemy-card">
            <div className="enemy-name">{enemy.name}</div>
            <div className="enemy-level">Lv{enemy.level}</div>
            <div className="battle-hp-bar">
              <div
                className={`battle-hp-fill ${hpClass}`}
                style={{ width: `${hpPercent}%` }}
              />
            </div>
            <div style={{ fontSize: "5px", color: "#555", marginTop: "3px", fontFamily: "inherit" }}>
              {enemyHp}/{enemy.maxHp} HP
            </div>
          </div>
          <div className="enemy-sprite" style={{ fontSize: "64px", lineHeight: 1 }}>
            {enemy.emoji}
          </div>
        </div>

        {/* Player */}
        <div className="player-battle-area">
          <div style={{ fontSize: "40px" }}>🧑</div>
          <div className="player-card-battle">
            <div className="enemy-name">TRAINER</div>
            <div className="enemy-level">Lv10</div>
            <div className="battle-hp-bar">
              <div className="battle-hp-fill" style={{ width: `${(playerHp / 50) * 100}%` }} />
            </div>
            <div style={{ fontSize: "5px", color: "#555", marginTop: "3px", fontFamily: "inherit" }}>
              {playerHp}/50 HP
            </div>
          </div>
        </div>
      </div>

      {/* Battle UI */}
      <div className="battle-ui">
        <div className="battle-message">
          <div className="battle-text">{message}</div>
        </div>

        <div className="battle-actions">
          {phase === "action"
            ? actions.map((action, i) => (
                <button
                  key={action}
                  className={`battle-btn ${selectedAction === i ? "selected" : ""}`}
                  onClick={() => handleAction(i)}
                >
                  {action}
                </button>
              ))
            : MOVES.map((move, i) => (
                <button
                  key={move}
                  className={`battle-btn ${selectedMove === i ? "selected" : ""}`}
                  onClick={() => handleMove(i)}
                >
                  {move}
                </button>
              ))
          }
        </div>
      </div>
    </div>
  );
}