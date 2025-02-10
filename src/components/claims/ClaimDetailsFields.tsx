
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";
import { formSchema } from "@/pages/NewClaim";
import { EmployerFields } from "./employment/EmployerFields";
import { EmploymentDatesFields } from "./employment/EmploymentDatesFields";
import { ClaimDateField } from "./claim/ClaimDateField";
import { ClaimStatusFields } from "./claim/ClaimStatusFields";

interface ClaimDetailsFieldsProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

export function ClaimDetailsFields({ form }: ClaimDetailsFieldsProps) {
  return (
    <>
      <EmployerFields form={form} />
      <EmploymentDatesFields form={form} />
      <ClaimDateField form={form} />
      <ClaimStatusFields form={form} />
    </>
  );
}
