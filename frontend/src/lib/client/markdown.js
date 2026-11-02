import { highlight } from './highlight.js';

// Renderer de markdown do conteúdo dos capítulos.
// Segurança: o HTML final é montado com createElement/textContent — nenhum
// trecho do arquivo .md passa por innerHTML. URLs passam por whitelist.
// Suporta: títulos, parágrafos, listas, citação, código, imagens, links,
// negrito/itálico e os blocos ::: do conteúdo (exercício, resposta, dica).
//
// Antes de renderizar, o texto passa por validateMarkdown(): os erros impedem a
// exibição do capítulo, os avisos não. Os dois vão para o console.

const SAFE_PROTOCOL = /^(https?:|mailto:)/i;

const KNOWN_DIRECTIVES = new Set([
  'exercicio',
  'resposta',
  'resposta-modelo',
  'answer',
  'dica',
  'teoria',
  'exemplo',
  'card',
]);

// Aceita apenas http(s), mailto, âncoras e caminhos relativos. Caminhos
// relativos são resolvidos contra a URL do capítulo (baseUrl), para que
// "imagens/foto.png" aponte para a pasta do próprio capítulo.
function safeUrl(value, baseUrl = '') {
  const url = String(value ?? '').trim();
  if (!url) return '';
  if (/^[a-z][a-z0-9+.-]*:/i.test(url)) return SAFE_PROTOCOL.test(url) ? url : '';
  if (!baseUrl || url.startsWith('/') || url.startsWith('#')) return url;
  try {
    const resolved = new URL(url, new URL(baseUrl, 'http://local.invalid'));
    return `${resolved.pathname}${resolved.search}`;
  } catch {
    return url;
  }
}

