export type ResumeRole = Readonly<{
  id: string;
  role: string;
  organization: string;
  period: string;
  current?: boolean;
  bullets: readonly string[];
  skills: readonly string[];
}>;

export const resumeEducation = {
  school: "University of Texas at Dallas",
  degree:
    "B.S. Computer Science · Minor in Finance · Entrepreneurship & Innovation Certificate",
  credentials: ["Dean's List", "NCAA DII Tennis", "Class of 2027"],
} as const;

export const resumeRoles = [
  {
    id: "medceptor-swe-intern",
    role: "Software Engineering Intern",
    organization: "Medceptor",
    period: "Apr 2026 — Aug 2026",
    current: false,
    bullets: [
      "Enabled CNA/LPN market expansion by shipping 14+ PRs for core question-bank and exam workflows used by paying, recurring users of Medceptor's medical education platform.",
      "Built RN nursing question-bank and exam-mode workflows supporting 100+ generated questions, multiple question formats, track and level filtering, scoring and review flows, and internal QA.",
      "Carried features through implementation, automated testing, and release QA across Next.js, React, TypeScript, Django, and Supabase/Postgres.",
    ],
    skills: ["Next.js", "TypeScript", "Django", "Supabase/Postgres"],
  },
  {
    id: "cyc-vp-finance",
    role: "Engineering Lead & Senior Consultant",
    organization: "Consult Your Community · UT Dallas",
    period: "Jan 2026 — Present",
    current: true,
    bullets: [
      "Built Glydr's web-based gaming hub prototype, translating client requirements into a working product and owning technical deliverables from scoping through final handoff.",
    ],
    skills: ["Web prototyping", "Requirements scoping", "Technical delivery"],
  },
  {
    id: "uav-smart-city-researcher",
    role: "Undergraduate Researcher, UAV / Smart City Systems",
    organization: "University of Texas at Dallas",
    period: "Oct 2025 — Present",
    current: true,
    bullets: [
      "Built a geometry-driven UAV swarm simulation framework over a 4 km × 4 km OpenStreetMap/Blender urban environment to evaluate multi-agent path planning, visibility, and coverage under realistic city constraints.",
      "Modeled occlusions, non-convex obstacles, and sensing constraints with learning-guided coordination heuristics to study UAV behavior beyond simplified grid environments.",
    ],
    skills: ["Python", "Blender / OSM", "Multi-agent planning", "Simulation"],
  },
  {
    id: "peer-advisor-university-housing",
    role: "Peer Advisor, University Housing",
    organization: "University of Texas at Dallas",
    period: "May 2024 — Present",
    current: true,
    bullets: [
      "Serve as a Peer Advisor for 120+ residents, acting as the primary point of contact for academic, personal, and housing-related concerns.",
    ],
    skills: ["Leadership", "Communication", "Residence life"],
  },
  {
    id: "independent-sat-tutor",
    role: "SAT Tutor & Student Outreach",
    organization: "Independent · Dallas–Fort Worth",
    period: "May 2025 — Aug 2025",
    bullets: [
      "Drove direct outreach and sales conversations with prospective students, communicating the value of personalized SAT support and building interest in 1-on-1 tutoring.",
      "Delivered volunteer 1-on-1 SAT tutoring tailored to each student's learning goals, strengthening communication and relationship-building through direct student support.",
    ],
    skills: ["Sales outreach", "Prospecting", "Communication", "Teaching"],
  },
  {
    id: "nova-electrical-engineer",
    role: "Software Research Assistant, NOVA Autonomous Driving",
    organization: "University of Texas at Dallas",
    period: "Sep 2023 — Jun 2025",
    bullets: [
      "Built Python preprocessing pipelines for 3D sensor data, including voxel-grid point cloud downsampling that reduced scan size from 370,277 to 20,528 points while preserving geometric structure.",
      "Designed, maintained, and debugged primary and secondary power systems for an autonomous vehicle, including dual battery banks, high-voltage lines, and multiple I/O buses, translating hardware constraints into systems-level fixes.",
    ],
    skills: ["Python", "Point clouds", "Power systems", "Perception"],
  },
  {
    id: "aim-ai-ml-mentee",
    role: "Mentee, AIM: AI & Machine Learning Program",
    organization: "University of Texas at Dallas",
    period: "Sep 2023 — Apr 2024",
    bullets: [
      "Built CircuitSeer, a machine-learning model fine-tuned to solve physics circuit problems through domain-specific electrical reasoning.",
      "Developed the project through the AIM mentorship program, collaborating with a technical team to refine the model's problem-solving behavior and turn a machine-learning concept into a working project.",
    ],
    skills: ["Model fine-tuning", "Machine learning", "Physics reasoning", "Collaboration"],
  },
] as const satisfies readonly ResumeRole[];
