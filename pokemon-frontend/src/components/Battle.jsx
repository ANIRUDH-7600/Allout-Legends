// pokemon-frontend/src/components/Battle.jsx
import { useState, useEffect } from 'react';
import { generateWildPokemon, calculateDamage, getPokemonSprite } from '../data/pokemon/battleHelpers';
import { getRandomPokemon, POKEMON_DATA } from '../data/pokemon/pokemonData';

export default function Battle({ exitBattle, area = "grass" }) {
  const [enemy, setEnemy] = useState(null);
  const [enemyHp, setEnemyHp] = useState(0);
  const [message, setMessage] = useState("Loading...");
  const [selectedAction, setSelectedAction] = useState(0);
  const [phase, setPhase] = useState("action");
  const [selectedMove, setSelectedMove] = useState(0);
  const [player, setPlayer] = useState(null);
  
  // Player Pokémon (temp - will be expanded later)
  const [playerPokemon] = useState({
    name: "PIKACHU",
    level: 10,
    hp: 50,
    maxHp: 50,
    attack: 35,
    defense: 30,
    spAttack: 40,
    spDefense: 35,
    speed: 55,
    type1: "Electric",
    type2: null,
    moves: [
      { name: "ThunderShock", power: 40, type: "Electric", category: "special" },
      { name: "Quick Attack", power: 40, type: "Normal", category: "physical" },
      { name: "Tail Whip", power: 0, type: "Normal", category: "status" },
      { name: "Growl", power: 0, type: "Normal", category: "status" }
    ],
    sprite: "/assets/pokemons/025.png"
  });
  
  const [playerHp, setPlayerHp] = useState(playerPokemon.hp);
  
  const actions = ["FIGHT", "RUN"];
  
  useEffect(() => {
    // Get random wild Pokémon based on area
    const randomPokemon = getRandomPokemon(0, 255);
    if (randomPokemon) {
      const wildPokemon = generateWildPokemon(randomPokemon, Math.floor(Math.random() * 5) + 2);
      setEnemy(wildPokemon);
      setEnemyHp(wildPokemon.hp);
      setMessage(`A wild ${wildPokemon.name} (Lv.${wildPokemon.level}) appeared!`);
    } else {
      setMessage("Error loading Pokémon!");
    }
  }, []);
  
  const handleAction = (idx) => {
    setSelectedAction(idx);
    if (actions[idx] === "FIGHT") {
      setPhase("fight");
      setMessage("Choose a move!");
    } else if (actions[idx] === "RUN") {
      if (Math.random() < 0.5) {
        setMessage("Got away safely!");
        setTimeout(exitBattle, 1200);
      } else {
        setMessage("Couldn't escape!");
        setPhase("action");
        // Enemy attacks after failed run
        enemyAttack();
      }
    }
  };
  
  const enemyAttack = () => {
    // Simple enemy attack
    const damage = Math.floor(Math.random() * 15) + 5;
    const newHp = Math.max(0, playerHp - damage);
    setPlayerHp(newHp);
    setMessage(`${enemy.name} attacked! It dealt ${damage} damage!`);
    
    if (newHp <= 0) {
      setMessage(`${enemy.name} defeated your Pokémon! You blacked out!`);
      setTimeout(() => {
        exitBattle();
        // Reset player position or handle defeat
      }, 2000);
    }
  };
  
  const handleMove = (idx) => {
    setSelectedMove(idx);
    const move = playerPokemon.moves[idx];
    
    if (!move || move.power === 0) {
      setMessage(`${playerPokemon.name} used ${move.name}! But it had no effect!`);
      setTimeout(() => {
        setPhase("action");
        setSelectedAction(0);
        enemyAttack();
      }, 1500);
      return;
    }
    
    // Calculate damage
    const damage = calculateDamage(move, playerPokemon, enemy);
    const newHp = Math.max(0, enemyHp - damage);
    setEnemyHp(newHp);
    
    let effectivenessText = "";
    // Check type effectiveness (simplified)
    if (damage > enemyHp * 0.5) effectivenessText = " It's super effective!";
    else if (damage < enemyHp * 0.1) effectivenessText = " It's not very effective...";
    
    setMessage(`${playerPokemon.name} used ${move.name}! It dealt ${damage} damage!${effectivenessText}`);
    
    if (newHp <= 0) {
      setMessage(`${enemy.name} fainted! You won!`);
      setTimeout(exitBattle, 2000);
    } else {
      setTimeout(() => {
        enemyAttack();
        setPhase("action");
        setSelectedAction(0);
      }, 1500);
    }
  };
  
  const hpPercent = (enemyHp / (enemy?.maxHp || 1)) * 100;
  const hpClass = hpPercent > 50 ? "" : hpPercent > 20 ? "medium" : "low";
  
  const playerHpPercent = (playerHp / playerPokemon.maxHp) * 100;
  
  if (!enemy) {
    return (
      <div className="battle-container">
        <div style={{ textAlign: "center", padding: "200px" }}>Loading...</div>
      </div>
    );
  }
  
  return (
    <div className="battle-container">
      <div className="battle-scene">
        {/* Enemy */}
        <div className="enemy-area">
          <div className="enemy-card">
            <div className="enemy-name">{enemy.name}</div>
            <div className="enemy-level">Lv.{enemy.level}</div>
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
          <div className="enemy-sprite">
            <img 
              src={enemy.sprite} 
              alt={enemy.name}
              style={{ width: "80px", height: "80px", imageRendering: "pixelated" }}
              onError={(e) => { e.target.src = "/assets/pokemons/000.png"; }}
            />
          </div>
        </div>
        
        {/* Player */}
        <div className="player-battle-area">
          <div className="player-battle-sprite">
            <img 
              src={playerPokemon.sprite} 
              alt={playerPokemon.name}
              style={{ width: "64px", height: "64px", imageRendering: "pixelated" }}
              onError={(e) => { e.target.src = "/assets/pokemons/025.png"; }}
            />
          </div>
          <div className="player-card-battle">
            <div className="enemy-name">{playerPokemon.name}</div>
            <div className="enemy-level">Lv.{playerPokemon.level}</div>
            <div className="battle-hp-bar">
              <div 
                className="battle-hp-fill" 
                style={{ width: `${playerHpPercent}%` }}
              />
            </div>
            <div style={{ fontSize: "5px", color: "#555", marginTop: "3px", fontFamily: "inherit" }}>
              {playerHp}/{playerPokemon.maxHp} HP
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
            : playerPokemon.moves.map((move, i) => (
                <button
                  key={move.name}
                  className={`battle-btn ${selectedMove === i ? "selected" : ""}`}
                  onClick={() => handleMove(i)}
                >
                  {move.name}
                </button>
              ))
          }
        </div>
      </div>
    </div>
  );
}