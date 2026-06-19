export function PageBackdrop() {
  return (
    <div className="page-backdrop" aria-hidden="true">
      <div className="page-backdrop-gradient" />
      <svg className="page-backdrop-orbits" viewBox="0 0 900 520" fill="none">
        <circle cx="686" cy="96" r="260" />
        <circle cx="686" cy="96" r="184" />
        <path d="M72 366C194 230 374 168 574 182C662 188 736 214 826 268" />
        <path d="M92 412C218 322 372 292 552 318C650 332 728 366 824 430" />
      </svg>
      <div className="page-backdrop-grid" />
    </div>
  );
}
