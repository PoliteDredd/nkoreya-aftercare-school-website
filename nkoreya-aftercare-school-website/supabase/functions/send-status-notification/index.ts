import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Get the allowed origin from environment or default to the Lovable preview domain
const allowedOrigins = [
  Deno.env.get('ALLOWED_ORIGIN') || '',
  'https://lovable.dev',
  'https://lovableproject.com',
].filter(Boolean);

const getCorsHeaders = (origin: string | null) => {
  // Check if the request origin is allowed
  const isAllowed = origin && (
    allowedOrigins.some(allowed => origin.includes(allowed.replace('https://', ''))) ||
    origin.includes('lovableproject.com') ||
    origin.includes('lovable.dev')
  );
  
  return {
    "Access-Control-Allow-Origin": isAllowed ? origin : allowedOrigins[0] || '*',
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
};

serve(async (req) => {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    // Verify the user is authenticated and is an admin
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Supabase client with the user's token
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    // Get the authenticated user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if user is admin or principal using the has_role function
    const { data: isAdminOrPrincipal, error: roleError } = await supabaseClient
      .rpc('is_admin_or_principal', { _user_id: user.id });

    if (roleError || !isAdminOrPrincipal) {
      return new Response(
        JSON.stringify({ error: "Access denied. Admin privileges required." }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { applicationId, newStatus, parentEmail, studentName, message } = await req.json();

    // Validate required fields
    if (!applicationId || !newStatus || !parentEmail || !studentName) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Admin ${user.id} sending notification for application ${applicationId}`);
    console.log(`Status: ${newStatus}, Email: ${parentEmail}, Student: ${studentName}`);

    // In production, integrate with Resend or another email service
    // For now, just log the notification
    return new Response(
      JSON.stringify({ success: true, message: "Notification logged" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error processing notification request");
    return new Response(
      JSON.stringify({ error: "Failed to process notification request" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
