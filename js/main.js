document.addEventListener('DOMContentLoaded', function() {
    const scene = document.querySelector('a-scene');
    const loadingScreen = document.getElementById('loading-screen');
    const startAudioButton = document.getElementById('start-audio');
    const audioElement = document.getElementById('background-audio');
    let audioPlaying = false;
    
    // Handle loading
    scene.addEventListener('loaded', function() {
        setTimeout(() => {
            loadingScreen.style.opacity = 0;
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 1000);
    });
    
    // Audio controls
    startAudioButton.addEventListener('click', function() {
        if (!audioPlaying) {
            audioElement.play();
            startAudioButton.textContent = 'Pause Audio';
            audioPlaying = true;
        } else {
            audioElement.pause();
            startAudioButton.textContent = 'Play Audio';
            audioPlaying = false;
        }
    });
    
    // Make idol model interactive
    scene.addEventListener('loaded', () => {
        const idolModel = document.querySelector('[gltf-model]');
        
        idolModel.addEventListener('click', function(evt) {
            // Toggle animation or other effects when clicked
            const currentScale = this.getAttribute('scale');
            if (currentScale.x === 1) {
                this.setAttribute('scale', '1.2 1.2 1.2');
                setTimeout(() => {
                    this.setAttribute('scale', '1 1 1');
                }, 300);
            }
            
            // Play audio if not already playing
            if (!audioPlaying) {
                audioElement.play();
                startAudioButton.textContent = 'Pause Audio';
                audioPlaying = true;
            }
        });
    });
    
    // Adjust model position for mobile/desktop
    function adjustForDevice() {
        const idolModel = document.querySelector('[gltf-model]');
        if (window.innerWidth < 768) {
            // Mobile positioning
            idolModel.setAttribute('position', '0 0 -2');
        } else {
            // Desktop positioning
            idolModel.setAttribute('position', '0 0 -3');
        }
    }
    
    // Run once and add event listener for resize
    window.addEventListener('resize', adjustForDevice);
    scene.addEventListener('loaded', adjustForDevice);
    
    // Prevent scrolling on mobile
    document.body.addEventListener('touchmove', function(e) {
        e.preventDefault();
    }, { passive: false });
});
