# 🚚 Task.md: App de Monitoramento de Clima para Logística
## Passo-a-Passo Completo com React + Node (2 horas de aula)

---

## FASE 1: SETUP DO PROJETO (15 minutos)

### Passo 1.1: Verificar Instalação do Node.js

Abra o terminal/prompt de comando e verifique se Node.js está instalado:

```bash
node --version
npm --version
```

**Esperado:**
```
v18.0.0 (ou superior)
9.0.0 (ou superior)
```

Se não tiver, baixe em: https://nodejs.org (versão LTS)

---

### Passo 1.2: Criar Projeto React com Create React App

Execute este comando no terminal:

```bash
npx create-react-app weather-logistics
```

**O que acontece:**
- `npx` executa um comando npm sem instalar globalmente
- `create-react-app` cria a estrutura padrão React
- `weather-logistics` é o nome da pasta do projeto
- Leva ~2-3 minutos (depende da internet)

**Esperado ao final:**
```
Happy hacking!
```

---

### Passo 1.3: Entrar na Pasta do Projeto

```bash
cd weather-logistics
```

Agora sua linha de comando deve mostrar algo como:
```
C:\Users\seu-usuario\weather-logistics>
```

---

### Passo 1.4: Instalar Dependências Necessárias

```bash
npm install axios bootstrap react-icons
```

**O que cada uma faz:**

| Dependência | Função |
|-------------|--------|
| `axios` | Fazer requisições HTTP para a API de clima |
| `bootstrap` | Biblioteca CSS para estilizar de forma profissional |
| `react-icons` | Ícones (nuvem, chuva, sol, alerta, etc) |

**Tempo:** ~1 minuto

---

### Passo 1.5: Verificar Estrutura de Pastas Criada

Execute:
```bash
npm start
```

Isso abre o app em `http://localhost:3000` automaticamente. Você deve ver a tela padrão do React.

**Estrutura de pastas será:**
```
weather-logistics/
├── src/
│   ├── App.js          ← Componente principal
│   ├── App.css         ← Estilos do App
│   ├── index.js        ← Entrada da aplicação
│   └── index.css       ← Estilos globais
├── public/
│   └── index.html      ← HTML base
├── package.json        ← Dependências
└── node_modules/       ← Código das bibliotecas (não editar)
```

**⏸️ PAUSA: Deixe o `npm start` rodando. Ele monitora mudanças automaticamente.**

---

## FASE 2: ESTRUTURA E COMPONENTES (30 minutos)

### Conceito Teórico: O que é um Componente?

Um **componente** é uma função JavaScript que retorna JSX (HTML dentro de JS).

```javascript
// Componente simples
function MeuBotao() {
  return <button>Clique em mim</button>;
}
```

**Por que componentizar?**
- ✅ Reutilizar código
- ✅ Cada componente tem responsabilidade única
- ✅ Código mais legível e organizado
- ✅ Fácil de testar

---

### Passo 2.1: Criar Pasta de Componentes

Na pasta `src/`, crie uma pasta chamada `components`:

```bash
mkdir src/components
```

Sua estrutura ficará:
```
src/
├── components/      ← NOVA PASTA
├── App.js
├── App.css
└── index.js
```

---

### Passo 2.2: Criar Componente `CidadeCard.jsx`

Crie um arquivo `src/components/CidadeCard.jsx`:

```javascript
import { Cloud, CloudRain, AlertCircle, CheckCircle } from 'react-icons/fa';

/**
 * Componente CidadeCard
 * Exibe informações de clima de uma cidade
 * 
 * Props recebidas:
 * - cidade: nome da cidade
 * - temperatura: número com temperatura
 * - condicao: string como "Chuva Pesada"
 * - precipitacao: número de 0-100 (%)
 * - nivelAlerta: "verde", "amarelo" ou "vermelho"
 */
export default function CidadeCard({ 
  cidade, 
  temperatura, 
  condicao, 
  precipitacao, 
  nivelAlerta 
}) {
  
  // Função que muda a cor do card baseado no alerta
  const obterCorAlerta = () => {
    switch(nivelAlerta) {
      case 'vermelho':
        return 'border-danger';  // Bootstrap: borda vermelha
      case 'amarelo':
        return 'border-warning'; // Bootstrap: borda amarela
      default:
        return 'border-success'; // Bootstrap: borda verde
    }
  };

  // Função que escolhe ícone baseado na condição
  const obterIcone = () => {
    if (condicao.includes('Chuva')) {
      return <CloudRain size={40} className="text-primary" />;
    }
    return <Cloud size={40} className="text-secondary" />;
  };

  // Função que escolhe mensagem de alerta
  const obterMensagemAlerta = () => {
    switch(nivelAlerta) {
      case 'vermelho':
        return '⚠️ ALERTA: Risco alto de atraso';
      case 'amarelo':
        return '⚠️ AMARELO: Monitore a situação';
      default:
        return '✅ VERDE: Seguro para entrega';
    }
  };

  return (
    <div className={`card mb-3 border-3 ${obterCorAlerta()}`}>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center">
          
          {/* Coluna esquerda: Ícone + Cidade */}
          <div>
            {obterIcone()}
            <h5 className="card-title mt-2">{cidade}</h5>
          </div>

          {/* Coluna direita: Dados */}
          <div className="text-end">
            <h3 className="mb-0">{temperatura}°C</h3>
            <p className="text-muted mb-2">{condicao}</p>
            <small className="text-secondary">
              Precipitação: {precipitacao}%
            </small>
          </div>
        </div>

        {/* Alerta na parte inferior */}
        <div className="mt-3">
          <p className="mb-0 small">
            {obterMensagemAlerta()}
          </p>
        </div>
      </div>
    </div>
  );
}
```

