import { homeContent } from "@/features/home/home-content";

export function HeroRoleCycle() {
  return (
    <p
      aria-label={homeContent.roles.join(". ") + "."}
      className="home-role-cycle text-kicker"
    >
      <span aria-hidden="true" className="home-role-cycle__words">
        {homeContent.roles.map((role) => (
          <span className="home-role-cycle__word" key={role}>
            {role}.
          </span>
        ))}
      </span>
    </p>
  );
}
