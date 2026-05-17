import type { ReactNode } from "react";

type AIResponseCardProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export function AIResponseCard({
  children,
  description,
  title
}: AIResponseCardProps) {
  return (
    <section className="h-fit rounded-3xl border border-slate-200 bg-white shadow-subtle">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-base font-semibold tracking-normal text-slate-950">
          {title}
        </h2>
        {description ? (
          <p className="mt-1 text-sm leading-5 text-slate-500">
            {description}
          </p>
        ) : null}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}
