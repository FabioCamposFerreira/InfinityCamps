import { getCourses } from '../../lib/server/learn.js';

export async function GET() {
  const courses = (await getCourses()).map(({ folder, ...course }) => course);
  return new Response(JSON.stringify({ courses }), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
