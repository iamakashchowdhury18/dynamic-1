/* ==========================================================================
   DYNAMIC OVERSEAS SERVICES - PREMIUM JS APPLICATION
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  /* ==========================================================================
     1. LOADER & PRELOADER SYSTEM
     ========================================================================== */
  const preloader = document.getElementById('preloader');
  const loaderProgress = document.getElementById('loader-progress');
  
  if (preloader) {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          preloader.style.opacity = '0';
          preloader.style.visibility = 'hidden';
        }, 300);
      }
      loaderProgress.style.width = `${progress}%`;
    }, 50);
  }

  /* ==========================================================================
     2. NAVIGATION & THEME SYSTEM
     ========================================================================== */
  const header = document.getElementById('main-header');
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  
  // Sticky Navbar on Scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile Menu Toggle
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const icon = menuToggle.querySelector('i');
      if (navMenu.classList.contains('active')) {
        icon.setAttribute('data-lucide', 'x');
      } else {
        icon.setAttribute('data-lucide', 'menu');
      }
      window.lucide.createIcons();
    });

    // Close menu when link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const icon = menuToggle.querySelector('i');
        icon.setAttribute('data-lucide', 'menu');
        window.lucide.createIcons();
      });
    });
  }

  // Theme Toggling (Light / Dark Mode)
  const savedTheme = localStorage.getItem('theme') || 'dark'; // Default to dark for premium look
  document.body.setAttribute('data-theme', savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.body.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.body.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }

  /* ==========================================================================
     3. HERO SPACE PARTICLES BACKGROUND
     ========================================================================== */
  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = 70;

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.8 + 0.5;
        this.speedX = Math.random() * 0.3 - 0.15;
        this.speedY = Math.random() * 0.3 - 0.15;
        this.alpha = Math.random() * 0.6 + 0.2;
        this.pulseSpeed = Math.random() * 0.02 + 0.005;
        this.pulseDir = Math.random() > 0.5 ? 1 : -1;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Pulse opacity
        this.alpha += this.pulseSpeed * this.pulseDir;
        if (this.alpha > 0.95 || this.alpha < 0.15) {
          this.pulseDir *= -1;
        }

        // Boundary wrap
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
          this.reset();
        }
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = '#D4AF37'; // Luxury Gold particles
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const animateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animateParticles);
    };
    animateParticles();
  }

  /* ==========================================================================
     4. INTERACTIVE 3D ROTATING GLOBE (THREE.JS)
     ========================================================================== */
  const globeCanvas = document.getElementById('globe-canvas');
  if (globeCanvas && window.THREE) {
    const THREE = window.THREE;
    
    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera setup
    const width = globeCanvas.clientWidth;
    const height = globeCanvas.clientHeight;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 12;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ canvas: globeCanvas, alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Groups
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Geometry & Materials
    // 1. Earth Core
    const earthGeo = new THREE.SphereGeometry(3.8, 32, 32);
    const earthMat = new THREE.MeshBasicMaterial({
      color: 0x0B1329,
      transparent: true,
      opacity: 0.7
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    globeGroup.add(earthMesh);

    // 2. Wireframe Outline Grid
    const wireframeGeo = new THREE.SphereGeometry(3.85, 24, 24);
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0xD4AF37,
      wireframe: true,
      transparent: true,
      opacity: 0.15
    });
    const wireframeMesh = new THREE.Mesh(wireframeGeo, wireframeMat);
    globeGroup.add(wireframeMesh);

    // 3. Dot Grid (High-Tech Matrix Effect)
    const pointsCount = 800;
    const pointsGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(pointsCount * 3);

    for (let i = 0; i < pointsCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 3.9; // Slightly larger than core

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }

    pointsGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const pointsMat = new THREE.PointsMaterial({
      color: 0xD4AF37,
      size: 0.04,
      transparent: true,
      opacity: 0.6
    });
    const points = new THREE.Points(pointsGeo, pointsMat);
    globeGroup.add(points);

    // Coordinate translation helper (Lat/Long to 3D Cartesian coordinates)
    const latLongToVector3 = (lat, lon, radius) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      const x = -(radius * Math.sin(phi) * Math.sin(theta));
      const y = radius * Math.cos(phi);
      const z = radius * Math.sin(phi) * Math.cos(theta);
      return new THREE.Vector3(x, y, z);
    };

    // Locations Database
    const locations = [
      { name: 'Mumbai', lat: 19.0760, lon: 72.8777, isHub: true },
      { name: 'Frankfurt', lat: 50.1109, lon: 8.6821, isHub: false },
      { name: 'Dubai', lat: 25.2048, lon: 55.2708, isHub: false },
      { name: 'London', lat: 51.5074, lon: -0.1278, isHub: false },
      { name: 'Toronto', lat: 43.6532, lon: -79.3832, isHub: false },
      { name: 'Sydney', lat: -33.8688, lon: 151.2093, isHub: false }
    ];

    const pins = [];
    const radius = 3.88;

    locations.forEach(loc => {
      const vec = latLongToVector3(loc.lat, loc.lon, radius);
      
      // Pin Sphere
      const pinGeo = new THREE.SphereGeometry(loc.isHub ? 0.08 : 0.06, 16, 16);
      const pinMat = new THREE.MeshBasicMaterial({
        color: loc.isHub ? 0x10B981 : 0xD4AF37,
        transparent: true,
        opacity: 0.9
      });
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      pinMesh.position.copy(vec);
      globeGroup.add(pinMesh);
      pins.push({ mesh: pinMesh, isHub: loc.isHub });

      // Add Arcs from Mumbai (Hub) to other Destinations
      if (!loc.isHub) {
        const mumbaiVec = latLongToVector3(19.0760, 72.8777, radius);
        
        // Midpoint and raise to make a nice curved arc
        const midVec = new THREE.Vector3().addVectors(mumbaiVec, vec).multiplyScalar(0.5);
        const dist = mumbaiVec.distanceTo(vec);
        midVec.normalize().multiplyScalar(radius + dist * 0.3); // Raise the arc

        // Bezier Curve
        const curve = new THREE.QuadraticBezierCurve3(mumbaiVec, midVec, vec);
        const curvePoints = curve.getPoints(40);
        const curveGeo = new THREE.BufferGeometry().setFromPoints(curvePoints);
        
        const curveMat = new THREE.LineBasicMaterial({
          color: 0xD4AF37,
          transparent: true,
          opacity: 0.45
        });
        
        const line = new THREE.Line(curveGeo, curveMat);
        globeGroup.add(line);
      }
    });

    // Handle Manual Rotation (Drag interaction)
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    globeCanvas.addEventListener('mousedown', (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    globeCanvas.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const deltaMove = {
        x: e.clientX - previousMousePosition.x,
        y: e.clientY - previousMousePosition.y
      };

      globeGroup.rotation.y += deltaMove.x * 0.005;
      globeGroup.rotation.x += deltaMove.y * 0.005;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    // Touch Support for Mobile
    globeCanvas.addEventListener('touchstart', (e) => {
      isDragging = true;
      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });

    globeCanvas.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const deltaMove = {
        x: e.touches[0].clientX - previousMousePosition.x,
        y: e.touches[0].clientY - previousMousePosition.y
      };

      globeGroup.rotation.y += deltaMove.x * 0.005;
      globeGroup.rotation.x += deltaMove.y * 0.005;

      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    });

    // Animation Loop
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Auto-rotation when not interacting
      if (!isDragging) {
        globeGroup.rotation.y += 0.0015;
      }

      // Pulsing pins animation
      time += 0.05;
      pins.forEach(p => {
        const scale = 1 + Math.sin(time + (p.isHub ? 1 : 2)) * 0.25;
        p.mesh.scale.set(scale, scale, scale);
      });

      renderer.render(scene, camera);
    };
    animate();

    // Responsiveness resize observer
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        const w = entry.contentRect.width;
        const h = entry.contentRect.height;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    });
    resizeObserver.observe(globeCanvas.parentElement);
  }

  /* ==========================================================================
     5. STATS ANIMATED COUNTERS
     ========================================================================== */
  const statNumbers = document.querySelectorAll('.stat-num');
  
  if (statNumbers.length > 0) {
    const startCounter = (el) => {
      const target = parseInt(el.getAttribute('data-target'));
      let current = 0;
      const duration = 2000; // 2 seconds
      const increment = target / (duration / 30); // update every 30ms

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        
        // Add suffix to match targets
        if (target === 5000 || target === 2000) {
          el.textContent = `${Math.floor(current).toLocaleString()}+`;
        } else if (target === 30) {
          el.textContent = `${Math.floor(current)}+`;
        } else if (target === 98) {
          el.textContent = `${Math.floor(current)}%`;
        } else {
          el.textContent = Math.floor(current);
        }
      }, 30);
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(num => counterObserver.observe(num));
  }

  /* ==========================================================================
     6. DESTINATIONS TABS SYSTEM
     ========================================================================== */
  const tabBtns = document.querySelectorAll('.destinations-tab-btn');
  const tabPanels = document.querySelectorAll('.destinations-content');

  if (tabBtns.length > 0) {
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Deactivate all
        tabBtns.forEach(b => b.classList.remove('active'));
        tabPanels.forEach(p => p.classList.remove('active'));
        
        // Activate current
        btn.classList.add('active');
        const targetTab = btn.getAttribute('data-tab');
        const targetPanel = document.getElementById(`tab-${targetTab}`);
        if (targetPanel) {
          targetPanel.classList.add('active');
        }
      });
    });
  }

  /* ==========================================================================
     7. SCROLL-LINKED TIMELINE PROCESS
     ========================================================================== */
  const timelineSteps = document.querySelectorAll('.process-step');
  const progressBar = document.getElementById('timeline-progress-bar');

  if (timelineSteps.length > 0 && progressBar) {
    const updateTimeline = () => {
      const scrollPos = window.scrollY + window.innerHeight * 0.6;
      let activeIndex = -1;

      timelineSteps.forEach((step, idx) => {
        const stepTop = step.offsetTop;
        if (scrollPos >= stepTop) {
          step.classList.add('active');
          activeIndex = idx;
        } else {
          step.classList.remove('active');
        }
      });

      // Calculate progress percentage
      if (activeIndex >= 0) {
        const totalSteps = timelineSteps.length;
        const progressPercent = (activeIndex / (totalSteps - 1)) * 100;
        progressBar.style.height = `${progressPercent}%`;
      } else {
        progressBar.style.height = '0%';
      }
    };

    window.addEventListener('scroll', updateTimeline);
    updateTimeline(); // run once on load
  }

  /* ==========================================================================
     8. TESTIMONIALS SLIDER (CAROUSEL)
     ========================================================================== */
  const track = document.getElementById('testimonial-track');
  const slides = Array.from(track ? track.children : []);
  const prevBtn = document.getElementById('prev-slide');
  const nextBtn = document.getElementById('next-slide');
  const dotsContainer = document.getElementById('carousel-dots-container');

  if (track && slides.length > 0) {
    let currentSlideIndex = 0;

    // Create dots
    slides.forEach((_, idx) => {
      const dot = document.createElement('div');
      dot.classList.add('carousel-dot');
      if (idx === 0) dot.classList.add('active');
      dot.addEventListener('click', () => moveToSlide(idx));
      dotsContainer.appendChild(dot);
    });

    const dots = Array.from(dotsContainer.children);

    const updateSlider = () => {
      track.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentSlideIndex);
      });
    };

    const moveToSlide = (index) => {
      currentSlideIndex = index;
      updateSlider();
    };

    nextBtn.addEventListener('click', () => {
      currentSlideIndex = (currentSlideIndex + 1) % slides.length;
      updateSlider();
    });

    prevBtn.addEventListener('click', () => {
      currentSlideIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
      updateSlider();
    });

    // Auto slide
    let autoSlide = setInterval(() => {
      currentSlideIndex = (currentSlideIndex + 1) % slides.length;
      updateSlider();
    }, 7000);

    // Pause on hover
    const carouselContainer = document.querySelector('.carousel-outer');
    carouselContainer.addEventListener('mouseenter', () => clearInterval(autoSlide));
    carouselContainer.addEventListener('mouseleave', () => {
      autoSlide = setInterval(() => {
        currentSlideIndex = (currentSlideIndex + 1) % slides.length;
        updateSlider();
      }, 7000);
    });
  }

  /* ==========================================================================
     9. FAQ ACCORDION SYSTEM
     ========================================================================== */
  const faqItems = document.querySelectorAll('.faq-item');

  if (faqItems.length > 0) {
    faqItems.forEach(item => {
      const headerBtn = item.querySelector('.faq-header-btn');
      const content = item.querySelector('.faq-content');

      headerBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Collapse all others
        faqItems.forEach(i => {
          i.classList.remove('active');
          i.querySelector('.faq-content').style.maxHeight = null;
        });

        // Toggle current
        if (!isActive) {
          item.classList.add('active');
          content.style.maxHeight = `${content.scrollHeight}px`;
        }
      });
    });
  }

  /* ==========================================================================
     10. INTERACTIVE LEAD PORTAL SYSTEM
     ========================================================================== */
  const leadTabBtns = document.querySelectorAll('.lead-tab-btn');
  const leadFormContents = document.querySelectorAll('.lead-form-content');

  // Lead tab toggle
  if (leadTabBtns.length > 0) {
    leadTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        leadTabBtns.forEach(b => b.classList.remove('active'));
        leadFormContents.forEach(c => c.classList.remove('active'));

        btn.classList.add('active');
        const targetFormId = `lead-form-${btn.getAttribute('data-lead-tab')}`;
        const targetForm = document.getElementById(targetFormId);
        if (targetForm) {
          targetForm.classList.add('active');
        }
      });
    });
  }

  // Handle standard forms submissions (Consultation, Callback, Appointment, ATS)
  const forms = [
    { id: 'consultation-form', successId: 'consult-success' },
    { id: 'callback-form', successId: 'callback-success' },
    { id: 'appointment-form', successId: 'appointment-success' },
    { id: 'ats-lead-form', successId: 'ats-success' }
  ];

  forms.forEach(formObj => {
    const el = document.getElementById(formObj.id);
    const successEl = document.getElementById(formObj.successId);
    
    if (el) {
      el.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Form validations
        let isValid = true;
        const requiredInputs = el.querySelectorAll('[required]');
        requiredInputs.forEach(input => {
          if (!input.value.trim()) isValid = false;
        });

        if (isValid) {
          // Hide Form, Show Success
          el.style.display = 'none';
          if (successEl) {
            successEl.style.display = 'block';
          }
        }
      });
    }
  });

  // Reset form buttons
  document.querySelectorAll('.reset-form-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const formId = btn.getAttribute('data-form-id');
      const formEl = document.getElementById(formId);
      const successEl = btn.parentElement;

      if (formEl && successEl) {
        formEl.reset();
        successEl.style.display = 'none';
        formEl.style.display = 'block';
      }
    });
  });

  // ATS Resume Scanner Simulator
  const startAtsBtn = document.getElementById('start-ats-scan-btn');
  const atsIntroView = document.getElementById('ats-intro-view');
  const atsMeterView = document.getElementById('ats-meter-view');
  const atsProgressNum = document.getElementById('ats-progress-number');
  const atsFeedbackMsg = document.getElementById('ats-feedback-message');
  const atsReportCaptureView = document.getElementById('ats-report-capture-view');
  const atsCvText = document.getElementById('ats-cv-text');
  const restartAtsBtn = document.getElementById('restart-ats-btn');
  const atsCapturedScoreLabel = document.getElementById('ats-captured-score-label');

  if (startAtsBtn) {
    startAtsBtn.addEventListener('click', () => {
      if (!atsCvText.value.trim()) {
        alert('Please paste some text to perform the CV audit.');
        return;
      }

      // Transition to scanning screen
      atsIntroView.style.display = 'none';
      atsMeterView.style.display = 'block';

      // Simulation process
      let score = 0;
      const targetScore = Math.floor(Math.random() * 20) + 60; // Random score between 60% and 80%
      const messages = [
        'Reading document encoding...',
        'Checking structural hierarchy...',
        'Parsing section headers...',
        'Analyzing key industries terms...',
        'Evaluating font formats...',
        'Finalizing ATS score computation...'
      ];

      let msgIndex = 0;
      const msgTimer = setInterval(() => {
        atsFeedbackMsg.textContent = messages[msgIndex % messages.length];
        msgIndex++;
      }, 500);

      const scoreTimer = setInterval(() => {
        score++;
        atsProgressNum.textContent = `${score}%`;
        
        // Update circular background gradient path representing progress
        atsProgressNum.style.background = `radial-gradient(closest-side, #0B1329 80%, transparent 0% 100%), conic-gradient(#D4AF37 ${score}%, rgba(255,255,255,0.05) 0%)`;

        if (score >= targetScore) {
          clearInterval(scoreTimer);
          clearInterval(msgTimer);

          setTimeout(() => {
            // Show report capture input
            atsCapturedScoreLabel.textContent = `${targetScore}%`;
            atsMeterView.style.display = 'none';
            atsReportCaptureView.style.display = 'block';
          }, 400);
        }
      }, 40);
    });
  }

  // Restart ATS simulator
  if (restartAtsBtn) {
    restartAtsBtn.addEventListener('click', () => {
      document.getElementById('ats-success').style.display = 'none';
      document.getElementById('ats-lead-form').reset();
      atsCvText.value = '';
      
      atsReportCaptureView.style.display = 'none';
      atsIntroView.style.display = 'block';
    });
  }

  // WhatsApp Routing Button Click
  const waRouterBtn = document.getElementById('wa-router-btn');
  const waServiceSelect = document.getElementById('wa-service-select');

  if (waRouterBtn && waServiceSelect) {
    waRouterBtn.addEventListener('click', () => {
      const selectedVal = waServiceSelect.value;
      const baseText = `Hello Dynamic Overseas Services, I want to inquire about: ${selectedVal}. Please share the steps to start.`;
      const encodedText = encodeURIComponent(baseText);
      const whatsappUrl = `https://wa.me/919876543210?text=${encodedText}`;
      
      window.open(whatsappUrl, '_blank');
    });
  }

  /* ==========================================================================
     11. DYNAMIC AI CAREER GUIDE ASSISTANT
     ========================================================================== */
  const aiChatToggleBtn = document.getElementById('ai-chat-toggle-btn');
  const aiChatCloseBtn = document.getElementById('ai-chat-close-btn');
  const aiChatContainer = document.getElementById('ai-chat-container');
  const aiChatMsgArea = document.getElementById('ai-chat-msg-area');
  const aiChatUserInput = document.getElementById('ai-chat-user-input');
  const aiChatSendBtn = document.getElementById('ai-chat-send-btn');

  // Toggle open
  if (aiChatToggleBtn) {
    aiChatToggleBtn.addEventListener('click', () => {
      aiChatContainer.classList.toggle('active');
      aiChatUserInput.focus();
    });
  }

  // Close
  if (aiChatCloseBtn) {
    aiChatCloseBtn.addEventListener('click', () => {
      aiChatContainer.classList.remove('active');
    });
  }

  // Chat message rendering helpers
  const appendMessage = (text, sender) => {
    const msg = document.createElement('div');
    msg.classList.add('ai-msg', sender === 'user' ? 'ai-msg-sent' : 'ai-msg-received');
    msg.textContent = text;
    aiChatMsgArea.appendChild(msg);
    aiChatMsgArea.scrollTop = aiChatMsgArea.scrollHeight;
    return msg;
  };

  const appendTypingIndicator = () => {
    const indicator = document.createElement('div');
    indicator.classList.add('typing-indicator');
    indicator.innerHTML = `
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    `;
    aiChatMsgArea.appendChild(indicator);
    aiChatMsgArea.scrollTop = aiChatMsgArea.scrollHeight;
    return indicator;
  };

  // Static responses database
  const getBotResponse = (input) => {
    const cleanInput = input.toLowerCase().trim();
    
    if (cleanInput.includes('resume') || cleanInput.includes('cv') || cleanInput.includes('writing')) {
      return "We write professional ATS-compliant resumes engineered to match international standards. To start a CV optimization package, please complete the 'ATS Score Simulator' tab or book a Free Consultation using our Lead Portal on the website!";
    }
    
    if (cleanInput.includes('germany') || cleanInput.includes('opportunity card') || cleanInput.includes('chancenkarte')) {
      return "Germany is one of our primary markets. We specialize in point assessments for the Opportunity Card (Chancenkarte), helping with equivalency evaluations (ZAB), and reviewing cover letters. Germany offers massive job prospects in Engineering, IT, Healthcare, and Logistics.";
    }

    if (cleanInput.includes('poland') || cleanInput.includes('work permit')) {
      return "For Poland, we offer National Type D visa documentation templates, work permit checklist reviews, and help candidates format their CV to Polish logistics, warehouse, and factory standards.";
    }

    if (cleanInput.includes('canada') || cleanInput.includes('express entry')) {
      return "Our Canada advisory guides candidates on Express Entry point optimization, Provincial Nominee Programs (PNP) rules, and structural CV formats for the North American job market.";
    }

    if (cleanInput.includes('price') || cleanInput.includes('cost') || cleanInput.includes('fees')) {
      return "Our resume writing and consultation pricing is tailored to the specific target country and details required. Basic ATS Resume Writing packages start at premium rates. For a customized quotation, please submit your contact details via our Consultation form.";
    }

    if (cleanInput.includes('contact') || cleanInput.includes('address') || cleanInput.includes('phone') || cleanInput.includes('number')) {
      return "You can reach our corporate desk at +91 98765 43210, email us at info@dynamicoverseas.com, or visit us at Level 4, Dynasty Business Park, Andheri East, Mumbai.";
    }

    if (cleanInput.includes('guarantee') || cleanInput.includes('placements') || cleanInput.includes('job offer')) {
      return "Dynamic Overseas Services Pvt. Ltd. provides professional documentation advisory and CV design. We do not guarantee employment, placements, or visa approvals. All selections depend entirely on embassies and international employers.";
    }

    // Default catch-all
    return "Thank you for message. To coordinate details for your targeted relocation, we recommend submitting a Consultation Request in our Lead Portal, or booking a slots via the Appointment Tab on the page!";
  };

  // Chat send trigger
  const handleUserMessage = () => {
    const text = aiChatUserInput.value.trim();
    if (!text) return;

    appendMessage(text, 'user');
    aiChatUserInput.value = '';

    // Typing delay simulation
    const indicator = appendTypingIndicator();
    setTimeout(() => {
      indicator.remove();
      const botReply = getBotResponse(text);
      appendMessage(botReply, 'bot');
    }, 1200);
  };

  if (aiChatSendBtn && aiChatUserInput) {
    aiChatSendBtn.addEventListener('click', handleUserMessage);
    aiChatUserInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        handleUserMessage();
      }
    });
  }

  // Quick replies click bindings
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('quick-reply-btn')) {
      const val = e.target.getAttribute('data-reply');
      aiChatUserInput.value = val;
      handleUserMessage();
    }
  });

  /* ==========================================================================
     12. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal');
  
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.15 });

    revealElements.forEach(el => revealObserver.observe(el));
  }

});
