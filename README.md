🕸️ Caça-Palavras · Arquitetura de Computadores

Jogo de caça-palavras feito com HTML, CSS e JavaScript puro (sem bibliotecas e sem instalação), criado como atividade da disciplina de Arquitetura Computacional do curso de Análise e Desenvolvimento de Sistemas (SPTECH).

🎮 Jogue online: https://matheusmenino.github.io/arqcomp-ca-apalavras/

📖 O que é

Um caça-palavras de 16×16 em que, em vez de receber a lista de palavras, o jogador recebe 16 pistas em forma de pergunta. Para cada pista, é preciso descobrir qual termo de arquitetura de computadores ela descreve e depois encontrá-lo no tabuleiro.

As pistas descrevem a função de cada componente, sem entregar a resposta. Por exemplo, para a ULA a pista é "Que parte da CPU faz as contas e as comparações lógicas?", e não a sigla por extenso.

🎯 Para que serve

É uma ferramenta de estudo e revisão. Para vencer, o jogador precisa lembrar o que cada componente faz, e não apenas decorar siglas. Os termos cobrem:

Tema	Termos
Processador	CPU, ULA, UC, registradores, dual core, quad core, microcontrolador
Memórias	RAM, ROM, EEPROM, Flash, cache, memória de massa
Comunicação	DMA, address bus, data bus
🕹️ Como jogar
Leia as pistas no painel ao lado do tabuleiro.
Descubra o termo que a pista descreve. Cada pista informa quantas letras a palavra tem no tabuleiro.
Clique e arraste (ou deslize o dedo no celular) do início ao fim da palavra no tabuleiro.
Se estiver certo, a palavra fica colorida e a pista fica verde, mostrando o nome completo do termo.
Encontre as 16 palavras para vencer.

Regras do tabuleiro

As palavras estão escritas em maiúsculas, sem acento e sem espaço (por exemplo, memória de massa aparece como MEMORIADEMASSA).
Elas podem estar na horizontal, na vertical ou na diagonal, e também de trás para frente.
Ative o Modo fácil para deixar só as direções → ↓ ↘.

Botões

💡 Dica de letra: pisca a primeira letra de uma palavra ainda não encontrada (conta no placar de dicas).
Mostrar respostas: revela todas as palavras restantes e encerra o jogo.
Novo jogo: gera um tabuleiro diferente.
✨ Funcionalidades
Tabuleiro gerado aleatoriamente a cada partida
Seleção por arraste com mouse ou toque
Cronômetro, contador de palavras encontradas e contador de dicas
Layout responsivo (computador e celular)
Tema visual em vermelho e azul
🚀 Como rodar no seu computador

Não precisa de servidor nem de instalação:

Baixe ou clone este repositório:
bash
git clone https://github.com/SEU-USUARIO/NOME-DO-REPOSITORIO.git
Abra o arquivo index.html no navegador (clique duas vezes nele).
🗂️ Estrutura do projeto
├── index.html   # estrutura da página
├── style.css    # visual e responsividade
├── script.js    # lógica do jogo (palavras, pistas, geração do tabuleiro)
└── README.md
🛠️ Personalização
Trocar palavras ou pistas: edite a lista WORDS no início do script.js. Cada item tem term (como aparece depois de achado), answer (como fica no tabuleiro, em maiúsculas, sem acento e sem espaço) e clue (a pista).
Se aumentar as palavras ou o tamanho delas, ajuste também a constante SIZE (hoje é 16, a palavra mais longa tem 16 letras).
Trocar as cores: altere as variáveis no topo do style.css (--red, --blue, --panel, entre outras) e a lista FOUND_COLORS no script.js.
🧰 Tecnologias
HTML5
CSS3 (Grid, Flexbox e variáveis CSS)
JavaScript (ES6+)
👤 Autor

Desenvolvido por SEU NOME · Análise e Desenvolvimento de Sistemas · São Paulo Tech School (SPTECH)
