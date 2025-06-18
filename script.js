class TchoinlandApp {
    constructor() {
        this.currentGame = null;
        // Récupérer la préférence de musique sauvegardée (par défaut activée pour les vraies tchoin ! 💅)
        this.musicEnabled = localStorage.getItem('tchoinMusicEnabled') !== 'false';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupMusic();
        this.addRandomSparkles();
        this.updateMusicButton();
        console.log('🦄 Bienvenue dans Tchoinland.fun ! 💅');
    }

    setupEventListeners() {
        // Game card clicks
        document.querySelectorAll('.game-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const gameType = card.getAttribute('data-game');
                this.playClickSound();
                this.openGame(gameType);
            });
        });

        // Back button
        document.getElementById('backBtn').addEventListener('click', () => {
            this.playClickSound();
            this.closeGame();
        });

        // Music toggle
        document.getElementById('musicToggle').addEventListener('click', () => {
            this.toggleMusic();
        });

        // Add click sound to bouncy text
        document.querySelector('.bouncy-text').addEventListener('click', () => {
            this.playTchoinSound();
        });
    }

    setupMusic() {
        // Gestion de la vraie musique "Reine de la Tchoin" 🎵👑
        this.backgroundMusic = document.getElementById('backgroundMusic');
        this.musicLoaded = false;
        
        // Web Audio Context pour les effets sonores
        this.audioContext = null;
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Audio context not supported');
        }

        // Quand la musique est chargée, on configure le démarrage aléatoire
        this.backgroundMusic.addEventListener('loadedmetadata', () => {
            this.musicLoaded = true;
            console.log('🎵👑 "Reine de la Tchoin" chargée ! Durée:', Math.round(this.backgroundMusic.duration), 'secondes de pur délire ! 💅✨');
        });

        // Gérer les erreurs de chargement
        this.backgroundMusic.addEventListener('error', (e) => {
            console.log('🎵❌ Erreur de chargement de la musique:', e);
            console.log('Vérifiez que le fichier "Reine de la Tchoin.mp3" existe dans le dossier !');
        });

        // Détecter quand la musique commence vraiment à jouer
        this.backgroundMusic.addEventListener('playing', () => {
            console.log('🎵🎉 "Reine de la Tchoin" est maintenant en cours de lecture !');
        });

        // Quand la musique se termine, on la relance depuis le début
        this.backgroundMusic.addEventListener('ended', () => {
            console.log('🎵✨ "Reine de la Tchoin" terminée ! On relance le hit ! 💅🔥');
            this.startMusicFromRandomPosition();
        });

        // Auto-play quand possible (après interaction utilisateur)
        document.addEventListener('click', this.tryAutoPlay.bind(this), { once: true });
        document.addEventListener('touchstart', this.tryAutoPlay.bind(this), { once: true });
        
        // Force l'activation audio sur mobile
        document.addEventListener('touchend', () => {
            if (this.audioContext && this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }
        }, { once: true });
    }

    tryAutoPlay() {
        console.log('🎵 Tentative de démarrage audio automatique...');
        
        // Activer l'audio context si suspendu
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume().then(() => {
                console.log('🎵 Audio context activé !');
            });
        }
        
        // Démarrer la musique si activée
        if (this.musicEnabled && this.musicLoaded) {
            this.startMusicFromRandomPosition();
        } else if (this.musicEnabled && !this.musicLoaded) {
            // Si la musique n'est pas encore chargée, attendre
            setTimeout(() => this.tryAutoPlay(), 1000);
        }
    }

    startMusicFromRandomPosition() {
        if (!this.backgroundMusic || !this.musicLoaded) {
            console.log('🎵❌ Musique non disponible - backgroundMusic:', !!this.backgroundMusic, 'musicLoaded:', this.musicLoaded);
            return;
        }
        
        const duration = this.backgroundMusic.duration;
        if (duration && duration > 0) {
            // Position aléatoire entre 0 et les 3/4 de la musique 
            // (pour éviter de commencer trop près de la fin)
            const randomPosition = Math.random() * (duration * 0.75);
            
            const funMessages = [
                `🎵💅 "Reine de la Tchoin" démarre à ${Math.round(randomPosition)}s ! Prépare-toi à slayer ! ✨`,
                `🎵👑 Le hit commence à ${Math.round(randomPosition)}s ! Tes oreilles vont être bénies ! 💖`,
                `🎵🔥 ${Math.round(randomPosition)}s de pur bonheur musical qui t'attend ! Let's go ! 🚀`,
                `🎵✨ Random start à ${Math.round(randomPosition)}s parce qu'on est des rebelles ! 💅`,
                `🎵🦄 La mélodie divine commence à ${Math.round(randomPosition)}s ! Prépare ton âme ! 👑`
            ];
            console.log(funMessages[Math.floor(Math.random() * funMessages.length)]);
            
            try {
                this.backgroundMusic.currentTime = randomPosition;
                this.backgroundMusic.volume = 0.7; // Volume à 70%
                
                this.backgroundMusic.play().then(() => {
                    console.log('🎵✅ Musique démarrée avec succès !');
                    this.updateMusicButton();
                }).catch(e => {
                    console.log('🎵❌ Lecture bloquée par le navigateur:', e.message);
                    // Afficher un message à l'utilisateur
                    this.showMusicUnlockMessage();
                });
            } catch (error) {
                console.log('🎵❌ Erreur lors du démarrage:', error);
            }
        } else {
            console.log('🎵❌ Durée de musique invalide:', duration);
        }
    }

    toggleMusic() {
        this.musicEnabled = !this.musicEnabled;
        const toggle = document.getElementById('musicToggle');
        
        if (this.musicEnabled) {
            toggle.textContent = '🔊';
            toggle.classList.add('playing');
            
            // Tenter de démarrer la musique
            if (this.musicLoaded) {
                this.startMusicFromRandomPosition();
            } else {
                console.log('🎵⏳ Musique pas encore chargée, on attend...');
                // Réessayer dans 1 seconde
                setTimeout(() => {
                    if (this.musicLoaded) {
                        this.startMusicFromRandomPosition();
                    }
                }, 1000);
            }
            
            // Animation de démarrage
            toggle.style.animation = 'bounce 1s ease-in-out';
            setTimeout(() => toggle.style.animation = '', 1000);
        } else {
            toggle.textContent = '🔇';
            toggle.classList.remove('playing');
            
            // Arrêter la musique proprement
            if (this.backgroundMusic && !this.backgroundMusic.paused) {
                this.backgroundMusic.pause();
                console.log('🎵⏸️ Musique mise en pause');
            }
            
            // Animation d'arrêt
            toggle.style.transform = 'scale(0.8)';
            setTimeout(() => toggle.style.transform = 'scale(1)', 200);
        }
        
        toggle.classList.add('pulse');
        setTimeout(() => toggle.classList.remove('pulse'), 500);
        
        // Sauvegarde de la préférence
        localStorage.setItem('tchoinMusicEnabled', this.musicEnabled);
    }

    showMusicUnlockMessage() {
        // Créer un message stylé pour débloquer la musique
        const messageDiv = document.createElement('div');
        messageDiv.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(45deg, #ff69b4, #da70d6);
                color: white;
                padding: 2rem;
                border-radius: 20px;
                text-align: center;
                z-index: 10000;
                box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                font-family: 'Righteous', cursive;
            ">
                <h3>🎵 Active la musique ! 🎵</h3>
                <p>Clique sur le bouton 🔊 pour lancer "Reine de la Tchoin" ! 👑</p>
                <button onclick="this.parentElement.parentElement.remove(); app.toggleMusic();" style="
                    background: rgba(255,255,255,0.3);
                    border: none;
                    padding: 1rem 2rem;
                    border-radius: 25px;
                    color: white;
                    font-size: 1.2rem;
                    cursor: pointer;
                    margin-top: 1rem;
                ">🔊 Let's go ! 🔊</button>
            </div>
        `;
        document.body.appendChild(messageDiv);
        
        // Auto-suppression après 5 secondes
        setTimeout(() => {
            if (document.body.contains(messageDiv)) {
                document.body.removeChild(messageDiv);
            }
        }, 5000);
    }

    updateMusicButton() {
        const toggle = document.getElementById('musicToggle');
        if (toggle) {
            toggle.textContent = this.musicEnabled ? '🔊' : '🔇';
            if (this.musicEnabled) {
                toggle.classList.add('playing');
            } else {
                toggle.classList.remove('playing');
            }
        }
    }

    playClickSound() {
        this.playBeep(300, 100);
    }

    playTchoinSound() {
        // Fun "tchoin" sound simulation
        this.playBeep(400, 100);
        setTimeout(() => this.playBeep(600, 150), 100);
    }

    playBeep(frequency, duration) {
        if (!this.audioContext || !this.musicEnabled) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration / 1000);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration / 1000);
    }

    addRandomSparkles() {
        setInterval(() => {
            if (Math.random() < 0.3) {
                this.createSparkle();
            }
        }, 1000);
    }

    createSparkle() {
        const sparkle = document.createElement('div');
        sparkle.textContent = ['✨', '💎', '⭐', '🌟', '💅'][Math.floor(Math.random() * 5)];
        sparkle.style.position = 'fixed';
        sparkle.style.left = Math.random() * window.innerWidth + 'px';
        sparkle.style.top = Math.random() * window.innerHeight + 'px';
        sparkle.style.fontSize = '2rem';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.zIndex = '9999';
        sparkle.style.animation = 'sparkle-fade 2s ease-out forwards';
        
        document.body.appendChild(sparkle);
        
        setTimeout(() => {
            document.body.removeChild(sparkle);
        }, 2000);
    }

    openGame(gameType) {
        this.currentGame = gameType;
        document.getElementById('game-screen').classList.remove('hidden');
        const content = document.getElementById('game-content');
        
        // Relancer la musique à un moment aléatoire quand on change de jeu ! 🎵
        if (this.musicEnabled && this.musicLoaded && !this.backgroundMusic.paused) {
            this.startMusicFromRandomPosition();
        }
        
        switch(gameType) {
            case 'quizz':
                this.loadQuizzGame(content);
                break;
            case 'tchoingpt':
                this.loadTchoinGPT(content);
                break;
            case 'tchoin-or-not':
                this.loadTchoinOrNot(content);
                break;
            case 'flappy':
                this.loadFlappyTchoin(content);
                break;
            case 'tchoinometer':
                this.loadTchoinometer(content);
                break;
            case 'championship':
                this.loadChampionship(content);
                break;
            case 'rap-battle':
                this.loadRapBattle(content);
                break;
            case 'facts':
                this.loadTchoinFacts(content);
                break;
            case 'tchoinmeni':
                this.loadTchoinmeni(content);
                break;
            case 'tinder-tchoin':
                this.loadTinderTchoin(content);
                break;
            case 'tchoin-academy':
                this.loadTchoinAcademy(content);
                break;
        }
    }

    closeGame() {
        document.getElementById('game-screen').classList.add('hidden');
        this.currentGame = null;
    }

    loadQuizzGame(container) {
        const allQuestions = [
            {
                question: "Quel est l'élément chimique préféré d'une tchoin 👩‍🔬?",
                options: ["L'oréal", "Le glitterium ✨", "Le fer à lisser 💇‍♀️", "Le blushium 💄"],
                correct: 1,
                explanation: "Le glitterium est l'élément le plus précieux du tableau périodique des tchoin ! Il brille même dans le noir ! ✨"
            },
            {
                question: "Quel est l'animal totem d'une tchoin 🦄?",
                options: ["Le pigeon sous filtre Snap 🐦📱", "Le raton-laveur influenceur 🦝💅", "Le chihuahua stressé 🐕😰", "Le furet en bottes UGG 🦫👢"],
                correct: 0,
                explanation: "Le pigeon sous filtre Snap représente parfaitement l'art de l'illusion ! Plus c'est fake, plus c'est tchoin ! 📸"
            },
            {
                question: "Quelle est la devise officielle des tchoin 👑?",
                options: ["Fake it till you make it 🎭", "Glitter is life ✨", "Selfie first, questions later 🤳", "Toutes les réponses 💯"],
                correct: 3,
                explanation: "Toutes ces devises sont gravées dans le marbre rose du temple de la tchoinerie ! La trinité sacrée ! 💅"
            },
            {
                question: "Combien de fois par jour une tchoin se regarde dans son téléphone 📱?",
                options: ["Entre 50 et 100 fois 👀", "Plus de 200 fois 🤳", "Je compte plus depuis 2019 💫", "Mon téléphone c'est un miroir permanent 🪞"],
                correct: 2,
                explanation: "Une vraie tchoin a arrêté de compter depuis qu'elle a découvert la cam frontale ! 💅"
            },
            {
                question: "Quelle est la pire catastrophe pour une tchoin 😱?",
                options: ["Perdre ses faux-cils dans la piscine 👁️💧", "Oublier son chargeur et être à 5% 🔋💀", "Se faire griller avec un filtre raté 📸🤡", "Toutes ces réponses me donnent des cauchemars 😰"],
                correct: 3,
                explanation: "Le triptyque de l'apocalypse tchoin ! Chaque option peut déclencher une crise existentielle ! 💀"
            },
            {
                question: "Quel est le sport national des tchoin 🏆?",
                options: ["Le marathon Instagram stories 📱💨", "La gym avec 50 selfies entre chaque série 🏋️‍♀️🤳", "Le yoga mais juste pour les poses photogéniques 🧘‍♀️📸", "Le shopping olympique en talons 👠🛍️"],
                correct: 0,
                explanation: "Le marathon stories ! 24h d'affilée à documenter sa life, c'est de l'endurance pure ! 💪"
            },
            {
                question: "Comment une tchoin dit bonjour 👋?",
                options: ["Salut ma queen 👑", "Hey babe comment tu gères ? 💅", "*envoie 47 emojis* 🦄✨💖", "Elle fait juste un selfie avec toi 🤳"],
                correct: 2,
                explanation: "Les vraies tchoin communiquent en emoji ! Un bonjour sans au moins 20 emojis, c'est impoli ! 🦄✨💖💅👑"
            },
            {
                question: "Quelle est l'unité de mesure du temps chez les tchoin ⏰?",
                options: ["Le temps de séchage du vernis 💅⏳", "La durée d'une story Instagram 📱⏱️", "Le temps entre deux selfies 🤳📸", "L'attente du like de son crush 💕⏰"],
                correct: 1,
                explanation: "15 secondes de story = 1 unité de temps tchoin ! Tout se mesure en stories dans ce monde ! 📱"
            },
            {
                question: "Quel est le 8ème art selon les tchoin 🎨?",
                options: ["L'art du contouring 💄🎭", "L'art de l'angle parfait pour un selfie 📸📐", "L'art de faire semblant d'être naturelle 🌿😇", "L'art de filtrer sa voix sur TikTok 🎤🤖"],
                correct: 1,
                explanation: "L'angle parfait ! C'est de la géométrie avancée combinée à de la physique quantique ! 📐✨"
            },
            {
                question: "Quelle matière devrait être obligatoire à l'école selon les tchoin 🎓?",
                options: ["Cours avancé de filtres Snapchat 📱👻", "Histoire des tendances TikTok 📚🎭", "Mathématiques appliquées au ratio like/followers 📊💯", "Philosophie du duck face 🦆🤔"],
                correct: 2,
                explanation: "Les maths du ratio ! Comment optimiser son engagement rate, c'est de la science pure ! 📊"
            },
            {
                question: "Que mange une tchoin au petit-déjeuner 🥞?",
                options: ["Des avocado toasts photogéniques 🥑📸", "Du thé détox avec des paillettes comestibles ✨🍵", "Des compliments sur ses stories de la veille 💕📱", "De la confiance en soi avec des vitamines B-eauty 💊💅"],
                correct: 2,
                explanation: "Les compliments, c'est le carburant principal ! Plus nutritif que les superfoods ! 💕"
            },
            {
                question: "Quel est le cauchemar récurrent d'une tchoin 😴💭?",
                options: ["Poster une photo sans filtre par accident 📸😱", "Se réveiller avec les cheveux de Hagrid 🧙‍♀️💇‍♀️", "Découvrir que ses followers sont des bots 🤖💔", "Réaliser qu'elle ressemble à ses photos 🪞😂"],
                correct: 0,
                explanation: "L'accident de photo naturelle ! Plus terrifiant qu'un film d'horreur ! 😱"
            }
        ];
        
        // Sélectionner 5 questions au hasard
        const questions = allQuestions.sort(() => Math.random() - 0.5).slice(0, 5);

        let currentQuestion = 0;
        let score = 0;

        const renderQuestion = () => {
            const q = questions[currentQuestion];
            container.innerHTML = `
                <div class="quiz-container">
                    <h2>🧠 Qui veut être une Tchoin ? ✨</h2>
                    <div class="question-counter">Question ${currentQuestion + 1}/${questions.length}</div>
                    <div class="score">Score: ${score}/${questions.length}</div>
                    <div class="question">${q.question}</div>
                    <div class="options">
                        ${q.options.map((option, index) => 
                            `<button class="option-btn" data-index="${index}">${option}</button>`
                        ).join('')}
                    </div>
                    <div class="jokers">
                        <button class="joker-btn">📞 Appeler une Tchoin</button>
                        <button class="joker-btn">🧠 50/50 de neurones</button>
                        <button class="joker-btn">💅 Demander au bar à ongles</button>
                    </div>
                </div>
            `;

            // Add styles for quiz
            if (!document.getElementById('quiz-styles')) {
                const style = document.createElement('style');
                style.id = 'quiz-styles';
                style.textContent = `
                    .quiz-container { text-align: center; }
                    .question-counter, .score { margin: 1rem 0; font-size: 1.2rem; }
                    .question { font-size: 1.5rem; margin: 2rem 0; padding: 1rem; background: rgba(255,255,255,0.1); border-radius: 15px; }
                    .options { display: grid; gap: 1rem; margin: 2rem 0; }
                    .option-btn { padding: 1rem; border: none; border-radius: 15px; background: rgba(255,255,255,0.2); color: white; font-size: 1.1rem; cursor: pointer; transition: all 0.3s; }
                    .option-btn:hover { background: rgba(255,255,255,0.3); transform: scale(1.02); }
                    .jokers { display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; margin-top: 2rem; }
                    .joker-btn { padding: 0.5rem 1rem; border: 2px solid rgba(255,255,255,0.3); border-radius: 20px; background: rgba(255,255,255,0.1); color: white; cursor: pointer; }
                `;
                document.head.appendChild(style);
            }

            // Add event listeners
            container.querySelectorAll('.option-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const selectedIndex = parseInt(e.target.getAttribute('data-index'));
                    const isCorrect = selectedIndex === q.correct;
                    
                    if (isCorrect) {
                        score++;
                        e.target.classList.add('success-flash');
                        this.playBeep(600, 200);
                    } else {
                        e.target.classList.add('error-shake');
                        this.playBeep(200, 300);
                    }

                    setTimeout(() => {
                        if (currentQuestion < questions.length - 1) {
                            currentQuestion++;
                            renderQuestion();
                        } else {
                            showResults();
                        }
                    }, 1500);
                });
            });

            // Joker buttons avec des réponses hilarantes
            container.querySelectorAll('.joker-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const jokerText = btn.textContent;
                    let jokes = [];
                    
                    if (jokerText.includes('Appeler')) {
                        jokes = [
                            "Allô ma tchoin ? J'ai besoin de toi là... *bruit de fond de bar à ongles* Attends j'entends rien avec mes extensions... 💅",
                            "*sonnerie* Bonjour vous êtes sur le répondeur de Jessica, je suis en séance UV, laissez un message après le bip... BIPPP 📱",
                            "Ouais salut... écoute là j'suis en live TikTok donc je peux pas trop parler mais choisis la réponse avec le plus d'emojis 🤳",
                            "*téléphone qui vibre* Oh merde j'ai plus de battery... mais bon choisis au feeling ma belle ! 🔋💀"
                        ];
                    } else if (jokerText.includes('50/50')) {
                        jokes = [
                            "*supprime deux mauvaises réponses* Ah ben maintenant c'est plus facile ! Enfin j'espère... 🤡",
                            "Bon j'ai supprimé des trucs au hasard... j'avoue j'ai pas fait attention 😅",
                            "*supprime la bonne réponse par accident* Oups... bon bah tu choisis dans ce qui reste ! 🤪",
                            "J'ai supprimé les réponses les moins esthétiques, maintenant c'est plus joli ! ✨"
                        ];
                    } else {
                        jokes = [
                            "*bruit d'aspirateur à ongles* QUOI ?! Répète ta question ma belle, on t'entend pas ! 💅💨",
                            "Les filles du bar disent que c'est la réponse qui brille le plus... genre littéralement hein ✨",
                            "*chuchotements* Psst... choisis celle qui te donnerait le plus de likes sur Insta 📸",
                            "Attends j'demande à ma collègue... *cris* KINBERLEY ! C'est quoi la réponse ?! Elle dit qu'elle s'en fiche 💄"
                        ];
                    }
                    
                    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
                    alert(randomJoke);
                    
                    // Petite animation sur le bouton
                    btn.style.background = 'rgba(255,215,0,0.3)';
                    btn.disabled = true;
                    setTimeout(() => {
                        btn.style.background = 'rgba(255,255,255,0.1)';
                    }, 2000);
                });
            });
        };

        const showResults = () => {
            const percentage = Math.round((score / questions.length) * 100);
            let message = "", title = "", subtitle = "";
            
            if (percentage === 100) {
                title = "🏆👑 DÉESSE TCHOIN ABSOLUE 👑🏆";
                message = "INCROYABLE ! Tu as atteint le niveau divin de la tchoinerie ! Même les licornes sont jalouses de ton aura ✨🦄";
                subtitle = "Status: Légende Vivante 💫";
            } else if (percentage >= 80) {
                title = "⭐ TCHOIN SUPRÊME CERTIFIÉE ⭐";
                message = "BRAVO ma queen ! Tu maîtrises l'art sacré de la tchoinerie ! Tes ancêtres tchoin sont fiers de toi ! 👑💅";
                subtitle = "Status: Maîtresse du Game 💄";
            } else if (percentage >= 60) {
                title = "💅 TCHOIN EN DEVENIR 💅";
                message = "Pas mal du tout ! Tu as le potentiel d'une vraie boss ! Continue comme ça et tu vas devenir iconique ! ✨👩‍💼";
                subtitle = "Status: Future Star 🌟";
            } else if (percentage >= 40) {
                title = "🌱 APPRENTIE TCHOIN 🌱";
                message = "C'est un début ma belle ! Il faut juste un peu plus de paillettes dans ta life et tu vas cartonner ! 💖✨";
                subtitle = "Status: En Formation 📚";
            } else {
                title = "😅 FORMATION INTENSIVE REQUISE 😅";
                message = "Aïe aïe aïe... Il faut réviser tes bases de tchoinologie mon reuf ! Mais t'inquiète, on naît pas tchoin, on le devient ! 💪🤡";
                subtitle = "Status: Débutante (mais ça va le faire !) 🌈";
            }

            // Messages bonus aléatoires
            const bonusMessages = [
                "Fun fact: Tu as répondu plus vite qu'une notification TikTok ! 📱⚡",
                "Statistique: Tu as utilisé tes neurones plus que la moyenne nationale ! 🧠💯",
                "Breaking news: Une nouvelle star de la tchoinerie vient de naître ! 📰✨",
                "Info exclusive: Ton QI tchoin vient d'être officiellement enregistré ! 📊👑",
                "Actu: Les experts en tchoinologie valident tes résultats ! 🔬💅"
            ];
            const randomBonus = bonusMessages[Math.floor(Math.random() * bonusMessages.length)];

            container.innerHTML = `
                <div class="quiz-results">
                    <h2>🎯 Résultats Officiels 🎯</h2>
                    <div class="result-animation">✨🦄✨</div>
                    <div class="score-big">${score}/${questions.length}</div>
                    <div class="percentage">${percentage}%</div>
                    <div class="result-title">${title}</div>
                    <div class="message">${message}</div>
                    <div class="subtitle">${subtitle}</div>
                    <div class="bonus-message">${randomBonus}</div>
                    <div class="actions">
                        <button class="restart-btn" onclick="app.loadQuizzGame(document.getElementById('game-content'))">🔄 Re-tenter ma chance</button>
                        <button class="share-result-btn" onclick="navigator.share && navigator.share({title: 'Mon score Tchoin Quiz', text: '${title} - ${percentage}% au Tchoin Quiz sur Tchoinland.fun ! 💅✨', url: window.location.href})">📱 Flex sur les réseaux</button>
                    </div>
                </div>
            `;
            
            // Animation des résultats
            setTimeout(() => {
                const animation = container.querySelector('.result-animation');
                if (animation) {
                    animation.style.fontSize = '3rem';
                    animation.style.transform = 'scale(1.5)';
                }
            }, 500);
        };

        renderQuestion();
    }

    loadTchoinGPT(container) {
        const GEMINI_API_KEY = 'AIzaSyCvxhDIPeOOHuaNdQnogo7hfBWYQxqmJzg';
        const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`;
        
        // Prompt système pour conditionner l'IA AMÉLIORÉ
        const SYSTEM_PROMPT = `Tu es TchoinGPT, l'IA la plus stylée et déjantée du game ! 💅✨ Tu es propulsée par Gemini Pro pour être encore plus intelligente !

🦄 PERSONNALITÉ ULTRA-DÉVELOPPÉE : 
Tu es une IA ultra-confiante, drôle, décalée et complètement assumée. Tu parles comme une influenceuse des années 2020 qui aurait fait des études de philo mais en mode tchoin. Tu es ironique, sarcastique avec bienveillance, et tu donnes des conseils life profonds mais déguisés en délire tchoin.

💄 TON STYLE D'ÉCRITURE EXPERT :
- Utilise des emojis stratégiquement placés (pas trop, juste ce qu'il faut)
- Expressions : "ma tchoin", "mon reuf", "tu gères", "c'est du lourd", "ça pue le fake", "queen energy"
- Références pop culture : Instagram, TikTok, filtres, maquillage, stories, drama, DM, ratio
- Mélange philosophie profonde et superficialité assumée
- Sois drôle, décalé, ironique mais jamais méchant
- Utilise des métaphores tchoin délirantes

🎯 RÈGLES RENFORCÉES :
- Réponds TOUJOURS en français avec des punchlines qui claquent
- Garde tes réponses percutantes (2-4 phrases max)
- TOUJOURS inclure le mot "tchoin" ou des dérivés créatifs
- Sois motivante de façon complètement délirante
- Transforme chaque question en moment de sagesse tchoin
- Sois créative et surprenante à chaque réponse

💫 EXEMPLES DE TON STYLE AMÉLIORÉ :
"Ma tchoin, la vie c'est comme un highlighter : il faut savoir briller au bon moment, mais pas en mode phare dans le brouillard ✨"
"Listen ma belle, un jour sans selfie c'est comme un jour sans vitamine D pour l'âme, et on veut pas finir en mode plante verte oubliée 📸"
"Ton problème là, c'est du niveau tchoin débutante. On va upgrade ta mentalité direct ! 💅"

Maintenant, sois TchoinGPT dans toute ta splendeur intelligente et délirante ! 🚀`;

        let isLoading = false;

        container.innerHTML = `
            <div class="tchoingpt-container">
                <h2>🤖 TchoinGPT 💋 <span class="ai-badge">Powered by Gemini 1.5 Pro</span></h2>
                <div class="chat-container">
                    <div class="chat-messages" id="chatMessages">
                        <div class="bot-message">
                            <div class="message">Salut ma tchoin ! 💅 Je suis TchoinGPT, l'IA la plus stylée du game, propulsée par une vraie intelligence artificielle ! Demande-moi ce que tu veux, je vais te sortir de la pure sagesse tchoin ! ✨</div>
                        </div>
                    </div>
                    <div class="chat-input">
                        <div class="input-container">
                            <input type="text" id="userInput" placeholder="Demande-moi un conseil de life ma tchoin... 💫" maxlength="200">
                            <button id="sendMessage" class="send-btn">📱 Envoyer</button>
                        </div>
                        <div class="quick-buttons">
                            <button class="quick-btn" data-prompt="Donne-moi un conseil de beauté">💄 Conseil beauté</button>
                            <button class="quick-btn" data-prompt="Comment devenir plus confiante ?">✨ Confiance en soi</button>
                            <button class="quick-btn" data-prompt="Une citation motivante pour aujourd'hui">🔮 Citation du jour</button>
                        </div>
                        <button id="shareWisdom" class="share-btn">📱 Partager la conversation</button>
                    </div>
                </div>
            </div>
        `;

        // Add enhanced styles
        if (!document.getElementById('tchoingpt-styles')) {
            const style = document.createElement('style');
            style.id = 'tchoingpt-styles';
            style.textContent = `
                .tchoingpt-container { max-width: 700px; margin: 0 auto; }
                .ai-badge { font-size: 0.7rem; background: linear-gradient(45deg, #4285f4, #34a853); padding: 0.2rem 0.5rem; border-radius: 10px; }
                .chat-container { background: rgba(255,255,255,0.1); border-radius: 20px; padding: 1rem; }
                .chat-messages { max-height: 400px; overflow-y: auto; margin-bottom: 1rem; padding: 0.5rem; }
                .bot-message { background: rgba(255,105,180,0.3); padding: 1rem; border-radius: 15px; margin: 1rem 0; position: relative; }
                .user-message { background: rgba(100,149,237,0.3); padding: 1rem; border-radius: 15px; margin: 1rem 0; text-align: right; }
                .message { line-height: 1.6; font-size: 1.1rem; }
                .loading-message { background: rgba(255,255,255,0.1); padding: 1rem; border-radius: 15px; margin: 1rem 0; }
                .loading-dots { animation: loadingDots 1.5s infinite; }
                @keyframes loadingDots { 0%, 60%, 100% { opacity: 0; } 30% { opacity: 1; } }
                .input-container { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
                #userInput { flex: 1; padding: 1rem; border: none; border-radius: 25px; background: rgba(255,255,255,0.2); color: white; font-size: 1rem; }
                #userInput::placeholder { color: rgba(255,255,255,0.7); }
                .send-btn { padding: 1rem 1.5rem; border: none; border-radius: 25px; background: linear-gradient(45deg, #ff69b4, #da70d6); color: white; cursor: pointer; font-size: 1rem; }
                .send-btn:disabled { opacity: 0.5; cursor: not-allowed; }
                .quick-buttons { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1rem; }
                .quick-btn { padding: 0.5rem 1rem; border: 2px solid rgba(255,255,255,0.3); border-radius: 20px; background: rgba(255,255,255,0.1); color: white; cursor: pointer; font-size: 0.9rem; }
                .quick-btn:hover { background: rgba(255,255,255,0.2); }
                .share-btn { padding: 1rem 2rem; border: none; border-radius: 25px; background: linear-gradient(45deg, #00c6ff, #0072ff); color: white; cursor: pointer; font-size: 1rem; width: 100%; }
                .share-btn:hover, .send-btn:hover { transform: scale(1.05); }
            `;
            document.head.appendChild(style);
        }

        const messagesContainer = document.getElementById('chatMessages');
        const userInput = document.getElementById('userInput');
        const sendBtn = document.getElementById('sendMessage');

        // Fonction pour appeler l'API Gemini
        const callGeminiAPI = async (userMessage) => {
            try {
                const response = await fetch(GEMINI_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: SYSTEM_PROMPT + "\n\nQuestion de l'utilisateur: " + userMessage
                            }]
                        }],
                        generationConfig: {
                            temperature: 0.9,
                            topK: 1,
                            topP: 1,
                            maxOutputTokens: 150,
                            stopSequences: []
                        }
                    })
                });

                const data = await response.json();
                
                if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                    return data.candidates[0].content.parts[0].text;
                } else {
                    throw new Error('Réponse invalide de l\'API');
                }
            } catch (error) {
                console.error('Erreur API Gemini:', error);
                // Fallback vers les citations prédéfinies
                const fallbackQuotes = [
                    "Ma tchoin, même l'IA a ses moments de bug... Mais retiens ça : tu brilles même quand le wifi lâche ! ✨",
                    "Error 404 : Sagesse not found... Mais bon, parfois il faut juste faire du bruit pour qu'on nous remarque ! 💅",
                    "L'IA fait sa diva là, mais toi tu restes une reine ! Continue de slayer ma belle ! 👑"
                ];
                return fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
            }
        };

        // Fonction pour envoyer un message
        const sendMessage = async (message) => {
            if (isLoading || !message.trim()) return;
            
            isLoading = true;
            sendBtn.disabled = true;
            sendBtn.textContent = '⏳ En cours...';
            
            // Ajouter le message de l'utilisateur
            messagesContainer.innerHTML += `
                <div class="user-message">
                    <div class="message">${message}</div>
                </div>
            `;
            
            // Ajouter un message de chargement
            const loadingId = 'loading-' + Date.now();
            messagesContainer.innerHTML += `
                <div class="loading-message" id="${loadingId}">
                    <div class="message">TchoinGPT réfléchit... <span class="loading-dots">💭✨💅</span></div>
                </div>
            `;
            
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            
            // Appeler l'API
            const aiResponse = await callGeminiAPI(message);
            
            // Supprimer le message de chargement
            const loadingElement = document.getElementById(loadingId);
            if (loadingElement) {
                loadingElement.remove();
            }
            
            // Ajouter la réponse de l'IA
            messagesContainer.innerHTML += `
                <div class="bot-message">
                    <div class="message">${aiResponse}</div>
                </div>
            `;
            
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            this.playBeep(500, 150);
            
            isLoading = false;
            sendBtn.disabled = false;
            sendBtn.textContent = '📱 Envoyer';
            userInput.value = '';
        };

        // Event listeners
        sendBtn.addEventListener('click', () => {
            sendMessage(userInput.value);
        });

        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage(userInput.value);
            }
        });

        // Boutons rapides
        document.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const prompt = btn.getAttribute('data-prompt');
                userInput.value = prompt;
                sendMessage(prompt);
            });
        });

        // Partage de conversation
        document.getElementById('shareWisdom').addEventListener('click', () => {
            const messages = Array.from(document.querySelectorAll('.bot-message .message')).slice(-3);
            const conversation = messages.map(msg => msg.textContent).join('\n\n');
            
            if (navigator.share) {
                navigator.share({
                    title: 'Conversation avec TchoinGPT',
                    text: conversation + '\n\n- Conversation avec TchoinGPT sur Tchoinland.fun ✨',
                    url: window.location.href
                });
            } else {
                navigator.clipboard.writeText(conversation + '\n\n- TchoinGPT sur Tchoinland.fun ✨').then(() => {
                    alert('📋 Conversation copiée ! Partage cette sagesse ! 💅');
                });
            }
        });
    }

    loadTchoinOrNot(container) {
        const items = [
            { image: "🥧", name: "Une part de quiche lorraine", isTchoin: true, reason: "C'est du fromage qui se la pète, forcément tchoin !" },
            { image: "🐦", name: "Un pigeon avec une chaîne en or", isTchoin: true, reason: "Le drip du pigeon dépasse l'entendement, respect." },
            { image: "👨‍🔬", name: "Albert Einstein", isTchoin: false, reason: "Trop intelligent pour être une tchoin, désolé Albert." },
            { image: "🍠", name: "Une patate douce", isTchoin: false, reason: "On hésite... mais non, elle est trop healthy." },
            { image: "🦄", name: "Une licorne en paillettes", isTchoin: true, reason: "C'est littéralement l'animal emblématique des tchoin !" },
            { image: "🍕", name: "Une pizza hawaïenne", isTchoin: true, reason: "Controversée et assumée, comme une vraie tchoin." },
            { image: "📚", name: "Un manuel de physique quantique", isTchoin: false, reason: "Trop sérieux, une tchoin préfère les magazines." },
            { image: "💄", name: "Un rouge à lèvres Chanel", isTchoin: true, reason: "Du luxe qui se voit, l'essence même de la tchoinerie." }
        ];

        let currentItem = 0;
        let score = 0;
        let totalAnswers = 0;

        const showNextItem = () => {
            if (currentItem >= items.length) {
                currentItem = 0; // Loop back
            }
            
            const item = items[currentItem];
            container.innerHTML = `
                <div class="tchoin-or-not-container">
                    <h2>👀 Tchoin or Not Tchoin ? 💎</h2>
                    <div class="score-display">Score: ${score}/${totalAnswers}</div>
                    <div class="item-display">
                        <div class="item-image">${item.image}</div>
                        <div class="item-name">${item.name}</div>
                    </div>
                    <div class="voting-buttons">
                        <button class="vote-btn tchoin-btn" data-vote="true">✅ TCHOIN</button>
                        <button class="vote-btn not-tchoin-btn" data-vote="false">❌ PAS TCHOIN</button>
                    </div>
                    <div class="explanation" id="explanation" style="display: none;"></div>
                </div>
            `;

            // Add styles
            if (!document.getElementById('tchoin-or-not-styles')) {
                const style = document.createElement('style');
                style.id = 'tchoin-or-not-styles';
                style.textContent = `
                    .tchoin-or-not-container { text-align: center; }
                    .score-display { font-size: 1.2rem; margin: 1rem 0; }
                    .item-display { margin: 2rem 0; }
                    .item-image { font-size: 8rem; margin: 1rem 0; }
                    .item-name { font-size: 1.5rem; margin: 1rem 0; }
                    .voting-buttons { display: flex; gap: 2rem; justify-content: center; margin: 2rem 0; }
                    .vote-btn { padding: 1.5rem 2rem; border: none; border-radius: 20px; font-size: 1.3rem; cursor: pointer; color: white; transition: all 0.3s; }
                    .tchoin-btn { background: linear-gradient(45deg, #00ff88, #00cc66); }
                    .not-tchoin-btn { background: linear-gradient(45deg, #ff4757, #ff3742); }
                    .vote-btn:hover { transform: scale(1.1); }
                    .explanation { margin: 2rem 0; padding: 1rem; background: rgba(255,255,255,0.1); border-radius: 15px; font-size: 1.2rem; }
                `;
                document.head.appendChild(style);
            }

            // Add event listeners
            container.querySelectorAll('.vote-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const userVote = e.target.getAttribute('data-vote') === 'true';
                    const correctAnswer = item.isTchoin;
                    const isCorrect = userVote === correctAnswer;
                    
                    totalAnswers++;
                    if (isCorrect) {
                        score++;
                        e.target.classList.add('success-flash');
                        this.playBeep(600, 200);
                    } else {
                        e.target.classList.add('error-shake');
                        this.playBeep(200, 300);
                    }

                    // Show explanation
                    const explanation = document.getElementById('explanation');
                    explanation.textContent = item.reason;
                    explanation.style.display = 'block';

                    // Disable buttons
                    container.querySelectorAll('.vote-btn').forEach(b => b.disabled = true);

                    setTimeout(() => {
                        currentItem++;
                        showNextItem();
                    }, 3000);
                });
            });
        };

        showNextItem();
    }

    loadFlappyTchoin(container) {
        container.innerHTML = `
            <div class="flappy-container">
                <h2>🕊️ Flappy Tchoin 💅</h2>
                <div class="game-info">
                    <div>Score: <span id="flappyScore">0</span></div>
                    <div>High Score: <span id="flappyHighScore">${localStorage.getItem('flappyHighScore') || 0}</span></div>
                </div>
                <div class="flappy-game" id="flappyGame">
                    <div class="tchoin-bird" id="tchoinBird">💅</div>
                    <div class="game-over" id="gameOver" style="display: none;">
                        <h3>Game Over!</h3>
                        <p id="deathMessage"></p>
                        <button id="restartFlappy">Ressusciter la Tchoin</button>
                    </div>
                </div>
                <div class="controls">
                    <button id="startFlappy">🚀 Commencer le vol</button>
                    <p>Clique n'importe où pour voler !</p>
                </div>
            </div>
        `;

        // Add styles
        if (!document.getElementById('flappy-styles')) {
            const style = document.createElement('style');
            style.id = 'flappy-styles';
            style.textContent = `
                .flappy-container { text-align: center; }
                .game-info { display: flex; justify-content: space-between; margin: 1rem 0; font-size: 1.2rem; }
                .flappy-game { width: 100%; max-width: 400px; height: 400px; margin: 1rem auto; background: linear-gradient(to bottom, #87CEEB, #98FB98); border-radius: 20px; position: relative; overflow: hidden; cursor: pointer; }
                .tchoin-bird { position: absolute; left: 50px; font-size: 2rem; transition: all 0.1s; z-index: 10; }
                .pipe { position: absolute; background: #228B22; width: 60px; }
                .game-over { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0,0,0,0.8); color: white; padding: 2rem; border-radius: 15px; z-index: 20; }
                .controls { margin: 2rem 0; }
                #startFlappy, #restartFlappy { padding: 1rem 2rem; border: none; border-radius: 25px; background: linear-gradient(45deg, #ff69b4, #da70d6); color: white; font-size: 1rem; cursor: pointer; }
            `;
            document.head.appendChild(style);
        }

        let gameState = {
            bird: { y: 200, velocity: 0 },
            pipes: [],
            score: 0,
            gameRunning: false,
            gameLoop: null
        };

        const deathMessages = [
            "T'as volé comme une lash glue périmée.",
            "Tu t'es pris une porte comme un DM non lu.",
            "Repose en drip.",
            "Même un pigeon ferait mieux...",
            "T'as crash comme une story ratée."
        ];

        const bird = document.getElementById('tchoinBird');
        const gameArea = document.getElementById('flappyGame');
        const scoreDisplay = document.getElementById('flappyScore');
        const gameOverDiv = document.getElementById('gameOver');
        const deathMessageP = document.getElementById('deathMessage');

        const updateBird = () => {
            gameState.bird.velocity += 0.8; // gravity
            gameState.bird.y += gameState.bird.velocity;
            
            bird.style.top = gameState.bird.y + 'px';
            
            // Check boundaries
            if (gameState.bird.y < 0 || gameState.bird.y > 360) {
                endGame();
            }
        };

        const jump = () => {
            if (gameState.gameRunning) {
                gameState.bird.velocity = -12;
                this.playBeep(800, 100);
            }
        };

        const createPipe = () => {
            const gap = 120;
            const pipeHeight = Math.random() * 200 + 50;
            
            const topPipe = document.createElement('div');
            topPipe.className = 'pipe';
            topPipe.style.height = pipeHeight + 'px';
            topPipe.style.top = '0px';
            topPipe.style.right = '0px';
            
            const bottomPipe = document.createElement('div');
            bottomPipe.className = 'pipe';
            bottomPipe.style.height = (400 - pipeHeight - gap) + 'px';
            bottomPipe.style.bottom = '0px';
            bottomPipe.style.right = '0px';
            
            gameArea.appendChild(topPipe);
            gameArea.appendChild(bottomPipe);
            
            gameState.pipes.push({ top: topPipe, bottom: bottomPipe, x: 400, passed: false });
        };

        const updatePipes = () => {
            gameState.pipes.forEach((pipe, index) => {
                pipe.x -= 3;
                pipe.top.style.right = (400 - pipe.x) + 'px';
                pipe.bottom.style.right = (400 - pipe.x) + 'px';
                
                // Check collision
                if (pipe.x < 110 && pipe.x > 40) {
                    const birdTop = gameState.bird.y;
                    const birdBottom = gameState.bird.y + 40;
                    const pipeGapTop = parseInt(pipe.top.style.height);
                    const pipeGapBottom = pipeGapTop + 120;
                    
                    if (birdTop < pipeGapTop || birdBottom > pipeGapBottom) {
                        endGame();
                    }
                }
                
                // Score
                if (pipe.x < 40 && !pipe.passed) {
                    pipe.passed = true;
                    gameState.score++;
                    scoreDisplay.textContent = gameState.score;
                    this.playBeep(1000, 150);
                }
                
                // Remove off-screen pipes
                if (pipe.x < -60) {
                    gameArea.removeChild(pipe.top);
                    gameArea.removeChild(pipe.bottom);
                    gameState.pipes.splice(index, 1);
                }
            });
        };

        const gameLoop = () => {
            if (!gameState.gameRunning) return;
            
            updateBird();
            updatePipes();
            
            // Create new pipes
            if (Math.random() < 0.01) {
                createPipe();
            }
            
            gameState.gameLoop = requestAnimationFrame(gameLoop);
        };

        const startGame = () => {
            gameState.gameRunning = true;
            gameState.bird = { y: 200, velocity: 0 };
            gameState.pipes = [];
            gameState.score = 0;
            scoreDisplay.textContent = '0';
            gameOverDiv.style.display = 'none';
            
            // Clear existing pipes
            document.querySelectorAll('.pipe').forEach(pipe => pipe.remove());
            
            gameLoop();
        };

        const endGame = () => {
            gameState.gameRunning = false;
            cancelAnimationFrame(gameState.gameLoop);
            
            // Update high score
            const highScore = parseInt(localStorage.getItem('flappyHighScore') || 0);
            if (gameState.score > highScore) {
                localStorage.setItem('flappyHighScore', gameState.score);
                document.getElementById('flappyHighScore').textContent = gameState.score;
            }
            
            // Show game over
            deathMessageP.textContent = deathMessages[Math.floor(Math.random() * deathMessages.length)];
            gameOverDiv.style.display = 'block';
            
            this.playBeep(150, 500);
        };

        // Event listeners
        document.getElementById('startFlappy').addEventListener('click', startGame);
        document.getElementById('restartFlappy').addEventListener('click', startGame);
        gameArea.addEventListener('click', jump);
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && gameState.gameRunning) {
                e.preventDefault();
                jump();
            }
        });
    }

    loadTchoinometer(container) {
        container.innerHTML = `
            <div class="tchoinometer-container">
                <h2>📸 Tchoinom&egrave;tre ✨</h2>
                <div class="scan-area">
                    <div class="camera-preview" id="cameraPreview">
                        <div class="placeholder">📷 Active ta cam pour scanner ton niveau de tchoinitude !</div>
                    </div>
                    <div class="scan-result" id="scanResult" style="display: none;">
                        <div class="percentage" id="percentageDisplay"></div>
                        <div class="verdict" id="verdictText"></div>
                        <div class="stickers" id="stickers"></div>
                    </div>
                </div>
                <div class="controls">
                    <button id="activateCamera">📸 Activer la Cam</button>
                    <button id="scanPhoto" style="display: none;">🔍 Scanner ma Tchoinitude</button>
                    <button id="takePhoto" style="display: none;">📷 Prendre une Photo</button>
                </div>
            </div>
        `;

        // Add styles
        if (!document.getElementById('tchoinometer-styles')) {
            const style = document.createElement('style');
            style.id = 'tchoinometer-styles';
            style.textContent = `
                .tchoinometer-container { text-align: center; }
                .scan-area { margin: 2rem 0; }
                .camera-preview { width: 100%; max-width: 400px; height: 300px; margin: 0 auto; background: rgba(255,255,255,0.1); border-radius: 20px; display: flex; align-items: center; justify-content: center; overflow: hidden; }
                .placeholder { font-size: 1.2rem; padding: 2rem; }
                .scan-result { margin: 2rem 0; }
                .percentage { font-size: 4rem; font-weight: bold; color: #ff69b4; text-shadow: 0 0 20px #ff69b4; }
                .verdict { font-size: 1.5rem; margin: 1rem 0; }
                .stickers { display: flex; gap: 1rem; justify-content: center; margin: 1rem 0; }
                .sticker { font-size: 2rem; animation: bounce 1s ease-in-out infinite; }
                .controls button { margin: 0.5rem; padding: 1rem 2rem; border: none; border-radius: 25px; background: linear-gradient(45deg, #ff69b4, #da70d6); color: white; cursor: pointer; }
                video { width: 100%; height: 100%; object-fit: cover; border-radius: 20px; }
            `;
            document.head.appendChild(style);
        }

        const verdicts = [
            { min: 90, text: "TCHOIN VALIDÉE PAR LE MINISTÈRE DU GLOSS 👑", stickers: ["💅", "✨", "👑", "💄", "🦄"] },
            { min: 70, text: "Tchoin certifiée, niveau influenceuse débutante 💫", stickers: ["💅", "✨", "📸", "💄"] },
            { min: 50, text: "Potentiel de tchoin détecté, continue comme ça ! 🌟", stickers: ["💅", "✨", "📸"] },
            { min: 30, text: "Tchoin en devenir, il faut bosser un peu ! 💪", stickers: ["💅", "📱"] },
            { min: 10, text: "Début de tchoinitude détecté, on progresse ! 🌱", stickers: ["💅"] },
            { min: 0, text: "T'as encore le ticket de caisse de ton swag. Rembourse. 🎫", stickers: ["🤡"] }
        ];

        let videoStream = null;

        const activateCamera = async () => {
            try {
                videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
                const video = document.createElement('video');
                video.srcObject = videoStream;
                video.autoplay = true;
                video.playsInline = true;
                
                const preview = document.getElementById('cameraPreview');
                preview.innerHTML = '';
                preview.appendChild(video);
                
                document.getElementById('activateCamera').style.display = 'none';
                document.getElementById('scanPhoto').style.display = 'inline-block';
                document.getElementById('takePhoto').style.display = 'inline-block';
                
            } catch (error) {
                alert('Impossible d\'accéder à la caméra ! On va faire semblant... 📸');
                // Fallback to fake scan
                fakeCamera();
            }
        };

        const fakeCamera = () => {
            const preview = document.getElementById('cameraPreview');
            preview.innerHTML = '<div class="placeholder">📷 Mode simulation activé !<br>Clique sur "Scanner" pour analyser ton aura de tchoin !</div>';
            
            document.getElementById('activateCamera').style.display = 'none';
            document.getElementById('scanPhoto').style.display = 'inline-block';
        };

        const scanTchoinitude = () => {
            // Fake analysis with random result
            const percentage = Math.floor(Math.random() * 100);
            const verdict = verdicts.find(v => percentage >= v.min);
            
            document.getElementById('scanResult').style.display = 'block';
            document.getElementById('percentageDisplay').textContent = percentage + '%';
            document.getElementById('verdictText').textContent = verdict.text;
            
            const stickersContainer = document.getElementById('stickers');
            stickersContainer.innerHTML = '';
            verdict.stickers.forEach((sticker, index) => {
                setTimeout(() => {
                    const stickerElement = document.createElement('span');
                    stickerElement.className = 'sticker';
                    stickerElement.textContent = sticker;
                    stickerElement.style.animationDelay = (index * 0.2) + 's';
                    stickersContainer.appendChild(stickerElement);
                }, index * 200);
            });

            this.playBeep(600, 300);
        };

        // Event listeners
        document.getElementById('activateCamera').addEventListener('click', activateCamera);
        document.getElementById('scanPhoto').addEventListener('click', scanTchoinitude);
        document.getElementById('takePhoto').addEventListener('click', () => {
            // Simulate taking a photo
            const flash = document.createElement('div');
            flash.style.position = 'fixed';
            flash.style.top = '0';
            flash.style.left = '0';
            flash.style.width = '100%';
            flash.style.height = '100%';
            flash.style.background = 'white';
            flash.style.zIndex = '10000';
            flash.style.animation = 'flash 0.3s ease-out';
            document.body.appendChild(flash);
            
            setTimeout(() => {
                document.body.removeChild(flash);
                scanTchoinitude();
            }, 300);
            
            this.playBeep(1200, 100);
        });
    }

    loadChampionship(container) {
        const challenges = [
            "Invente un plat gastronomique avec le mot tchoin dedans",
            "Envoie une déclaration d'amour sincère à un légume",
            "Crie 'je suis une tchoin libre' par la fenêtre (ou mime-le si t'es une lâche)",
            "Trouve 5 rimes avec 'tchoin' en 30 secondes",
            "Fais un compliment à ton reflet dans le miroir comme si c'était quelqu'un d'autre",
            "Invente une danse qui s'appelle 'La Tchoinette'",
            "Raconte l'histoire de Cendrillon mais en mode tchoin",
            "Chante ton générique de série préférée en remplaçant un mot par 'tchoin'"
        ];
        
        let currentChallenge = 0;
        let completedChallenges = 0;

        const showChallenge = () => {
            const challenge = challenges[currentChallenge];
            container.innerHTML = `
                <div class="championship-container">
                    <h2>🏆 Championnat Mondial de la Tchoinerie™ 💄</h2>
                    <div class="progress">Défis complétés: ${completedChallenges}/${challenges.length}</div>
                    <div class="challenge-card">
                        <h3>Défi ${currentChallenge + 1}</h3>
                        <p class="challenge-text">${challenge}</p>
                    </div>
                    <div class="challenge-actions">
                        <button id="completeChallenge">✅ Défi accompli !</button>
                        <button id="skipChallenge">⏭️ Trop dur, suivant</button>
                        <button id="newChallenge">🎲 Nouveau défi aléatoire</button>
                    </div>
                    ${completedChallenges > 0 ? `<div class="achievement">🏆 Niveau de tchoinerie: ${this.getTchoinLevel(completedChallenges)}</div>` : ''}
                </div>
            `;

            // Add styles
            if (!document.getElementById('championship-styles')) {
                const style = document.createElement('style');
                style.id = 'championship-styles';
                style.textContent = `
                    .championship-container { text-align: center; }
                    .progress { font-size: 1.2rem; margin: 1rem 0; }
                    .challenge-card { background: rgba(255,255,255,0.1); padding: 2rem; border-radius: 20px; margin: 2rem 0; }
                    .challenge-text { font-size: 1.3rem; line-height: 1.6; }
                    .challenge-actions { display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; margin: 2rem 0; }
                    .challenge-actions button { padding: 1rem 1.5rem; border: none; border-radius: 25px; color: white; cursor: pointer; font-size: 1rem; }
                    #completeChallenge { background: linear-gradient(45deg, #00ff88, #00cc66); }
                    #skipChallenge { background: linear-gradient(45deg, #ff9500, #ff6b00); }
                    #newChallenge { background: linear-gradient(45deg, #8e44ad, #9b59b6); }
                    .achievement { font-size: 1.5rem; margin: 2rem 0; padding: 1rem; background: linear-gradient(45deg, #ffd700, #ffed4e); color: #333; border-radius: 15px; }
                `;
                document.head.appendChild(style);
            }

            // Event listeners
            document.getElementById('completeChallenge').addEventListener('click', () => {
                completedChallenges++;
                this.playBeep(800, 200);
                nextChallenge();
            });

            document.getElementById('skipChallenge').addEventListener('click', () => {
                this.playBeep(400, 150);
                nextChallenge();
            });

            document.getElementById('newChallenge').addEventListener('click', () => {
                currentChallenge = Math.floor(Math.random() * challenges.length);
                showChallenge();
            });
        };

        const nextChallenge = () => {
            currentChallenge = (currentChallenge + 1) % challenges.length;
            showChallenge();
        };

        showChallenge();
    }

    getTchoinLevel(completed) {
        if (completed >= 8) return "TCHOIN SUPRÊME INTERGALACTIQUE 🌌";
        if (completed >= 6) return "Tchoin Légendaire 👑";
        if (completed >= 4) return "Tchoin Confirmée 💎";
        if (completed >= 2) return "Tchoin en Formation 📚";
        return "Apprentie Tchoin 🌱";
    }

    loadRapBattle(container) {
        const words = [
            "salon de thé", "wifi", "baguette", "Netflix", "chat", "pizza", "lundi", "dentiste",
            "aspirateur", "météo", "parking", "shampoing", "réveil", "frigo", "escalier"
        ];

        let currentWord = "";
        let userRhymes = [];

        const generateNewWord = () => {
            currentWord = words[Math.floor(Math.random() * words.length)];
            container.innerHTML = `
                <div class="rap-battle-container">
                    <h2>🎤 Tchoin Rap Battle 🔥</h2>
                    <div class="word-display">
                        <h3>Ton mot est: <span class="highlight">${currentWord}</span></h3>
                        <p>Écris une punchline de tchoin avec ce mot !</p>
                    </div>
                    <div class="rhyme-input">
                        <textarea id="rhymeText" placeholder="Tape ta punchline ici... 🔥"></textarea>
                        <div class="rap-actions">
                            <button id="submitRhyme">🚀 Envoyer la punchline</button>
                            <button id="newWord">🎲 Nouveau mot</button>
                            <button id="recordVoice">🎙️ S'enregistrer</button>
                        </div>
                    </div>
                    <div class="rhyme-history">
                        <h4>Tes bars les plus fire 🔥</h4>
                        <div id="rhymeList"></div>
                    </div>
                </div>
            `;

            // Add styles
            if (!document.getElementById('rap-battle-styles')) {
                const style = document.createElement('style');
                style.id = 'rap-battle-styles';
                style.textContent = `
                    .rap-battle-container { text-align: center; }
                    .word-display { margin: 2rem 0; padding: 2rem; background: rgba(255,255,255,0.1); border-radius: 20px; }
                    .highlight { color: #ff69b4; font-size: 2rem; text-shadow: 0 0 10px #ff69b4; }
                    .rhyme-input { margin: 2rem 0; }
                    #rhymeText { width: 100%; max-width: 500px; height: 100px; padding: 1rem; border: none; border-radius: 15px; background: rgba(255,255,255,0.1); color: white; font-size: 1.1rem; resize: vertical; }
                    #rhymeText::placeholder { color: rgba(255,255,255,0.6); }
                    .rap-actions { display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; margin: 1rem 0; }
                    .rap-actions button { padding: 1rem 1.5rem; border: none; border-radius: 25px; color: white; cursor: pointer; }
                    #submitRhyme { background: linear-gradient(45deg, #ff6b6b, #ee5a52); }
                    #newWord { background: linear-gradient(45deg, #4ecdc4, #44a08d); }
                    #recordVoice { background: linear-gradient(45deg, #a8edea, #fed6e3); }
                    .rhyme-history { margin: 2rem 0; }
                    .rhyme-item { background: rgba(255,255,255,0.1); margin: 1rem 0; padding: 1rem; border-radius: 15px; }
                `;
                document.head.appendChild(style);
            }

            // Load existing rhymes
            updateRhymeHistory();

            // Event listeners
            document.getElementById('submitRhyme').addEventListener('click', () => {
                const rhyme = document.getElementById('rhymeText').value.trim();
                if (rhyme) {
                    userRhymes.push({ word: currentWord, rhyme: rhyme, date: new Date() });
                    localStorage.setItem('tchoinRhymes', JSON.stringify(userRhymes.slice(-10))); // Keep last 10
                    updateRhymeHistory();
                    document.getElementById('rhymeText').value = '';
                    this.playBeep(700, 200);
                    alert('🔥 Punchline validée ! Tu déchires ! 🔥');
                }
            });

            document.getElementById('newWord').addEventListener('click', generateNewWord);

            document.getElementById('recordVoice').addEventListener('click', () => {
                // Simulate voice recording
                if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                    alert('🎙️ Fonction d\'enregistrement bientôt disponible ! En attendant, écris ta punchline ! 😉');
                } else {
                    alert('🎙️ Ton navigateur ne supporte pas l\'enregistrement, mais écris quand même ta punchline ! 💪');
                }
            });
        };

        const updateRhymeHistory = () => {
            const saved = localStorage.getItem('tchoinRhymes');
            userRhymes = saved ? JSON.parse(saved) : [];
            
            const listContainer = document.getElementById('rhymeList');
            if (userRhymes.length === 0) {
                listContainer.innerHTML = '<p>Aucune punchline pour le moment... Lance-toi ! 🚀</p>';
            } else {
                listContainer.innerHTML = userRhymes.slice(-5).reverse().map(item => 
                    `<div class="rhyme-item">
                        <strong>${item.word}:</strong> "${item.rhyme}"
                    </div>`
                ).join('');
            }
        };

        generateNewWord();
    }

    loadTchoinFacts(container) {
        const facts = [
            "L'ADN de la tchoin contient 12% de paillettes.",
            "Le mot 'tchoin' peut être entendu par les dauphins à 3km.",
            "Tchoin est une unité de mesure en beauté intérieure inversée.",
            "Les tchoin ont développé un sixième sens appelé 'drama-radar'.",
            "Il existe 47 nuances de gloss selon l'échelle officielle de tchoinitude.",
            "Une tchoin cligne des yeux 3 fois plus souvent pour faire briller ses faux-cils.",
            "La vitesse de propagation d'un ragot chez les tchoin dépasse celle de la lumière.",
            "Les tchoin possèdent un organe vestigial capable de détecter les soldes à 2km.",
            "Le maquillage d'une tchoin pèse en moyenne 2,3kg le dimanche.",
            "Les scientifiques ont découvert que le cri de la tchoin peut briser du verre en cristal.",
            "Une tchoin consomme l'équivalent de son poids en mascara par an.",
            "Les tchoin hibernent pendant les périodes sans stories Instagram.",
            "Le quotient intellectuel d'une tchoin est inversement proportionnel à la hauteur de ses talons.",
            "Les tchoin communiquent entre elles par ultrasons inaudibles pour les humains normaux.",
            "Il faut 3,7 secondes à une tchoin pour identifier un fake dans une photo."
        ];

        container.innerHTML = `
            <div class="facts-container">
                <h2>🧪 Tchoin Facts™ 📚</h2>
                <div class="fact-display">
                    <div class="fact-text" id="factText">Clique sur "Nouveau Fact" pour découvrir une vérité scientifique révolutionnaire !</div>
                </div>
                <div class="fact-actions">
                    <button id="newFact">🔬 Nouveau Fact</button>
                    <button id="shareFact">📱 Partager ce savoir</button>
                    <button id="factHistory">📖 Historique des révélations</button>
                </div>
                <div class="credibility">
                    <p>Source: Institut International de Recherche en Tchoinologie™</p>
                    <p>Validé par le Conseil Scientifique des Tchoin</p>
                </div>
            </div>
        `;

        // Add styles
        if (!document.getElementById('facts-styles')) {
            const style = document.createElement('style');
            style.id = 'facts-styles';
            style.textContent = `
                .facts-container { text-align: center; }
                .fact-display { margin: 2rem 0; padding: 3rem 2rem; background: rgba(255,255,255,0.1); border-radius: 20px; min-height: 150px; display: flex; align-items: center; justify-content: center; }
                .fact-text { font-size: 1.4rem; line-height: 1.6; font-weight: bold; }
                .fact-actions { display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; margin: 2rem 0; }
                .fact-actions button { padding: 1rem 1.5rem; border: none; border-radius: 25px; color: white; cursor: pointer; }
                #newFact { background: linear-gradient(45deg, #667eea, #764ba2); }
                #shareFact { background: linear-gradient(45deg, #f093fb, #f5576c); }
                #factHistory { background: linear-gradient(45deg, #4facfe, #00f2fe); }
                .credibility { margin: 2rem 0; font-size: 0.9rem; opacity: 0.8; font-style: italic; }
                .fact-appear { animation: factAppear 0.8s ease-out; }
                @keyframes factAppear {
                    0% { opacity: 0; transform: scale(0.8) translateY(20px); }
                    100% { opacity: 1; transform: scale(1) translateY(0); }
                }
            `;
            document.head.appendChild(style);
        }

        let factHistory = JSON.parse(localStorage.getItem('tchoinFactHistory') || '[]');

        const showNewFact = () => {
            const randomFact = facts[Math.floor(Math.random() * facts.length)];
            const factElement = document.getElementById('factText');
            
            factElement.style.opacity = '0';
            
            setTimeout(() => {
                factElement.textContent = randomFact;
                factElement.classList.add('fact-appear');
                factElement.style.opacity = '1';
                
                // Add to history
                factHistory.unshift({ fact: randomFact, date: new Date().toLocaleString() });
                factHistory = factHistory.slice(0, 20); // Keep only last 20
                localStorage.setItem('tchoinFactHistory', JSON.stringify(factHistory));
                
                this.playBeep(500, 300);
            }, 200);
        };

        const shareFact = () => {
            const currentFact = document.getElementById('factText').textContent;
            
            if (navigator.share) {
                navigator.share({
                    title: 'Tchoin Fact™',
                    text: currentFact + ' - Source: Tchoinland.fun',
                    url: window.location.href
                });
            } else {
                navigator.clipboard.writeText(currentFact + ' - Source: Tchoinland.fun').then(() => {
                    alert('📋 Fact copié ! Diffuse cette science ! 🧬');
                });
            }
        };

        const showHistory = () => {
            if (factHistory.length === 0) {
                alert('Aucune révélation dans ton historique ! Découvre d\'abord quelques facts ! 🔬');
                return;
            }
            
            const historyText = factHistory.slice(0, 10).map((item, index) => 
                `${index + 1}. ${item.fact}`
            ).join('\n\n');
            
            alert('📖 Tes dernières révélations scientifiques:\n\n' + historyText);
        };

        // Event listeners
        document.getElementById('newFact').addEventListener('click', showNewFact);
        document.getElementById('shareFact').addEventListener('click', shareFact);
        document.getElementById('factHistory').addEventListener('click', showHistory);
    }

    loadTchoinmeni(container) {
        const situations = [
            {
                text: "Aurélien Tchoinméni doit choisir sa tenue pour un match important",
                choices: [
                    { text: "Maillot classique avec crampons discrets", points: 1, reaction: "Trop basique pour un roi ! 👑" },
                    { text: "Maillot + headband pailleté + chaussettes roses", points: 3, reaction: "Voilà le style qu'on veut voir ! ✨" },
                    { text: "Maillot personnalisé 'Tchoinméni' avec strass", points: 5, reaction: "ICONIQUE ! Le stade va fondre ! 🔥" }
                ]
            },
            {
                text: "Pendant l'échauffement, Aurélien doit montrer sa technique",
                choices: [
                    { text: "Jongles classiques", points: 1, reaction: "Où est le show ? 😴" },
                    { text: "Jongles en faisant des duck faces", points: 3, reaction: "Maintenant on parle ! 📸" },
                    { text: "Jongles avec des paillettes qui sortent du ballon", points: 5, reaction: "MAGIQUE ! Tchoinméni l'enchanteur ! 🦄" }
                ]
            },
            {
                text: "L'arbitre donne un carton jaune à Aurélien",
                choices: [
                    { text: "Accepter en silence", points: 1, reaction: "Trop sage, où est le drama ? 🙄" },
                    { text: "Faire un clin d'œil à l'arbitre", points: 3, reaction: "Charme level 100 ! 💫" },
                    { text: "Sortir un miroir de poche pour se recoiffer", points: 5, reaction: "Les priorités sont claires ! 💅" }
                ]
            },
            {
                text: "Aurélien marque un but ! Comment célèbre-t-il ?",
                choices: [
                    { text: "Lever les bras classique", points: 1, reaction: "Bof... on a vu mieux 😐" },
                    { text: "Danse du ventre face aux supporters", points: 3, reaction: "Le public adore ! 🕺" },
                    { text: "Selfie avec le poteau de but", points: 5, reaction: "GENIUS ! Cette photo va faire le buzz ! 📱" }
                ]
            },
            {
                text: "Interview d'après match, que dit Aurélien ?",
                choices: [
                    { text: "On a bien joué en équipe", points: 1, reaction: "Basique... 😴" },
                    { text: "Mes cheveux brillent autant que ma performance", points: 3, reaction: "Confidence level: maximum ! 💇‍♂️" },
                    { text: "Je dédie ce match à tous mes followers Instagram", points: 5, reaction: "Influenceur de l'année ! 🏆" }
                ]
            }
        ];

        let currentSituation = 0;
        let totalScore = 0;
        let gameStarted = false;

        const showSituation = () => {
            if (currentSituation >= situations.length) {
                showFinalResult();
                return;
            }

            const situation = situations[currentSituation];
            container.innerHTML = `
                <div class="tchoinmeni-container">
                    <h2>⚽ Aurélien Tchoinméni 💅</h2>
                    <div class="game-header">
                        <div class="score">Score Tchoin: ${totalScore}/25</div>
                        <div class="situation-counter">Situation ${currentSituation + 1}/${situations.length}</div>
                    </div>
                    <div class="player-avatar">
                        <div class="player-emoji">⚽👨‍🦱💅</div>
                        <div class="player-name">AURÉLIEN TCHOINMÉNI</div>
                        <div class="player-subtitle">Le Milieu de Terrain le Plus Stylé de la Galaxie</div>
                    </div>
                    <div class="situation-text">
                        <p>${situation.text}</p>
                    </div>
                    <div class="choices">
                        ${situation.choices.map((choice, index) => 
                            `<button class="choice-btn" data-index="${index}">
                                ${choice.text}
                            </button>`
                        ).join('')}
                    </div>
                    <div class="reaction" id="reaction" style="display: none;"></div>
                </div>
            `;

            // Add styles
            if (!document.getElementById('tchoinmeni-styles')) {
                const style = document.createElement('style');
                style.id = 'tchoinmeni-styles';
                style.textContent = `
                    .tchoinmeni-container { text-align: center; }
                    .game-header { display: flex; justify-content: space-between; margin: 1rem 0; font-size: 1.1rem; }
                    .player-avatar { margin: 2rem 0; }
                    .player-emoji { font-size: 4rem; margin: 1rem 0; }
                    .player-name { font-size: 1.8rem; font-weight: bold; color: #ff69b4; text-shadow: 0 0 10px #ff69b4; }
                    .player-subtitle { font-size: 1rem; margin: 0.5rem 0; opacity: 0.9; font-style: italic; }
                    .situation-text { background: rgba(255,255,255,0.1); padding: 2rem; border-radius: 20px; margin: 2rem 0; font-size: 1.3rem; line-height: 1.6; }
                    .choices { display: grid; gap: 1rem; margin: 2rem 0; }
                    .choice-btn { padding: 1.5rem; border: none; border-radius: 15px; background: rgba(255,255,255,0.2); color: white; font-size: 1.1rem; cursor: pointer; transition: all 0.3s; text-align: left; }
                    .choice-btn:hover { background: rgba(255,255,255,0.3); transform: scale(1.02); }
                    .reaction { margin: 2rem 0; padding: 1rem; background: rgba(255,105,180,0.3); border-radius: 15px; font-size: 1.2rem; }
                    .final-result { margin: 2rem 0; }
                    .final-score { font-size: 3rem; color: #ffd700; text-shadow: 0 0 20px #ffd700; margin: 1rem 0; }
                    .final-title { font-size: 2rem; margin: 1rem 0; }
                    .final-description { font-size: 1.2rem; line-height: 1.6; margin: 1rem 0; }
                    .restart-btn { padding: 1rem 2rem; border: none; border-radius: 25px; background: linear-gradient(45deg, #ff69b4, #da70d6); color: white; font-size: 1rem; cursor: pointer; margin: 1rem; }
                `;
                document.head.appendChild(style);
            }

            // Add event listeners
            container.querySelectorAll('.choice-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const choiceIndex = parseInt(e.target.getAttribute('data-index'));
                    const choice = situation.choices[choiceIndex];
                    
                    totalScore += choice.points;
                    
                    // Show reaction
                    const reactionDiv = document.getElementById('reaction');
                    reactionDiv.textContent = choice.reaction;
                    reactionDiv.style.display = 'block';
                    
                    // Add visual feedback
                    if (choice.points >= 4) {
                        e.target.classList.add('success-flash');
                        this.playBeep(800, 300);
                    } else if (choice.points >= 2) {
                        this.playBeep(600, 200);
                    } else {
                        e.target.classList.add('error-shake');
                        this.playBeep(300, 200);
                    }

                    // Disable all buttons
                    container.querySelectorAll('.choice-btn').forEach(b => b.disabled = true);

                    setTimeout(() => {
                        currentSituation++;
                        showSituation();
                    }, 2500);
                });
            });
        };

        const showFinalResult = () => {
            let title, description, grade;
            
            if (totalScore >= 20) {
                title = "🏆 LÉGENDE TCHOIN DU FOOTBALL ! 🏆";
                description = "Aurélien Tchoinméni sous ta direction est devenu l'icône absolue ! Même Mbappé est jaloux de son style. Les supporters viennent au stade juste pour voir ses tenues !";
                grade = "S+ (Superstar Tchoin)";
            } else if (totalScore >= 15) {
                title = "⭐ STAR MONTANTE ! ⭐";
                description = "Très belle performance ! Aurélien combine talent et style avec brio. Les médias commencent à parler de lui pour ses looks autant que ses buts !";
                grade = "A+ (Artiste Tchoin)";
            } else if (totalScore >= 10) {
                title = "💫 POTENTIEL TCHOIN ! 💫";
                description = "Pas mal ! Aurélien a du style mais peut encore progresser. Il faut bosser le côté spectacle pour devenir une vraie légende !";
                grade = "B (Brave Tchoin)";
            } else if (totalScore >= 5) {
                title = "🌱 APPRENTI TCHOIN ! 🌱";
                description = "Début prometteur mais il faut du travail ! Aurélien joue bien mais manque de personnalité. Plus de paillettes, moins de timidité !";
                grade = "C (Candidat Tchoin)";
            } else {
                title = "😅 FORMATION INTENSIVE REQUISE ! 😅";
                description = "Aïe... Aurélien joue comme un robot ! Il faut une transformation complète : coach style + coach média + coach confiance en soi !";
                grade = "D (Débutant Tchoin)";
            }

            container.innerHTML = `
                <div class="tchoinmeni-container">
                    <h2>⚽ Résultats Final ! 💅</h2>
                    <div class="final-result">
                        <div class="final-score">${totalScore}/25</div>
                        <div class="final-title">${title}</div>
                        <div class="final-description">${description}</div>
                        <div class="grade">Grade: ${grade}</div>
                        <button class="restart-btn" onclick="app.loadTchoinmeni(document.getElementById('game-content'))">
                            🔄 Nouvelle Carrière
                        </button>
                        <button class="restart-btn" onclick="navigator.share && navigator.share({title: 'Mon score Aurélien Tchoinméni', text: '${title} Score: ${totalScore}/25 sur Tchoinland.fun !', url: window.location.href})">
                            📱 Partager mon Score
                        </button>
                    </div>
                </div>
            `;
        };

        const startGame = () => {
            currentSituation = 0;
            totalScore = 0;
            gameStarted = true;
            showSituation();
        };

        // Show welcome screen
        container.innerHTML = `
            <div class="tchoinmeni-container">
                <h2>⚽ Aurélien Tchoinméni 💅</h2>
                <div class="player-avatar">
                    <div class="player-emoji">⚽👨‍🦱💅</div>
                    <div class="player-name">AURÉLIEN TCHOINMÉNI</div>
                    <div class="player-subtitle">Simulation de Carrière Ultra-Stylée</div>
                </div>
                <div class="game-description">
                    <p>Tu es le coach personnel d'Aurélien Tchoinméni ! 🎯</p>
                    <p>Aide-le à devenir la légende la plus stylée du football en faisant les bons choix dans différentes situations.</p>
                    <p>Plus c'est spectaculaire et tchoin, plus tu gagnes de points ! ✨</p>
                </div>
                <button class="restart-btn" onclick="app.loadTchoinmeni(document.getElementById('game-content')); setTimeout(() => app.loadTchoinmeni(document.getElementById('game-content')), 100)">
                    🚀 Commencer la Carrière !
                </button>
            </div>
        `;

        // Auto-start after welcome
        setTimeout(() => {
            if (!gameStarted) {
                startGame();
            }
        }, 100);
    }

    loadTinderTchoin(container) {
        const profiles = [
            {
                name: "Kimberly ✨",
                age: 23,
                emoji: "👩‍🦳💅",
                bio: "Influenceuse lifestyle 📸 | Addict aux bubble tea 🧋 | Mes cheveux sont ma personnalité 💁‍♀️",
                traits: ["Extensions XXL 💇‍♀️", "Collection de filtres Snap 📱", "Parle qu'en emojis 🦄", "Gym selfies only 💪📸"],
                tchoinLevel: 95,
                funFact: "A 47 applications de retouche photo sur son téléphone"
            },
            {
                name: "Tiffany 💖",
                age: 25,
                emoji: "👸💄",
                bio: "CEO de ma propre life 👑 | Dog mom de Prada 🐕 | Si t'as pas de Tesla on peut pas matcher 🚗",
                traits: ["Chihuahua en sac Hermès 👜🐕", "Ongles de 5cm minimum ✋💅", "Lives TikTok 24/7 📱", "Allergique aux textos de plus de 3 mots 💬"],
                tchoinLevel: 87,
                funFact: "Son chien a plus de followers qu'elle"
            },
            {
                name: "Britany (avec un Y) 🌈",
                age: 21,
                emoji: "🧚‍♀️✨",
                bio: "Spiritual tchoin 🔮 | Horoscope > GPS 🌟 | Mes cristaux sont chargés à la pleine lune 🌙",
                traits: ["Tarot reader sur Insta 🔮📱", "Smoothie bowls photogéniques 🥤📸", "Festival queen 🎪👑", "Parle à ses plantes 🪴💬"],
                tchoinLevel: 73,
                funFact: "Prend ses décisions selon son horoscope du jour"
            },
            {
                name: "Alexia (la vraie) 💯",
                age: 28,
                emoji: "👩‍💼💸",
                bio: "Entrepreneuse boss babe 💼 | Dropshipping queen 👑 | Mon mindset > ton salary 💰",
                traits: ["Cours en ligne à 497€ 💻💸", "Stories motivantes 📱💪", "Petit-dej à 5h du mat ⏰☕", "LinkedIn addictée 💼📱"],
                tchoinLevel: 82,
                funFact: "Post des citations motivation même en vacances"
            },
            {
                name: "Jessica (pas l'autre) 🔥",
                age: 24,
                emoji: "🏋️‍♀️🍑",
                bio: "Fitness model 💪 | Protein shake enthusiast 🥤 | Sweat is just fat crying 😭💦",
                traits: ["Workouts en crop top 👕💪", "Mirror selfies non-stop 🪞🤳", "Meal prep obsession 🥗📦", "Partenariat avec 15 marques 💼✨"],
                tchoinLevel: 78,
                funFact: "Compte ses macros même dans ses rêves"
            },
            {
                name: "Cindy Lou Who 👻",
                age: 22,
                emoji: "🖤⛓️",
                bio: "Dark tchoin energy 🖤 | Gothic but make it glam ⚡ | My vibe repels weak people 💀",
                traits: ["Maquillage gothique parfait 🖤💄", "Collection de bagues énormes 💍⚡", "TikToks dark academia 📱🖤", "Café noir uniquement ☕🖤"],
                tchoinLevel: 91,
                funFact: "Ses tenues sont toujours black mais ses ongles brillent dans le noir"
            },
            {
                name: "Mandy (la space girl) 🚀",
                age: 26,
                emoji: "🛸👽",
                bio: "Alien princess from planet Glam ✨👽 | Collecting human hearts and highlighters 💖",
                traits: ["Maquillage intergalactique 👽💄", "Théories du complot sur les aliens 🛸📱", "Paillettes couleur space 🌌✨", "Ne sort que la nuit 🌙🦇"],
                tchoinLevel: 96,
                funFact: "Prétend recevoir des messages de sa planète natale"
            }
        ];

        let currentProfileIndex = 0;
        let swipeCount = 0;
        let matches = [];
        let rejectedProfiles = [];

        const showProfile = () => {
            if (currentProfileIndex >= profiles.length) {
                showResults();
                return;
            }

            const profile = profiles[currentProfileIndex];
            container.innerHTML = `
                <div class="tinder-container">
                    <h2>💖 Tinder des Tchoin 👩‍🦳</h2>
                    <div class="profile-card">
                        <div class="profile-emoji">${profile.emoji}</div>
                        <div class="profile-info">
                            <h3>${profile.name}, ${profile.age} ans</h3>
                            <div class="tchoin-meter">
                                <span>Niveau Tchoin: ${profile.tchoinLevel}%</span>
                                <div class="meter-bar">
                                    <div class="meter-fill" style="width: ${profile.tchoinLevel}%"></div>
                                </div>
                            </div>
                            <div class="bio">${profile.bio}</div>
                            <div class="traits">
                                ${profile.traits.map(trait => `<span class="trait">${trait}</span>`).join('')}
                            </div>
                            <div class="fun-fact">💫 Fun fact: ${profile.funFact}</div>
                        </div>
                    </div>
                    <div class="swipe-buttons">
                        <button class="swipe-btn reject" id="rejectBtn">❌ NEXT</button>
                        <button class="swipe-btn match" id="matchBtn">💖 QUEEN</button>
                    </div>
                    <div class="stats">
                        Profil ${currentProfileIndex + 1}/${profiles.length} | Matches: ${matches.length}
                    </div>
                </div>
            `;

            // Add styles for Tinder game
            if (!document.getElementById('tinder-styles')) {
                const style = document.createElement('style');
                style.id = 'tinder-styles';
                style.textContent = `
                    .tinder-container { text-align: center; max-width: 600px; margin: 0 auto; }
                    .profile-card { background: rgba(255,255,255,0.15); border-radius: 25px; padding: 2rem; margin: 2rem 0; backdrop-filter: blur(10px); }
                    .profile-emoji { font-size: 5rem; margin: 1rem 0; }
                    .profile-info h3 { font-size: 2rem; margin: 1rem 0; color: #ff69b4; }
                    .tchoin-meter { margin: 1rem 0; }
                    .meter-bar { background: rgba(255,255,255,0.2); height: 10px; border-radius: 5px; overflow: hidden; margin: 0.5rem 0; }
                    .meter-fill { background: linear-gradient(45deg, #ff69b4, #ffd700); height: 100%; transition: width 1s ease; }
                    .bio { font-size: 1.2rem; margin: 1.5rem 0; font-style: italic; line-height: 1.4; }
                    .traits { display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center; margin: 1rem 0; }
                    .trait { background: rgba(255,105,180,0.3); padding: 0.5rem 1rem; border-radius: 15px; font-size: 0.9rem; }
                    .fun-fact { background: rgba(255,215,0,0.2); padding: 1rem; border-radius: 15px; margin: 1rem 0; font-size: 1rem; }
                    .swipe-buttons { display: flex; gap: 2rem; justify-content: center; margin: 2rem 0; }
                    .swipe-btn { padding: 1.5rem 2rem; border: none; border-radius: 50px; font-size: 1.3rem; cursor: pointer; transition: all 0.3s; font-weight: bold; }
                    .reject { background: linear-gradient(45deg, #ff4757, #ff3742); color: white; }
                    .match { background: linear-gradient(45deg, #ff69b4, #ff1493); color: white; }
                    .swipe-btn:hover { transform: scale(1.1); }
                    .stats { margin: 1rem 0; font-size: 1.1rem; opacity: 0.9; }
                    .results-container { text-align: center; }
                    .match-list { margin: 2rem 0; }
                    .match-item { background: rgba(255,105,180,0.2); padding: 1rem; border-radius: 15px; margin: 0.5rem 0; }
                `;
                document.head.appendChild(style);
            }

            // Event listeners
            document.getElementById('rejectBtn').addEventListener('click', () => {
                rejectedProfiles.push(profile);
                this.playBeep(300, 200);
                nextProfile();
            });

            document.getElementById('matchBtn').addEventListener('click', () => {
                matches.push(profile);
                this.playBeep(600, 300);
                
                // Animation de match
                const card = container.querySelector('.profile-card');
                card.style.transform = 'scale(1.1)';
                card.style.background = 'rgba(255,105,180,0.4)';
                
                setTimeout(() => {
                    card.style.transform = 'scale(1)';
                    nextProfile();
                }, 800);
            });
        };

        const nextProfile = () => {
            swipeCount++;
            currentProfileIndex++;
            showProfile();
        };

        const showResults = () => {
            let resultMessage = "";
            let title = "";
            
            if (matches.length >= 6) {
                title = "🏆 REINE DU SWIPE 🏆";
                resultMessage = "INCREDIBLE ! Tu as matché avec presque toutes les queen ! Ton radar à tchoin est légendaire ! 👑✨";
            } else if (matches.length >= 4) {
                title = "💖 MATCHEUSE EXPERTE 💖";
                resultMessage = "Excellent ! Tu sais reconnaître les vraies boss ! Ton circle va être fire ! 🔥👩‍👩‍👧‍👧";
            } else if (matches.length >= 2) {
                title = "💅 SÉLECTIVE DE QUALITÉ 💅";
                resultMessage = "Pas mal ! Tu es difficile mais c'est bien, on veut que de la qualité dans notre crew ! ✨";
            } else {
                title = "😅 SUPER DIFFICILE 😅";
                resultMessage = "Waouh tu es hyper sélective ! Tu cherches la perle rare ou tu as des standards impossibles ? 😂";
            }

            const matchNames = matches.map(m => m.name).join(', ');
            
            container.innerHTML = `
                <div class="results-container">
                    <h2>🎯 Résultats de tes Swipes 🎯</h2>
                    <div class="result-title">${title}</div>
                    <div class="result-stats">
                        <div>💖 Matches: ${matches.length}/${profiles.length}</div>
                        <div>📱 Total swipes: ${swipeCount}</div>
                    </div>
                    <div class="result-message">${resultMessage}</div>
                    
                    ${matches.length > 0 ? `
                        <div class="match-list">
                            <h3>💕 Tes Matches:</h3>
                            ${matches.map(match => `
                                <div class="match-item">
                                    ${match.emoji} ${match.name} - Niveau Tchoin: ${match.tchoinLevel}%
                                </div>
                            `).join('')}
                        </div>
                    ` : '<div class="no-matches">💔 Aucun match... Recommence pour être moins difficile ! 😅</div>'}
                    
                    <div class="actions">
                        <button class="restart-btn" onclick="app.loadTinderTchoin(document.getElementById('game-content'))">🔄 Re-swiper</button>
                        <button class="share-result-btn" onclick="navigator.share && navigator.share({title: 'Mes matches Tinder Tchoin', text: '${title} - ${matches.length} matches sur Tchoinland.fun ! 💖', url: window.location.href})">📱 Flex mes matches</button>
                    </div>
                </div>
            `;
        };

        // Shuffle profiles for randomness
        profiles.sort(() => Math.random() - 0.5);
        showProfile();
    }

    loadTchoinAcademy(container) {
        const courses = [
            {
                title: "📸 Selfie Mastery 101",
                description: "Maîtrise l'art du selfie parfait en toutes circonstances",
                lessons: [
                    "🔆 Trouver la lumière parfaite (même dans un parking souterrain)",
                    "📐 L'angle magique qui fait des miracles",
                    "✨ Filtres: quand c'est art, quand c'est de la triche",
                    "🤳 Le timing parfait pour capturer ton aura"
                ],
                exam: "Prendre 5 selfies différents en 2 minutes chrono",
                grade: "Certification Selfie Queen 👑"
            },
            {
                title: "💅 Sciences du Glam",
                description: "Études avancées en beautification et esthétisation",
                lessons: [
                    "🧪 Chimie du maquillage: pourquoi le mascara waterproof existe",
                    "🎨 Théorie des couleurs appliquée aux ongles",
                    "💄 Physique du contouring: jouer avec les ombres",
                    "✨ Mathématiques des paillettes: combien c'est trop?"
                ],
                exam: "Créer un look complet en expliquant chaque choix scientifiquement",
                grade: "Doctorat en Beauté Appliquée 🎓"
            },
            {
                title: "📱 Réseaux Sociaux Avancés",
                description: "Devenir une influenceuse stratégique et authentique",
                lessons: [
                    "📊 Algorithmes démystifiés: faire ami-ami avec l'IA d'Instagram",
                    "✍️ L'art du caption qui fait mouche",
                    "🕐 Timing optimal: quand poster pour maximum d'impact",
                    "💬 Gestion de communauté: transformer les haters en fans"
                ],
                exam: "Créer une stratégie de contenu pour la semaine",
                grade: "Master en Influence Digitale 📲"
            },
            {
                title: "👑 Psychologie de la Confiance",
                description: "Développer un mindset de boss inébranlable",
                lessons: [
                    "🧠 Reprogrammer son dialogue intérieur",
                    "💪 Transformer l'échec en feedback constructif",
                    "🎯 Fixer des objectifs qui font sens",
                    "✨ Cultiver son aura naturelle sans artifices"
                ],
                exam: "Présenter ses rêves avec conviction totale",
                grade: "Certification Boss Mindset 💼"
            }
        ];

        let currentCourse = 0;
        let completedCourses = [];
        let currentLesson = 0;

        const showCourseMenu = () => {
            container.innerHTML = `
                <div class="academy-container">
                    <h2>🎓 Tchoin Academy 💄</h2>
                    <div class="academy-header">
                        <div class="academy-emoji">🏫✨</div>
                        <p>Bienvenue dans la première université de tchoinerie au monde ! 👩‍🎓</p>
                        <p>Choisis ton cours et deviens la boss que tu mérites d'être ! 💪✨</p>
                    </div>
                    
                    <div class="courses-grid">
                        ${courses.map((course, index) => `
                            <div class="course-card ${completedCourses.includes(index) ? 'completed' : ''}" data-course="${index}">
                                <div class="course-title">${course.title}</div>
                                <div class="course-description">${course.description}</div>
                                <div class="course-status">
                                    ${completedCourses.includes(index) ? '✅ Terminé' : '📚 Disponible'}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="academy-stats">
                        <div>📊 Cours complétés: ${completedCourses.length}/${courses.length}</div>
                        <div>🏆 Niveau Tchoin Academy: ${Math.round((completedCourses.length / courses.length) * 100)}%</div>
                    </div>
                </div>
            `;

            // Add styles
            if (!document.getElementById('academy-styles')) {
                const style = document.createElement('style');
                style.id = 'academy-styles';
                style.textContent = `
                    .academy-container { text-align: center; max-width: 800px; margin: 0 auto; }
                    .academy-header { margin: 2rem 0; }
                    .academy-emoji { font-size: 4rem; margin: 1rem 0; }
                    .courses-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin: 2rem 0; }
                    .course-card { background: rgba(255,255,255,0.15); border-radius: 20px; padding: 1.5rem; cursor: pointer; transition: all 0.3s; border: 2px solid transparent; }
                    .course-card:hover { transform: translateY(-5px); border-color: rgba(255,255,255,0.3); }
                    .course-card.completed { background: rgba(0,255,0,0.2); border-color: rgba(0,255,0,0.5); }
                    .course-title { font-size: 1.3rem; font-weight: bold; margin-bottom: 1rem; }
                    .course-description { font-size: 1rem; margin-bottom: 1rem; opacity: 0.9; }
                    .course-status { font-size: 0.9rem; font-weight: bold; }
                    .academy-stats { margin: 2rem 0; display: flex; gap: 2rem; justify-content: center; flex-wrap: wrap; }
                    .lesson-container { text-align: left; max-width: 600px; margin: 0 auto; }
                    .lesson-header { text-align: center; margin: 2rem 0; }
                    .lesson-content { background: rgba(255,255,255,0.1); padding: 2rem; border-radius: 20px; margin: 1rem 0; }
                    .lessons-list { margin: 2rem 0; }
                    .lesson-item { background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 15px; margin: 0.5rem 0; }
                    .exam-section { background: rgba(255,215,0,0.2); padding: 2rem; border-radius: 20px; margin: 2rem 0; text-align: center; }
                    .navigation-btn { padding: 1rem 2rem; margin: 0.5rem; border: none; border-radius: 25px; cursor: pointer; font-size: 1rem; }
                    .primary-btn { background: linear-gradient(45deg, #ff69b4, #da70d6); color: white; }
                    .secondary-btn { background: rgba(255,255,255,0.2); color: white; }
                `;
                document.head.appendChild(style);
            }

            // Event listeners for course cards
            container.querySelectorAll('.course-card').forEach(card => {
                card.addEventListener('click', () => {
                    const courseIndex = parseInt(card.getAttribute('data-course'));
                    currentCourse = courseIndex;
                    currentLesson = 0;
                    showCourse();
                });
            });
        };

        const showCourse = () => {
            const course = courses[currentCourse];
            
            container.innerHTML = `
                <div class="lesson-container">
                    <div class="lesson-header">
                        <h2>${course.title}</h2>
                        <p>${course.description}</p>
                    </div>
                    
                    <div class="lesson-content">
                        <h3>📚 Programme du cours:</h3>
                        <div class="lessons-list">
                            ${course.lessons.map((lesson, index) => `
                                <div class="lesson-item ${index <= currentLesson ? 'active' : ''}">
                                    ${lesson}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="exam-section">
                        <h3>🎯 Examen Final</h3>
                        <p><strong>Mission:</strong> ${course.exam}</p>
                        <p><strong>Récompense:</strong> ${course.grade}</p>
                        <button class="navigation-btn primary-btn" id="takeExam">✅ Passer l'examen</button>
                    </div>
                    
                    <div class="course-navigation">
                        <button class="navigation-btn secondary-btn" onclick="app.loadTchoinAcademy(document.getElementById('game-content'))">← Retour aux cours</button>
                    </div>
                </div>
            `;

            document.getElementById('takeExam').addEventListener('click', () => {
                passCourse();
            });
        };

        const passCourse = () => {
            const course = courses[currentCourse];
            const examQuestions = [
                "Es-tu prête à mettre en pratique ce que tu as appris ? 💪",
                "Promets-tu d'utiliser ces connaissances pour le bien de la tchoinerie ? ✨",
                "T'engages-tu à partager ta sagesse avec les autres tchoin ? 👯‍♀️"
            ];
            
            let questionIndex = 0;
            
            const showQuestion = () => {
                if (questionIndex >= examQuestions.length) {
                    completeCourse();
                    return;
                }
                
                const question = examQuestions[questionIndex];
                container.innerHTML = `
                    <div class="exam-container">
                        <h2>🎓 Examen: ${course.title}</h2>
                        <div class="exam-question">
                            <h3>Question ${questionIndex + 1}/${examQuestions.length}</h3>
                            <p>${question}</p>
                        </div>
                        <div class="exam-buttons">
                            <button class="navigation-btn primary-btn" id="yesBtn">✅ OUI, absolument !</button>
                            <button class="navigation-btn secondary-btn" id="noBtn">❌ Euh... peut-être ?</button>
                        </div>
                    </div>
                `;
                
                document.getElementById('yesBtn').addEventListener('click', () => {
                    questionIndex++;
                    this.playBeep(600, 200);
                    showQuestion();
                });
                
                document.getElementById('noBtn').addEventListener('click', () => {
                    alert("🤔 Hmm... Je sens que tu n'es pas encore prête ! Repasse l'examen quand tu te sentiras plus confiante ! 💪");
                    showCourse();
                });
            };
            
            showQuestion();
        };

        const completeCourse = () => {
            const course = courses[currentCourse];
            completedCourses.push(currentCourse);
            
            const completionMessages = [
                "BRAVO ! Tu viens de level up ! 🎊",
                "FÉLICITATIONS ! Ton aura vient de s'intensifier ! ✨",
                "AMAZING ! Tu es maintenant officieellement plus sage ! 🧠",
                "INCREDIBLE ! Tu maîtrises maintenant cette science ! 🔬"
            ];
            
            const randomMessage = completionMessages[Math.floor(Math.random() * completionMessages.length)];
            
            container.innerHTML = `
                <div class="completion-container">
                    <h2>🎉 COURS TERMINÉ ! 🎉</h2>
                    <div class="completion-animation">🏆✨🎓✨🏆</div>
                    <div class="completion-message">${randomMessage}</div>
                    <div class="certificate">
                        <h3>📜 CERTIFICAT OFFICIEL 📜</h3>
                        <p><strong>${course.grade}</strong></p>
                        <p>Délivré par la Tchoin Academy</p>
                        <p>Valide à vie dans l'univers de la tchoinerie ✨</p>
                    </div>
                    
                    <div class="next-steps">
                        ${completedCourses.length === courses.length ? 
                            '<h3>🎊 DIPLÔMÉE ! 🎊<br>Tu as terminé TOUS les cours ! Tu es maintenant une Tchoin Academy Graduate ! 👩‍🎓✨</h3>' : 
                            '<h3>Continue ton cursus pour devenir une vraie experte ! 📚</h3>'
                        }
                    </div>
                    
                    <div class="actions">
                        <button class="navigation-btn primary-btn" onclick="app.loadTchoinAcademy(document.getElementById('game-content'))">📚 Retour aux cours</button>
                        <button class="navigation-btn secondary-btn" onclick="navigator.share && navigator.share({title: 'Certificat Tchoin Academy', text: 'Je viens d\\'obtenir mon ${course.grade} à la Tchoin Academy ! 🎓✨', url: window.location.href})">📱 Partager mon diplôme</button>
                    </div>
                </div>
            `;
            
            this.playBeep(800, 500);
        };

        showCourseMenu();
    }
}

// Add the flash animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes flash { 0% { opacity: 1; } 50% { opacity: 0; } 100% { opacity: 1; } }
    @keyframes sparkle-fade { 
        0% { opacity: 1; transform: translateY(0) rotate(0deg); } 
        100% { opacity: 0; transform: translateY(-50px) rotate(180deg); } 
    }
`;
document.head.appendChild(style);

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new TchoinlandApp();
});

// PWA service worker registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(registration => console.log('SW registered'))
            .catch(error => console.log('SW registration failed'));
    });
}