**Conceitos Introduzidos:**

| Conceito | Explicação |
|----------|-----------|
| **Props** | Dados passados do componente pai (App) para o filho (CidadeCard). São como argumentos de função. |
| **Desestruturação** | `{ cidade, temperatura, ... }` pega propriedades específicas |
| **Ternário** | `condicao ? "sim" : "não"` — decisão em uma linha |
| **map()** | Não vimos aqui, mas veremos depois para listar múltiplos cards |

---

### Passo 2.3: Criar Componente `BotaoAdicionarCidade.jsx`

Crie `src/components/BotaoAdicionarCidade.jsx`:

```javascript
export default function BotaoAdicionarCidade({ onClick }) {
  return (
    <button 
      className="btn btn-primary btn-lg w-100 mb-4"
      onClick={onClick}
    >
      + Adicionar Cidade
    </button>
  );
}
```

**Conceitos:**
- `onClick` é como passamos uma **função** como prop
- `className` é o equivalente de `class` em JSX (porque `class` é palavra reservada em JS)
- `w-100` do Bootstrap = "width: 100%"
- `btn btn-primary` = estilo de botão azul do Bootstrap

---

### Passo 2.4: Criar Componente `InputCidade.jsx`

Crie `src/components/InputCidade.jsx`:

```javascript
import { useState } from 'react';

/**
 * Componente InputCidade
 * Campo de entrada para digitar nome da cidade
 * 
 * Props:
 * - onAdicionar: função chamada quando clica em "Buscar"
 * - onFechar: função para fechar o input
 */
export default function InputCidade({ onAdicionar, onFechar }) {
  
  // State: armazena o que o usuário digita
  const [nomeCidade, setNomeCidade] = useState('');

  // Quando clica em "Buscar"
  const handleBuscar = () => {
    if (nomeCidade.trim() === '') {
      alert('Digite o nome de uma cidade');
      return;
    }
    // Chama a função do pai e passa o nome da cidade
    onAdicionar(nomeCidade);
    setNomeCidade(''); // Limpa o input
  };

  // Enter também busca
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleBuscar();
    }
  };

  return (
    <div className="card mb-4 bg-light">
      <div className="card-body">
        <h5 className="card-title">Adicionar Nova Cidade</h5>
        
        <div className="mb-3">
          <input
            type="text"
            className="form-control form-control-lg"
            placeholder="Ex: São Paulo, Rio de Janeiro"
            value={nomeCidade}
            onChange={(e) => setNomeCidade(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>

        <div className="d-flex gap-2">
          <button 
            className="btn btn-success flex-grow-1"
            onClick={handleBuscar}
          >
            Buscar
          </button>
          <button 
            className="btn btn-secondary"
            onClick={onFechar}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
```

**Novos Conceitos:**

| Conceito | Explicação |
|----------|-----------|
| **useState** | Hook para criar estado (dados que mudam). Sintaxe: `const [valor, setValor] = useState(inicial)` |
| **onChange** | Evento que dispara quando usuário digita. `e.target.value` captura o texto |
| **onKeyPress** | Detecta quando usuário aperta uma tecla (usamos para Enter buscar) |
| **trim()** | Remove espaços em branco. `"   ".trim() === ""` é true |

---

## FASE 3: ESTRUTURA DE DADOS E API (30 minutos)

### Passo 3.1: Entender a API OpenWeatherMap

Vamos usar a API gratuita: https://openweathermap.org/api

