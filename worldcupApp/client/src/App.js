import React from 'react';
import Reacket from 'reacket';
import './App.styles.css';
import './reacket.theme.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: 'Score Board',
    },
  },
};

let scoreData = require('./data/points.json');
const labels = [];
for (let i = 0; i < scoreData.length; i++) {
  labels.push(scoreData[i].name);
}

export const data = {
  labels,
  datasets: [
    {
      label: 'Points',
      data: labels.map((element, index) => scoreData[index].score),
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    }
  ],
};


const matches = require('./data/worldcupData.json');

function App() {
  return (
    <div className="container">
      <header className="header">
        <h1>World Cup 2022</h1>
      </header>
      <main>
        <Bar options={options} data={data} />
      </main>
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