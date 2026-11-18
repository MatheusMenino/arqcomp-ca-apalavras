/* =========================================================
   Caça-Palavras · Arquitetura de Computadores
   ========================================================= */

const SIZE = 16;

// "answer" = como a palavra aparece no tabuleiro (maiúsculas, sem acento e sem espaço)
// "term"   = como ela é mostrada ao jogador quando é encontrada
const WORDS = [
  { id: 1,  term: "CPU",
    answer: "CPU",
    clue: "Qual componente é chamado de “cérebro” do computador, por buscar e executar as instruções dos programas?" },
  { id: 2,  term: "ULA",
    answer: "ULA",
    clue: "Que parte da CPU faz as contas e as comparações lógicas?" },
  { id: 3,  term: "UC (Unidade de Controle)",
    answer: "UC",
    clue: "Qual parte da CPU interpreta cada instrução e comanda os outros componentes sobre o que fazer e quando?" },
  { id: 4,  term: "registradores",
    answer: "REGISTRADORES",
    clue: "Como se chamam as pequenas memórias dentro da CPU, as mais rápidas de todas, que guardam dados temporários durante a execução?" },
  { id: 5,  term: "RAM",
    answer: "RAM",
    clue: "Qual memória guarda os programas e dados em uso e perde tudo quando o computador é desligado?" },
  { id: 6,  term: "ROM",
    answer: "ROM",
    clue: "Qual memória mantém o conteúdo gravado de fábrica, mesmo sem energia, e normalmente não é alterada pelo usuário?" },
  { id: 7,  term: "EEPROM",
    answer: "EEPROM",
    clue: "Qual memória não volátil permite apagar e regravar dados por sinais elétricos, sem tirar o chip da placa, e é comum para guardar configurações em microcontroladores?" },
  { id: 8,  term: "Flash",
    answer: "FLASH",
    clue: "Qual memória não volátil, apagada em blocos, está presente em pen drives, cartões de memória e SSDs?" },
  { id: 9,  term: "cache",
    answer: "CACHE",
    clue: "Qual memória pequena e muito rápida, entre a CPU e a RAM, guarda cópias dos dados mais usados para acelerar o acesso?" },
  { id: 10, term: "memória de massa (armazenamento)",
    answer: "MEMORIADEMASSA",
    clue: "Como se chama a categoria de dispositivos de grande capacidade, como HDs e SSDs, que guardam arquivos e programas de forma permanente, com custo baixo por byte?" },
  { id: 11, term: "DMA",
    answer: "DMA",
    clue: "Qual técnica permite que um periférico transfira dados direto para a memória sem a CPU precisar cuidar de cada byte?" },
  { id: 12, term: "address bus (barramento de endereço)",
    answer: "ADDRESSBUS",
    clue: "Em inglês: por qual barramento, de mão única, a CPU informa qual posição de memória ou dispositivo quer acessar? A largura dele limita a quantidade máxima de memória." },
  { id: 13, term: "data bus (barramento de dados)",
    answer: "DATABUS",
    clue: "Em inglês: qual barramento, de mão dupla, transporta os valores lidos ou escritos entre a CPU, a memória e os periféricos?" },
  { id: 14, term: "microcontrolador",
    answer: "MICROCONTROLADOR",
    clue: "Qual chip reúne processador, memória e portas de entrada e saída em um único circuito e é usado em sistemas embarcados, como no Arduino?" },
  { id: 15, term: "dual core",
    answer: "DUALCORE",
    clue: "Em inglês: como se chama o processador que consegue executar duas tarefas de verdade em paralelo, graças a dois núcleos no mesmo chip?" },
  { id: 16, term: "quad core",
    answer: "QUADCORE",
    clue: "Em inglês: como se chama o processador com o dobro de núcleos de um dual core, capaz de executar quatro tarefas ao mesmo tempo?" },
];

// Cores das palavras encontradas: [fundo, cor da letra]
const FOUND_COLORS = [
  ["#e62429", "#ffffff"],  // vermelho
  ["#2f7bff", "#ffffff"],  // azul
  ["#f4f6ff", "#a3151a"],  // branco
  ["#ff6a6e", "#2a0507"],  // vermelho claro
  ["#8ec1ff", "#06214d"],  // azul claro
  ["#ffd23f", "#3a2a00"],  // dourado
];

const ALL_DIRS  = [[0,1],[1,0],[1,1],[-1,1],[0,-1],[-1,0],[-1,-1],[1,-1]]; // [linha, coluna]
const EASY_DIRS = [[0,1],[1,0],[1,1]];

