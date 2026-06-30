# Apostila: Construindo uma Página de Notícia com HTML e CSS

**Projeto:** Página de notícia do portal Patos Hoje — "Quebra do Milho na Fenamilho 2026"  
**Pré-requisitos:** Nenhum. Basta ter um editor de texto (VS Code, Notepad++) e um navegador.

---

## Como esta apostila funciona

Cada bloco adiciona uma parte nova ao projeto. Você escreve o código, abre o arquivo no navegador e confere se o resultado bate com o descrito. Não pule blocos — cada um depende do anterior.

---

## BLOCO 1 — Criar o arquivo HTML

**Conceito:** Um arquivo HTML é um arquivo de texto com a extensão `.html`. O navegador lê esse arquivo e transforma o texto em uma página visual. Você precisa criá-lo antes de qualquer coisa.

**Objetivo deste bloco:** Ter um arquivo que o navegador consiga abrir.

**O que fazer:**

1. Abra o seu editor de texto.
2. Crie um novo arquivo.
3. Salve com o nome `index.html` em uma pasta vazia (ex: `projeto-noticia/`).

O arquivo está vazio por enquanto. Isso é esperado.

**Resultado esperado ao abrir no navegador:**

```
Uma aba em branco, sem título, sem conteúdo.
```

---

## BLOCO 2 — Escrever a estrutura básica do HTML

**Conceito:** Todo arquivo HTML válido precisa de uma estrutura mínima. São três partes:

- `<!DOCTYPE html>` — avisa ao navegador que este é um arquivo HTML5.
- `<head>` — configurações da página (não aparece visualmente).
- `<body>` — tudo que aparece na tela fica aqui.

As tags funcionam em pares: `<tag>` abre, `</tag>` fecha. O conteúdo fica entre elas.

**Objetivo deste bloco:** Ter a estrutura base que todo site usa.

**Código — `index.html`:**

```html
<!DOCTYPE html>
<html lang="pt-BR">

<head>
</head>

<body>
</body>

</html>
```

**Resultado esperado ao abrir no navegador:**

```
Página em branco. Nenhum erro no console (F12 > Console).
```

---

## BLOCO 3 — Colocar título e ícone na aba do navegador

**Conceito:** Dentro do `<head>` ficam instruções para o navegador, não para o usuário. As três mais importantes agora são:

- `<meta charset="UTF-8">` — garante que letras com acento (ã, ç, é) apareçam corretamente.
- `<title>` — define o texto que aparece na aba do navegador.
- `<link rel="icon">` — define o ícone (favicon) da aba.

**Objetivo deste bloco:** Aparecer o título correto na aba e o ícone do portal.

**Código — `index.html` (substituir o `<head>` anterior):**

```html
<head>
  <meta charset="UTF-8">
  <title>Quebra do Milho - Fenamilho 2026</title>
  <link rel="icon" href="https://patoshoje.com.br/static/img/logo-small.png">
</head>
```

**Resultado esperado ao abrir no navegador:**

```
A aba mostra o texto "Quebra do Milho - Fenamilho 2026"
e o pequeno ícone do portal Patos Hoje ao lado esquerdo do título.
```

---

## BLOCO 4 — Criar a barra de navegação (header) e o corpo do conteúdo

**Conceito:** A tag `<header>` representa o topo da página — normalmente contém logo e menu. A tag `<div>` é um contêiner genérico sem significado especial; ela serve para agrupar elementos e aplicar estilos depois. O atributo `class="nome"` é um apelido que você dá para o elemento poder estilizá-lo no CSS.

**Objetivo deste bloco:** Ter a estrutura visual dividida em duas regiões: o topo (header) e o corpo da notícia (div.conteudo).

**Código — `index.html` (substituir o `<body>` anterior):**

```html
<body>

  <header>
  </header>

  <div class="conteudo">
  </div>

</body>
```

**Resultado esperado ao abrir no navegador:**

```
A página continua em branco. As tags header e div existem
no código mas ainda não têm conteúdo nem estilo visível.
```

---

## BLOCO 5 — Inserir logo e link de categoria no header

