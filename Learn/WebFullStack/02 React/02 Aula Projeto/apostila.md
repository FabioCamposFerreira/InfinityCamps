# Projeto React: Monitoramento de Clima 🚚

---

# Objetivo do Projeto

Monitororar o tempo das cidades para ajudar entregadores a escolher a melhor rota de entrega.

---

# Criando o Projeto

- `npm create vite@latest` cria um projeto React do zero.
- A flag `--template react` define que usaremos React (não Vue, Svelte etc).

```bash
node -v
npm create vite@latest meu-app-react -- --template react
cd meu-app-react
mkdir src/components
mkdir src/services
npm install axios
npm install bootstrap
```

---

# Criando o Projeto — Exercício

- Execute os comandos acima no seu terminal.
- Ao final, rode `npm run dev` e abra o navegador em `http://localhost:5173`.
- O que você vê na tela? *(não precisa escrever código, só observar)*

---

# Criando o Projeto — Resposta

- Você deve ver a **tela padrão do Vite + React**: um contador e os logos do Vite e do React.
- Isso confirma que o projeto foi criado com sucesso.
- A partir daqui, vamos **substituir** esse conteúdo pelo nosso dashboard.

---

# Props — Passando Dados para Componentes

- **Props** são como argumentos de uma função — você passa dados de fora para dentro do componente.
- O componente `CidadeCard` recebe 5 props: `cidade`, `temperatura`, `condicao`, `precipitacao`, `nivelAlerta`.

```jsx
// Quem usa o componente passa os dados:
<CidadeCard 
  cidade="São Paulo"
  temperatura={28}
  condicao="Chuva"
  precipitacao={75}
  nivelAlerta="vermelho"
/>

// O componente recebe e usa:
export default function CidadeCard({ cidade, temperatura }) {
  return <h5>{cidade} — {temperatura}°C</h5>;
}
```

---

# Props — Exercício

- Observe o componente `BotaoAdicionarCidade` abaixo.
- Qual prop ele recebe? O que ela faz?

```jsx
export default function BotaoAdicionarCidade({ onClick }) {
  return (
    <button onClick={onClick}>
      + Adicionar Cidade
    </button>
  );
}
```

---

# Props — Resposta

- Ele recebe a prop `onClick` — uma **função**.
- Quando o botão é clicado, ele chama essa função que veio de fora.
- Isso permite que o **pai** (App.jsx) decida o que acontece ao clicar.

```jsx
// No App.jsx:
<BotaoAdicionarCidade 
  onClick={() => setMostraInput(true)} 
/>
// ↑ O pai diz: "ao clicar, mostre o input"
```

---

# `useState` — Guardando Estado na Tela

- `useState` guarda um valor que, **quando muda, atualiza a tela automaticamente**.
- Pense como uma variável "viva" — diferente de uma variável normal que o React ignora.

```jsx
import { useState } from 'react';

const [mostraInput, setMostraInput] = useState(false);
//     ↑ valor atual   ↑ função p/ mudar   ↑ valor inicial

// Para mudar:
setMostraInput(true);  // tela atualiza sozinha
```

---

# `useState` — Exercício

- No `App.jsx` temos 4 estados. Ligue cada estado ao seu propósito:

<section style="display: flex">
<article style="flex: 1;padding:15px">

**Estado**

1. `cidades`
2. `mostraInput`
3. `carregando`
4. `erro`

</article>
<article style="flex: 1;padding:15px">

**Propósito**

a. Exibir mensagem de erro  
b. Lista de cidades monitoradas  
c. Mostrar/esconder o campo de texto  
d. Exibir "Buscando dados..."

</article>
</article>
</section>

---

# `useState` — Resposta

| Estado | Propósito |
|---|---|
| `cidades` | b — Lista de cidades monitoradas |
| `mostraInput` | c — Mostrar/esconder o campo de texto |
| `carregando` | d — Exibir "Buscando dados..." |
| `erro` | a — Exibir mensagem de erro |

