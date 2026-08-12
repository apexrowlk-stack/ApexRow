/* ============================================
   ApexRow — Premium Motion & Interactivity
   ============================================ */

const WEB3FORMS_ACCESS_KEY = '51c92df4-1943-4217-a016-f2c4960df84b';

document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       1. ANIMATED CANVAS BACKGROUND
       ========================================= */
    const canvas = document.getElementById('bgCanvas');
    const ctx = canvas ? canvas.getContext('2d') : null;
    let W, H, particles = [];
    let mouse = { x: -1000, y: -1000 };

    const resizeCanvas = () => {
        if (!canvas || !ctx) return;
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * W;
            this.y = Math.random() * H;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.3;
            this.opacity = Math.random() * 0.3 + 0.1;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > W) this.speedX *= -1;
            if (this.y < 0 || this.y > H) this.speedY *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(211, 18, 42, ${this.opacity})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < 80; i++) particles.push(new Particle());

    let mouseParticles = [];

    const addMouseParticles = (x, y) => {
        for (let i = 0; i < 3; i++) {
            mouseParticles.push({
                x: x + (Math.random() - 0.5) * 30,
                y: y + (Math.random() - 0.5) * 30,
                size: Math.random() * 2 + 1,
                speedX: (Math.random() - 0.5) * 2,
                speedY: (Math.random() - 0.5) * 2 - 1,
                life: 1,
                decay: 0.008 + Math.random() * 0.01
            });
        }
    };

    let animFrame;

    const animateBg = () => {
        if (!ctx) return;
        ctx.clearRect(0, 0, W, H);

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(211, 18, 42, ${0.06 * (1 - dist / 150)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }

        // Mouse connections
        mouseParticles.forEach(mp => {
            const dx = mp.x - mouse.x;
            const dy = mp.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120 && mouse.x > 0) {
                ctx.beginPath();
                ctx.moveTo(mp.x, mp.y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.strokeStyle = `rgba(211, 18, 42, ${0.08 * mp.life * (1 - dist / 120)})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        });

        // Update & draw particles
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        // Update mouse particles
        mouseParticles = mouseParticles.filter(mp => {
            mp.x += mp.speedX;
            mp.y += mp.speedY;
            mp.life -= mp.decay;
            if (mp.life <= 0) return false;
            ctx.beginPath();
            ctx.arc(mp.x, mp.y, mp.size * mp.life, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(211, 18, 42, ${0.15 * mp.life})`;
            ctx.fill();
            return true;
        });

        animFrame = requestAnimationFrame(animateBg);
    };
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (canvas && ctx && !prefersReducedMotion) {
        const heroEl = document.getElementById('home');
        let isCanvasActive = false;

        const startCanvas = () => {
            if (isCanvasActive || animFrame) return;
            isCanvasActive = true;
            animateBg();
        };
        const stopCanvas = () => {
            isCanvasActive = false;
            if (animFrame) {
                cancelAnimationFrame(animFrame);
                animFrame = null;
            }
        };

        // Only run the particle loop while the hero is on screen
        const canvasObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) startCanvas();
                else stopCanvas();
            });
        }, { threshold: 0 });
        if (heroEl) canvasObserver.observe(heroEl);

        // Mouse tracking
        document.addEventListener('mousemove', (e) => {
            if (!isCanvasActive) return;
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            addMouseParticles(e.clientX, e.clientY);
        });

        document.addEventListener('mouseleave', () => {
            mouse.x = -1000;
            mouse.y = -1000;
        });

        // Touch support
        document.addEventListener('touchmove', (e) => {
            if (!isCanvasActive) return;
            const touch = e.touches[0];
            mouse.x = touch.clientX;
            mouse.y = touch.clientY;
        }, { passive: true });
    }


    /* =========================================
       2. NAVBAR — SCROLL EFFECT
       ========================================= */
    const navbar = document.getElementById('navbar');

    const handleScroll = () => {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();


    /* =========================================
       3. MOBILE MENU
       ========================================= */
    const navToggle = document.getElementById('navToggle');
    const navLinksEl = document.getElementById('navLinks');
    let scrollPos = 0;

    const closeMenu = () => {
        if (!navLinksEl.classList.contains('active')) return;
        navToggle.classList.remove('active');
        navLinksEl.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollPos);
    };

    navToggle.addEventListener('click', () => {
        const isOpen = navLinksEl.classList.contains('active');
        navToggle.classList.toggle('active');
        navLinksEl.classList.toggle('active');
        navToggle.setAttribute('aria-expanded', String(!isOpen));
            if (isOpen) {
                document.body.style.overflow = '';
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.width = '';
                window.scrollTo(0, scrollPos);
            } else {
            scrollPos = window.scrollY;
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollPos}px`;
            document.body.style.width = '100%';
        }
    });

    navLinksEl.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    document.querySelector('.nav-logo')?.addEventListener('click', closeMenu);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMenu();
    });


    /* =========================================
       4. SCROLL-TRIGGERED ENTRANCE ANIMATIONS
       ========================================= */
    const animateEls = document.querySelectorAll('[data-animate]');

    const animObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.delay) || 0;
                setTimeout(() => {
                    entry.target.classList.add('animated');
                }, delay);
                animObserver.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.12
    });

    animateEls.forEach(el => animObserver.observe(el));


    /* =========================================
       5. COUNTER ANIMATION
       ========================================= */
    const counters = document.querySelectorAll('[data-count]');

    const counterObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.count);
                const duration = 2000;
                const startTime = performance.now();

                const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

                const update = (now) => {
                    const elapsed = now - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const eased = easeOutQuart(progress);
                    el.textContent = Math.round(eased * target);
                    if (progress < 1) requestAnimationFrame(update);
                    else el.textContent = target;
                };
                requestAnimationFrame(update);
                counterObs.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => counterObs.observe(c));


    /* =========================================
       6. SMOOTH SCROLL FOR ANCHORS
       ========================================= */
    document.querySelectorAll('a[href^="#"]:not(.skip-link)').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const hash = this.getAttribute('href');
            if (!hash || hash === '#') return;
            const target = document.querySelector(hash);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: prefersReducedMotion ? 'auto' : 'smooth',
                    block: 'start'
                });
            }
        });
    });


    /* =========================================
       7. ACTIVE NAV LINK HIGHLIGHT
       ========================================= */
    const sections = document.querySelectorAll('section[id]');

    const highlightNav = () => {
        const scrollPos = window.scrollY + 120;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            const link = document.querySelector(`.nav-links a[href="#${id}"]`);
            if (link) {
                if (scrollPos >= top && scrollPos < top + height) {
                    link.classList.add('active');
                    link.setAttribute('aria-current', 'page');
                } else {
                    link.classList.remove('active');
                    link.removeAttribute('aria-current');
                }
            }
        });
    };
    window.addEventListener('scroll', highlightNav, { passive: true });
    highlightNav();


    /* =========================================
       8. 3D TILT ON SERVICE CARDS
       ========================================= */
    const tiltCards = document.querySelectorAll('.service-card');

    if (!prefersReducedMotion) {
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const cx = rect.width / 2;
                const cy = rect.height / 2;
                const rx = (y - cy) / 16;
                const ry = (cx - x) / 16;
                card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-8px)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }


    /* =========================================
        9. CONTACT FORM — SEND VIA WHATSAPP / EMAIL
       ========================================= */
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        const buildPayload = () => {
            const fd = new FormData(contactForm);
            const name = fd.get('name') || '';
            const email = fd.get('email') || '';
            const phone = fd.get('phone') || '';
            const service = fd.get('service') || 'General';
            const message = fd.get('message') || '';

            const subject = `Project Inquiry — ${service} | From ${name}`;
            const body =
                `Hi ApexRow Team,\n\n` +
                `My name is ${name}.\n\n` +
                `I'm interested in: ${service}\n\n` +
                `Project Details:\n${message}\n\n` +
                `Contact:\nEmail: ${email}\nPhone: ${phone || 'Not provided'}\n\n` +
                `Best regards,\n${name}`;

            const waLink = `https://wa.me/94702210670?text=${encodeURIComponent(body)}`;
            const mailLink = `mailto:apexrow.lk@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

            return { name, email, phone, service, message, subject, body, waLink, mailLink };
        };

        const buildFallback = () => {
            let options = contactForm.querySelector('.form-submit-options');
            const btn = contactForm.querySelector('button[type="submit"]');

            if (!options) {
                options = document.createElement('div');
                options.className = 'form-submit-options';
                options.innerHTML = `
                    <p class="form-submit-note">Almost done — choose how to send your message:</p>
                    <div class="form-submit-buttons">
                        <a class="btn btn-primary btn-sm" target="_blank" rel="noopener">WhatsApp</a>
                        <a class="btn btn-outline btn-sm">Email</a>
                    </div>
                    <button type="button" class="form-submit-back">Edit message</button>
                `;
                btn.insertAdjacentElement('afterend', options);

                const whatsappBtn = options.querySelector('a.btn-primary');
                const emailBtn = options.querySelector('a.btn-outline');

                whatsappBtn.addEventListener('click', (ev) => {
                    ev.preventDefault();
                    window.open(whatsappBtn.href, '_blank', 'noopener');
                });
                emailBtn.addEventListener('click', (ev) => {
                    ev.preventDefault();
                    window.location.href = emailBtn.href;
                });
                options.querySelector('.form-submit-back').addEventListener('click', () => {
                    options.classList.remove('visible');
                    btn.style.display = '';
                });
            }

            const { waLink, mailLink } = buildPayload();
            options.querySelector('a.btn-primary').href = waLink;
            options.querySelector('a.btn-outline').href = mailLink;

            btn.style.display = 'none';
            options.classList.add('visible');
            options.querySelector('a.btn-primary').focus();
        };

        const buildSuccess = (waLinkOverride) => {
            let success = contactForm.querySelector('.form-success');
            const btn = contactForm.querySelector('button[type="submit"]');

            if (!success) {
                success = document.createElement('div');
                success.className = 'form-success';
                success.setAttribute('role', 'status');
                success.setAttribute('tabindex', '-1');
                success.innerHTML = `
                    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="8 12.5 11 15.5 16 9.5"/></svg>
                    <p class="form-success-title">Message Sent!</p>
                    <p class="form-success-note">Thanks for reaching out — we'll get back to you within 24 hours.</p>
                    <div class="form-submit-buttons">
                        <a class="btn btn-primary btn-sm" target="_blank" rel="noopener">Prefer WhatsApp?</a>
                        <button type="button" class="btn btn-outline btn-sm form-success-back">Send Another</button>
                    </div>
                `;
                btn.insertAdjacentElement('afterend', success);

                success.querySelector('.form-success-back').addEventListener('click', () => {
                    success.classList.remove('visible');
                    btn.style.display = '';
                });
            }

            const waLink = waLinkOverride || buildPayload().waLink;
            success.querySelector('a.btn-primary').href = waLink;

            btn.style.display = 'none';
            success.classList.add('visible');
            success.focus();
        };

        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const btn = this.querySelector('button[type="submit"]');
            btn.disabled = true;
            btn.querySelector('span').textContent = 'Sending...';

            const { name, email, phone, service, message, subject, waLink } = buildPayload();

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({
                    access_key: WEB3FORMS_ACCESS_KEY,
                    subject: subject,
                    from_name: name,
                    botcheck: '',
                    name: name,
                    email: email,
                    phone: phone,
                    service: service,
                    message: message
                })
            })
                .then(res => {
                    if (!res.ok) throw new Error('Network response was not ok');
                    return res.json();
                })
                .then(data => {
                    if (!data.success) throw new Error(data.message || 'Submission failed');
                    const sentLink = waLink;
                    this.reset();
                    buildSuccess(sentLink);
                })
                .catch(() => {
                    buildFallback();
                })
                .finally(() => {
                    btn.disabled = false;
                    btn.querySelector('span').textContent = 'Send Message';
                });
        });
    }


    /* =========================================
        10. PARALLAX MOCKUP STACK ON SCROLL
       ========================================= */
    const mockups = document.querySelectorAll('.mockup');

    if (mockups.length && !prefersReducedMotion) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            mockups.forEach((m, i) => {
                const speed = 0.02 + (i * 0.01);
                const yOffset = scrollY * speed;
                m.style.translate = `0 ${yOffset}px`;
            });
        }, { passive: true });
    }


    /* =========================================
        11. FAQ ACCORDION
        ========================================= */
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.faq-item');
            const isOpen = item.classList.contains('active');

            // Close all other items
            document.querySelectorAll('.faq-item.active').forEach(open => {
                open.classList.remove('active');
                open.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });

            if (!isOpen) {
                item.classList.add('active');
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });


    /* =========================================
        12. TESTIMONIAL CAROUSEL
        ========================================= */
    const testiTrack = document.getElementById('testimonialsTrack');
    const testiPrev = document.getElementById('testiPrev');
    const testiNext = document.getElementById('testiNext');

    if (testiTrack && testiPrev && testiNext) {
        const scrollTestimonials = (dir) => {
            const card = testiTrack.querySelector('.testi-card');
            const amount = card ? card.offsetWidth + 20 : 420;
            testiTrack.scrollBy({ left: dir * amount, behavior: 'smooth' });
        };

        testiPrev.addEventListener('click', () => scrollTestimonials(-1));
        testiNext.addEventListener('click', () => scrollTestimonials(1));

        const updateTestiNav = () => {
            const maxScroll = testiTrack.scrollWidth - testiTrack.clientWidth;
            testiPrev.disabled = testiTrack.scrollLeft <= 1;
            testiNext.disabled = testiTrack.scrollLeft >= maxScroll - 1;
        };

        testiTrack.addEventListener('scroll', updateTestiNav, { passive: true });
        window.addEventListener('resize', updateTestiNav);
        updateTestiNav();
    }


    /* =========================================
        13. PREMIUM CURSOR TRAIL (desktop only)
        ========================================= */
    if (window.innerWidth > 768 && !prefersReducedMotion) {
        const cursor = document.createElement('div');
        cursor.className = 'cursor-glow';
        cursor.style.cssText = `
            position: fixed;
            width: 8px; height: 8px;
            border-radius: 50%;
            background: rgba(211, 18, 42, 0.3);
            pointer-events: none;
            z-index: 9999;
            transition: width 0.2s, height 0.2s, opacity 0.2s;
            transform: translate(-50%, -50%);
            box-shadow: 0 0 20px rgba(211, 18, 42, 0.15);
        `;
        document.body.appendChild(cursor);

        let cursorX = -100, cursorY = -100;

        document.addEventListener('mousemove', (e) => {
            cursorX = e.clientX;
            cursorY = e.clientY;
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
        });

        // Scale up on hoverable elements
        document.querySelectorAll('a, button, .service-card, .testi-card, .faq-question')
            .forEach(el => {
                el.addEventListener('mouseenter', () => {
                    cursor.style.width = '24px';
                    cursor.style.height = '24px';
                    cursor.style.opacity = '0.5';
                });
                el.addEventListener('mouseleave', () => {
                    cursor.style.width = '8px';
                    cursor.style.height = '8px';
                    cursor.style.opacity = '0.3';
                });
            });
    }

});