/* ---------- Elementos ---------- */
const $grid   = document.getElementById("grid");
const $clues  = document.getElementById("clues");
const $found  = document.getElementById("stat-found");
const $time   = document.getElementById("stat-time");
const $hints  = document.getElementById("stat-hints");
const $modal  = document.getElementById("modal");
const $mText  = document.getElementById("modal-text");
const $easy   = document.getElementById("chk-easy");

/* ---------- Estado ---------- */
let state;

/* ---------- Utilidades ---------- */
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function fmtTime(s) {
  const m = String(Math.floor(s / 60)).padStart(2, "0");
  const r = String(s % 60).padStart(2, "0");
  return `${m}:${r}`;
}

/* ---------- Geração do tabuleiro ---------- */
function tryPlace(letters, word, dirs) {
  const options = [];
  for (const [dr, dc] of dirs) {
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        const er = r + dr * (word.length - 1);
        const ec = c + dc * (word.length - 1);
        if (er < 0 || er >= SIZE || ec < 0 || ec >= SIZE) continue;

        let ok = true;
        for (let i = 0; i < word.length; i++) {
          const cur = letters[r + dr * i][c + dc * i];
          if (cur !== "" && cur !== word[i]) { ok = false; break; }
        }
        if (ok) options.push([r, c, dr, dc]);
      }
    }
  }
  if (!options.length) return null;

  const [r, c, dr, dc] = options[Math.floor(Math.random() * options.length)];
  const cells = [];
  for (let i = 0; i < word.length; i++) {
    letters[r + dr * i][c + dc * i] = word[i];
    cells.push([r + dr * i, c + dc * i]);
  }
  return cells;
}

function buildBoard(dirs) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const sorted = [...WORDS].sort((a, b) => b.answer.length - a.answer.length);

  for (let attempt = 0; attempt < 300; attempt++) {
    const letters = Array.from({ length: SIZE }, () => Array(SIZE).fill(""));
    const placements = {};
    let ok = true;

    for (const w of sorted) {
      const cells = tryPlace(letters, w.answer, dirs);
      if (!cells) { ok = false; break; }
      placements[w.id] = cells;
    }

    if (ok) {
      for (let r = 0; r < SIZE; r++)
        for (let c = 0; c < SIZE; c++)
          if (letters[r][c] === "")
            letters[r][c] = alphabet[Math.floor(Math.random() * alphabet.length)];
      return { letters, placements };
    }
  }
  throw new Error("Não foi possível montar o tabuleiro.");
}

/* ---------- Renderização ---------- */
function renderGrid() {
  $grid.innerHTML = "";
  state.cellEls = [];
  for (let r = 0; r < SIZE; r++) {
    const row = [];
    for (let c = 0; c < SIZE; c++) {
      const el = document.createElement("div");
      el.className = "cell";
      el.dataset.r = r;
      el.dataset.c = c;
      el.textContent = state.letters[r][c];
      $grid.appendChild(el);
      row.push(el);
    }
    state.cellEls.push(row);
  }
}

function renderClues() {
  $clues.innerHTML = "";
  for (const w of WORDS) {
    const li = document.createElement("li");
    li.id = `clue-${w.id}`;
    li.innerHTML = `
      <span class="num">${w.id}</span>
      <div>
        ${w.clue}
        <span class="meta">(${w.answer.length} letras)</span>
        <span class="answer">✔ ${w.term}</span>
      </div>`;
    $clues.appendChild(li);
  }
}

function updateStats() {
  $found.textContent = `${state.found.size}/${WORDS.length}`;
  $hints.textContent = state.hints;
  $time.textContent = fmtTime(state.seconds);
}

/* ---------- Seleção por arraste ---------- */
function lineCells(start, end) {
  const dr = end.r - start.r;
  const dc = end.c - start.c;
  if (!(dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc))) return null;

  const n = Math.max(Math.abs(dr), Math.abs(dc));
  const sr = Math.sign(dr);
  const sc = Math.sign(dc);
  const cells = [];
  for (let i = 0; i <= n; i++) cells.push([start.r + sr * i, start.c + sc * i]);
  return cells;
}

function clearSel() {
  document.querySelectorAll(".cell.sel").forEach(el => el.classList.remove("sel"));
}

function cellFromPoint(x, y) {
  const el = document.elementFromPoint(x, y);
  const cell = el && el.closest && el.closest(".cell");
  return cell ? { r: +cell.dataset.r, c: +cell.dataset.c } : null;
}