**Conceito:** A tag `<img>` exibe uma imagem. Ela não tem tag de fechamento. O atributo `src` é o endereço da imagem (pode ser uma URL da internet). O atributo `alt` é o texto alternativo exibido se a imagem não carregar — obrigatório por boas práticas. A tag `<a>` cria um link clicável; o atributo `href` é o endereço de destino.

**Objetivo deste bloco:** O header mostrar a logo do portal e um link de categoria.

**Código — substituir o `<header>` vazio:**

```html
<header>

  <div class="logo-area">
    <img src="https://patoshoje.com.br/static/img/logo-small.png" alt="Logo Patos Hoje">
  </div>

  <div class="categoria">
    <a href="https://patoshoje.com.br/noticias/categoria/fenamilho/">Fenamilho</a>
  </div>

</header>
```

**Resultado esperado ao abrir no navegador:**

```
No topo da página aparecem dois itens:
- A logo do Patos Hoje (imagem pequena)
- O texto "Fenamilho" como link azul sublinhado (padrão do navegador)
Os dois ficam empilhados verticalmente por enquanto — o CSS vai alinhar depois.
```

---

## BLOCO 6 — Inserir título e subtítulo da notícia

**Conceito:** As tags `<h1>` a `<h6>` são títulos. `<h1>` é o mais importante (maior e mais em destaque), `<h6>` é o menos importante. Uma boa prática é usar apenas um `<h1>` por página — ele representa o assunto principal. O `<h2>` é o subtítulo, normalmente um resumo do conteúdo.

**Objetivo deste bloco:** O corpo da notícia exibir o título e o subtítulo.

**Código — inserir dentro da `div.conteudo`:**

```html
<div class="conteudo">

  <h1>Nova atração da Fenamilho, Quebra do Milho lota Praça Park e conquista o público</h1>

  <h2>Adaptada à identidade patense, a Quebra do Milho trouxe uma verdadeira
  experiência gastronômica para os associados e visitantes.</h2>

</div>
```

**Resultado esperado ao abrir no navegador:**

```
Dois textos aparecem no corpo da página:
- O h1 em tamanho grande e negrito (título principal)
- O h2 em tamanho médio e negrito (subtítulo)
Sem estilo personalizado ainda — aparência padrão do navegador.
```

---

## BLOCO 7 — Inserir autor e data da notícia

**Conceito:** A tag `<p>` representa um parágrafo de texto. Ela adiciona automaticamente um espaço acima e abaixo do conteúdo. A tag `<strong>` deixa o texto em negrito e indica que aquele trecho tem importância maior. Para agrupar autor e data e poder estilizá-los separadamente, usamos uma `<div>` com uma classe própria.

**Objetivo deste bloco:** Exibir "Por Maurício Rocha — 02/06/2026" abaixo do subtítulo.

**Código — inserir após o `<h2>`, dentro da `div.conteudo`:**

```html
<div class="meta">
  <p>Por <strong>Maurício Rocha</strong> — 02/06/2026</p>
</div>
```

**Resultado esperado ao abrir no navegador:**

```
Abaixo do subtítulo aparece o texto:
"Por Maurício Rocha — 02/06/2026"
O nome do autor está em negrito. A data não.
```

---

## BLOCO 8 — Inserir a imagem de destaque da notícia

**Conceito:** Quando uma imagem fica dentro de uma `<div>`, você pode controlar o tamanho e posição da div sem alterar diretamente a tag `<img>`. Isso é útil porque permite centralizar, adicionar margem e controlar o espaço ao redor da imagem de forma independente. A URL do `src` pode ser um endereço completo da internet.

**Objetivo deste bloco:** Exibir a foto principal da notícia abaixo das informações do autor.

**Código — inserir após a `div.meta`, dentro da `div.conteudo`:**

```html
<div class="imagem-destaque">
  <img
    src="https://patoshoje.com.br/media/cache/a9/d7/a9d75321f48648991102a14ace65518a.jpg"
    alt="Evento Quebra do Milho na Fenamilho 2026">
</div>
```

**Resultado esperado ao abrir no navegador:**

```
A foto do evento aparece abaixo do autor/data.
O tamanho é o tamanho original da imagem — sem redimensionamento ainda.
O CSS vai ajustar isso depois.
```

---

## BLOCO 9 — Inserir os parágrafos de texto da notícia

