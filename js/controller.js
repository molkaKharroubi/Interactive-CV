
const CVController = {
    
    init() {
        // Initialise le modèle et la vue
        CVModel.init();
        CVView.init();

        // Configure les événements
        this.bindEvents();

        // Applique l'état initial
        this.applyInitialState();
    },

    /**
     * Lie les événements du DOM aux actions
     */
    bindEvents() {
        const elements = CVView.getElements();

        // Bouton de changement de thème
        if (elements.themeToggle) {
            elements.themeToggle.addEventListener('click', () => this.handleThemeToggle());
        }

        // Boutons de section (accordéon)
        elements.sectionHeaders.forEach(header => {
            header.addEventListener('click', (e) => {
                const sectionId = header.getAttribute('data-section');
                this.handleSectionToggle(sectionId);
            });
        });

        // Boutons de filtre des compétences
        elements.filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = btn.getAttribute('data-filter');
                this.handleSkillFilter(filter);
            });
        });

        // Boutons de détails supplémentaires
        elements.detailsToggles.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation(); // Empêche la propagation vers le header
                const targetId = btn.getAttribute('data-target');
                this.handleDetailsToggle(targetId);
            });
        });

        // Navigation fluide
        elements.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const sectionId = link.getAttribute('data-section');
                this.handleSmoothScroll(sectionId);
            });
        });

        // Bouton de téléchargement PDF
        if (elements.downloadPdfBtn) {
            elements.downloadPdfBtn.addEventListener('click', () => this.handlePDFDownload());
        }

        // Gestion du raccourci clavier pour le thème (Ctrl+Shift+T)
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'T') {
                e.preventDefault();
                this.handleThemeToggle();
            }
        });
    },

    /**
     * Applique l'état initial de l'application
     */
    applyInitialState() {
        // Applique le thème sauvegardé
        const theme = CVModel.getTheme();
        CVView.applyTheme(theme);

        // Ouvre les sections sauvegardées
        const activeSections = CVModel.state.activeSections;
        activeSections.forEach(sectionId => {
            CVView.toggleSection(sectionId, true);
        });

        // Applique le filtre de compétences sauvegardé
        const skillFilter = CVModel.getSkillFilter();
        CVView.filterSkills(skillFilter);
    },

    /**
     * Gère le changement de thème
     */
    handleThemeToggle() {
        const newTheme = CVModel.toggleTheme();
        CVView.applyTheme(newTheme);
        
        const themeLabel = newTheme === 'dark' ? 'sombre' : 'clair';
        CVView.showNotification(`Mode ${themeLabel} activé`, 'success');
    },

    /**
     * Gère l'ouverture/fermeture d'une section
     */
    handleSectionToggle(sectionId) {
        const isActive = CVModel.toggleSection(sectionId);
        CVView.toggleSection(sectionId, isActive);
    },

    /**
     * Gère le filtrage des compétences
     */
    handleSkillFilter(filter) {
        CVModel.setSkillFilter(filter);
        CVView.filterSkills(filter);

        const filterLabels = {
            'all': 'Toutes les compétences',
            'frontend': 'Compétences Frontend',
            'backend': 'Compétences Backend',
            'languages': 'Langages de programmation'
        };

        CVView.showNotification(filterLabels[filter] || 'Filtre appliqué', 'info');
    },

    /**
     * Gère l'affichage des détails supplémentaires
     */
    handleDetailsToggle(targetId) {
        const isExpanded = CVModel.toggleDetails(targetId);
        CVView.toggleDetails(targetId, isExpanded);
    },

    /**
     * Gère le scroll fluide vers une section
     */
    handleSmoothScroll(sectionId) {
        CVView.smoothScrollTo(sectionId);
        
        // Ouvre automatiquement la section si elle est fermée
        if (!CVModel.isSectionActive(sectionId)) {
            setTimeout(() => {
                this.handleSectionToggle(sectionId);
            }, 500);
        }
    },

    /**
     * Gère le téléchargement du PDF
     */
    async handlePDFDownload() {
        try {
            // Récupère les données d'export
            const exportData = CVModel.getExportData();
            
            // Génère le PDF via la vue
            await CVView.generatePDF();
            
            console.log('Export PDF:', exportData);
        } catch (error) {
            console.error('Erreur lors du téléchargement du PDF:', error);
            CVView.showNotification('Erreur lors de la génération du PDF', 'error');
        }
    },

    /**
     * Obtient l'état actuel de l'application (utile pour le débogage)
     */
    getState() {
        return {
            model: CVModel.state,
            theme: CVModel.getTheme(),
            skillFilter: CVModel.getSkillFilter()
        };
    },

    /**
     * Réinitialise l'application à son état par défaut
     */
    reset() {
        // Efface le localStorage
        localStorage.clear();
        
        // Recharge la page
        window.location.reload();
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CVController;
}