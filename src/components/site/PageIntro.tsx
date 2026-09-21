export function PageIntro({
  eyebrow,
  title,
  script,
  children,
}: {
  eyebrow?: string;
  title: string;
  script?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="container-site pt-16 pb-10 text-center md:pt-24 md:pb-14">
      {eyebrow && <p className="eyebrow animate-fade-up">{eyebrow}</p>}
      <h1 className="mt-4 text-5xl animate-fade-up md:text-6xl">{title}</h1>
      {script && <p className="font-script mt-2 text-3xl text-primary animate-fade-up md:text-4xl">{script}</p>}
      {children && (
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground animate-fade-up md:text-lg">
          {children}
        </p>
      )}
    </section>
  );
}
