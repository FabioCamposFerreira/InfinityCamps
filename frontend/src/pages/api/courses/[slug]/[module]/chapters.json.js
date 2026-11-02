import { getCourses } from '../../../../../lib/server/learn.js';
import { getChapterIndex, listModules } from '../../../../../lib/server/chapters.js';

// Metadados dos capítulos de um módulo (sem conteúdo, que fica em /learn/*).
export async function getStaticPaths() {
  const paths = [];
  for (const course of await getCourses()) {
    for (const module of await listModules(course.slug)) {
      paths.push({ params: { slug: course.slug, module: module.slug } });
    }
  }
  return paths;
}

export async function GET({ params }) {
  const index = await getChapterIndex(params.slug, params.module);
  if (!index) {
    return new Response(JSON.stringify({ error: 'not_found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  }

  return new Response(JSON.stringify(index), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
