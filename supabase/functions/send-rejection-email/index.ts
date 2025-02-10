
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Resend } from "npm:resend@2.0.0"

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RejectionEmailRequest {
  claimId: string;
  firstName: string;
  lastName: string;
  email: string;
  rejectionReason: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { firstName, lastName, email, claimId, rejectionReason }: RejectionEmailRequest = await req.json();

    console.log(`Sending rejection email for claim ${claimId} to ${email}`);

    const { data, error } = await resend.emails.send({
      from: "Unemployment Claims <onboarding@resend.dev>",
      to: email,
      subject: `Claim ${claimId} Status Update`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333;">Unemployment Claim Status Update</h2>
          <p>Dear ${firstName} ${lastName},</p>
          <p>We regret to inform you that your unemployment claim (ID: ${claimId}) has been rejected.</p>
          <p><strong>Reason for rejection:</strong></p>
          <p style="padding: 15px; background-color: #f8f8f8; border-left: 4px solid #e74c3c;">${rejectionReason}</p>
          <p>If you believe this decision was made in error or if you have additional information to provide, please contact our support team.</p>
          <p>Best regards,<br>Unemployment Claims Team</p>
        </div>
      `
    });

    if (error) {
      console.error("Error sending email:", error);
      throw error;
    }

    console.log("Email sent successfully:", data);

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error("Error in send-rejection-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
