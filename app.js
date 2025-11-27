(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const nav = document.querySelector('.top-nav');
    const footerText = document.getElementById('footer-text');

    if (footerText) {
        const year = new Date().getFullYear();
        footerText.textContent = `(c) ${year} Shefket Sallahi - Portfolio`;
    }

    const revealElements = document.querySelectorAll('.reveal');
    if (prefersReducedMotion.matches) {
        revealElements.forEach(el => el.classList.add('visible'));
    } else {
        const revealObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        revealElements.forEach(el => revealObserver.observe(el));
    }

    const navLinks = new Map();
    document.querySelectorAll('nav a[href^="#"]').forEach(link => {
        const id = link.getAttribute('href').slice(1);
        navLinks.set(id, link);
    });

    const sections = Array.from(document.querySelectorAll('main section[id]'));
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentId = entry.target.id;
                navLinks.forEach((link, id) => {
                    link.classList.toggle('active', id === currentId);
                });
            }
        });
    }, { threshold: 0.5 });

    sections.forEach(section => sectionObserver.observe(section));

    const handleScroll = () => {
        if (!nav) return;
        if (window.scrollY > 12) nav.classList.add('scrolled');
        else nav.classList.remove('scrolled');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
})();