**Conceito:** Cada `<p>` é um parágrafo independente. O navegador adiciona um espaço automático entre eles. Para destacar uma fala citada, usamos `<p class="citacao">` — a mesma tag `p`, mas com uma classe diferente que vai receber um estilo visual diferenciado no CSS.

**Objetivo deste bloco:** Todo o corpo textual da notícia estar presente na página.

**Código — inserir após a `div.imagem-destaque`, dentro da `div.conteudo`:**

```html
<p>
  A Fenamilho 2026 ganhou mais uma atração para entrar na história da festa. Inspirado na
  tradicional Queima do Alho, o Sindicato dos Produtores Rurais de Patos de Minas promoveu
  nesta terça-feira (2) a primeira edição da <strong>"Quebra do Milho"</strong>, evento que
  reuniu centenas de pessoas na Praça Park do Parque de Exposições e celebrou as raízes da
  Capital Nacional do Milho.
</p>

<p>
  Adaptada à identidade patense, a Quebra do Milho trouxe uma verdadeira experiência
  gastronômica para os associados e visitantes. O cardápio foi recheado de carnes assadas
  preparadas em diferentes estilos, incluindo churrasqueiras tradicionais, fogo de chão e
  até mesmo uma churrasqueira instalada em forma de roda-gigante.
</p>

<p>
  Para acompanhar, não faltaram pratos típicos como mandioca, feijão tropeiro e arroz
  carreteiro. E, claro, o milho foi o grande protagonista da festa. Pamonhas preparadas na
  hora e milho cozido servido fresquinho fizeram sucesso entre os participantes.
</p>

<p>
  Segundo o presidente do Sindicato dos Produtores Rurais de Patos de Minas, Cleides Júnior,
  a iniciativa foi criada para valorizar os associados e proporcionar um momento especial
  dentro da própria casa deles.
</p>

<p class="citacao">
  "Isso é um respeito com o nosso associado. Depois de tantas obras, de tanto trabalho, nós
  estamos oferecendo o privilégio de o associado vir curtir na casa dele um belo churrasco,
  uma pamonha, um milho cozido e uma cerveja gelada."
</p>

<p>
  O milho servido durante o evento teve um significado ainda mais especial. De acordo com
  Cleides Júnior, ele fez questão de participar pessoalmente da colheita das espigas que
  foram distribuídas ao público durante a programação.
</p>

<p>
  Além da gastronomia, a música ao vivo e o ambiente familiar, a 1ª Quebra do Milho serviu
  também para homenagear produtores rurais que contribuíram com o desenvolvimento do setor
  na região. A Praça Park ficou completamente lotada durante toda a programação,
  demonstrando a aprovação do público à novidade.
</p>

<p>
  O presidente também ressaltou o momento positivo vivido pela Fenamilho. A organização da
  festa, as melhorias realizadas no Parque de Exposições e as novidades apresentadas nesta
  edição têm recebido elogios de associados, visitantes e expositores.
</p>
```

**Resultado esperado ao abrir no navegador:**

```
Todos os parágrafos da notícia aparecem abaixo da imagem.
A citação não tem estilo diferente ainda — ela vai parecer igual aos demais parágrafos
até o CSS ser aplicado.
```

---

## BLOCO 10 — Inserir a galeria de fotos

**Conceito:** Para criar uma grade de fotos, agrupamos várias `<div class="foto">` dentro de uma `<div class="galeria">`. Cada `div.foto` contém uma `<img>`. Com CSS, vamos colocar essas divs lado a lado. Por enquanto elas ficam empilhadas verticalmente.

**Objetivo deste bloco:** Ter as 6 fotos do evento presentes na página.

**Código — inserir após o último `<p>`, dentro da `div.conteudo`:**

