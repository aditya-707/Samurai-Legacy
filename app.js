document.addEventListener("DOMContentLoaded", () => {
    // Initialize loading screen
    const loading = document.getElementById("loading");

    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // Initial loading animation
    const contentTimeline = gsap.timeline({
        onComplete: function () {
            // Hide loading screen after initial animations
            gsap.to("#loading", {
                opacity: 0,
                duration: 1,
                onComplete: function () {
                    document.getElementById("loading").style.display = "none";
                },
            });
        },
    });

    // Header animations
    contentTimeline
        .to("#content", { opacity: 1, duration: 1 })
        .to("h1", { opacity: 1, y: 0, duration: 1 }, "-=0.5")
        .to(".hero-subheading", { opacity: 1, y: 0, duration: 1 }, "-=0.7")
        .to("#model-interaction-hint", { opacity: 0.7, duration: 1 }, "-=0.5");

    // Fallback loading screen hiding (if GSAP fails)
    window.addEventListener("load", () => {
        setTimeout(() => {
            if (loading && loading.style.opacity !== "0") {
                loading.style.opacity = "0";
                setTimeout(() => {
                    loading.style.display = "none";
                }, 500);
            }
        }, 1500);
    });

    // Progress bar on scroll
    const progressBar = document.getElementById("progress-bar");
    window.addEventListener("scroll", () => {
        const totalHeight = document.body.scrollHeight - window.innerHeight;
        const progress = (window.pageYOffset / totalHeight) * 100;
        if (progressBar) {
            progressBar.style.width = progress + "%";
        }
    });

    // Header background change on scroll
    const header = document.querySelector("header");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 100) {
            // Using 100 from paste-2.txt
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });

    // Mobile menu toggle
    const menuToggle = document.querySelector(".menu-toggle");
    const mobileMenu = document.querySelector(".mobile-menu");

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener("click", () => {
            menuToggle.classList.toggle("active");
            mobileMenu.classList.toggle("active");
            document.body.classList.toggle("no-scroll");
            header.classList.toggle("bg");
        });

        // Close mobile menu when clicking a link
        const mobileLinks = mobileMenu.querySelectorAll("a");
        mobileLinks.forEach((link) => {
            link.addEventListener("click", () => {
                menuToggle.classList.remove("active");
                mobileMenu.classList.remove("active");
                document.body.classList.remove("no-scroll");
            });
        });
    }

    // Setup section animations
    const sections = document.querySelectorAll(".section");
    gsap.utils.toArray(".section").forEach((section) => {
        gsap.to(section, {
            scrollTrigger: {
                trigger: section,
                start: "top 80%",
                toggleClass: "active",
                once: true,
            },
            opacity: 1,
            y: 0,
            duration: 1,
        });
    });

    // Timeline items animations
    const timelineItems = document.querySelectorAll(".timeline-item");
    gsap.utils.toArray(".timeline-item").forEach((item, i) => {
        gsap.to(item, {
            scrollTrigger: {
                trigger: item,
                start: "top 85%",
                toggleClass: "active",
                once: true,
            },
            opacity: 1,
            x: 0,
            duration: 0.8,
            delay: i * 0.15,
        });
    });

    // Quote animations
    gsap.utils.toArray(".quote").forEach((quote) => {
        gsap.to(quote, {
            scrollTrigger: {
                trigger: quote,
                start: "top 80%",
                once: true,
            },
            opacity: 1,
            scale: 1,
            duration: 1,
        });
    });

    // Fallback Intersection Observer for fade-in animations (if GSAP fails)
    const appearOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -100px 0px",
    };

    const appearOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("active");
            observer.unobserve(entry.target);
        });
    }, appearOptions);

    sections.forEach((section) => {
        appearOnScroll.observe(section);
    });

    timelineItems.forEach((item) => {
        appearOnScroll.observe(item);
    });

    function setActiveNav() {
        const scrollPosition = window.scrollY + window.innerHeight / 3;
    }

    window.addEventListener("scroll", setActiveNav);

    // Click event for menu links
    document.querySelectorAll(".menu-item, .mobile-menu a").forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const targetId = link.getAttribute("href");
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                gsap.to(window, {
                    duration: 1,
                    scrollTo: { y: targetElement, offsetY: 50 },
                    ease: "power2.inOut",
                });
            }
        });
    });

    // Smooth scrolling for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute("href"));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80, // Adjust for header height
                    behavior: "smooth",
                });
            }
        });
    });

    // Call setActiveNav initially to set the first dot as active
    setActiveNav();

    // Music player functionality
    const musicIcon =
        document.querySelector(".music-icon-container") ||
        document.querySelector(".music-icon");
    let audio;

    // Check if there's dedicated audio element
    const audioElement = document.getElementById("backgroundMusic");
    if (audioElement) {
        audio = audioElement;
        audio.volume = 0.5;
    } else {
        audio = new Audio("path/to/your-ambient-music.mp3"); // Update with actual path
        audio.loop = true;
    }

    let isPlaying = false;

    if (musicIcon) {
        musicIcon.addEventListener("click", () => {
            if (isPlaying) {
                audio.pause();
                if (musicIcon.classList.contains("music-icon")) {
                    musicIcon.style.backgroundColor = "var(--primary-color)";
                }
                musicIcon.classList.remove("playing");
            } else {
                audio
                    .play()
                    .catch((e) => console.log("Audio playback error:", e));
                if (musicIcon.classList.contains("music-icon")) {
                    musicIcon.style.backgroundColor = "var(--accent-red)";
                }
                musicIcon.classList.add("playing");
            }
            isPlaying = !isPlaying;
        });
    }

    // Alternatively, call toggleAudio function if it exists in the page
    if (typeof toggleAudio === "function") {
        const musicToggle = document.querySelector(".music-icon");
        if (musicToggle) {
            musicToggle.addEventListener("click", toggleAudio);
        }
    }

    // Parallax effect for Japanese characters
    const japaneseChars = document.querySelectorAll(".japanese-character");
    window.addEventListener("mousemove", (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;

        japaneseChars.forEach((char) => {
            const offsetX = (mouseX - 0.5) * 20;
            const offsetY = (mouseY - 0.5) * 20;
            char.style.transform = `translate(${offsetX}px, ${offsetY}px) rotate(-5deg)`;
        });
    });

    // Interactive image hover effect
    const imageContent = document.querySelectorAll(".image-content");
    imageContent.forEach((img) => {
        img.addEventListener("mousemove", (e) => {
            const rect = img.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const percentX = (x - centerX) / centerX;
            const percentY = (y - centerY) / centerY;

            img.style.transform = `perspective(1000px) rotateY(${
                percentX * 5
            }deg) rotateX(${-percentY * 5}deg)`;
        });

        img.addEventListener("mouseleave", () => {
            img.style.transform =
                "perspective(1000px) rotateY(0deg) rotateX(0deg)";
        });
    });

    // Scroll down button
    const scrollDown = document.querySelector(".scroll-down");
    if (scrollDown) {
        scrollDown.addEventListener("click", () => {
            const firstSection = document.querySelector("#content .section");
            if (firstSection) {
                window.scrollTo({
                    top: firstSection.offsetTop - 100,
                    behavior: "smooth",
                });
            }
        });
    }

    // Canvas background effect
    initCanvas();
});

