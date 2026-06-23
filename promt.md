# PROMPT — GERADOR DE PLATAFORMA “ACADEMY CMS” BASEADA EM MARKDOWN

Crie uma plataforma web completa chamada “Academy CMS”, inspirada em:
- Mendix Academy
- Duolingo
- plataformas de documentação moderna
- learning platforms corporativas

A plataforma NÃO é focada em um tema específico.
Ela deve ser um CORE GENÉRICO de interface para aprendizado estruturado.

A plataforma deve permitir:
- criação de learn paths;
- organização hierárquica infinita controlada;
- renderização automática de conteúdo markdown;
- leitura contínua;
- exercícios;
- progressão visual;
- experiência gamificada minimalista.

---

# STACK OBRIGATÓRIA

Use SOMENTE:
- HTML puro
- CSS puro
- JavaScript puro

NÃO usar:
- React
- Vue
- Angular
- Bootstrap
- Tailwind
- jQuery
- frameworks externos

Objetivo:
- projeto extremamente leve;
- offline-first;
- mobile-fisrt;
- fácil manutenção;
- arquitetura educacional limpa.

---

# OBJETIVO PRINCIPAL

Criar uma experiência:
- rápida;
- extremamente intuitiva;
- minimalista;
- corporativa;
- gamificada de forma leve;
- otimizada para retenção;
- otimizada para leitura contínua.

---

# EXPERIÊNCIA DE LEITURA

Cada capítulo deve parecer uma “slide section”.

Cada capítulo:
- ocupa no mínimo 100vh;
- possui padding grande;
- possui largura máxima controlada;
- possui pouco texto;
- possui foco em escaneabilidade;
- possui blocos visuais separados;
- possui ritmo vertical fluido.

O usuário NÃO navega entre páginas.

O módulo inteiro é:
- UMA página contínua;
- com scroll vertical;
- capítulos empilhados;
- lazy loading;
- scroll semi-snap suave.

---

# ESTRUTURA HIERÁRQUICA

Estrutura recursiva:

- Trila
  - Trilha
    - Trilha
      - ...
        - Módulo
          - Capítulo

Numero de trilhas é indefinido
Permitir tópicos dentro de tópicos indefinidamente.

Exemplo:

- Notícias (seria uma trilha)
  - Esportes (seria uma trilha)
    - Futebol (seria uma trilha)
      - Mercado da Bola (seria uma trilha)
        - Transferências (seria um modulo)
          - Capítulo 

---

# Modulos

Estrutura ideal:

- Introdução curta (cápitulo leitura)
- Conceito 1 (cápitulo leitura)
- Hands-on (cápitulo passo a passo)
- Conceito 2 (cápitulo leitura)
- Hands-on (cápitulo passo a passo)
- ...
- Resumo (cápitulo leitura)
- Exercícios (cápitulo exercicios)


# TIPOS DE CAPÍTULO

Existem apenas três tipos:
  - Capítulo de leitura.
  - (cápitulo passo a passo)
  - (cápitulo exercicios)

Pode conter:
- markdown;
- imagens;
- vídeos;
- blocos de código;
- listas;
- tabelas;
- alertas;
- dicas;
- mermaid;
- componentes customizados.

O sistema deve:
- enumerar passos automaticamente;
- transformar blocos em checklist;
- mostrar progresso visual;
- destacar ações;
- permitir marcação visual de conclusão.

# LIMITES DE UX IMPORTANTES

Evitar:
- páginas enormes;
- textos gigantes;
- blocos longos;
- excesso de rolagem;
- múltiplos conceitos complexos no mesmo capítulo;
- sensação de documentação cansativa.

Cada capítulo deve:
- parecer rápido;
- gerar sensação constante de progresso.

---

# SIDEBAR

Sidebar fixa.

Pequena.
Compacta.
Sempre visível ou toggle.

Funções:
- progresso visual;
- navegação rápida;
- estado dos capítulos.

Estados:
- ✓ concluído
- → atual
- ○ não iniciado
- nada fia bloquado

Capítulos concluídos ficam verdes.

Marcação automática:
- quando usuário chega ao final do capítulo.

Persistência:
- LocalStorage.

---

# SCROLL

Implementar:
- scroll vertical contínuo;
- semi-snap suave;
- smooth scrolling;
- detecção de capítulo atual;
- atualização automática da sidebar.

Não usar:
- paginação;
- troca de página;
- modais;
- carrossel horizontal.

---

# SUPORTE OFFLINE

A plataforma deve funcionar offline.

Utilizar:
- cache local;
- service worker;
- localStorage.

O usuário deve conseguir:
- continuar estudando offline;
- manter progresso salvo localmente.

---

# MARKDOWN ENGINE

Criar um parser customizado.

O markdown deve suportar:
- markdown padrão;
- HTML inline controlado;
- componentes customizados.

Suportar:
- títulos;
- subtítulos;
- listas;
- código;
- imagens;
- vídeos;
- links;
- tabelas;
- mermaid;
- quotes;
- alertas;
- tabs;
- spoilers;
- checklists.

---

# SEGURANÇA

NÃO renderizar HTML arbitrário diretamente.

Criar:
- whitelist;
- sanitização;
- renderer controlado.

