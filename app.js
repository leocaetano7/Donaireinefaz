/* Dona Irene Faz — lógica do cardápio e da sacola.
   Os produtos e preços ficam em cardapio.js. */
(() => {
  "use strict";

  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];
  const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
  const fmt = (v) => brl.format(v);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const ehNumero = (x) => typeof x === "number" && isFinite(x);

  const porId = new Map(PRODUTOS.map((p) => [p.id, p]));

  const armazenamento = {
    ler(chave, padrao) {
      try { const v = localStorage.getItem(chave); return v ? JSON.parse(v) : padrao; }
      catch { return padrao; }
    },
    gravar(chave, valor) {
      try { localStorage.setItem(chave, JSON.stringify(valor)); } catch { /* modo privado */ }
    },
  };
  const CHAVE_SACOLA = "donairene:sacola:v1";
  const CHAVE_CLIENTE = "donairene:cliente:v1";

  /* ---------- Data do pedido ---------- */
  const isoLocal = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const hojeIso = () => isoLocal(new Date());
  function dataSugerida() {
    const d = new Date();
    if (d.getHours() >= (CONFIG.horaLimiteHoje ?? 24)) d.setDate(d.getDate() + 1);
    return isoLocal(d);
  }
  function descreverData(iso) {
    const [a, m, d] = iso.split("-").map(Number);
    const data = new Date(a, m - 1, d);
    const texto = data.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "2-digit" });
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const dias = Math.round((data - hoje) / 86400000);
    return dias === 0 ? `hoje, ${texto}` : dias === 1 ? `amanhã, ${texto}` : texto;
  }

  /* ---------- Preços ---------- */
  function precoUnitario(p, v) {
    const x = p.variacoes?.length ? p.variacoes[v]?.preco : p.preco;
    return ehNumero(x) ? x : null;
  }
  function textoPrecoCard(p) {
    if (p.variacoes?.length) {
      const precos = p.variacoes.map((v) => v.preco).filter(ehNumero);
      if (!precos.length) return null;
      const min = Math.min(...precos);
      return new Set(precos).size > 1 ? `a partir de ${fmt(min)}` : fmt(min);
    }
    return ehNumero(p.preco) ? fmt(p.preco) : null;
  }
  function nomeComVariacao(p, v) {
    const variacao = p.variacoes?.[v];
    return variacao ? `${p.nome} (${variacao.nome})` : p.nome;
  }

  /* ---------- Links fixos ---------- */
  const linkWhats = (texto) =>
    `https://wa.me/${CONFIG.whatsapp}${texto ? `?text=${encodeURIComponent(texto)}` : ""}`;

  function preencherTextosFixos() {
    $$("[data-link-whats]").forEach((el) => {
      el.href = el.dataset.linkWhats === "encomenda"
        ? linkWhats("Olá, Dona Irene! Gostaria de fazer uma encomenda para um evento.")
        : linkWhats("Olá, Dona Irene! Vim pelo site e tenho uma dúvida.");
    });
    $$("[data-link-insta]").forEach((el) => (el.href = `https://www.instagram.com/${CONFIG.instagram}/`));
    $$("[data-insta-texto]").forEach((el) => (el.textContent = `@${CONFIG.instagram}`));
    $$("[data-telefone]").forEach((el) => (el.textContent = CONFIG.telefoneExibicao || "WhatsApp"));
    $$("[data-ano]").forEach((el) => (el.textContent = new Date().getFullYear()));
  }

  /* ---------- Cardápio ---------- */
  const categoriasVisiveis = CATEGORIAS.filter(
    (c) => c.visivel !== false && PRODUTOS.some((p) => p.categoria === c.id)
  );

  function htmlCard(p) {
    const indisponivel = p.disponivel === false;
    const preco = textoPrecoCard(p);
    const textoPreco = indisponivel ? esc(p.aviso || "Indisponível no momento") : preco ?? "Consultar valor";
    const classePreco = !indisponivel && !preco ? "preco consultar" : "preco";
    return `
      <article class="card${indisponivel ? " indisponivel" : ""}">
        <button class="card-abrir" type="button" data-abrir="${esc(p.id)}">
          <div class="card-foto">
            <img src="${esc(p.foto)}" alt="" loading="lazy" decoding="async">
            ${p.selo ? `<span class="selo">${esc(p.selo)}</span>` : ""}
          </div>
          <div class="card-info">
            <h3>${esc(p.nome)}</h3>
            ${p.descricao ? `<p class="desc">${esc(p.descricao)}</p>` : ""}
            <p class="${classePreco}">${textoPreco}</p>
          </div>
        </button>
        ${indisponivel ? "" : `<button class="card-mais" type="button" data-mais="${esc(p.id)}" aria-label="Adicionar ${esc(p.nome)}">+</button>`}
      </article>`;
  }

  function renderizarCardapio() {
    $("[data-chips]").innerHTML = categoriasVisiveis
      .map((c) => `<a class="chip" href="#cat-${esc(c.id)}" data-chip="${esc(c.id)}">${esc(c.nome)}</a>`)
      .join("");
    $("[data-lista]").innerHTML = categoriasVisiveis
      .map((c) => `
        <section class="categoria" id="cat-${esc(c.id)}" aria-labelledby="titulo-${esc(c.id)}">
          <header class="cat-topo">
            <h2 id="titulo-${esc(c.id)}">${esc(c.nome)}</h2>
            ${c.descricao ? `<p>${esc(c.descricao)}</p>` : ""}
          </header>
          <div class="grade">${PRODUTOS.filter((p) => p.categoria === c.id).map(htmlCard).join("")}</div>
        </section>`)
      .join("");
  }

  function iniciarChipsAtivos() {
    const chips = $("[data-chips]");
    const ativar = (id) => {
      $$(".chip", chips).forEach((ch) => {
        const ativo = ch.dataset.chip === id;
        ch.classList.toggle("ativo", ativo);
        if (ativo) chips.scrollTo({ left: ch.offsetLeft - 16, behavior: "smooth" });
      });
    };
    if (!("IntersectionObserver" in window)) return;
    const obs = new IntersectionObserver(
      (entradas) => entradas.forEach((e) => e.isIntersecting && ativar(e.target.id.slice(4))),
      { rootMargin: "-140px 0px -60% 0px" }
    );
    $$(".categoria").forEach((s) => obs.observe(s));
  }

  /* ---------- Sacola (estado) ---------- */
  let sacola = armazenamento.ler(CHAVE_SACOLA, []).filter((it) => {
    const p = porId.get(it?.id);
    if (!p || p.disponivel === false || !(it.q > 0)) return false;
    if (p.variacoes?.length) return Number.isInteger(it.v) && it.v >= 0 && it.v < p.variacoes.length;
    return it.v == null;
  });
  let pedidoEnviado = false;

  const salvarSacola = () => armazenamento.gravar(CHAVE_SACOLA, sacola);
  const totalItens = () => sacola.reduce((s, it) => s + it.q, 0);

  function calcularTotais() {
    let subtotal = 0;
    let aConfirmar = false;
    for (const it of sacola) {
      const u = precoUnitario(porId.get(it.id), it.v);
      if (u == null) aConfirmar = true;
      else subtotal += u * it.q;
    }
    return { subtotal, aConfirmar };
  }

  function adicionar(id, v, q, obs) {
    const p = porId.get(id);
    if (!p || p.disponivel === false) return;
    const nota = (obs || "").trim();
    const existente = sacola.find((it) => it.id === id && it.v === v && (it.obs || "") === nota);
    if (existente) existente.q += q;
    else sacola.push({ id, v, q, obs: nota });
    salvarSacola();
    atualizarIndicadores(true);
    mostrarAviso(`${q}× ${p.nome} na sacola`);
  }

  function alterarQuantidade(indice, delta) {
    const it = sacola[indice];
    if (!it) return;
    it.q += delta;
    if (it.q <= 0) sacola.splice(indice, 1);
    salvarSacola();
    atualizarIndicadores(false);
    renderizarSacola();
  }

  function atualizarIndicadores(animar) {
    const n = totalItens();
    const contador = $("[data-contador]");
    contador.hidden = n === 0;
    contador.textContent = n;
    if (animar) {
      contador.classList.remove("pulo");
      void contador.offsetWidth;
      contador.classList.add("pulo");
    }
    const barra = $("[data-barra]");
    barra.hidden = n === 0;
    document.body.classList.toggle("tem-barra", n > 0);
    $("[data-barra-qtd]").textContent = n;
    const { subtotal } = calcularTotais();
    $("[data-barra-total]").textContent = subtotal > 0 ? fmt(subtotal) : "";
  }

  /* ---------- Aviso rápido (toast) ---------- */
  let timerAviso;
  function mostrarAviso(texto) {
    const t = $("#toast");
    t.textContent = texto;
    t.classList.add("visivel");
    clearTimeout(timerAviso);
    timerAviso = setTimeout(() => t.classList.remove("visivel"), 1800);
  }

  /* ---------- Diálogo do produto ---------- */
  const dlgProduto = $("#dlg-produto");
  let atual = null;

  function abrirProduto(id) {
    const p = porId.get(id);
    if (!p) return;
    const temVariacoes = !!p.variacoes?.length;
    const indisponivel = p.disponivel === false;
    atual = { p, v: temVariacoes ? 0 : null, q: 1 };

    const foto = $("#pd-foto");
    foto.src = p.foto;
    foto.alt = p.nome;
    $("#pd-nome").textContent = p.nome;
    $("#pd-desc").textContent = p.descricao || "";
    $("#pd-obs").value = "";

    $("#pd-variacoes").hidden = !temVariacoes || indisponivel;
    $("#pd-variacoes-lista").innerHTML = temVariacoes
      ? p.variacoes.map((v, i) => `
          <label class="opcao">
            <input type="radio" name="pd-variacao" value="${i}"${i === 0 ? " checked" : ""}>
            <span>${esc(v.nome)}</span>
            ${ehNumero(v.preco) ? `<small>${fmt(v.preco)}</small>` : ""}
          </label>`).join("")
      : "";

    const aviso = $("#pd-aviso");
    aviso.hidden = !indisponivel;
    aviso.textContent = indisponivel
      ? `${p.aviso || "Indisponível no momento"}. Siga @${CONFIG.instagram} no Instagram para saber quando abrem as encomendas.`
      : "";
    $("#pd-obs-campo").hidden = indisponivel;
    $("#pd-rodape").hidden = indisponivel;

    atualizarProduto();
    dlgProduto.showModal();
    $(".sheet-rolagem", dlgProduto).scrollTop = 0;
  }

  function atualizarProduto() {
    const { p, v, q } = atual;
    $("#pd-qtd").textContent = q;
    $('[data-pd-qtd="-1"]').disabled = q <= 1;

    const u = precoUnitario(p, v);
    const precoEl = $("#pd-preco");
    const algumPreco = p.variacoes?.length ? p.variacoes.some((x) => ehNumero(x.preco)) : ehNumero(p.preco);
    precoEl.hidden = p.disponivel === false || (p.variacoes?.length && algumPreco);
    precoEl.textContent = u == null ? "Valor a consultar — a Dona Irene confirma pelo WhatsApp" : fmt(u);
    precoEl.classList.toggle("consultar", u == null);

    $("#pd-add").textContent = u == null
      ? (q > 1 ? `Adicionar ${q} à sacola` : "Adicionar à sacola")
      : `Adicionar · ${fmt(u * q)}`;
  }

  /* ---------- Diálogo da sacola ---------- */
  const dlgSacola = $("#dlg-sacola");
  const formPedido = $("#form-pedido");

  function htmlItem(it, i) {
    const p = porId.get(it.id);
    const u = precoUnitario(p, it.v);
    const variacao = p.variacoes?.[it.v];
    const iconeMenos = it.q === 1
      ? `<svg aria-hidden="true"><use href="#i-lixo"/></svg>`
      : "−";
    return `
      <li class="sc-item">
        <img src="${esc(p.foto)}" alt="">
        <div class="sc-item-info">
          <div class="sc-item-nome">${esc(p.nome)}</div>
          ${variacao ? `<span class="sc-item-var">${esc(variacao.nome)}</span>` : ""}
          ${it.obs ? `<span class="sc-item-obs">“${esc(it.obs)}”</span>` : ""}
          <span class="sc-item-preco${u == null ? " consultar" : ""}">${u == null ? "a confirmar" : fmt(u * it.q)}</span>
        </div>
        <div class="sc-item-acoes">
          <div class="qtd mini" role="group" aria-label="Quantidade de ${esc(p.nome)}">
            <button type="button" data-item="${i}" data-delta="-1" aria-label="${it.q === 1 ? "Remover" : "Diminuir"}">${iconeMenos}</button>
            <output>${it.q}</output>
            <button type="button" data-item="${i}" data-delta="1" aria-label="Aumentar">+</button>
          </div>
        </div>
      </li>`;
  }

  function renderizarTotais() {
    const { subtotal, aConfirmar } = calcularTotais();
    const entrega = valorCampo("recebimento") !== "retirada";
    const taxa = CONFIG.taxaEntrega;
    const linhas = [];

    linhas.push(`<dt>Subtotal</dt><dd>${subtotal > 0 ? fmt(subtotal) : "—"}${aConfirmar && subtotal > 0 ? " +" : ""}</dd>`);
    if (entrega) {
      const textoTaxa = ehNumero(taxa) ? (taxa === 0 ? "Grátis" : fmt(taxa)) : "a combinar";
      linhas.push(`<dt>Entrega</dt><dd>${textoTaxa}</dd>`);
    } else {
      linhas.push(`<dt>Retirada</dt><dd>Grátis</dd>`);
    }
    const somaTaxa = entrega && ehNumero(taxa) ? taxa : 0;
    const total = subtotal + somaTaxa;
    const totalTexto = aConfirmar && subtotal === 0 ? "A confirmar" : fmt(total) + (aConfirmar ? " +" : "");
    linhas.push(`<dt class="total">Total</dt><dd class="total">${totalTexto}</dd>`);

    const notas = [];
    if (aConfirmar) notas.push("Alguns itens têm valor a confirmar — a Dona Irene passa o valor final pelo WhatsApp.");
    if (entrega && !ehNumero(taxa)) notas.push("A taxa de entrega é combinada conforme o bairro.");
    if (notas.length) linhas.push(`<p class="nota">${notas.map(esc).join(" ")}</p>`);

    $("#sc-totais").innerHTML = linhas.join("");
  }

  function renderizarSacola() {
    const vazia = sacola.length === 0;
    $("#sc-enviado").hidden = !pedidoEnviado;
    $("#sc-vazia").hidden = pedidoEnviado || !vazia;
    $("#sc-cheia").hidden = pedidoEnviado || vazia;
    $("#sc-rodape").hidden = pedidoEnviado || vazia;
    $("#sc-titulo").textContent = pedidoEnviado ? "Quase lá!" : "Sua sacola";
    $("#sc-itens").innerHTML = sacola.map(htmlItem).join("");
    renderizarTotais();
  }

  function prepararData() {
    const campo = formPedido.elements.data;
    campo.min = hojeIso();
    if (!campo.value || campo.value < campo.min) campo.value = dataSugerida();
  }

  function abrirSacola() {
    pedidoEnviado = false;
    $("#sc-erro").textContent = "";
    prepararData();
    renderizarSacola();
    dlgSacola.showModal();
    $(".sheet-rolagem", dlgSacola).scrollTop = 0;
  }

  /* ---------- Formulário do pedido ---------- */
  const valorCampo = (nome) => {
    const el = formPedido.elements[nome];
    return el ? (el.value || "").trim() : "";
  };

  function montarPagamentos() {
    $("#sc-pagamentos").innerHTML = CONFIG.formasPagamento
      .map((f, i) => `
        <label class="opcao">
          <input type="radio" name="pagamento" value="${esc(f)}"${i === 0 ? " checked" : ""}>
          <span>${esc(f)}</span>
        </label>`)
      .join("");
    if (!CONFIG.permiteRetirada) $("#sc-recebimento").hidden = true;
  }

  function sincronizarCampos() {
    const entrega = valorCampo("recebimento") !== "retirada";
    $("#sc-endereco").hidden = !entrega;
    $("#sc-troco").hidden = !/dinheiro/i.test(valorCampo("pagamento"));
  }

  function restaurarCliente() {
    const c = armazenamento.ler(CHAVE_CLIENTE, {});
    for (const campo of ["nome", "endereco", "bairro"]) {
      if (c[campo]) formPedido.elements[campo].value = c[campo];
    }
    for (const grupo of ["recebimento", "pagamento"]) {
      if (!c[grupo]) continue;
      const radio = $$(`input[name="${grupo}"]`, formPedido).find((r) => r.value === c[grupo]);
      if (radio) radio.checked = true;
    }
    if (!CONFIG.permiteRetirada) formPedido.elements.recebimento.value = "entrega";
  }

  function salvarCliente() {
    armazenamento.gravar(CHAVE_CLIENTE, {
      nome: valorCampo("nome"),
      endereco: valorCampo("endereco"),
      bairro: valorCampo("bairro"),
      recebimento: valorCampo("recebimento"),
      pagamento: valorCampo("pagamento"),
    });
  }

  function montarMensagem() {
    const entrega = valorCampo("recebimento") !== "retirada";
    const { subtotal, aConfirmar } = calcularTotais();
    const L = [];
    L.push("Olá, Dona Irene! Quero fazer um pedido pelo site:");
    L.push("");
    L.push("*PEDIDO*");
    for (const it of sacola) {
      const p = porId.get(it.id);
      const u = precoUnitario(p, it.v);
      L.push(`• ${it.q}x ${nomeComVariacao(p, it.v)} — ${u == null ? "valor a confirmar" : fmt(u * it.q)}`);
      if (it.obs) L.push(`   _Obs.: ${it.obs}_`);
    }
    L.push("");
    if (subtotal > 0) L.push(`*Subtotal:* ${fmt(subtotal)}${aConfirmar ? " + itens a confirmar" : ""}`);
    else L.push("*Subtotal:* a confirmar");

    const quando = descreverData(valorCampo("data"));
    if (entrega) {
      L.push(`*Entrega:* Delivery — ${quando}`);
      L.push(`*Endereço:* ${valorCampo("endereco")}${valorCampo("bairro") ? ` — ${valorCampo("bairro")}` : ""}`);
      const taxa = CONFIG.taxaEntrega;
      L.push(`*Taxa de entrega:* ${ehNumero(taxa) ? (taxa === 0 ? "grátis" : fmt(taxa)) : "a combinar"}`);
    } else {
      L.push(`*Retirada:* ${quando}`);
    }

    const pagamento = valorCampo("pagamento");
    const troco = valorCampo("troco");
    L.push(`*Pagamento:* ${pagamento}${/dinheiro/i.test(pagamento) && troco ? ` (troco para R$ ${troco})` : ""}`);
    if (valorCampo("obs")) L.push(`*Observações:* ${valorCampo("obs")}`);
    L.push("");
    L.push(`*Nome:* ${valorCampo("nome")}`);
    return L.join("\n");
  }

  function validarPedido() {
    const entrega = valorCampo("recebimento") !== "retirada";
    const obrigatorios = [["nome", "seu nome"], ["data", "a data (de hoje em diante)"]];
    if (entrega) obrigatorios.push(["endereco", "o endereço"], ["bairro", "o bairro"]);
    const faltando = [];
    $$("input", formPedido).forEach((el) => el.removeAttribute("aria-invalid"));
    for (const [campo, rotulo] of obrigatorios) {
      const vazio = !valorCampo(campo) || (campo === "data" && valorCampo("data") < hojeIso());
      if (vazio) {
        formPedido.elements[campo].setAttribute("aria-invalid", "true");
        faltando.push([campo, rotulo]);
      }
    }
    if (!faltando.length) return true;
    const rotulos = faltando.map((f) => f[1]);
    const lista = rotulos.length > 1 ? `${rotulos.slice(0, -1).join(", ")} e ${rotulos.at(-1)}` : rotulos[0];
    $("#sc-erro").textContent = `Falta preencher ${lista}.`;
    formPedido.elements[faltando[0][0]].focus();
    return false;
  }

  function enviarPedido(evento) {
    evento.preventDefault();
    $("#sc-erro").textContent = "";
    if (!sacola.length || !validarPedido()) return;
    salvarCliente();
    const url = linkWhats(montarMensagem());
    const janela = window.open(url, "_blank");
    if (janela) janela.opener = null;
    else window.location.href = url;
    pedidoEnviado = true;
    renderizarSacola();
    $(".sheet-rolagem", dlgSacola).scrollTop = 0;
  }

  /* ---------- Eventos ---------- */
  function ligarEventos() {
    $("[data-lista]").addEventListener("click", (e) => {
      const mais = e.target.closest("[data-mais]");
      if (mais) {
        const p = porId.get(mais.dataset.mais);
        if (p?.variacoes?.length) abrirProduto(p.id);
        else adicionar(p.id, null, 1, "");
        return;
      }
      const abrir = e.target.closest("[data-abrir]");
      if (abrir) abrirProduto(abrir.dataset.abrir);
    });

    // Produto
    $$("[data-pd-qtd]").forEach((b) =>
      b.addEventListener("click", () => {
        atual.q = Math.max(1, Math.min(99, atual.q + Number(b.dataset.pdQtd)));
        atualizarProduto();
      })
    );
    $("#pd-variacoes-lista").addEventListener("change", (e) => {
      if (e.target.name === "pd-variacao") {
        atual.v = Number(e.target.value);
        atualizarProduto();
      }
    });
    $("#form-produto").addEventListener("submit", (e) => {
      e.preventDefault();
      adicionar(atual.p.id, atual.v, atual.q, $("#pd-obs").value);
      dlgProduto.close();
    });

    // Sacola
    $$("[data-abrir-sacola]").forEach((b) => b.addEventListener("click", abrirSacola));
    $("#sc-itens").addEventListener("click", (e) => {
      const b = e.target.closest("[data-item]");
      if (b) alterarQuantidade(Number(b.dataset.item), Number(b.dataset.delta));
    });
    formPedido.addEventListener("change", (e) => {
      if (e.target.name === "recebimento") {
        $$("#sc-endereco input").forEach((el) => el.removeAttribute("aria-invalid"));
        $("#sc-erro").textContent = "";
      }
      sincronizarCampos();
      renderizarTotais();
      salvarCliente();
    });
    formPedido.addEventListener("input", (e) => {
      if (!e.target.matches("input") || !e.target.value.trim()) return;
      e.target.removeAttribute("aria-invalid");
      if (!formPedido.querySelector('[aria-invalid="true"]')) $("#sc-erro").textContent = "";
    });
    formPedido.addEventListener("submit", enviarPedido);
    $("#sc-limpar").addEventListener("click", () => {
      sacola = [];
      salvarSacola();
      atualizarIndicadores(false);
      dlgSacola.close();
      mostrarAviso("Obrigado pelo pedido!");
    });
    $("#sc-voltar").addEventListener("click", () => {
      pedidoEnviado = false;
      renderizarSacola();
    });

    // Fechar diálogos (botão ou clique fora)
    for (const dlg of [dlgProduto, dlgSacola]) {
      dlg.addEventListener("click", (e) => {
        if (e.target === dlg || e.target.closest("[data-fechar]")) dlg.close();
      });
    }

    // Mantém a sacola sincronizada entre abas
    window.addEventListener("storage", (e) => {
      if (e.key !== CHAVE_SACOLA) return;
      sacola = armazenamento.ler(CHAVE_SACOLA, []).filter((it) => porId.has(it?.id));
      atualizarIndicadores(false);
      if (dlgSacola.open) renderizarSacola();
    });
  }

  /* ---------- Início ---------- */
  preencherTextosFixos();
  renderizarCardapio();
  montarPagamentos();
  restaurarCliente();
  sincronizarCampos();
  ligarEventos();
  atualizarIndicadores(false);
  iniciarChipsAtivos();
})();
