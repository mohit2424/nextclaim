
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function generateMockClaims() {
  const firstNames = ["James", "Emma", "Michael", "Sarah", "David"];
  const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones"];
  const states = ["California", "New York", "Texas", "Florida", "Washington"];
  const employers = [
    "Global Technologies Inc.",
    "Innovative Solutions LLC",
    "Summit Industries",
    "Evergreen Manufacturing",
    "Advanced Systems Corp"
  ];
  const separationReasons = ["layoff", "reduction_in_force", "constructive_discharge", "severance_agreement", "job_abandonment"];
  
  const currentDate = new Date();
  
  const generateEmploymentDates = (isEligible: boolean) => {
    const endDate = new Date(currentDate);
    endDate.setDate(endDate.getDate() - Math.floor(Math.random() * 30));
    
    const startDate = new Date(endDate);
    if (isEligible) {
      startDate.setDate(startDate.getDate() - (120 + Math.floor(Math.random() * 245)));
    } else {
      startDate.setDate(startDate.getDate() - (30 + Math.floor(Math.random() * 89)));
    }
    
    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    };
  };

  const generateSSN = () => {
    const area = String(Math.floor(Math.random() * 900 + 100));
    const group = String(Math.floor(Math.random() * 90 + 10));
    const serial = String(Math.floor(Math.random() * 9000 + 1000));
    return `${area}-${group}-${serial}`;
  };
  
  return Array.from({ length: 5 }, (_, i) => {
    const firstName = firstNames[i];
    const lastName = lastNames[i];
    const isEligible = i < 3;
    const { startDate, endDate } = generateEmploymentDates(isEligible);
    const uniqueSSN = generateSSN();
    
    return {
      first_name: firstName,
      middle_name: `${firstName[0]}`,
      last_name: lastName,
      age: Math.floor(Math.random() * (65 - 18) + 18),
      state: states[i],
      pincode: Math.floor(Math.random() * 90000 + 10000).toString(),
      ssn: uniqueSSN,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      phone: `${Math.floor(Math.random() * 900 + 100)}${Math.floor(Math.random() * 900 + 100)}${Math.floor(Math.random() * 9000 + 1000)}`,
      employer_name: employers[i],
      claim_date: new Date().toISOString().split('T')[0],
      claim_status: "initial_review",
      separation_reason: separationReasons[i],
      employment_start_date: startDate,
      employment_end_date: endDate,
      severance_package: Math.random() > 0.5,
      documents: [],
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  });
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Generating and processing new mock claims...')
    const mockClaims = generateMockClaims();
    
    const results = []
    const skipped = []
    
    for (const claim of mockClaims) {
      try {
        const { data: existingClaim, error: checkError } = await supabaseClient
          .from('claims')
          .select('id, ssn')
          .eq('ssn', claim.ssn)
          .maybeSingle()

        if (checkError) {
          console.error('Error checking existing claim:', checkError)
          continue
        }

        if (existingClaim) {
          console.log(`Claim with SSN ${claim.ssn} already exists, skipping...`)
          skipped.push(claim.ssn)
          continue
        }

        const { data, error: insertError } = await supabaseClient
          .from('claims')
          .insert(claim)
          .select()
        
        if (insertError) {
          console.error('Error inserting claim:', insertError)
          continue
        }
        
        results.push(data[0])
        console.log(`Successfully inserted claim for ${claim.first_name} ${claim.last_name}`)
      } catch (error) {
        console.error('Error processing claim:', error)
        continue
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: results,
        skipped: skipped,
        message: `Successfully imported ${results.length} new claims. Skipped ${skipped.length} duplicate claims.`
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Error in naswa-claims function:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        details: "Check the function logs for more information"
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
