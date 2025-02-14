
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function formatResponse(text: string) {
  return text
    // Formatear encabezados numerados con negrita
    .replace(/(\d+)\.\s+\*\*(.*?)\*\*:/g, '\n$1. **$2**:\n')
    // Asegurar que los elementos de lista tengan su propio párrafo
    .replace(/(\d+)\.\s+\*\*(.*?)\*\*:/g, '\n$1. **$2**:\n')
    // Formatear elementos de lista con viñetas
    .replace(/^\s*[-•]\s+/gm, '- ')
    // Asegurar espaciado consistente entre párrafos
    .replace(/\n{3,}/g, '\n\n')
    // Formatear citas o referencias
    .replace(/【.*?】/g, '');
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    const OPENAI_ASSISTANT_ID = Deno.env.get('OPENAI_ASSISTANT_ID');

    if (!OPENAI_API_KEY || !OPENAI_ASSISTANT_ID) {
      throw new Error('Missing OpenAI configuration');
    }

    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "El cuerpo debe contener un array 'messages'." }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || !lastMessage.content) {
      return new Response(
        JSON.stringify({ error: "No se encontró un mensaje válido." }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Crear un thread y añadir el mensaje
    const threadResponse = await fetch('https://api.openai.com/v1/threads', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v1'
      }
    });
    const thread = await threadResponse.json();

    // Añadir mensaje al thread
    await fetch(`https://api.openai.com/v1/threads/${thread.id}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v1'
      },
      body: JSON.stringify({
        role: "user",
        content: lastMessage.content
      })
    });

    // Ejecutar el asistente
    const runResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v1'
      },
      body: JSON.stringify({
        assistant_id: OPENAI_ASSISTANT_ID
      })
    });
    const run = await runResponse.json();

    // Esperar a que el asistente complete su respuesta
    let runStatus = { status: 'in_progress' };
    while (runStatus.status !== 'completed') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const statusResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs/${run.id}`, {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'OpenAI-Beta': 'assistants=v1'
        }
      });
      runStatus = await statusResponse.json();

      if (runStatus.status === 'failed' || runStatus.status === 'cancelled') {
        throw new Error(`Run ended with status: ${runStatus.status}`);
      }
    }

    // Obtener los mensajes del thread
    const messagesResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/messages`, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'OpenAI-Beta': 'assistants=v1'
      }
    });
    const messagesData = await messagesResponse.json();
    const assistantMessage = messagesData.data[0];

    if (!assistantMessage || !assistantMessage.content[0]) {
      throw new Error("No se recibió una respuesta válida del asistente");
    }

    // Formatear y devolver la respuesta
    const formattedContent = formatResponse(assistantMessage.content[0].text.value);

    return new Response(
      JSON.stringify({
        role: "assistant",
        content: formattedContent,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    return new Response(
      JSON.stringify({ error: "Ocurrió un error durante la solicitud." }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
