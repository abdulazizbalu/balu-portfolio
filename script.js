const projects = [
  {
    name: "AI Campaign Orchestrator",
    tag: "AI Product",
    description: "Turns one business goal into a multi-channel campaign system with tasks, prompts, review gates, and exports.",
    demo: "https://abdulazizbalu.github.io/ai-campaign-orchestrator/",
    code: "https://github.com/abdulazizbalu/ai-campaign-orchestrator"
  },
  {
    name: "Smart Support Agent API",
    tag: "Backend AI",
    description: "Intent routing API for setup, pricing, and AI quality support questions.",
    demo: "https://abdulazizbalu.github.io/smart-support-agent-api/",
    code: "https://github.com/abdulazizbalu/smart-support-agent-api"
  },
  {
    name: "LLMOps Release Guard",
    tag: "AI DevOps",
    description: "CI-ready guardrail checker for AI service releases: health checks, env policy, model budget, and rollback readiness.",
    demo: "https://abdulazizbalu.github.io/llmops-release-guard/",
    code: "https://github.com/abdulazizbalu/llmops-release-guard"
  },
  {
    name: "AI Observability Kit",
    tag: "LLMOps",
    description: "Ops dashboard for AI latency, cost, error budget, token usage, and reliability signals.",
    demo: "https://abdulazizbalu.github.io/ai-observability-kit/",
    code: "https://github.com/abdulazizbalu/ai-observability-kit"
  },
  {
    name: "RAG Deploy Blueprint",
    tag: "DevOps",
    description: "Production-style deployment blueprint for RAG services with Docker, health checks, config validation, and runbooks.",
    demo: "https://abdulazizbalu.github.io/rag-deploy-blueprint/",
    code: "https://github.com/abdulazizbalu/rag-deploy-blueprint"
  },
  {
    name: "Media Command Center",
    tag: "Media Strategy",
    description: "Campaign dashboard for ranking content ideas and building weekly plans.",
    demo: "https://abdulazizbalu.github.io/media-command-center/",
    code: "https://github.com/abdulazizbalu/media-command-center"
  },
  {
    name: "Creator Insight Pipeline",
    tag: "Analytics",
    description: "Content analytics that turns views, saves, and shares into publishing recommendations.",
    demo: "https://abdulazizbalu.github.io/creator-insight-pipeline/",
    code: "https://github.com/abdulazizbalu/creator-insight-pipeline"
  },
  {
    name: "AI Prompt Studio",
    tag: "Prompt Engineering",
    description: "Browser tool for transforming rough ideas into structured AI prompts.",
    demo: "https://abdulazizbalu.github.io/ai-prompt-studio/",
    code: "https://github.com/abdulazizbalu/ai-prompt-studio"
  }
];

document.querySelector("#project-grid").innerHTML = projects.map((project) => `
  <article class="project-card">
    <span>${project.tag}</span>
    <h3>${project.name}</h3>
    <p>${project.description}</p>
    <div>
      <a href="${project.demo}" target="_blank" rel="noopener">Live demo</a>
      <a href="${project.code}" target="_blank" rel="noopener">Code</a>
    </div>
  </article>
`).join("");
