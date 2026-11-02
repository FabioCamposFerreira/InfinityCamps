# Arquiteura

## Stack tecnológica — AVA

| Camada                    | Tecnologia                            | Por quê                                                                                  |
| ------------------------- | ------------------------------------- | ---------------------------------------------------------------------------------------- |
| Frontend                  | Astro (HTML/CSS/JS estático)          | Padrão de componentização, organização visual, velocidade de carregamento, manutenção                |
| PWA                       | Service Worker + Cache API            | Cache de assets (HTML/CSS/JS/imagens), padrão de PWA para funcionar offline              |
| Storage local             | IndexedDB (via lib `idb`)             | Cache/dados estruturados no navegador (histórico, atividades pendentes offline)          |
| Backend/API               | Cloudflare Workers                    | Edge, cold start quase zero, leve em RAM, bem documentado                                |
| Banco de dados            | Cloudflare D1 (SQLite)                | Serverless, mesma rede do Worker, free tier, bem documentado                             |
| Autenticação              | JWT + bcrypt (feito na mão no Worker) | Padrão clássico, sem dependência externa, IA erra pouco por ser bem conhecido            |
| Hospedagem                | Cloudflare Pages                      | CDN global grátis, mesmo ecossistema do Worker/D1 → menor latência                       |
| Preto total gasto | -                      | Neste projeto nenhuma tecologia para hospedar ou executar o site deve ser paga                     |


## Arquivos

- referencia de como deve ser a arganozação das pastas
 

### Insumos

materia de referencia para construção da aplicação e documentos gerados pela ia

### Frontend
`frontend/src/components` para componentes Astro, `frontend/src/layouts` p  ara layouts, `frontend/src/pages` para páginas e `frontend/public` apenas para assets públicos, 
C:\Users\campo\OneDrive\Documentos\GitHub\InfinityCamps\frontend\src\lib:??
C:\Users\campo\OneDrive\Documentos\GitHub\InfinityCamps\frontend\src\pages ??
### Beckend
??

### Learn

tem somente as pastas das trilhas
Exemplo

Learn/
  Trila1/
    ??.json
    .svg
    Modulo1/
      ??.json
      .svg
      Capitulo01/
        ??.json
        .svg
        chapter.md


#### Trilas
tem somente as pastas dos modulos

##### Modulos
tem somente as pastas dos capitulos

##### Capitulos
um unico chapter.md na raiz da pasta

### Arquiteture.md
esplicação da organização dos arquivos

### Agent.md
visão geral do projeto
### Todo.md
-lista de tarefas que devem ser compridas
### Rules.md
regras do projeto e o que não fazer mais





- Concentrar a componentização visual em `Astro`.
- Criar componentes genéricos e reutilizáveis (design system) em `frontend/src/components` como arquivos `.astro`.

- Estrutura de componentes:
  - `frontend/src/components/ui/` - Componentes genéricos do design system (Button, Input, Card, Alert, Modal, ModuleNode, TrackLine, ModuleMap, ProgressTrain, etc)
  - `frontend/src/components/` - Componentes específicos da aplicação (AppHeader, ModuleList, etc) que usam os genéricos
- Usar `frontend/src/layouts` para layouts compartilhados e `frontend/src/pages` para páginas.
- Reservar `frontend/public` para assets públicos, `Service Worker`, manifestos e arquivos que realmente precisem ser servidos sem processamento.
- Usar JavaScript nativo como apoio para comportamento client-side, sem transformá-lo em uma segunda arquitetura paralela de componentes.

## Estruturando o site
- O catálogo deve ser descoberto pelas pastas de curso em `Learn/`, lendo o `course.json` de cada pasta. Não manter uma lista de cursos fixa no HTML nem buscar os cursos no banco de dados.
- A página de um curso deve descobrir os subcursos pelas subpastas numeradas da pasta desse curso. Cada subpasta precisa começar com um prefixo numérico e conter um `course.json` válido; mostrar o prefixo numérico e ordenar os cards por ele.
- Mostrar apenas cursos com manifesto válido e campos obrigatórios disponíveis: título, descrição, imagem, link e acesso (`open` ou `locked`). Se a pasta, o manifesto ou algum campo obrigatório estiver ausente ou inválido, omitir esse curso.
- Cursos `locked` exigem login aprovado para abrir; cursos `open` podem ser acessados sem login.
