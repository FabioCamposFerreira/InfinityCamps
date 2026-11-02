# Componentes UI (Design System)

Esta pasta contém componentes genéricos e reutilizáveis que formam o design system da aplicação.

## Componentes disponíveis

### Button.astro
Botão com variações de estilo e tamanho.

**Props:**
- `variant?: 'primary' | 'secondary' | 'ghost' | 'danger'` - Estilo do botão
- `size?: 'sm' | 'md' | 'lg'` - Tamanho do botão
- `disabled?: boolean` - Desabilita o botão
- `type?: 'button' | 'submit' | 'reset'` - Tipo do botão
- `onClick?: string` - Handler de clique (inline)
- `class?: string` - Classes extras
- `id?: string` - ID do elemento
- `ariaLabel?: string` - Label para acessibilidade
- `ariaPressed?: boolean` - Estado pressed para toggle buttons
- `ariaControls?: string` - ID do elemento controlado

**Uso:**
```astro
<Button variant="primary" size="md">Salvar</Button>
<Button variant="ghost" size="sm">Cancelar</Button>
<Button variant="danger" type="button">Excluir</Button>
```

### Input.astro
Campo de input com suporte a validação.

**Props:**
- `type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'` - Tipo do input
- `name?: string` - Nome do campo
- `id?: string` - ID do elemento
- `placeholder?: string` - Placeholder
- `value?: string` - Valor inicial
- `disabled?: boolean` - Desabilita o input
- `required?: boolean` - Campo obrigatório
- `autocomplete?: string` - Autocomplete
- `ariaLabel?: string` - Label para acessibilidade
- `error?: string` - Mensagem de erro (exibe validação)
- `class?: string` - Classes extras

**Uso:**
```astro
<Input type="email" name="email" placeholder="seu@email.com" />
<Input type="password" name="password" error="Senha inválida" />
```

### Card.astro
Container card com variações de padding e comportamento hover.

**Props:**
- `padding?: 'none' | 'sm' | 'md' | 'lg'` - Padding interno
- `hoverable?: boolean` - Efeito hover com cursor pointer
- `bordered?: boolean` - Exibe borda
- `class?: string` - Classes extras

**Uso:**
```astro
<Card padding="md" hoverable>
  <h2>Título</h2>
  <p>Conteúdo</p>
</Card>
```

### Alert.astro
Alerta de feedback com variantes de tipo.

**Props:**
- `variant?: 'success' | 'error' | 'warning' | 'info'` - Tipo do alerta
- `dismissible?: boolean` - Botão de fechar
- `id?: string` - ID do elemento
- `role?: string` - Role ARIA (padrão: 'alert')
- `ariaLive?: string` - aria-live (padrão: 'polite')
- `hidden?: boolean` - Estado inicial oculto

**Uso:**
```astro
<Alert variant="error" dismissible>
  Ocorreu um erro ao salvar.
</Alert>
<Alert variant="success">
  Salvo com sucesso!
</Alert>
```

### Modal.astro
Modal/dialog com backdrop e controle de fechamento.

**Props:**
- `id: string` - ID obrigatório para controle via JS
- `title?: string` - Título do modal
- `open?: boolean` - Estado inicial aberto
- `size?: 'sm' | 'md' | 'lg' | 'xl'` - Tamanho do modal
- `closeOnEscape?: boolean` - Fecha ao pressionar ESC
- `closeOnBackdrop?: boolean` - Fecha ao clicar fora

**Métodos via JavaScript:**
- `modal.open()` - Abre o modal
- `modal.close()` - Fecha o modal

**Uso:**
```astro
<Modal id="confirm-modal" title="Confirmar" size="md">
  <p>Tem certeza que deseja continuar?</p>
  <Button onClick="document.getElementById('confirm-modal').close()">Cancelar</Button>
  <Button variant="primary">Confirmar</Button>
</Modal>

<script>
  const modal = document.getElementById('confirm-modal');
  modal.open();
</script>
```

### Breadcrumb.astro
Navegação estrutural (breadcrumbs).

**Props:**
- `items?: BreadcrumbItem[]` - Array de itens iniciais
- `ariaLabel?: string` - Label ARIA (padrão: 'Navegação estrutural')

**Tipo BreadcrumbItem:**
```typescript
{
  label: string;
  href?: string;
}
```

**Método via JavaScript:**
- `breadcrumb.setItems(items: BreadcrumbItem[])` - Atualiza os itens

**Uso:**
```astro
<Breadcrumb items={[
  { label: 'Home', href: '/' },
  { label: 'Cursos', href: '/courses' },
  { label: 'Curso Atual' }
]} />
```

