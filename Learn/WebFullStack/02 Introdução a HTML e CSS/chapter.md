---
title: Fundamentos de HTML
type: hands-on
duration: 8
---

**Curso Web Full Stack — Professor Fabio Campos**

Nesta aula você monta uma página do zero. Primeiro a estrutura mínima do arquivo, depois o conteúdo (títulos, textos, caixas e imagens) e, por fim, as três formas de aplicar estilo: direto na tag, em um bloco `<style>` e em um arquivo CSS separado. A aula termina com as propriedades de espaçamento mais usadas.

![HTML, CSS e JavaScript em uma página](../imagens/html-css-js-pagina.png)

---

## Objetivos

Ao final da aula, você deve conseguir:

- Montar a estrutura básica de uma página HTML.
- Definir o título e o ícone da aba.
- Usar `h1`, `p`, `div`, `strong` e `img`.
- Aplicar estilo de três formas: inline, tag `<style>` e `<link>`.
- Controlar tamanho, cor e espaçamento dos elementos.

---

## Estrutura da página

Todo arquivo HTML tem um `<html>` que envolve duas partes:

| Tag | O que contém |
|---|---|
| `<head>` | Informações da página que não aparecem na tela: título, ícone, estilos |
| `<body>` | Tudo que o usuário vê |

```html
<html>
  <head>
  </head>
  <body>
  </body>
</html>
```

Salve com a extensão `.html` e abra no navegador.

> Nesta aula omitimos o `<!DOCTYPE html>` para manter o exemplo mínimo. Na prática ele é recomendado, porque sem ele o navegador usa um modo de compatibilidade antigo e pode renderizar alguns estilos de forma diferente.

---

## Título e ícone

Ficam dentro do `<head>`:

```html
<head>
  <title>Minha primeira página</title>
  <link rel="icon" href="icone.png">
</head>
```

| Elemento | Efeito |
|---|---|
| `<title>` | Texto exibido na aba do navegador |
| `<link rel="icon">` | Imagem pequena exibida ao lado do título na aba |

> Sem a tag `<meta charset="UTF-8">`, acentos e caracteres especiais podem aparecer quebrados dependendo do editor ou do servidor. Se isso acontecer, é o primeiro ponto a verificar.

---

## Conteúdo da página

Dentro do `<body>` usamos as tags abaixo.

| Tag | Função | Tem fechamento? |
|---|---|---|
| `<h1>` | Título principal da página | Sim |
| `<p>` | Parágrafo de texto | Sim |
| `<strong>` | Destaca um trecho em negrito | Sim |
| `<div>` | Caixa para agrupar elementos | Sim |
| `<img>` | Exibe uma imagem | Não |

```html
<body>
  <h1>Aprendendo Web Design</h1>

  <div>
    <p>Isso é um parágrafo com uma palavra em <strong>destaque</strong>.</p>
    <img src="paisagem.png" alt="Montanhas ao lado de um rio">
  </div>
</body>
```

Na tag `<img>`:

- `src` é o caminho do arquivo da imagem.
- `alt` é o texto que aparece se a imagem não carregar e que leitores de tela usam.

A `<div>` não muda nada visualmente sozinha. Seu uso é agrupar elementos para estilizá-los em conjunto.

---

## Estilo inline

O atributo `style` aplica estilo a uma única tag, no formato `propriedade: valor;`.

```html
<h1 style="color: white; background-color: darkblue;">Aprendendo Web Design</h1>

<div style="width: 300px; height: 150px; background-color: lightgray;">
  <p style="color: gray;">Texto dentro da caixa.</p>
</div>

<img src="paisagem.png" alt="Montanhas ao lado de um rio" style="width: 200px;">
```

Propriedades mais usadas:

| Propriedade | O que controla | Exemplo |
|---|---|---|
| `color` | Cor do texto | `color: red;` |
| `background-color` | Cor de fundo | `background-color: #f0f0f0;` |
| `width` | Largura | `width: 300px;` |
| `height` | Altura | `height: 150px;` |
| `font-size` | Tamanho da letra | `font-size: 20px;` |
| `text-align` | Alinhamento do texto | `text-align: center;` |
| `border` | Borda | `border: 2px solid black;` |

Cores podem ser escritas por nome (`red`), em hexadecimal (`#ff0000`) ou em `rgb(255, 0, 0)`.

