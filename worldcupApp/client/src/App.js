import React from 'react';
import Reacket from 'reacket';
import './App.styles.css';
import './reacket.theme.css';

const matches = require('./data/worldcupData.json');

function App() {
  return (
    <div className="container">
      <header className="header">
        <h1>World Cup 2022</h1>
      </header>
      <main>
        <Reacket matches={matches} />
      </main>
    </div>
  );
}

//function updateData() {
//  const pickData = require('./data/picks.json');
//  for (let i = 0; i < pickData.length; i++) {
//    let eachPick = pickData[i];
//    console.log(eachPick.name);
//  }
//}

export default App;