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

  const mobileDrawerCta = document.querySelector('.mobile-drawer__bottom a');
  if (mobileDrawerCta) {
    mobileDrawerCta.addEventListener('click', closeDrawer);
  }

  // --------------------------------------------------------------------------
  // 3. Category Filter Tabs are managed directly inside the Work Reels Controller
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
  // --------------------------------------------------------------------------
  // 8. Services Ecosystem Dynamic Radial Stage Controller (Reference)
  // --------------------------------------------------------------------------
  const initServicesEcosystem = () => {
    const stage = document.getElementById('services-ecosystem-stage');
    const core = document.getElementById('emm-ecosystem-core');
    const svg = document.getElementById('services-ecosystem-svg');
    if (!stage || !core) return;

    const cards = stage.querySelectorAll('.eco-service-card');

    // Tool mapping for interactive cross-highlight
    const serviceToolMap = {
      'video': ['Premiere Pro', 'After Effects', 'DaVinci Resolve', 'CapCut'],
      'design': ['Photoshop', 'Figma', 'Canva', 'Lightroom'],
      'marketing': ['Meta Ads', 'Google Ads', 'Google Analytics'],
      'strategy': ['ChatGPT', 'Notion', 'Google Workspace'],
      'cro': ['Google Analytics', 'Shopify', 'Meta Ads'],
      'retention': ['WhatsApp Business', 'Notion', 'Make'],
      'web': ['Shopify', 'Figma', 'Google Analytics'],
      'automation': ['n8n', 'Make', 'Notion', 'WhatsApp Business']
    };

    const highlightTools = (serviceKey) => {
      const toolNames = serviceToolMap[serviceKey] || [];
      const toolNodes = document.querySelectorAll('.tools-orbit-stage .tool-orbit-node');
      toolNodes.forEach(node => {
        const toolName = node.getAttribute('data-tool');
        if (toolNames.includes(toolName)) {
          node.classList.add('is-active');
        } else {
          node.classList.remove('is-active');
        }
      });
    };

    const resetTools = () => {
      const toolNodes = document.querySelectorAll('.tools-orbit-stage .tool-orbit-node');
      toolNodes.forEach(node => node.classList.remove('is-active'));
    };

    // Calculate dynamic bezier curves on desktop
    const updateLines = () => {
      if (!svg || window.innerWidth < 992) return;
      const stageRect = stage.getBoundingClientRect();
      const coreRect = core.getBoundingClientRect();

      const coreX = coreRect.left + coreRect.width / 2 - stageRect.left;
      const coreY = coreRect.top + coreRect.height / 2 - stageRect.top;

      cards.forEach((card, idx) => {
        const line = document.getElementById(`eco-line-${idx}`);
        if (!line) return;

        const cardRect = card.getBoundingClientRect();
        const cardX = cardRect.left + cardRect.width / 2 - stageRect.left;
        const cardY = cardRect.top + cardRect.height / 2 - stageRect.top;

        // Curve control point slightly offset for organic cosmic aesthetic
        const midX = (coreX + cardX) / 2;
        const midY = (coreY + cardY) / 2;
        const curveOffset = (idx % 2 === 0 ? 1 : -1) * 18;
        const cpx = midX + curveOffset;
        const cpy = midY - curveOffset;

        line.setAttribute('d', `M ${coreX.toFixed(1)} ${coreY.toFixed(1)} Q ${cpx.toFixed(1)} ${cpy.toFixed(1)} ${cardX.toFixed(1)} ${cardY.toFixed(1)}`);
      });
    };

    // Card hover & touch interactions
    cards.forEach((card, idx) => {
      const line = document.getElementById(`eco-line-${idx}`);
      const serviceKey = card.getAttribute('data-service') || '';

      const activateCard = () => {
        cards.forEach(c => c.classList.remove('is-active'));
        card.classList.add('is-active');
        stage.classList.add('has-active-card');
        core.classList.add('is-active');

        document.querySelectorAll('.eco-connector-line').forEach(l => l.classList.remove('is-active'));
        if (line) line.classList.add('is-active');

        highlightTools(serviceKey);
      };

      const deactivateCard = () => {
        card.classList.remove('is-active');
        stage.classList.remove('has-active-card');
        core.classList.remove('is-active');
        if (line) line.classList.remove('is-active');
        resetTools();
      };

      card.addEventListener('mouseenter', activateCard);
      card.addEventListener('mouseleave', deactivateCard);
      card.addEventListener('focus', activateCard);
      card.addEventListener('blur', deactivateCard);

      card.addEventListener('click', (e) => {
        e.stopPropagation();
        if (card.classList.contains('is-active')) {
          deactivateCard();
        } else {
          activateCard();
        }
      });
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.eco-service-card') && !e.target.closest('.emm-ecosystem-core')) {
        cards.forEach(c => c.classList.remove('is-active'));
        stage.classList.remove('has-active-card');
        core.classList.remove('is-active');
        document.querySelectorAll('.eco-connector-line').forEach(l => l.classList.remove('is-active'));
        resetTools();
      }
    });

    window.addEventListener('resize', updateLines, { passive: true });
    updateLines();
    requestAnimationFrame(updateLines);
    setTimeout(updateLines, 250);
    setTimeout(updateLines, 600);
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
  // --------------------------------------------------------------------------
  // 10. Tools Ecosystem Multi-Track 3D Orbit Controller (Reference 1)
    // --------------------------------------------------------------------------
  // 10. Cosmic Tools Orbit Ecosystem (3 Concentric Rings, 21 Brand Logos)
    // --------------------------------------------------------------------------
  // 10. Cosmic Tools Orbit Ecosystem (3 Concentric Rings, 21 Brand Logos)
  // --------------------------------------------------------------------------
  const initToolsEcosystemOrbit = () => {
    const stage = document.getElementById('tools-orbit-stage');
    if (!stage) return;
    const nodes = stage.querySelectorAll('.tool-orbit-node');
    const tooltip = document.getElementById('tools-orbit-tooltip');
    const tooltipText = document.getElementById('tools-tooltip-text');
    const emmCore = document.getElementById('emm-orbit-core');

    if (nodes.length === 0) return;

    const innerNodes = Array.from(nodes).filter(n => n.getAttribute('data-orbit') === 'inner');
    const middleNodes = Array.from(nodes).filter(n => n.getAttribute('data-orbit') === 'middle');
    const outerNodes = Array.from(nodes).filter(n => n.getAttribute('data-orbit') === 'outer');

    let baseAngleInner = 0.2;
    let baseAngleMiddle = 0.65;
    let baseAngleOuter = 1.15;

    const defaultSpeedOuter = 0.0035;
    const defaultSpeedMiddle = 0.0050;
    const defaultSpeedInner = 0.0070;

    let targetSpeedOuter = defaultSpeedOuter;
    let targetSpeedMiddle = defaultSpeedMiddle;
    let targetSpeedInner = defaultSpeedInner;

    let speedOuter = defaultSpeedOuter;
    let speedMiddle = defaultSpeedMiddle;
    let speedInner = defaultSpeedInner;

    let manualOffset = 0;
    let targetManualOffset = 0;
    let activeNode = null;

    const layoutOrbit = () => {
      const stageWidth = stage.offsetWidth || 1100;
      const stageHeight = stage.offsetHeight || 540;
      const centerX = stageWidth / 2;
      const centerY = stageHeight / 2;
      const isMobile = window.innerWidth < 768;

      // 3 Concentric Elliptical Radii
      const rxOuter = isMobile
        ? Math.max(145, Math.min(195, (stageWidth - 20) / 2))
        : Math.min(490, Math.max(300, (stageWidth - 80) / 2));
      const ryOuter = isMobile ? rxOuter * 0.75 : Math.min(250, (stageHeight - 60) / 2);

      const rxMiddle = rxOuter * 0.73;
      const ryMiddle = ryOuter * 0.74;

      const rxInner = rxOuter * 0.47;
      const ryInner = ryOuter * 0.46;

      // Smooth inertia & speed adjustments
      speedOuter += (targetSpeedOuter - speedOuter) * 0.08;
      speedMiddle += (targetSpeedMiddle - speedMiddle) * 0.08;
      speedInner += (targetSpeedInner - speedInner) * 0.08;
      manualOffset += (targetManualOffset - manualOffset) * 0.12;

      baseAngleOuter += speedOuter;
      baseAngleMiddle += speedMiddle;
      baseAngleInner += speedInner;

      const totalAngleOuter = baseAngleOuter + manualOffset;
      const totalAngleMiddle = baseAngleMiddle + manualOffset * 1.1;
      const totalAngleInner = baseAngleInner + manualOffset * 1.25;

      const updateNodeGroup = (nodeList, radiusX, radiusY, baseAngle, baseZIndex) => {
        const total = nodeList.length;
        nodeList.forEach((node, idx) => {
          const angle = (idx / total) * Math.PI * 2 + baseAngle;
          const x = centerX + Math.cos(angle) * radiusX;
          const y = centerY + Math.sin(angle) * radiusY;

          // Depth metric: 0 at back, 1 at front
          const depth = (Math.sin(angle) + 1) / 2;
          const scale = (0.88 + depth * 0.20).toFixed(3);
          const zIndex = Math.round(baseZIndex + depth * 20);

          if (node === activeNode || node.classList.contains('is-active')) {
            node.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -50%) scale(1.22)`;
            node.style.zIndex = '60';
            node.style.opacity = '1';
          } else {
            node.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -50%) scale(${scale})`;
            node.style.zIndex = zIndex;
            node.style.opacity = node.classList.contains('is-dimmed') ? '0.35' : '1';
          }
        });
      };

      updateNodeGroup(outerNodes, rxOuter, ryOuter, totalAngleOuter, 10);
      updateNodeGroup(middleNodes, rxMiddle, ryMiddle, totalAngleMiddle, 16);
      updateNodeGroup(innerNodes, rxInner, ryInner, totalAngleInner, 22);

      requestAnimationFrame(layoutOrbit);
    };

    requestAnimationFrame(layoutOrbit);

    // Hover slowdown
    stage.addEventListener('mouseenter', () => {
      targetSpeedOuter = 0.0006;
      targetSpeedMiddle = 0.0008;
      targetSpeedInner = 0.0010;
    });

    stage.addEventListener('mouseleave', () => {
      targetSpeedOuter = defaultSpeedOuter;
      targetSpeedMiddle = defaultSpeedMiddle;
      targetSpeedInner = defaultSpeedInner;
      activeNode = null;
      nodes.forEach(n => {
        n.classList.remove('is-active');
        n.classList.remove('is-dimmed');
      });
      if (tooltipText) tooltipText.textContent = 'Hover or tap any tool to inspect agency capability';
      if (tooltip) {
        tooltip.style.borderColor = '';
        tooltip.style.boxShadow = '';
      }
    });

    // Tool node hover & focus activations
    nodes.forEach(node => {
      const toolName = node.getAttribute('data-tool') || '';
      const category = node.getAttribute('data-category') || '';
      const role = node.getAttribute('data-role') || '';

      const activateTool = () => {
        activeNode = node;
        nodes.forEach(n => {
          if (n === node) {
            n.classList.add('is-active');
            n.classList.remove('is-dimmed');
          } else {
            n.classList.remove('is-active');
            n.classList.add('is-dimmed');
          }
        });

        if (tooltipText) {
          tooltipText.innerHTML = `<strong>${toolName}</strong> (${category}) — ${role}`;
        }
        if (tooltip) {
          tooltip.style.borderColor = '#00d2ff';
          tooltip.style.boxShadow = '0 0 25px rgba(0, 180, 255, 0.4)';
        }
      };

      node.addEventListener('mouseenter', activateTool);
      node.addEventListener('focus', activateTool);
      node.addEventListener('click', (e) => {
        e.stopPropagation();
        activateTool();
      });
    });

    // Center Core interaction
    if (emmCore) {
      emmCore.addEventListener('mouseenter', () => {
        if (tooltipText) {
          tooltipText.innerHTML = '<strong>Ethics Media Marketing Creative Stack</strong> — 21 Production Tools for End-to-End Creative &amp; Growth Performance';
        }
        if (tooltip) {
          tooltip.style.borderColor = '#00d2ff';
          tooltip.style.boxShadow = '0 0 30px rgba(0, 140, 255, 0.5)';
        }
      });
    }

    // Drag / Touch to Spin with Inertia
    let isDown = false;
    let startX = 0;

    stage.addEventListener('mousedown', (e) => {
      isDown = true;
      startX = e.pageX;
      targetSpeedOuter = 0;
      targetSpeedMiddle = 0;
      targetSpeedInner = 0;
    });

    window.addEventListener('mouseup', () => {
      if (isDown) {
        isDown = false;
        targetSpeedOuter = defaultSpeedOuter;
        targetSpeedMiddle = defaultSpeedMiddle;
        targetSpeedInner = defaultSpeedInner;
      }
    });

    stage.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      const deltaX = e.pageX - startX;
      startX = e.pageX;
      targetManualOffset += deltaX * 0.005;
    });

    let touchStartX = 0;
    stage.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      targetSpeedOuter = 0.0006;
      targetSpeedMiddle = 0.0008;
      targetSpeedInner = 0.0010;
    }, { passive: true });

    stage.addEventListener('touchmove', (e) => {
      const deltaX = e.touches[0].clientX - touchStartX;
      touchStartX = e.touches[0].clientX;
      targetManualOffset += deltaX * 0.007;
    }, { passive: true });
  };

  // --------------------------------------------------------------------------
  // 11. Selected Work Continuous Moving 9:16 Reels Feed (Reference 2)
  // --------------------------------------------------------------------------
  const initWorkReelsCarousel = () => {
    const stage = document.getElementById('work-reels-stage');
    const viewport = document.getElementById('work-reels-viewport');
    const track = document.getElementById('portfolio-grid');
    const prevBtn = document.getElementById('reel-prev-btn');
    const nextBtn = document.getElementById('reel-next-btn');
    const filterBtns = document.querySelectorAll('.work__filter-bar .filter-btn');

    if (!stage || !viewport || !track) return;

    // Ensure Set B (clones) exists for continuous seamless infinite loop
    let originalCards = Array.from(track.querySelectorAll('.work-reel-card:not(.is-clone)'));
    let cloneCards = Array.from(track.querySelectorAll('.work-reel-card.is-clone'));

    if (cloneCards.length === 0 && originalCards.length > 0) {
      const fragment = document.createDocumentFragment();
      originalCards.forEach(card => {
        const clone = card.cloneNode(true);
        clone.classList.add('is-clone');
        clone.setAttribute('aria-hidden', 'true');
        clone.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
        fragment.appendChild(clone);
      });
      track.appendChild(fragment);
      cloneCards = Array.from(track.querySelectorAll('.work-reel-card.is-clone'));
    }

    let position = 0;
    let speed = 1.1; // Smooth noticeable forward reel drift
    let targetSpeed = 1.1;
    let isHovered = false;
    let isDragging = false;
    let dragStartX = 0;
    let singleSetWidth = 0;

    const updateSetWidth = () => {
      const visibleOriginals = Array.from(track.querySelectorAll('.work-reel-card:not(.is-clone)')).filter(c => c.style.display !== 'none');
      const visibleClones = Array.from(track.querySelectorAll('.work-reel-card.is-clone')).filter(c => c.style.display !== 'none');

      if (visibleOriginals.length > 0 && visibleClones.length > 0) {
        singleSetWidth = visibleClones[0].offsetLeft - visibleOriginals[0].offsetLeft;
      }
      if (!singleSetWidth || singleSetWidth <= 50) {
        let total = 0;
        visibleOriginals.forEach(c => {
          total += (c.offsetWidth || 260) + 20; // card width + gap (20px)
        });
        singleSetWidth = total > 0 ? total : track.scrollWidth / 2;
      }
    };

    updateSetWidth();
    window.addEventListener('load', updateSetWidth);
    window.addEventListener('resize', updateSetWidth);

    // Continuous Infinite Marquee RAF Loop
    const renderLoop = () => {
      if (!singleSetWidth || singleSetWidth <= 50) {
        updateSetWidth();
      }

      if (singleSetWidth > 50) {
        if (!isHovered && !isDragging) {
          speed += (targetSpeed - speed) * 0.1;
          position -= speed;
        }

        // Seamless wrap without jumping
        if (position <= -singleSetWidth) {
          position += singleSetWidth;
        } else if (position > 0) {
          position -= singleSetWidth;
        }

        track.style.transform = `translate3d(${position.toFixed(2)}px, 0, 0)`;
      }

      requestAnimationFrame(renderLoop);
    };

    requestAnimationFrame(renderLoop);

    // Pause on hover
    stage.addEventListener('mouseenter', () => {
      isHovered = true;
      targetSpeed = 0;
    });

    stage.addEventListener('mouseleave', () => {
      isHovered = false;
      targetSpeed = 1.1;
      isDragging = false;
      stage.classList.remove('is-dragging');
    });

    // Desktop Mouse Drag
    stage.addEventListener('mousedown', (e) => {
      if (e.target.closest('button') || e.target.closest('a')) return;
      isDragging = true;
      dragStartX = e.pageX;
      stage.classList.add('is-dragging');
    });

    window.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        stage.classList.remove('is-dragging');
      }
    });

    stage.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const deltaX = e.pageX - dragStartX;
      dragStartX = e.pageX;
      position += deltaX * 1.1;
    });

    // Mobile Touch Swipe
    let touchX = 0;
    stage.addEventListener('touchstart', (e) => {
      touchX = e.touches[0].clientX;
      isHovered = true;
      targetSpeed = 0;
    }, { passive: true });

    stage.addEventListener('touchmove', (e) => {
      const deltaX = e.touches[0].clientX - touchX;
      touchX = e.touches[0].clientX;
      position += deltaX * 1.2;
    }, { passive: true });

    stage.addEventListener('touchend', () => {
      setTimeout(() => {
        isHovered = false;
        targetSpeed = 1.1;
      }, 1000);
    });

    // Arrow Controls
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        position += 320;
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        position -= 320;
      });
    }

    // Video auto-preview on desktop hover & click modals via Event Delegation on track
    track.addEventListener('mouseenter', (e) => {
      const card = e.target.closest('.work-reel-card');
      if (!card) return;
      const video = card.querySelector('.work-reel-card__video');
      if (video) video.play().catch(() => {});
    }, true);

    track.addEventListener('mouseleave', (e) => {
      const card = e.target.closest('.work-reel-card');
      if (!card) return;
      const video = card.querySelector('.work-reel-card__video');
      if (video) video.pause();
    }, true);

    track.addEventListener('click', (e) => {
      const card = e.target.closest('.work-reel-card');
      if (!card) return;
      const videoSrc = card.getAttribute('data-video-src');
      const title = card.getAttribute('data-title') || 'Project Showcase';
      const subtitle = card.getAttribute('data-subtitle') || '';

      if (videoSrc) {
        e.preventDefault();
        openVideoModal(videoSrc, title, subtitle);
      } else {
        e.preventDefault();
        openProjectModal(card);
      }
    });

    // Category Filter System
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => {
          b.classList.remove('is-active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('is-active');
        btn.setAttribute('aria-selected', 'true');

        const filter = btn.getAttribute('data-filter') || 'all';

        const allCards = track.querySelectorAll('.work-reel-card');
        allCards.forEach(card => {
          const cat = card.getAttribute('data-category') || '';
          const filterCat = card.getAttribute('data-filter-category') || '';
          const matches = (filter === 'all' || cat === filter || filterCat === filter);

          if (matches) {
            card.style.display = '';
            card.style.opacity = '1';
          } else {
            card.style.display = 'none';
          }
        });

        position = 0;
        track.style.transform = 'translate3d(0, 0, 0)';
        updateSetWidth();
      });
    });
  };

  // 13. Dynamic Project Card
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
  console.log('>>> DOMContentLoaded fired');
  try { console.log('>>> Calling initServicesEcosystem'); initServicesEcosystem(); } catch(e) { console.error('Error in initServicesEcosystem:', e); }
  try { console.log('>>> Calling initProcessProgress'); initProcessProgress(); } catch(e) { console.error('Error in initProcessProgress:', e); }
  try { console.log('>>> Calling initToolsEcosystemOrbit'); initToolsEcosystemOrbit(); } catch(e) { console.error('Error in initToolsEcosystemOrbit:', e); }
  try { console.log('>>> Calling initWorkReelsCarousel'); initWorkReelsCarousel(); } catch(e) { console.error('Error in initWorkReelsCarousel:', e); }
  initProjectCardHoverInfo();
  initFeaturedParallax();
});
