var readlineSync = require('./readLine/node_modules/readline-sync');

//define o array que servirá para formar o tabuleiro
const emptyString = '  ';
let boardData = Array(9).fill(emptyString);

//contadores
let moviments = 0;
let winsO = 0;
let winsX = 0;

//verifica status do game
let winner = false;
let exit = false

//jogadores e condições de vitória
let currentPlayer;
const players = {
  1: 'x',
  2: 'o',
};

const conditions = {
  1: [0,1,2],
  2: [3,4,5],
  3:[6,7,8],
  4:[0,3,6],
  5:[1,4,7],
  6:[2,5,8],
  7:[0,4,8],
  8:[2,4,6]
};

//armazena as posições preenchidas 
let positionsPlayerX  = [];
let positionsPlayerO  = [];


function drawBoard(positions) {
  console.log(`
    ${positions[0]} | ${positions[1]} | ${positions[2]}
    -----------
    ${positions[3]} | ${positions[4]} | ${positions[5]}
    -----------
    ${positions[6]} | ${positions[7]} | ${positions[8]}
  `);
}

function showTutorial() {
  console.log(`
  ### Escolha a posiçao que deseja jogar baseado no tabuleiro abaixo ###
     0 | 1 | 2
    -----------
     3 | 4 | 5
    -----------
     6 | 7 | 8
  ## Digite:

  vitórias ---->  X: ${winsX}   O: ${winsO}
    
  1 - para começar uma partida;
  2 - sair
  `);
}

function isEmpty(position) {
  return boardData[position] === emptyString;
}

function changePlayer() {
  if (currentPlayer === players[1]) {
    currentPlayer = players[2];
  } else {
    currentPlayer = players[1];
  }
}

function addMoves(player,position){
  player === 'x'?
  positionsPlayerX.push(position):
  positionsPlayerO.push(position);
}

function setPlayerMovement(position) {
  if (isEmpty(position)) {
    boardData[position] = currentPlayer;
    addMoves(currentPlayer, position);
    checkWinner(currentPlayer);
    checkVelha();
    changePlayer();
  } else {
    console.log(`A posição ${position} já foi usada`);
  }
}

//função analisa se alguma condição de vitória aconteceu
function isFill(player){
  let checker = false;
  for(let condition in conditions){
    if(player === 'x'){
      checker = conditions[condition].every(v => positionsPlayerX.includes(v));
      if(checker) break;
    } else {
      checker = conditions[condition].every(v => positionsPlayerO.includes(v));
      if(checker) break;
    }
  }
  return checker;
}

function updateWins(player){
  player == 'x'? winsX++ : winsO++
}

function checkWinner(player){
  if(isFill(player)){
    console.log(`\nO vencedor é o jogador ${currentPlayer}`);
    updateWins(player);
    winner = true;
  }
}

function checkVelha(){
  moviments++;
  if(moviments === 9){
    console.log("\nDEU VELHA!!!");
    winner = true;
  }
}

function cleanMoves(){
  moviments = 0;
  winner = false;
  for(let i=0;i<boardData.length;i++){
    boardData[i] = emptyString;
  }
  positionsPlayerO = [];
  positionsPlayerX = [];
}

function selectPlayer(){
 let selectPlayer = readlineSync.question(`
  Escolha o player:
  1 - x
  2 - o
  `);
  selectPlayer = parseInt(selectPlayer);
  currentPlayer = players[selectPlayer];
}

while(!exit){
  cleanMoves();
  showTutorial();
  let action = readlineSync.question(`Digite a acao a ser tomada: `);
  action = parseInt(action);
  switch(action){
    case 1:
      selectPlayer();
      while(!winner){
        let option = readlineSync.question(`Jogador ${currentPlayer}, Escolha uma posicao: `);
        option = parseInt(option);
        setPlayerMovement(option);
        drawBoard(boardData);
      };
      break;
    case 2:
      exit = true;
      console.log("Até Mais!!!!!!!!!")
      break;
    default:
      console.log('\n\nValor inválido!!');
      break;
  }

}
