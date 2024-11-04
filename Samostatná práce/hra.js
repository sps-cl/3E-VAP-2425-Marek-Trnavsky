const boardSize = 8;const gameBoard = document.getElementById('gameBoard');let selectedPiece = null;let turn = 'red'; // Červený hráč začíná
let timeElapsed = 0; // Čas v sekundách
let timerInterval = null; // Interval pro časomíru
// Spuštění časomíry
function startTimer() {  
    if (!timerInterval) {    
        timerInterval = setInterval(() => {      timeElapsed++;      
    document.getElementById('timer').textContent = `Čas: ${timeElapsed} sekund`;    
}, 1000);  }
}const images = ['obrazek1.png', 'obrazek2.png','obrazek3.png', 'obrazek4.png','obrazek5.png', 'obrazek6.png','obrazek7.png', 'obrazek8.png','obrazek9.png', 'obrazek10.png','obrazek11.png'];
    let currentIndex = 0;
function changeImage() {  const imgElement = document.getElementById('changingImage');  
currentIndex = (currentIndex + 1) % images.length; // Přepínání mezi obrázky  
imgElement.src = images[currentIndex];}
setInterval(changeImage, 5000); // Změna obrázku každých 5 vteřin
// Vytvoření hrací desky
for (let row = 0; row < boardSize; row++) {  for (let col = 0; col < boardSize; col++) {    const square = document.createElement('div');    square.classList.add('square');    square.dataset.row = row;    square.dataset.col = col;
    // Střídání černé a bílé barvy    
if ((row + col) % 2 === 0) {      square.classList.add('white');    } else {      square.classList.add('black');
      // Umístění hracích kamenů      
if (row < 3) {        createPiece(square, 'blue'); // Hráč 2      
} else if (row > 4) {        createPiece(square, 'red'); // Hráč 1      
}    }
    gameBoard.appendChild(square);  }}
// Vytvoření hracího kamene
function createPiece(square, color, isKing = false) {  const piece = document.createElement('div');  piece.classList.add('piece', color);  if (isKing) {    piece.textContent = 'K'; // Označení "dámy" pomocí písmena "K"    
piece.style.fontSize = '24px';    piece.style.color = 'white';    piece.style.fontWeight = 'bold';    piece.style.textAlign = 'center';    piece.style.lineHeight = '50px'; // Zajistí, aby byl text uprostřed  
}  square.appendChild(piece);
  // Přidání možnosti výběru kamene  
piece.addEventListener('click', (e) => {    selectPiece(e.target);  });}// Výběr hracího kamene
function selectPiece(piece) {  if (piece.classList.contains(turn)) {    clearHighlights();    selectedPiece = piece;    piece.parentElement.classList.add('highlight');  }}
// Pohyb hracího kamene
gameBoard.addEventListener('click', function (e) {  const targetSquare = e.target.closest('.square');
  // Spuštění časomíry při prvním tahu  
if (!timerInterval) {    startTimer();  }
  if (selectedPiece && targetSquare && targetSquare.classList.contains('black') && !targetSquare.querySelector('.piece')) {    const oldSquare = selectedPiece.parentElement;    const oldRow = parseInt(oldSquare.dataset.row);    const oldCol = parseInt(oldSquare.dataset.col);    const newRow = parseInt(targetSquare.dataset.row);    const newCol = parseInt(targetSquare.dataset.col);
    const rowDiff = Math.abs(newRow - oldRow);    const colDiff = Math.abs(newCol - oldCol);    const isKing = selectedPiece.textContent === 'K';
    // Rozlišení pohybu pro dámy a běžné kameny    
if (isKing) {      if (isValidKingMove(oldRow, oldCol, newRow, newCol)) {        moveKingPiece(targetSquare, oldRow, oldCol, newRow, newCol);      }    } else {      // Kontrola, jestli je tah vpřed (pro běžné kameny)      
if (!isValidForwardMove(oldRow, newRow)) {        return; // Pokud běžný kámen se pohybuje dozadu, neumožnit tah      
}
      if (rowDiff === 1 && colDiff === 1) {        // Normální tah o jedno pole        
movePiece(targetSquare);      } else if (rowDiff === 2 && colDiff === 2) {        // Skok přes soupeřův kámen        
const middleRow = (oldRow + newRow) / 2;        const middleCol = (oldCol + newCol) / 2;        const middleSquare = document.querySelector(`.square[data-row="${middleRow}"][data-col="${middleCol}"]`);        const middlePiece = middleSquare.querySelector('.piece');
        if (middlePiece && !middlePiece.classList.contains(turn)) {          // Odstranění soupeřova kamene         
middleSquare.removeChild(middlePiece);          movePiece(targetSquare);        }      }    }  }});
// Funkce pro kontrolu pohybu vpřed pro běžné kameny
function isValidForwardMove(oldRow, newRow) {  if (turn === 'red') {    return newRow < oldRow; // Červené kameny se pohybují směrem nahoru (řádky se snižují)  
} else {    return newRow > oldRow; // Modré kameny se pohybují směrem dolů (řádky se zvyšují)  
}}
// Funkce pro kontrolu správného pohybu dámy
function isValidKingMove(oldRow, oldCol, newRow, newCol) {  if (Math.abs(newRow - oldRow) === Math.abs(newCol - oldCol)) {    const stepRow = (newRow - oldRow) / Math.abs(newRow - oldRow); // +1 nebo -1    
const stepCol = (newCol - oldCol) / Math.abs(newCol - oldCol); // +1 nebo -1    
let row = oldRow + stepRow;    
let col = oldCol + stepCol;
    let jumped = false; // Pomocná proměnná pro sledování, jestli byla provedena skok
    // Procházení diagonální cesty, kontrola volných polí a skoků přes soupeře    
while (row !== newRow && col !== newCol) {      const square = document.querySelector(`.square[data-row="${row}"][data-col="${col}"]`);      const piece = square.querySelector('.piece');
      if (piece) {        // Pokud je to soupeřův kámen, musí být přeskočen        
if (piece.classList.contains(turn)) {          return false; // Nemůže přeskočit vlastní kámen        
}        jumped = true; // Bylo provedeno skok      
}
      row += stepRow;      col += stepCol;    }
    return jumped; // Vrací true, pokud byl proveden skok  
}
  return false;}
