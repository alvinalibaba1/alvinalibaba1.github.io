        // Enhanced Mobile menu toggle
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navLinks = document.querySelector('.nav-links');
        
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
            
            // Add haptic feedback simulation
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
        });
        
        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
        
        // Enhanced Scroll progress bar
        function updateProgressBar() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollPercentage = (scrollTop / scrollHeight) * 100;
            document.querySelector('.progress-bar').style.width = scrollPercentage + '%';
        }
        
        window.addEventListener('scroll', updateProgressBar);
        
        // Enhanced Fade in animation on scroll
        function handleScrollAnimations() {
            const elements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .fade-in-scale');
            elements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                const elementVisible = 150;
                
                if (elementTop < window.innerHeight - elementVisible) {
                    element.classList.add('visible');
                }
            });
        }
        
        window.addEventListener('scroll', handleScrollAnimations);
        handleScrollAnimations(); // Run once on load
        
        // Smooth scroll for navigation links with easing
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
        
        // Enhanced Modal functions with animation
        function openModal(modalId) {
            const modal = document.getElementById(modalId);
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';

            initializeMediaGalleries(modalId);
            
            // Trigger modal animations
            setTimeout(() => {
                modal.style.opacity = '1';
            }, 10);
        }
        
        function closeModal(modalId) {
            const modal = document.getElementById(modalId);
            modal.style.opacity = '0';
            setTimeout(() => {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }, 300);
        }
        
        // Close modal when clicking outside
        window.addEventListener('click', function(event) {
            if (event.target.classList.contains('modal')) {
                const modal = event.target;
                modal.style.opacity = '0';
                setTimeout(() => {
                    modal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }, 300);
            }
        });

        // OPTIMIZED Media Gallery Functions - Performance focused
        function initializeMediaGalleries(modalId) {
            const modal = document.getElementById(modalId);
            const mediaContainers = modal.querySelectorAll('.media-container');
            
            mediaContainers.forEach(container => {
                const slider = container.querySelector('.media-slider');
                const items = slider.querySelectorAll('.media-item');
                const totalItems = items.length;
                
                // Check if there are more than 3 items to show navigation
                if (totalItems > 3) {
                    container.classList.add('has-overflow');
                    createIndicators(container, totalItems);
                }
                
                // Set initial position
                container.dataset.currentIndex = '0';
                updateSliderPosition(container);
            });
            
            // Detect orientation of media items and load video thumbnails
            detectMediaOrientation();
            generateVideoThumbnails();
        }

        function createIndicators(container, totalItems) {
            const indicatorsContainer = container.parentNode.querySelector('.media-indicators');
            if (!indicatorsContainer) return;
            
            indicatorsContainer.innerHTML = '';
            const itemsPerView = getItemsPerView();
            const totalPages = Math.ceil(totalItems / itemsPerView);
            
            for (let i = 0; i < totalPages; i++) {
                const indicator = document.createElement('div');
                indicator.className = `indicator ${i === 0 ? 'active' : ''}`;
                indicator.onclick = () => goToSlide(container, i);
                indicatorsContainer.appendChild(indicator);
            }
        }

        function getItemsPerView() {
            if (window.innerWidth <= 480) return 1;
            if (window.innerWidth <= 768) return 2;
            return 3;
        }

        function navigateMedia(containerId, direction) {
            const container = document.getElementById(containerId);
            const items = container.querySelectorAll('.media-item');
            const totalItems = items.length;
            const itemsPerView = getItemsPerView();
            const maxIndex = Math.max(0, totalItems - itemsPerView);
            
            let currentIndex = parseInt(container.dataset.currentIndex) || 0;
            currentIndex += direction;
            currentIndex = Math.max(0, Math.min(currentIndex, maxIndex));
            
            container.dataset.currentIndex = currentIndex;
            updateSliderPosition(container);
            updateIndicators(container, Math.floor(currentIndex / itemsPerView));
        }

        function goToSlide(container, slideIndex) {
            const itemsPerView = getItemsPerView();
            const targetIndex = slideIndex * itemsPerView;
            
            container.dataset.currentIndex = targetIndex;
            updateSliderPosition(container);
            updateIndicators(container, slideIndex);
        }

        function updateSliderPosition(container) {
            const slider = container.querySelector('.media-slider');
            const currentIndex = parseInt(container.dataset.currentIndex) || 0;
            const itemsPerView = getItemsPerView();
            const itemWidth = 100 / itemsPerView;
            const translateX = -(currentIndex * itemWidth);
            
            // Use transform3d for better performance
            slider.style.transform = `translate3d(${translateX}%, 0, 0)`;
        }

        function updateIndicators(container, activeIndex) {
            const indicatorsContainer = container.parentNode.querySelector('.media-indicators');
            if (!indicatorsContainer) return;
            
            const indicators = indicatorsContainer.querySelectorAll('.indicator');
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === activeIndex);
            });
        }

        // Auto-detect and apply portrait/landscape classes to gallery items
        function detectMediaOrientation() {
            document.querySelectorAll('.media-item').forEach(item => {
                const img = item.querySelector('img');
                const video = item.querySelector('video');
                
                if (img) {
                    // Check if image is already loaded
                    if (img.complete) {
                        const isPortrait = img.naturalHeight > img.naturalWidth;
                        item.classList.add(isPortrait ? 'portrait' : 'landscape');
                    } else {
                        // Wait for image to load
                        img.addEventListener('load', function() {
                            const isPortrait = this.naturalHeight > this.naturalWidth;
                            item.classList.add(isPortrait ? 'portrait' : 'landscape');
                        });
                    }
                } else if (video) {
                    video.addEventListener('loadedmetadata', function() {
                        const isPortrait = this.videoHeight > this.videoWidth;
                        item.classList.add(isPortrait ? 'portrait' : 'landscape');
                    });
                }
            });
        }

        // Enhanced Media Modal with Portrait Detection
        function openMediaModal(mediaItem) {
            const modal = document.getElementById('media-modal');
            const modalContent = document.getElementById('media-modal-content');
            
            const img = mediaItem.querySelector('img');
            const video = mediaItem.querySelector('video');
            
            if (img) {
                // Create new image to detect dimensions
                const newImg = new Image();
                newImg.onload = function() {
                    const isPortrait = this.naturalHeight > this.naturalWidth;
                    const aspectRatio = this.naturalWidth / this.naturalHeight;
                    
                    // Apply appropriate styling based on orientation
                    if (isPortrait) {
                        modalContent.innerHTML = `<img src="${img.src}" alt="${img.alt}" style="max-width: 60vw; max-height: 90vh; aspect-ratio: ${aspectRatio};">`;
                    } else {
                        modalContent.innerHTML = `<img src="${img.src}" alt="${img.alt}" style="max-width: 90vw; max-height: 70vh; aspect-ratio: ${aspectRatio};">`;
                    }
                };
                newImg.src = img.src;
                
                // Fallback while loading
                modalContent.innerHTML = `<img src="${img.src}" alt="${img.alt}">`;
                
            } else if (video) {
                const videoSrc = video.querySelector('source').src;
                
                // Create temporary video to detect dimensions
                const tempVideo = document.createElement('video');
                tempVideo.addEventListener('loadedmetadata', function() {
                    const isPortrait = this.videoHeight > this.videoWidth;
                    const aspectRatio = this.videoWidth / this.videoHeight;
                    
                    // Apply appropriate styling based on orientation
                    if (isPortrait) {
                        modalContent.innerHTML = `<video controls autoplay style="max-width: 60vw; max-height: 90vh; aspect-ratio: ${aspectRatio};"><source src="${videoSrc}" type="video/mp4"></video>`;
                    } else {
                        modalContent.innerHTML = `<video controls autoplay style="max-width: 90vw; max-height: 70vh; aspect-ratio: ${aspectRatio};"><source src="${videoSrc}" type="video/mp4"></video>`;
                    }
                });
                tempVideo.src = videoSrc;
                
                // Fallback while loading
                modalContent.innerHTML = `<video controls autoplay><source src="${videoSrc}" type="video/mp4"></video>`;
            }
            
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            setTimeout(() => {
                modal.style.opacity = '1';
            }, 10);
        }

        function closeMediaModal() {
            const modal = document.getElementById('media-modal');
            const modalContent = document.getElementById('media-modal-content');
            
            modal.style.opacity = '0';
            setTimeout(() => {
                modal.style.display = 'none';
                modalContent.innerHTML = '';
                document.body.style.overflow = 'auto';
            }, 300);
        }

        // Close media modal when clicking outside or pressing ESC
        window.addEventListener('click', function(event) {
            if (event.target.classList.contains('media-modal')) {
                closeMediaModal();
            }
        });

        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                const mediaModal = document.getElementById('media-modal');
                if (mediaModal.style.display === 'block') {
                    closeMediaModal();
                }
            }
        });
        
        // Close modal with escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                document.querySelectorAll('.modal').forEach(modal => {
                    if (modal.style.display === 'block') {
                        modal.style.opacity = '0';
                        setTimeout(() => {
                            modal.style.display = 'none';
                            document.body.style.overflow = 'auto';
                        }, 300);
                    }
                });
            }
        });
        
        
        // Navigation active state
        function updateActiveNavLink() {
            const sections = document.querySelectorAll('section');
            const navLinks = document.querySelectorAll('.nav-links a');
            
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.getBoundingClientRect().top;
                if (sectionTop <= 100) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').substring(1) === current) {
                    link.classList.add('active');
                }
            });
        }
        
        // OPTIMIZED Video thumbnail generation
        function generateVideoThumbnails() {
            document.querySelectorAll('.media-item video').forEach(video => {
                // Simple thumbnail loading without complex event handling
                video.addEventListener('loadeddata', function() {
                    this.currentTime = 0.1; // Very short time for thumbnail
                    this.pause();
                }, { once: true });
            });
        }
        
        // Performance optimization: Throttle scroll events
        function throttle(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }
        
        // Apply throttling to scroll events for better performance
        const throttledProgressUpdate = throttle(updateProgressBar, 16); // 60fps
        const throttledScrollAnimations = throttle(handleScrollAnimations, 100);
        const throttledNavUpdate = throttle(updateActiveNavLink, 100);
        
        window.removeEventListener('scroll', updateProgressBar);
        window.removeEventListener('scroll', handleScrollAnimations);
        window.removeEventListener('scroll', updateActiveNavLink);
        
        window.addEventListener('scroll', throttledProgressUpdate);
        window.addEventListener('scroll', throttledScrollAnimations);
        window.addEventListener('scroll', throttledNavUpdate);
        
        // Intersection Observer for better performance
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);
        
        // Observe all fade-in elements
        document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .fade-in-scale').forEach(el => {
            observer.observe(el);
        });
        
        // Loading animation with preloader
        window.addEventListener('load', () => {
            // Create and show preloader
            const preloader = document.createElement('div');
            preloader.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: #fff;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                transition: opacity 0.5s ease;
            `;
            
            const spinner = document.createElement('div');
            spinner.style.cssText = `
                width: 50px;
                height: 50px;
                border: 3px solid #f3f3f3;
                border-top: 3px solid #000;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            `;
            
            const spinAnimation = document.createElement('style');
            spinAnimation.textContent = `
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(spinAnimation);
            
            preloader.appendChild(spinner);
            document.body.appendChild(preloader);
            
            // Hide preloader after short delay
            setTimeout(() => {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.remove();
                    spinAnimation.remove();
                }, 500);
            }, 1000);
            
            // Animate body appearance
            document.body.style.opacity = '0';
            document.body.style.transition = 'opacity 0.5s ease';
            setTimeout(() => {
                document.body.style.opacity = '1';
            }, 1200);
        });
        
        // Resize handler for responsive gallery
        let resizeTimeout;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                // Update all visible media galleries
                document.querySelectorAll('.media-container').forEach(container => {
                    if (container.closest('.modal').style.display === 'block') {
                        updateSliderPosition(container);
                        
                        const totalItems = container.querySelectorAll('.media-item').length;
                        if (totalItems > 3) {
                            createIndicators(container, totalItems);
                        }
                    }
                });
            }, 250);
        });
        
        console.log('🚀 Optimized Interactive Portfolio with Project Banners Loaded Successfully!');
        console.log('💼 Alvin Reyvaldo - iOS Developer');
        console.log('⚡ Performance optimized for smooth interactions');
        console.log('📱 Responsive design with GPU acceleration');
        console.log('🖼️ Project banners integrated in grid and modals');
        console.log('📸 Portrait/landscape media support enabled');

// Toggle More Projects
function toggleMoreProjects() {
    const hiddenProjects = document.querySelectorAll('.hidden-project');
    const btn = document.getElementById('moreProjectsBtn');
    const btnText = document.getElementById('btnText');
    const btnIcon = document.getElementById('btnIcon');
    
    hiddenProjects.forEach(project => {
        if (project.style.display === 'none' || project.style.display === '') {
            project.style.display = 'block';
            setTimeout(() => {
                project.classList.add('visible');
            }, 10);
        } else {
            project.style.display = 'none';
            project.classList.remove('visible');
        }
    });
    
    btn.classList.toggle('active');
    
    if (btn.classList.contains('active')) {
        btnText.textContent = 'Show Less Projects';
        btnIcon.textContent = '▲';
    } else {
        btnText.textContent = 'Show More Projects';
        btnIcon.textContent = '▼';
    }
}

// App Store logo cards: delegate click/keyboard to open project modal
const storeGrid = document.querySelector('.appstore-track');
if (storeGrid) {
    storeGrid.addEventListener('click', (event) => {
        const card = event.target.closest('.store-card.logo-only');
        if (!card || !storeGrid.contains(card)) return;
        const appLink = card.dataset.appLink;
        if (!appLink) return;
        window.open(appLink, '_blank', 'noopener');
    });
    storeGrid.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        const card = event.target.closest('.store-card.logo-only');
        if (!card || !storeGrid.contains(card)) return;
        event.preventDefault();
        const appLink = card.dataset.appLink;
        if (!appLink) return;
        window.open(appLink, '_blank', 'noopener');
    });

    storeGrid.addEventListener('auxclick', (event) => {
        if (event.button !== 1) return;
        const card = event.target.closest('.store-card.logo-only');
        if (!card || !storeGrid.contains(card)) return;
        const appLink = card.dataset.appLink;
        if (!appLink) return;
        event.preventDefault();
        window.open(appLink, '_blank', 'noopener');
    });
}

// Auto-scroll App Store row
// (Auto-scroll removed to show all apps at once)
