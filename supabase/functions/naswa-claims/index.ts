
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function generateMockClaims() {
  const firstNames = ["James", "Emma", "Michael", "Sarah", "David", "Jennifer", "William", "Elizabeth", "Robert", "Patricia"];
  const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"];
  const states = ["California", "New York", "Texas", "Florida", "Washington"];
  const employers = [
    "Global Technologies Inc.",
    "Innovative Solutions LLC",
    "Summit Industries",
    "Evergreen Manufacturing",
    "Advanced Systems Corp"
  ];
  const separationReasons = ["layoff", "reduction_in_force", "constructive_discharge", "severance_agreement", "job_abandonment"];
  
  return Array.from({ length: 5 }, (_, i) => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const today = new Date();
    const lastDayOfWork = new Date(today);
    lastDayOfWork.setDate(today.getDate() - Math.floor(Math.random() * 30)); // Random date within last 30 days
    
    return {
      first_name: firstName,
      middle_name: `${firstName[0]}`,
      last_name: lastName,
      age: Math.floor(Math.random() * (65 - 18) + 18),
      state: states[Math.floor(Math.random() * states.length)],
      pincode: Math.floor(Math.random() * 90000 + 10000).toString(),
      ssn: `${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 90 + 10)}-${Math.floor(Math.random() * 9000 + 1000)}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      phone: `${Math.floor(Math.random() * 900 + 100)}${Math.floor(Math.random() * 900 + 100)}${Math.floor(Math.random() * 9000 + 1000)}`,
      employer_name: employers[Math.floor(Math.random() * employers.length)],
      claim_date: today.toISOString().split('T')[0],
      claim_status: "initial_review",
      separation_reason: separationReasons[Math.floor(Math.random() * separationReasons.length)],
      last_day_of_work: lastDayOfWork.toISOString().split('T')[0],
      employment_start_date: new Date(today.getFullYear() - 1, today.getMonth(), today.getDate()).toISOString().split('T')[0],
      employment_end_date: lastDayOfWork.toISOString().split('T')[0],
      severance_package: Math.random() > 0.5,
      severance_amount: Math.random() > 0.5 ? Math.floor(Math.random() * 50000 + 5000) : null,
      reason_for_unemployment: "Company restructuring",
      documents: []
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
    for (const claim of mockClaims) {
      // Check if claim with this SSN already exists
      const { data: existingClaim } = await supabaseClient
        .from('claims')
        .select('id')
        .eq('ssn', claim.ssn)
        .single()

      if (existingClaim) {
        console.log(`Claim with SSN ${claim.ssn} already exists, skipping...`)
        continue
      }

      const { data, error } = await supabaseClient
        .from('claims')
        .insert(claim)
        .select()
      
      if (error) {
        console.error('Error inserting claim:', error)
        throw error
      }
      
      results.push(data[0])
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: results,
        message: results.length === 0 ? 'All claims already exist' : `Successfully imported ${results.length} new claims`
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Error in naswa-claims function:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})