Limitação: o estilo vale só para aquela tag. Para dez parágrafos iguais, seria preciso repetir o `style` dez vezes.

---

## Tag `<style>`

Reúne o estilo da página em um só lugar, dentro do `<head>`. Em vez de repetir o `style` em cada tag, escrevemos um **seletor** seguido das regras entre chaves.

```html
<head>
  <title>Minha primeira página</title>
  <style>
    h1 {
      color: white;
      background-color: darkblue;
    }

    p {
      color: gray;
      font-size: 18px;
    }

    .caixa {
      width: 300px;
      background-color: lightgray;
    }

    #destaque {
      color: red;
    }
  </style>
</head>
<body>
  <h1>Aprendendo Web Design</h1>
  <div class="caixa">
    <p>Todo parágrafo recebe o mesmo estilo.</p>
    <p id="destaque">Este tem uma cor própria.</p>
  </div>
</body>
```

| Seletor | Escrita | Atinge |
|---|---|---|
| Tag | `p { }` | Todas as tags `<p>` |
| Classe | `.caixa { }` | Todos os elementos com `class="caixa"` |
| Id | `#destaque { }` | O único elemento com `id="destaque"` |

Use classe para estilos reutilizáveis e id para um elemento único.

---

## Arquivo CSS externo

Com `<link rel="stylesheet">` o estilo sai da página e vai para um arquivo `.css`, que pode ser compartilhado por várias páginas.

**estilo.css**

```css
h1 {
  color: white;
  background-color: darkblue;
}

p {
  color: gray;
}
```

**index.html**

```html
<head>
  <title>Minha primeira página</title>
  <link rel="icon" href="icone.png">
  <link rel="stylesheet" href="estilo.css">
</head>
```

O `href` é o caminho do arquivo CSS. No arquivo `.css` não se escreve `<style>`, apenas as regras.

---

## Qual forma usar

| Forma | Onde fica | Quando usar |
|---|---|---|
| Inline | No atributo `style` da tag | Ajuste rápido em um único elemento |
| Tag `<style>` | No `<head>` da página | Página única ou testes |
| `<link rel="stylesheet">` | Arquivo `.css` separado | Projetos reais com mais de uma página |

Se as formas conflitarem, o inline vence a tag `<style>` e o arquivo externo.

---

## Margin, padding e outras propriedades

Todo elemento é uma caixa com quatro camadas:

```
┌───────────── margin ─────────────┐
│  ┌────────── border ──────────┐  │
│  │  ┌─────── padding ──────┐  │  │
│  │  │       conteúdo       │  │  │
│  │  └──────────────────────┘  │  │
│  └────────────────────────────┘  │
└──────────────────────────────────┘
```

| Propriedade | O que faz |
|---|---|
| `margin` | Espaço **fora** da borda, afastando o elemento dos vizinhos |
| `padding` | Espaço **dentro** da borda, afastando o conteúdo da borda |
| `border` | Linha ao redor do elemento |
| `border-radius` | Arredonda os cantos |
| `font-family` | Fonte do texto |
| `font-weight` | Espessura da letra (`bold`) |
| `text-align` | Alinhamento horizontal do texto |
| `display` | Como o elemento se comporta no fluxo (`block`, `inline`, `flex`) |

```css
.caixa {
  width: 300px;
  margin: 20px;
  padding: 15px;
  border: 2px solid darkblue;
  border-radius: 10px;
  background-color: lightgray;
}
```

Com um valor (`margin: 20px;`) todos os lados recebem o mesmo espaço. Para lados específicos: `margin-top`, `margin-right`, `margin-bottom`, `margin-left`. O mesmo vale para `padding`.

Para centralizar uma caixa com largura definida, use `margin: 0 auto;`.

---

## Exercício

Crie `index.html` e `estilo.css` na mesma pasta com:

1. `<title>` e ícone definidos no `<head>`.
2. Um `<h1>` com fundo e cor de texto diferentes.
3. Uma `<div>` com a classe `caixa`, contendo dois `<p>` (um com `<strong>`) e uma `<img>` com `alt`.
4. A classe `caixa` com `width`, `margin`, `padding`, `border` e `border-radius`.
5. Um ajuste inline em um dos parágrafos, só para ver o inline prevalecer.
