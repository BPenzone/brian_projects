const headingStyle = document.createElement('style');
headingStyle.textContent = `
  h1, h2, h3,
  .brand-copy,
  .hero-panel strong,
  .timeline-item strong,
  .principles strong {
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif !important;
    font-weight: 700 !important;
  }
`;
document.head.appendChild(headingStyle);

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

document.querySelectorAll('.project-toggle').forEach((button) => {
  button.addEventListener('click', () => {
    const card = button.closest('.project-card');
    const isOpen = card.classList.toggle('open');
    button.setAttribute('aria-expanded', String(isOpen));
  });
});

const formatNumber = (value) => new Intl.NumberFormat('en-US').format(value);

const animateMetric = (el) => {
  const target = Number(el.dataset.count || 0);
  const duration = 1200;
  const start = performance.now();
  const isMoney = el.classList.contains('metric-money');

  const frame = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(target * eased);
    el.textContent = `${isMoney ? '$' : ''}${formatNumber(current)}${progress === 1 && !isMoney && target >= 1000 ? '+' : ''}`;

    if (progress < 1) requestAnimationFrame(frame);
  };

  requestAnimationFrame(frame);
};

const metricObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      animateMetric(entry.target);
      metricObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.6 });

document.querySelectorAll('.metric-value').forEach((el) => metricObserver.observe(el));
