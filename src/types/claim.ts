
export type Claim = {
  id: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  age: number;
  email: string;
  phone: string;
  state: string;
  pincode: string;
  ssn: string;
  employment_start_date: string;
  employment_end_date: string;
  claim_date: string;
  claim_status: string;
  separation_reason: "resignation" | "termination_misconduct" | "layoff" | "reduction_in_force" | "constructive_discharge" | "job_abandonment" | "severance_agreement";
  employer_name: string;
  reason_for_unemployment?: string;
  severance_package?: boolean;
  severance_amount?: number | null;
};
