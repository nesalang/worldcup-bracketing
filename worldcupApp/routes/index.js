const path = require('path');
const express = require('express');
const { match } = require('assert');
const fs = require('fs')
var app = express.Router();

app.use(express.static(path.resolve(__dirname, '../client/build')));
app.get('*', (req, res) => {
  console.log("hello world!");
  updateData();
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

module.exports = app;

function updateData() {
  let pickData = require('../client/src/data/picks.json');
  let matchData = require('../client/src/data/worldcupData.json');

  let matchHelper = new MatchHelper(matchData);
  let playerPicks = buildPlayerPicks(pickData);
  addPlayerPicksToMatches(matchHelper, playerPicks);

  let scoreBoard = new ScoreBoard();
  updateGameScore(matchHelper, playerPicks, scoreBoard);
  matchHelper.writeToFile();
}

function addPlayerPicksToMatches(matchHelper, playerPicks)
{
  for (let i = 0; i < playerPicks.length; i++) {
    let playerPick = playerPicks[i]
    for (let matchId = 1; matchId < 16; matchId++) {
      let match = matchHelper.findMatchById(matchId);
      match.addPick(playerPick.findPick(matchId));
    }
  }
}

function updateGameScore(matchHelper, playerPick, scoreBoard)
{
  for (let i = 0; i < playerPicks.length; i++) {
    let playerPick = playerPicks[i]
    for (let matchId = 1; matchId < 16; matchId++) {
      let match = matchHelper.findMatchById(matchId);
      scoreBoard.updateScore(match, playerPick.findPick(matchId));
    }
  }
}

function buildPlayerPicks(pickData)
{
  playerPicks = [] 

  for (let i = 0; i < pickData.length; i++) {
    playerPicks.push(new PickCollection(pickData[i]));
  }

  return playerPicks;
}

class Player 
{
  constructor(name, score = 0)
  {
    this.name = name
    this.score = score 
  }

  addScore(score)
  {
    this.score += score;
  }

}

class ScoreBoard
{
  constructor()
  {
    this.players = {};
  }

  updateScore(match, pick)
  {
    if (match.winner !== undefined && match.winner === pick.winner) {
      if (!(pick.username in this.players))
      {
        this.players[pick.username] = new Player(pick.username);
      }
      this.players[pick.username].addScore(match.point);
    }
  }
}

class PickCollection
{
  constructor(userPick)
  {
    this.picks = {};
    this.name = userPick.name;
    let picks = userPick.picks;

    for (let i = 0; i < picks.length; i++)
    {
      this.addPick(new PlayerPick(i, picks[i], this.name));
    }
  }

  addPick(playerPick) {
    this.picks[playerPick.matchId] = playerPick;
  } 

  findPick(matchId) {
    return this.picks[matchId-1];
  }
}

class PlayerPick
{
  constructor(matchId, winner, username)
  {
    this.username = username;
    this.matchId = matchId;
    this.winner = winner;
  }
}

class Match
{
  constructor(match)
  {
    this.round = match.round
    if (match.score[0] != match.score[1]) { 
      let winner0 = match.players[0].name.split(':')[0];
      let winner1 = match.players[1].name.split(':')[0];
      this.winner = match.score[0] > match.score[1] ? winner0 : winner1;
    }
    switch(this.round) {
      case 1:
        this.point = 1;
        break;
      case 2:
        this.point = 2;
        break;
      case 3:
        this.point = 4;
        break;
      case 4:
        this.point = 8;
        break;
    }

    let playerA = match.players[0].name; 
    let playerB = match.players[1].name;
    this.players = {};
    this.players[playerA] = []
    this.players[playerB] = []
    this.backup = match;
 }

  addPick(pick)
  {
    let pickedTeam = pick.winner;
    let playerName = pick.username;
    if (pickedTeam in this.players) {
      this.players[pickedTeam].push(playerName)
    }
  }
}

class MatchHelper
{
  constructor(matches)
  {
    this.matches = []
    for (let i = 0; i < matches.length; i++) {
      this.matches.push(new Match(matches[i]))
    }
  }

  findMatchById(matchId)
  {
    return this.matches[matchId-1];
  }

  findMatchesByRound(round)
  {
    let matches = []
    for (let i = 0; i < matches.length; i++) {
      if (this.matches[i].round === round)
      {
        matches.push(this.matches[i]);
      }
    }
    return matches;
  }

  writeToFile()
  {
    let matches = []
    for (let i = 0; i < this.matches.length; i++) {
      let match = this.matches[i];
      let matchStored = this.matches[i].backup;

      let team1 = matchStored.players[0].name;
      if (match.players[team1].length > 0) {
        team1 += ': ' + match.players[team1].join(', ');
      }
      matchStored.players[0].name = team1;

      let team2 = matchStored.players[1].name;
      if (match.players[team2].length > 0) {
        team2 += ': ' + match.players[team2].join(', ');
      }
      matchStored.players[1].name = team2;

      matches.push(matchStored);
    }
    const data = JSON.stringify(matches);
    fs.writeFile('./client/src/data/worldcupData.json', data, err => {
      if (err) {
        throw err;
      }
      console.log('file saved');
    })
  }
}