// Canvas initialization function
function initCanvas() {
    const canvasContainer = document.getElementById("canvas-container");
    if (!canvasContainer) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvasContainer.appendChild(canvas);

    // Set canvas size
    function resizeCanvas() {
        canvas.width = canvasContainer.offsetWidth;
        canvas.height = canvasContainer.offsetHeight;
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Particles setup
    const particlesArray = [];
    const numberOfParticles = 100;
    const colors = [
        "rgba(224, 182, 120, 0.3)",
        "rgba(160, 107, 85, 0.2)",
        "rgba(249, 208, 150, 0.2)",
        "rgba(176, 72, 64, 0.1)",
    ];

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 5 + 1;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.opacity = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Bounce off edges
            if (this.x > canvas.width || this.x < 0) {
                this.speedX = -this.speedX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.speedY = -this.speedY;
            }
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.opacity;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }

    // Create particles
    function init() {
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }

    init();

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();

            // Connect particles with lines
            connectParticles(particlesArray[i], particlesArray);
        }
        requestAnimationFrame(animate);
    }

    animate();

    // Interactive effect - particles follow mouse
    const mouse = {
        x: null,
        y: null,
        radius: 150,
    };

    canvasContainer.addEventListener("mousemove", function (event) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = event.clientX - rect.left;
        mouse.y = event.clientY - rect.top;
    });

    canvasContainer.addEventListener("mouseleave", function () {
        mouse.x = undefined;
        mouse.y = undefined;
    });
}

