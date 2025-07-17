import { Database } from "@/integrations/supabase/types";

export type Table = Database['public']['Tables']['tables']['Row'];
export type Branch = Database['public']['Tables']['branches']['Row'];