function renderInline(parent, text, baseUrl = '') {
  const source = String(text ?? '');
  // Regex própria por chamada: a função é recursiva (negrito/itálico) e um
  // lastIndex compartilhado entre chamadas faria o laço repetir o mesmo token.
  const pattern = /(`[^`\n]+`)|(!\[[^\]\n]*\]\([^)\s]+\))|(\[[^\]\n]+\]\([^)\s]+\))|(\*\*[^*\n]+\*\*)|(\*[^*\n]+\*)/g;
  let lastIndex = 0;
  let match;

  while ((match = pattern.exec(source)) !== null) {
    if (match.index > lastIndex) {
      parent.append(document.createTextNode(source.slice(lastIndex, match.index)));
    }

    const token = match[0];
    if (match[1]) {
      const code = document.createElement('code');
      code.textContent = token.slice(1, -1);
      parent.append(code);
    } else if (match[2]) {
      const image = document.createElement('img');
      const parts = /!\[([^\]]*)\]\(([^)\s]+)\)/.exec(token);
      image.src = safeUrl(parts?.[2], baseUrl);
      image.alt = parts?.[1] ?? '';
      image.loading = 'lazy';
      image.decoding = 'async';
      // Imagem ausente vira um marcador com o texto alternativo, em vez de
      // um ícone quebrado no meio do conteúdo.
      image.addEventListener(
        'error',
        () => {
          const placeholder = document.createElement('span');
          placeholder.className = 'chapter-image-missing';
          placeholder.textContent = image.alt || 'Imagem indisponível';
          image.replaceWith(placeholder);
        },
        { once: true },
      );
      parent.append(image);
    } else if (match[3]) {
      const parts = /\[([^\]]+)\]\(([^)\s]+)\)/.exec(token);
      const href = safeUrl(parts?.[2], baseUrl);
      if (href) {
        const link = document.createElement('a');
        link.href = href;
        link.textContent = parts?.[1] ?? href;
        if (/^https?:/i.test(href)) {
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
        }
        parent.append(link);
      } else {
        parent.append(document.createTextNode(token));
      }
    } else if (match[4]) {
      const strong = document.createElement('strong');
      renderInline(strong, token.slice(2, -2), baseUrl);
      parent.append(strong);
    } else if (match[5]) {
      const emphasis = document.createElement('em');
      renderInline(emphasis, token.slice(1, -1), baseUrl);
      parent.append(emphasis);
    }

    lastIndex = match.index + token.length;
  }

  if (lastIndex < source.length) {
    parent.append(document.createTextNode(source.slice(lastIndex)));
  }
}

function buildHeading(level, text, baseUrl = '') {
  const heading = document.createElement(`h${Math.min(Math.max(level, 2), 6)}`);
  renderInline(heading, text, baseUrl);
  return heading;
}

function buildCodeBlock(code, language) {
  const wrapper = document.createElement('div');
  wrapper.className = 'chapter-code-block';

  const pre = document.createElement('pre');
  const codeElement = document.createElement('code');
  if (language) codeElement.className = `language-${language}`;
  codeElement.append(highlight(code, language));
  pre.append(codeElement);

  wrapper.append(pre);
  return wrapper;
}

function buildDirective(name, content) {
  if (name === 'resposta' || name === 'resposta-modelo' || name === 'answer') {
    const details = document.createElement('details');
    details.className = 'chapter-answer';
    const summary = document.createElement('summary');
    summary.textContent = 'Ver resposta';
    details.append(summary, content);
    return details;
  }

  const section = document.createElement('section');
  section.className = `chapter-card chapter-card-${name || 'card'}`;

  const labels = {
    exercicio: 'Exercício',
    resposta: '',
    dica: 'Dica',
    teoria: 'Teoria',
    exemplo: 'Exemplo',
  };

  const label = labels[name];
  if (label) {
    const labelElement = document.createElement('p');
    labelElement.className = 'chapter-card-label';
    labelElement.textContent = label;
    section.append(labelElement);
  }

  section.append(content);
  return section;
}

function scanMarkdown(lines, lineOffset) {
  const issues = [];
  const report = (severity, code, index, message) => {
    issues.push({ severity, code, line: index + 1 + lineOffset, message });
  };

  let fenceStart = -1;
  let directiveStart = -1;
  let directiveName = '';
  let lastHeading = 0;

  for (let index = 0; index < lines.length; index += 1) {
    const trimmed = lines[index].trim();

    // Dentro de um bloco de código ou de um ::: nada é interpretado.
    if (fenceStart !== -1) {
      if (/^```\s*$/.test(trimmed)) fenceStart = -1;
      continue;
    }

    if (directiveStart !== -1) {
      if (/^:::\s*$/.test(trimmed)) directiveStart = -1;
      continue;
    }

    const fence = /^```([\w-]*)\s*$/.exec(trimmed);
    if (fence) {
      fenceStart = index;
      continue;
    }

    const directive = /^:::\s*([a-z-]*)\s*$/i.exec(trimmed);
    if (directive) {
      directiveName = (directive[1] || 'card').toLowerCase();
      if (!KNOWN_DIRECTIVES.has(directiveName)) {
        report('warning', 'diretiva-desconhecida', index, `Bloco ":::" desconhecido: ${directiveName}.`);
      }
      directiveStart = index;
      continue;
    }

    if (!trimmed) continue;

    const heading = /^(#{1,6})\s+/.exec(trimmed);
    if (heading) {
      const level = heading[1].length;
      if (lastHeading && level > lastHeading + 1) {
        report('warning', 'titulo-pulado', index, `Título salta do nível ${lastHeading} para ${level}.`);
      }
      lastHeading = level;
      continue;
    }

    if (isTableStart(lines, index)) {
      const columns = splitTableRow(lines[index]).length;
      let row = index + 2;
      while (row < lines.length && lines[row].trim() && lines[row].includes('|')) {
        const cells = splitTableRow(lines[row]).length;
        if (cells !== columns) {
          report(
            'warning',
            'tabela-colunas',
            row,
            `Linha com ${cells} coluna(s); o cabeçalho tem ${columns}.`,
          );
        }
        row += 1;
      }
      index = row - 1;
      continue;
    }

    // Código inline não conta como marcação: `**` dentro de crases é texto.
    const withoutCode = trimmed.replace(/`[^`]*`/g, '');

    if ((withoutCode.match(/\*\*/g) || []).length % 2 === 1) {
      report('warning', 'negrito-nao-fechado', index, 'Marcador ** sem par nesta linha.');
    }

    if ((trimmed.match(/`/g) || []).length % 2 === 1) {
      report('warning', 'codigo-inline-nao-fechado', index, 'Crase de código inline sem par nesta linha.');
    }

    if (/\[[^\]]*$/.test(withoutCode) && !/\]\(/.test(withoutCode)) {
      report('warning', 'link-nao-fechado', index, 'Link com colchete aberto sem fechar.');
    }
  }

  if (fenceStart !== -1) {
    report('error', 'codigo-nao-fechado', fenceStart, 'Bloco de código aberto e não fechado.');
  }

  if (directiveStart !== -1) {
    report(
      'error',
      'diretiva-nao-fechada',
      directiveStart,
      `Bloco ":::" ${directiveName} aberto e não fechado.`,
    );
  }

  return issues;
}

// Valida o capítulo sem tocar no DOM (também roda no Node, em scripts).
// Devolve { errors, warnings, body }. Erros impedem a renderização.
export function validateMarkdown(markdown) {
  const raw = String(markdown ?? '').replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
  const errors = [];
  const warnings = [];
  let body = raw;
  let lineOffset = 0;

  if (/^---\n/.test(raw)) {
    const closing = raw.indexOf('\n---', 3);
    if (closing === -1) {
      errors.push({
        severity: 'error',
        code: 'front-matter-nao-fechado',
        line: 1,
        message: 'O bloco de metadados inicial não foi fechado com "---".',
      });
      return { errors, warnings, body: '' };
    }
    lineOffset = raw.slice(0, closing + 4).split('\n').length;
    body = raw.slice(closing + 4).replace(/^\n/, '');
  }

  if (!body.trim()) {
    errors.push({
      severity: 'error',
      code: 'conteudo-vazio',
      line: lineOffset + 1,
      message: 'O capítulo não tem conteúdo depois dos metadados.',
    });
    return { errors, warnings, body: '' };
  }

  for (const issue of scanMarkdown(body.split('\n'), lineOffset)) {
    (issue.severity === 'error' ? errors : warnings).push(issue);
  }

  return { errors, warnings, body };
}

const TABLE_SEPARATOR = /^:?-{2,}:?$/;

function splitTableRow(line) {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cell.trim());
}

function isTableSeparator(line) {
  if (!line || !line.includes('-')) return false;
  const cells = splitTableRow(line);
  return cells.length > 0 && cells.every((cell) => TABLE_SEPARATOR.test(cell));
}

// Uma tabela começa quando a linha tem "|" e a seguinte é o separador |---|---|
function isTableStart(lines, index) {
  const header = lines[index];
  const separator = lines[index + 1];
  if (!header || !separator || !header.includes('|')) return false;
  return isTableSeparator(separator);
}

function columnAlign(cell) {
  const left = cell.startsWith(':');
  const right = cell.endsWith(':');
  if (left && right) return 'center';
  if (right) return 'right';
  return '';
}

function buildTable(lines, start, baseUrl) {
  const header = splitTableRow(lines[start]);
  const align = splitTableRow(lines[start + 1]).map(columnAlign);

  const wrapper = document.createElement('div');
  wrapper.className = 'chapter-table';

  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const headRow = document.createElement('tr');

  header.forEach((cell, column) => {
    const th = document.createElement('th');
    if (align[column]) th.className = `is-${align[column]}`;
    renderInline(th, cell, baseUrl);
    headRow.append(th);
  });

  thead.append(headRow);
  table.append(thead);

  const tbody = document.createElement('tbody');
  let index = start + 2;

  while (index < lines.length) {
    const line = lines[index];
    if (!line.trim() || !line.includes('|')) break;
    const cells = splitTableRow(line);
    const row = document.createElement('tr');
    for (let column = 0; column < header.length; column += 1) {
      const td = document.createElement('td');
      if (align[column]) td.className = `is-${align[column]}`;
      renderInline(td, cells[column] ?? '', baseUrl);
      row.append(td);
    }
    tbody.append(row);
    index += 1;
  }

  table.append(tbody);
  wrapper.append(table);
  return { node: wrapper, next: index };
}

function isBlockStart(line) {
  return (
    /^```/.test(line) ||
    /^:::\s*[a-z-]*\s*$/i.test(line) ||
    /^#{1,6}\s+/.test(line) ||
    /^(-{3,}|\*{3,}|_{3,})$/.test(line) ||
    /^>\s?/.test(line) ||
    /^([-*+]|\d+[.)])\s+/.test(line)
  );
}

