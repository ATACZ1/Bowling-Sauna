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
    initLaneScrollbar();
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

/* ----------------------------------------
   LANE SCROLLBAR — Custom bowling indicator
   ---------------------------------------- */
function initLaneScrollbar() {
    const ball = document.getElementById('bowling-ball');
    const holesGroup = document.getElementById('holes-group');
    const flash = document.getElementById('strike-flash');
    const label = document.getElementById('strike-label');
    const hint = document.getElementById('drag-hint');

    if (!ball || !holesGroup || !flash || !label || !hint) {
        return;
    }

    const BALL_SIZE = 46;
    const PIN_DECK_H = 60;
    const FOUL_LINE_TOP = 56;

    let angle = 0;
    let rafId = null;
    let lastTime = null;
    let spinSpeed = 0;

    function spinLoop(ts) {
        if (lastTime !== null && spinSpeed > 0) {
            angle = (angle + (ts - lastTime) * spinSpeed) % 360;
            holesGroup.setAttribute('transform', `rotate(${angle},23,23)`);
        }
        lastTime = ts;

        if (spinSpeed > 0) {
            rafId = requestAnimationFrame(spinLoop);
        } else {
            lastTime = null;
            rafId = null;
        }
    }

    function setSpin(speed) {
        spinSpeed = speed;
        if (speed > 0 && !rafId) {
            lastTime = null;
            rafId = requestAnimationFrame(spinLoop);
        }
    }

    let lastScrollY = window.scrollY;
    let scrollStopTimer = null;
    let isDragging = false;
    let isThrown = false;
    let hasScrollStrike = false;
    let ballTop = 0;
    let homeTop = 0;

    function getHomeTop() {
        const vh = window.innerHeight;
        const scrollable = document.documentElement.scrollHeight - vh;
        const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
        const start = FOUL_LINE_TOP + BALL_SIZE / 2;
        const end = vh - PIN_DECK_H - BALL_SIZE / 2 - 4;
        return start + progress * (end - start) - BALL_SIZE / 2;
    }

    function setBallTop(top) {
        ballTop = top;
        ball.style.top = `${top}px`;
    }

    function updateFromScroll() {
        if (isDragging || isThrown) return;

        const vh = window.innerHeight;
        const scrollable = document.documentElement.scrollHeight - vh;
        const progress = scrollable > 0 ? window.scrollY / scrollable : 0;

        homeTop = getHomeTop();
        setBallTop(homeTop);

        if (Math.abs(window.scrollY - lastScrollY) > 0.5) {
            setSpin(0.38);
            clearTimeout(scrollStopTimer);
            scrollStopTimer = setTimeout(() => {
                setSpin(0);
            }, 200);
        }

        if (progress > 0.97 && !hasScrollStrike) {
            hasScrollStrike = true;
            impact(true);
        } else if (progress < 0.9) {
            hasScrollStrike = false;
        }

        lastScrollY = window.scrollY;
    }

    let dragStartY = 0;
    let dragLastY = 0;
    let dragLastTime = 0;
    let dragVelocity = 0;

    function onDragStart(e) {
        if (isThrown) return;
        e.preventDefault();

        isDragging = true;
        homeTop = getHomeTop();
        ball.classList.add('dragging');
        ball.style.transition = 'none';
        setSpin(0.7);
        hint.style.opacity = '0';

        const y = e.touches ? e.touches[0].clientY : e.clientY;
        dragStartY = y;
        dragLastY = y;
        dragLastTime = Date.now();
        dragVelocity = 0;

        window.addEventListener('mousemove', onDragMove, { passive: false });
        window.addEventListener('mouseup', onDragEnd);
        window.addEventListener('touchmove', onDragMove, { passive: false });
        window.addEventListener('touchend', onDragEnd);
    }

    function onDragMove(e) {
        if (!isDragging) return;
        e.preventDefault();

        const y = e.touches ? e.touches[0].clientY : e.clientY;
        const now = Date.now();
        const dt = now - dragLastTime;
        if (dt > 0) {
            dragVelocity = ((y - dragLastY) / dt) * 16;
        }

        dragLastY = y;
        dragLastTime = now;

        const delta = y - dragStartY;
        const maxTop = window.innerHeight - PIN_DECK_H - BALL_SIZE;
        const newTop = Math.max(FOUL_LINE_TOP, Math.min(maxTop, homeTop + Math.max(0, delta)));
        setBallTop(newTop);
    }

    function onDragEnd() {
        if (!isDragging) return;
        isDragging = false;

        window.removeEventListener('mousemove', onDragMove);
        window.removeEventListener('mouseup', onDragEnd);
        window.removeEventListener('touchmove', onDragMove);
        window.removeEventListener('touchend', onDragEnd);

        const draggedDown = ballTop - homeTop;

        if (dragVelocity > 1.5 || draggedDown > 50) {
            throwBall(dragVelocity);
        } else {
            ball.classList.remove('dragging');
            ball.style.transition = 'top 0.5s cubic-bezier(0.34,1.3,0.64,1)';
            setBallTop(homeTop);
            setSpin(0);
            setTimeout(() => {
                ball.style.transition = '';
            }, 550);
        }
    }

    function throwBall(velocity) {
        isThrown = true;
        ball.classList.remove('dragging');

        const speed = Math.max(0.25, Math.min(1, Math.abs(velocity) / 10));
        const duration = 0.2 + (1 - speed) * 0.25;
        ball.style.transition = `top ${duration}s cubic-bezier(0.4,0,0.2,1)`;

        const target = window.innerHeight - PIN_DECK_H - BALL_SIZE - 2;
        setSpin(1.4);
        setBallTop(target);

        setTimeout(() => {
            setSpin(0);
            impact(velocity > 6);

            setTimeout(() => {
                isThrown = false;
                homeTop = getHomeTop();
                ball.style.transition = 'top 0.75s cubic-bezier(0.34,1.3,0.64,1)';
                setBallTop(homeTop);
                setTimeout(() => {
                    ball.style.transition = '';
                }, 800);
            }, 1100);
        }, duration * 1000 + 20);
    }

    function impact(fullStrike) {
        const pins = document.querySelectorAll('#lane-scrollbar .pin');
        const shuffledPins = Array.from(pins).sort(() => Math.random() - 0.5);
        const hitCount = fullStrike ? shuffledPins.length : Math.floor(4 + Math.random() * 6);

        shuffledPins.slice(0, hitCount).forEach((pin, i) => {
            setTimeout(() => {
                pin.style.transition = 'transform 0.35s ease, opacity 0.4s ease';
                const randomAngle = (Math.random() - 0.5) * 130;
                const distance = 14 + Math.random() * 30;
                pin.style.transform = `rotate(${randomAngle}deg) translateY(${distance}px)`;
                pin.style.opacity = '0';
            }, i * 35);
        });

        flash.style.opacity = '1';
        setTimeout(() => {
            flash.style.opacity = '0';
        }, 150);

        label.textContent = hitCount >= 10 ? 'STRIKE!' : hitCount >= 8 ? `${hitCount} HIT!` : `${hitCount} × hit`;
        label.style.transition = 'transform 0.2s cubic-bezier(0.34,1.5,0.64,1), opacity 0.2s';
        label.style.opacity = '1';
        label.style.transform = 'translateX(-50%) scale(1.15)';

        setTimeout(() => {
            label.style.transition = 'transform 0.3s ease, opacity 0.4s ease';
            label.style.opacity = '0';
            label.style.transform = 'translateX(-50%) scale(0.8)';
        }, 1300);

        setTimeout(() => {
            shuffledPins.forEach((pin) => {
                pin.style.transition = 'transform 0.55s ease, opacity 0.5s ease';
                pin.style.transform = '';
                pin.style.opacity = '1';
            });
        }, 1700);
    }

    homeTop = getHomeTop();
    setBallTop(homeTop);

    setTimeout(() => {
        hint.style.top = `${homeTop + BALL_SIZE + 6}px`;
        hint.style.opacity = '1';

        setTimeout(() => {
            hint.style.opacity = '0';
        }, 6000);
    }, 2500);

    ball.addEventListener('mousedown', onDragStart);
    ball.addEventListener('touchstart', onDragStart, { passive: false });
    window.addEventListener('scroll', updateFromScroll, { passive: true });
    window.addEventListener('resize', () => {
        homeTop = getHomeTop();
        if (!isDragging && !isThrown) {
            setBallTop(homeTop);
        }
    });
}
