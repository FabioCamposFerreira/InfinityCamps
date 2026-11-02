## Regras Principais

- Siga estritamente as restrições do projeto: HTML/CSS/JavaScript puros no client-side, com **Astro** como padrão de estrutura e componentização; não sugerir bibliotecas externas sem justificativa clara.
- Prefira soluções leves, offline-first e mobile-first.
- Evite mudanças massivas não solicitadas no repositório; proponha alterações pequenas e justificadas.
- Quando gerar código, produza fragmentos prontos para rodar localmente e explique brevemente como testar.
- Lei e siga as regras de ??
- Estrutura de pastas em ??, sempre deixeo atualizado, não mude a estrutura sem ordem
- Concentre a componentização visual em **Astro**. Novos componentes de interface devem nascer como arquivos `.astro`; evite criar novos componentes visuais em `frontend/public/components`.
- Use JavaScript nativo apenas para comportamento client-side, utilitários e integrações leves. Quando necessário, mantenha esse código desacoplado da marcação visual do componente Astro.
- **Regra de componentes:** Criar componentes genéricos (Button, Input, Card, Alert, Modal, Header, etc) que podem ser reutilizados em qualquer parte da aplicação. Componentes específicos do domínio devem ser compostos usando os genéricos.
- Usar estes componenstes genericos dentro de componestes especificos. Usar regra se um pegado do codigo se repete mais de uma vez, compoentizar ele
- Coloque o capitulo .md na pasta do capitulo. Exemplo: learn/trilja/modulo/capitulo/chapter.md


## Copiar corrigir o Desing/CSS
- Ao adaptar uma página com base em um HTML/MHTML de referência, use o CSS e o design visual como referência. Preserve o conteúdo original e não use o da referencia; altere o HTML deste projeto somente quando o usuário pedir ou quando a funcionalidade exigir.
- Não copie textos, cursos ou outros dados do HTML de referência para o InfinityCamps. A referência orienta a aparência, não o conteúdo do produto.

## Erros comuns a evitar

- Não modificar componentes existentes, seu conteúdo ou comportamento sem que o usuário peça explicitamente na conversa. Se a alteração solicitada puder ser feita por CSS ou configuração, preservar o componente.
- Não manter duas arquiteturas de componentização em paralelo como padrão. Se houver UI reutilizável nova, preferir Astro em vez de ampliar a árvore de `customElements` em `frontend/public/components`.
- Não exibir na interface textos técnicos ou instruções internas que o usuário final não precisa ver, como caminhos de arquivos, nomes de manifestos, detalhes de servidor, mensagens de depuração ou stack traces.
- Registrar detalhes técnicos no console/logs para diagnóstico. Na interface, usar mensagens breves, claras e orientadas ao usuário.
- Não tentar centralizar toda a configuração em `.env`: variáveis locais e segredos devem usar o mecanismo de ambiente apropriado; bindings e recursos do Cloudflare, como D1, continuam declarados na configuração do Wrangler.
- nÃO PODE CRIAR PASTA DOVS NA RAIZ DO PROJETO ela deve ficar dentro da pasta insumos
- Não pode crilocar o capitulo em learn/trilja/modulo/capitulo/01/chapter.md