```html
<h2>Fotos do evento</h2>

<div class="galeria">

  <div class="foto">
    <img src="https://patoshoje.com.br/media/cache/0f/f1/0ff12d010bbf3eb03e1fb1e5e550be1a.jpg" alt="Foto 1">
  </div>

  <div class="foto">
    <img src="https://patoshoje.com.br/media/cache/51/26/5126bdfd2f6558a67fbf9f939047014f.jpg" alt="Foto 2">
  </div>

  <div class="foto">
    <img src="https://patoshoje.com.br/media/cache/a1/2c/a12c3430f0e32de179fa670d8652cda1.jpg" alt="Foto 3">
  </div>

  <div class="foto">
    <img src="https://patoshoje.com.br/media/cache/87/73/8773d27603d4f2c145f9f67b6edc1e1c.jpg" alt="Foto 4">
  </div>

  <div class="foto">
    <img src="https://patoshoje.com.br/media/cache/d5/81/d5818eb15b200ca80fe023430433112d.jpg" alt="Foto 5">
  </div>

  <div class="foto">
    <img src="https://patoshoje.com.br/media/cache/5a/d0/5ad059a90c3f0b2a244e28dfe316c06e.jpg" alt="Foto 6">
  </div>

</div>

<div class="link-original">
  <a href="https://patoshoje.com.br/noticias/nova-atracao-da-fenamilho-quebra-do-milho-lota-praca-park-e-conquista-o-publico-veja-96079.html">
    Leia a matéria completa no Patos Hoje
  </a>
</div>
```

**Resultado esperado ao abrir no navegador:**

```
O título "Fotos do evento" aparece.
As 6 fotos aparecem empilhadas verticalmente (uma abaixo da outra) em tamanho original.
Abaixo das fotos aparece o link "Leia a matéria completa no Patos Hoje".
O CSS vai organizar em grade depois.
```

---

## BLOCO 11 — Criar o arquivo CSS e conectá-lo ao HTML

**Conceito:** CSS é um arquivo separado que define a aparência do HTML. Você cria o arquivo `.css` e usa a tag `<link>` dentro do `<head>` do HTML para conectar os dois. A partir daí, qualquer regra que você escrever no CSS vai afetar a página.

**Objetivo deste bloco:** Ter o arquivo CSS criado e conectado ao HTML.

**O que fazer:**

1. Na mesma pasta do `index.html`, crie um novo arquivo chamado `style.css`.
2. Deixe-o vazio por enquanto.
3. No `index.html`, adicione a linha abaixo dentro do `<head>`:

```html
<link rel="stylesheet" href="style.css">
```

**Resultado esperado ao abrir no navegador:**

```
A página não muda visualmente ainda.
Mas se você abrir o DevTools (F12 > Network), verá o arquivo style.css
sendo carregado com status 200, confirmando que a conexão funcionou.
```

---

## BLOCO 12 — CSS: reset e estilo base do body

**Conceito:** Por padrão, navegadores aplicam margens e padding próprios em elementos HTML. Isso causa diferenças entre browsers. A regra `* { margin: 0; padding: 0; }` remove tudo isso. O seletor `*` significa "todos os elementos". Depois disso, definimos a fonte padrão, cor de fundo e cor do texto no `body` — essas propriedades são herdadas por todos os elementos filhos.

**Objetivo deste bloco:** Remover estilos padrão do navegador e definir fonte, fundo e cor base.

**Código — `style.css`:**

```css
/* Remove margens e espaçamentos padrão de todos os elementos */
* {
  margin: 0;
  padding: 0;
}

/* Estilo base: fonte, fundo cinza claro, texto escuro */
body {
  font-family: Arial, sans-serif;
  background: #f4f4f4;
  color: #222222;
}
```

**Resultado esperado ao abrir no navegador:**

```
A página perde os espaços padrão do navegador.
O fundo da página fica cinza claro (#f4f4f4).
O texto usa a fonte Arial.
```

---

## BLOCO 13 — CSS: estilo do header (barra azul)

**Conceito:** O seletor `header` seleciona a tag `<header>` do HTML. `display: flex` faz com que os filhos diretos do elemento fiquem lado a lado (em linha). Por padrão, elementos de bloco ficam empilhados verticalmente — o flex muda isso. `padding` adiciona espaço interno entre a borda do elemento e seu conteúdo.

**Objetivo deste bloco:** O topo da página virar uma barra azul com logo à esquerda e link à direita.

**Código — adicionar ao `style.css`:**

```css
/* Barra do topo: fundo azul, itens lado a lado */
header {
  background: #6797c7;
  padding: 12px 20px;
  display: flex;
}

/* Empurra a logo para a esquerda (margin auto no lado direito) */
.logo-area {
  margin: 0 auto 0 0;
}

/* Tamanho fixo da imagem da logo */
.logo-area img {
  height: 40px;
}

/* Link de categoria: texto branco, tamanho pequeno */
.categoria a {
  color: #ffffff;
  font-size: 14px;
}
```

