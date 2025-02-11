
-- Drop SSN-related functions
DROP FUNCTION IF EXISTS public.validate_ssn(text);
DROP FUNCTION IF EXISTS public.validate_ssn_format();
DROP FUNCTION IF EXISTS public.check_claim_eligibility(date, date);

-- Remove SSN column and related fields from claims table
ALTER TABLE public.claims 
DROP COLUMN IF EXISTS ssn,
DROP COLUMN IF EXISTS employment_start_date,
DROP COLUMN IF EXISTS employment_end_date,
DROP COLUMN IF EXISTS severance_package,
DROP COLUMN IF EXISTS severance_amount;

-- Drop related triggers
DROP TRIGGER IF EXISTS validate_ssn_format ON public.claims;
