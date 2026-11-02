import { getMeta, getProgress, saveProgress, setMeta } from '../idb-wrapper.js';
import { checkAuth } from './auth-guard.js';
import { renderMarkdown } from './markdown.js';

// Controla a página de capítulo: uma página, capítulos empilhados, sidebar com
// status e liberação sequencial (o próximo capítulo abre ao concluir o atual).

const TYPE_LABELS = {
  theory: 'Leitura',
  'hands-on': 'Passo a passo',
  exercise: 'Exercício',
};

const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

function parseParams() {
  // Os slugs vêm do path, renderizados pelo Astro em data-*; o capítulo vem do hash.
  const root = document.querySelector('[data-course][data-module]');
  const clean = (value) => {
    const text = String(value ?? '').trim();
    if (!/^[a-z0-9-]+$/i.test(text)) return '';
    return text;
  };
  const hash = window.location.hash.replace(/^#/, '');
  const chapterId = hash.startsWith('capitulo-') ? hash.slice('capitulo-'.length) : hash;

  return {
    courseSlug: clean(root?.dataset.course),
    moduleSlug: clean(root?.dataset.module),
    chapterId: clean(chapterId),
  };
}

async function loadIndex(courseSlug, moduleSlug) {
  const url = `/api/courses/${encodeURIComponent(courseSlug)}/${encodeURIComponent(moduleSlug)}/chapters.json`;
  const response = await fetch(url, { cache: 'no-store' });
  if (response.status === 404) {
    console.warn(`A API não conhece este módulo: ${url}`);
    return null;
  }
  if (!response.ok) throw new Error(`chapters.json respondeu ${response.status}`);
  return response.json();
}

async function loadChapterMarkdown(url) {
  const response = await fetch(url, { cache: 'no-store', credentials: 'same-origin' });
  if (!response.ok) throw new Error(`conteúdo do capítulo respondeu ${response.status}`);

  // Se a sessão cair, o servidor de /learn/* redireciona para o login e o
  // fetch devolve HTML. Nesse caso não renderizamos nada do conteúdo.
  const contentType = response.headers.get('content-type') || '';
  if (/text\/html/i.test(contentType)) {
    const error = new Error('sessão expirada');
    error.code = 'session';
    throw error;
  }

  return response.text();
}

export async function initChapterPage() {
  const dom = {
    sidebar: document.getElementById('chapter-sidebar'),
    list: document.getElementById('chapter-list'),
    sidebarTitle: document.getElementById('chapter-sidebar-title'),
    progressFill: document.getElementById('chapter-progress-fill'),
    progressLabel: document.getElementById('chapter-progress-label'),
    stack: document.getElementById('chapter-stack'),
    loading: document.getElementById('chapter-loading'),
    alert: document.getElementById('chapter-alert'),
    breadcrumb: document.getElementById('breadcrumb'),
    toolbar: document.getElementById('chapter-toolbar'),
    position: document.getElementById('chapter-position'),
    slidePosition: document.getElementById('slide-position'),
    slidePrev: document.getElementById('slide-prev'),
    slideNext: document.getElementById('slide-next'),
    prev: document.getElementById('btn-prev'),
    mark: document.getElementById('btn-mark'),
    next: document.getElementById('btn-next'),
  };

  if (!dom.stack) return;

  const state = {
    courseSlug: '',
    moduleSlug: '',
    chapters: [],
    completed: new Set(),
    unlockedUpTo: 0,
    current: 0,
    busy: false,
    observer: null,
    headingObserver: null,
    currentHeading: null,
    slides: [],
    currentSlide: 0,
    slideObserver: null,
    gate: null,
  };

  function showAlert(message, variant = 'warning', link = null) {
    if (!dom.alert) return;
    dom.alert.className = `alert alert-${variant}`;
    dom.alert.replaceChildren(document.createTextNode(message));
    if (link) {
      const anchor = document.createElement('a');
      anchor.href = link.href;
      anchor.textContent = link.label;
      dom.alert.append(' ', anchor);
    }
    dom.alert.hidden = false;
  }

  function hideLoading() {
    if (dom.loading) dom.loading.hidden = true;
    if (dom.stack) dom.stack.hidden = false;
  }

  function renderEmpty(message, link) {
    hideLoading();
    const empty = document.createElement('p');
    empty.className = 'chapter-empty';
    empty.textContent = message;
    if (link) {
      empty.append(' ');
      const anchor = document.createElement('a');
      anchor.href = link.href;
      anchor.textContent = link.label;
      empty.append(anchor);
    }
    dom.stack.replaceChildren(empty);
    dom.toolbar?.setAttribute('hidden', '');
    dom.sidebar?.setAttribute('hidden', '');
  }

  function chapterById(id) {
    return state.chapters.find((chapter) => chapter.id === id) ?? null;
  }

  // A chave de progresso inclui curso e módulo: sem isso, o capítulo 01 de um
  // módulo apareceria concluído no capítulo 01 de outro.
  function progressKey(chapter) {
    return `${state.courseSlug}/${state.moduleSlug}/${chapter.id}`;
  }

  function maxViewedKey() {
    return `maxViewedIndex:${state.courseSlug}/${state.moduleSlug}`;
  }

  function sectionFor(index) {
    return dom.stack?.querySelector(`[data-index="${index}"]`) ?? null;
  }

  // Erros e avisos de formatação vão todos para o console, com a linha do arquivo.
  function reportFormatIssues(chapter, errors, warnings) {
    const label = `[capítulo ${chapter.id}]`;
    if (errors.length) {
      console.error(`${label} ${errors.length} erro(s) de formatação — capítulo não exibido.`);
    }
    for (const issue of errors) {
      console.error(`${label} linha ${issue.line}: ${issue.message} (${issue.code})`);
    }
    for (const issue of warnings) {
      console.warn(`${label} linha ${issue.line}: ${issue.message} (${issue.code})`);
    }
  }

  function buildFormatError() {
    const box = document.createElement('div');
    box.className = 'chapter-format-error';
    box.setAttribute('role', 'alert');

    const title = document.createElement('p');
    title.className = 'chapter-format-error-title';
    title.textContent = 'Não foi possível exibir este capítulo';

    const text = document.createElement('p');
    text.className = 'chapter-format-error-text';
    text.textContent = 'O conteúdo tem um problema de formatação e precisa ser corrigido.';

    box.append(title, text);
    return box;
  }

  function buildSection(chapter, index, markdown) {
    const section = document.createElement('section');
    section.className = 'chapter';
    section.id = `capitulo-${chapter.id}`;
    section.dataset.index = String(index);
    section.dataset.chapterId = chapter.id;
    section.setAttribute('aria-labelledby', `${chapter.id}-title`);

    const header = document.createElement('header');
    header.className = 'chapter-head';

    const eyebrow = document.createElement('p');
    eyebrow.className = 'chapter-eyebrow';
    eyebrow.textContent = `Capítulo ${chapter.number}`;

    const title = document.createElement('h1');
    title.className = 'chapter-title';
    title.id = `${chapter.id}-title`;
    title.tabIndex = -1;
    title.textContent = chapter.title;

    const meta = document.createElement('p');
    meta.className = 'chapter-meta';
    const metaParts = [TYPE_LABELS[chapter.type], chapter.duration ? `${chapter.duration} min` : ''].filter(Boolean);
    meta.textContent = metaParts.join(' · ');
    meta.hidden = metaParts.length === 0;

    header.append(eyebrow, title, meta);

    const { fragment, errors, warnings } = renderMarkdown(markdown, { baseUrl: chapter.contentUrl });
    if (errors.length || warnings.length) reportFormatIssues(chapter, errors, warnings);

    // Erro de formatação: o capítulo aparece, mas no lugar do conteúdo vai o aviso.
    if (errors.length) {
      section.dataset.formatError = 'true';
      section.append(header, buildFormatError());
      return section;
    }

    const content = document.createElement('div');
    content.className = 'chapter-content';
    content.append(fragment);

    // Cada título do conteúdo vira uma entrada da sidebar (nível 1 = filho direto).
    chapter.sections = collectSections(content, chapter, index);

    // O conteúdo é quebrado em slides: um por seção (##), com o header como capa.
    const slides = splitIntoSlides(content);
    const cover = document.createElement('div');
    cover.className = 'slide slide-cover';
    cover.append(header);
    content.replaceChildren(cover, ...slides);

    section.append(content);
    return section;
  }

  // Agrupa os nós do conteúdo em slides, começando um novo a cada título.
  function splitIntoSlides(content) {
    const slides = [];
    let copy = document.createElement('div');
    copy.className = 'slide-copy';
    let hasHeading = false;

    const flush = () => {
      if (!copy.childNodes.length) return;
      const slide = document.createElement('div');
      slide.className = 'slide';
      slide.append(copy);
      slides.push(slide);
    };

    for (const node of [...content.childNodes]) {
      // "---" do markdown era separador entre blocos; agora o slide já separa.
      if (node.nodeType === 1 && node.tagName === 'HR') continue;
      const isHeading = node.nodeType === 1 && /^H[234]$/.test(node.tagName);
      if (isHeading && hasHeading) {
        flush();
        copy = document.createElement('div');
        copy.className = 'slide-copy';
      }
      if (isHeading) hasHeading = true;
      copy.append(node);
    }
    flush();

    // Slide com imagem ganha a coluna da mídia (layout de duas colunas).
    for (const slide of slides) {
      const body = slide.querySelector('.slide-copy');
      if (!body) continue;
      const media = document.createElement('div');
      media.className = 'slide-media';
      for (const child of [...body.childNodes]) {
        const onlyImage =
          child.nodeType === 1 &&
          child.tagName === 'P' &&
          child.querySelector('img') &&
          !child.textContent.trim();
        if (child.nodeType === 1 && child.tagName === 'IMG') media.append(child);
        else if (onlyImage) {
          media.append(...child.childNodes);
          child.remove();
        }
      }
      if (media.childNodes.length) {
        slide.classList.add('has-media');
        slide.append(media);
      }
    }

    return slides;
  }

  function refreshSlides() {
    state.slides = [...dom.stack.querySelectorAll('.slide')];
    state.slides.forEach((slide, index) => {
      slide.dataset.slideIndex = String(index);
      state.slideObserver?.observe(slide);
    });
  }

  function goToSlide(index) {
    const slide = state.slides[index];
    if (!slide) return;
    slide.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    state.currentSlide = index;
    updateSlidePosition();
  }

  function updateSlidePosition() {
    if (!dom.slidePosition) return;
    const total = state.slides.length;
    dom.slidePosition.textContent = total ? `Slide ${Math.min(state.currentSlide + 1, total)} de ${total}` : '';
    dom.slidePosition.hidden = total === 0;
  }

  function collectSections(content, chapter, chapterIndex) {
    const sections = [];
    content.querySelectorAll('h2, h3, h4').forEach((heading, position) => {
      const id = `capitulo-${chapter.id}-s${position + 1}`;
      heading.id = id;
      heading.dataset.chapterIndex = String(chapterIndex);
      sections.push({
        id,
        title: heading.textContent.trim(),
        level: Number(heading.tagName.slice(1)),
      });
    });
    return sections;
  }

  function applyHeadingClasses() {
    if (!dom.list) return;
    dom.list.querySelectorAll('[data-heading-id]').forEach((link) => {
      const active = link.dataset.headingId === state.currentHeading;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }

  function setCurrentHeading(id) {
    if (state.currentHeading === id) return;
    state.currentHeading = id;
    applyHeadingClasses();
  }

  function goToHeading(id) {
    const heading = document.getElementById(id);
    if (!heading) return;
    heading.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    setCurrentHeading(id);
  }

  function observe(section) {
    if (!state.observer || !section) return;
    state.observer.observe(section);
  }

  function buildGate() {
    const gate = document.createElement('div');
    gate.className = 'chapter-gate';
    gate.id = 'chapter-gate';

    const icon = document.createElement('span');
    icon.className = 'chapter-gate-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = '🔒';

    const text = document.createElement('div');
    const title = document.createElement('p');
    title.className = 'chapter-gate-title';
    title.textContent = 'Próximo capítulo bloqueado';
    const description = document.createElement('p');
    description.className = 'chapter-gate-text';
    description.textContent = 'Conclua o capítulo atual para liberar a continuação.';
    text.append(title, description);

    gate.append(icon, text);
    return gate;
  }

  async function appendChapter(index) {
    const chapter = state.chapters[index];
    if (!chapter) return;
    const markdown = await loadChapterMarkdown(chapter.contentUrl);
    const section = buildSection(chapter, index, markdown);
    if (state.gate && state.gate.parentNode === dom.stack) dom.stack.insertBefore(section, state.gate);
    else dom.stack.append(section);
    observe(section);

    section.querySelectorAll('.chapter-content h2, .chapter-content h3, .chapter-content h4').forEach((heading) => {
      state.headingObserver?.observe(heading);
    });
    refreshSlides();
  }

  function renderSidebar() {
    if (!dom.list) return;
    const items = state.chapters.map((chapter, index) => {
      const item = document.createElement('li');
      item.className = 'chapter-item';

      const isCurrent = index === state.current;
      const isCompleted = state.completed.has(chapter.id);
      const isLocked = index > state.unlockedUpTo;

      item.className += isCurrent ? ' is-current' : '';
      item.className += isCompleted ? ' is-completed' : '';
      item.className += isLocked ? ' is-locked' : '';

      const link = document.createElement('a');
      link.className = 'chapter-link';
      link.href = `${window.location.pathname}#capitulo-${encodeURIComponent(chapter.id)}`;
      link.dataset.index = String(index);
      if (isCurrent) link.setAttribute('aria-current', 'step');
      if (isLocked) link.setAttribute('aria-disabled', 'true');

      const status = document.createElement('span');
      status.className = 'chapter-status';
      status.setAttribute('aria-hidden', 'true');
      status.textContent = isCompleted ? '✓' : isLocked ? '🔒' : isCurrent ? '→' : '○';

      const number = document.createElement('span');
      number.className = 'chapter-number';
      number.textContent = chapter.number;

      const label = document.createElement('span');
      label.className = 'chapter-label';
      label.textContent = chapter.title;

      if (isLocked) {
        const lockLabel = document.createElement('span');
        lockLabel.className = 'visually-hidden';
        lockLabel.textContent = ' (bloqueado)';
        label.append(lockLabel);
      }

      link.append(status, number, label);
      link.addEventListener('click', (event) => {
        event.preventDefault();
        if (isLocked) {
          showAlert('Conclua os capítulos anteriores para abrir este capítulo.', 'warning');
          return;
        }
        goTo(index);
      });

      item.append(link);

      const sections = Array.isArray(chapter.sections) ? chapter.sections : [];
      if (sections.length) {
        const sublist = document.createElement('ol');
        sublist.className = 'chapter-subsections';

        for (const sectionInfo of sections) {
          const subItem = document.createElement('li');
          const subLink = document.createElement('a');
          subLink.className = 'chapter-subsection';
          subLink.href = `#${sectionInfo.id}`;
          subLink.dataset.headingId = sectionInfo.id;
          subLink.dataset.level = String(sectionInfo.level);
          subLink.textContent = sectionInfo.title;
          subLink.addEventListener('click', (event) => {
            event.preventDefault();
            goToHeading(sectionInfo.id);
          });
          subItem.append(subLink);
          sublist.append(subItem);
        }

        item.append(sublist);
      }

      return item;
    });

    dom.list.replaceChildren(...items);
    applyHeadingClasses();
  }

  function updateProgress() {
    const done = state.completed.size;
    const total = state.chapters.length || 1;
    const percent = Math.round((done / total) * 100);
    if (dom.progressFill) dom.progressFill.style.width = `${percent}%`;
    if (dom.progressLabel) dom.progressLabel.textContent = `${done} de ${state.chapters.length} concluídos`;
  }

  function updateToolbar() {
    if (!dom.toolbar) return;
    const chapter = state.chapters[state.current];
    if (!chapter) return;

    const isLast = state.current === state.chapters.length - 1;
    const isCompleted = state.completed.has(chapter.id);
    const canAdvance = state.current < state.unlockedUpTo;

    if (dom.position) dom.position.textContent = `Capítulo ${state.current + 1} de ${state.chapters.length}`;
    if (dom.prev) dom.prev.disabled = state.current === 0;
    if (dom.mark) {
      dom.mark.disabled = isCompleted || state.busy;
      dom.mark.textContent = isCompleted ? 'Concluído ✓' : 'Marcar Concluído';
    }
    if (dom.next) {
      dom.next.disabled = !canAdvance && !isLast;
      dom.next.textContent = isLast ? 'Voltar ao curso' : 'Próximo →';
    }
  }

  function updateUrl() {
    const chapter = state.chapters[state.current];
    if (!chapter) return;
    // Uma URL canônica por módulo; o capítulo atual vira fragmento.
    window.history.replaceState(null, '', `${window.location.pathname}#capitulo-${chapter.id}`);
  }

  function setCurrent(index) {
    if (index === state.current) return;
    state.current = index;
    state.currentHeading = null;
    renderSidebar();
    updateToolbar();
    updateUrl();
  }

  function goTo(index, options = {}) {
    const section = sectionFor(index);
    if (!section) return;
    section.scrollIntoView({
      behavior: reduceMotion || options.instant ? 'auto' : 'smooth',
      block: 'start',
    });
    setCurrent(index);
    if (options.focus !== false) {
      section.querySelector('.chapter-title')?.focus({ preventScroll: true });
    }
  }

  async function syncProgress(chapter) {
    try {
      const token = localStorage.getItem('jwt');
      await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ chapter_id: progressKey(chapter), viewed: 1, completed: 1 }),
      });
    } catch (error) {
      console.warn('Não foi possível sincronizar o progresso:', error);
    }
  }

  async function completeCurrent() {
    if (state.busy) return;
    const index = state.current;
    const chapter = state.chapters[index];
    if (!chapter || state.completed.has(chapter.id)) return;

    state.busy = true;
    updateToolbar();

    try {
      await saveProgress(progressKey(chapter), { viewed: 1, completed: 1, updated_at: new Date().toISOString() });

      const stored = await getMeta(maxViewedKey());
      const currentMax = Number.isFinite(stored) ? stored : -1;
      if (index > currentMax) await setMeta(maxViewedKey(), index);

      state.completed.add(chapter.id);

      if (index === state.unlockedUpTo && state.unlockedUpTo < state.chapters.length - 1) {
        state.unlockedUpTo += 1;
        try {
          await appendChapter(state.unlockedUpTo);
        } catch (error) {
          console.error('Não foi possível carregar o próximo capítulo:', error);
          showAlert('O próximo capítulo não carregou. Recarregue a página para tentar de novo.', 'warning');
        }
        if (state.unlockedUpTo >= state.chapters.length - 1) {
          state.gate?.remove();
          state.gate = null;
        }
      }

      renderSidebar();
      updateProgress();
      updateToolbar();
      void syncProgress(chapter);
    } catch (error) {
      console.error('Não foi possível salvar o progresso:', error);
      showAlert('Não foi possível salvar seu progresso agora. Tente novamente.', 'error');
    } finally {
      state.busy = false;
      updateToolbar();
    }
  }

  // Aluno não seleciona nem copia o texto do curso. É uma barreira de
  // interface: o conteúdo continua acessível pelo inspetor e pelo HTML.
  function applyCopyProtection(enabled) {
    if (!enabled) return;
    document.body.dataset.copyProtection = 'on';

    const insideContent = (node) => Boolean(node && dom.stack?.contains(node));
    const selectionInsideContent = () => insideContent(document.getSelection()?.anchorNode);

    document.addEventListener('copy', (event) => {
      if (selectionInsideContent()) event.preventDefault();
    });

    document.addEventListener('cut', (event) => {
      if (selectionInsideContent()) event.preventDefault();
    });

    document.addEventListener('selectstart', (event) => {
      if (insideContent(event.target)) event.preventDefault();
    });

    document.addEventListener('contextmenu', (event) => {
      if (insideContent(event.target)) event.preventDefault();
    });

    document.addEventListener('dragstart', (event) => {
      if (insideContent(event.target)) event.preventDefault();
    });

    document.addEventListener('keydown', (event) => {
      if (!(event.ctrlKey || event.metaKey)) return;
      const key = String(event.key).toLowerCase();
      if (key !== 'c' && key !== 'x' && key !== 'a') return;
      if (key === 'a' || selectionInsideContent()) event.preventDefault();
    });
  }

  function bindKeyboard() {
    document.addEventListener('keydown', (event) => {
      const target = event.target;
      if (target instanceof HTMLElement && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      if (event.altKey || event.ctrlKey || event.metaKey) return;

      if (event.key === 'PageDown' || event.key === 'ArrowRight') {
        event.preventDefault();
        goToSlide(state.currentSlide + 1);
      } else if (event.key === 'PageUp' || event.key === 'ArrowLeft') {
        event.preventDefault();
        goToSlide(state.currentSlide - 1);
      }
    });
  }

  function bindToolbar() {
    dom.slidePrev?.addEventListener('click', () => goToSlide(state.currentSlide - 1));
    dom.slideNext?.addEventListener('click', () => goToSlide(state.currentSlide + 1));

    dom.prev?.addEventListener('click', () => {
      if (state.current > 0) goTo(state.current - 1);
    });

    dom.next?.addEventListener('click', () => {
      if (state.current >= state.chapters.length - 1) {
        window.location.assign(`/${encodeURIComponent(state.courseSlug)}`);
        return;
      }
      if (state.current < state.unlockedUpTo) {
        goTo(state.current + 1);
        return;
      }
      showAlert('Conclua este capítulo para liberar o próximo.', 'warning');
    });

    dom.mark?.addEventListener('click', () => {
      void completeCurrent();
    });
  }

  function bindObserver() {
    if (!('IntersectionObserver' in window)) return;
    state.headingObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          if (Number(entry.target.dataset.chapterIndex) !== state.current) continue;
          setCurrentHeading(entry.target.id);
        }
      },
      { rootMargin: '-20% 0px -75% 0px', threshold: 0 },
    );
    state.slideObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = Number(entry.target.dataset.slideIndex);
          if (!Number.isFinite(index)) continue;
          state.currentSlide = index;
          updateSlidePosition();
        }
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    );
    state.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = Number(entry.target.dataset.index);
          if (Number.isFinite(index)) setCurrent(index);
        }
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    );
  }

  // ---- Inicialização ------------------------------------------------------

  const { courseSlug, moduleSlug, chapterId } = parseParams();

  if (!courseSlug || !moduleSlug) {
    hideLoading();
    renderEmpty('Escolha um curso e um módulo para abrir o capítulo.', {
      href: '/',
      label: 'Ir para o catálogo',
    });
    return;
  }

  const session = await checkAuth();
  if (!session) return;

  applyCopyProtection(session?.user?.role !== 'admin' && session?.payload?.role !== 'admin');

  let index;
  try {
    index = await loadIndex(courseSlug, moduleSlug);
  } catch (error) {
    console.error('Não foi possível abrir o módulo:', error);
    hideLoading();
    renderEmpty('Não foi possível carregar os capítulos deste módulo. Tente novamente mais tarde.');
    return;
  }

  if (!index) {
    hideLoading();
    renderEmpty('Módulo não encontrado.', { href: '/', label: 'Ir para o catálogo' });
    return;
  }

  state.courseSlug = courseSlug;
  state.moduleSlug = moduleSlug;
  state.chapters = Array.isArray(index.chapters) ? index.chapters : [];

  document.title = `${index.module.title} — InfinityCamps`;
  if (dom.sidebarTitle) dom.sidebarTitle.textContent = index.module.title;
  dom.breadcrumb?.setItems?.([
    { label: 'Home', href: '/' },
    { label: index.course.title, href: `/${encodeURIComponent(courseSlug)}` },
    { label: index.module.title },
  ]);

  if (state.chapters.length === 0) {
    renderEmpty('Este módulo ainda não tem capítulos publicados.');
    updateProgress();
    return;
  }

  const isAdmin = session?.user?.role === 'admin' || session?.payload?.role === 'admin';

  // Progresso local: capítulos concluídos e até onde o aluno já destravou.
  const progressRows = await Promise.all(state.chapters.map((chapter) => getProgress(progressKey(chapter)).catch(() => null)));
  progressRows.forEach((row, position) => {
    if (row?.completed && position < state.chapters.length) state.completed.add(state.chapters[position].id);
  });

  const storedMax = await getMeta(maxViewedKey()).catch(() => null);
  const completedIndexes = state.chapters
    .map((chapter, position) => (state.completed.has(chapter.id) ? position : -1))
    .filter((position) => position >= 0);
  const reached = Math.max(Number.isFinite(storedMax) ? storedMax : -1, ...completedIndexes, -1);
  
  // Admin nunca tem nada bloqueado: destrava tudo de uma vez.
  state.unlockedUpTo = isAdmin ? state.chapters.length - 1 : Math.min(reached + 1, state.chapters.length - 1);

  bindObserver();
  bindToolbar();
  bindKeyboard();

  for (let position = 0; position <= state.unlockedUpTo; position += 1) {
    try {
      await appendChapter(position);
    } catch (error) {
      if (error.code === 'session') {
        hideLoading();
        showAlert('Sua sessão expirou. Entre novamente para continuar lendo.', 'warning', {
          href: `/login?returnTo=${encodeURIComponent(window.location.pathname + window.location.search)}`,
          label: 'Entrar',
        });
        return;
      }
      console.error('Não foi possível carregar o capítulo:', error);
      hideLoading();
      renderEmpty('Não foi possível carregar o conteúdo deste módulo. Tente novamente mais tarde.');
      return;
    }
  }

  if (state.unlockedUpTo < state.chapters.length - 1) {
    state.gate = buildGate();
    dom.stack.append(state.gate);
  }

  hideLoading();
  dom.toolbar?.removeAttribute('hidden');
  renderSidebar();
  updateProgress();
  updateToolbar();
  updateUrl();

  // Deep link (?chapter=...) só funciona para capítulos já liberados.
  if (chapterId) {
    const target = chapterById(chapterId);
    const targetIndex = target ? state.chapters.indexOf(target) : -1;
    if (targetIndex > state.unlockedUpTo) {
      showAlert('Este capítulo ainda está bloqueado. Conclua os capítulos anteriores para abri-lo.', 'warning');
    } else if (targetIndex >= 0) {
      requestAnimationFrame(() => goTo(targetIndex, { instant: true, focus: false }));
    }
  } else if (reached >= 0 && state.unlockedUpTo > 0) {
    // Sem deep link: retoma no primeiro capítulo ainda não concluído.
    requestAnimationFrame(() => goTo(state.unlockedUpTo, { instant: true, focus: false }));
  }
}