**Resultado esperado ao abrir no navegador:**

```
O topo vira uma barra azul (#6797c7).
A logo fica alinhada à esquerda.
O link "Fenamilho" fica branco, no canto direito da barra.
Os dois estão na mesma linha horizontal.
```

---

## BLOCO 14 — CSS: caixa branca centralizada (div.conteudo)

**Conceito:** `width` define a largura de um elemento. `margin: 30px auto` centraliza o elemento horizontalmente na tela — o `auto` distribui o espaço restante igualmente nos lados esquerdo e direito. `padding` adiciona espaço interno para o texto não encostar nas bordas da caixa.

**Objetivo deste bloco:** O corpo da notícia aparecer como uma caixa branca centralizada na tela.

**Código — adicionar ao `style.css`:**

```css
/* Caixa branca centralizada com largura fixa */
.conteudo {
  background: #ffffff;
  width: 760px;
  margin: 30px auto;
  padding: 30px;
}
```

**Resultado esperado ao abrir no navegador:**

```
Todo o conteúdo da notícia fica dentro de uma caixa branca.
A caixa tem 760px de largura e fica centralizada na tela.
Há um espaço de 30px entre o texto e as bordas da caixa.
```

---

## BLOCO 15 — CSS: títulos h1 e h2

**Conceito:** Você pode estilizar tags HTML diretamente pelo nome delas como seletor (`h1`, `h2`). `font-size` controla o tamanho do texto em pixels. `font-weight: normal` remove o negrito que o navegador coloca por padrão nos títulos. `margin-bottom` adiciona espaço abaixo do elemento.

**Objetivo deste bloco:** O título principal ter tamanho e cor corretos; o subtítulo ser visivelmente menor e mais discreto.

**Código — adicionar ao `style.css`:**

```css
/* Título principal: grande, cor quase preta */
h1 {
  font-size: 28px;
  color: #1a1a1a;
  margin-bottom: 14px;
}

/* Subtítulo: médio, cinza, sem negrito */
h2 {
  font-size: 18px;
  color: #444444;
  font-weight: normal;
  margin-bottom: 20px;
}
```

**Resultado esperado ao abrir no navegador:**

```
O h1 aparece grande (28px) em preto forte.
O h2 aparece menor (18px), cinza e sem negrito — mais discreto.
Há espaço entre cada elemento.
```

---

## BLOCO 16 — CSS: autor e data (div.meta)

**Conceito:** Quando uma classe CSS tem a mesma propriedade que a tag pai, a classe vence. Aqui sobrescrevemos a cor e o tamanho do texto somente para o elemento com `class="meta"`, sem afetar os outros parágrafos da página.

**Objetivo deste bloco:** Autor e data aparecerem em cinza e em tamanho menor que o texto normal.

**Código — adicionar ao `style.css`:**

```css
/* Autor e data: texto cinza e menor */
.meta {
  color: #888888;
  font-size: 13px;
  margin-bottom: 24px;
}
```

**Resultado esperado ao abrir no navegador:**

```
A linha "Por Maurício Rocha — 02/06/2026" aparece em cinza claro
e com fonte menor que os parágrafos do texto.
```

---

## BLOCO 17 — CSS: imagem de destaque centralizada

**Conceito:** `width: 100%` faz a imagem ocupar toda a largura do elemento pai (a `div.imagem-destaque`). `height: 420px` impõe uma altura fixa. O problema é que, com largura e altura fixas, a imagem pode ser distorcida. Para evitar isso, usamos `object-fit: cover`, que recorta a imagem mantendo as proporções, e `object-position: center`, que define que o recorte parte do centro da imagem.

**Objetivo deste bloco:** A imagem principal da notícia ocupar toda a largura, com altura fixa e sem distorção.

**Código — adicionar ao `style.css`:**

```css
/* Espaço abaixo da div que envolve a imagem */
.imagem-destaque {
  margin-bottom: 24px;
}

/* Imagem 100% de largura, altura fixa, centralizada sem distorção */
.imagem-destaque img {
  display: block;
  width: 100%;
  height: 420px;
  margin: 0 auto;
  object-fit: cover;
  object-position: center;
}
```

