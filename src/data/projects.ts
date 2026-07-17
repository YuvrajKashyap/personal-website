import type { Project } from "@/types/project";

export const projects = [
  {
    id: "project_aletheia",
    slug: "aletheia",
    title: "Aletheia",
    shortTitle: "Aletheia",
    eyebrow: "Flagship build",
    summary:
      "Hybrid retrieval, reranking, evaluation, and search observability platform.",
    description:
      "Aletheia is a technical system for retrieval quality, evaluation loops, search observability, and AI-assisted knowledge workflows.",
    category: "ai_systems",
    type: "platform",
    status: "active_build",
    priority: "flagship",
    visibility: "published",
    featured: true,
    featuredRank: 1,
    order: 10,
    randomizerEligible: true,
    randomizerBucket: "flagship",
    randomizerWeight: 1.2,
    tags: ["AI systems", "Retrieval", "Search", "Evaluation"],
    stack: [
      "Python",
      "FastAPI",
      "PostgreSQL",
      "Redis/RQ",
      "OpenSearch",
      "Qdrant",
      "SQLAlchemy",
      "Alembic",
      "Docker",
      "Next.js",
    ],
    highlights: [
      "Hybrid retrieval system direction",
      "Reranking and evaluation workflow",
      "Search observability surface",
    ],
    problem:
      "Modern search and retrieval systems need more than keyword matching. Retrieval quality, ranking behavior, evaluation feedback, and observability need to be visible in one system.",
    solution:
      "A hybrid retrieval and search observability platform direction that combines API surfaces, retrieval backends, background jobs, database state, and evaluation-oriented architecture.",
    whatItProves:
      "Ability to design AI and search infrastructure beyond a simple chatbot wrapper.",
    detailSections: [
      {
        eyebrow: "Architecture",
        title: "Retrieval quality as an observable system",
        body: "The project is framed around retrieval, reranking, evaluation, and operational visibility rather than a single chat surface.",
      },
      {
        eyebrow: "System Shape",
        title: "Backend, index, and evaluation loops",
        body: "The stack points toward API services, database state, background queues, vector search, keyword search, and evaluation workflows working together.",
      },
    ],
    timelineLabel: "Active build",
    links: [
      {
        label: "GitHub repo",
        href: "https://github.com/YuvrajKashyap/aletheia",
        type: "repo",
        isPrimary: true,
        status: "verified",
        external: true,
      },
    ],
    media: [],
  },
  {
    id: "project_atlas",
    slug: "atlas",
    title: "Atlas",
    shortTitle: "Atlas",
    eyebrow: "Flagship build",
    summary:
      "Distributed crawl, extract, index, and search platform for ethical public web content.",
    description:
      "Atlas is a data infrastructure direction for crawling, extraction, indexing, and search across public web content with an emphasis on responsible collection.",
    category: "search_infrastructure",
    type: "platform",
    status: "active_build",
    priority: "flagship",
    visibility: "published",
    featured: true,
    featuredRank: 2,
    order: 20,
    randomizerEligible: true,
    randomizerBucket: "systems",
    randomizerWeight: 1.15,
    tags: ["Crawling", "Search", "Indexing", "Data infrastructure"],
    stack: [
      "Python",
      "FastAPI",
      "PostgreSQL",
      "Redis",
      "OpenSearch",
      "Docker",
      "Next.js",
    ],
    highlights: [
      "Distributed crawl pipeline direction",
      "Extraction and indexing workflow",
      "Search platform architecture",
    ],
    problem:
      "Search experiences depend on reliable ingestion, extraction, indexing, and retrieval pipelines.",
    solution:
      "A distributed crawl, extract, index, and search system for ethical public web content using backend services, queues, storage, and search infrastructure.",
    whatItProves:
      "Ability to reason about data pipelines, indexing, and search systems end to end.",
    detailSections: [
      {
        eyebrow: "Pipeline",
        title: "Crawl to retrieval without skipping the middle",
        body: "Atlas keeps ingestion, extraction, indexing, and retrieval as distinct parts of one system rather than treating search as a final UI-only layer.",
      },
      {
        eyebrow: "Boundary",
        title: "Responsible public web direction",
        body: "The public copy stays focused on ethical public content and system architecture. It does not claim broad production scale or private dataset access.",
      },
    ],
    timelineLabel: "Active build",
    links: [],
    media: [],
  },
  {
    id: "project_personal_website",
    slug: "personal-website",
    title: "Personal Website",
    shortTitle: "Website",
    eyebrow: "Live build",
    summary:
      "Cinematic personal operating interface for identity, projects, tracker, services, collaboration, and current-state signal.",
    description:
      "The personal website is a live Next.js system for public identity, project signal, theme-aware visual direction, and a future admin-backed operating layer.",
    category: "personal_os",
    type: "website",
    status: "live",
    priority: "flagship",
    visibility: "published",
    featured: true,
    featuredRank: 3,
    order: 30,
    randomizerEligible: true,
    randomizerBucket: "flagship",
    randomizerWeight: 1.2,
    tags: ["Next.js", "Design system", "Motion", "Personal OS"],
    stack: [
      "Next.js App Router",
      "TypeScript",
      "Tailwind CSS v4",
      "Motion",
      "Vercel",
    ],
    highlights: [
      "Dark and light visual systems",
      "Cinematic Home gateway",
      "Typed content and component foundations",
    ],
    problem:
      "A normal portfolio does not communicate trajectory, taste, current state, and builder identity strongly enough.",
    solution:
      "A cinematic personal operating interface with dual visual systems, project archive, tracker, services, collaboration, and admin-ready architecture.",
    whatItProves:
      "Ability to combine frontend craft, product architecture, visual systems, deployment, and personal positioning.",
    detailSections: [
      {
        eyebrow: "Experience",
        title: "Two visual systems, one app",
        body: "The site keeps Singularity OS and Ivory Observatory inside one route structure, one content layer, and one theme-aware architecture.",
      },
      {
        eyebrow: "Production",
        title: "A live system with future backend boundaries",
        body: "The current implementation is deployed on Vercel with local typed content, reusable components, motion foundations, and a documented future admin boundary.",
      },
    ],
    timelineLabel: "Live and evolving",
    links: [
      {
        label: "Live site",
        href: "https://yuvrajkashyap.com",
        type: "live",
        isPrimary: true,
        status: "verified",
        external: true,
      },
      {
        label: "GitHub repo",
        href: "https://github.com/YuvrajKashyap/personal-website",
        type: "repo",
        status: "verified",
        external: true,
      },
    ],
    media: [],
  },
  {
    id: "project_capital",
    slug: "capital",
    title: "Capital",
    shortTitle: "Capital",
    eyebrow: "Product system",
    summary:
      "Private financial command center for account state, cash flow, spending intent, and net worth.",
    description:
      "Capital is a private, single-owner finance application that combines connected account data, a manual monthly ledger, recurring analysis, alerts, and digest reporting in one operating interface.",
    category: "product_system",
    type: "app",
    status: "portfolio_ready",
    priority: "strong",
    visibility: "published",
    featured: true,
    featuredRank: 4,
    order: 40,
    randomizerEligible: true,
    randomizerBucket: "product",
    randomizerWeight: 1,
    tags: ["Fintech", "Data systems", "Product design", "Automation"],
    stack: [
      "TypeScript",
      "Next.js",
      "Supabase Auth",
      "Supabase Postgres",
      "Plaid",
      "Vercel Cron",
      "Resend",
      "Web Push",
    ],
    highlights: [
      "Plaid synchronization with encrypted provider token storage",
      "Owner-scoped Supabase data model with server-only privileged paths",
      "Responsive analytics, manual ledger, alerts, and digest workflows",
    ],
    problem:
      "Personal financial context is fragmented across institutions, statements, notifications, and separate planning tools, making it difficult to explain what changed and why.",
    solution:
      "A server-first command center that unifies account state, transactions, intentional monthly planning, recurring behavior, historical trends, net worth, and scheduled summaries for one authenticated owner.",
    whatItProves:
      "Full-stack product ownership across a high-trust data model, third-party integrations, financial analysis, privacy boundaries, and a distinctive responsive interface.",
    detailSections: [
      {
        eyebrow: "Product Model",
        title: "Explain change, not just balances",
        body: "The product connects balances and transactions to manual spending intent, recurring patterns, cash-flow trends, net-worth history, and digest reporting so the owner can understand movement across the whole system.",
      },
      {
        eyebrow: "Architecture",
        title: "Server-first financial operations",
        body: "Next.js routes and server services coordinate Supabase Auth and Postgres, Plaid synchronization, webhook handling, alert evaluation, Resend email, Web Push, and authenticated Vercel Cron work.",
      },
      {
        eyebrow: "Security Boundary",
        title: "Narrow owner access",
        body: "There is no public sign-up. User-facing data is owner-scoped, privileged provider work stays server-side, and Plaid access tokens are encrypted before persistence.",
      },
      {
        eyebrow: "Presentation",
        title: "Public proof, private product",
        body: "The public case study contains privacy-reviewed synthetic screenshots and technical documentation. The connected app, source, credentials, and production deployment remain private.",
      },
    ],
    timelineLabel: "Private product / public case study",
    updatedAt: "2026-07-17",
    notes:
      "Capital is personal finance software, not a public banking product or financial institution. The screenshots use fictional synthetic data from an isolated read-only presentation build.",
    links: [
      {
        label: "View public case study",
        href: "https://github.com/YuvrajKashyap/capital-case-study",
        type: "case_study",
        isPrimary: true,
        status: "verified",
        external: true,
        note: "Sanitized documentation and synthetic screenshots. The connected application remains private.",
      },
    ],
    media: [
      {
        type: "cover",
        src: "/media/projects/capital/overview.jpg",
        alt: "Capital synthetic financial overview with net worth, liquidity, investments, liabilities, and account health",
        theme: "both",
        status: "ready",
        note: "Fictional synthetic data from an isolated read-only presentation build.",
      },
    ],
  },
  {
    id: "project_dallas_3d_city_model",
    slug: "dallas-3d-city-model",
    title: "Dallas 3D Urban Geometry Lab",
    shortTitle: "Dallas 3D",
    eyebrow: "Geospatial research",
    summary:
      "Reproducible downtown Dallas model for height provenance, line-of-sight coverage, and A* routing.",
    description:
      "Dallas 3D turns 1,553 OpenStreetMap building footprints into a traceable LOD1-style city model, then uses the geometry for sampled visibility coverage and fixed-altitude path-planning experiments.",
    category: "product_system",
    type: "experiment",
    status: "portfolio_ready",
    priority: "strong",
    visibility: "published",
    featured: true,
    featuredRank: 5,
    order: 45,
    randomizerEligible: true,
    randomizerBucket: "systems",
    randomizerWeight: 1,
    tags: [
      "Geospatial",
      "Computational geometry",
      "3D modeling",
      "Path planning",
    ],
    stack: [
      "Python",
      "GeoPandas",
      "Shapely",
      "Trimesh",
      "OSMnx",
      "Blender",
      "Pytest",
      "GitHub Actions",
    ],
    highlights: [
      "Deterministic height enrichment with source and confidence on all 1,553 buildings",
      "Six greedy observer samples cover 93.33% of 240 sampled targets",
      "A* produces a 4.99 km route through an altitude-dependent obstacle grid",
    ],
    problem:
      "A visually varied city mesh is not enough for defensible geometry research when most building heights are missing and generated values are not traceable.",
    solution:
      "A reproducible pipeline that validates and projects OSM geometry, labels every height by provenance, exports an inspectable city mesh, and runs transparent 2.5D coverage and routing baselines.",
    whatItProves:
      "Ability to connect geospatial data engineering, computational geometry, algorithm design, 3D tooling, research boundaries, and reproducible presentation.",
    detailSections: [
      {
        eyebrow: "Data Integrity",
        title: "Uncertainty stays visible",
        body: "Explicit OSM heights receive high confidence, levels-derived heights receive medium confidence, and the deterministic typology-and-area fallback remains labeled low confidence instead of manufacturing random high-rises.",
      },
      {
        eyebrow: "Visibility",
        title: "Coverage through real building prisms",
        body: "A 2.5D ray test evaluates sampled aerial observer-to-ground-target lines against building footprints and heights, then a greedy set-cover baseline selects six observers with 93.33% sampled coverage.",
      },
      {
        eyebrow: "Path Planning",
        title: "Altitude changes the obstacle field",
        body: "The fixed-altitude experiment rasterizes buildings that violate vertical clearance and applies eight-neighbor A* to produce a 4.99 km route with a 1.015× detour ratio.",
      },
      {
        eyebrow: "Research Boundary",
        title: "A geometry lab, not flight guidance",
        body: "The project documents its flat-terrain, flat-roof, sampled-coverage, and fixed-altitude assumptions and does not claim legal, safe, continuous, or globally optimal UAV operation.",
      },
    ],
    timelineLabel: "Research system / portfolio ready",
    updatedAt: "2026-07-17",
    notes:
      "Experiment metrics are reproducible outputs from the checked-in configuration. They are not real-world flight-performance claims.",
    attributionNotes:
      "Building footprints and tags © OpenStreetMap contributors, available under the ODbL.",
    links: [
      {
        label: "GitHub repo",
        href: "https://github.com/YuvrajKashyap/dallas-3d-city-model",
        type: "repo",
        isPrimary: true,
        status: "verified",
        external: true,
      },
    ],
    media: [
      {
        type: "cover",
        src: "/media/projects/dallas-3d-city-model/overview.webp",
        alt: "Oblique Blender render of the Dallas LOD1 building model with an A-star route and selected visibility observers",
        theme: "both",
        status: "ready",
        note: "Building data © OpenStreetMap contributors, ODbL.",
      },
    ],
  },
  {
    id: "project_axis",
    slug: "axis",
    title: "Axis",
    shortTitle: "Axis",
    eyebrow: "Product system",
    summary:
      "Personal alignment and orbital operating system direction for life, routines, and focus.",
    description:
      "Axis is a conservative project entry for a personal alignment interface. The public content should stay restrained until the project is reviewed for portfolio readiness.",
    category: "personal_os",
    type: "system",
    status: "needs_review",
    priority: "strong",
    visibility: "draft",
    featured: false,
    order: 50,
    randomizerEligible: false,
    randomizerBucket: "product",
    randomizerWeight: 0.8,
    tags: ["Personal OS", "Alignment", "Routines", "Focus"],
    stack: ["Next.js", "TypeScript", "Supabase"],
    highlights: [
      "Personal operating system direction",
      "Alignment and routine interface concepts",
      "Orbital product language",
    ],
    problem:
      "Personal growth and execution can become scattered without an operating layer for alignment and direction.",
    solution:
      "A personal alignment and orbital operating system concept focused on goals, focus, systems, and direction.",
    whatItProves:
      "Product thinking around personal systems and operating interfaces.",
    detailSections: [
      {
        eyebrow: "Status",
        title: "Draft surface with a clear boundary",
        body: "Axis is represented as a needs-review project. The page can explain the concept without presenting it as a finished public product.",
      },
      {
        eyebrow: "Interface Direction",
        title: "Personal systems as product language",
        body: "The project explores how routines, goals, focus, and direction can be organized through an operating interface.",
      },
    ],
    timelineLabel: "Needs review",
    links: [
      {
        label: "Possible live site",
        href: "https://axis.yuvrajkashyap.com",
        type: "live",
        status: "needs_review",
        external: true,
        note: "Possible project URL. Do not show as verified until reviewed.",
      },
    ],
    media: [],
  },
  {
    id: "project_arcade",
    slug: "arcade",
    title: "Arcade",
    shortTitle: "Arcade",
    eyebrow: "Supporting build",
    summary:
      "Browser arcade direction with multiple games and transparent attribution boundaries.",
    description:
      "Arcade is a supporting fun-build entry. Public copy must distinguish original coded work from any external or embedded exceptions.",
    category: "frontend_experience",
    type: "website",
    status: "needs_review",
    priority: "supporting",
    visibility: "draft",
    featured: false,
    order: 60,
    randomizerEligible: false,
    randomizerBucket: "experimental",
    randomizerWeight: 0.7,
    tags: ["Frontend", "Games", "Browser UI", "Creative build"],
    stack: ["TypeScript", "React", "Frontend games"],
    highlights: [
      "Browser game surface direction",
      "Multiple gameplay experiments",
      "Attribution-aware portfolio handling",
    ],
    problem:
      "Small interactive browser projects are a useful way to practice frontend structure, interaction, and game-like UI surfaces.",
    solution:
      "A browser arcade surface that collects playable web experiences while handling externally sourced or embedded exceptions transparently.",
    attributionNotes:
      "Do not overclaim third-party, embedded, or open-source game work. Public UI must call out exceptions clearly when reviewed.",
    whatItProves:
      "Creative frontend implementation, interaction design, and transparent attribution discipline.",
    detailSections: [
      {
        eyebrow: "Boundary",
        title: "Attribution is part of the system",
        body: "Arcade is useful as a frontend interaction surface only when externally sourced, embedded, or open-source exceptions stay clearly identified.",
      },
      {
        eyebrow: "Interface",
        title: "Practice in playable browser surfaces",
        body: "The project is framed as interaction practice and product-surface organization, not as a claim that every game is fully original.",
      },
    ],
    timelineLabel: "Needs review",
    links: [
      {
        label: "Possible live site",
        href: "https://arcade.yuvrajkashyap.com",
        type: "live",
        status: "needs_review",
        external: true,
        note: "Possible project URL. Do not show as verified until reviewed.",
      },
    ],
    media: [],
  },
  {
    id: "project_beyond_chat",
    slug: "beyond-chat",
    title: "Beyond Chat",
    shortTitle: "Beyond Chat",
    eyebrow: "AI workspace",
    summary: "Artifact-centric AI workspace direction.",
    description:
      "Beyond Chat is a conservative project entry for an artifact-centric AI workspace using a modern frontend, API layer, and AI search integrations.",
    category: "ai_systems",
    type: "app",
    status: "draft",
    priority: "strong",
    visibility: "draft",
    featured: false,
    order: 70,
    randomizerEligible: false,
    randomizerBucket: "experimental",
    randomizerWeight: 0.8,
    tags: ["AI workspace", "Artifacts", "Frontend", "API"],
    stack: ["React", "TypeScript", "FastAPI", "Supabase", "OpenRouter", "Tavily"],
    highlights: [
      "Artifact-centric workspace direction",
      "AI-assisted workflow surface",
      "Frontend and API architecture",
    ],
    problem:
      "AI workflows often get trapped in plain chat interfaces.",
    solution:
      "An artifact-centric AI workspace direction exploring structured outputs, search tooling, and workspace-style interaction.",
    whatItProves:
      "Ability to think beyond chat UI into artifact and workspace AI product patterns.",
    detailSections: [
      {
        eyebrow: "Product Shape",
        title: "Artifacts instead of only conversation",
        body: "Beyond Chat is framed around structured workspace output and tool-assisted interaction rather than treating chat as the whole product.",
      },
      {
        eyebrow: "Boundary",
        title: "Draft direction, not adoption claim",
        body: "The public page describes the product pattern and technical direction without claiming usage, release status, or external validation.",
      },
    ],
    timelineLabel: "Draft",
    links: [],
    media: [],
  },
] satisfies Project[];
