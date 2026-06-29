document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. STICKY HEADER & NAVIGATION EFFECT
  // ==========================================================================
  const header = document.getElementById('mainHeader');
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initial run on load

  // ==========================================================================
  // 2. HAMBURGER OVERLAY MENU SYSTEM
  // ==========================================================================
  const hamburgerBtn = document.getElementById('hamburgerMenuBtn');
  const mobileNavOverlay = document.getElementById('mobileNavOverlay');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (hamburgerBtn && mobileNavOverlay) {
    const toggleMenu = () => {
      hamburgerBtn.classList.toggle('active');
      mobileNavOverlay.classList.toggle('active');
      document.body.style.overflow = mobileNavOverlay.classList.contains('active') ? 'hidden' : '';
    };

    hamburgerBtn.addEventListener('click', toggleMenu);

    // Close menu when clicking links
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburgerBtn.classList.remove('active');
        mobileNavOverlay.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ==========================================================================
  // 3. SCROLL REVEAL ANIMATIONS (Intersection Observer)
  // ==========================================================================
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ==========================================================================
  // 4. TIMELINE SCROLL PROGRESS LINKING
  // ==========================================================================
  const timelineActivePath = document.getElementById('timelineActivePath');
  const timelineNodes = document.querySelectorAll('.timeline-node-item');
  const processSection = document.getElementById('process');

  const updateTimelineProgress = () => {
    if (!processSection || !timelineActivePath) return;

    const sectionRect = processSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // Calculate progress based on how much of the section has scrolled past center
    const entryOffset = windowHeight * 0.7;
    const scrollDistance = entryOffset - sectionRect.top;
    const scrollRange = sectionRect.height * 0.6;
    
    let progressPercentage = (scrollDistance / scrollRange) * 100;
    progressPercentage = Math.min(Math.max(progressPercentage, 0), 100);
    
    timelineActivePath.style.width = `${progressPercentage}%`;

    // Highlight timeline nodes based on percentage threshold
    timelineNodes.forEach((node, idx) => {
      const nodeThreshold = (idx / (timelineNodes.length - 1)) * 95; // Stagger targets slightly before 100%
      if (progressPercentage >= nodeThreshold) {
        node.classList.add('active');
      } else {
        node.classList.remove('active');
      }
    });
  };

  window.addEventListener('scroll', updateTimelineProgress);
  updateTimelineProgress(); // Run on startup

  // ==========================================================================
  // 5. COUNTRY SHOWCASE FLOATING PARTICLES
  // ==========================================================================
  const showcaseParticles = document.getElementById('showcaseParticles');
  if (showcaseParticles) {
    const particleCount = 25;
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'showcase-particle';
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.animationDelay = `${Math.random() * 8}s`;
      particle.style.animationDuration = `${6 + Math.random() * 8}s`;
      showcaseParticles.appendChild(particle);
    }
  }

  // ==========================================================================
  // 6. REAL-TIME SUCCESS COUNTERS (Intersection Observer)
  // ==========================================================================
  const counterNumbers = document.querySelectorAll('.counter-number');
  
  const countUp = (element) => {
    const target = parseFloat(element.getAttribute('data-target'));
    const isDecimal = target % 1 !== 0;
    const duration = 2000; // 2 seconds
    const startTime = performance.now();
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing curve (easeOutQuad)
      const easeProgress = progress * (2 - progress);
      const currentValue = easeProgress * target;
      
      if (isDecimal) {
        element.textContent = currentValue.toFixed(1) + ' %';
      } else {
        element.textContent = Math.floor(currentValue).toLocaleString() + ' +';
      }
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        if (isDecimal) {
          element.textContent = target.toFixed(1) + ' %';
        } else {
          element.textContent = target.toLocaleString() + ' +';
        }
      }
    };
    
    requestAnimationFrame(animate);
  };

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        countUp(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counterNumbers.forEach(num => counterObserver.observe(num));

  // ==========================================================================
  // 7. TESTIMONIALS SLIDER CAROUSEL (Drag and Button controls)
  // ==========================================================================
  const testimonialCarousel = document.getElementById('testimonialCarousel');
  const testimonialDeck = document.getElementById('testimonialDeck');
  const prevBtn = document.getElementById('prevSlideBtn');
  const nextBtn = document.getElementById('nextSlideBtn');

  if (testimonialCarousel && testimonialDeck) {
    let currentIndex = 0;
    let isDragging = false;
    let startX = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID = 0;

    const cards = document.querySelectorAll('.testimonial-premium-card');
    const cardCount = cards.length;
    const cardWidth = 420; // from CSS flex-basis
    const gap = 32;        // from gap-8 (2rem = 32px)

    const updateSliderPosition = () => {
      const translateVal = currentIndex * (cardWidth + gap);
      testimonialDeck.style.transform = `translateX(-${translateVal}px)`;
      prevTranslate = -translateVal;
    };

    const slideNext = () => {
      // Calculate max visible index based on viewport width
      const visibleWidth = testimonialCarousel.offsetWidth;
      const totalWidth = cardCount * cardWidth + (cardCount - 1) * gap;
      const maxIndex = Math.max(0, Math.ceil((totalWidth - visibleWidth) / (cardWidth + gap)));

      if (currentIndex < maxIndex) {
        currentIndex++;
      } else {
        currentIndex = 0; // Loop back
      }
      updateSliderPosition();
    };

    const slidePrev = () => {
      if (currentIndex > 0) {
        currentIndex--;
      } else {
        // Go to end index
        const visibleWidth = testimonialCarousel.offsetWidth;
        const totalWidth = cardCount * cardWidth + (cardCount - 1) * gap;
        currentIndex = Math.max(0, Math.ceil((totalWidth - visibleWidth) / (cardWidth + gap)));
      }
      updateSliderPosition();
    };

    nextBtn.addEventListener('click', slideNext);
    prevBtn.addEventListener('click', slidePrev);

    // Touch / Drag Gesture Support
    const getPosX = (e) => e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;

    const dragStart = (e) => {
      isDragging = true;
      startX = getPosX(e);
      currentTranslate = prevTranslate; // Prevent slider jumping on click
      animationID = requestAnimationFrame(animationLoop);
      testimonialDeck.style.transition = 'none';
    };

    const dragMove = (e) => {
      if (!isDragging) return;
      const currentX = getPosX(e);
      const diff = currentX - startX;
      currentTranslate = prevTranslate + diff;
    };

    const dragEnd = () => {
      isDragging = false;
      cancelAnimationFrame(animationID);
      testimonialDeck.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
      
      const movedBy = currentTranslate - prevTranslate;
      // If dragged past threshold, slide card
      if (movedBy < -100) {
        slideNext();
      } else if (movedBy > 100) {
        slidePrev();
      } else {
        updateSliderPosition();
      }
    };

    const animationLoop = () => {
      if (isDragging) {
        testimonialDeck.style.transform = `translateX(${currentTranslate}px)`;
        animationID = requestAnimationFrame(animationLoop);
      }
    };

    // Attach Event Listeners
    testimonialCarousel.addEventListener('mousedown', dragStart);
    testimonialCarousel.addEventListener('mousemove', dragMove);
    window.addEventListener('mouseup', dragEnd);

    testimonialCarousel.addEventListener('touchstart', dragStart, { passive: true });
    testimonialCarousel.addEventListener('touchmove', dragMove, { passive: true });
    window.addEventListener('touchend', dragEnd);

    // Auto sliding cycle
    let autoSlideTimer = setInterval(slideNext, 6000);
    testimonialCarousel.addEventListener('mouseenter', () => clearInterval(autoSlideTimer));
    testimonialCarousel.addEventListener('mouseleave', () => autoSlideTimer = setInterval(slideNext, 6000));
    
    // Adjust layout on window resizing
    window.addEventListener('resize', updateSliderPosition);
  }

  // ==========================================================================
  // 8. FAQ ACCORDION COLLAPSE SYSTEM
  // ==========================================================================
  const faqQuestions = document.querySelectorAll('.faq-question-btn');

  faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentItem = btn.parentElement;
      const currentAnswer = currentItem.querySelector('.faq-answer-panel');
      const isActive = currentItem.classList.contains('active');

      // Collapse all FAQ panels first
      document.querySelectorAll('.faq-card-item').forEach(item => {
        item.classList.remove('active');
        item.querySelector('.faq-answer-panel').style.maxHeight = null;
      });

      // Expand clicked panel if it wasn't already active
      if (!isActive) {
        currentItem.classList.add('active');
        currentAnswer.style.maxHeight = `${currentAnswer.scrollHeight}px`;
      }
    });
  });

  // ==========================================================================
  // 9. FORM VALIDATION, STORAGE CACHE & WHATSAPP GENERATION
  // ==========================================================================
  const profileIntakeForm = document.getElementById('profileIntakeForm');
  const modal = document.getElementById('successModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');

  // Load cached lead metrics from localStorage if available
  if (profileIntakeForm) {
    const cachedName = localStorage.getItem('dos_cached_name');
    const cachedPhone = localStorage.getItem('dos_cached_phone');
    const cachedEmail = localStorage.getItem('dos_cached_email');

    if (cachedName) document.getElementById('fullName').value = cachedName;
    if (cachedPhone) document.getElementById('phoneNumber').value = cachedPhone;
    if (cachedEmail) document.getElementById('emailAddress').value = cachedEmail;

    // Trigger normal form submissions
    profileIntakeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const leadData = getFormData();
      if (!leadData) return;

      // Cache details in browser storage
      cacheLeadData(leadData);

      // Display generic success modal message
      showSuccessModal(
        "Application Submitted!",
        `Thank you ${leadData.name}. Your profile details for ${leadData.country} (${leadData.service}) have been securely logged. Our compliance evaluators will email/call you within 1 business day.`
      );
      
      profileIntakeForm.reset();
    });

    // Trigger WhatsApp compilations
    const whatsAppSubmitBtn = document.getElementById('formWhatsAppSubmitBtn');
    if (whatsAppSubmitBtn) {
      whatsAppSubmitBtn.addEventListener('click', (e) => {
        e.preventDefault();

        // Trigger native browser validations first
        if (!profileIntakeForm.reportValidity()) return;

        const leadData = getFormData();
        if (!leadData) return;

        // Cache details in browser storage
        cacheLeadData(leadData);

        // Compile WhatsApp text template
        const whatsAppMessage = `*NEW PROFILE EVALUATION INQUIRY*
-----------------------------
*Client Name:* ${leadData.name}
*Phone Number:* ${leadData.phone}
*Email Address:* ${leadData.email}
*Country Focused:* ${leadData.country}
*Service Requested:* ${leadData.service}
-----------------------------
*Profile Summary Notes:*
${leadData.message ? leadData.message : 'No comments provided.'}

_Please review my profile details._`;

        // Redirect to WhatsApp Hotline API
        const hotlineNum = '918945523710';
        const encodedMsg = encodeURIComponent(whatsAppMessage);
        const whatsAppUrl = `https://wa.me/${hotlineNum}?text=${encodedMsg}`;

        window.open(whatsAppUrl, '_blank');

        // Display success confirmation modal
        showSuccessModal(
          "WhatsApp Submission Initiated!",
          `Thank you ${leadData.name}. We have compiled your profile message and opened WhatsApp to connect you with our hotline coordinator. Your details have also been saved locally.`
        );

        profileIntakeForm.reset();
      });
    }
  }

  // Helper selectors & functions
  const getFormData = () => {
    const name = document.getElementById('fullName').value.trim();
    const phone = document.getElementById('phoneNumber').value.trim();
    const email = document.getElementById('emailAddress').value.trim();
    const country = document.getElementById('countrySelect').value;
    const serviceRadio = document.querySelector('input[name="serviceRequired"]:checked');
    const service = serviceRadio ? serviceRadio.value : 'General Visa Inquiry';
    const message = document.getElementById('formMessage').value.trim();

    if (!name || !phone || !email || !country) return null;

    return { name, phone, email, country, service, message };
  };

  const cacheLeadData = (data) => {
    localStorage.setItem('dos_cached_name', data.name);
    localStorage.setItem('dos_cached_phone', data.phone);
    localStorage.setItem('dos_cached_email', data.email);
  };

  const showSuccessModal = (title, bodyText) => {
    if (!modal) return;
    modalTitle.textContent = title;
    modalBody.textContent = bodyText;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  if (closeModalBtn && modal) {
    const closeModal = () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    };
    closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // Floating & Hero WhatsApp triggers
  const whatsAppTriggers = document.querySelectorAll('.whatsapp-trigger');
  whatsAppTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const defaultText = "Hello Dynamic Overseas Services! I am interested in your visa documentation and career services and would like a consultation.";
      const encoded = encodeURIComponent(defaultText);
      window.open(`https://wa.me/918945523710?text=${encoded}`, '_blank');
    });
  });

  // Hero consultation button scroll-focus handler
  const heroConsultBtn = document.getElementById('heroConsultBtn');
  if (heroConsultBtn) {
    heroConsultBtn.addEventListener('click', () => {
      // Trigger evaluation advice inside the modal and point to form
      showSuccessModal(
        "Free Profile Evaluation",
        "Our profile consultants are ready to assist you. To start your free consultation, please fill in the Smart Intake Form. Clicking below will scroll you directly to the form."
      );
      // Change behavior of close button to scroll down
      const origHandler = closeModalBtn.onclick;
      closeModalBtn.addEventListener('click', function scrollDown() {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
          setTimeout(() => {
            const nameField = document.getElementById('fullName');
            if (nameField) nameField.focus();
          }, 800);
        }
        closeModalBtn.removeEventListener('click', scrollDown);
      });
    });
  }

  // Auto scroll handles for Apply Buttons
  const applyBtns = document.querySelectorAll('.apply-now-btn');
  applyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // If card specifies service, select appropriate radio button
      const targetService = btn.getAttribute('data-service');
      if (targetService) {
        const matchingRadio = document.querySelector(`input[name="serviceRequired"][value="${targetService}"]`);
        if (matchingRadio) matchingRadio.checked = true;
      }
      
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        e.preventDefault();
        contactSection.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          const nameField = document.getElementById('fullName');
          if (nameField) nameField.focus();
        }, 800);
      }
    });
  });

  // Recommended price package CTA redirects to complete-order.html natively via its href.

  // ==========================================================================
  // 10. 3D DIGITAL CANVAS ROTATING GLOBE
  // ==========================================================================
  const canvas = document.getElementById('globeCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.offsetWidth || 500;
    let height = canvas.offsetHeight || 500;
    
    // Set device pixel ratio for sharp rendering
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    
    let radius = Math.min(width, height) * 0.42;
    let rotationX = 0.4; // Tilt
    let rotationY = 0;   // Rotation angle
    
    let isDraggingGlobe = false;
    let previousMousePosition = { x: 0, y: 0 };

    // Set responsive dimensions on window resize
    const resizeCanvas = () => {
      if (!canvas.parentElement) return;
      width = canvas.parentElement.offsetWidth || 500;
      height = canvas.parentElement.offsetHeight || 500;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.resetTransform();
      ctx.scale(dpr, dpr);
      radius = Math.min(width, height) * 0.42;
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas(); // Initialize correct sizing on load

    // Mouse rotation handling
    canvas.addEventListener('mousedown', (e) => {
      isDraggingGlobe = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDraggingGlobe) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;
      
      rotationY += deltaX * 0.005;
      rotationX += deltaY * 0.005;
      
      // Clamp pitch rotation to prevent flipping upside down
      rotationX = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, rotationX));
      
      previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => {
      isDraggingGlobe = false;
    });

    // Mobile touch rotation
    canvas.addEventListener('touchstart', (e) => {
      isDraggingGlobe = true;
      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }, { passive: true });

    canvas.addEventListener('touchmove', (e) => {
      if (!isDraggingGlobe) return;
      const deltaX = e.touches[0].clientX - previousMousePosition.x;
      const deltaY = e.touches[0].clientY - previousMousePosition.y;
      
      rotationY += deltaX * 0.007;
      rotationX += deltaY * 0.007;
      rotationX = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, rotationX));
      
      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }, { passive: true });

    canvas.addEventListener('touchend', () => {
      isDraggingGlobe = false;
    });

    // 3D Point generator
    const generateGlobePoints = () => {
      const pts = [];
      const count = 120; // grid density
      for (let i = 0; i < count; i++) {
        const phi = Math.acos(-1 + (2 * i) / count);
        const theta = Math.sqrt(count * Math.PI) * phi;
        pts.push({
          x: Math.sin(phi) * Math.cos(theta),
          y: Math.sin(phi) * Math.sin(theta),
          z: Math.cos(phi)
        });
      }
      return pts;
    };
    const globePoints = generateGlobePoints();

    // Key international hubs (Dubai, London, Singapore, Malta, New Zealand, Sydney)
    const hubs = [
      { lat: 25.2048, lon: 55.2708, label: 'Dubai' },
      { lat: 51.5074, lon: -0.1278, label: 'London' },
      { lat: 1.3521, lon: 103.8198, label: 'Singapore' },
      { lat: 35.8989, lon: 14.5146, label: 'Malta' },
      { lat: -40.9006, lon: 174.8860, label: 'New Zealand' },
      { lat: 43.6532, lon: -79.3832, label: 'Toronto' }
    ].map(h => {
      // Convert polar latitude & longitude (in degrees) to 3D Cartesian spherical coordinates
      const phi = (90 - h.lat) * (Math.PI / 180);
      const theta = (h.lon + 180) * (Math.PI / 180);
      return {
        x: Math.sin(phi) * Math.cos(theta),
        y: Math.cos(phi),
        z: Math.sin(phi) * Math.sin(theta),
        label: h.label
      };
    });

    // Flight paths from Dubai (hubs[0]) to other targets
    const flightPaths = [
      { from: hubs[0], to: hubs[1] }, // Dubai -> London
      { from: hubs[0], to: hubs[2] }, // Dubai -> Singapore
      { from: hubs[0], to: hubs[3] }, // Dubai -> Malta
      { from: hubs[0], to: hubs[4] }, // Dubai -> NZ
      { from: hubs[0], to: hubs[5] }  // Dubai -> Toronto
    ];

    // Projection & Render loop
    const renderGlobe = () => {
      ctx.clearRect(0, 0, width, height);
      
      const centerX = width / 2;
      const centerY = height / 2;

      // Draw subtle glow backdrop circle
      const radialGlow = ctx.createRadialGradient(centerX, centerY, radius * 0.7, centerX, centerY, radius * 1.15);
      radialGlow.addColorStop(0, 'rgba(10, 25, 47, 0.4)');
      radialGlow.addColorStop(0.8, 'rgba(212, 175, 55, 0.02)');
      radialGlow.addColorStop(1, 'rgba(10, 25, 47, 0)');
      ctx.fillStyle = radialGlow;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.2, 0, Math.PI * 2);
      ctx.fill();

      // Rotation matrix values
      const cosX = Math.cos(rotationX);
      const sinX = Math.sin(rotationX);
      const cosY = Math.cos(rotationY);
      const sinY = Math.sin(rotationY);

      // Rotate point utility
      const rotate3D = (pt) => {
        // Rotate around Y axis (longitude rotation)
        const x1 = pt.x * cosY - pt.z * sinY;
        const z1 = pt.x * sinY + pt.z * cosY;
        
        // Rotate around X axis (latitude tilt)
        const y2 = pt.y * cosX - z1 * sinX;
        const z2 = pt.y * sinX + z1 * cosX;

        return { x: x1, y: y2, z: z2 };
      };

      // Draw base wireframe rings (parallels & meridians)
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.05)';
      ctx.lineWidth = 0.5;
      for (let i = 1; i < 6; i++) {
        // parallels
        ctx.beginPath();
        const rHeight = Math.sin(-Math.PI/2 + (Math.PI * i)/6) * radius;
        const rRadius = Math.cos(-Math.PI/2 + (Math.PI * i)/6) * radius;
        ctx.ellipse(centerX, centerY + rHeight * cosX, rRadius, Math.abs(rRadius * sinX), 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw dots (continents wireframe points)
      globePoints.forEach(pt => {
        const rotated = rotate3D(pt);
        if (rotated.z < 0) return; // Hide back-facing half dots for 3D depth

        const screenX = centerX + rotated.x * radius;
        const screenY = centerY - rotated.y * radius;
        const dotScale = (rotated.z + 1.2) / 2.2; // Perspective sizing

        ctx.fillStyle = `rgba(212, 175, 55, ${0.15 * dotScale})`;
        ctx.beginPath();
        ctx.arc(screenX, screenY, 2 * dotScale, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw flight arches
      flightPaths.forEach(path => {
        const startRot = rotate3D(path.from);
        const endRot = rotate3D(path.to);

        // Render flight paths if at least one hub is partially on the front face
        if (startRot.z < -0.3 && endRot.z < -0.3) return;

        const x1 = centerX + startRot.x * radius;
        const y1 = centerY - startRot.y * radius;
        const x2 = centerX + endRot.x * radius;
        const y2 = centerY - endRot.y * radius;

        // Quadratic bezier midpoint for arch arching height
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2 - Math.max(50, Math.abs(x1 - x2) * 0.25);

        // Alpha based on depth
        const depthAlpha = Math.max(0.05, (startRot.z + endRot.z + 2) / 4);

        ctx.strokeStyle = `rgba(212, 175, 55, ${0.45 * depthAlpha})`;
        ctx.lineWidth = 1.4;
        ctx.shadowColor = 'var(--gold-primary)';
        ctx.shadowBlur = 4;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.quadraticCurveTo(midX, midY, x2, y2);
        ctx.stroke();
        ctx.setLineDash([]); // Reset dash
        ctx.shadowBlur = 0; // Reset shadow

        // Draw animated pulse flying along the route
        const time = (performance.now() * 0.0008) % 1; // 0 to 1 loop
        const tX = (1-time)*(1-time)*x1 + 2*(1-time)*time*midX + time*time*x2;
        const tY = (1-time)*(1-time)*y1 + 2*(1-time)*time*midY + time*time*y2;
        
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(tX, tY, 2.5, 0, Math.PI * 2);
        ctx.shadowColor = 'var(--gold-primary)';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0; // Reset shadow
      });

      // Draw Hub locations & Labels
      hubs.forEach(hub => {
        const rotated = rotate3D(hub);
        if (rotated.z < 0) return; // Hide nodes on back face

        const screenX = centerX + rotated.x * radius;
        const screenY = centerY - rotated.y * radius;
        const scale = (rotated.z + 1.2) / 2.2;

        // Hub dot
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = 'var(--gold-primary)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(screenX, screenY, 4 * scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Glowing outer pulse ring
        const pulseSize = 4 * scale + (Math.sin(performance.now() * 0.005) + 1) * 3 * scale;
        ctx.strokeStyle = `rgba(212, 175, 55, ${0.4 * (1 - (pulseSize - 4) / 6)})`;
        ctx.lineWidth = 0.75;
        ctx.beginPath();
        ctx.arc(screenX, screenY, pulseSize, 0, Math.PI * 2);
        ctx.stroke();

        // City labels
        ctx.fillStyle = `rgba(255, 255, 255, ${0.9 * scale})`;
        ctx.font = `600 ${Math.max(8, Math.floor(10 * scale))}px "Plus Jakarta Sans", sans-serif`;
        ctx.fillText(hub.label, screenX + 8, screenY + 3);
      });

      // Auto rotation velocity when not dragging
      if (!isDraggingGlobe) {
        rotationY += 0.0015;
      }

      requestAnimationFrame(renderGlobe);
    };

    renderGlobe();
  }

  // ==========================================================================
  // 11. PREMIUM SMOOTH PARALLAX EFFECT FOR HERO
  // ==========================================================================
  const heroSection = document.getElementById('home');
  if (heroSection) {
    window.addEventListener('scroll', () => {
      const depth = window.scrollY;
      if (depth > window.innerHeight) return;
      heroSection.style.setProperty('--hero-scroll-y', depth);
    }, { passive: true });
  }

  // ==========================================================================
  // 12. PREMIUM HERO GOLD PARTICLES CANVAS SYSTEM
  // ==========================================================================
  const particleCanvas = document.getElementById('particleCanvas');
  if (particleCanvas) {
    const pCtx = particleCanvas.getContext('2d');
    let pWidth = particleCanvas.width = particleCanvas.parentElement.offsetWidth || window.innerWidth;
    let pHeight = particleCanvas.height = particleCanvas.parentElement.offsetHeight || window.innerHeight;
    
    const particles = [];
    const particleCount = Math.min(60, Math.floor(pWidth / 25));
    
    class Particle {
      constructor() {
        this.reset();
        this.y = Math.random() * pHeight;
      }
      
      reset() {
        this.x = Math.random() * pWidth;
        this.y = pHeight + Math.random() * 20;
        this.size = Math.random() * 2.2 + 0.6;
        this.speedY = -(Math.random() * 0.4 + 0.15);
        this.speedX = Math.sin(Math.random() * Math.PI * 2) * 0.1;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.fadeSpeed = Math.random() * 0.003 + 0.001;
      }
      
      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.speedX += (Math.random() - 0.5) * 0.015;
        this.speedX = Math.max(-0.3, Math.min(0.3, this.speedX));
        
        if (this.y < pHeight * 0.1) {
          this.opacity -= this.fadeSpeed;
        }
        
        if (this.y < 0 || this.opacity <= 0 || this.x < 0 || this.x > pWidth) {
          this.reset();
        }
      }
      
      draw() {
        pCtx.beginPath();
        pCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        pCtx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`;
        pCtx.fill();
      }
    }
    
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
    
    const resizeParticles = () => {
      if (!particleCanvas.parentElement) return;
      pWidth = particleCanvas.width = particleCanvas.parentElement.offsetWidth || window.innerWidth;
      pHeight = particleCanvas.height = particleCanvas.parentElement.offsetHeight || window.innerHeight;
    };
    window.addEventListener('resize', resizeParticles);
    
    const animateParticles = () => {
      pCtx.clearRect(0, 0, pWidth, pHeight);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animateParticles);
    };
    animateParticles();
  }

  // ==========================================================================
  // 13. 3D GLASSMORPHIC TILT INTERACTION FOR CARDS
  // ==========================================================================
  const tiltCards = document.querySelectorAll('.hero-service-card, .intent-card, .service-premium-card, .why-card');
  if (window.innerWidth > 1024) {
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((centerY - y) / centerY) * 10;
        const rotateY = ((x - centerX) / centerX) * 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px) scale(1.02)`;
        card.style.transition = 'none';
        
        const percentX = (x / rect.width) * 100;
        const percentY = (y / rect.height) * 100;
        card.style.backgroundImage = `radial-gradient(circle at ${percentX}% ${percentY}%, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.01) 80%)`;
      });
      
      card.style.transition = 'transform 0.5s ease, background 0.5s ease';
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.5s ease, background 0.5s ease';
        card.style.backgroundImage = '';
      });
    });
  }

  // ==========================================================================
  // 14. SCROLL SPY NAVIGATION HIGHLIGHTER
  // ==========================================================================
  const spySections = document.querySelectorAll('section[id], header[id]');
  const desktopLinks = document.querySelectorAll('.nav-link');
  const mobLinks = document.querySelectorAll('.mobile-link');

  const scrollSpy = () => {
    let currentId = '';
    const scrollPosition = window.scrollY + 150; // offset to trigger slightly early

    spySections.forEach(sec => {
      const rect = sec.getBoundingClientRect();
      const secTop = rect.top + window.scrollY;
      const secHeight = rect.height;
      if (scrollPosition >= secTop && scrollPosition < secTop + secHeight) {
        currentId = sec.getAttribute('id');
      }
    });

    if (!currentId && window.scrollY < 100) {
      currentId = 'home';
    }

    desktopLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === `#${currentId}` || (currentId === 'home' && href === '#')) {
        link.classList.add('active');
      }
    });

    mobLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === `#${currentId}` || (currentId === 'home' && href === '#')) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', scrollSpy);
  scrollSpy();
});
