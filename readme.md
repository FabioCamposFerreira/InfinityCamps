# InfinityCamps — Workers + Astro (desenvolvimento local)

O projeto tem duas partes:

- `workers/` — API em Cloudflare Workers (auth, admin, exercícios, progresso, submissões), com D1 como banco.
- `frontend/` — site em Astro. As páginas ficam em `frontend/src/pages`, os componentes em
  `frontend/src/components` e os assets públicos em `frontend/public` (apenas `styles.css` e `sw.js`).
  Os `.html` antigos já foram removidos do projeto.

## Início rápido

Pré-requisitos: Node.js 20+ e npm.

No Windows, dê dois cliques em `iniciar.cmd`. Ele instala as dependências (raiz e `workers/`),
cria `workers/.dev.vars` a partir de `workers/.dev.vars.example` quando necessário e roda
`npm run dev`. Em qualquer sistema, o comando equivalente é:

```bash
npm run dev
```

O launcher (`scripts/dev.js`) aplica `db/schema.sql` no D1 local e sobe:

- API (Wrangler): <http://localhost:8787>
- Site (Astro): <http://localhost:3000>

As variáveis de `workers/.dev.vars` são repassadas tanto ao Wrangler quanto ao processo do Astro
(que precisa de `JWT_SECRET` para validar a sessão em `/learn/*`).

Segredos locais ficam em `workers/.dev.vars`, que é ignorado pelo Git. Para produção, configure os
segredos no Cloudflare/Wrangler e informe o `database_id` real da D1 em `workers/wrangler.toml` —
não use `.dev.vars` nem `.env` para segredos de produção.

## Páginas e rotas

| Rota | Descrição |
| --- | --- |
| `/` | Catálogo de trilhas (consome `/api/courses.json`) |
| `/<trilha>` | Trilha e seus módulos — ex.: `/web-full-stack` (exige sessão aprovada) |
| `/<trilha>/<módulo>` | Capítulos empilhados, com sidebar de capítulos e seções — ex.: `/web-full-stack/html-e-css` (exige sessão aprovada) |
| `/<trilha>/<módulo>#capitulo-01` | Mesmo módulo, posicionado no capítulo (deep link) |
| `/login`, `/signup` | Entrar / criar conta |
| `/auth` | Escolha entre entrar e criar conta |
| `/admin` | Aprovação de contas (somente `role: admin`) |
| `/learn/*` | Conteúdo dos cursos, servido da pasta `Learn/` |

`/api/auth`, `/api/admin`, `/api/submissions`, `/api/exercises` e `/api/progress` são encaminhados
para o Worker (porta 8787) pelo proxy do Astro em desenvolvimento. `/api/courses.json`,
`/api/courses/:slug/subcourses.json` e `/api/courses/:slug/:module/chapters.json` são servidos pelo
próprio Astro, lendo os `course.json` e os capítulos em
`Learn/`. O sufixo `.json` evita o conflito, no build estático, entre o arquivo `/api/courses` e o
diretório `/api/courses/` usado pela rota de subcursos.

As rotas antigas continuam funcionando por redirecionamento: `/course?course=<slug>` vai para
`/<trilha>` e `/chapter?course=<slug>&module=<slug>[&chapter=<id>]` vai para
`/<trilha>/<módulo>#capitulo-<id>`.

Em `/learn/*`, apenas as capas (`cover.*`) são públicas; o restante exige o cookie
`infinity_session` com um JWT válido. Essa proteção existe no servidor de desenvolvimento do Astro
e **ainda não tem equivalente na publicação estática** — veja "Pendências" abaixo.

## Conteúdo dos capítulos

Cada capítulo é **um único arquivo `chapter.md`** dentro da pasta numerada do capítulo (por exemplo, `01/chapter.md`, `02/chapter.md`), localizada na pasta do módulo:

```
Learn/WebFullStack/
├─ course.json                      ← trilha (slug: web-full-stack)
├─ 02 Introdução a HTML e CSS/
│  ├─ course.json                   ← módulo (slug: html-e-css)
│  ├─ cover.svg
│  ├─ 01/chapter.md                 ← 1 arquivo .md por pasta
│  └─ 02/chapter.md
└─ 03 Projeto Prático: Patos Hoje/
   ├─ course.json
   ├─ index.html                    ← HTML final do projeto prático
   ├─ apostila.md                   ← texto unificado da apostila
   └─ 01/chapter.md até 23/chapter.md
```

O `chapter.md` começa com front-matter:

