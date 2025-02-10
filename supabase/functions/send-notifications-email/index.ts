
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface Subscription {
  urls: {
    id: string;
    name: string;
    url: string;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, subscriptions } = await req.json();

    console.log("Received request with email:", email);
    console.log("Subscriptions:", JSON.stringify(subscriptions, null, 2));

    const subscriptionsList = (subscriptions as Subscription[])
      .map((sub) => `<li><a href="${sub.urls.url}">${sub.urls.name}</a></li>`)
      .join("");

    const emailResponse = await resend.emails.send({
      from: "Notificaciones <onboarding@resend.dev>",
      to: [email],
      subject: "Tus notificaciones activas",
      html: `
        <h1>Tus notificaciones activas</h1>
        <p>Aquí tienes un resumen de las URLs que estás siguiendo:</p>
        <ul>
          ${subscriptionsList}
        </ul>
        <p>Recibirás notificaciones cuando haya cambios en estas páginas.</p>
        <p>¡Gracias por usar nuestro servicio!</p>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error("Error sending notification email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
