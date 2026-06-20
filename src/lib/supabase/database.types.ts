export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type PublicTable<Row, Insert = never, Update = never> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      admin_users: PublicTable<{
        id: string;
        user_id: string;
        email: string | null;
        display_name: string | null;
        role: "owner" | "admin" | "editor";
        status: "active" | "invited" | "disabled";
        created_at: string;
        updated_at: string;
      }>;
      site_settings: PublicTable<{
        id: string;
        key: string;
        value: Json;
        is_public: boolean;
        description: string | null;
        created_at: string;
        updated_at: string;
      }>;
      submissions: PublicTable<
        {
          id: string;
          submission_type: "contact" | "services" | "collaborate" | "general";
          status: "new" | "reviewed" | "archived" | "spam";
          name: string | null;
          email: string | null;
          subject: string | null;
          message: string | null;
          company: string | null;
          website: string | null;
          source_path: string | null;
          metadata: Json;
          created_at: string;
          updated_at: string;
        },
        {
          submission_type?: "contact" | "services" | "collaborate" | "general";
          status?: "new" | "reviewed" | "archived" | "spam";
          name?: string | null;
          email?: string | null;
          subject?: string | null;
          message?: string | null;
          company?: string | null;
          website?: string | null;
          source_path?: string | null;
          metadata?: Json;
        },
        {
          submission_type?: "contact" | "services" | "collaborate" | "general";
          status?: "new" | "reviewed" | "archived" | "spam";
          name?: string | null;
          email?: string | null;
          subject?: string | null;
          message?: string | null;
          company?: string | null;
          website?: string | null;
          source_path?: string | null;
          metadata?: Json;
        }
      >;
      projects: PublicTable<{
        id: string;
        slug: string;
        title: string;
        short_title: string | null;
        eyebrow: string | null;
        summary: string;
        description: string | null;
        category: string | null;
        type: string | null;
        status: string;
        priority: string | null;
        visibility: string;
        featured: boolean;
        featured_rank: number | null;
        order_index: number;
        randomizer_eligible: boolean;
        randomizer_bucket: string | null;
        randomizer_weight: number;
        tags: string[];
        stack: string[];
        highlights: string[];
        problem: string | null;
        solution: string | null;
        what_it_proves: string | null;
        timeline_label: string | null;
        started_at: string | null;
        shipped_at: string | null;
        updated_label: string | null;
        notes: string | null;
        attribution_notes: string | null;
        metadata: Json;
        created_at: string;
        updated_at: string;
        published_at: string | null;
      }>;
      project_links: PublicTable<{
        id: string;
        project_id: string;
        label: string;
        href: string;
        type: string | null;
        status: string;
        is_primary: boolean;
        external: boolean;
        note: string | null;
        sort_order: number;
        created_at: string;
        updated_at: string;
      }>;
      project_media: PublicTable<{
        id: string;
        project_id: string;
        type: string | null;
        src: string | null;
        alt: string | null;
        theme: string;
        status: string;
        note: string | null;
        sort_order: number;
        created_at: string;
        updated_at: string;
      }>;
      project_detail_sections: PublicTable<{
        id: string;
        project_id: string;
        section_key: string;
        title: string;
        body: string | null;
        items: Json;
        sort_order: number;
        is_public: boolean;
        created_at: string;
        updated_at: string;
      }>;
      project_randomizer_settings: PublicTable<{
        id: string;
        key: string;
        mode: string | null;
        button_behavior: string | null;
        settings: Json;
        is_active: boolean;
        created_at: string;
        updated_at: string;
      }>;
      project_randomizer_items: PublicTable<{
        id: string;
        project_id: string;
        bucket: string | null;
        weight: number;
        enabled: boolean;
        created_at: string;
        updated_at: string;
      }>;
    };
    Views: Record<string, never>;
    Functions: {
      is_site_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      is_site_owner_or_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type PublicTables = Database["public"]["Tables"];

export type TableRow<TableName extends keyof PublicTables> =
  PublicTables[TableName]["Row"];

export type TableInsert<TableName extends keyof PublicTables> =
  PublicTables[TableName]["Insert"];

// Manually maintained until a real Supabase project can generate canonical types.
export type SupabaseAdminUserRow = TableRow<"admin_users">;
export type SupabaseSiteSettingsRow = TableRow<"site_settings">;
export type SupabaseSubmissionRow = TableRow<"submissions">;
export type SupabaseSubmissionInsert = TableInsert<"submissions">;
export type SupabaseProjectRow = TableRow<"projects">;
export type SupabaseProjectLinkRow = TableRow<"project_links">;
export type SupabaseProjectMediaRow = TableRow<"project_media">;
export type SupabaseProjectDetailSectionRow =
  TableRow<"project_detail_sections">;
export type SupabaseProjectRandomizerSettingsRow =
  TableRow<"project_randomizer_settings">;
export type SupabaseProjectRandomizerItemRow =
  TableRow<"project_randomizer_items">;