const LIST_ITEM = /^(\s*)([-*+]|\d+[.)])\s+(.*)$/;

function buildList(lines, start, baseUrl = '') {
  const first = LIST_ITEM.exec(lines[start]);
  const ordered = /\d/.test(first[2]);
  const baseIndent = first[1].length;
  const list = document.createElement(ordered ? 'ol' : 'ul');
  let index = start;

  while (index < lines.length) {
    const line = lines[index];
    const match = LIST_ITEM.exec(line);

    if (!match) {
      if (!line.trim()) {
        const next = lines[index + 1] ? LIST_ITEM.exec(lines[index + 1]) : null;
        if (next && next[1].length >= baseIndent) {
          index += 1;
          continue;
        }
      }
      break;
    }

    const indent = match[1].length;
    if (indent < baseIndent) break;

    if (indent > baseIndent) {
      const nested = buildList(lines, index, baseUrl);
      const lastItem = list.lastElementChild;
      if (lastItem) lastItem.append(nested.node);
      else list.append(nested.node);
      index = nested.next;
      continue;
    }

    if (/\d/.test(match[2]) !== ordered) break;

    const item = document.createElement('li');
    renderInline(item, match[3].trim(), baseUrl);
    list.append(item);
    index += 1;
  }

  return { node: list, next: index };
}

