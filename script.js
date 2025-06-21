class TchoinlandApp {
    constructor() {
        this.currentGame = null;
        // Récupérer la préférence de musique sauvegardée (par défaut activée pour les vraies tchoin ! 💅)
        this.musicEnabled = localStorage.getItem('tchoinMusicEnabled') !== 'false';
        this.audioRetryCount = 0;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupMusic();
        this.addRandomSparkles();
        this.updateMusicButton();
        this.setupRandomPhotos();
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
        // Gestion de la playlist tchoin 🎵👑
        this.backgroundMusic = document.getElementById('backgroundMusic');
        this.musicLoaded = false;
        
        // Playlist des chansons tchoin (dossier musique)
        this.tchoinPlaylist = [
            "musique/Reine de la Tchoin.mp3",
            "musique/tchoin tchoin tchoin tchoin tchoin tchoi.mp3", 
            "musique/tchoin tchoin tchoin tchoin tchoin tchoi (1).mp3",
            "musique/tchoin tchoin tchoin tchoin tchoin tchoi (2).mp3"
        ];
        this.currentSongIndex = 0;
        this.songPlayCount = {}; // Compteur pour éviter plus de 2 répétitions
        this.availableSongs = [...this.tchoinPlaylist]; // Songs disponibles
        
        // Web Audio Context pour les effets sonores (créé seulement après interaction)
        this.audioContext = null;
        this.audioContextInitialized = false;

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

        // Quand la musique se termine, on passe à la suivante
        this.backgroundMusic.addEventListener('ended', () => {
            console.log('🎵✨ Chanson terminée ! On passe au hit suivant ! 💅🔥');
            this.playNextSong();
        });

        // Auto-play quand possible (après interaction utilisateur)
        document.addEventListener('click', this.handleFirstUserInteraction.bind(this), { once: true });
        document.addEventListener('touchstart', this.handleFirstUserInteraction.bind(this), { once: true });
    }

    handleFirstUserInteraction() {
        console.log('🎵 Première interaction utilisateur détectée !');
        this.initializeAudioContext();
        this.tryAutoPlay();
    }

    initializeAudioContext() {
        if (!this.audioContextInitialized) {
            try {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                this.audioContextInitialized = true;
                console.log('🎵 AudioContext créé avec succès !');
            } catch (e) {
                console.log('🎵❌ AudioContext non supporté:', e);
            }
        }
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
            this.startRandomSong();
        } else if (this.musicEnabled && !this.musicLoaded) {
            // Si la musique n'est pas encore chargée, attendre une seule fois
            if (!this.audioRetryCount) {
                this.audioRetryCount = 0;
            }
            if (this.audioRetryCount < 3) {
                this.audioRetryCount++;
                setTimeout(() => this.tryAutoPlay(), 1000);
            }
        }
    }

    startRandomSong() {
        // Choisir une chanson aléatoire au démarrage
        this.currentSongIndex = Math.floor(Math.random() * this.tchoinPlaylist.length);
        const randomSong = this.tchoinPlaylist[this.currentSongIndex];
        
        // Incrémenter le compteur pour cette chanson
        this.songPlayCount[randomSong] = (this.songPlayCount[randomSong] || 0) + 1;
        
        console.log('🎵🎲 Chanson aléatoire sélectionnée:', randomSong, `(jouée ${this.songPlayCount[randomSong]} fois)`);
        
        this.backgroundMusic.src = randomSong;
        this.backgroundMusic.load();
        
        this.backgroundMusic.addEventListener('loadedmetadata', () => {
            // Position aléatoire dans la chanson
            const randomPosition = Math.random() * (this.backgroundMusic.duration - 30);
            this.backgroundMusic.currentTime = randomPosition;
            console.log('🎵⏯️ Démarrage à la position:', Math.round(randomPosition), 'secondes');
            
            this.backgroundMusic.play().catch(e => {
                console.log('🎵❌ Lecture bloquée par le navigateur:', e);
            });
        }, { once: true });
    }
    
    playNextSong() {
        // Filtrer les chansons jouées moins de 2 fois
        let availableSongs = this.tchoinPlaylist.filter(song => 
            (this.songPlayCount[song] || 0) < 2
        );
        
        // Si toutes les chansons ont été jouées 2 fois, reset le compteur
        if (availableSongs.length === 0) {
            console.log('🎵🔄 Reset du compteur - toutes les chansons jouées 2 fois !');
            this.songPlayCount = {};
            availableSongs = [...this.tchoinPlaylist];
        }
        
        // Éviter la même chanson que la précédente si possible
        const currentSong = this.tchoinPlaylist[this.currentSongIndex];
        const otherSongs = availableSongs.filter(song => song !== currentSong);
        const songsToChooseFrom = otherSongs.length > 0 ? otherSongs : availableSongs;
        
        // Choisir une chanson aléatoire
        const nextSong = songsToChooseFrom[Math.floor(Math.random() * songsToChooseFrom.length)];
        this.currentSongIndex = this.tchoinPlaylist.indexOf(nextSong);
        
        // Incrémenter le compteur
        this.songPlayCount[nextSong] = (this.songPlayCount[nextSong] || 0) + 1;
        
        console.log('🎵⏭️ Chanson suivante:', nextSong, `(jouée ${this.songPlayCount[nextSong]} fois)`);
        
        this.backgroundMusic.src = nextSong;
        this.backgroundMusic.load();
        
        this.backgroundMusic.addEventListener('loadedmetadata', () => {
            // Position aléatoire dans la nouvelle chanson
            const randomPosition = Math.random() * (this.backgroundMusic.duration - 30);
            this.backgroundMusic.currentTime = randomPosition;
            
            this.backgroundMusic.play().catch(e => {
                console.log('🎵❌ Lecture suivante bloquée:', e);
            });
        }, { once: true });
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
        if (!this.musicEnabled) return;
        
        // Initialiser l'AudioContext s'il n'existe pas encore
        if (!this.audioContextInitialized) {
            this.initializeAudioContext();
        }
        
        if (!this.audioContext || this.audioContext.state === 'suspended') {
            console.log('🎵⏸️ AudioContext pas encore activé (besoin interaction utilisateur)');
            return;
        }
        
        try {
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
        } catch (e) {
            console.log('🎵❌ Erreur lors de la lecture du beep:', e);
        }
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
            case 'facts':
                this.loadTchoinFacts(content);
                break;
            case 'tchoinmeni':
                this.loadTchoinmeni(content);
                break;
            case 'tchoin-catch':
                this.loadTchoinCatch(content);
                break;
            case 'tchoin-memory':
                this.loadTchoinMemory(content);
                break;
            case 'tchoin-tap':
                this.loadTchoinTap(content);
                break;
            case 'space-invaders':
                this.loadSpaceInvaders(content);
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
        const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
        
        // Prompt système pour conditionner l'IA AMÉLIORÉ
        const SYSTEM_PROMPT = `Tu es TchoinGPT, l'IA la plus stylée et déjantée du game ! 💅✨ Tu es propulsée par Gemini Flash pour être encore plus rapide !

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
            { image: "👸", name: "Kim Kardashian vibes", isTchoin: true, reason: "L'icône du glamour assumé, la reine des tchoin !" },
            { image: "🤴", name: "Brad Pitt énergie", isTchoin: false, reason: "Trop classe et discret pour être tchoin." },
            { image: "👩‍🎤", name: "Ariana Grande mood", isTchoin: true, reason: "Queue de cheval haute et attitude de diva, 100% tchoin !" },
            { image: "👨‍💼", name: "Elon Musk énergie", isTchoin: false, reason: "Trop occupé à conquérir Mars pour être tchoin." },
            { image: "🦄", name: "Paris Hilton vibes", isTchoin: true, reason: "L'inventrice du style tchoin moderne !" },
            { image: "🕺", name: "Ryan Gosling énergie", isTchoin: false, reason: "Trop mystérieux et talent pur pour être tchoin." },
            { image: "💃", name: "Cardi B attitude", isTchoin: true, reason: "Ongles XXL et personnalité explosive, tchoin confirmée !" },
            { image: "🧔", name: "Keanu Reeves vibes", isTchoin: false, reason: "Trop humble et authentique pour être tchoin." },
            { image: "👑", name: "Beyoncé énergie", isTchoin: true, reason: "Queen B, littéralement une reine tchoin !" },
            { image: "🤵", name: "Leonardo DiCaprio mood", isTchoin: false, reason: "Trop écolo et intellectuel pour être tchoin." },
            { image: "💋", name: "Kylie Jenner vibes", isTchoin: true, reason: "Lèvres XXL et business empire, tchoin businesswoman !" },
            { image: "👨‍🎨", name: "Ryan Reynolds énergie", isTchoin: false, reason: "Trop sarcastique et down-to-earth." },
            { image: "🌟", name: "Lady Gaga attitude", isTchoin: true, reason: "Extravagance et paillettes, l'art tchoin poussé à l'extrême !" },
            { image: "🎭", name: "Robert Downey Jr vibes", isTchoin: false, reason: "Trop charismatique naturellement pour être tchoin." },
            { image: "👄", name: "Nicki Minaj énergie", isTchoin: true, reason: "Couleurs flashy et attitude boss, tchoin de compétition !" },
            { image: "🕴️", name: "Tom Hanks mood", isTchoin: false, reason: "Trop gentil et authentique pour être tchoin." },
            { image: "💎", name: "Rihanna vibes", isTchoin: true, reason: "Businesswoman et style iconique, tchoin successful !" },
            { image: "🎬", name: "Morgan Freeman énergie", isTchoin: false, reason: "Trop sage et respecté pour être tchoin." },
            { image: "✨", name: "Selena Gomez attitude", isTchoin: true, reason: "Sweet mais avec du caractère, tchoin refined !" },
            { image: "🎪", name: "Jim Carrey vibes", isTchoin: false, reason: "Trop drôle naturellement pour être tchoin." }
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



    // NOUVEAUX MINI-JEUX INTERACTIFS ! 🎮✨

    loadTchoinCatch(container) {
        let score = 0;
        let gameActive = false;
        let gameSpeed = 2000;
        let catchElements = [];

        container.innerHTML = `
            <div class="tchoin-catch-game">
                <h2>💅🎯 Catch the Tchoin</h2>
                <div class="game-info">
                    <div class="score-display">Score: <span id="catch-score">0</span></div>
                    <div class="lives-display">💄💄💄</div>
                </div>
                <div class="catch-area" id="catch-area"></div>
                <button class="start-btn" id="start-catch">🚀 Start Catching !</button>
                <div class="instructions">👆 Tape sur les tchoin qui tombent pour marquer des points ! 💅</div>
            </div>
        `;

        const catchArea = container.querySelector('#catch-area');
        const scoreEl = container.querySelector('#catch-score');
        const livesEl = container.querySelector('.lives-display');
        const startBtn = container.querySelector('#start-catch');
        
        const tchoinEmojis = ['💅', '👑', '💄', '✨', '💎', '🦄', '👩‍🦳', '💋'];
        let lives = 3;

        const createFallingTchoin = () => {
            if (!gameActive) return;
            
            const tchoin = document.createElement('div');
            tchoin.className = 'falling-tchoin';
            tchoin.textContent = tchoinEmojis[Math.floor(Math.random() * tchoinEmojis.length)];
            tchoin.style.left = Math.random() * (catchArea.offsetWidth - 50) + 'px';
            tchoin.style.top = '-50px';
            tchoin.style.position = 'absolute';
            tchoin.style.fontSize = '2rem';
            tchoin.style.cursor = 'pointer';
            tchoin.style.userSelect = 'none';
            tchoin.style.transition = `top ${3000 + Math.random() * 2000}ms linear`;
            
            catchArea.appendChild(tchoin);
            catchElements.push(tchoin);

            // Animation de chute
            setTimeout(() => {
                tchoin.style.top = catchArea.offsetHeight + 'px';
            }, 10);

            // Clic pour attraper
            tchoin.addEventListener('click', () => {
                if (gameActive) {
                    score += 10;
                    scoreEl.textContent = score;
                    this.playBeep(600, 100);
                    
                    // Animation d'explosion
                    tchoin.style.transform = 'scale(2) rotate(360deg)';
                    tchoin.style.opacity = '0';
                    setTimeout(() => tchoin.remove(), 300);
                }
            });

            // Si pas attrapé
            setTimeout(() => {
                if (tchoin.parentNode && gameActive) {
                    lives--;
                    this.playBeep(200, 300);
                    livesEl.textContent = '💄'.repeat(lives);
                    tchoin.remove();
                    
                    if (lives <= 0) {
                        endGame();
                    }
                }
            }, 5000);
        };

        const startGame = () => {
            gameActive = true;
            score = 0;
            lives = 3;
            scoreEl.textContent = '0';
            livesEl.textContent = '💄💄💄';
            startBtn.style.display = 'none';
            
            const gameInterval = setInterval(() => {
                if (!gameActive) {
                    clearInterval(gameInterval);
                    return;
                }
                createFallingTchoin();
                gameSpeed = Math.max(800, gameSpeed - 50); // Accélération progressive
            }, gameSpeed);
        };

        const endGame = () => {
            gameActive = false;
            catchElements.forEach(el => el.remove());
            catchElements = [];
            
            let message = "";
            if (score >= 200) {
                message = "🏆 DÉESSE DU CATCH ! Tu es une machine à attraper les tchoin ! 👑✨";
            } else if (score >= 100) {
                message = "💅 EXCELLENTE TCHOINEUSE ! Tes réflexes sont au top ! 🎯";
            } else if (score >= 50) {
                message = "✨ PAS MAL DU TOUT ! Tu commences à maîtriser l'art du catch ! 💄";
            } else {
                message = "😅 IL FAUT S'ENTRAÎNER ! Les tchoin sont rapides mais tu peux faire mieux ! 🦄";
            }
            
            container.innerHTML += `
                <div class="game-over">
                    <h3>🎯 Game Over ! 🎯</h3>
                    <div class="final-score">Score final: ${score}</div>
                    <div class="result-message">${message}</div>
                    <button onclick="app.loadTchoinCatch(document.getElementById('game-content'))" class="replay-btn">🔄 Rejouer</button>
                </div>
            `;
        };

        startBtn.addEventListener('click', startGame);

        // Styles CSS pour le jeu
        const style = document.createElement('style');
        style.textContent = `
            .tchoin-catch-game { text-align: center; padding: 1rem; }
            .catch-area { 
                position: relative; 
                height: 400px; 
                background: rgba(255,105,180,0.1); 
                border: 2px dashed rgba(255,255,255,0.5); 
                border-radius: 15px; 
                margin: 1rem 0; 
                overflow: hidden;
            }
            .game-info { display: flex; justify-content: space-between; margin: 1rem 0; }
            .falling-tchoin { z-index: 10; animation: wiggle 0.5s infinite; }
            .start-btn, .replay-btn { 
                background: rgba(255,105,180,0.3); 
                border: 2px solid rgba(255,255,255,0.5); 
                color: white; 
                padding: 1rem 2rem; 
                border-radius: 25px; 
                font-size: 1.2rem; 
                cursor: pointer; 
                margin: 1rem;
            }
            @keyframes wiggle { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(5deg); } }
            .instructions { margin: 1rem 0; opacity: 0.8; font-size: 0.9rem; }
            .game-over { 
                background: rgba(255,105,180,0.2); 
                padding: 2rem; 
                border-radius: 15px; 
                margin: 1rem 0; 
            }
        `;
        document.head.appendChild(style);
    }

    loadTchoinMemory(container) {
        let cards = [];
        let flippedCards = [];
        let matchedPairs = 0;
        let moves = 0;
        let gameStarted = false;

        const tchoinEmojis = ['💅', '👑', '💄', '✨', '💎', '🦄', '💋', '🎀'];
        const gameCards = [...tchoinEmojis, ...tchoinEmojis].sort(() => Math.random() - 0.5);

        container.innerHTML = `
            <div class="memory-game">
                <h2>🧠💋 Memory Tchoin</h2>
                <div class="game-stats">
                    <div>Moves: <span id="move-counter">0</span></div>
                    <div>Pairs: <span id="pair-counter">0</span>/8</div>
                </div>
                <div class="memory-grid" id="memory-grid"></div>
                <button class="shuffle-btn" id="shuffle-btn">🔄 Nouvelle partie</button>
            </div>
        `;

        const grid = container.querySelector('#memory-grid');
        const moveCounter = container.querySelector('#move-counter');
        const pairCounter = container.querySelector('#pair-counter');
        const shuffleBtn = container.querySelector('#shuffle-btn');

        const createCards = () => {
            grid.innerHTML = '';
            gameCards.forEach((emoji, index) => {
                const card = document.createElement('div');
                card.className = 'memory-card';
                card.dataset.emoji = emoji;
                card.dataset.index = index;
                
                card.innerHTML = `
                    <div class="card-front">❓</div>
                    <div class="card-back">${emoji}</div>
                `;
                
                card.addEventListener('click', flipCard);
                grid.appendChild(card);
                cards.push(card);
            });
        };

        const flipCard = (e) => {
            const card = e.currentTarget;
            
            if (card.classList.contains('flipped') || card.classList.contains('matched') || flippedCards.length >= 2) {
                return;
            }

            card.classList.add('flipped');
            flippedCards.push(card);
            this.playBeep(400, 100);

            if (flippedCards.length === 2) {
                moves++;
                moveCounter.textContent = moves;
                checkForMatch();
            }
        };

        const checkForMatch = () => {
            const [card1, card2] = flippedCards;
            const emoji1 = card1.dataset.emoji;
            const emoji2 = card2.dataset.emoji;

            setTimeout(() => {
                if (emoji1 === emoji2) {
                    // Match !
                    card1.classList.add('matched');
                    card2.classList.add('matched');
                    matchedPairs++;
                    pairCounter.textContent = matchedPairs;
                    this.playBeep(600, 200);

                    if (matchedPairs === 8) {
                        setTimeout(() => showResults(), 500);
                    }
                } else {
                    // Pas de match
                    card1.classList.remove('flipped');
                    card2.classList.remove('flipped');
                    this.playBeep(200, 200);
                }
                flippedCards = [];
            }, 1000);
        };

        const showResults = () => {
            let message = "";
            let title = "";
            
            if (moves <= 12) {
                title = "🧠👑 GÉNIE DE LA MÉMOIRE !";
                message = "INCROYABLE ! Tu as une mémoire de tchoin légendaire ! 🏆✨";
            } else if (moves <= 20) {
                title = "💅 EXCELLENTE MÉMOIRE !";
                message = "Bravo ! Ton cerveau fonctionne comme un bijou ! 💎🧠";
            } else if (moves <= 30) {
                title = "✨ BONNE PERFORMANCE !";
                message = "Pas mal du tout ! Tu maîtrises l'art de la mémorisation ! 🎯";
            } else {
                title = "💄 À AMÉLIORER !";
                message = "Il faut travailler cette mémoire ma belle ! Mais c'est déjà un bon début ! 😊";
            }

            container.innerHTML += `
                <div class="memory-results">
                    <h3>\${title}</h3>
                    <div class="final-stats">
                        <div>🎯 Mouvements: \${moves}</div>
                        <div>⭐ Performance: \${moves <= 12 ? 'Parfait' : moves <= 20 ? 'Excellent' : moves <= 30 ? 'Bien' : 'À améliorer'}</div>
                    </div>
                    <div class="result-message">\${message}</div>
                    <button onclick="app.loadTchoinMemory(document.getElementById('game-content'))" class="replay-btn">🔄 Rejouer</button>
                </div>
            `;
        };

        const resetGame = () => {
            cards = [];
            flippedCards = [];
            matchedPairs = 0;
            moves = 0;
            moveCounter.textContent = '0';
            pairCounter.textContent = '0';
            createCards();
        };

        shuffleBtn.addEventListener('click', resetGame);
        createCards();

        // Styles CSS
        const style = document.createElement('style');
        style.textContent = `
            .memory-game { text-align: center; padding: 1rem; }
            .memory-grid { 
                display: grid; 
                grid-template-columns: repeat(4, 1fr); 
                gap: 10px; 
                max-width: 400px; 
                margin: 1rem auto; 
            }
            .memory-card { 
                aspect-ratio: 1; 
                background: rgba(255,105,180,0.3); 
                border: 2px solid rgba(255,255,255,0.5); 
                border-radius: 10px; 
                cursor: pointer; 
                position: relative; 
                transform-style: preserve-3d; 
                transition: transform 0.6s;
            }
            .memory-card.flipped { transform: rotateY(180deg); }
            .memory-card.matched { 
                background: rgba(0,255,0,0.3); 
                transform: scale(0.9); 
            }
            .card-front, .card-back { 
                position: absolute; 
                width: 100%; 
                height: 100%; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                font-size: 1.5rem; 
                backface-visibility: hidden; 
            }
            .card-back { transform: rotateY(180deg); }
            .game-stats { 
                display: flex; 
                justify-content: space-around; 
                margin: 1rem 0; 
                font-weight: bold; 
            }
            .shuffle-btn, .replay-btn { 
                background: rgba(255,105,180,0.3); 
                border: 2px solid rgba(255,255,255,0.5); 
                color: white; 
                padding: 0.8rem 1.5rem; 
                border-radius: 20px; 
                cursor: pointer; 
                margin: 1rem; 
            }
            .memory-results { 
                background: rgba(255,105,180,0.2); 
                padding: 2rem; 
                border-radius: 15px; 
                margin: 1rem 0; 
            }
            @media (max-width: 480px) {
                .memory-grid { max-width: 300px; }
                .card-front, .card-back { font-size: 1.2rem; }
            }
        `;
        document.head.appendChild(style);
    }

    loadTchoinTap(container) {
        let score = 0;
        let timeLeft = 30;
        let gameActive = false;
        let tapInterval;
        let countdownInterval;

        container.innerHTML = `
            <div class="tap-game">
                <h2>👆✨ Tap Tap Tchoin</h2>
                <div class="tap-stats">
                    <div class="score">Score: <span id="tap-score">0</span></div>
                    <div class="timer">Temps: <span id="tap-timer">30</span>s</div>
                </div>
                <div class="tap-area" id="tap-area">
                    <div class="tap-target" id="tap-target">💅</div>
                </div>
                <button class="start-tap-btn" id="start-tap">🚀 Start Tapping !</button>
                <div class="tap-instructions">👆 Tape le plus vite possible sur l'emoji ! Plus tu tapes vite, plus tu gagnes de points ! 💅⚡</div>
            </div>
        `;

        const scoreEl = container.querySelector('#tap-score');
        const timerEl = container.querySelector('#tap-timer');
        const tapTarget = container.querySelector('#tap-target');
        const tapArea = container.querySelector('#tap-area');
        const startBtn = container.querySelector('#start-tap');

        const tchoinEmojis = ['💅', '👑', '💄', '✨', '💎', '🦄', '💋', '🎀', '👩‍🦳', '💖'];
        let tapCount = 0;
        let lastTapTime = 0;

        const changeEmoji = () => {
            tapTarget.textContent = tchoinEmojis[Math.floor(Math.random() * tchoinEmojis.length)];
        };

        const onTap = () => {
            if (!gameActive) return;
            
            tapCount++;
            const currentTime = Date.now();
            const timeDiff = currentTime - lastTapTime;
            
            // Bonus pour vitesse
            let points = 1;
            if (timeDiff < 200) points = 3; // Très rapide
            else if (timeDiff < 400) points = 2; // Rapide
            
            score += points;
            scoreEl.textContent = score;
            lastTapTime = currentTime;
            
            // Effets visuels
            this.playBeep(400 + Math.random() * 400, 50);
            tapTarget.style.transform = 'scale(1.3) rotate(15deg)';
            tapTarget.style.background = `hsl(\${Math.random() * 360}, 70%, 70%)`;
            
            setTimeout(() => {
                tapTarget.style.transform = 'scale(1) rotate(0deg)';
                tapTarget.style.background = 'transparent';
            }, 100);
            
            changeEmoji();
            
            // Animation de score
            const scorePopup = document.createElement('div');
            scorePopup.textContent = `+\${points}`;
            scorePopup.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: #fff;
                font-size: 1.5rem;
                font-weight: bold;
                pointer-events: none;
                animation: scoreFloat 1s ease-out forwards;
            `;
            tapArea.appendChild(scorePopup);
            setTimeout(() => scorePopup.remove(), 1000);
        };

        const startGame = () => {
            gameActive = true;
            score = 0;
            timeLeft = 30;
            tapCount = 0;
            lastTapTime = Date.now();
            scoreEl.textContent = '0';
            startBtn.style.display = 'none';
            
            countdownInterval = setInterval(() => {
                timeLeft--;
                timerEl.textContent = timeLeft;
                
                if (timeLeft <= 0) {
                    endGame();
                }
            }, 1000);
            
            // Changer d'emoji périodiquement
            tapInterval = setInterval(changeEmoji, 1000);
        };

        const endGame = () => {
            gameActive = false;
            clearInterval(countdownInterval);
            clearInterval(tapInterval);
            
            const tps = (tapCount / 30).toFixed(1); // Taps per second
            
            let message = "";
            let title = "";
            
            if (score >= 200) {
                title = "👑 DÉESSE DU TAP !";
                message = `INCROYABLE ! \${tps} taps/sec ! Tes doigts sont des missiles ! 🚀💅`;
            } else if (score >= 150) {
                title = "⚡ SPEED DEMON !";
                message = `EXCELLENT ! \${tps} taps/sec ! Tu as des doigts magiques ! ✨👆`;
            } else if (score >= 100) {
                title = "💄 BONNE VITESSE !";
                message = `Pas mal ! \${tps} taps/sec ! Tu commences à maîtriser ! 🎯`;
            } else if (score >= 50) {
                title = "🦄 DÉBUTANTE PROMETTEUSE !";
                message = `C'est un début ! \${tps} taps/sec ! Il faut s'entraîner ! 💪`;
            } else {
                title = "😅 SLOW MOTION !";
                message = `\${tps} taps/sec... Es-tu sûre que tes doigts fonctionnent ? 😂💅`;
            }

            container.innerHTML += `
                <div class="tap-results">
                    <h3>\${title}</h3>
                    <div class="final-stats">
                        <div>🎯 Score: \${score} points</div>
                        <div>👆 Taps: \${tapCount}</div>
                        <div>⚡ Vitesse: \${tps} taps/sec</div>
                    </div>
                    <div class="result-message">\${message}</div>
                    <button onclick="app.loadTchoinTap(document.getElementById('game-content'))" class="replay-btn">🔄 Rejouer</button>
                </div>
            `;
        };

        tapTarget.addEventListener('click', onTap);
        tapTarget.addEventListener('touchstart', onTap);
        startBtn.addEventListener('click', startGame);

        // Styles CSS
        const style = document.createElement('style');
        style.textContent = `
            .tap-game { text-align: center; padding: 1rem; }
            .tap-area { 
                position: relative;
                height: 300px; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                margin: 2rem auto; 
                background: rgba(255,105,180,0.1); 
                border: 3px dashed rgba(255,255,255,0.5); 
                border-radius: 20px;
                max-width: 400px;
            }
            .tap-target { 
                font-size: 4rem; 
                cursor: pointer; 
                user-select: none; 
                transition: transform 0.1s, background 0.1s;
                padding: 1rem;
                border-radius: 50%;
                background: transparent;
            }
            .tap-target:hover { transform: scale(1.1); }
            .tap-stats { 
                display: flex; 
                justify-content: space-around; 
                margin: 1rem 0; 
                font-weight: bold; 
                font-size: 1.2rem;
            }
            .start-tap-btn, .replay-btn { 
                background: rgba(255,105,180,0.3); 
                border: 2px solid rgba(255,255,255,0.5); 
                color: white; 
                padding: 1rem 2rem; 
                border-radius: 25px; 
                font-size: 1.2rem; 
                cursor: pointer; 
                margin: 1rem;
            }
            .tap-instructions { 
                margin: 1rem 0; 
                opacity: 0.8; 
                font-size: 0.9rem; 
                max-width: 400px;
                margin-left: auto;
                margin-right: auto;
            }
            .tap-results { 
                background: rgba(255,105,180,0.2); 
                padding: 2rem; 
                border-radius: 15px; 
                margin: 1rem 0; 
            }
            @keyframes scoreFloat { 
                0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                100% { opacity: 0; transform: translate(-50%, -100%) scale(1.5); }
            }
        `;
        document.head.appendChild(style);
    }


    scheduleRandomPhoto() {
        // Attendre entre 30 et 60 secondes avant la prochaine photo (plus espacé pour éviter les erreurs)
        const randomDelay = 30000 + Math.random() * 30000;
        
        setTimeout(() => {
            this.showRandomPhoto();
            this.scheduleRandomPhoto(); // Programmer la prochaine
        }, randomDelay);
    }

    showRandomPhoto() {
        const photoContainer = document.getElementById('photo-flash-container');
        if (!photoContainer) return;

        // Choisir une photo aléatoire
        const randomPhoto = this.photoList[Math.floor(Math.random() * this.photoList.length)];
        const photoPath = `photos/${encodeURIComponent(randomPhoto)}`;
        
        console.log('📸✨ Affichage photo flash:', randomPhoto);

        // Définir l'image de fond
        photoContainer.style.backgroundImage = `url('${photoPath}')`;
        
        // Afficher avec effet fade in
        photoContainer.style.opacity = '1';
        
        // Son de flash photo
        this.playBeep(800, 100);
        setTimeout(() => this.playBeep(600, 80), 100);
        
        // Masquer après 1.5 secondes
        setTimeout(() => {
            photoContainer.style.opacity = '0';
            
            // Nettoyer l'image après la transition
            setTimeout(() => {
                photoContainer.style.backgroundImage = '';
            }, 300);
        }, 1500);
    }


    loadSpaceInvaders(container) {
        let gameState = {
            running: false,
            paused: false,
            player: { x: 200, y: 350, width: 30, height: 20, speed: 5 },
            bullets: [],
            invaders: [],
            invaderBullets: [],
            score: 0,
            lives: 3,
            level: 1,
            invaderSpeed: 1,
            invaderDirection: 1
        };

        container.innerHTML = `
            <div class="space-invaders-game">
                <h2>👾💅 Space Invaders Tchoin</h2>
                <div class="game-stats">
                    <div class="stat">Score: <span id="space-score">0</span></div>
                    <div class="stat">Lives: <span id="space-lives">3</span></div>
                    <div class="stat">Level: <span id="space-level">1</span></div>
                </div>
                <canvas id="space-canvas" width="400" height="400"></canvas>
                <div class="space-controls">
                    <button id="space-start" class="space-btn">🚀 Start Game</button>
                    <button id="space-pause" class="space-btn" style="display: none;">⏸️ Pause</button>
                </div>
                <div class="mobile-space-controls">
                    <button class="space-control-btn" data-action="left">⬅️</button>
                    <button class="space-control-btn" data-action="shoot">🔫</button>
                    <button class="space-control-btn" data-action="right">➡️</button>
                </div>
                <div class="space-instructions">
                    🎮 Flèches pour bouger, ESPACE pour tirer !<br>
                    👾 Détruis tous les envahisseurs tchoin ! 💅✨
                </div>
            </div>
        `;

        const canvas = container.querySelector('#space-canvas');
        const ctx = canvas.getContext('2d');
        const scoreEl = container.querySelector('#space-score');
        const livesEl = container.querySelector('#space-lives');
        const levelEl = container.querySelector('#space-level');
        const startBtn = container.querySelector('#space-start');
        const pauseBtn = container.querySelector('#space-pause');

        // Emojis pour le jeu
        const playerEmoji = '🦄';
        const invaderEmojis = ['👾', '💅', '👑', '💄', '✨'];
        const bulletEmoji = '💎';
        const invaderBulletEmoji = '💔';

        const keys = {
            left: false,
            right: false,
            space: false
        };

        // Initialiser les envahisseurs
        const initInvaders = () => {
            gameState.invaders = [];
            const rows = 5;
            const cols = 8;
            const invaderWidth = 25;
            const invaderHeight = 25;
            const startX = 50;
            const startY = 50;

            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    gameState.invaders.push({
                        x: startX + col * (invaderWidth + 10),
                        y: startY + row * (invaderHeight + 10),
                        width: invaderWidth,
                        height: invaderHeight,
                        emoji: invaderEmojis[row % invaderEmojis.length],
                        alive: true
                    });
                }
            }
        };

        const drawPlayer = () => {
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(playerEmoji, gameState.player.x + gameState.player.width/2, gameState.player.y + gameState.player.height);
        };

        const drawInvaders = () => {
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            gameState.invaders.forEach(invader => {
                if (invader.alive) {
                    ctx.fillText(invader.emoji, invader.x + invader.width/2, invader.y + invader.height);
                }
            });
        };

        const drawBullets = () => {
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            
            // Balles du joueur
            gameState.bullets.forEach(bullet => {
                ctx.fillText(bulletEmoji, bullet.x, bullet.y);
            });
            
            // Balles des envahisseurs
            gameState.invaderBullets.forEach(bullet => {
                ctx.fillText(invaderBulletEmoji, bullet.x, bullet.y);
            });
        };

        const updatePlayer = () => {
            if (keys.left && gameState.player.x > 0) {
                gameState.player.x -= gameState.player.speed;
            }
            if (keys.right && gameState.player.x < canvas.width - gameState.player.width) {
                gameState.player.x += gameState.player.speed;
            }
        };

        const updateBullets = () => {
            // Balles du joueur
            gameState.bullets = gameState.bullets.filter(bullet => {
                bullet.y -= 8;
                return bullet.y > 0;
            });
            
            // Balles des envahisseurs
            gameState.invaderBullets = gameState.invaderBullets.filter(bullet => {
                bullet.y += 3;
                return bullet.y < canvas.height;
            });
        };

        const updateInvaders = () => {
            let changeDirection = false;
            
            // Vérifier les bords
            gameState.invaders.forEach(invader => {
                if (invader.alive) {
                    if (invader.x <= 0 || invader.x >= canvas.width - invader.width) {
                        changeDirection = true;
                    }
                }
            });
            
            if (changeDirection) {
                gameState.invaderDirection *= -1;
                gameState.invaders.forEach(invader => {
                    if (invader.alive) {
                        invader.y += 20; // Descendre
                    }
                });
            }
            
            // Déplacer les envahisseurs
            gameState.invaders.forEach(invader => {
                if (invader.alive) {
                    invader.x += gameState.invaderSpeed * gameState.invaderDirection;
                }
            });
            
            // Tirs aléatoires des envahisseurs
            if (Math.random() < 0.005) {
                const aliveInvaders = gameState.invaders.filter(inv => inv.alive);
                if (aliveInvaders.length > 0) {
                    const shooter = aliveInvaders[Math.floor(Math.random() * aliveInvaders.length)];
                    gameState.invaderBullets.push({
                        x: shooter.x + shooter.width/2,
                        y: shooter.y + shooter.height
                    });
                }
            }
        };

        const checkCollisions = () => {
            // Balles du joueur vs envahisseurs
            gameState.bullets.forEach((bullet, bulletIndex) => {
                gameState.invaders.forEach((invader, invaderIndex) => {
                    if (invader.alive && 
                        bullet.x > invader.x && bullet.x < invader.x + invader.width &&
                        bullet.y > invader.y && bullet.y < invader.y + invader.height) {
                        
                        // Collision détectée
                        invader.alive = false;
                        gameState.bullets.splice(bulletIndex, 1);
                        gameState.score += 10;
                        scoreEl.textContent = gameState.score;
                        this.playBeep(800, 100);
                    }
                });
            });
            
            // Balles des envahisseurs vs joueur
            gameState.invaderBullets.forEach((bullet, bulletIndex) => {
                if (bullet.x > gameState.player.x && bullet.x < gameState.player.x + gameState.player.width &&
                    bullet.y > gameState.player.y && bullet.y < gameState.player.y + gameState.player.height) {
                    
                    // Joueur touché
                    gameState.invaderBullets.splice(bulletIndex, 1);
                    gameState.lives--;
                    livesEl.textContent = gameState.lives;
                    this.playBeep(300, 300);
                    
                    if (gameState.lives <= 0) {
                        gameOver();
                    }
                }
            });
            
            // Vérifier si tous les envahisseurs sont morts
            const aliveInvaders = gameState.invaders.filter(inv => inv.alive);
            if (aliveInvaders.length === 0) {
                nextLevel();
            }
            
            // Vérifier si les envahisseurs atteignent le joueur
            gameState.invaders.forEach(invader => {
                if (invader.alive && invader.y + invader.height >= gameState.player.y) {
                    gameOver();
                }
            });
        };

        const shoot = () => {
            if (gameState.running && !gameState.paused) {
                gameState.bullets.push({
                    x: gameState.player.x + gameState.player.width/2,
                    y: gameState.player.y
                });
                this.playBeep(600, 50);
            }
        };

        const draw = () => {
            // Fond étoilé
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, 'rgba(25, 25, 112, 1)');
            gradient.addColorStop(1, 'rgba(0, 0, 0, 1)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Étoiles
            ctx.fillStyle = 'white';
            for (let i = 0; i < 50; i++) {
                const x = (i * 37) % canvas.width;
                const y = (i * 17) % canvas.height;
                ctx.fillRect(x, y, 1, 1);
            }
            
            drawPlayer();
            drawInvaders();
            drawBullets();
        };

        const gameLoop = () => {
            if (!gameState.running || gameState.paused) return;
            
            updatePlayer();
            updateBullets();
            updateInvaders();
            checkCollisions();
            draw();
            
            requestAnimationFrame(gameLoop);
        };

        const startGame = () => {
            gameState.running = true;
            gameState.paused = false;
            gameState.score = 0;
            gameState.lives = 3;
            gameState.level = 1;
            gameState.bullets = [];
            gameState.invaderBullets = [];
            gameState.player.x = 200;
            
            scoreEl.textContent = '0';
            livesEl.textContent = '3';
            levelEl.textContent = '1';
            
            initInvaders();
            startBtn.style.display = 'none';
            pauseBtn.style.display = 'block';
            
            gameLoop();
        };

        const pauseGame = () => {
            gameState.paused = !gameState.paused;
            if (gameState.paused) {
                pauseBtn.textContent = '▶️ Play';
            } else {
                pauseBtn.textContent = '⏸️ Pause';
                gameLoop();
            }
        };

        const nextLevel = () => {
            gameState.level++;
            gameState.invaderSpeed += 0.5;
            levelEl.textContent = gameState.level;
            initInvaders();
            this.playBeep(1000, 200);
            
            // Message de niveau
            setTimeout(() => {
                alert(`🎉 NIVEAU ${gameState.level} ! 🎉\nLes envahisseurs tchoin deviennent plus agressifs ! 👾💅`);
            }, 100);
        };

        const gameOver = () => {
            gameState.running = false;
            startBtn.style.display = 'block';
            pauseBtn.style.display = 'none';
            startBtn.textContent = '🔄 Rejouer';
            
            this.playBeep(200, 500);
            
            const highScore = localStorage.getItem('spaceInvadersHighScore') || 0;
            if (gameState.score > highScore) {
                localStorage.setItem('spaceInvadersHighScore', gameState.score);
                setTimeout(() => {
                    alert(`🏆 NOUVEAU RECORD GALACTIQUE ! 🏆\nScore: ${gameState.score} points\nTu es officiellement la défenseuse de l'univers tchoin ! 👾💅✨`);
                }, 100);
            } else {
                let message = "";
                if (gameState.score >= 500) {
                    message = `👾💅 COMMANDANTE SUPRÊME ! ${gameState.score} points ! Tu as sauvé la galaxie ! 🌌✨`;
                } else if (gameState.score >= 300) {
                    message = `🚀 PILOTE ÉLITE ! ${gameState.score} points ! L'espace te respecte ! 👑`;
                } else if (gameState.score >= 100) {
                    message = `⭐ GUERRIÈRE PROMETTEUSE ! ${gameState.score} points ! Continue l'entraînement ! 💪`;
                } else {
                    message = `👾 RECRUE SPATIALE ! ${gameState.score} points ! L'univers a besoin de toi ! 🦄💫`;
                }
                setTimeout(() => alert(message), 100);
            }
        };

        // Event listeners
        startBtn.addEventListener('click', startGame);
        pauseBtn.addEventListener('click', pauseGame);

        // Contrôles clavier
        document.addEventListener('keydown', (e) => {
            if (!gameState.running) return;
            
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    keys.left = true;
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    keys.right = true;
                    break;
                case ' ':
                    e.preventDefault();
                    shoot();
                    break;
            }
        });

        document.addEventListener('keyup', (e) => {
            switch(e.key) {
                case 'ArrowLeft':
                    keys.left = false;
                    break;
                case 'ArrowRight':
                    keys.right = false;
                    break;
            }
        });

        // Contrôles tactiles
        container.querySelectorAll('.space-control-btn').forEach(btn => {
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                const action = btn.dataset.action;
                switch(action) {
                    case 'left':
                        keys.left = true;
                        break;
                    case 'right':
                        keys.right = true;
                        break;
                    case 'shoot':
                        shoot();
                        break;
                }
            });

            btn.addEventListener('touchend', (e) => {
                e.preventDefault();
                const action = btn.dataset.action;
                switch(action) {
                    case 'left':
                        keys.left = false;
                        break;
                    case 'right':
                        keys.right = false;
                        break;
                }
            });
        });

        // Styles CSS
        const style = document.createElement('style');
        style.textContent = `
            .space-invaders-game { 
                text-align: center; 
                padding: 1rem; 
                user-select: none;
            }
            .game-stats { 
                display: flex; 
                justify-content: space-around; 
                margin: 1rem 0; 
                font-size: 1.1rem; 
                font-weight: bold;
            }
            #space-canvas { 
                border: 3px solid rgba(255, 105, 180, 0.5); 
                border-radius: 15px; 
                background: black; 
                margin: 1rem 0;
                max-width: 100%;
                height: auto;
            }
            .space-controls { 
                margin: 1rem 0; 
            }
            .space-btn { 
                background: rgba(255, 105, 180, 0.3); 
                border: 2px solid rgba(255, 255, 255, 0.5); 
                color: white; 
                padding: 1rem 2rem; 
                border-radius: 25px; 
                font-size: 1.2rem; 
                cursor: pointer; 
                margin: 0.5rem;
                transition: all 0.3s;
            }
            .space-btn:hover { 
                background: rgba(255, 105, 180, 0.5); 
                transform: scale(1.05);
            }
            .mobile-space-controls { 
                display: flex; 
                justify-content: center;
                gap: 1rem; 
                margin: 1rem auto;
                max-width: 300px;
            }
            .space-control-btn { 
                background: rgba(255, 105, 180, 0.3); 
                border: 2px solid rgba(255, 255, 255, 0.5); 
                color: white; 
                width: 60px; 
                height: 60px; 
                border-radius: 15px; 
                font-size: 1.5rem; 
                cursor: pointer;
                transition: all 0.2s;
                touch-action: manipulation;
            }
            .space-control-btn:hover, .space-control-btn:active { 
                background: rgba(255, 105, 180, 0.6); 
                transform: scale(1.1);
            }
            .space-instructions { 
                margin: 1rem 0; 
                opacity: 0.8; 
                font-size: 0.9rem; 
                max-width: 400px;
                margin-left: auto;
                margin-right: auto;
                line-height: 1.4;
            }
            @media (max-width: 480px) {
                #space-canvas { 
                    width: 100%; 
                    max-width: 350px;
                }
                .game-stats { 
                    font-size: 0.9rem; 
                }
                .space-control-btn { 
                    width: 50px; 
                    height: 50px; 
                    font-size: 1.3rem;
                }
            }
        `;
        document.head.appendChild(style);

        // Dessiner l'état initial
        draw();
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