**Resultado esperado ao abrir no navegador:**

```
A foto ocupa toda a largura da caixa branca.
A altura é exatamente 420px.
A imagem não está distorcida — ela foi recortada pelo centro para caber no espaço.
```

---

## BLOCO 18 — CSS: parágrafos e citação

**Conceito:** O seletor `p` estiliza todos os parágrafos da página. Para estilizar apenas a citação de forma diferente, usamos `.citacao`, que aplica somente no `<p class="citacao">`. Isso é a base do CSS: seletores mais específicos sobrescrevem os mais genéricos.

**Objetivo deste bloco:** Texto com espaçamento correto e citação com fundo azul claro em destaque.

**Código — adicionar ao `style.css`:**

```css
/* Todos os parágrafos: tamanho, cor e espaçamento */
p {
  font-size: 16px;
  color: #333333;
  margin-bottom: 18px;
}

/* Parágrafo de citação: fundo azul claro com padding interno */
.citacao {
  background: #f0f5fb;
  color: #444444;
  padding: 16px 20px;
  margin-bottom: 18px;
}
```

**Resultado esperado ao abrir no navegador:**

```
Todos os parágrafos têm fonte de 16px com espaço entre eles.
O parágrafo de citação tem um fundo azul bem claro, diferente dos demais.
```

---

## BLOCO 19 — CSS: galeria de fotos em grade

**Conceito:** `display: flex` no elemento pai (`.galeria`) coloca todos os filhos (`.foto`) lado a lado. `width: 33%` divide o espaço em três colunas iguais (3 × 33% ≈ 100%). `padding: 4px` cria um pequeno espaço entre as fotos. Dentro de cada `.foto`, a `<img>` recebe `width: 100%` para ocupar a coluna inteira e `height: 160px` para altura uniforme.

**Objetivo deste bloco:** As 6 fotos aparecerem em uma grade de 3 colunas com 2 linhas.

**Código — adicionar ao `style.css`:**

```css
/* Título "Fotos do evento" em azul */
.conteudo h2 {
  font-size: 20px;
  color: #6797c7;
  margin-bottom: 16px;
  margin-top: 30px;
}

/* Grade: coloca as divs filho lado a lado */
.galeria {
  display: flex;
  margin-bottom: 30px;
}

/* Cada coluna: 1/3 da largura com pequeno espaço */
.foto {
  width: 33%;
  padding: 4px;
}

/* Imagem ocupa a coluna inteira com altura uniforme */
.foto img {
  width: 100%;
  height: 160px;
  display: block;
}
```

**Resultado esperado ao abrir no navegador:**

```
As 6 fotos aparecem organizadas em 2 linhas de 3 colunas.
Todas têm a mesma altura (160px).
Há um pequeno espaço de 4px entre cada foto.
O título "Fotos do evento" aparece em azul.
```

---

## BLOCO 20 — CSS: link para a matéria original

**Conceito:** Por padrão, links `<a>` têm cor azul e sublinhado. Aqui sobrescrevemos apenas a cor para combinar com o azul do portal. O `font-size` reduz o tamanho para esse link ser visualmente secundário em relação ao conteúdo principal.

**Objetivo deste bloco:** O link final aparecer com a cor e tamanho corretos.

**Código — adicionar ao `style.css`:**

```css
/* Espaço acima do link */
.link-original {
  margin-top: 10px;
}

/* Cor e tamanho do link */
.link-original a {
  color: #6797c7;
  font-size: 14px;
}
```

**Resultado esperado ao abrir no navegador:**

```
O link "Leia a matéria completa no Patos Hoje" aparece em azul (#6797c7),
tamanho 14px, com um espaço acima separando-o da galeria.
A página está completa e idêntica ao site original (sem propagandas, sem rodapé).
```

---

## Resultado final — estrutura dos arquivos

Ao final de todos os blocos, você terá dois arquivos na mesma pasta:

```
projeto-noticia/
├── index.html
└── style.css
```

O `index.html` contém toda a estrutura e o conteúdo.
O `style.css` contém toda a aparência visual.
Os dois se comunicam pela linha `<link rel="stylesheet" href="style.css">` no `<head>`.
