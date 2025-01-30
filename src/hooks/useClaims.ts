import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export type Claim = {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in_progress" | "approved" | "rejected";
  amount: number;
  created_at: string;
  updated_at: string;
  user_id: string;
};

export const useClaims = () => {
  const queryClient = useQueryClient();

  const { data: claims, isLoading } = useQuery({
    queryKey: ["claims"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("claims")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Claim[];
    },
  });

  const createClaim = useMutation({
    mutationFn: async (newClaim: Omit<Claim, "id" | "created_at" | "updated_at" | "user_id">) => {
      const { data, error } = await supabase
        .from("claims")
        .insert([newClaim])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["claims"] });
    },
  });

  const updateClaim = useMutation({
    mutationFn: async ({ id, ...claim }: Partial<Claim> & { id: string }) => {
      const { data, error } = await supabase
        .from("claims")
        .update(claim)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["claims"] });
    },
  });

  return {
    claims,
    isLoading,
    createClaim,
    updateClaim,
  };
};