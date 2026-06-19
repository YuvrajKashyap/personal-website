export type ProjectStackListProps = Readonly<{
  items: readonly string[];
  label: string;
}>;

export function ProjectStackList({ items, label }: ProjectStackListProps) {
  return (
    <ul className="project-detail-stack" aria-label={label}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
