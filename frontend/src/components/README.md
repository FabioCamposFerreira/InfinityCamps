# Componentes Astro

Esta pasta contém os componentes visuais do projeto, seguindo o padrão arquitetural de componentização via Astro.

## Estrutura

- **`ui/`** - Componentes genéricos do design system (Button, Input, Card, Alert, Modal, Breadcrumb, Toast, ModuleNode, TrackLine, ModuleMap, ProgressTrain)
- **Componentes específicos** - Componentes da aplicação que usam os genéricos (AppHeader, etc)

## Terminologia

- **Trail (Trilha)** = Curso principal (ex: "Web Full Stack")
- **Module (Módulo)** = Seção do curso (ex: "HTML e CSS", "Python", "React", "Bootstrap")
- **Chapter (Capítulo)** = Conteúdo específico dentro de cada módulo

## Componentes do Design System (ui/)

Veja `ui/README.md` para documentação completa dos componentes genéricos:

- **Button** - Botões com variantes e tamanhos
- **Input** - Campos de input com validação
- **Card** - Containers card com variações
- **Alert** - Alertas de feedback
- **Modal** - Diálogos modais
- **Breadcrumb** - Navegação estrutural
- **Toast** - Notificações/toasts

## Componentes Específicos da Aplicação

### AppHeader.astro
Header da aplicação com:
- Logo "InfinityCamps"
- Seletor de tema (claro/escuro/cinza/automático)
- Exibição de nome do usuário autenticado
- Link para administração (visível apenas para admins)
- Botão de logout
- Link de login/voltar (visível para usuários anônimos)

**Props:**
- `page?: string` - Identificador da página atual (ex: 'catalog', 'login', 'course')

**Uso:**
```astro
---
import AppHeader from './components/AppHeader.astro';
---

<AppHeader page="catalog" />
```

### PendingAccountList.astro
Lista de contas pendentes de aprovação para administradores. Usa Card e Button genéricos.

**Uso:**
```astro
---
import PendingAccountList from './components/PendingAccountList.astro';
---

<PendingAccountList />
```

### ModuleList.astro
Lista de módulos com design de metro map (trilho/trem). Usa ModuleMap do design system.

**Props:**
- `items?: ModuleItem[]` - Array de módulos
- `layout?: 'horizontal' | 'vertical' | 'grid'` - Layout do mapa
- `showProgress?: boolean` - Exibir trem de progresso
- `overallProgress?: number` - Progresso geral 0-100

**Tipo ModuleItem:**
```typescript
{
  id: string;
  title: string;
  description: string;
  icon?: string;
  number: string;
  status?: 'locked' | 'available' | 'in-progress' | 'completed';
  color?: string;
  link?: string;
}
```

**Uso:**
```astro
---
import ModuleList from './components/ModuleList.astro';
---

<ModuleList
  items={modules}
  layout="horizontal"
  showProgress={true}
  overallProgress={50}
/>
```

### ChapterControls.astro
Controles de navegação entre capítulos (já existente).

## Padrão de desenvolvimento

### Componentes genéricos (ui/)
1. Ser genéricos e reutilizáveis em qualquer contexto
2. Aceitar props flexíveis para customização
3. Usar variáveis CSS para cores e estilos
4. Ser acessíveis (ARIA attributes)
5. Incluir estilos scoped no bloco `<style>`
6. Ser documentados com exemplos de uso

### Componentes específicos
1. Compor usando os componentes genéricos do design system
2. Ser criados como arquivos `.astro` nesta pasta
3. Usar TypeScript para interfaces quando necessário
4. Incluir estilos via `<style>` scoped
5. Manter scripts client-side leves no bloco `<script>`
6. Ser documentados com este padrão de README

## Integração com páginas

Para usar um componente em uma página Astro:
```astro
---
import Button from '../components/ui/Button.astro';
import Card from '../components/ui/Card.astro';
---

<Card padding="md">
  <h2>Título</h2>
  <Button variant="primary">Ação</Button>
</Card>
```

## Scripts utilitários

Scripts não-visuais (como `login-redirect.js`) permanecem em `frontend/public` quando não são componentes visuais.
