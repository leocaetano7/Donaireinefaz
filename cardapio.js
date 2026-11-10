/* ==========================================================================
   CARDÁPIO DA DONA IRENE
   --------------------------------------------------------------------------
   Este é o ÚNICO arquivo que precisa ser editado no dia a dia.

   • Preço: escreva só o número, com PONTO no lugar da vírgula.
       preco: 45        -> R$ 45,00
       preco: 12.5      -> R$ 12,50
       preco: null      -> aparece "Consultar valor"
   • Tirar um produto do ar sem apagar: disponivel: false
   • Foto: coloque o arquivo na pasta img/ e escreva o nome aqui.
   ========================================================================== */

const CONFIG = {
  nomeLoja: "Dona Irene Faz",
  slogan: "Comida de verdade!",
  cidade: "Natal/RN",

  // WhatsApp que recebe os pedidos: 55 + DDD + número, só números.
  // Lido do cartão de visita — CONFIRA antes de publicar.
  whatsapp: "5584996791033",
  telefoneExibicao: "(84) 9 9679-1033",
  instagram: "donairenefaz",

  // Delivery todos os dias no almoço. O cliente escolhe a data na sacola.
  // Depois deste horário, o site já sugere o pedido para o dia seguinte
  // (o cliente pode trocar). Ex.: 11 = 11h da manhã.
  horaLimiteHoje: 11,

  // Taxa de entrega em reais. null = "a combinar" | 0 = "Grátis"
  taxaEntrega: null,
  permiteRetirada: true,
  formasPagamento: ["Pix", "Dinheiro", "Cartão na entrega"],
};

// Tamanhos das quiches — mude aqui e vale para todas.
const TAMANHOS_QUICHE = [
  { nome: "Média", preco: null },
  { nome: "Grande", preco: null },
];

const QUANTIDADES_FESTA = [
  { nome: "50 unidades", preco: null },
  { nome: "Cento (100 un.)", preco: null },
];

const CATEGORIAS = [
  { id: "quiches",  nome: "Quiches & Tortas",       descricao: "Massa amanteigada e recheio cremoso. Saem inteiras, prontas para servir." },
  { id: "marmitas", nome: "Marmitas",               descricao: "Comida de verdade, todo dia no almoço. Pergunte pelas versões congeladas." },
  { id: "saladas",  nome: "Saladas",                descricao: "Folhas fresquinhas, frutas e muita cor." },
  { id: "bolos",    nome: "Bolos",                  descricao: "Do bolo do café da tarde ao bolo de aniversário." },
  { id: "doces",    nome: "Doces & Sobremesas",     descricao: "Para adoçar a semana — ou a festa." },
  { id: "festa",    nome: "Salgadinhos para festa", descricao: "Salgados assados e fritos para aniversários, eventos e coffee break." },
  { id: "pascoa",   nome: "Páscoa",                 descricao: "Ovos de colher recheados. As encomendas abrem perto da Páscoa." },
  // Para esconder uma categoria inteira, acrescente  visivel: false
];