// Přesunutí hracího kamene
function movePiece(targetSquare) 
{  const oldSquare = selectedPiece.parentElement;  const newRow = parseInt(targetSquare.dataset.row);
  targetSquare.appendChild(selectedPiece);  oldSquare.classList.remove('highlight');  selectedPiece = null;
  // Zkontroluj, zda se kámen dostal na poslední řadu pro povýšení na dámu  
if ((turn === 'red' && newRow === 0) || (turn === 'blue' && newRow === boardSize - 1)) {    promoteToKing(targetSquare);  }
  switchTurn();}
// Přesunutí dámy (královny)
function moveKingPiece(targetSquare, oldRow, oldCol, newRow, newCol) {  const oldSquare = selectedPiece.parentElement;
  // Procházení mezi starou a novou pozicí a odstranění soupeřových kamenů  
const stepRow = (newRow - oldRow) > 0 ? 1 : -1;  const stepCol = (newCol - oldCol) > 0 ? 1 : -1;
  let row = oldRow + stepRow;  let col = oldCol + stepCol;
  // Odstranění soupeřových kamenů  
while (row !== newRow && col !== newCol) {    const square = document.querySelector(`.square[data-row="${row}"][data-col="${col}"]`);    const piece = square.querySelector('.piece');
    if (piece && !piece.classList.contains(turn)) {      square.removeChild(piece); // Odstranění soupeřova kamene    
}
    row += stepRow;    col += stepCol;  }
  targetSquare.appendChild(selectedPiece);  oldSquare.classList.remove('highlight');  selectedPiece = null;
  switchTurn();}
// Funkce pro povýšení na dámu
function promoteToKing(square) {  const piece = square.querySelector('.piece');  if (piece) {    const color = piece.classList.contains('red') ? 'red' : 'blue';    square.removeChild(piece); // Odstraní starý kámen    
createPiece(square, color, true); // Vytvoří novou dámu (královnu)  
}}
// Přepnutí tahu
function switchTurn() {  turn = turn === 'red' ? 'blue' : 'red';  document.getElementById('currentTurn').textContent = `Na tahu je: ${turn === 'red' ? 'Červený hráč' : 'Modrý hráč'}`;}
// Zrušení zvýraznění
function clearHighlights() {  const highlightedSquares = document.querySelectorAll('.highlight');  highlightedSquares.forEach(square => square.classList.remove('highlight'));}