**Você precisa:**
1. Ir em: https://openweathermap.org/api
2. Clicar em "Sign Up"
3. Criar conta gratuita
4. Copiar sua **API Key** (na aba Account)

**Exemplo de requisição:**
```
https://api.openweathermap.org/data/2.5/weather?q=SaoPaulo&units=metric&appid=SUA_API_KEY_AQUI
```

**Resposta da API (formato JSON):**
```json
{
  "main": {
    "temp": 28.5,
    "humidity": 65
  },
  "weather": [
    {
      "main": "Clouds",
      "description": "Céu nublado"
    }
  ],
  "clouds": {
    "all": 85
  }
}
```

---

### Passo 3.2: Criar Serviço de API

Crie `src/services/weatherService.js`:

```javascript
import axios from 'axios';

// SUBSTITUIR POR SUA CHAVE!
const API_KEY = 'SUA_API_KEY_DO_OPENWEATHER';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

/**
 * Busca dados de clima de uma cidade
 * 
 * Parâmetros:
 * - cidade: string com nome da cidade
 * 
 * Retorna:
 * {
 *   cidade: "São Paulo",
 *   temperatura: 28,
 *   condicao: "Nublado",
 *   precipitacao: 45,
 *   umidade: 65
 * }
 */
export async function buscarClimaCidade(cidade) {
  try {
    // Faz requisição GET para a API
    const response = await axios.get(BASE_URL, {
      params: {
        q: cidade,              // q = query (nome da cidade)
        units: 'metric',        // unidades em Celsius
        lang: 'pt_br',          // resposta em português
        appid: API_KEY
      }
    });

    // Extrai dados da resposta
    const dados = response.data;

    // Transforma em formato que nosso app usa
    return {
      cidade: dados.name,
      temperatura: Math.round(dados.main.temp),
      condicao: dados.weather[0].main,
      precipitacao: dados.clouds.all,  // % de cobertura de nuvens
      umidade: dados.main.humidity
    };

  } catch (erro) {
    console.error('Erro ao buscar clima:', erro);
    throw new Error(`Não consegui encontrar a cidade: ${cidade}`);
  }
}

/**
 * Define nível de alerta baseado nas condições
 * 
 * Lógica:
 * - VERMELHO: Chuva pesada (precipitação > 70%)
 * - AMARELO: Chuva moderada (precipitação 40-70%)
 * - VERDE: Seguro (precipitação < 40%)
 */
export function definirNivelAlerta(precipitacao, condicao) {
  if (precipitacao > 70 || condicao.includes('Rain')) {
    return 'vermelho';
  }
  if (precipitacao > 40) {
    return 'amarelo';
  }
  return 'verde';
}
```

**Conceitos:**

| Conceito | Explicação |
|----------|-----------|
| **async/await** | Espera a resposta da API antes de continuar. Sem isso, pega dados antes de chegar |
| **axios.get()** | Faz requisição HTTP GET (buscar dados) |
| **try/catch** | Se der erro, não quebra a aplicação. Captura o erro |
| **params** | Parâmetros da URL (q, units, lang, appid) |

---

## FASE 4: APP PRINCIPAL COM LÓGICA (30 minutos)

### Passo 4.1: Reescrever App.js com Toda Lógica

Abra `src/App.js` e **substitua tudo** por:

