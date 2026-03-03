/* ========================================
   BOWLING SAUNA — Interactions & Animations
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initScrollAnimations();
    initCounters();
    initParallax();
    initMenuTabs();
    initSmoothScroll();
});

/* ----------------------------------------
   NAVBAR — Scroll effect & mobile toggle
   ---------------------------------------- */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        links.classList.toggle('open');
    });

    links.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            links.classList.remove('open');
        });
    });
}

/* ----------------------------------------
   SCROLL ANIMATIONS — Intersection Observer
   ---------------------------------------- */
function initScrollAnimations() {
    const elements = document.querySelectorAll('.fade-up');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, parseInt(delay));
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    });

    elements.forEach(el => observer.observe(el));
}

/* ----------------------------------------
   COUNTER ANIMATION — Numbers counting up
   ---------------------------------------- */
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const priceValues = document.querySelectorAll('.price-value');
    let statsAnimated = false;
    let pricesAnimated = false;

    function animateCounter(el, duration = 2000) {
        const target = parseInt(el.dataset.target);
        const start = 0;
        const startTime = performance.now();

        function easeOutQuart(t) {
            return 1 - Math.pow(1 - t, 4);
        }

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutQuart(progress);
            const current = Math.floor(start + (target - start) * easedProgress);

            el.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target;
            }
        }

        requestAnimationFrame(update);
    }

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !statsAnimated) {
                statsAnimated = true;
                counters.forEach((counter, i) => {
                    setTimeout(() => animateCounter(counter, 2000), i * 200);
                });
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.getElementById('stats');
    if (statsSection) statsObserver.observe(statsSection);

    const priceObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !pricesAnimated) {
                pricesAnimated = true;
                priceValues.forEach((price, i) => {
                    setTimeout(() => animateCounter(price, 1500), i * 300);
                });
            }
        });
    }, { threshold: 0.3 });

    const pricingSection = document.getElementById('pricing');
    if (pricingSection) priceObserver.observe(pricingSection);
}

/* ----------------------------------------
   PARALLAX EFFECT — Hero & divider
   ---------------------------------------- */
function initParallax() {
    const heroParallax = document.getElementById('heroParallax');
    const parallaxBg = document.querySelector('.parallax-bg');
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrollY = window.scrollY;

                if (heroParallax) {
                    heroParallax.style.transform = `translateY(${scrollY * 0.3}px)`;
                }

                if (parallaxBg) {
                    const divider = document.getElementById('parallaxDivider');
                    if (divider) {
                        const rect = divider.getBoundingClientRect();
                        const offset = rect.top * 0.3;
                        parallaxBg.style.transform = `translateY(${offset}px)`;
                    }
                }

                ticking = false;
            });
            ticking = true;
        }
    });
}

/* ----------------------------------------
   MENU TABS — Category switching
   ---------------------------------------- */
function initMenuTabs() {
    const tabs = document.querySelectorAll('.menu-tab');
    const panels = document.querySelectorAll('.menu-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.tab;

            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            panels.forEach(panel => {
                panel.classList.remove('active');
                if (panel.id === `tab-${target}`) {
                    panel.classList.add('active');
                    panel.querySelectorAll('.fade-up').forEach(el => {
                        el.classList.add('visible');
                    });
                }
            });
        });
    });
}

/* ----------------------------------------
   SMOOTH SCROLL — Anchor navigation
   ---------------------------------------- */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });
}
