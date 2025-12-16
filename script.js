document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('.navbar a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });

            // Update active class for navigation
            document.querySelectorAll('.navbar a').forEach(link => {
                link.classList.remove('active');
            });
            this.classList.add('active');
        });
    });

    // Highlight active nav link on scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.7 // When 70% of the section is visible
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href').substring(1) === entry.target.id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // =============================
    // Typing animation for subtitle
    // =============================
    const typingElement = document.querySelector('.typing-text');
    const roles = ['MERN Stack Developer', 'Full Stack Developer'];
    const typingSpeed = 120;
    const deletingSpeed = 80;
    const pauseBetweenWords = 1500;

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeRole() {
        if (!typingElement) return;

        const currentRole = roles[roleIndex];

        if (isDeleting) {
            charIndex--;
            typingElement.textContent = currentRole.substring(0, charIndex);

            if (charIndex <= 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
            }
        } else {
            charIndex++;
            typingElement.textContent = currentRole.substring(0, charIndex);

            if (charIndex === currentRole.length) {
                isDeleting = true;
                setTimeout(typeRole, pauseBetweenWords);
                return;
            }
        }

        const delay = isDeleting ? deletingSpeed : typingSpeed;
        setTimeout(typeRole, delay);
    }

    // Start typing after a short delay
    setTimeout(typeRole, 800);

    // =============================
    // Scroll reveal animations
    // =============================
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    // Once visible, no need to observe again for performance
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.2
        }
    );

    revealElements.forEach(el => revealObserver.observe(el));

    // =============================
    // Particle background animation
    // =============================
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        const numParticles = 35;

        for (let i = 0; i < numParticles; i++) {
            const particle = document.createElement('span');
            particle.classList.add('particle');

            const size = Math.random() * 4 + 2; // 2 - 6px
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;

            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;

            const duration = Math.random() * 20 + 10; // 10 - 30s
            const delay = (Math.random() * 10) * (Math.random() < 0.5 ? -1 : 1);

            particle.style.animationDuration = `${duration}s`;
            particle.style.animationDelay = `${delay}s`;

            particlesContainer.appendChild(particle);
        }
    }

    // =============================
    // Projects carousel scroll
    // =============================
    const track = document.querySelector('.projects-track');
    const cards = track ? Array.from(track.querySelectorAll('.project-card')) : [];
    const prevBtn = document.querySelector('.projects-nav.prev');
    const nextBtn = document.querySelector('.projects-nav.next');
    const dotsContainer = document.querySelector('.projects-dots');

    if (track && cards.length > 0) {
        let currentIndex = 0;

        // Create dots
        cards.forEach((card, index) => {
            const dot = document.createElement('button');
            dot.classList.add('projects-dot');
            if (index === 0) dot.classList.add('active');
            dot.setAttribute('aria-label', `Go to project ${index + 1}`);
            dot.addEventListener('click', () => {
                scrollToCard(index);
            });
            dotsContainer.appendChild(dot);
        });

        const dots = Array.from(dotsContainer.querySelectorAll('.projects-dot'));

        function scrollToCard(index) {
            currentIndex = Math.max(0, Math.min(index, cards.length - 1));
            const card = cards[currentIndex];
            const left = card.offsetLeft - (track.clientWidth - card.clientWidth) / 2;

            track.scrollTo({
                left,
                behavior: 'smooth'
            });

            updateDots();
        }

        function updateDots() {
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        }

        function handleNext() {
            const nextIndex = currentIndex + 1;
            if (nextIndex < cards.length) {
                scrollToCard(nextIndex);
            } else {
                scrollToCard(0); // loop
            }
        }

        function handlePrev() {
            const prevIndex = currentIndex - 1;
            if (prevIndex >= 0) {
                scrollToCard(prevIndex);
            } else {
                scrollToCard(cards.length - 1); // loop to last
            }
        }

        if (nextBtn) nextBtn.addEventListener('click', handleNext);
        if (prevBtn) prevBtn.addEventListener('click', handlePrev);

        // Update active dot on manual scroll
        let scrollTimeout;
        track.addEventListener('scroll', () => {
            if (scrollTimeout) clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                const trackRect = track.getBoundingClientRect();
                let closestIndex = currentIndex;
                let closestDistance = Infinity;

                cards.forEach((card, index) => {
                    const cardRect = card.getBoundingClientRect();
                    const cardCenter = cardRect.left + cardRect.width / 2;
                    const trackCenter = trackRect.left + trackRect.width / 2;
                    const distance = Math.abs(cardCenter - trackCenter);

                    if (distance < closestDistance) {
                        closestDistance = distance;
                        closestIndex = index;
                    }
                });

                currentIndex = closestIndex;
                updateDots();
            }, 120);
        });

        // Hide arrows if only one card
        if (cards.length <= 1) {
            if (prevBtn) prevBtn.style.display = 'none';
            if (nextBtn) nextBtn.style.display = 'none';
        }
    }
});
