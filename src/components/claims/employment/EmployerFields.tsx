
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";
import { formSchema } from "@/pages/NewClaim";

interface EmployerFieldsProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

export function EmployerFields({ form }: EmployerFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="employerName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Employer Name</FormLabel>
            <FormControl>
              <Input placeholder="Company Inc." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="ssn"
        render={({ field }) => (
          <FormItem>
            <FormLabel>SSN</FormLabel>
            <FormControl>
              <Input placeholder="123-45-6789" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
