document.addEventListener('DOMContentLoaded', function() {
    // Core elements
    const scene = document.querySelector('a-scene');
    const loadingScreen = document.getElementById('loading-screen');
    const loadingProgress = document.getElementById('loading-progress');
    const startAudioButton = document.getElementById('start-audio');
    const volumeSlider = document.getElementById('volume-slider');
    const audioElement = document.getElementById('background-audio');
    const clickSound = document.getElementById('click-sound');
    const idol = document.getElementById('idol');
    const particles = document.getElementById('particles');
    
    // State variables
    let audioPlaying = false;
    let modelLoaded = false;
    let audioLoaded = false;
    
    // Initialize
    initApp();
    
    function initApp() {
        setupLoading();
        setupAudio();
        setupModelInteraction();
        setupDeviceSpecificAdjustments();
    }
    
    // Loading management
    function setupLoading() {
        // Track asset loading
        const assetItems = document.querySelectorAll('a-asset-item, img, audio');
        let loadedItems = 0;
        
        assetItems.forEach(item => {
            if (item.tagName === 'AUDIO') {
                item.addEventListener('canplaythrough', itemLoaded, { once: true });
            } else {
                item.addEventListener('loaded', itemLoaded, { once: true });
            }
        });
        
        function itemLoaded() {
            loadedItems++;
            const progress = Math.floor((loadedItems / assetItems.length) * 100);
            loadingProgress.textContent = `${progress}%`;
        }
        
        // Scene loaded handler
        scene.addEventListener('loaded', function() {
            console.log("Scene loaded successfully");
            setTimeout(() => {
                loadingScreen.style.opacity = 0;
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 800);
                showNotification("Experience loaded successfully. Tap the Saraswati idol to interact!");
            }, 1000);
        });
        
        // Handle loading errors
        scene.addEventListener('model-error', function(evt) {
            console.error("Error loading model:", evt.detail);
            showError("Failed to load 3D model. Please refresh the page.");
        });
    }
    
    // Audio setup and controls
    function setupAudio() {
        // Set initial volume
        audioElement.volume = volumeSlider.value;
        
        // Volume control
        volumeSlider.addEventListener('input', function() {
            audioElement.volume = this.value;
        });
        
        // Play/Pause button
        startAudioButton.addEventListener('click', function() {
            toggleAudio();
        });
        
        // Audio loaded check
        audioElement.addEventListener('canplaythrough', function() {
            audioLoaded = true;
            console.log("Audio loaded successfully");
        });
        
        // Audio error handling
        audioElement.addEventListener('error', function(e) {
            console.error("Audio error:", e);
            showError("Failed to load audio. The experience will continue without sound.");
            startAudioButton.disabled = true;
        });
    }
    
    // Toggle audio playback
    function toggleAudio() {
        try {
            if (!audioPlaying) {
                const playPromise = audioElement.play();
                
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        audioPlaying = true;
                        startAudioButton.textContent = 'Pause Audio';
                        startAudioButton.classList.add('active');
                    }).catch(error => {
                        console.error("Audio play error:", error);
                        showError("Couldn't play audio. Try clicking the play button again.");
                    });
                }
            } else {
                audioElement.pause();
                startAudioButton.textContent = 'Play Audio';
                startAudioButton.classList.remove('active');
                audioPlaying = false;
            }
        } catch(err) {
            console.error("Audio toggle error:", err);
        }
    }
    
    // Model interaction setup
    function setupModelInteraction() {
        scene.addEventListener('loaded', () => {
            if (idol) {
                modelLoaded = true;
                console.log("Model loaded and ready for interaction");
                
                idol.addEventListener('click', function(evt) {
                    // Play click sound effect
                    try {
                        if (clickSound) {
                            clickSound.currentTime = 0;
                            clickSound.play().catch(err => console.warn("Click sound play error:", err));
                        }
                    } catch(e) {
                        console.warn("Click sound error:", e);
                    }
                    
                    // Activate particle effect
                    if (particles) {
                        particles.setAttribute('particle-system', 'enabled', true);
                        setTimeout(() => {
                            particles.setAttribute('particle-system', 'enabled', false);
                        }, 2000);
                    }
                    
                    // Try to play audio if not playing
                    if (!audioPlaying && audioLoaded) {
                        toggleAudio();
                    }
                });
            } else {
                console.error("Model element not found");
                showError("3D model not found. Please refresh the page.");
            }
        });
    }
    
    // Device-specific adjustments
    function setupDeviceSpecificAdjustments() {
        function adjustForDevice() {
            if (idol) {
                if (window.innerWidth < 768) {
                    // Mobile positioning
                    idol.setAttribute('position', '0 0 -2.2');
                    if (particles) {
                        particles.setAttribute('position', '0 0 -2.2');
                    }
                } else {
                    // Desktop positioning
                    idol.setAttribute('position', '0 0 -3');
                    if (particles) {
                        particles.setAttribute('position', '0 0 -3');
                    }
                }
            }
        }
        
        // Run once and add event listener for resize
        window.addEventListener('resize', adjustForDevice);
        
        // Wait for scene to be loaded before adjusting
        scene.addEventListener('loaded', adjustForDevice);
    }
    
    // Helper functions
    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);
        errorDiv.style.display = 'block';
        
        setTimeout(() => {
            errorDiv.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(errorDiv);
            }, 500);
        }, 5000);
    }
    
    function showNotification(message) {
        const notifDiv = document.createElement('div');
        notifDiv.className = 'notification';
        notifDiv.textContent = message;
        document.body.appendChild(notifDiv);
        notifDiv.style.display = 'block';
        
        setTimeout(() => {
            notifDiv.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(notifDiv);
            }, 500);
        }, 4000);
    }
    
    // Enable default touch behavior for scrolling/zooming but still allow A-Frame interactions
    document.addEventListener('touchmove', function(e) {
        // Only prevent default when interacting with A-Frame elements
        if (e.target.closest('a-scene')) {
            // Let A-Frame handle its own touch events
            return;
        }
        // Otherwise allow default behavior
    }, { passive: true });
});
