// Realce de sintaxe mínimo, sem dependências.
// Os nós são criados com createElement/textContent: nada do código do capítulo
// vira HTML. Linguagens: html/xml, css e js/json; o resto fica sem cor.

function span(kind, text) {
  const element = document.createElement('span');
  element.className = `tok-${kind}`;
  element.textContent = text;
  return element;
}

function appendText(parent, text) {
  if (text) parent.append(document.createTextNode(text));
}

function tokenizeMarkup(code, fragment) {
  const tokens = /<!--[\s\S]*?-->|<\/?[A-Za-z][^>]*>/g;
  let last = 0;
  let match;

  while ((match = tokens.exec(code)) !== null) {
    appendText(fragment, code.slice(last, match.index));
    const token = match[0];
    last = match.index + token.length;

    if (token.startsWith('<!--')) {
      fragment.append(span('comment', token));
      continue;
    }

    const selfClosing = token.endsWith('/>');
    const opening = token.slice(0, 2) === '</' ? '</' : '<';
    const body = token.slice(opening.length, selfClosing ? -2 : -1);

    fragment.append(span('punct', opening));

    const name = /^([A-Za-z][\w:-]*)/.exec(body);
    if (name) fragment.append(span('tag', name[1]));

    const rest = body.slice(name ? name[1].length : 0);
    const attributes = /([A-Za-z_:][-\w:.]*)(\s*=\s*)("[^"]*"|'[^']*'|[^\s>]+)?/g;
    let attributeLast = 0;
    let attribute;

    while ((attribute = attributes.exec(rest)) !== null) {
      appendText(fragment, rest.slice(attributeLast, attribute.index));
      fragment.append(span('attr', attribute[1]));
      if (attribute[2]) fragment.append(span('punct', attribute[2]));
      if (attribute[3]) fragment.append(span('string', attribute[3]));
      attributeLast = attribute.index + attribute[0].length;
    }
    appendText(fragment, rest.slice(attributeLast));

    fragment.append(span('punct', selfClosing ? '/>' : '>'));
  }

  appendText(fragment, code.slice(last));
}

function tokenizeCss(code, fragment) {
  const tokens = /(\/\*[\s\S]*?\*\/)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|([{};:])|([^{};:"']+)/g;
  let state = 'selector';
  let last = 0;
  let match;

  while ((match = tokens.exec(code)) !== null) {
    if (match[1]) {
      fragment.append(span('comment', match[1]));
    } else if (match[2]) {
      fragment.append(span('string', match[2]));
    } else if (match[3]) {
      const punctuation = match[3];
      fragment.append(span('punct', punctuation));
      if (punctuation === '{') state = 'property';
      else if (punctuation === '}') state = 'selector';
      else if (punctuation === ':') state = 'value';
      else if (punctuation === ';') state = 'property';
    } else {
      const text = match[4];
      if (state === 'selector') fragment.append(span('selector', text));
      else if (state === 'property') fragment.append(span('property', text));
      else fragment.append(span('value', text));
    }
    last = match.index + match[0].length;
  }

  appendText(fragment, code.slice(last));
}

const KEYWORDS = new Set([
  'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'do', 'new', 'class',
  'extend', 'extends', 'import', 'export', 'from', 'await', 'async', 'try', 'catch', 'finally',
  'throw', 'typeof', 'instanceof', 'delete', 'switch', 'case', 'break', 'continue', 'default',
  'in', 'of', 'this', 'super', 'null', 'undefined', 'true', 'false',
]);

function tokenizeCode(code, fragment) {
  const tokens = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|([A-Za-z_$][\w$]*)|(\d+(?:\.\d+)?)|([{}()[\];,.=+\-*/%<>!&|?:]+)/g;
  let last = 0;
  let match;

  while ((match = tokens.exec(code)) !== null) {
    if (match.index > last) appendText(fragment, code.slice(last, match.index));

    if (match[1]) fragment.append(span('comment', match[1]));
    else if (match[2]) fragment.append(span('string', match[2]));
    else if (match[3]) fragment.append(KEYWORDS.has(match[3]) ? span('keyword', match[3]) : document.createTextNode(match[3]));
    else if (match[4]) fragment.append(span('number', match[4]));
    else if (match[5]) fragment.append(span('punct', match[5]));

    last = match.index + match[0].length;
  }

  appendText(fragment, code.slice(last));
}

export function highlight(code, language) {
  const source = String(code ?? '');
  const lang = String(language ?? '').toLowerCase();
  const fragment = document.createDocumentFragment();

  if (lang === 'html' || lang === 'xml' || lang === 'svg') tokenizeMarkup(source, fragment);
  else if (lang === 'css') tokenizeCss(source, fragment);
  else if (['js', 'javascript', 'json', 'mjs'].includes(lang)) tokenizeCode(source, fragment);
  else fragment.append(document.createTextNode(source));

  return fragment;
}