```jsx
const [cidades, setCidades] = useState([]);
const [mostraInput, setMostraInput] = useState(false);
const [carregando, setCarregando] = useState(false);
const [erro, setErro] = useState('');
```

---

# Renderização Condicional

- Mostrar um elemento **só quando uma condição for verdadeira**.
- Usamos `&&` (E lógico): se a esquerda for `true`, renderiza a direita.

```jsx
// Mostra o input SOMENTE se mostraInput for true
{mostraInput && (
  <InputCidade 
    onAdicionar={handleAdicionarCidade}
    onFechar={() => setMostraInput(false)}
  />
)}

// Mostra o botão SOMENTE se mostraInput for false
{!mostraInput && (
  <BotaoAdicionarCidade onClick={() => setMostraInput(true)} />
)}
```

---

# Renderização Condicional — Exercício

- O que aparece na tela quando `carregando` é `true` e `erro` é `"Cidade não encontrada"`?

```jsx
{carregando && <div className="alert alert-info">⏳ Buscando...</div>}
{erro && <div className="alert alert-danger">❌ {erro}</div>}
```

---

# Renderização Condicional — Resposta

<section style="display: flex">
<article style="flex: 1;padding:15px">

**Situação**

- `carregando = true`
- `erro = "Cidade não encontrada"`

</article>
<article style="flex: 1;padding:15px">

**O que aparece**

- ✅ `⏳ Buscando...` (aparece)
- ✅ `❌ Cidade não encontrada` (aparece)
- Ambos ao mesmo tempo, pois são condições independentes.

</article>
</section>

---

# Chamada à API com `async/await`

- `async/await` é a forma moderna de esperar uma resposta da internet sem travar o app.
- `try/catch` captura erros (cidade inválida, sem conexão etc).

```javascript
// src/services/weatherService.js
export async function buscarClimaCidade(cidade) {
  try {
    const response = await axios.get(BASE_URL, {
      params: { q: cidade, units: 'metric', appid: API_KEY }
    });
    return {
      cidade: response.data.name,
      temperatura: Math.round(response.data.main.temp),
    };
  } catch (erro) {
    throw new Error(`Cidade não encontrada: ${cidade}`);
  }
}
```

---

# Chamada à API — Exercício

- A função `definirNivelAlerta` abaixo recebe `precipitacao` (0–100).
- Qual nível é retornado para `precipitacao = 55`?

```javascript
export function definirNivelAlerta(precipitacao, condicao) {
  if (precipitacao > 70 || condicao.includes('Rain')) return 'vermelho';
  if (precipitacao > 40) return 'amarelo';
  return 'verde';
}
```

---

# Chamada à API — Resposta

```javascript
definirNivelAlerta(55, 'Clouds')
// precipitacao (55) > 70? NÃO
// condicao inclui 'Rain'? NÃO
// precipitacao (55) > 40? SIM ✅

// Retorna: 'amarelo'
```

- O card será exibido com `border-warning` (borda amarela).
- Mensagem: `⚠️ AMARELO: Monitore a situação`

---

# `.map()` — Renderizando Listas

- `.map()` percorre um array e transforma cada item em um elemento JSX.
- Cada elemento precisa de uma prop `key` única — usamos o `id` da cidade.

```jsx
{cidades.map(cidade => (
  <div key={cidade.id}>
    <CidadeCard 
      cidade={cidade.cidade}
      temperatura={cidade.temperatura}
      condicao={cidade.condicao}
      precipitacao={cidade.precipitacao}
      nivelAlerta={cidade.nivelAlerta}
    />
  </div>
))}
```

---

# `.map()` — Exercício

- Dado o array abaixo, escreva o `.map()` que exibe `<p>Nome: X</p>` para cada cidade.