```javascript
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Importar componentes
import CidadeCard from './components/CidadeCard';
import BotaoAdicionarCidade from './components/BotaoAdicionarCidade';
import InputCidade from './components/InputCidade';

// Importar serviço de API
import { buscarClimaCidade, definirNivelAlerta } from './services/weatherService';

export default function App() {
  
  // ===== STATE =====
  // Lista de cidades monitoradas
  const [cidades, setCidades] = useState([]);
  
  // Mostrar ou esconder o input de adicionar cidade
  const [mostraInput, setMostraInput] = useState(false);
  
  // Mostrar mensagem de carregamento
  const [carregando, setCarregando] = useState(false);
  
  // Mostrar mensagem de erro
  const [erro, setErro] = useState('');

  // ===== FUNÇÕES =====

  /**
   * Adiciona nova cidade à lista
   * Faz a requisição à API de clima
   */
  const handleAdicionarCidade = async (nomeCidade) => {
    setCarregando(true);
    setErro('');

    try {
      // Busca dados de clima da API
      const dadosClima = await buscarClimaCidade(nomeCidade);
      
      // Define nível de alerta
      const nivelAlerta = definirNivelAlerta(
        dadosClima.precipitacao,
        dadosClima.condicao
      );

      // Cria objeto completo da cidade
      const novaCidade = {
        id: Date.now(), // ID único usando timestamp
        ...dadosClima,
        nivelAlerta
      };

      // Adiciona à lista
      setCidades([...cidades, novaCidade]);
      
      // Fecha o input
      setMostraInput(false);

    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  };

  /**
   * Remove uma cidade da lista
   */
  const handleRemoverCidade = (idCidade) => {
    const novaLista = cidades.filter(cidade => cidade.id !== idCidade);
    setCidades(novaLista);
  };

  // ===== RENDER =====

  return (
    <div className="app-container">
      
      {/* Header */}
      <header className="bg-primary text-white py-4 mb-4">
        <div className="container">
          <h1>🚚 Dashboard de Monitoramento de Clima</h1>
          <p className="mb-0">Logística & Entregas</p>
        </div>
      </header>

      {/* Container principal */}
      <div className="container">
        
        {/* Botão para adicionar cidade */}
        {!mostraInput && (
          <BotaoAdicionarCidade 
            onClick={() => setMostraInput(true)} 
          />
        )}

        {/* Input para adicionar cidade (aparece quando clica no botão) */}
        {mostraInput && (
          <InputCidade 
            onAdicionar={handleAdicionarCidade}
            onFechar={() => setMostraInput(false)}
          />
        )}

        {/* Mostrar carregamento */}
        {carregando && (
          <div className="alert alert-info">
            ⏳ Buscando dados de clima...
          </div>
        )}

        {/* Mostrar erro */}
        {erro && (
          <div className="alert alert-danger" role="alert">
            ❌ {erro}
          </div>
        )}

        {/* Lista de cidades */}
        <div className="cidades-lista">
          {cidades.length === 0 ? (
            <div className="alert alert-secondary text-center">
              Nenhuma cidade adicionada ainda. Clique em "Adicionar Cidade" para começar.
            </div>
          ) : (
            cidades.map(cidade => (
              <div key={cidade.id} className="position-relative">
                <CidadeCard 
                  cidade={cidade.cidade}
                  temperatura={cidade.temperatura}
                  condicao={cidade.condicao}
                  precipitacao={cidade.precipitacao}
                  nivelAlerta={cidade.nivelAlerta}
                />
                
                {/* Botão de remover */}
                <button
                  className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2"
                  onClick={() => handleRemoverCidade(cidade.id)}
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
```

**Conceitos Mais Avançados Aqui:**

| Conceito | Explicação |
|----------|-----------|
| **State múltiplo** | Vários `useState` para controlar diferentes dados |
| **.map()** | Transforma cada cidade em um card JSX |
| **key prop** | Necessária em listas. Ajuda React a rastrear elementos |
| **async/await** | Espera a API responder antes de fazer algo |
| **Spread operator `...`** | `{ ...objeto, novaPropriedade }` mescla objetos |
| **Renderização condicional** | `{condicao && <JSX>}` mostra só se condicao for true |
| **filter()** | Remove um item da array (`id !== idCidade`) |

---

### Passo 4.2: Adicionar Estilos em App.css

Abra `src/App.css` e **substitua tudo** por:

```css
/* Import do Bootstrap é feito no App.js */

.app-container {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.cidades-lista {
  margin-bottom: 40px;
}

/* Estilo para os cards */
.card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

/* Responsivo para celular */
@media (max-width: 768px) {
  .container {
    padding: 0 15px;
  }
  
  h1 {
    font-size: 1.5rem;
  }
}
```

---

## FASE 5: AJUSTES FINAIS E TESTES (15 minutos)

### Passo 5.1: Importar Bootstrap Corretamente

Abra `src/index.css` e garanta que tem:

```css
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
    'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
}
```

---

### Passo 5.2: Testar a Aplicação

1. **Substitua `SUA_API_KEY_DO_OPENWEATHER`** em `src/services/weatherService.js` pela sua chave real

2. **Recarregue o navegador** (Ctrl+R ou Cmd+R)

3. **Teste os fluxos:**

| Ação | Resultado Esperado |
|------|-------------------|
| Clika "Adicionar Cidade" | Input aparece |
| Digita "São Paulo" e clica "Buscar" | Card com clima de São Paulo aparece |
| Digita "Rio de Janeiro" | Card com clima do Rio aparece |
| Clica X em um card | City é removida |
| Digita "CidadeInvalida123" | Erro: "Não consegui encontrar..." |

---

### Passo 5.3: Criar Pasta de Serviços

Se ainda não criou, faça:

```bash
mkdir src/services
```

Coloque o arquivo `weatherService.js` lá (passo 3.2)

---

## ESTRUTURA FINAL

