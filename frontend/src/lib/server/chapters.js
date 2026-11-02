import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { getCourses, normalizeSlug, slugify } from './learn.js';

// Capítulos de um módulo: uma pasta numerada por capítulo, com o conteúdo
// sempre em chapter.md. A pasta define a ordem e a identidade ("01", "02"...).
const learnDir = path.resolve(process.cwd(), 'Learn');
const chapterDirName = /^(\d{1,3})$/;
const chapterFileName = 'chapter.md';
const chapterTypes = new Set(['theory', 'hands-on', 'exercise']);

// Front-matter simples (chave: valor). Não é YAML completo de propósito:
// o projeto evita dependências e o formato usado é sempre raso.
export function parseFrontMatter(text) {
  const source = String(text ?? '').replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
  const match = /^---\n([\s\S]*?)\n---(?:\n|$)/.exec(source);
  if (!match) return { data: {}, body: source };

  const data = {};
  for (const rawLine of match[1].split('\n')) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const separator = line.indexOf(':');
    if (separator < 1) continue;
    const key = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();
    if (!value) continue;
    if (/^(['"]).*\1$/.test(value)) value = value.slice(1, -1);
    data[key] = value;
  }

  return { data, body: source.slice(match[0].length) };
}

function normalizeType(value) {
  const type = String(value ?? '').trim().toLowerCase();
  return chapterTypes.has(type) ? type : 'hands-on';
}

function toDuration(value) {
  const parsed = Number.parseInt(String(value ?? ''), 10);
  return Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, 600) : null;
}

function isInside(base, target) {
  return target === base || target.startsWith(base + path.sep);
}

async function readCourseJson(dir) {
  try {
    return JSON.parse(await readFile(path.join(dir, 'course.json'), 'utf8'));
  } catch {
    return null;
  }
}

async function listFolders(dir) {
  const entries = await readdir(dir, { withFileTypes: true }).catch(() => []);
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, 'pt-BR', { numeric: true }));
}

function learnUrl(...segments) {
  return '/learn/' + segments.join('/').split('/').map(encodeURIComponent).join('/');
}

async function findCourse(slug) {
  const courses = await getCourses();
  return courses.find((course) => course.slug === slug) ?? null;
}

async function findModule(course, moduleSlug) {
  const courseDir = path.join(learnDir, course.folder);
  for (const folder of await listFolders(courseDir)) {
    const meta = await readCourseJson(path.join(courseDir, folder));
    if (!meta || normalizeSlug(meta.slug, slugify(folder)) !== moduleSlug) continue;
    return { folder, meta };
  }
  return null;
}

// Lista os módulos de um curso, para montar as rotas estáticas.
export async function listModules(courseSlug) {
  const course = await findCourse(courseSlug);
  if (!course) return [];

  const courseDir = path.join(learnDir, course.folder);
  const modules = [];
  for (const folder of await listFolders(courseDir)) {
    const meta = await readCourseJson(path.join(courseDir, folder));
    if (!meta) continue;
    modules.push({
      slug: normalizeSlug(meta.slug, slugify(folder)),
      folder,
      title: meta.title || folder,
    });
  }
  return modules;
}

// Índice de capítulos de um módulo. Devolve apenas metadados: o conteúdo é
// buscado em /learn/* no navegador, depois da sessão ser validada.
export async function getChapterIndex(courseSlug, moduleSlug) {
  const course = await findCourse(courseSlug);
  if (!course) return null;

  const found = await findModule(course, moduleSlug);
  if (!found) return null;

  const moduleDir = path.join(learnDir, course.folder, found.folder);
  const contentDirName = typeof found.meta.contentDir === 'string' ? found.meta.contentDir.trim() : '';
  const contentDir = path.resolve(moduleDir, contentDirName || '.');

  // O manifesto não pode apontar para fora da pasta do módulo.
  if (!isInside(moduleDir, contentDir)) return null;

  const entries = await readdir(contentDir, { withFileTypes: true }).catch(() => []);
  const chapters = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const match = chapterDirName.exec(entry.name);
    if (!match) continue;

    const { data } = parseFrontMatter(
      await readFile(path.join(contentDir, entry.name, chapterFileName), 'utf8').catch(() => ''),
    );
    const title = String(data.title ?? '').trim();
    if (!title) continue;

    // A pasta é a identidade do capítulo: 01, 02, 03...
    const number = match[1].padStart(2, '0');
    chapters.push({
      id: number,
      number,
      title,
      description: String(data.description ?? '').trim(),
      type: normalizeType(data.type),
      duration: toDuration(data.duration),
      contentUrl: learnUrl(
        course.folder,
        found.folder,
        ...(contentDirName ? [contentDirName] : []),
        entry.name,
        chapterFileName,
      ),
      _order: Number.parseInt(match[1], 10),
    });
  }

  chapters.sort((a, b) => a._order - b._order || a.title.localeCompare(b.title, 'pt-BR'));
  chapters.forEach((chapter) => delete chapter._order);

  return {
    course: { slug: course.slug, title: course.title },
    module: {
      slug: moduleSlug,
      title: found.meta.title || found.folder,
      description: found.meta.description || '',
    },
    chapters,
  };
}