let dragging = false;
let dragStart = null;
let dragCells = [];

$grid.addEventListener("pointerdown", (e) => {
  if (state.ended) return;
  const p = cellFromPoint(e.clientX, e.clientY);
  if (!p) return;
  e.preventDefault();
  dragging = true;
  dragStart = p;
  dragCells = [[p.r, p.c]];
  clearSel();
  state.cellEls[p.r][p.c].classList.add("sel");
});

window.addEventListener("pointermove", (e) => {
  if (!dragging) return;
  const p = cellFromPoint(e.clientX, e.clientY);
  if (!p) return;
  const cells = lineCells(dragStart, p);
  if (!cells) return;
  dragCells = cells;
  clearSel();
  cells.forEach(([r, c]) => state.cellEls[r][c].classList.add("sel"));
});

window.addEventListener("pointerup", () => {
  if (!dragging) return;
  dragging = false;
  checkSelection(dragCells);
  clearSel();
});

/* ---------- Verificação ---------- */
function checkSelection(cells) {
  if (cells.length < 2) return;

  const str = cells.map(([r, c]) => state.letters[r][c]).join("");
  const rev = [...str].reverse().join("");

  const hit = WORDS.find(w =>
    !state.found.has(w.id) && (w.answer === str || w.answer === rev)
  );
  if (!hit) return;

  markFound(hit, cells);
}

function markFound(word, cells, revealed = false) {
  state.found.add(word.id);

  if (revealed) {
    cells.forEach(([r, c]) => state.cellEls[r][c].classList.add("revealed"));
  } else {
    const [color, textColor] = FOUND_COLORS[word.id % FOUND_COLORS.length];
    cells.forEach(([r, c]) => {
      const el = state.cellEls[r][c];
      el.classList.remove("revealed");
      el.classList.add("found");
      el.style.setProperty("--c", color);
      el.style.setProperty("--t", textColor);
    });
  }

  const li = document.getElementById(`clue-${word.id}`);
  li.classList.add(revealed ? "revealed" : "done");
  li.querySelector(".answer").textContent = (revealed ? "→ " : "✔ ") + word.term;

  updateStats();
  if (!revealed && state.found.size === WORDS.length) win();
}

function win() {
  state.ended = true;
  clearInterval(state.timer);
  $mText.textContent =
    `Você encontrou as ${WORDS.length} palavras em ${fmtTime(state.seconds)}` +
    (state.hints ? `, usando ${state.hints} dica(s) de letra.` : ", sem usar nenhuma dica!");
  $modal.classList.remove("hidden");
}

/* ---------- Botões ---------- */
document.getElementById("btn-hint").addEventListener("click", () => {
  if (state.ended) return;
  const pending = WORDS.filter(w => !state.found.has(w.id));
  if (!pending.length) return;
  const w = pending[Math.floor(Math.random() * pending.length)];
  const [r, c] = state.placements[w.id][0];
  const el = state.cellEls[r][c];
  state.hints++;
  updateStats();
  el.classList.remove("hint");
  void el.offsetWidth; // reinicia a animação
  el.classList.add("hint");
  setTimeout(() => el.classList.remove("hint"), 2200);
});

document.getElementById("btn-reveal").addEventListener("click", () => {
  if (state.ended) return;
  if (!confirm("Mostrar todas as respostas? O jogo será encerrado.")) return;
  state.ended = true;
  clearInterval(state.timer);
  WORDS.filter(w => !state.found.has(w.id))
       .forEach(w => markFound(w, state.placements[w.id], true));
});

document.getElementById("btn-new").addEventListener("click", newGame);
document.getElementById("btn-again").addEventListener("click", newGame);
$easy.addEventListener("change", newGame);

/* ---------- Início ---------- */
function newGame() {
  if (state && state.timer) clearInterval(state.timer);
  $modal.classList.add("hidden");

  const dirs = $easy.checked ? EASY_DIRS : ALL_DIRS;
  const { letters, placements } = buildBoard(dirs);

  state = {
    letters, placements,
    found: new Set(),
    hints: 0,
    seconds: 0,
    ended: false,
    cellEls: [],
    timer: null,
  };

  renderGrid();
  renderClues();
  updateStats();

  state.timer = setInterval(() => {
    state.seconds++;
    $time.textContent = fmtTime(state.seconds);
  }, 1000);
}

newGame();
