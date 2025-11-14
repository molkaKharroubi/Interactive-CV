(function() {
    'use strict';

    /**
     * Initialisation de l'application au chargement du DOM
     */
    document.addEventListener('DOMContentLoaded', function() {
        console.log(' Initialisation du CV interactif...');

        try {
            // Initialise le contrôleur (qui initialise automatiquement le modèle et la vue)
            CVController.init();

            console.log(' CV interactif initialisé avec succès');
            console.log(' État actuel:', CVController.getState());

            // Affiche un message de bienvenue si c'est la première visite
            if (!localStorage.getItem('cv-visited')) {
                showWelcomeMessage();
                localStorage.setItem('cv-visited', 'true');
            }

            // Active les fonctionnalités avancées
            initAdvancedFeatures();

        } catch (error) {
            console.error(' Erreur lors de l\'initialisation:', error);
            showErrorMessage();
        }
    });

    /**
     * Affiche un message de bienvenue
     */
    function showWelcomeMessage() {
        setTimeout(() => {
            const welcome = document.createElement('div');
            welcome.className = 'welcome-overlay';
            welcome.innerHTML = `
                <div class="welcome-content">
                    <h2>👋 Bienvenue sur mon CV interactif !</h2>
                    <p>Explorez mes compétences et mon parcours professionnel.</p>
                    <ul class="welcome-features">
                        <li><i class="fas fa-moon"></i> Basculez entre mode clair et sombre</li>
                        <li><i class="fas fa-filter"></i> Filtrez les compétences par catégorie</li>
                        <li><i class="fas fa-file-pdf"></i> Téléchargez mon CV en PDF</li>
                        <li><i class="fas fa-keyboard"></i> Raccourci: Ctrl+Shift+T pour changer le thème</li>
                    </ul>
                    <button class="welcome-btn" onclick="this.parentElement.parentElement.remove()">
                        Commencer <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            `;

            // Styles pour le message de bienvenue
            const style = document.createElement('style');
            style.textContent = `
                .welcome-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.8);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                    animation: fadeIn 0.3s ease;
                }

                .welcome-content {
                    background: white;
                    padding: 40px;
                    border-radius: 20px;
                    max-width: 500px;
                    text-align: center;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                    animation: slideUp 0.5s ease;
                }

                body.dark-theme .welcome-content {
                    background: #1e293b;
                    color: #f1f5f9;
                }

                .welcome-content h2 {
                    color: #1e40af;
                    margin-bottom: 15px;
                    font-size: 1.8em;
                }

                body.dark-theme .welcome-content h2 {
                    color: #60a5fa;
                }

                .welcome-content p {
                    color: #6b7280;
                    margin-bottom: 25px;
                    font-size: 1.1em;
                }

                body.dark-theme .welcome-content p {
                    color: #cbd5e1;
                }

                .welcome-features {
                    list-style: none;
                    padding: 0;
                    margin: 25px 0;
                    text-align: left;
                }

                .welcome-features li {
                    padding: 10px 0;
                    color: #374151;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                body.dark-theme .welcome-features li {
                    color: #cbd5e1;
                }

                .welcome-features i {
                    color: #1e40af;
                    font-size: 1.2em;
                    width: 25px;
                }

                body.dark-theme .welcome-features i {
                    color: #60a5fa;
                }

                .welcome-btn {
                    background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
                    color: white;
                    border: none;
                    padding: 15px 30px;
                    border-radius: 25px;
                    font-size: 1.1em;
                    font-weight: 600;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    transition: all 0.3s ease;
                }

                .welcome-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 25px rgba(30, 58, 138, 0.4);
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(50px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `;

            document.head.appendChild(style);
            document.body.appendChild(welcome);
        }, 1000);
    }

    /**
     * Affiche un message d'erreur
     */
    function showErrorMessage() {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #ef4444;
            color: white;
            padding: 20px 40px;
            border-radius: 10px;
            z-index: 10000;
            text-align: center;
        `;
        errorDiv.innerHTML = `
            <h3>⚠️ Erreur d'initialisation</h3>
            <p>Une erreur s'est produite lors du chargement du CV.</p>
            <button onclick="location.reload()" style="
                margin-top: 15px;
                padding: 10px 20px;
                background: white;
                color: #ef4444;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-weight: bold;
            ">Recharger la page</button>
        `;
        document.body.appendChild(errorDiv);
    }

    /**
     * Initialise les fonctionnalités avancées
     */
    function initAdvancedFeatures() {
        // Animation de la barre de progression au chargement
        animateProgressBarsOnLoad();

        // Détection du thème système
        detectSystemTheme();

        // Statistiques de visite (pour analytics)
        trackPageView();

        // Ajout de la fonctionnalité de copie rapide
        addQuickCopyFeature();

        // Optimisation des performances
        optimizePerformance();
    }

    /**
     * Anime les barres de progression au chargement
     */
    function animateProgressBarsOnLoad() {
        const skillSection = document.getElementById('skills-section');
        if (skillSection) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const progressBars = entry.target.querySelectorAll('.skill-progress-fill');
                        progressBars.forEach((bar, index) => {
                            setTimeout(() => {
                                const progress = bar.getAttribute('data-progress');
                                bar.style.setProperty('--progress', progress + '%');
                                bar.classList.add('animated');
                            }, index * 100);
                        });
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2 });

            observer.observe(skillSection);
        }
    }

    /**
     * Détecte et applique le thème système
     */
    function detectSystemTheme() {
        if (!localStorage.getItem('cv-theme')) {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefersDark) {
                CVModel.state.theme = 'dark';
                CVView.applyTheme('dark');
                CVModel.saveToStorage();
            }
        }

        // Écoute les changements de thème système
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('cv-theme-manual')) {
                const newTheme = e.matches ? 'dark' : 'light';
                CVModel.state.theme = newTheme;
                CVView.applyTheme(newTheme);
            }
        });
    }

    /**
     * Enregistre la visite de la page
     */
    function trackPageView() {
        const visits = parseInt(localStorage.getItem('cv-visits') || '0') + 1;
        localStorage.setItem('cv-visits', visits.toString());
        localStorage.setItem('cv-last-visit', new Date().toISOString());
        
        console.log(` Nombre de visites: ${visits}`);
    }

    /**
     * Ajoute la fonctionnalité de copie rapide des informations de contact
     */
    function addQuickCopyFeature() {
        const contactItems = document.querySelectorAll('.contact-item');
        contactItems.forEach(item => {
            item.style.cursor = 'pointer';
            item.title = 'Cliquer pour copier';
            
            item.addEventListener('click', function() {
                const text = this.textContent.trim();
                navigator.clipboard.writeText(text).then(() => {
                    CVView.showNotification(`Copié: ${text}`, 'success');
                }).catch(err => {
                    console.error('Erreur lors de la copie:', err);
                });
            });
        });
    }

    /**
     * Optimise les performances
     */
    function optimizePerformance() {
        // Lazy loading des images
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));

        // Débounce du scroll
        let scrollTimeout;
        const originalScrollHandler = window.onscroll;
        window.onscroll = function() {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                if (originalScrollHandler) originalScrollHandler();
            }, 50);
        };
    }

    // Expose l'API publique
    window.CVApp = {
        getState: () => CVController.getState(),
        reset: () => CVController.reset(),
        version: '2.0.0',
        author: 'Molka Kharroubi'
    };

    console.log(' API publique disponible: window.CVApp');
})();
