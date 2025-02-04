
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";
import { formSchema } from "@/pages/NewClaim";

interface AddressFieldsProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

export function AddressFields({ form }: AddressFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="state"
        render={({ field }) => (
          <FormItem>
            <FormLabel>State</FormLabel>
            <FormControl>
              <Input placeholder="California" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="pincode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Pincode</FormLabel>
            <FormControl>
              <Input placeholder="123456" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
