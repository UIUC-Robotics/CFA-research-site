// ── Shared rendering components ────────────────────────────────────────────
import { getAreaColor, tintColor, areaUrl, facultyUrl } from './data.js';

// ── Area Card (home grid) ──────────────────────────────────────────────────

export function renderAreaCard(area, facultyList, capList) {
  const fc = facultyList.filter(f => f.areas.includes(area.id)).length;

  return `
    <a class="area-card" href="${areaUrl(area.id)}">
      <div class="area-card-top"></div>
      <div class="area-card-body">
        <div class="area-card-title">${area.title}</div>
        <div class="area-card-tagline">${area.tagline}</div>
        <div class="area-card-desc">${area.description}</div>
      </div>
      <div class="area-card-footer">
        <div class="area-count"><strong>${fc}</strong> faculty labs</div>
        <span class="area-card-arrow">→</span>
      </div>
    </a>`;
}

// ── Faculty Card ───────────────────────────────────────────────────────────

export function renderFacultyCard(f, areas) {
  const photoEl = f.photo
    ? `<img class="faculty-photo" src="${f.photo}" alt="${f.name}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
    : '';
  const placeholderStyle = f.photo ? 'display:none' : '';
  const nameEl = f.url
    ? `<a class="faculty-name" href="${f.url}" target="_blank" rel="noopener">${f.name} <span style="font-size:0.7em;opacity:0.6">↗</span></a>`
    : `<div class="faculty-name">${f.name}</div>`;

  const areaBadges = (f.areas || []).map(aId => {
    const a = areas.find(x => x.id === aId);
    if (!a) return '';
    return `<span class="area-badge">${a.title}</span>`;
  }).join('');

  const researchTags = (f.research || []).map(r =>
    `<span class="tag">${r}</span>`
  ).join('');

  return `
    <div class="faculty-card" data-areas="${(f.areas||[]).join(' ')}" data-name="${f.name.toLowerCase()}">
      ${photoEl}
      <div class="faculty-photo-placeholder" style="${placeholderStyle}">👤</div>
      <div class="faculty-card-info">
        ${nameEl}
        <div class="faculty-title">${f.title}</div>
        <div class="faculty-dept">${f.dept}</div>
        <div class="faculty-tags" style="margin-bottom:0.5rem">${areaBadges}</div>
        <div class="faculty-tags">${researchTags}</div>
      </div>
    </div>`;
}

// ── Capability Card ────────────────────────────────────────────────────────

function renderVideoBlock(videos, capId) {
  if (!videos || !videos.length) return '';
  if (videos.length === 1) {
    return renderSingleVideo(videos[0], capId, 0);
  }
  // Multiple clips → carousel
  const slides = videos.map((v, i) => `
    <div class="carousel-slide ${i === 0 ? 'active' : ''}" data-index="${i}">
      ${renderSingleVideo(v, capId, i)}
    </div>`).join('');
  const dots = videos.map((v, i) => `
    <button class="carousel-dot ${i === 0 ? 'active' : ''}" data-cap="${capId}" data-i="${i}" title="${v.caption || ''}"></button>
  `).join('');
  const captions = videos.map((v, i) => `
    <span class="carousel-caption ${i === 0 ? 'active' : ''}" data-cap="${capId}" data-ci="${i}">${v.caption || ''}</span>
  `).join('');
  return `
    <div class="carousel" id="carousel-${capId}">
      <div class="carousel-track">${slides}</div>
      <div class="carousel-controls">
        <button class="carousel-arrow left" data-cap="${capId}" data-dir="-1">‹</button>
        <div class="carousel-dots">${dots}</div>
        <button class="carousel-arrow right" data-cap="${capId}" data-dir="1">›</button>
      </div>
      <div class="carousel-captions">${captions}</div>
    </div>`;
}

function renderSingleVideo(v, capId, idx) {
  if (v.youtube) {
    return `<div class="video-embed">
      <iframe src="https://www.youtube.com/embed/${v.youtube}?rel=0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen></iframe>
    </div>`;
  }
  if (v.src) {
    const attrs = v.loop ? 'loop muted playsinline data-lazy-play' : 'controls preload="metadata" data-lazy-play';
    return `<div class="video-embed">
      <video ${attrs}>
        <source src="${v.src}" type="video/mp4">
      </video>
    </div>`;
  }
  return '';
}

export function initVideoObservers() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const video = entry.target;
      const slide = video.closest('.carousel-slide');
      if (slide && !slide.classList.contains('active')) return;
      if (entry.isIntersecting) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, { threshold: 0.4 });

  document.querySelectorAll('video[data-lazy-play]').forEach(video => {
    observer.observe(video);
    const embed = video.closest('.video-embed');
    if (embed && video.hasAttribute('loop')) {
      embed.addEventListener('mouseenter', () => video.play().catch(() => {}));
      embed.addEventListener('mouseleave', () => video.pause());
    }
  });
}

export function renderCapCard(cap, facultyList, areas) {
  const areaBadges = (cap.areas || []).map(aId => {
    const a = areas.find(x => x.id === aId);
    if (!a) return '';
    return `<span class="area-badge">${a.title}</span>`;
  }).join('');

  const techTags = (cap.tags || []).map(t => `<span class="tag">${t}</span>`).join('');

  const facultyLinks = (cap.faculty || []).map(fId => {
    const f = facultyList.find(x => x.id === fId);
    if (!f) return '';
    const lastName = f.name.split(' ').pop();
    const nameEl = f.url
      ? `<a class="cap-faculty-link" href="${f.url}" target="_blank" rel="noopener">${lastName}</a>`
      : `<span class="cap-faculty-link" style="text-decoration:none;cursor:default">${lastName}</span>`;
    return nameEl;
  }).join('<span style="color:var(--text-faint);margin:0 0.2rem">·</span>');

  const videoEl = renderVideoBlock(cap.videos, cap.id);

  const trlEl = cap.trl
    ? `<span class="trl-badge" title="Technology Readiness Level">TRL ${cap.trl}</span>`
    : '';

  return `
    <div class="cap-card" data-areas="${(cap.areas||[]).join(' ')}">
      <div class="cap-card-header">
        <div class="cap-title">${cap.title}</div>
        ${trlEl}
      </div>
      <div class="cap-desc">${cap.description}</div>
      ${videoEl}
      <div class="cap-tags">${areaBadges}</div>
      <div class="cap-tags">${techTags}</div>
      ${facultyLinks ? `<div class="label" style="margin-top:0.25rem;margin-bottom:0.25rem">Faculty</div><div class="cap-faculty">${facultyLinks}</div>` : ''}
    </div>`;
}

// ── Page shell helpers ─────────────────────────────────────────────────────

export function renderHeader(activePage = '') {
  const isSubPage = ['area', 'faculty', 'capabilities'].includes(activePage);
  const root = isSubPage ? '../' : '';
  return `
    <header class="site-header">
      <div class="inner">
        <a class="header-brand" href="${root}index.html">
          <div class="brand-mark">
            <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          </div>
          <div class="brand-text">
            <div class="brand-name">Center for Autonomy</div>
            <div class="brand-sub">University of Illinois Urbana-Champaign</div>
          </div>
        </a>
        <nav class="header-nav">
          <a class="nav-link ${activePage==='home'?'active':''}" href="${root}index.html">Areas</a>
          <a class="nav-link ${activePage==='capabilities'?'active':''}" href="${root}capabilities/">Capabilities</a>
          <a class="nav-link ${activePage==='faculty'?'active':''}" href="${root}faculty/">Faculty</a>
          <a class="nav-link external" href="https://autonomy.illinois.edu" target="_blank" rel="noopener">CFA Main Site</a>
        </nav>
      </div>
    </header>`;
}

export function renderFooter(root = '') {
  return `
    <footer class="site-footer">
      <div class="inner footer-inner">
        <div>
          <strong style="color:rgba(255,255,255,0.7)">Center for Autonomy</strong> ·
          University of Illinois Urbana-Champaign ·
          <a href="https://autonomy.illinois.edu">autonomy.illinois.edu</a>
        </div>
        <div class="footer-edit">
          To update content, edit the
          <a href="https://github.com/UIUC-Robotics/CFA-Research/tree/main/data" target="_blank">JSON files on GitHub ↗</a>
        </div>
      </div>
    </footer>`;
}

export function renderContact(root = '') {
  return `
    <section class="contact-section">
      <div class="inner contact-inner">
        <div class="contact-text">
          <h2>Explore a Collaboration</h2>
          <p>Interested in working with UIUC's Center for Autonomy on applied research, sponsored projects, or technology licensing?</p>
          <a class="contact-cta" href="mailto:mitras@illinois.edu">
            Contact Director →
          </a>
        </div>
      </div>
    </section>`;
}