// 3D Scene setup
function init3DScene() {
    // Create the scene with vintage-inspired background
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x121212); // Very dark background

    // Camera with wider field of view for dramatic perspective
    const camera = new THREE.PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(0, 1.5, 6);

    // Create the renderer with vintage tone mapping
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: "high-performance",
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.9; // Slightly darker for vintage look
    renderer.outputEncoding = THREE.sRGBEncoding;

    // Add the renderer to the canvas container
    const canvasContainer = document.getElementById("canvas-container");
    if (canvasContainer) {
        canvasContainer.appendChild(renderer.domElement);
    }

    // Setup orbit controls with smoother movement
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 1, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 3;
    controls.maxDistance = 15;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;

    // Disable auto-rotation when user interacts
    controls.addEventListener("start", function () {
        controls.autoRotate = false;
    });

    // Re-enable auto-rotation after user inactivity (5 seconds)
    let autoRotateTimeout;
    controls.addEventListener("end", function () {
        clearTimeout(autoRotateTimeout);
        autoRotateTimeout = setTimeout(function () {
            controls.autoRotate = true;
        }, 5000);
    });

    // Atmospheric lighting setup for vintage aesthetic
    // Ambient light with warm vintage tone
    const ambientLight = new THREE.AmbientLight(0xffede0, 0.5);
    scene.add(ambientLight);

    // Main directional light with warm color
    const mainLight = new THREE.DirectionalLight(0xffe6c0, 0.7);
    mainLight.position.set(3, 5, 5);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 1024;
    mainLight.shadow.mapSize.height = 1024;
    mainLight.shadow.camera.near = 0.5;
    mainLight.shadow.camera.far = 50;
    mainLight.shadow.camera.left = -10;
    mainLight.shadow.camera.right = 10;
    mainLight.shadow.camera.top = 10;
    mainLight.shadow.camera.bottom = -10;
    mainLight.shadow.bias = -0.001;
    mainLight.shadow.radius = 2;
    scene.add(mainLight);

    // Soft fill light with cooler tone for contrast
    const fillLight = new THREE.DirectionalLight(0xe6f0ff, 0.3);
    fillLight.position.set(-3, 2, 3);
    scene.add(fillLight);

    // Subtle rim light
    const rimLight = new THREE.DirectionalLight(0xffd1b3, 0.2);
    rimLight.position.set(0, 3, -3);
    scene.add(rimLight);

    // Add animated point lights for dramatic effect
    const redLight = new THREE.PointLight(0xff3300, 0.5, 10);
    redLight.position.set(3, 1, 3);
    scene.add(redLight);

    const blueLight = new THREE.PointLight(0x0066ff, 0.5, 10);
    blueLight.position.set(-3, 1, -3);
    scene.add(blueLight);

    // Add fog for atmosphere
    scene.fog = new THREE.FogExp2(0x0c0c0e, 0.03);

    // Add subtle environmental lighting
    const environmentLoader = new THREE.CubeTextureLoader();
    environmentLoader.setPath(
        "https://threejs.org/examples/textures/cube/pisa/"
    );
    environmentLoader.load(
        ["px.png", "nx.png", "py.png", "ny.png", "pz.png", "nz.png"],
        function (texture) {
            scene.environment = texture;
            scene.environment.intensity = 0.2; // Very subtle environment reflection
        }
    );

    // Track model loading status
    let modelsLoaded = 0;
    const totalModels = 2;

    function modelLoaded() {
        modelsLoaded++;
        if (modelsLoaded === totalModels) {
            console.log("All models loaded successfully");
        }
    }

    // Model loader
    const loader = new THREE.GLTFLoader();

    // Load the samurai model
    loader.load(
        "assets/samurai.glb",
        function (gltf) {
            const model = gltf.scene;
            model.position.set(0, 0, 0); // Position on the right
            model.scale.set(1, 1, 1);

            scene.add(model);
            console.log("Samurai 2 loaded successfully");
            modelLoaded();
        },
        undefined,
        function (error) {
            console.error("Error loading samurai2.glb:", error);
            modelLoaded();
        }
    );

    // Create particles for atmosphere
    function createParticles() {
        const particleGeometry = new THREE.BufferGeometry();
        const particleCount = 500;

        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        const color = new THREE.Color();

        for (let i = 0; i < particleCount; i++) {
            // Position
            const x = (Math.random() - 0.5) * 20;
            const y = (Math.random() - 0.5) * 10;
            const z = (Math.random() - 0.5) * 20;

            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;

            // Color - gold/amber tones
            const r = 0.8 + Math.random() * 0.2; // 0.8-1.0 (golden)
            const g = 0.5 + Math.random() * 0.3; // 0.5-0.8 (amber)
            const b = 0.2 + Math.random() * 0.2; // 0.2-0.4 (deep amber)

            color.setRGB(r, g, b);

            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }

        particleGeometry.setAttribute(
            "position",
            new THREE.BufferAttribute(positions, 3)
        );
        particleGeometry.setAttribute(
            "color",
            new THREE.BufferAttribute(colors, 3)
        );

        const particleMaterial = new THREE.PointsMaterial({
            size: 0.05,
            vertexColors: true,
            transparent: true,
            opacity: 0.4,
            blending: THREE.AdditiveBlending,
        });

        const particles = new THREE.Points(particleGeometry, particleMaterial);
        scene.add(particles);

        return particles;
    }

    const particles = createParticles();
    const clock = new THREE.Clock();

    // Handle window resize
    window.addEventListener("resize", function () {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Animation loop with subtle camera movement for cinematic effect
    function animate() {
        requestAnimationFrame(animate);

        const elapsedTime = clock.getElapsedTime();

        // Very subtle camera movement
        camera.position.y = 1.5 + Math.sin(elapsedTime * 0.2) * 0.1;

        // Animate red and blue point lights for dramatic effect
        redLight.position.x = 3 * Math.sin(elapsedTime * 0.3);
        redLight.position.z = 3 * Math.cos(elapsedTime * 0.3);
        redLight.intensity = 0.3 + Math.sin(elapsedTime) * 0.2;

        blueLight.position.x = -3 * Math.sin(elapsedTime * 0.4);
        blueLight.position.z = -3 * Math.cos(elapsedTime * 0.4);
        blueLight.intensity = 0.3 + Math.cos(elapsedTime) * 0.2;

        // Rotate particles
        particles.rotation.y = elapsedTime * 0.05;

        controls.update();
        renderer.render(scene, camera);
    }

    // Start animation loop
    animate();
}

// Toggle audio function as defined in paste-2.txt
function toggleAudio() {
    const audio = document.getElementById("backgroundMusic");
    const musicIcon = document.querySelector(".music-icon");

    if (audio.paused) {
        audio.play();
        musicIcon.style.backgroundColor = "var(--accent-red)";
        musicIcon.classList.add("playing");
    } else {
        audio.pause();
        musicIcon.style.backgroundColor = "var(--primary-color)";
        musicIcon.classList.remove("playing");
    }
}

// Initialize 3D scene if THREE.js is available
if (
    typeof THREE !== "undefined" &&
    document.getElementById("canvas-container")
) {
    // Use setTimeout to ensure DOM is fully loaded
    setTimeout(() => {
        init3DScene();
    }, 100);
}

// Initialize audio volume
window.addEventListener("load", function () {
    const backgroundMusic = document.getElementById("backgroundMusic");
    if (backgroundMusic) {
        backgroundMusic.volume = 0.5;
    }
});

// Custom Cursor
const cursor = document.querySelector(".cursor");
const menuItems = document.querySelectorAll(".menu-item");

// Update cursor position on mouse move, accounting for scroll
document.addEventListener("mousemove", (e) => {
    // Use clientX/Y for viewport coordinates rather than pageX/Y
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
});

// Enlarge cursor when hovering over menu items
menuItems.forEach((item) => {
    item.addEventListener("mouseenter", () => {
        cursor.style.transform = "translate(-50%, -50%) scale(4)";
    });

    item.addEventListener("mouseleave", () => {
        cursor.style.transform = "translate(-50%, -50%) scale(1)";
    });
});

console.log("Made by aditya-707");
