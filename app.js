(() => {
    'use strict';

    // ============ CONFIG ============
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const isMobile = window.innerWidth < 768;

    // ============ DOM ELEMENTS ============
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const header = document.querySelector('header.top-nav');
    const themeToggle = document.getElementById('themeToggle');
    const backToTop = document.getElementById('backToTop');
    const scrollProgress = document.querySelector('.scroll-progress');
    const year = document.getElementById('year');
    const charElements = document.querySelectorAll('.char');

    // ============ YEAR UPDATE ============
    if (year) year.textContent = new Date().getFullYear();

    // ============ THEME MANAGEMENT ============
    const initTheme = () => {
        const saved = localStorage.getItem('portfolio-theme') || 'dark';
        if (saved === 'light') {
            document.body.classList.add('light-theme');
        }
    };

    const toggleTheme = () => {
        document.body.classList.toggle('light-theme');
        const isLight = document.body.classList.contains('light-theme');
        localStorage.setItem('portfolio-theme', isLight ? 'light' : 'dark');
    };

    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    initTheme();

    // ============ MOBILE MENU TOGGLE ============
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
            });
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.top-nav')) {
                navToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
            }
        });
    }

    // ============ CHARACTER ANIMATION ============
    const animateCharacters = () => {
        if (prefersReducedMotion.matches) return;

        charElements.forEach((char, i) => {
            char.style.animationDelay = `${i * 0.05}s`;
        });
    };

    animateCharacters();

    // ============ SCROLL EFFECTS ============
    let lastScrollY = 0;
    let ticking = false;

    const updateScroll = () => {
        const scrollY = window.scrollY;
        lastScrollY = scrollY;

        // Header scroll effect
        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Back to top button
        if (scrollY > 300) {
            backToTop?.classList.add('visible');
        } else {
            backToTop?.classList.remove('visible');
        }

        // Scroll progress
        if (scrollProgress) {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollY / totalHeight) * 100;
            scrollProgress.style.width = progress + '%';
        }

        ticking = false;
    };

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateScroll);
            ticking = true;
        }
    }, { passive: true });

    updateScroll();

    // ============ BACK TO TOP ============
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ============ SMOOTH SCROLL WITH OFFSET ============
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#' || href === '#hero') return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();
            const headerHeight = header?.offsetHeight || 80;
            const targetPos = target.offsetTop - headerHeight - 20;

            window.scrollTo({
                top: targetPos,
                behavior: 'smooth'
            });
        });
    });

    // ============ INTERSECTION OBSERVER FOR ANIMATIONS ============
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal-up').forEach(el => {
        observer.observe(el);
    });

    // ============ ACTIVE NAV LINK ============
    const sections = document.querySelectorAll('section[id]');
    const navLinkMap = new Map();

    navLinks.forEach(link => {
        const id = link.getAttribute('href').slice(1);
        navLinkMap.set(id, link);
    });

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinkMap.forEach((link, id) => {
                    link.classList.remove('active');
                });
                const activeLink = navLinkMap.get(entry.target.id);
                if (activeLink) activeLink.classList.add('active');
            }
        });
    }, { threshold: 0.3 });

    sections.forEach(section => sectionObserver.observe(section));

    // ============ KEYBOARD NAVIGATION ============
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        if (e.key === 'Escape') {
            navToggle?.setAttribute('aria-expanded', 'false');
            navMenu?.classList.remove('active');
        }

        const links = Array.from(navLinks);
        const current = links.findIndex(l => l.classList.contains('active'));

        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            const next = (current + 1) % links.length;
            links[next].click();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            const prev = (current - 1 + links.length) % links.length;
            links[prev].click();
        }
    });

    // ============ CLICK INTERACTIONS ON CARDS ============
    document.querySelectorAll('.project-card, .glass-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (prefersReducedMotion.matches) return;
            this.style.transition = 'transform 0.3s ease';
        });

        card.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                const link = card.querySelector('a');
                if (link) link.click();
            }
        });
    });

    // ============ FLOATING CARDS PARALLAX ============
    const floatingCards = document.querySelectorAll('.floating-card');
    if (floatingCards.length > 0 && !prefersReducedMotion.matches) {
        window.addEventListener('mousemove', (e) => {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;

            floatingCards.forEach((card, i) => {
                const offsetX = (x - 0.5) * 20 * (i + 1);
                const offsetY = (y - 0.5) * 20 * (i + 1);
                card.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
            });
        });
    }

    // ============ CHIP INTERACTIONS ============
    document.querySelectorAll('.chip').forEach(chip => {
        chip.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 100);
        });

        chip.addEventListener('mouseenter', function() {
            if (prefersReducedMotion.matches) return;
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });

        chip.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // ============ LINK HOVER EFFECTS ============
    document.querySelectorAll('.link-arrow').forEach(link => {
        link.addEventListener('mouseenter', function() {
            if (prefersReducedMotion.matches) return;
            this.style.gap = '1rem';
        });

        link.addEventListener('mouseleave', function() {
            this.style.gap = '0.5rem';
        });
    });

    // ============ CONTACT METHOD INTERACTIONS ============
    const contactMethods = document.querySelectorAll('.contact-method');
    contactMethods.forEach(method => {
        method.addEventListener('click', (e) => {
            if (method.href.startsWith('mailto:')) return;
            e.preventDefault();
        });
    });

    // ============ EMAIL COPY TO CLIPBOARD ============
    const emailLink = document.querySelector('a[href^="mailto:"]');
    if (emailLink) {
        const email = emailLink.getAttribute('href').replace('mailto:', '');
        emailLink.addEventListener('click', (e) => {
            e.preventDefault();
            navigator.clipboard.writeText(email).then(() => {
                const originalText = emailLink.textContent;
                emailLink.textContent = 'Copied! ✓';
                setTimeout(() => {
                    emailLink.textContent = originalText;
                }, 2000);
            }).catch(() => {
                window.location.href = `mailto:${email}`;
            });
        });
    }

    // ============ SOCIAL LINK TRACKING ============
    document.querySelectorAll('.social-link').forEach(link => {
        link.addEventListener('click', () => {
            const platform = link.textContent.trim();
            console.log(`Clicked: ${platform}`);
        });
    });

    // ============ PAGE VISIBILITY ============
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            console.log('User left the page');
        } else {
            console.log('User returned to page');
        }
    });

    // ============ PERFORMANCE: Reduce Motion Support ============
    if (prefersReducedMotion.matches) {
        document.documentElement.style.scrollBehavior = 'auto';
        document.querySelectorAll('[style*="animation"]').forEach(el => {
            el.style.animation = 'none';
        });
    }

    // ============ CUSTOM CURSOR (Optional) ============
    if (!isMobile && !prefersReducedMotion.matches) {
        document.addEventListener('mousemove', (e) => {
            const x = e.clientX;
            const y = e.clientY;
            
            document.querySelectorAll('.btn, .chip, .link-arrow').forEach(el => {
                const rect = el.getBoundingClientRect();
                const elX = rect.left + rect.width / 2;
                const elY = rect.top + rect.height / 2;
                const distance = Math.hypot(x - elX, y - elY);
                
                if (distance < 100) {
                    el.style.cursor = 'pointer';
                }
            });
        });
    }

    // ============ CONSOLE WELCOME MESSAGE ============
    console.log(
        '%c🚀 Welcome to Shefket Sallahi\'s Portfolio!',
        'color: #00d9ff; font-size: 18px; font-weight: bold; text-shadow: 0 0 10px #00d9ff;'
    );
    console.log(
        '%cLet\'s build something amazing together!\nReach out: ss242309.student@unt.edu.mk',
        'color: #a78bfa; font-size: 14px; margin-top: 10px;'
    );

    // ============ PERFORMANCE MONITORING ============
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`Page loaded in ${pageLoadTime}ms`);
        });
    }

})();