```md
---
title: Criar o arquivo HTML
type: hands-on   # theory | hands-on | exercise
duration: 3      # minutos (opcional)
---

Conteúdo em markdown…
```

O `slug` da trilha e do módulo vem do campo `"slug"` do manifesto (ex.: `"slug": "web-full-stack"`)
e, quando ausente, do nome da pasta. É ele que forma a URL.

A pasta (`01`, `02`, `03`…) é a ordem **e** a identidade do capítulo: é o número que aparece na
sidebar e na URL (`?chapter=02`). Pasta sem `chapter.md` ou sem `title` no front-matter é ignorada.
O título pode mudar à vontade — o arquivo continua `chapter.md` e o progresso não se perde.

A página `/chapter` descobre esses capítulos em `frontend/src/lib/server/chapters.js`, expõe só os
metadados em `/api/courses/:slug/:module/chapters.json` e busca o conteúdo em `/learn/*` no
navegador — assim o texto do curso não vai parar no HTML estático.

O progresso do aluno é gravado por `curso/módulo/capítulo` (por exemplo
`webfullstack/0-1-html-e-css/02`), então o capítulo 01 de um módulo não se confunde com o capítulo 01
de outro.

Blocos especiais do conteúdo: `:::exercicio`, `:::dica` e `:::resposta` (esta última vira um
`<details>` fechado). Tabelas no formato pipe (`| a | b |` com a linha `|---|---|`) são
renderizadas como tabela de verdade. O renderer monta o HTML com `createElement`/`textContent`,
sem `innerHTML`.

Blocos de código são realçados conforme a linguagem da cerca (`html`, `css`, `js`/`json`), com
realce próprio em `frontend/src/lib/client/highlight.js` — sem biblioteca externa. Não existe botão
de copiar. Para perfil **aluno**, o conteúdo do capítulo não é selecionável e copiar, recortar,
arrastar e o menu de contexto são bloqueados; **admin** mantém o comportamento normal. Isso é uma
barreira de interface: o texto continua acessível pelo inspetor do navegador.

Imagens e links relativos são resolvidos a partir da pasta do capítulo: `imagens/foto.png` dentro de
`01/chapter.md` aponta para `/learn/<curso>/<módulo>/01/imagens/foto.png`. Se o arquivo não existir,
a imagem vira um marcador com o texto alternativo, sem ícone quebrado.

Antes de renderizar, o texto é validado (`validateMarkdown`, em
`frontend/src/lib/client/markdown.js`):

- **Erro** — front-matter não fechado, bloco de código ou `:::` sem fechamento, capítulo sem
  conteúdo. O capítulo **não** é exibido: no lugar do texto aparece um aviso e o título continua
  visível. Todos os erros vão para o console com o número da linha.
- **Aviso** — negrito sem par, link malformado, título que pula de nível, `:::` desconhecido. O
  capítulo é exibido normalmente e os avisos também vão para o console.

Para conferir os capítulos pelo terminal, sem abrir o navegador:

```bash
npm run chapters:check
```

Para dividir uma apostila antiga (com seções `##`) em capítulos numerados:

```bash
node scripts/split-chapters.mjs "Learn/<curso>/<módulo>/apostila.md" "Learn/<curso>/<módulo>" --force
```


## Banco local

```bash
# aplica db/schema.sql no D1 local (rodado automaticamente por npm run dev)
npm run db:local --prefix workers

# aplica o schema no D1 da Cloudflare
wrangler d1 execute --binding DB --file ./db/schema.sql
```

`workers/src/infra/d1-client.js` espera um binding D1 chamado `DB`. O envio de e-mail em
`workers/src/infra/email-notifier.js` é um stub.

## Testes

```bash
npm test          # testes de API (tests/run-tests.js) com um D1 em memória
npx playwright test  # smoke tests de interface; sobe o Astro automaticamente
```

Os testes de interface (`tests/ui.spec.js`) usam <http://localhost:3000> por padrão (defina
`BASE_URL` para apontar para outro endereço) e simulam as rotas `/api/*` do Worker com
`page.route`, então não precisam do Wrangler rodando.

## Pendências conhecidas

- A proteção de `/learn/*` só existe no middleware de desenvolvimento do Astro. Ao publicar o site
  como estático no Cloudflare Pages, será preciso uma Function/Worker com a mesma verificação.
- No detalhe do curso (`/course`), somente o primeiro módulo aparece como disponível e os demais
  como bloqueados: ainda não há leitura de progresso por módulo para destravá-los.
