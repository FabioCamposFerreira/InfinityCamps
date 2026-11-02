import { getCourses, getCourseWithSubcourses } from '../../../../lib/server/learn.js';

export async function getStaticPaths() {
  return (await getCourses()).map((course) => ({ params: { slug: course.slug } }));
}

export async function GET({ params }) {
  const result = await getCourseWithSubcourses(params.slug);
  if (!result) {
    return new Response(JSON.stringify({ error: 'not_found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  }
  return new Response(JSON.stringify(result), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
