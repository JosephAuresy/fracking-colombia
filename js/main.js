// Nav scroll effect
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.style.boxShadow = window.scrollY > 50
    ? '0 2px 20px rgba(0,0,0,0.4)'
    : 'none';
});

// Smooth scroll for nav links
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      const offset = 70;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// Intersection Observer — fade in sections
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll(
  '.stat-card, .source-card, .eco-card, .seismic-card, .annotation, .pillar, .question-item, .country-card, .tl-item'
).forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(18px)';
  el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
  observer.observe(el);
});

// Bar chart animate on scroll
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.bar-fill').forEach((bar, i) => {
        setTimeout(() => {
          bar.style.opacity = '1';
        }, i * 150);
      });
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.bar-chart').forEach(el => barObserver.observe(el));

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinks.forEach(link => {
    link.style.color = link.getAttribute('href') === `#${current}`
      ? 'var(--sand)'
      : '';
  });
});

// Map tabs
document.querySelectorAll('.map-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.map-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.map-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
  });
});

// Glossary search
const glossSearch = document.getElementById('glossarySearch');
if (glossSearch) {
  glossSearch.addEventListener('input', () => {
    const q = glossSearch.value.toLowerCase().trim();
    document.querySelectorAll('.gloss-card').forEach(card => {
      const text = (card.textContent + ' ' + (card.dataset.terms || '')).toLowerCase();
      card.classList.toggle('hidden', q.length > 1 && !text.includes(q));
    });
  });
}

// ============ ABBREVIATION TOOLTIP SYSTEM ============
// Define all terms: { abbr, full, tip, glossaryId }
const ABBR_DEFS = [
  {
    abbr: 'VMM',
    full: 'Valle Medio del Magdalena (VMM)',
    tip: 'Valle Medio del Magdalena — cuenca sedimentaria entre las cordilleras Central y Oriental. Principal zona de interés para fracking en Colombia.',
    glossaryId: 'vmm'
  },
  {
    abbr: 'PFAS',
    full: 'PFAS (sustancias per- y polifluoroalquílicas)',
    tip: '"Químicos eternos" — no se degradan en la naturaleza. Usados en fluidos de fracking. Vinculados a cáncer y problemas de fertilidad.',
    glossaryId: 'pfas'
  },
  {
    abbr: 'EPA',
    full: 'EPA (Agencia de Protección Ambiental de EE.UU.)',
    tip: 'Agencia federal de EE.UU. que establece estándares ambientales. Sus normas han servido como referencia técnica para Colombia y Latinoamérica.',
    glossaryId: 'epa'
  },
  {
    abbr: 'ANH',
    full: 'ANH (Agencia Nacional de Hidrocarburos)',
    tip: 'Entidad colombiana que otorga contratos de exploración y producción de hidrocarburos, incluyendo bloques no convencionales.',
    glossaryId: 'ecopetrol'
  },
  {
    abbr: 'ANLA',
    full: 'ANLA (Autoridad Nacional de Licencias Ambientales)',
    tip: 'Entidad colombiana que aprueba las licencias ambientales para proyectos de extracción, incluyendo fracking.',
    glossaryId: 'ecopetrol'
  },
  {
    abbr: 'SGC',
    full: 'SGC (Servicio Geológico Colombiano)',
    tip: 'Entidad que opera la Red Sísmica Nacional de Colombia y desarrolló la escala de magnitud local para el VMM.',
    glossaryId: 'sismo'
  },
  {
    abbr: 'TxPWC',
    full: 'TxPWC (Texas Produced Water Consortium)',
    tip: 'Consorcio creado por ley estatal de Texas (SB601, 2021) para evaluar la reutilización del agua producida del fracking.',
    glossaryId: null
  },
  {
    abbr: 'YNC',
    full: 'YNC (Yacimiento No Convencional)',
    tip: 'Depósito de petróleo o gas en roca que no permite flujo natural — requiere técnicas especiales como el fracking para extraerlo.',
    glossaryId: 'ync'
  },
  {
    abbr: 'NORM',
    full: 'NORM (Naturally Occurring Radioactive Material)',
    tip: 'Material radioactivo de origen natural que el fracking disuelve y trae a superficie en el agua residual. Incluye radio y uranio.',
    glossaryId: 'radio'
  },
  {
    abbr: 'MODFLOW',
    full: 'MODFLOW',
    tip: 'Software del USGS para simular el movimiento del agua y contaminantes en acuíferos subterráneos. Estándar internacional de modelación.',
    glossaryId: 'modflow'
  }
];

// Build a map for quick lookup
const abbrMap = {};
ABBR_DEFS.forEach(d => { abbrMap[d.abbr] = d; });

// Track which abbreviations have been "first-mentioned" already
const firstMentionDone = {};

// Walk all text nodes in content sections (skip nav, scripts, code)
function processNode(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    const parent = node.parentElement;
    // Skip inside abbr, script, style, nav, footer-author, glosario h4
    if (!parent) return;
    const tag = parent.tagName;
    if (['ABBR', 'SCRIPT', 'STYLE', 'A', 'CODE', 'PRE'].includes(tag)) return;
    if (parent.closest('nav')) return;
    if (parent.closest('.glossary-grid')) return; // glossary defines them, don't wrap there

    const text = node.textContent;
    let replaced = false;
    let result = text;

    ABBR_DEFS.forEach(def => {
      // Match the abbreviation as a standalone word
      // Use a regex that won't match inside longer words
      const re = new RegExp('(?<![A-Za-z])' + def.abbr + '(?![A-Za-z0-9])', 'g');
      if (!re.test(result)) return;
      re.lastIndex = 0;

      const isFirst = !firstMentionDone[def.abbr];
      if (isFirst) firstMentionDone[def.abbr] = true;

      const tipText = def.tip.replace(/"/g, '&quot;');
      const glossLink = def.glossaryId
        ? ` <a href="#glosario" style="color:var(--sand);font-size:0.7em;opacity:0.6;" title="Ver en glosario">↗</a>`
        : '';

      if (isFirst) {
        // First mention: expand to full name, abbreviation in parens as abbr
        result = result.replace(re, () =>
          `${def.full.replace(def.abbr, `<abbr class="tt tt-first" data-tip="${tipText}" tabindex="0">${def.abbr}</abbr>`)}`
        );
      } else {
        result = result.replace(re, () =>
          `<abbr class="tt" data-tip="${tipText}" tabindex="0">${def.abbr}</abbr>`
        );
      }
      replaced = true;
    });

    if (replaced && result !== text) {
      const span = document.createElement('span');
      span.innerHTML = result;
      parent.replaceChild(span, node);
    }
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    // Clone children list since we may modify DOM
    Array.from(node.childNodes).forEach(processNode);
  }
}

// Run after DOM is ready — process main content sections only
document.addEventListener('DOMContentLoaded', () => {
  // Process sections in document order so first-mention tracking is correct
  const sections = document.querySelectorAll(
    'section, .context-note-section, footer'
  );
  sections.forEach(processNode);
});
