import { AdminPageHeader } from "@/components/admin/admin-header";

type AdminPageProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

export function AdminPage({ title, description, children }: AdminPageProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <AdminPageHeader title={title} description={description} />
      <main className="flex-1 overflow-y-auto">
        <div className="admin-content-container space-y-10 px-4 py-7 pb-[max(1.75rem,env(safe-area-inset-bottom))] sm:space-y-12 sm:px-6 sm:py-9 sm:pb-[max(2.25rem,env(safe-area-inset-bottom))] lg:px-8 lg:py-10 lg:pb-[max(2.5rem,env(safe-area-inset-bottom))]">
          {children}
        </div>
      </main>
    </div>
  );
}