const PRODUTOS = [
  // ---------------- QUICHES & TORTAS ----------------
  { id: "quiche-queijos", categoria: "quiches", nome: "Quiche de Queijos",
    descricao: "Recheio cremoso de queijos, gratinado no forno.",
    foto: "img/quiche-queijos.jpg", variacoes: TAMANHOS_QUICHE },
  { id: "quiche-frango", categoria: "quiches", nome: "Quiche de Frango",
    descricao: "Frango desfiado temperado, pimentão e cheiro-verde.",
    foto: "img/quiche-frango.jpg", variacoes: TAMANHOS_QUICHE },
  { id: "quiche-carne-de-sol", categoria: "quiches", nome: "Quiche de Carne de Sol",
    descricao: "Carne de sol desfiada com rodelas de tomate. Sabor potiguar.",
    foto: "img/quiche-carne-de-sol.jpg", variacoes: TAMANHOS_QUICHE },
  { id: "quiche-tomate-cereja", categoria: "quiches", nome: "Quiche de Tomate Cereja",
    descricao: "Tomatinhos assados sobre recheio cremoso de queijo.",
    foto: "img/quiche-tomate-cereja.jpg", variacoes: TAMANHOS_QUICHE },
  { id: "quiche-cebola-tomate", categoria: "quiches", nome: "Quiche de Cebola e Tomate",
    descricao: "Cebola macia, tomate e queijo num recheio leve.",
    foto: "img/quiche-cebola-tomate.jpg", variacoes: TAMANHOS_QUICHE },
  { id: "empadao", categoria: "quiches", nome: "Empadão",
    descricao: "Massa podre douradinha com recheio cremoso. Vem na forma, é só aquecer.",
    foto: "img/empadao-frango.jpg", preco: null },
  { id: "torta-fria", categoria: "quiches", nome: "Torta Fria",
    descricao: "Camadas de pão com recheio cremoso, batata palha e azeitonas.",
    foto: "img/torta-fria.jpg", preco: null },

  // ---------------- MARMITAS ----------------
  { id: "marmita-frango", categoria: "marmitas", nome: "Frango Assado com Farofa",
    descricao: "Frango assado, arroz, farofa, couve refogada e legumes.",
    foto: "img/marmita-frango-farofa.jpg", preco: null },
  { id: "marmita-carne", categoria: "marmitas", nome: "Carne Guisada",
    descricao: "Carne cozida no tempero da casa, acompanhamentos do dia e salada.",
    foto: "img/marmita-carne.jpg", preco: null },
  { id: "macarrao-coalho", categoria: "marmitas", nome: "Macarrão Cremoso com Queijo Coalho",
    descricao: "Espaguete ao molho branco, carne desfiada e queijo coalho grelhado.",
    foto: "img/macarrao-queijo-coalho.jpg", preco: null },
  { id: "frango-salada", categoria: "marmitas", nome: "Frango + Salada",
    descricao: "Coxa e sobrecoxa assadas com salada colorida. Leve e caprichado.",
    foto: "img/combo-frango-salada.jpg", preco: null },
  { id: "frango-assado", categoria: "marmitas", nome: "Frango Assado (porção)",
    descricao: "Coxa e sobrecoxa douradas, temperadas com ervas.",
    foto: "img/frango-assado.jpg", preco: null },

  // ---------------- SALADAS ----------------
  { id: "salada-manga", categoria: "saladas", nome: "Salada com Manga",
    descricao: "Mix de folhas, manga, tomate-cereja e cebola roxa.",
    foto: "img/salada-manga.jpg", preco: null },
  { id: "salada-colorida", categoria: "saladas", nome: "Salada Colorida",
    descricao: "Alface, tomate, cenoura ralada e tomatinhos coloridos.",
    foto: "img/salada-colorida.jpg", preco: null },
  { id: "salada-tropical", categoria: "saladas", nome: "Salada Tropical",
    descricao: "Folhas, manga, maçã, tomate e cenoura — doce na medida.",
    foto: "img/salada-tropical.jpg", preco: null },

  // ---------------- BOLOS ----------------
  { id: "naked-cake", categoria: "bolos", nome: "Naked Cake de Frutas",
    descricao: "Massa fofinha, recheio cremoso, frutas frescas e calda de chocolate.",
    foto: "img/naked-cake-frutas.jpg", preco: null, selo: "Para festas" },
  { id: "bolo-trufado", categoria: "bolos", nome: "Bolo Trufado com Morangos",
    descricao: "Massa de chocolate, cobertura de brigadeiro e morangos frescos.",
    foto: "img/bolo-trufado-morango.jpg", preco: null },
  { id: "bolo-chocolate-morango", categoria: "bolos", nome: "Bolo de Chocolate com Morangos",
    descricao: "Chocolate do começo ao fim, com raspas e morangos.",
    foto: "img/bolo-chocolate-morango.jpg", preco: null },
  { id: "bolo-amendoas", categoria: "bolos", nome: "Bolo de Chocolate com Amêndoas",
    descricao: "Cobertura cremosa de chocolate, lascas de amêndoa e morangos.",
    foto: "img/bolo-chocolate-amendoas.jpg", preco: null },
  { id: "bolo-chocolatudo", categoria: "bolos", nome: "Bolo Chocolatudo",
    descricao: "Coberto de ganache e pedaços de chocolate. Para quem ama chocolate.",
    foto: "img/bolo-chocolate-cremoso.jpg", preco: null },
  { id: "bolo-limao", categoria: "bolos", nome: "Bolo com Calda de Limão",
    descricao: "Bolo caseiro com cobertura cremosa de limão e raspinhas.",
    foto: "img/bolo-cobertura-limao.jpg", preco: null },
  { id: "bolo-caseiro", categoria: "bolos", nome: "Bolo Caseiro",
    descricao: "Aquele bolo simples do café da tarde. Pergunte os sabores da semana.",
    foto: "img/bolo-caseiro.jpg", preco: null },
  { id: "mini-bolo-chocolate", categoria: "bolos", nome: "Mini Bolo de Chocolate",
    descricao: "Individual, com calda generosa de chocolate.",
    foto: "img/mini-bolo-chocolate.jpg", preco: null },
  { id: "mini-bolo-limao", categoria: "bolos", nome: "Mini Bolo de Limão",
    descricao: "Individual, com cobertura cremosa em flor e raspas de limão.",
    foto: "img/mini-bolo-limao.jpg", preco: null },

  // ---------------- DOCES & SOBREMESAS ----------------
  { id: "brigadeiros", categoria: "doces", nome: "Brigadeiros Gourmet",
    descricao: "Na caixinha individual: confeitado, granulado e lascas de chocolate.",
    foto: "img/brigadeiros-gourmet.jpg", preco: null },
  { id: "caixa-docinhos", categoria: "doces", nome: "Caixa de Docinhos",
    descricao: "Docinhos sortidos para presentear ou servir na festa.",
    foto: "img/caixa-docinhos.jpg", preco: null },
  { id: "torta-holandesa", categoria: "doces", nome: "Torta Holandesa",
    descricao: "Creme gelado, borda de biscoito e cobertura de chocolate com castanha.",
    foto: "img/torta-holandesa.jpg", preco: null },
  { id: "torta-gelada", categoria: "doces", nome: "Torta Gelada de Chocolate",
    descricao: "Creme de chocolate, borda de biscoito champanhe e bombons por cima.",
    foto: "img/torta-gelada-chocolate.jpg", preco: null },
  { id: "brownie", categoria: "doces", nome: "Brownie com Castanha",
    descricao: "Molhadinho por dentro, com castanha de caju por cima.",
    foto: "img/brownie-castanha.jpg", preco: null },
  { id: "pote", categoria: "doces", nome: "Romeu e Julieta no Pote",
    descricao: "Creme de queijo com goiabada cremosa, em pote individual.",
    foto: "img/sobremesa-pote.jpg", preco: null },
  { id: "canjica", categoria: "doces", nome: "Canjica",
    descricao: "Cremosa, com canela por cima. Tradição do São João.",
    foto: "img/canjica.jpg", preco: null, selo: "São João" },

  // ---------------- SALGADINHOS PARA FESTA ----------------
  { id: "salgadinhos", categoria: "festa", nome: "Salgadinhos Sortidos",
    descricao: "Empadinhas, pastéis assados, mini quiches e coxinhas.",
    foto: "img/salgadinhos-sortidos.jpg", variacoes: QUANTIDADES_FESTA },
  { id: "mini-quiches", categoria: "festa", nome: "Mini Quiches e Empadinhas",
    descricao: "Assados e delicados, perfeitos para festa e coffee break.",
    foto: "img/mini-quiches-empadinhas.jpg", variacoes: QUANTIDADES_FESTA },

  // ---------------- PÁSCOA (fora de época: disponivel: false) ----------------
  { id: "ovo-confete", categoria: "pascoa", nome: "Ovo de Colher Confete & Morango",
    descricao: "Casca de chocolate, creme, confetes coloridos e morangos.",
    foto: "img/ovo-confete-morango.jpg", preco: null, disponivel: false, aviso: "Volta na Páscoa" },
  { id: "ovo-morango", categoria: "pascoa", nome: "Ovo de Colher de Morango",
    descricao: "Creme de avelã e morangos frescos por cima.",
    foto: "img/ovo-morango-nutella.jpg", preco: null, disponivel: false, aviso: "Volta na Páscoa" },
  { id: "ovo-brownie", categoria: "pascoa", nome: "Ovo de Colher Brownie",
    descricao: "Pedaços de brownie, bombons e gotas de chocolate.",
    foto: "img/ovo-brownie.jpg", preco: null, disponivel: false, aviso: "Volta na Páscoa" },
  { id: "super-ovo", categoria: "pascoa", nome: "Super Ovo Recheado",
    descricao: "Recheio cremoso, barrinhas de chocolate e morangos.",
    foto: "img/ovo-recheado.jpg", preco: null, disponivel: false, aviso: "Volta na Páscoa" },
];
