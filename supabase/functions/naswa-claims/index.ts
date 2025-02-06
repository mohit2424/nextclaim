
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const mockClaims = [
  {
    first_name: "John",
    middle_name: "Robert",
    last_name: "Doe",
    age: 35,
    state: "California",
    pincode: "90210",
    ssn: "123-45-6789",
    email: "john.doe@example.com",
    phone: "1234567890",
    employer_name: "Tech Corp Inc",
    claim_date: new Date().toISOString().split('T')[0],
    claim_status: "initial_review",
    separation_reason: "layoff",
    last_day_of_work: new Date().toISOString().split('T')[0],
    severance_package: false,
    reason_for_unemployment: "Company restructuring"
  },
  {
    first_name: "Jane",
    middle_name: "Marie",
    last_name: "Smith",
    age: 42,
    state: "California",
    pincode: "94105",
    ssn: "987-65-4321",
    email: "jane.smith@example.com",
    phone: "9876543210",
    employer_name: "Finance Solutions LLC",
    claim_date: new Date().toISOString().split('T')[0],
    claim_status: "initial_review",
    separation_reason: "reduction_in_force",
    last_day_of_work: new Date().toISOString().split('T')[0],
    severance_package: true,
    severance_amount: 10000,
    reason_for_unemployment: "Position eliminated"
  }
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Processing mock claims...')
    
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

      // Insert new claim
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

    // Return success even if some claims were skipped
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
