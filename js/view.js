
const CVView = {
    /**
     * Initialise la vue
     */
    init() {
        this.cacheElements();
        this.setupEventListeners();
    },

    /**
     * Met en cache les éléments DOM fréquemment utilisés
     */
    cacheElements() {
        this.elements = {
            body: document.body,
            themeToggle: document.getElementById('theme-toggle'),
            downloadPdfBtn: document.getElementById('download-pdf'),
            sectionHeaders: document.querySelectorAll('.section-header'),
            sectionContents: document.querySelectorAll('.section-content'),
            filterButtons: document.querySelectorAll('.filter-btn'),
            skillItems: document.querySelectorAll('.skill-bar-item'),
            detailsToggles: document.querySelectorAll('.details-toggle'),
            navLinks: document.querySelectorAll('.smooth-nav a'),
            skillProgressBars: document.querySelectorAll('.skill-progress-fill')
        };
    },

    /**
     * Configure les écouteurs d'événements de base
     */
    setupEventListeners() {
        // Les événements spécifiques seront liés par le contrôleur
        // Cette méthode peut être utilisée pour des événements globaux
        
        // Gestion du scroll pour la navigation
        window.addEventListener('scroll', () => this.updateActiveNavLink());
        
        // Intersection Observer pour les animations au scroll
        this.setupScrollAnimations();
    },

    /**
     * Configure les animations au scroll
     */
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Anime les barres de compétences quand elles deviennent visibles
                    if (entry.target.classList.contains('skill-bar-item')) {
                        this.animateSkillBar(entry.target);
                    }
                }
            });
        }, observerOptions);

        // Observer tous les éléments de compétences
        this.elements.skillItems.forEach(item => observer.observe(item));
    },

    /**
     * Anime une barre de compétence
     */
    animateSkillBar(skillItem) {
        const progressBar = skillItem.querySelector('.skill-progress-fill');
        if (progressBar && !progressBar.classList.contains('animated')) {
            const progress = progressBar.getAttribute('data-progress');
            progressBar.style.setProperty('--progress', progress + '%');
            progressBar.classList.add('animated');
        }
    },

    /**
     * Applique le thème à l'interface
     */
    applyTheme(theme) {
        if (theme === 'dark') {
            this.elements.body.classList.add('dark-theme');
            this.elements.themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            this.elements.body.classList.remove('dark-theme');
            this.elements.themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }

        // Animation de transition
        this.elements.body.style.transition = 'background 0.3s ease, color 0.3s ease';
    },

    /**
     * Bascule l'affichage d'une section
     */
    toggleSection(sectionId, isActive) {
        const header = document.querySelector(`[data-section="${sectionId}"]`);
        const content = document.querySelector(`[data-section-content="${sectionId}"]`);

        if (!header || !content) return;

        if (isActive) {
            header.classList.add('active');
            content.classList.add('active');
            
            // Anime les barres de compétences si c'est la section skills
            if (sectionId === 'skills') {
                setTimeout(() => {
                    this.elements.skillItems.forEach(item => {
                        if (!item.classList.contains('hidden')) {
                            this.animateSkillBar(item);
                        }
                    });
                }, 300);
            }
        } else {
            header.classList.remove('active');
            content.classList.remove('active');
        }
    },

    /**
     * Filtre et affiche les compétences
     */
    filterSkills(filter) {
        // Met à jour les boutons de filtre
        this.elements.filterButtons.forEach(btn => {
            if (btn.getAttribute('data-filter') === filter) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Filtre les éléments de compétences
        this.elements.skillItems.forEach(item => {
            const category = item.getAttribute('data-category');
            
            if (filter === 'all' || category === filter) {
                item.classList.remove('hidden');
                // Réanime la barre si elle est visible
                setTimeout(() => this.animateSkillBar(item), 100);
            } else {
                item.classList.add('hidden');
            }
        });
    },

    /**
     * Bascule l'affichage des détails d'une expérience
     */
    toggleDetails(detailsId, isExpanded) {
        const detailsElement = document.getElementById(detailsId);
        const toggleButton = document.querySelector(`[data-target="${detailsId}"]`);

        if (!detailsElement || !toggleButton) return;

        if (isExpanded) {
            detailsElement.classList.add('active');
            toggleButton.innerHTML = '<i class="fas fa-minus"></i> Moins de détails';
        } else {
            detailsElement.classList.remove('active');
            toggleButton.innerHTML = '<i class="fas fa-plus"></i> Plus de détails';
        }
    },

    /**
     * Met à jour le lien de navigation actif selon le scroll
     */
    updateActiveNavLink() {
        const sections = document.querySelectorAll('.cv-section');
        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop - 200) {
                currentSection = section.getAttribute('id').replace('-section', '');
            }
        });

        this.elements.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === currentSection) {
                link.classList.add('active');
            }
        });
    },

    /**
     * Scroll fluide vers une section
     */
    smoothScrollTo(sectionId) {
        const section = document.getElementById(sectionId + '-section');
        if (section) {
            section.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    },

    /**
     * Affiche une notification
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            padding: 15px 25px;
            background: ${type === 'success' ? '#10b981' : '#3b82f6'};
            color: white;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    },

    /**
     * Prépare le contenu pour l'impression
     */
    prepareForPrint() {
        // Ouvre toutes les sections pour l'impression
        this.elements.sectionContents.forEach(content => {
            content.classList.add('active');
        });

        // Affiche tous les détails
        document.querySelectorAll('.additional-details').forEach(detail => {
            detail.classList.add('active');
        });
    },

    /**
     * Génère et télécharge le PDF
     */
    async generatePDF() {

        try {
            // Prépare le contenu
            this.prepareForPrint();

            // Utilise l'API d'impression du navigateur
            // Pour une vraie génération PDF, il faudrait utiliser une bibliothèque comme jsPDF ou html2pdf
            window.print();

            this.showNotification('PDF prêt à être téléchargé !', 'success');
        } catch (error) {
            console.error('Erreur lors de la génération du PDF:', error);
            this.showNotification('Erreur lors de la génération du PDF', 'error');
        }
    },

    /**
     * Obtient les éléments DOM
     */
    getElements() {
        return this.elements;
    }
};

// Ajout des animations CSS dynamiques
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    .notification {
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 10px;
    }
`;
document.head.appendChild(style);

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CVView;
}