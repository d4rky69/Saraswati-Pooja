document.addEventListener('DOMContentLoaded', function() {
    const scene = document.querySelector('a-scene');
    const loadingScreen = document.getElementById('loading-screen');
    const audioControl = document.getElementById('audio-control');
    const audioElement = document.getElementById('background-audio');
    const audioIcon = audioControl.querySelector('.material-icons');
    let audioPlaying = false;
    
    // Handle loading
    scene.addEventListener('loaded', function() {
        setTimeout(() => {
            loadingScreen.style.opacity = 0;
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 700);
        }, 1500);
    });
    
    // Audio controls
    audioControl.addEventListener('click', function() {
        if (!audioPlaying) {
            audioElement.play();
            audioIcon.textContent = 'pause';
            audioControl.innerHTML = '<span class="material-icons">pause</span> Pause Mantra';
            audioPlaying = true;
        } else {
            audioElement.pause();
            audioIcon.textContent = 'play_arrow';
            audioControl.innerHTML = '<span class="material-icons">play_arrow</span> Play Mantra';
            audioPlaying = false;
        }
    });
    
    // Make idol model interactive
    scene.addEventListener('loaded', () => {
        const idolModel = document.querySelector('[gltf-model]');
        
        idolModel.addEventListener('click', function(evt) {
            // Create pulse animation
            this.setAttribute('animation__pulse', {
                property: 'scale',
                from: '1 1 1',
                to: '1.1 1.1 1.1',
                dur: 300,
                easing: 'easeOutQuad',
                dir: 'alternate',
                loop: 1
            });
            
            // Play audio if not already playing
            if (!audioPlaying) {
                audioElement.play();
                audioControl.innerHTML = '<span class="material-icons">pause</span> Pause Mantra';
                audioPlaying = true;
            }
        });
    });
    
    // Adjust model position for mobile/desktop
    function adjustForDevice() {
        const idolModel = document.querySelector('[gltf-model]');
        if (window.innerWidth < 768) {
            // Mobile positioning
            idolModel.setAttribute('position', '0 -0.2 -2');
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
    
    // Add ambient particle effect
    scene.addEventListener('loaded', () => {
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('a-entity');
            
            // Random position around the model
            const angle = Math.random() * Math.PI * 2;
            const radius = 2 + Math.random() * 2;
            const x = Math.cos(angle) * radius;
            const y = Math.random() * 3 - 0.5;
            const z = Math.sin(angle) * radius - 3;
            
            particle.setAttribute('position', `${x} ${y} ${z}`);
            particle.setAttribute('geometry', 'primitive: sphere; radius: 0.02');
            particle.setAttribute('material', 'color: #ffcc66; shader: flat; transparent: true; opacity: 0.6');
            
            // Add floating animation
            particle.setAttribute('animation', {
                property: 'position',
                dir: 'alternate',
                dur: 3000 + Math.random() * 5000,
                easing: 'easeInOutSine',
                loop: true,
                to: `${x} ${y + 0.5 + Math.random()} ${z}`
            });
            
            // Add subtle pulsing animation
            particle.setAttribute('animation__pulse', {
                property: 'scale',
                dir: 'alternate',
                dur: 2000 + Math.random() * 3000,
                easing: 'easeInOutSine',
                loop: true,
                from: '1 1 1',
                to: '1.5 1.5 1.5'
            });
            
            scene.appendChild(particle);
        }
    });
});
