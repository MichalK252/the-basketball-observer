import './App.css'

import { useEffect, useState } from "react";

function App() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/ranking")
      .then(res => res.json())
      .then(data => setPlayers(data));
  }, []);

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '24px' }}>NBA Ranking</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {players.map((p: any, i) => (
          <div key={i} style={{ padding: '16px', border: '1px solid #eaeaea', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            <div>
              <span style={{ fontSize: '18px', fontWeight: 'bold', marginRight: '8px' }}>{i + 1}.</span>
              <span style={{ fontSize: '18px', fontWeight: '500' }}>{p.Player}</span>
              <div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>
                PPG: {p.PPG.toFixed(1)} | APG: {p.APG.toFixed(1)} | RPG: {p.RPG.toFixed(1)}
              </div>
            </div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#0070f3' }}>
              {p.ALL_AROUND_SCORE.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App