/**
 * Ethics Media Marketing — Agency Portfolio
 * Main JavaScript Interactions: Filtering, Video Hover Previews, Lightboxes,
 * Orbital Capability Stages, 5-Step Process & Continuous Project Reels
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. Sticky Navigation Scroll Effect
  // --------------------------------------------------------------------------
  const header = document.querySelector('.header');
  const handleScroll = () => {
    if (!header) return;
    if (window.scrollY > 40) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // --------------------------------------------------------------------------
  // 2. Mobile Menu Toggle & Drawer
  // --------------------------------------------------------------------------
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  const mobileOverlay = document.querySelector('.mobile-drawer__overlay');
  const mobileLinks = document.querySelectorAll('.mobile-drawer .nav-link');

  const openDrawer = () => {
    mobileToggle.classList.add('is-open');
    mobileDrawer.classList.add('is-open');
    mobileOverlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    mobileToggle.setAttribute('aria-expanded', 'true');
  };

  const closeDrawer = () => {
    mobileToggle.classList.remove('is-open');
    mobileDrawer.classList.remove('is-open');
    mobileOverlay.classList.remove('is-open');
    document.body.style.overflow = '';
    mobileToggle.setAttribute('aria-expanded', 'false');
  };

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.contains('is-open');
      if (isOpen) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });
  }

  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', closeDrawer);
  }

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // --------------------------------------------------------------------------
  // 3. Category Filter Tabs (Smooth FLIP Layout Transitions)
  // --------------------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('#portfolio-grid .project-card');

  let isFilterAnimating = false;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (isFilterAnimating && btn.classList.contains('is-active')) return;

      // Update active button state
      filterBtns.forEach(b => {
        b.classList.remove('is-active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');

      const filterValue = btn.getAttribute('data-filter');

      // 1. FIRST: Record bounding rectangles of currently visible cards
      const firstPositions = new Map();
      projectCards.forEach(card => {
        if (card.style.display !== 'none' && !card.classList.contains('is-hidden')) {
          firstPositions.set(card, card.getBoundingClientRect());
        }
      });

      // 2. Identify which cards match
      const matchingCards = [];
      const hidingCards = [];

      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category') || '';
        const cardType = card.getAttribute('data-type') || '';
        const cardTitle = (card.getAttribute('data-title') || '').toLowerCase();

        let matches = (filterValue === 'all');
        if (filterValue === 'video') {
          matches = (cardCategory === 'video' || cardType === 'video');
        } else if (filterValue === 'graphics') {
          matches = (cardCategory === 'graphics' || cardCategory === 'design' || cardCategory === 'branding');
        } else if (filterValue === 'ecommerce') {
          matches = (cardCategory === 'ecommerce');
        } else if (filterValue === 'motion') {
          matches = (cardCategory === 'motion' || cardTitle.includes('motion') || cardTitle.includes('timepiece') || cardTitle.includes('explainer'));
        } else if (filterValue === 'branding') {
          matches = (cardCategory === 'branding' || cardTitle.includes('brand') || cardTitle.includes('roast') || cardTitle.includes('tokens') || cardTitle.includes('heis'));
        } else if (filterValue === 'web') {
          matches = (cardCategory === 'web' || cardTitle.includes('web') || cardTitle.includes('mockup') || cardTitle.includes('interface'));
        }

        if (matches) {
          matchingCards.push(card);
        } else {
          hidingCards.push(card);
        }
      });

      // 3. Smooth fade out hiding cards
      isFilterAnimating = true;
      hidingCards.forEach(card => {
        card.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        card.style.pointerEvents = 'none';
      });

      setTimeout(() => {
        hidingCards.forEach(card => {
          card.style.display = 'none';
          card.classList.add('is-hidden');
        });

        // Display matching cards
        matchingCards.forEach(card => {
          card.style.display = '';
          card.classList.remove('is-hidden');
          card.style.pointerEvents = '';
        });

        // 4. LAST: Record new bounding rectangles of newly positioned cards
        const lastPositions = new Map();
        matchingCards.forEach(card => {
          lastPositions.set(card, card.getBoundingClientRect());
        });

        // 5. INVERT & PLAY: Smoothly transition from first to last position
        matchingCards.forEach(card => {
          const first = firstPositions.get(card);
          const last = lastPositions.get(card);

          if (first && last) {
            const deltaX = first.left - last.left;
            const deltaY = first.top - last.top;

            if (Math.abs(deltaX) > 1 || Math.abs(deltaY) > 1) {
              card.style.transition = 'none';
              card.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

              requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                  card.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease';
                  card.style.transform = '';
                  card.style.opacity = '1';
                });
              });
              return;
            }
          }

          // Cards newly entering or in place
          card.style.transition = 'none';
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px) scale(0.97)';
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              card.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease';
              card.style.transform = '';
              card.style.opacity = '1';
            });
          });
        });

        setTimeout(() => {
          isFilterAnimating = false;
        }, 420);
      }, 200);
    });
  });

  // --------------------------------------------------------------------------
  // 4. Video Hover Playback Previews & Modal Lightbox Player
  // --------------------------------------------------------------------------
  const hoverVideos = document.querySelectorAll('.hover-video-preview, .featured-card__video, .hero-collage__card--main video');
  hoverVideos.forEach(video => {
    const parentCard = video.closest('.project-card, .hero-collage__card, .featured-card');
    if (!parentCard) return;

    parentCard.addEventListener('mouseenter', () => {
      video.play().catch(() => {});
    });

    parentCard.addEventListener('mouseleave', () => {
      video.pause();
    });
  });

  const videoModal = document.getElementById('video-modal');
  const modalVideoPlayer = document.getElementById('modal-video-player');
  const modalVideoTitle = document.getElementById('modal-video-title');
  const modalVideoSubtitle = document.getElementById('modal-video-subtitle');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  const openVideoModal = (src, title, subtitle) => {
    if (!videoModal || !modalVideoPlayer) return;
    modalVideoPlayer.src = src;
    if (modalVideoTitle) modalVideoTitle.textContent = title || 'Project Reel';
    if (modalVideoSubtitle) modalVideoSubtitle.textContent = subtitle || 'Ethics Media Marketing Production';
    videoModal.showModal();
    modalVideoPlayer.play().catch(() => {});
  };

  const closeVideoModal = () => {
    if (!videoModal || !modalVideoPlayer) return;
    modalVideoPlayer.pause();
    modalVideoPlayer.src = '';
    videoModal.close();
  };

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeVideoModal);
  }

  if (videoModal) {
    videoModal.addEventListener('click', (e) => {
      const rect = videoModal.getBoundingClientRect();
      const isInDialog = (
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width
      );
      if (!isInDialog) {
        closeVideoModal();
      }
    });

    videoModal.addEventListener('cancel', () => {
      closeVideoModal();
    });
  }

  // Bind video triggers
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('.js-play-video-trigger');
    if (trigger) {
      e.preventDefault();
      const videoSrc = trigger.getAttribute('data-video-src');
      const title = trigger.getAttribute('data-title');
      const subtitle = trigger.getAttribute('data-subtitle');
      if (videoSrc) {
        openVideoModal(videoSrc, title, subtitle);
      }
      return;
    }

    const videoCard = e.target.closest('.project-card--video');
    if (videoCard) {
      e.preventDefault();
      const videoSrc = videoCard.getAttribute('data-video-src');
      const title = videoCard.getAttribute('data-title');
      const subtitle = videoCard.getAttribute('data-subtitle');
      if (videoSrc) {
        openVideoModal(videoSrc, title, subtitle);
      }
    }
  });

  // Hero card video click
  const heroReelCard = document.querySelector('.hero-collage__card--main');
  if (heroReelCard) {
    heroReelCard.addEventListener('click', () => {
      const src = heroReelCard.getAttribute('data-video-src');
      const title = heroReelCard.getAttribute('data-title');
      const subtitle = heroReelCard.getAttribute('data-subtitle');
      if (src) openVideoModal(src, title, subtitle);
    });
  }

  // --------------------------------------------------------------------------
  // 5. Project Lightbox Modal (Multi-Asset Gallery)
  // --------------------------------------------------------------------------
  const projectModal = document.getElementById('project-modal');
  const projectModalTitle = document.getElementById('project-modal-title');
  const projectModalSubtitle = document.getElementById('project-modal-subtitle');
  const projectModalDesc = document.getElementById('project-modal-desc');
  const projectModalRole = document.getElementById('project-modal-role');
  const projectModalDeliverables = document.getElementById('project-modal-deliverables');
  const projectModalCatBadge = document.getElementById('project-modal-cat-badge');
  const projectModalCountBadge = document.getElementById('project-modal-count-badge');
  const projectModalMainImg = document.getElementById('project-modal-main-img');
  const projectModalThumbnails = document.getElementById('project-modal-thumbnails');
  const projectModalPrevBtn = document.getElementById('project-modal-prev-btn');
  const projectModalNextBtn = document.getElementById('project-modal-next-btn');
  const projectModalCloseBtn = document.getElementById('project-modal-close-btn');

  let currentGallery = [];
  let currentAssetIndex = 0;

  const updateModalAsset = (index) => {
    if (!currentGallery.length) return;
    currentAssetIndex = (index + currentGallery.length) % currentGallery.length;
    const assetPath = currentGallery[currentAssetIndex];

    if (projectModalMainImg) {
      projectModalMainImg.src = assetPath;
      projectModalMainImg.alt = `Project Asset ${currentAssetIndex + 1}`;
    }

    if (projectModalCountBadge) {
      projectModalCountBadge.textContent = `${currentAssetIndex + 1} of ${currentGallery.length}`;
    }

    const thumbs = projectModalThumbnails?.querySelectorAll('.project-modal__thumb');
    thumbs?.forEach((thumb, i) => {
      thumb.classList.toggle('is-active', i === currentAssetIndex);
    });
  };

  const openProjectModal = (card) => {
    if (!projectModal) return;

    const title = card.getAttribute('data-title') || 'Project Showcase';
    const subtitle = card.getAttribute('data-subtitle') || '';
    const desc = card.getAttribute('data-desc') || '';
    const role = card.getAttribute('data-role') || 'Creative & Strategy Direction';
    const deliverables = card.getAttribute('data-deliverables') || '';
    const category = card.getAttribute('data-category') || 'Creative';

    let galleryJson = card.getAttribute('data-gallery') || '[]';
    try {
      currentGallery = JSON.parse(galleryJson);
    } catch {
      currentGallery = [];
    }

    if (!currentGallery.length) {
      const img = card.querySelector('img');
      if (img && img.src) currentGallery = [img.src];
    }

    if (projectModalTitle) projectModalTitle.textContent = title;
    if (projectModalSubtitle) projectModalSubtitle.textContent = subtitle;
    if (projectModalDesc) projectModalDesc.textContent = desc;
    if (projectModalRole) projectModalRole.textContent = role;
    if (projectModalCatBadge) projectModalCatBadge.textContent = category.toUpperCase();

    if (projectModalDeliverables) {
      projectModalDeliverables.innerHTML = '';
      if (deliverables) {
        deliverables.split(',').forEach(item => {
          const span = document.createElement('span');
          span.className = 'deliverable-tag';
          span.textContent = item.trim();
          projectModalDeliverables.appendChild(span);
        });
      }
    }

    if (projectModalThumbnails) {
      projectModalThumbnails.innerHTML = '';
      currentGallery.forEach((path, idx) => {
        const thumb = document.createElement('button');
        thumb.className = 'project-modal__thumb' + (idx === 0 ? ' is-active' : '');
        thumb.setAttribute('aria-label', `Asset ${idx + 1}`);
        const img = document.createElement('img');
        img.src = path;
        img.alt = `Thumbnail ${idx + 1}`;
        thumb.appendChild(img);
        thumb.addEventListener('click', () => updateModalAsset(idx));
        projectModalThumbnails.appendChild(thumb);
      });
    }

    updateModalAsset(0);
    projectModal.showModal();
  };

  const closeProjectModal = () => {
    if (!projectModal) return;
    projectModal.close();
  };

  if (projectModalCloseBtn) projectModalCloseBtn.addEventListener('click', closeProjectModal);
  if (projectModalPrevBtn) projectModalPrevBtn.addEventListener('click', () => updateModalAsset(currentAssetIndex - 1));
  if (projectModalNextBtn) projectModalNextBtn.addEventListener('click', () => updateModalAsset(currentAssetIndex + 1));

  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      const rect = projectModal.getBoundingClientRect();
      const isInDialog = (
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width
      );
      if (!isInDialog) closeProjectModal();
    });
    projectModal.addEventListener('cancel', () => closeProjectModal());
  }

  // Open project modal on graphic / ecom card click
  document.addEventListener('click', (e) => {
    if (e.target.closest('.js-play-video-trigger') || e.target.closest('.project-card--video')) return;

    const card = e.target.closest('.project-card--graphic, .project-card--ecom, .featured-card--sub, .js-open-project-btn');
    if (card) {
      e.preventDefault();
      const target = card.classList.contains('js-open-project-btn') ? card.closest('.featured-card--main') : card;
      if (target) openProjectModal(target);
    }
  });

  // --------------------------------------------------------------------------
  // 6. Copy Email to Clipboard
  // --------------------------------------------------------------------------
  const copyEmailBtns = document.querySelectorAll('.js-copy-email');
  const toast = document.getElementById('toast');

  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 2800);
  };

  copyEmailBtns.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const email = 'ethicsmediamarketing@outlook.com';
      try {
        await navigator.clipboard.writeText(email);
        showToast('Email copied to clipboard: ' + email);
      } catch (err) {
        window.location.href = 'mailto:' + email;
      }
    });
  });

  // --------------------------------------------------------------------------
  // 7. Scroll Reveal Observer
  // --------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal-fade');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.02,
      rootMargin: '100px 0px 50px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }

  // --------------------------------------------------------------------------
  // 8. Interactive Services Radial Scatter & Capability Map Controller
  // --------------------------------------------------------------------------
  const initServicesScatter = () => {
    const stage = document.getElementById('services-stage');
    const hub = document.getElementById('services-hub');
    const svg = document.getElementById('services-svg');
    const cards = document.querySelectorAll('.service-card--interactive');
    const particlesContainer = document.getElementById('services-particles');

    if (!stage || !hub || cards.length === 0) return;

    // Ambient floating particles
    if (particlesContainer && particlesContainer.children.length === 0) {
      const particleColors = ['#0047FF', '#00E5FF', '#94A3B8', '#CBD5E1'];
      for (let i = 0; i < 16; i++) {
        const p = document.createElement('div');
        p.className = 'service-particle';
        const size = Math.floor(Math.random() * 5) + 3;
        const color = particleColors[Math.floor(Math.random() * particleColors.length)];
        const left = Math.floor(Math.random() * 90) + 5;
        const top = Math.floor(Math.random() * 85) + 8;
        const delay = (Math.random() * 4).toFixed(2);
        const duration = (Math.random() * 5 + 4).toFixed(2);

        p.style.width = `${size}px`;
        p.style.height = `${size}px`;
        p.style.backgroundColor = color;
        p.style.left = `${left}%`;
        p.style.top = `${top}%`;
        p.style.opacity = (Math.random() * 0.35 + 0.15).toFixed(2);
        p.style.animation = `hubParticleDrift ${duration}s ease-in-out ${delay}s infinite alternate`;
        particlesContainer.appendChild(p);
      }
    }

    // Dynamic SVG Connection Lines
    let animLoopId = null;
    const drawLines = () => {
      if (!svg || window.innerWidth < 768) return;
      const stageRect = stage.getBoundingClientRect();
      const hubRect = hub.getBoundingClientRect();

      const hubX = hubRect.left + hubRect.width / 2 - stageRect.left;
      const hubY = hubRect.top + hubRect.height / 2 - stageRect.top;

      cards.forEach((card, idx) => {
        const line = document.getElementById(`svg-line-${idx}`);
        if (!line) return;

        const cardRect = card.getBoundingClientRect();
        const cardX = cardRect.left + cardRect.width / 2 - stageRect.left;
        const cardY = cardRect.top + cardRect.height / 2 - stageRect.top;

        const midX = (hubX + cardX) / 2;
        const midY = (hubY + cardY) / 2;
        const curveSign = idx % 2 === 0 ? 1 : -1;
        const cpx = midX + curveSign * 16;
        const cpy = midY - curveSign * 16;

        line.setAttribute('d', `M ${hubX.toFixed(1)} ${hubY.toFixed(1)} Q ${cpx.toFixed(1)} ${cpy.toFixed(1)} ${cardX.toFixed(1)} ${cardY.toFixed(1)}`);
      });
    };

    const startAnimationLoop = (durationMs = 850) => {
      if (animLoopId) cancelAnimationFrame(animLoopId);
      const startTime = performance.now();

      const loop = (currentTime) => {
        drawLines();
        if (currentTime - startTime < durationMs) {
          animLoopId = requestAnimationFrame(loop);
        } else {
          drawLines();
          animLoopId = null;
        }
      };
      animLoopId = requestAnimationFrame(loop);
    };

    let isPinned = false;
    hub.addEventListener('mouseenter', () => {
      stage.classList.add('is-scattered');
      startAnimationLoop(850);
    });

    hub.addEventListener('mouseleave', () => {
      if (!isPinned) {
        stage.classList.remove('is-scattered');
        startAnimationLoop(850);
      }
    });

    const toggleHubState = () => {
      isPinned = !isPinned;
      hub.classList.toggle('is-active', isPinned);
      stage.classList.toggle('is-scattered', isPinned);
      hub.setAttribute('aria-expanded', isPinned ? 'true' : 'false');
      startAnimationLoop(850);
    };

    hub.addEventListener('click', (e) => {
      e.preventDefault();
      toggleHubState();
    });

    cards.forEach((card, idx) => {
      const line = document.getElementById(`svg-line-${idx}`);

      card.addEventListener('mouseenter', () => {
        if (line) {
          line.style.stroke = '#0047FF';
          line.style.strokeWidth = '2.5';
          line.style.opacity = '1';
        }
      });

      card.addEventListener('mouseleave', () => {
        if (line) {
          line.style.stroke = '';
          line.style.strokeWidth = '';
          line.style.opacity = '';
        }
      });

      card.addEventListener('click', (e) => {
        e.stopPropagation();
        const wasActive = card.classList.contains('is-active');
        cards.forEach(c => c.classList.remove('is-active'));
        if (!wasActive) {
          card.classList.add('is-active');
        }
        startAnimationLoop(450);
      });
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.service-card--interactive') && !e.target.closest('.services-hub')) {
        cards.forEach(c => c.classList.remove('is-active'));
      }
    });

    window.addEventListener('resize', drawLines, { passive: true });
    drawLines();
    requestAnimationFrame(drawLines);
    setTimeout(drawLines, 200);
    setTimeout(drawLines, 500);
  };

  // --------------------------------------------------------------------------
  // 9. 5-Step Process Progressive Scroll Draw Line
  // --------------------------------------------------------------------------
  const initProcessProgress = () => {
    const processSection = document.getElementById('process');
    const lineFill = document.getElementById('process-line-fill');
    const stepItems = document.querySelectorAll('.process-step-item');

    if (!processSection || !lineFill || !stepItems.length) return;

    const totalLength = 880;
    lineFill.style.strokeDasharray = `${totalLength}`;
    lineFill.style.strokeDashoffset = `${totalLength}`;

    const updateProcessProgress = () => {
      const rect = processSection.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (rect.top <= windowHeight && rect.bottom >= 0) {
        const progress = Math.min(Math.max((windowHeight * 0.7 - rect.top) / (rect.height * 0.85), 0), 1);
        const offset = totalLength - (progress * totalLength);
        lineFill.style.strokeDashoffset = `${offset}`;

        stepItems.forEach((step, idx) => {
          const stepThreshold = idx / (stepItems.length - 1);
          if (progress >= stepThreshold - 0.05) {
            step.classList.add('is-active');
          } else if (idx > 0) {
            step.classList.remove('is-active');
          }
        });
      }
    };

    window.addEventListener('scroll', updateProcessProgress, { passive: true });
    updateProcessProgress();
  };

  // --------------------------------------------------------------------------
  // 10. Horizontal Elliptical Tools Orbit Controller (Always 100% Upright)
  // --------------------------------------------------------------------------
  const initToolsOrbitCompact = () => {
    const stage = document.getElementById('tools-dock-stage');
    const nodes = document.querySelectorAll('.tool-orbit-node-compact');
    const prevBtn = document.getElementById('tools-prev-btn');
    const nextBtn = document.getElementById('tools-next-btn');
    const infoPill = document.getElementById('tools-orbit-info');
    const infoText = infoPill ? (infoPill.querySelector('.tools-info__text') || infoPill) : null;
    const emmCore = document.getElementById('emm-tools-core');

    if (!stage || nodes.length === 0) return;

    let angle = 0;
    const speed = 0.0035;
    let isPaused = false;
    let targetAngleOffset = 0;
    let currentAngleOffset = 0;

    const layoutNodes = () => {
      const stageWidth = stage.offsetWidth;
      const rx = Math.min(350, Math.max(130, (stageWidth - 110) / 2));
      const ry = Math.min(85, Math.max(50, rx * 0.25));

      if (!isPaused) {
        angle += speed;
      }
      currentAngleOffset += (targetAngleOffset - currentAngleOffset) * 0.12;
      const totalAngle = angle + currentAngleOffset;

      nodes.forEach((node, idx) => {
        const nodeAngle = (idx / nodes.length) * Math.PI * 2 + totalAngle;
        const x = Math.cos(nodeAngle) * rx;
        const y = Math.sin(nodeAngle) * ry;

        const depth = (Math.sin(nodeAngle) + 1) / 2;
        const scale = (0.92 + depth * 0.14).toFixed(3);
        const zIndex = Math.round(4 + depth * 10);
        const opacity = (0.85 + depth * 0.15).toFixed(2);

        node.style.transform = `translate(calc(-50% + ${x.toFixed(1)}px), calc(-50% + ${y.toFixed(1)}px)) scale(${scale})`;
        node.style.zIndex = zIndex;
        node.style.opacity = opacity;
      });

      requestAnimationFrame(layoutNodes);
    };

    requestAnimationFrame(layoutNodes);

    // Pause on hover
    stage.addEventListener('mouseenter', () => { isPaused = true; });
    stage.addEventListener('mouseleave', () => { isPaused = false; });
    stage.addEventListener('touchstart', () => { isPaused = true; }, { passive: true });
    stage.addEventListener('touchend', () => { isPaused = false; });

    // Node hover/focus info updates
    nodes.forEach(node => {
      const name = node.getAttribute('data-name') || '';
      const role = node.getAttribute('data-role') || '';

      const showInfo = () => {
        if (infoText && name) {
          infoText.innerHTML = `<strong>${name}</strong> — ${role}`;
        }
        if (infoPill) {
          infoPill.style.borderColor = '#0047FF';
          infoPill.style.boxShadow = '0 6px 20px rgba(0, 71, 255, 0.15)';
        }
        node.style.zIndex = 30;
      };

      const resetInfo = () => {
        if (infoText) {
          infoText.textContent = '✦ Hover or tap any tool to inspect agency capability';
        }
        if (infoPill) {
          infoPill.style.borderColor = '';
          infoPill.style.boxShadow = '';
        }
      };

      node.addEventListener('mouseenter', showInfo);
      node.addEventListener('mouseleave', resetInfo);
      node.addEventListener('focus', showInfo);
      node.addEventListener('blur', resetInfo);
      node.addEventListener('click', showInfo);
    });

    if (emmCore) {
      emmCore.addEventListener('mouseenter', () => {
        if (infoText) {
          infoText.innerHTML = '<strong>Ethics Media Marketing Core</strong> — Integrated Growth Strategy, Production & Attribution Engine';
        }
        if (infoPill) {
          infoPill.style.borderColor = '#0047FF';
          infoPill.style.boxShadow = '0 6px 20px rgba(0, 71, 255, 0.2)';
        }
      });
      emmCore.addEventListener('mouseleave', () => {
        if (infoText) {
          infoText.textContent = '✦ Hover or tap any tool to inspect agency capability';
        }
        if (infoPill) {
          infoPill.style.borderColor = '';
          infoPill.style.boxShadow = '';
        }
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        targetAngleOffset -= Math.PI / 4;
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        targetAngleOffset += Math.PI / 4;
      });
    }

    // Drag / Swipe to rotate orbit
    let isDown = false;
    let startX = 0;

    stage.addEventListener('mousedown', (e) => {
      if (e.target.closest('.tools-nav-btn')) return;
      isDown = true;
      startX = e.pageX;
      isPaused = true;
    });

    window.addEventListener('mouseup', () => {
      if (isDown) {
        isDown = false;
        isPaused = false;
      }
    });

    stage.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      const deltaX = e.pageX - startX;
      startX = e.pageX;
      targetAngleOffset += deltaX * 0.006;
    });

    let touchStartX = 0;
    stage.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    stage.addEventListener('touchmove', (e) => {
      const deltaX = e.touches[0].clientX - touchStartX;
      touchStartX = e.touches[0].clientX;
      targetAngleOffset += deltaX * 0.008;
    }, { passive: true });
  };

  // --------------------------------------------------------------------------
  // 11. Work Filter Bar Arrows & Discipline Ribbon Controller (Ref 2)
  // --------------------------------------------------------------------------
  const initWorkFiltersNav = () => {
    const filterBar = document.getElementById('work-filter-bar');
    const prevBtn = document.getElementById('filter-prev-btn');
    const nextBtn = document.getElementById('filter-next-btn');
    const disciplineItems = document.querySelectorAll('.discipline-item');
    const disciplineNextBtn = document.getElementById('discipline-next-btn');
    const filterButtons = document.querySelectorAll('.filter-btn');

    if (filterBar) {
      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          filterBar.scrollBy({ left: -180, behavior: 'smooth' });
        });
      }
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          filterBar.scrollBy({ left: 180, behavior: 'smooth' });
        });
      }
    }

    disciplineItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const filter = item.getAttribute('data-filter');
        const targetBtn = Array.from(filterButtons).find(b => b.getAttribute('data-filter') === filter);
        if (targetBtn) {
          targetBtn.click();
          const workSection = document.getElementById('work');
          if (workSection) {
            workSection.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    });

    if (disciplineNextBtn) {
      disciplineNextBtn.addEventListener('click', () => {
        const activeIdx = Array.from(filterButtons).findIndex(b => b.classList.contains('is-active'));
        const nextIdx = (activeIdx + 1) % filterButtons.length;
        filterButtons[nextIdx].click();
      });
    }
  };

  // --------------------------------------------------------------------------
  // 12. Horizontal Project Reel Carousel Controller (Ref 2)
  // --------------------------------------------------------------------------
  const initFeaturedCarousel = () => {
    const container = document.getElementById('project-reel-container');
    const track = document.getElementById('project-reel-track');
    const prevBtn = document.getElementById('reel-prev-btn');
    const nextBtn = document.getElementById('reel-next-btn');

    if (!container || !track) return;

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        container.scrollBy({ left: -260, behavior: 'smooth' });
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        container.scrollBy({ left: 260, behavior: 'smooth' });
      });
    }

    const videoReelCards = track.querySelectorAll('.reel-card--video');
    videoReelCards.forEach(card => {
      card.addEventListener('click', () => {
        const videoSrc = card.getAttribute('data-video-src');
        const name = card.querySelector('.reel-card__name')?.textContent || 'Project Reel';
        const sub = card.querySelector('.reel-card__sub')?.textContent || 'Video Feature';
        if (videoSrc) {
          openVideoModal(videoSrc, name, sub);
        }
      });
    });

    let autoScrollInterval = null;
    let isHovered = false;

    const startAutoScroll = () => {
      if (autoScrollInterval) clearInterval(autoScrollInterval);
      autoScrollInterval = setInterval(() => {
        if (!isHovered) {
          if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 10) {
            container.scrollLeft = 0;
          } else {
            container.scrollLeft += 1;
          }
        }
      }, 35);
    };

    container.addEventListener('mouseenter', () => { isHovered = true; });
    container.addEventListener('mouseleave', () => { isHovered = false; });
    container.addEventListener('touchstart', () => { isHovered = true; }, { passive: true });
    container.addEventListener('touchend', () => { isHovered = false; });

    startAutoScroll();

    let isDown = false;
    let startX;
    let scrollLeft;

    container.addEventListener('mousedown', (e) => {
      isDown = true;
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
    });

    container.addEventListener('mouseleave', () => { isDown = false; });
    container.addEventListener('mouseup', () => { isDown = false; });

    container.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 1.5;
      container.scrollLeft = scrollLeft - walk;
    });
  };

  // --------------------------------------------------------------------------
  // 13. Dynamic Project Card Deliverables Overlay Injector
  // --------------------------------------------------------------------------
  const initProjectCardHoverInfo = () => {
    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => {
      const deliverables = card.getAttribute('data-deliverables') || card.getAttribute('data-subtitle') || '';
      const visualWrap = card.querySelector('.project-card__visual-wrap');
      if (deliverables && visualWrap && !visualWrap.querySelector('.project-card__hover-info')) {
        const infoEl = document.createElement('div');
        infoEl.className = 'project-card__hover-info';
        infoEl.innerHTML = `
          <span class="project-card__hover-info-label">Deliverables</span>
          <span class="project-card__hover-info-text">${deliverables}</span>
        `;
        visualWrap.appendChild(infoEl);
      }
    });
  };

  // --------------------------------------------------------------------------
  // 14. 3D Perspective Phone Parallax Controller (Featured Section)
  // --------------------------------------------------------------------------
  const initFeaturedParallax = () => {
    const mediaBox = document.querySelector('.featured-card__media-box--perspective');
    const stage = document.querySelector('.phone-perspective-stage');
    if (!mediaBox || !stage) return;

    mediaBox.addEventListener('mousemove', (e) => {
      const rect = mediaBox.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      const tiltX = (x * 12).toFixed(2);
      const tiltY = (-y * 12).toFixed(2);

      stage.style.transform = `rotateY(${tiltX}deg) rotateX(${tiltY}deg)`;
      stage.style.transition = 'transform 0.1s ease-out';
    });

    mediaBox.addEventListener('mouseleave', () => {
      stage.style.transform = 'rotateY(0deg) rotateX(0deg)';
      stage.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    });
  };

  // Initialize all modular controllers
  initServicesScatter();
  initProcessProgress();
  initToolsOrbitCompact();
  initWorkFiltersNav();
  initFeaturedCarousel();
  initProjectCardHoverInfo();
  initFeaturedParallax();
});
