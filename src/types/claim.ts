
export type ClaimDocument = {
  name: string;
  path: string;
  type: string;
  size: number;
};

export type Claim = {
  id: string;
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
  claim_status: string;
  separation_reason: "resignation" | "termination_misconduct" | "layoff" | "reduction_in_force" | "constructive_discharge" | "job_abandonment" | "severance_agreement";
  documents: ClaimDocument[];
  last_day_of_work: string | null;
  severance_package: boolean | null;
  severance_amount: number | null;
  reason_for_unemployment: string | null;
  employment_start_date: string | null;
  employment_end_date: string | null;
};
