document.addEventListener('DOMContentLoaded', function () {
    // Select initial language from localStorage or default to English
    let currentLanguage = localStorage.getItem('preferred-language') || 'en';

    function switchLanguage(lang) {
        // Text content
        document.querySelectorAll('[data-en][data-es]').forEach(el => {
            el.textContent = el.getAttribute('data-' + lang);
        });

        // Navigation active class
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });

        // Dropdown options
        updateFormOptions(lang);

        // Save language
        localStorage.setItem('preferred-language', lang);
    }

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            let lang = btn.dataset.lang;
            if (lang !== currentLanguage) {
                currentLanguage = lang;
                switchLanguage(lang);
            }
        });
    });

    function updateFormOptions(lang) {
        const options = {
            en: {
                company_size: ["10-50 employees", "50-200 employees", "200-500 employees", "500+ employees"],
                project_type: ["Business Intelligence", "AI Predictive Models", "Process Automation", "Not Sure - Need Consultation"],
                budget_range: ["€5,000 - €12,000", "€12,000 - €25,000", "€25,000+", "Need consultation"],
                timeline: ["6-8 weeks", "8-12 weeks", "12+ weeks", "Flexible"]
            },
            es: {
                company_size: ["10-50 empleados", "50-200 empleados", "200-500 empleados", "500+ empleados"],
                project_type: ["Inteligencia de Negocios", "Modelos Predictivos con IA", "Automatización de Procesos", "No estoy seguro - Necesito consulta"],
                budget_range: ["€5,000 - €12,000", "€12,000 - €25,000", "€25,000+", "Necesito consulta"],
                timeline: ["6-8 semanas", "8-12 semanas", "12+ semanas", "Flexible"]
            }
        };
        document.getElementById('company_size').innerHTML = options[lang].company_size.map(opt => `<option value="${opt}">${opt}</option>`).join('');
        document.getElementById('project_type').innerHTML = options[lang].project_type.map(opt => `<option value="${opt}">${opt}</option>`).join('');
        document.getElementById('budget_range').innerHTML = options[lang].budget_range.map(opt => `<option value="${opt}">${opt}</option>`).join('');
        document.getElementById('timeline').innerHTML = options[lang].timeline.map(opt => `<option value="${opt}">${opt}</option>`).join('');
    }

    // Initialize language and form options on page load
    switchLanguage(currentLanguage);

    // Smooth header background change on scroll
    let lastScrollTop = 0;
    const header = document.querySelector('.header');
    
    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add/remove scrolled class based on scroll position
        if (scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop;
    }

    // Throttle scroll events for better performance
    let ticking = false;
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(handleScroll);
            ticking = true;
            setTimeout(() => { ticking = false; }, 16);
        }
    }

    window.addEventListener('scroll', requestTick);

    // Responsive mobile nav toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    navToggle.addEventListener('click', function () {
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
            navMenu.classList.remove('active');
        }
    });

    // Smooth scrolling for nav links with offset for fixed header
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({ 
                    top: targetPosition, 
                    behavior: 'smooth' 
                });
            }
            
            // Close mobile menu after clicking
            navMenu.classList.remove('active');
        });
    });

    // Hero CTA scroll to contact
    const heroCta = document.querySelector('.hero-cta');
    if (heroCta) {
        heroCta.addEventListener('click', function() {
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                const headerHeight = header.offsetHeight;
                const targetPosition = contactSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({ 
                    top: targetPosition, 
                    behavior: 'smooth' 
                });
            }
        });
    }

    // Intersection Observer for card animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationDelay = Math.random() * 0.3 + 's';
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe all cards for animation
    document.querySelectorAll('.value-card, .process-card, .portfolio-card, .service-card').forEach(card => {
        cardObserver.observe(card);
    });

    // Contact Form Submission & Validation
    document.getElementById('contactForm').addEventListener('submit', function (e) {
        e.preventDefault();
        const lang = currentLanguage;
        const translations = {
            en: {
                required: "This field is required.",
                email: "Please enter a valid email address.",
                success: "Success! Your message has been sent."
            },
            es: {
                required: "Este campo es requerido.",
                email: "Por favor ingrese una dirección de email válida.",
                success: "¡Éxito! Su mensaje ha sido enviado."
            }
        };
        let valid = true, msg = "";

        this.querySelectorAll("input, select, textarea").forEach(el => {
            if (el.required && !el.value.trim()) {
                valid = false;
                msg += `${el.previousElementSibling.getAttribute('data-' + lang)}: ${translations[lang].required}<br>`;
            } else if (el.type === "email" && el.value && !el.value.match(/^[^@ ]+@[^@ ]+\.[^@ ]+$/)) {
                valid = false;
                msg += `${el.previousElementSibling.getAttribute('data-' + lang)}: ${translations[lang].email}<br>`;
            }
        });

        const formMsgEl = document.getElementById('formMessage');
        if (valid) {
            formMsgEl.innerHTML = translations[lang].success;
            formMsgEl.className = 'form-message';
            this.reset();
            
            // Smooth scroll to success message
            setTimeout(() => {
                formMsgEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        } else {
            formMsgEl.innerHTML = msg;
            formMsgEl.className = 'form-message error';
        }
    });

    // Add loading state to form submission
    const form = document.getElementById('contactForm');
    const submitBtn = document.querySelector('.form-submit');
    const originalSubmitText = submitBtn.textContent;

    form.addEventListener('submit', function() {
        submitBtn.disabled = true;
        submitBtn.textContent = currentLanguage === 'en' ? 'Sending...' : 'Enviando...';
        
        // Re-enable after animation
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = originalSubmitText;
        }, 2000);
    });
});