function parseBlocks(lines, baseUrl = '') {
  const fragment = document.createDocumentFragment();
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    const trimmed = line.trim();
    if (!trimmed) {
      index += 1;
      continue;
    }

    const fence = /^```([\w-]*)\s*$/.exec(trimmed);
    if (fence) {
      const codeLines = [];
      index += 1;
      while (index < lines.length && !/^```\s*$/.test(lines[index].trim())) {
        codeLines.push(lines[index]);
        index += 1;
      }
      index += 1;
      fragment.append(buildCodeBlock(codeLines.join('\n'), fence[1]));
      continue;
    }

    const directive = /^:::\s*([a-z-]*)\s*$/i.exec(trimmed);
    if (directive) {
      const name = (directive[1] || 'card').toLowerCase();
      const inner = [];
      index += 1;
      while (index < lines.length && !/^:::\s*$/.test(lines[index].trim())) {
        inner.push(lines[index]);
        index += 1;
      }
      index += 1;
      fragment.append(buildDirective(name, parseBlocks(inner, baseUrl)));
      continue;
    }

    const heading = /^(#{1,6})\s+(.*)$/.exec(trimmed);
    if (heading) {
      fragment.append(buildHeading(heading[1].length, heading[2].trim(), baseUrl));
      index += 1;
      continue;
    }

    if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
      fragment.append(document.createElement('hr'));
      index += 1;
      continue;
    }

    if (/^>\s?/.test(trimmed)) {
      const quoteLines = [];
      while (index < lines.length && /^>\s?/.test(lines[index].trim())) {
        quoteLines.push(lines[index].trim().replace(/^>\s?/, ''));
        index += 1;
      }
      const quote = document.createElement('blockquote');
      quote.append(parseBlocks(quoteLines, baseUrl));
      fragment.append(quote);
      continue;
    }

    if (isTableStart(lines, index)) {
      const table = buildTable(lines, index, baseUrl);
      fragment.append(table.node);
      index = table.next;
      continue;
    }

    if (LIST_ITEM.test(trimmed)) {
      const list = buildList(lines, index, baseUrl);
      fragment.append(list.node);
      index = list.next;
      continue;
    }

    const paragraphLines = [];
    while (index < lines.length) {
      const current = lines[index].trim();
      if (!current || isBlockStart(current) || isTableStart(lines, index)) break;
      paragraphLines.push(current);
      index += 1;
    }

    if (paragraphLines.length) {
      const paragraph = document.createElement('p');
      renderInline(paragraph, paragraphLines.join(' '), baseUrl);
      fragment.append(paragraph);
    } else {
      index += 1;
    }
  }

  return fragment;
}

export function renderMarkdown(markdown, options = {}) {
  const { errors, warnings, body } = validateMarkdown(markdown);
  return {
    fragment: parseBlocks(body.split('\n'), options.baseUrl || ''),
    errors,
    warnings,
  };
}
