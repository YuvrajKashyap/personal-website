export type RouteStubProps = {
  eyebrow: string;
  title: string;
  description: string;
  status?: string;
};

export function RouteStub({
  eyebrow,
  title,
  description,
  status = "Foundation route stub",
}: RouteStubProps) {
  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-16 text-neutral-50">
      <section className="mx-auto flex min-h-[70vh] max-w-3xl flex-col justify-center">
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.28em] text-amber-300">
          {eyebrow}
        </p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
          {title}
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-neutral-300 sm:text-lg">
          {description}
        </p>
        <p className="mt-8 inline-flex w-fit rounded-full border border-neutral-800 bg-neutral-900 px-4 py-2 text-sm text-neutral-400">
          {status}
        </p>
      </section>
    </main>
  );
}
