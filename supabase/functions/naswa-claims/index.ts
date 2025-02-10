
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

type ClaimStatus = 'initial_review' | 'in_progress' | 'rejected';
type SeparationReason = 'layoff' | 'reduction_in_force' | 'constructive_discharge' | 'severance_agreement' | 'job_abandonment';

type MockClaim = {
  first_name: string;
  middle_name: string | null;
  last_name: string;
  age: number;
  state: string;
  pincode: string;
  ssn: string;
  email: string;
  phone: string;
  employer_name: string;
  claim_date: string;
  claim_status: ClaimStatus;
  separation_reason: SeparationReason;
  employment_start_date: string;
  employment_end_date: string;
  severance_package: boolean;
  documents: any[];
  user_id: string | null;
  reason_for_unemployment: string | null;
  severance_amount: number | null;
  last_day_of_work: string | null;
  rejection_reason: string | null;
}

function generateMockClaims(): MockClaim[] {
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
  const separationReasons: SeparationReason[] = ["layoff", "reduction_in_force", "constructive_discharge", "severance_agreement", "job_abandonment"];
  const reasons = [
    "Company downsizing",
    "Department reorganization",
    "Position elimination",
    "Business closure",
    "Economic conditions"
  ];
  
  // Current date for reference
  const currentDate = new Date();
  
  // Helper function to generate dates
  const generateEmploymentDates = (isEligible: boolean) => {
    const endDate = new Date(currentDate);
    endDate.setDate(endDate.getDate() - Math.floor(Math.random() * 30)); // End date within last 30 days
    
    const startDate = new Date(endDate);
    if (isEligible) {
      // For eligible claims: 120-365 days of employment
      startDate.setDate(startDate.getDate() - (120 + Math.floor(Math.random() * 245)));
    } else {
      // For ineligible claims: 30-119 days of employment
      startDate.setDate(startDate.getDate() - (30 + Math.floor(Math.random() * 89)));
    }
    
    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    };
  };
  
  return Array.from({ length: 5 }, (_, i) => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const isEligible = i < 2; // First 2 claims will be eligible, last 3 won't
    const { startDate, endDate } = generateEmploymentDates(isEligible);
    const hasSeverance = Math.random() > 0.5;
    
    // Explicitly set claim_status as "initial_review" for all new claims
    const claim: MockClaim = {
      first_name: firstName,
      middle_name: Math.random() > 0.5 ? `${firstName[0]}` : null, // Make middle name optional
      last_name: lastName,
      age: Math.floor(Math.random() * (65 - 18) + 18),
      state: states[Math.floor(Math.random() * states.length)],
      pincode: Math.floor(Math.random() * 90000 + 10000).toString(),
      ssn: `${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 90 + 10)}-${Math.floor(Math.random() * 9000 + 1000)}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      phone: `${Math.floor(Math.random() * 900 + 100)}${Math.floor(Math.random() * 900 + 100)}${Math.floor(Math.random() * 9000 + 1000)}`,
      employer_name: employers[Math.floor(Math.random() * employers.length)],
      claim_date: new Date().toISOString().split('T')[0],
      claim_status: 'initial_review', // Explicitly set initial status
      separation_reason: separationReasons[Math.floor(Math.random() * separationReasons.length)],
      employment_start_date: startDate,
      employment_end_date: endDate,
      last_day_of_work: endDate,
      severance_package: hasSeverance,
      severance_amount: hasSeverance ? Math.floor(Math.random() * 50000 + 10000) : null,
      documents: [],
      user_id: null,
      reason_for_unemployment: reasons[Math.floor(Math.random() * reasons.length)],
      rejection_reason: null
    };
    
    return claim;
  });
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Creating Supabase client...')
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Generating and processing new mock claims...')
    const mockClaims = generateMockClaims();
    
    const results = []
    for (const claim of mockClaims) {
      console.log(`Processing claim for ${claim.first_name} ${claim.last_name}...`)
      
      // Validate claim_status before insertion
      if (!claim.claim_status) {
        console.error('Missing claim_status for claim:', claim)
        continue
      }

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
      
      console.log('Successfully inserted claim:', data[0].id)
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
