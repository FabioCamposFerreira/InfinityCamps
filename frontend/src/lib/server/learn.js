import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

// Conteúdo dos cursos: Learn/<Curso>/course.json e Learn/<Curso>/<Módulo>/course.json
const learnDir = path.resolve(process.cwd(), 'Learn');

export function slugify(name) {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// O slug vem do manifesto ("slug": "web-full-stack") e, sem ele, do nome da pasta.
// Só aceita letras, números e hífen: o valor entra direto na URL.
export function normalizeSlug(value, fallback) {
  const slug = String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || fallback;
}

function learnUrl(...parts) {
  return '/learn/' + parts.join('/').split('/').map(encodeURIComponent).join('/');
}

async function readCourseJson(dir) {
  try {
    return JSON.parse(await readFile(path.join(dir, 'course.json'), 'utf8'));
  } catch {
    return null;
  }
}

async function listFolders(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, 'pt-BR', { numeric: true }));
}

export async function getCourses() {
  const courses = [];
  for (const folder of await listFolders(learnDir)) {
    const meta = await readCourseJson(path.join(learnDir, folder));
    if (!meta) continue;
    const slug = normalizeSlug(meta.slug, slugify(folder));
    courses.push({
      slug,
      folder,
      title: meta.title || folder,
      description: meta.description || '',
      image: meta.image ? learnUrl(folder, meta.image) : '',
      requiresLogin: meta.access === 'locked',
      catalogLink: `/${encodeURIComponent(slug)}`,
      link: meta.link ? learnUrl(folder, meta.link) : `/${encodeURIComponent(slug)}`,
    });
  }
  return courses;
}

export async function getCourseWithSubcourses(slug) {
  const course = (await getCourses()).find((item) => item.slug === slug);
  if (!course) return null;

  const courseDir = path.join(learnDir, course.folder);
  const subcourses = [];
  for (const folder of await listFolders(courseDir)) {
    const meta = await readCourseJson(path.join(courseDir, folder));
    if (!meta) continue;
    const moduleSlug = normalizeSlug(meta.slug, slugify(folder));
    subcourses.push({
      id: moduleSlug,
      number: String(subcourses.length + 1),
      title: meta.title || folder,
      description: meta.description || '',
      image: meta.image ? learnUrl(course.folder, folder, meta.image) : '',
      // O card do módulo abre a página de capítulos, não o arquivo cru do manifesto.
      chapterLink: `/${encodeURIComponent(course.slug)}/${encodeURIComponent(moduleSlug)}`,
      link: meta.link ? learnUrl(course.folder, folder, meta.link) : '#',
    });
  }

  const { folder, ...publicCourse } = course;
  return { course: publicCourse, subcourses };
}