### Toast.astro
Container de notificações/toasts com auto-dismiss.

**Props:**
- `id?: string` - ID do container (padrão: 'toast-container')
- `variant?: 'success' | 'error' | 'warning' | 'info'` - Variant padrão
- `position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'` - Posição
- `duration?: number` - Duração em ms (padrão: 5000)
- `title?: string` - Título padrão

**Métodos via JavaScript:**
- `toast.show({ message, variant, title, duration })` - Exibe toast
- `toast.dismiss(toastElement)` - Fecha toast específico
- `toast.clear()` - Limpa todos os toasts

**Uso:**
```astro
<Toast id="toast-container" position="top-right" />

<script>
  const toast = document.getElementById('toast-container');
  toast.show({ message: 'Salvo com sucesso!', variant: 'success' });
  toast.show({ 
    message: 'Erro ao salvar', 
    variant: 'error', 
    title: 'Erro',
    duration: 10000 
  });
</script>
```

### ModuleNode.astro
Nodo circular para representar módulos no metro map (design de trilho/trem).

**Props:**
- `title: string` - Título do módulo
- `description: string` - Descrição do módulo
- `icon?: string` - URL do ícone (opcional)
- `number: string` - Número do módulo (ex: "0_1", "01")
- `status?: 'locked' | 'available' | 'in-progress' | 'completed'` - Status do módulo
- `color?: string` - Cor do nodo (padrão: '#666')
- `onClick?: string` - Handler de clique

**Uso:**
```astro
<ModuleNode
  title="HTML e CSS"
  description="Aprenda a estruturar páginas..."
  number="0_1"
  status="in-progress"
  color="#00d4ff"
  onClick="window.location.href='/module/html-css'"
/>
```

### TrackLine.astro
Linha de conexão entre módulos (trilho do metro map).

**Props:**
- `color?: string` - Cor da linha (padrão: '#666')
- `width?: number` - Espessura da linha em px (padrão: 4)
- `curve?: 'none' | 'top' | 'bottom' | 'both'` - Tipo de curva
- `animated?: boolean` - Animação de brilho
- `progress?: number` - Progresso da linha 0-100 (padrão: 100)

**Uso:**
```astro
<TrackLine color="#00d4ff" width={4} progress={75} animated={true} />
```

### ModuleMap.astro
Container principal do metro map com layout de módulos conectados.

**Props:**
- `modules: ModuleItem[]` - Array de módulos
- `layout?: 'horizontal' | 'vertical' | 'grid'` - Layout do mapa (padrão: 'horizontal')
- `showProgress?: boolean` - Exibir trem de progresso no topo (padrão: true)
- `overallProgress?: number` - Progresso geral 0-100 (padrão: 0)

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
<ModuleMap
  modules={[
    {
      id: 'html-css',
      title: 'HTML e CSS',
      description: 'Aprenda a estruturar páginas...',
      number: '0_1',
      status: 'completed',
      color: '#00d4ff',
      link: '/module/html-css'
    },
    {
      id: 'python',
      title: 'Python',
      description: 'Estude os fundamentos...',
      number: '01',
      status: 'in-progress',
      color: '#ffd700',
      link: '/module/python'
    }
  ]}
  layout="horizontal"
  showProgress={true}
  overallProgress={50}
/>
```

### ProgressTrain.astro
Trem animado de progresso (usado no topo do metro map).

**Props:**
- `progress: number` - Progresso 0-100
- `color?: string` - Cor do trem (padrão: '#00d4ff')
- `icon?: string` - Ícone do trem (padrão: '🚂')
- `size?: 'sm' | 'md' | 'lg'` - Tamanho (padrão: 'md')

**Uso:**
```astro
<ProgressTrain progress={75} color="#00d4ff" icon="🚂" size="md" />
```

## Padrão de desenvolvimento

Novos componentes UI devem:
1. Ser genéricos e reutilizáveis em qualquer contexto
2. Aceitar props flexíveis para customização
3. Usar variáveis CSS para cores e estilos
4. Ser acessíveis (ARIA attributes)
5. Incluir estilos scoped no bloco `<style>`
6. Ser documentados com exemplos de uso

## Variáveis CSS esperadas

Os componentes usam as seguintes variáveis CSS (definir no :root ou no componente):

```css
--accent: #0066cc;
--accent-hover: #0052a3;
--surface: #fff;
--surface-hover: #f5f5f5;
--surface-disabled: #f5f5f5;
--ink: #1d3557;
--muted: #666;
--border: #e0e0e0;
```
