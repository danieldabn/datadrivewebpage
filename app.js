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

    // Responsive mobile nav toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    navToggle.addEventListener('click', function () {
        navMenu.classList.toggle('active');
    });

    // Smooth scrolling for nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
            }
            navMenu.classList.remove('active');
        });
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
            } else if (el.type === "email" && el.value && !el.value.match(/^[^@ ]+@[^@ ]+\\.[^@ ]+$/)) {
                valid = false;
                msg += `${el.previousElementSibling.getAttribute('data-' + lang)}: ${translations[lang].email}<br>`;
            }
        });

        const formMsgEl = document.getElementById('formMessage');
        if (valid) {
            formMsgEl.innerHTML = translations[lang].success;
            formMsgEl.classList.add('success');
            this.reset();
        } else {
            formMsgEl.innerHTML = msg;
            formMsgEl.classList.remove('success');
        }
    });

});
