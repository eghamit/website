import { modules } from '@/lib/content';
import { Sidebar, type SidebarModule } from '@/components/Sidebar';

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  const nav: SidebarModule[] = modules.map((m) => ({
    id: m.id,
    title: m.title,
    icon: m.icon,
    lessons: m.lessons.map((l) => ({ slug: l.slug, title: l.title })),
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)] lg:overflow-y-auto lg:pr-2">
          <Sidebar modules={nav} />
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