Evitar:
- XSS;
- quebra visual;
- CSS arbitrário.

---

# ESTRUTURA DOS ARQUIVOS MARKDOWN

Formato:

```md
---
title: Criando um botão
type: theory
duration: 5min
---

# Introdução

Texto.

## Conceito

Texto.

## Hands-on

STEP: Clique em "Novo"

STEP: Adicione um botão

## Código

```js
console.log("Hello")
```

## Exercícios

? Qual tag cria botão?

- div
- span
* button
- section
```

---

# SISTEMA DE EXERCÍCIOS

Tipos:
- múltipla escolha;
- quiz rápido.

Características:
- múltiplas tentativas;
- não revelar resposta correta;
- envio para API;
- feedback de porcentagem;
- progresso persistido.

---

# BACKEND

O backend NÃO deve ser foco principal.

Ele apenas:
- recebe respostas;
- salva respostas;
- calcula porcentagem;
- retorna score.

---

# ESTRUTURA DO BANCO

Tabela usuarios:
- id
- nome
- email

Tabela exercicios:
- id
- resposta_correta

Tabela usuario_exercicios:
- id
- id_usuario
- id_exercicio
- resposta_enviada
- data_envio

NÃO alterar essa estrutura.

---

# FLUXO DO BACKEND

Fluxo:

Usuário responde exercício
↓
Frontend envia:
- id_usuario
- id_exercicio
- resposta

↓
Backend salva tentativa
↓
Backend compara resposta
↓
Backend calcula:
- corretas
- total
- porcentagem

↓
Backend retorna:

{
  score: 80,
  correct: 4,
  total: 5
}

---

# LOCAL STORAGE

Salvar:
- módulo atual;
- capítulo atual;
- capítulos concluídos;
- quizzes respondidos;
- progresso;
- preferências visuais.

---

# EDITOR DO PROFESSOR

O editor deve priorizar:
- simplicidade;
- velocidade;
- facilidade de publicação.

Ideal:
- importação de arquivos markdown;
- preview automático;
- organização por pastas.

---

# ESTRUTURA DE PASTAS

academy/
│
├── index.html
├── learn-path.html
├── module.html
│
├── assets/
│   ├── css/
│   ├── js/
│   ├── icons/
│   └── images/
│
├── content/
│   ├── learn-paths/
│   │   ├── path-name/
│   │   │   ├── module-01/
│   │   │   │   ├── 01-introduction.md
│   │   │   │   ├── 02-theory.md
│   │   │   │   ├── 03-practice.md
│   │   │   │   └── 04-quiz.md
│
└── backend/

---

# ESTRUTURA DAS TELAS

## HOME
- trilhas;
- continuar estudando;
- progresso;
- badges.

## LEARN PATH
- módulos;
- progresso;
- descrição;
- certificação.

## MODULE VIEWER
Layout:
- sidebar fixa;
- conteúdo contínuo;
- capítulos verticais;
- progresso automático.

---

# VISUAL

Estilo:
- corporate academy;
- minimalista;
- moderno;
- profissional;
- limpo;
- foco em legibilidade.

Usar:
- espaçamento grande;
- sombras suaves;
- hierarquia tipográfica;
- animações discretas.

Evitar:
- visual gamer;
- excesso de cores;
- poluição visual;
- cards exagerados;
- glassmorphism excessivo;
- neon;
- gradients exagerados.

---

# PERFORMANCE

Prioridades:
- carregamento rápido;
- lazy loading;
- renderização incremental;
- mínimo JavaScript possível;
- mínimo repaint;
- alta fluidez.

---

# CHECKLIST DE REQUISITOS

A implementação DEVE cumprir:

✅ HTML/CSS/JS puro  
✅ Offline-first  
✅ Sidebar fixa  
✅ Scroll contínuo  
✅ Semi-snap suave  
✅ Lazy loading  
✅ Markdown customizado  
✅ Renderização segura  
✅ Múltiplas tentativas de quiz  
✅ LocalStorage  
✅ Progressão automática  
✅ Capítulos fullscreen  
✅ Corporate academy UI  
✅ Parser markdown customizado  
✅ Estrutura recursiva  
✅ Importação markdown  
✅ Exercícios no final  
✅ Hands-on enumerado automaticamente  
✅ Código somente visualização  
✅ Compatível mobile e desktop  
✅ Sem frameworks  
✅ Performance alta  
✅ Arquitetura modular  
✅ Fácil manutenção  

---

# PALAVRAS-CHAVE POSITIVAS

corporate academy  
minimal  
clean UI  
smooth scrolling  
learning experience  
documentation style  
educational platform  
modular  
fast  
offline-first 
mobile-fisrt 
markdown engine  
modern UX  
high readability  
micro-learning  
continuous scroll  
progress tracking  
sidebar navigation  
technical learning  
minimal distractions  

---

# PALAVRAS-CHAVE NEGATIVAS

no React  
no Bootstrap  
no Tailwind  
no giant pages  
no infinite text walls  
no heavy animations  
no gamification overload  
no cluttered UI  
no neon UI  
no excessive gradients  
no horizontal carousel  
no popup spam  
no iframe rendering  
no unsafe HTML rendering  
no page reload navigation  
no oversized cards  
no giant sidebars  
no visual pollution  

