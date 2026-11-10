# Site-cardápio da Dona Irene Faz

Site simples, sem servidor: o cliente monta o pedido e ele chega pronto no WhatsApp.

## Ver no computador
Dê dois cliques em `index.html`.

## Mudar preços, produtos e fotos
Edite **só o arquivo `cardapio.js`** (pode ser no Bloco de Notas). As instruções estão no topo dele.

- `preco: 45` → R$ 45,00 · `preco: 12.5` → R$ 12,50 · `preco: null` → "Consultar valor"
- Os preços das quiches ficam em `TAMANHOS_QUICHE` e os do cento de salgados em `QUANTIDADES_FESTA`.
- Tirar um produto do ar: `disponivel: false`
- Esconder uma categoria inteira (ex.: Páscoa): acrescente `visivel: false` nela.
- Foto nova: coloque o arquivo `.jpg` na pasta `img/` e escreva `foto: "img/nome-do-arquivo.jpg"`.

## Antes de publicar, confira em `cardapio.js`
1. `whatsapp`: o número que recebe os pedidos (lido do cartão de visita).
2. Os preços.
3. Os nomes e descrições dos pratos (foram escritos a partir das fotos).
4. `taxaEntrega`, `horaLimiteHoje` (até que horas dá para pedir o almoço do dia) e `formasPagamento`.

## Publicar de graça
**GitHub Pages (este repositório):** em *Settings → Pages*, escolha *Deploy from a branch*, branch `main`, pasta `/ (root)` e salve. Em alguns minutos o site fica em `https://leocaetano7.github.io/Donaireinefaz/`. Cada novo `git push` atualiza o site sozinho.

**Netlify Drop (sem git):** entre em https://app.netlify.com/drop, crie uma conta e arraste esta pasta inteira. Para atualizar, arraste a pasta de novo.

Depois coloque o link na bio do Instagram, no lugar do link de pedidos.

Com o endereço definitivo em mãos, troque em `index.html` a linha `og:image` pelo endereço completo da foto (ex.: `https://leocaetano7.github.io/Donaireinefaz/img/mesa-quiches.jpg`). Assim aparece a foto quando alguém compartilha o link no WhatsApp.