```javascript
const cidades = [
  { id: 1, cidade: 'São Paulo' },
  { id: 2, cidade: 'Belo Horizonte' },
];
```

---

# `.map()` — Resposta

```jsx
{cidades.map(cidade => (
  <p key={cidade.id}>Nome: {cidade.cidade}</p>
))}
```

Resultado na tela:
```
Nome: São Paulo
Nome: Belo Horizonte
```

- Sem `key`, o React não consegue identificar qual item mudou — sempre inclua.

---

# Adicionando e Removendo do Estado

- Para **adicionar** ao array: `[...cidades, novaCidade]` (spread + novo item).
- Para **remover**: `.filter()` — retorna um novo array sem o item removido.

```javascript
// Adicionar
setCidades([...cidades, novaCidade]);

// Remover (filtra fora o id clicado)
const handleRemoverCidade = (idCidade) => {
  const novaLista = cidades.filter(cidade => cidade.id !== idCidade);
  setCidades(novaLista);
};
```

---

# Adicionando e Removendo — Exercício

- `cidades` tem 3 itens com ids `10`, `20`, `30`.
- O usuário clica em remover na cidade de id `20`.
- Qual array fica no estado depois?

---

# Adicionando e Removendo — Resposta

```javascript
// Antes:
[{ id: 10 }, { id: 20 }, { id: 30 }]

// filter(cidade => cidade.id !== 20)
// id 10 !== 20? SIM → fica ✅
// id 20 !== 20? NÃO → sai ❌
// id 30 !== 20? SIM → fica ✅

// Depois:
[{ id: 10 }, { id: 30 }]
```

---

# Fluxo Completo — Adicionar Cidade

- Juntando tudo: do clique do usuário até o card aparecer na tela.

<section style="display: flex">
<article style="flex: 1;padding:15px">

**Sequência**

1. Usuário clica em `+ Adicionar Cidade`
2. `setMostraInput(true)` → input aparece
3. Usuário digita "Curitiba" e clica Buscar
4. `handleAdicionarCidade("Curitiba")` é chamada
5. `setCarregando(true)` → spinner aparece
6. `buscarClimaCidade("Curitiba")` busca na API
7. `definirNivelAlerta(...)` classifica o alerta
8. `setCidades([...cidades, novaCidade])` → card aparece

</article>
<article style="flex: 1;padding:15px">

**Estados envolvidos**

1. —
2. `mostraInput = true`
3. —
4. —
5. `carregando = true`
6. —
7. —
8. `cidades` cresce +1  
   `carregando = false`  
   `mostraInput = false`

</article>
</section>

---

# Fluxo Completo — Exercício

- O que acontece se a cidade digitada **não existir** na API?
- Trace o fluxo a partir do passo 6 (chamada à API).

---

# Fluxo Completo — Resposta

```javascript
// Passo 6: API retorna erro (404)
// O catch é acionado:
catch (err) {
  setErro(err.message);  // ← "Cidade não encontrada: Xpto"
}

// finally sempre executa:
finally {
  setCarregando(false);  // ← spinner some
}
```

<section style="display: grid; grid-template-columns: 1fr 1fr; ">
<article style="padding:15px">

**Estado**

`erro`  
`carregando`  
`cidades`  
`mostraInput`

</article>
<article style="padding:15px">

**Valor**

`"Cidade não encontrada: Xpto"`  
`false`  
`[]` (não muda)  
`true` (input continua aberto)

</article>
<article style="padding:15px">

**O que aparece na tela**

`❌ Cidade não encontrada: Xpto`

</article>
<article style="padding:15px">

**O que NÃO aparece**

Nenhum card novo

</article>
</section>

---
# Atividade para Casa

Fazer o projeto do video:
https://youtu.be/YVEVrigByKY

# Punição

1- Responda por escrito em 3 linhas porque react é melhor que javascript puro.
2 - Responda por escrito em 3 linhas os arquivos iniciais de um projeto react e qual é sua função