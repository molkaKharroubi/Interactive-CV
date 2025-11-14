const CVModel = {
    // État de l'application
    state: {
        theme: 'light',
        activeSections: new Set(),
        skillFilter: 'all',
        expandedDetails: new Set()
    },

    // Données des compétences avec catégories
    skills: [
        { name: 'HTML5/CSS3', category: 'frontend', progress: 90 },
        { name: 'JavaScript', category: 'frontend', progress: 85 },
        { name: 'React', category: 'frontend', progress: 80 },
        { name: 'Angular', category: 'frontend', progress: 75 },
        { name: 'ASP.NET', category: 'backend', progress: 85 },
        { name: 'Node.js', category: 'backend', progress: 80 },
        { name: 'Java', category: 'languages', progress: 85 },
        { name: 'Python', category: 'languages', progress: 80 }
    ],

    /**
     * Initialise le modèle en chargeant les données du localStorage
     */
    init() {
        this.loadFromStorage();
        this.initDefaultSections();
    },

    /**
     * Charge les préférences depuis localStorage
     */
    loadFromStorage() {
        const savedTheme = localStorage.getItem('cv-theme');
        if (savedTheme) {
            this.state.theme = savedTheme;
        }

        const savedSections = localStorage.getItem('cv-active-sections');
        if (savedSections) {
            try {
                const sections = JSON.parse(savedSections);
                this.state.activeSections = new Set(sections);
            } catch (e) {
                console.error('Erreur lors du chargement des sections:', e);
            }
        }

        const savedFilter = localStorage.getItem('cv-skill-filter');
        if (savedFilter) {
            this.state.skillFilter = savedFilter;
        }
    },

    /**
     * Sauvegarde les préférences dans localStorage
     */
    saveToStorage() {
        localStorage.setItem('cv-theme', this.state.theme);
        localStorage.setItem('cv-active-sections', JSON.stringify([...this.state.activeSections]));
        localStorage.setItem('cv-skill-filter', this.state.skillFilter);
    },

    /**
     * Initialise les sections par défaut (profil ouvert)
     */
    initDefaultSections() {
        if (this.state.activeSections.size === 0) {
            this.state.activeSections.add('profile');
        }
    },

    /**
     * Bascule le thème clair/sombre
     */
    toggleTheme() {
        this.state.theme = this.state.theme === 'light' ? 'dark' : 'light';
        this.saveToStorage();
        return this.state.theme;
    },

    /**
     * Obtient le thème actuel
     */
    getTheme() {
        return this.state.theme;
    },

    /**
     * Bascule l'état d'une section
     */
    toggleSection(sectionId) {
        if (this.state.activeSections.has(sectionId)) {
            this.state.activeSections.delete(sectionId);
        } else {
            this.state.activeSections.add(sectionId);
        }
        this.saveToStorage();
        return this.state.activeSections.has(sectionId);
    },

    /**
     * Vérifie si une section est active
     */
    isSectionActive(sectionId) {
        return this.state.activeSections.has(sectionId);
    },

    /**
     * Définit le filtre de compétences
     */
    setSkillFilter(filter) {
        this.state.skillFilter = filter;
        this.saveToStorage();
        return filter;
    },

    /**
     * Obtient le filtre actuel
     */
    getSkillFilter() {
        return this.state.skillFilter;
    },

    /**
     * Filtre les compétences selon la catégorie
     */
    getFilteredSkills(filter = this.state.skillFilter) {
        if (filter === 'all') {
            return this.skills;
        }
        return this.skills.filter(skill => skill.category === filter);
    },

    /**
     * Bascule l'affichage des détails d'une expérience
     */
    toggleDetails(detailId) {
        if (this.state.expandedDetails.has(detailId)) {
            this.state.expandedDetails.delete(detailId);
        } else {
            this.state.expandedDetails.add(detailId);
        }
        return this.state.expandedDetails.has(detailId);
    },

    /**
     * Vérifie si les détails sont affichés
     */
    areDetailsExpanded(detailId) {
        return this.state.expandedDetails.has(detailId);
    },

    /**
     * Obtient toutes les données pour l'export PDF
     */
    getExportData() {
        return {
            theme: this.state.theme,
            skills: this.skills,
            timestamp: new Date().toISOString()
        };
    }
};

// Initialisation du modèle
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CVModel;
}