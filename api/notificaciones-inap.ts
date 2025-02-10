
export const config = {
  runtime: 'edge',
};

export default async function handler() {
  console.log('works');
  
  return new Response(JSON.stringify({ message: 'Cron job executed successfully' }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
