(function () {
  const data = window.PORTFOLIO_DATA;
  if (!data) {
    return;
  }

  const projectList = data.projects || [];
  const gameProjects = projectList.filter((project) => project.category === "game");
  const nonGameProjects = projectList.filter((project) => project.category === "non-game");

  const heroTitle = document.getElementById("hero-title");
  const heroDescription = document.getElementById("hero-description");
  const heroMetrics = document.getElementById("hero-metrics");
  const stackGrid = document.getElementById("stack-grid");
  const gameProjectCards = document.getElementById("game-project-cards");
  const nonGameProjectCards = document.getElementById("non-game-project-cards");
  const projectDetailList = document.getElementById("project-detail-list");

  heroTitle.textContent = data.hero.title;
  heroDescription.textContent = data.hero.description;

  document.getElementById("game-project-count").textContent = `${gameProjects.length}개`;
  document.getElementById("non-game-project-count").textContent = `${nonGameProjects.length}개`;

  const uniqueStackCount = new Set(projectList.flatMap((project) => project.stack)).size;
  const totalImageCount = projectList.reduce((count, project) => count + project.images.length, 0);

  const metrics = [
    { label: "Projects", value: String(projectList.length).padStart(2, "0") },
    { label: "Game Focus", value: `${gameProjects.length} / ${projectList.length}` },
    { label: "Core Stacks", value: String(uniqueStackCount).padStart(2, "0") },
    { label: "Media Assets", value: String(totalImageCount).padStart(2, "0") },
  ];

  heroMetrics.innerHTML = metrics
    .map(
      (metric) => `
        <div class="metric-card">
          <strong>${metric.value}</strong>
          <span>${metric.label}</span>
        </div>
      `
    )
    .join("");

  stackGrid.innerHTML = data.techStack
    .map(
      (stack) => `
        <div class="stack-chip">
          <span>${stack}</span>
        </div>
      `
    )
    .join("");

  gameProjectCards.innerHTML = gameProjects.map(renderOverviewCard).join("");
  nonGameProjectCards.innerHTML = nonGameProjects.map(renderOverviewCard).join("");
  projectDetailList.innerHTML = projectList.map(renderDetailSection).join("");

  activateRevealAnimations();

  function renderOverviewCard(project) {
    return `
      <article class="overview-card reveal">
        <div class="card-topline">
          <span class="category-badge">${project.category === "game" ? "Game" : "Non-Game"}</span>
          <span class="period-badge">${project.period}</span>
        </div>
        <h4>${project.title}</h4>
        <p class="overview-intro">${project.intro}</p>
        <p class="overview-highlight">${project.highlight}</p>
        <div class="overview-meta">
          <span>${project.role}</span>
          <span>${project.stack.join(" · ")}</span>
        </div>
        <a class="card-link" href="#project-${project.slug}">상세 보기</a>
      </article>
    `;
  }

  function renderDetailSection(project) {
    const detailHtml = project.details
      .map((paragraph) => `<p>${paragraph}</p>`)
      .join("");

    const troubleshootingHtml =
      project.troubleshooting && project.troubleshooting.length
        ? `
          <section class="project-subsection">
            <div class="subsection-title-row">
              <p class="eyebrow">Troubleshooting</p>
              <h4>트러블슈팅</h4>
            </div>
            ${project.troubleshooting.map((paragraph) => `<p>${paragraph}</p>`).join("")}
          </section>
        `
        : "";

    const galleryHtml = `
      <details class="gallery-panel">
        <summary>서비스 이미지 ${project.images.length}장 보기</summary>
        <div class="gallery-grid">
          ${project.images
            .map(
              (image) => `
                <figure class="gallery-item">
                  <img src="${image.src}" alt="${image.alt}" loading="lazy" />
                  <figcaption>${image.caption}</figcaption>
                </figure>
              `
            )
            .join("")}
        </div>
      </details>
    `;

    return `
      <article id="project-${project.slug}" class="project-shell reveal">
        <div class="project-header">
          <div>
            <p class="eyebrow">${project.category === "game" ? "Game Project" : "Non-Game Project"}</p>
            <h3>${project.title}</h3>
            <p class="project-summary">${project.intro}</p>
          </div>
          <p class="project-highlight">${project.highlight}</p>
        </div>

        <div class="project-layout">
          <aside class="project-meta-panel">
            <dl class="meta-list">
              <div>
                <dt>기간</dt>
                <dd>${project.period}</dd>
              </div>
              <div>
                <dt>팀 구성</dt>
                <dd>${project.team}</dd>
              </div>
              <div>
                <dt>역할</dt>
                <dd>${project.role}</dd>
              </div>
              <div>
                <dt>담당 범위</dt>
                <dd>${project.scope}</dd>
              </div>
              <div>
                <dt>기술 스택</dt>
                <dd>${project.stack.join(", ")}</dd>
              </div>
            </dl>
          </aside>

          <div class="project-body">
            <section class="project-subsection">
              <div class="subsection-title-row">
                <p class="eyebrow">Project Detail</p>
                <h4>프로젝트 상세</h4>
              </div>
              ${detailHtml}
            </section>
            ${troubleshootingHtml}
            <section class="project-subsection">
              <div class="subsection-title-row">
                <p class="eyebrow">Gallery</p>
                <h4>서비스 이미지</h4>
              </div>
              ${galleryHtml}
            </section>
          </div>
        </div>
      </article>
    `;
  }

  function activateRevealAnimations() {
    const revealTargets = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      revealTargets.forEach((target) => target.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.18,
      }
    );

    revealTargets.forEach((target) => observer.observe(target));
  }
})();