```
weather-logistics/
├── src/
│   ├── components/
│   │   ├── CidadeCard.jsx          ← Card com dados da cidade
│   │   ├── BotaoAdicionarCidade.jsx ← Botão azul
│   │   └── InputCidade.jsx         ← Input para digitar cidade
│   ├── services/
│   │   └── weatherService.js       ← Requisição à API
│   ├── App.js                      ← Componente principal (TODA LÓGICA AQUI)
│   ├── App.css                     ← Estilos customizados
│   ├── index.js
│   └── index.css
├── public/
│   └── index.html
├── package.json                    ← axios, bootstrap, react-icons
└── .gitignore
```

---

## 🎓 CONCEITOS REACT APRENDIDOS NESTA AULA

### Básico
- ✅ **Componentes** — funções que retornam JSX
- ✅ **Props** — dados passados de pai para filho
- ✅ **JSX** — HTML dentro de JavaScript

### Estado e Interatividade
- ✅ **useState** — criar estado (dados que mudam)
- ✅ **Eventos** — onClick, onChange, onKeyPress
- ✅ **Renderização Condicional** — `{condicao && <JSX>}`

### Arrays e Listas
- ✅ **.map()** — renderizar múltiplos elementos
- ✅ **.filter()** — remover item da lista
- ✅ **key prop** — identificar elementos em listas

### Requisições e Async
- ✅ **axios.get()** — buscar dados de API
- ✅ **async/await** — esperar resposta da API
- ✅ **try/catch** — tratar erros

---

## 🚀 DESAFIOS PARA CASA

### Desafio 1: Salvar Cidades no localStorage
Quando o usuário adiciona uma cidade, salve em `localStorage` para que a lista persista se ele fechar o navegador.

```javascript
// Dica: use useEffect
useEffect(() => {
  localStorage.setItem('cidades', JSON.stringify(cidades));
}, [cidades]);
```

---

### Desafio 2: Adicionar Previsão de 5 Dias
Use a API `forecast` do OpenWeather para mostrar clima dos próximos 5 dias.

```
endpoint: https://api.openweathermap.org/data/2.5/forecast
```

---

### Desafio 3: Ordenar Cidades por Nível de Alerta
Mostre primeiro as cidades com alerta VERMELHO, depois AMARELO, depois VERDE.

```javascript
// Dica: use .sort()
const cidadesOrdenadas = cidades.sort((a, b) => {
  const ordem = { vermelho: 0, amarelo: 1, verde: 2 };
  return ordem[a.nivelAlerta] - ordem[b.nivelAlerta];
});
```

---

### Desafio 4: Notificação com SweetAlert
Quando um alerta VERMELHO é adicionado, mostre um pop-up alertando.

```bash
npm install sweetalert2
```

---

### Desafio 5: API Real com Dados Históricos
Use `localStorage` para salvar histórico de clima e mostrar gráfico de temperatura nos últimos 7 dias.

```bash
npm install recharts
```

---

## 🐛 TROUBLESHOOTING

### Problema: "API Key não é válida"
**Solução:** Copie a chave corretamente do site OpenWeather (aba Account → API Keys)

### Problema: "axios is not defined"
**Solução:** Verifique se rodou `npm install axios`

### Problema: "Module not found: 'bootstrap'"
**Solução:** Verifique se rodou `npm install bootstrap`

### Problema: Componente não aparece
**Solução:** Verifique se:
1. Está importando corretamente (`import ... from './components/...'`)
2. Usando o nome correto do componente
3. Não tem erro de sintaxe (console do navegador mostra erros)

### Problema: App fica "carregando" infinitamente
**Solução:** Verifique se a API Key está correta

---

## ✅ CHECKLIST FINAL

Antes de terminar, verifique:

- [ ] Node.js instalado (`node --version`)
- [ ] Projeto criado (`weather-logistics` pasta existe)
- [ ] Dependências instaladas (`node_modules` pasta existe)
- [ ] Bootstrap importado em `App.js`
- [ ] Componentes criados (CidadeCard, InputCidade, BotaoAdicionarCidade)
- [ ] Service weatherService.js criado
- [ ] API Key adicionada em weatherService.js
- [ ] App.js escrito com toda lógica
- [ ] App.css com estilos
- [ ] Página carrega sem erros (`npm start`)
- [ ] Consegue adicionar uma cidade e ver o clima

---

## 📚 Próximas Aulas Recomendadas

1. **useEffect** — para buscar dados automaticamente ao carregar a página
2. **Context API** — para passar dados sem prop drilling
3. **Deploy** — colocar app online (Netlify, Vercel)
4. **Testes** — usar Jest e React Testing Library

---

**Boa codificação! 🚀 Qualquer dúvida, consulte o console do navegador (F12).**