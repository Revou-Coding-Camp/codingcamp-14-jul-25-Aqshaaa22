document.addEventListener('DOMContentLoaded', function() {
  
    initializeWelcomeMessage();
    initializeNavigation();
    initializeContactForm();
    initializeCurrentTime();
    initializeScrollAnimations();
    initializeMobileMenu();
});

function initializeWelcomeMessage() {
    const userNameSpan = document.getElementById('user-name');
    const popupOverlay = document.getElementById('popup-overlay');
    const popupForm = document.getElementById('popup-form');
    const popupNameInput = document.getElementById('popup-name-input');

    const savedName = localStorage.getItem('userName');

    if (savedName) {
  
        userNameSpan.textContent = savedName;
    } else {

        popupOverlay.classList.remove('hidden');
    }


    popupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const newName = popupNameInput.value.trim();
        if (newName) {
            userNameSpan.textContent = newName;
            localStorage.setItem('userName', newName);
            popupOverlay.classList.add('hidden'); 
        }
    });


    userNameSpan.addEventListener('click', function() {
        popupNameInput.value = userNameSpan.textContent;
        popupOverlay.classList.remove('hidden');
    });
}

function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            navLinks.forEach(l => l.classList.remove('active'));
            
            this.classList.add('active');
            
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    window.addEventListener('scroll', function() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });
}

function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    const formOutput = document.getElementById('formOutput');

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const nama = formData.get('nama');
        const tanggal = formData.get('tanggal');
        const gender = formData.get('gender');
        const pesan = formData.get('pesan');
        
        if (!nama || !tanggal || !gender || !pesan) {
            alert('Please fill in all fields!');
            return;
        }

        const nameRegex = /^[a-zA-Z\s]+$/;
        if (!nameRegex.test(nama)) {
            alert('Name should contain only letters!');
            return;
        }

        const selectedDate = new Date(tanggal);
        const currentDate = new Date();
        if (selectedDate > currentDate) {
            alert('Birth date cannot be in the future!');
            return;
        }

        if (pesan.length < 10) {
            alert('Message should be at least 10 characters long!');
            return;
        }

        updateFormDisplay(nama, tanggal, gender, pesan);

        showNotification('Form submitted successfully!', 'success');

    });

    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            validateField(this);
        });
    });
}

function updateFormDisplay(nama, tanggal, gender, pesan) {
    document.getElementById('displayName').textContent = nama;
    document.getElementById('displayDate').textContent = formatDate(tanggal);
    document.getElementById('displayGender').textContent = gender;
    document.getElementById('displayMessage').textContent = pesan;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;

    field.classList.remove('error');

    switch(fieldName) {
        case 'nama':
            if (value && !/^[a-zA-Z\s]+$/.test(value)) {
                field.classList.add('error');
                showFieldError(field, 'Name should contain only letters');
            } else {
                hideFieldError(field);
            }
            break;
        
        case 'tanggal':
            if (value) {
                const selectedDate = new Date(value);
                const currentDate = new Date();
                if (selectedDate > currentDate) {
                    field.classList.add('error');
                    showFieldError(field, 'Birth date cannot be in the future');
                } else {
                    hideFieldError(field);
                }
            }
            break;
        
        case 'pesan':
            if (value && value.length < 10) {
                field.classList.add('error');
                showFieldError(field, 'Message should be at least 10 characters long');
            } else {
                hideFieldError(field);
            }
            break;
    }
}

function showFieldError(field, message) {
    let errorElement = field.parentNode.querySelector('.error-message');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        field.parentNode.appendChild(errorElement);
    }
    errorElement.textContent = message;
    errorElement.style.color = '#dc3545';
    errorElement.style.fontSize = '0.8rem';
    errorElement.style.marginTop = '5px';
}

function hideFieldError(field) {
    const errorElement = field.parentNode.querySelector('.error-message');
    if (errorElement) {
        errorElement.remove();
    }
}

function initializeCurrentTime() {
    const currentTimeElement = document.getElementById('currentTime');
    
    function updateTime() {
        const now = new Date();
        const timeString = now.toLocaleString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZoneName: 'short'
        });
        currentTimeElement.textContent = timeString;
    }

    updateTime();
    setInterval(updateTime, 1000);
}

function initializeScrollAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in');
    
    function checkScroll() {
        animatedElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('visible');
            }
        });
    }
    
    window.addEventListener('scroll', checkScroll);
    checkScroll(); 
}

function initializeMobileMenu() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelector('.nav-links');

    const mobileToggle = document.createElement('button');
    mobileToggle.className = 'mobile-toggle';
    mobileToggle.innerHTML = '☰';
    mobileToggle.style.display = 'none';
    mobileToggle.style.background = 'none';
    mobileToggle.style.border = 'none';
    mobileToggle.style.fontSize = '1.5rem';
    mobileToggle.style.cursor = 'pointer';
    mobileToggle.style.color = '#333';

    navbar.parentNode.insertBefore(mobileToggle, navbar);

    mobileToggle.addEventListener('click', function() {
        navLinks.classList.toggle('mobile-active');
    });
   
    navLinks.addEventListener('click', function(e) {
        if (e.target.classList.contains('nav-link')) {
            navLinks.classList.remove('mobile-active');
        }
    });
    
    function checkMobileMenu() {
        if (window.innerWidth <= 768) {
            mobileToggle.style.display = 'block';
            navLinks.style.display = navLinks.classList.contains('mobile-active') ? 'flex' : 'none';
        } else {
            mobileToggle.style.display = 'none';
            navLinks.style.display = 'flex';
            navLinks.classList.remove('mobile-active');
        }
    }
    
    window.addEventListener('resize', checkMobileMenu);
    checkMobileMenu();
}

function showNotification(message, type = 'info') {

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background-color: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007bff'};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 10000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);

    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function smoothScrollTo(element) {
    const targetPosition = element.offsetTop - 80; 
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 800;
    let start = null;
    
    function animation(currentTime) {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }
    
    function easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }
    
    requestAnimationFrame(animation);
}

function initializeFormAutoSave() {
    const form = document.getElementById('contactForm');
    const formElements = form.querySelectorAll('input, textarea, select');

    formElements.forEach(element => {
        element.addEventListener('input', function() {
            const formData = new FormData(form);
            const data = {};
            for (let [key, value] of formData.entries()) {
                data[key] = value;
            }
            sessionStorage.setItem('contactFormData', JSON.stringify(data));
        });
    });
    

    const savedData = sessionStorage.getItem('contactFormData');
    if (savedData) {
        const data = JSON.parse(savedData);
        Object.keys(data).forEach(key => {
            const element = form.querySelector(`[name="${key}"]`);
            if (element) {
                if (element.type === 'radio') {
                    const radio = form.querySelector(`[name="${key}"][value="${data[key]}"]`);
                    if (radio) radio.checked = true;
                } else {
                    element.value = data[key];
                }
            }
        });
    }

    form.addEventListener('submit', function() {
        sessionStorage.removeItem('contactFormData');
    });
}

function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

function initializeKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault();
            const sections = document.querySelectorAll('section');
            const currentSection = getCurrentSection();
            let nextIndex = 0;
            
            sections.forEach((section, index) => {
                if (section.id === currentSection) {
                    if (e.key === 'ArrowUp') {
                        nextIndex = index > 0 ? index - 1 : sections.length - 1;
                    } else {
                        nextIndex = index < sections.length - 1 ? index + 1 : 0;
                    }
                }
            });
            
            sections[nextIndex].scrollIntoView({ behavior: 'smooth' });
        }
        
        if (e.key >= '1' && e.key <= '4') {
            e.preventDefault();
            const sections = ['home', 'profile', 'portfolio', 'message'];
            const targetSection = document.getElementById(sections[parseInt(e.key) - 1]);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
}

function getCurrentSection() {
    const sections = document.querySelectorAll('section');
    let current = 'home';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.pageYOffset >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });
    
    return current;
}

document.addEventListener('DOMContentLoaded', function() {
    initializeFormAutoSave();
    initializeLazyLoading();
    initializeKeyboardNavigation();
});

function initializeFormPreview() {
    const nameInput = document.getElementById('nama');
    const dateInput = document.getElementById('tanggal');
    const genderInputs = document.querySelectorAll('input[name="gender"]');
    const messageInput = document.getElementById('pesan');

    nameInput.addEventListener('input', function() {
        document.getElementById('displayName').textContent = this.value || '-';
    });
    
    dateInput.addEventListener('input', function() {
        document.getElementById('displayDate').textContent = this.value ? formatDate(this.value) : '-';
    });
    
    genderInputs.forEach(radio => {
        radio.addEventListener('change', function() {
            document.getElementById('displayGender').textContent = this.value;
        });
    });
    
    messageInput.addEventListener('input', function() {
        document.getElementById('displayMessage').textContent = this.value || '-';
    });
}

document.addEventListener('DOMContentLoaded', function() {
    initializeFormPreview();
});

function debounce(func, wait) {
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

const debouncedScrollHandler = debounce(function() {
    console.log('Scroll event handled');
}, 16); 

window.addEventListener('scroll', debouncedScrollHandler);

function printPage() {
    window.print();
}

function exportFormData() {
    const displayName = document.getElementById('displayName').textContent;
    const displayDate = document.getElementById('displayDate').textContent;
    const displayGender = document.getElementById('displayGender').textContent;
    const displayMessage = document.getElementById('displayMessage').textContent;
    
    const data = {
        name: displayName,
        birthDate: displayDate,
        gender: displayGender,
        message: displayMessage,
        timestamp: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'contact_form_data.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

document.addEventListener('DOMContentLoaded', function() {

});


console.log('🚀 Website loaded successfully!');
console.log('💡 Keyboard shortcuts:');
console.log('   - Arrow keys: Navigate between sections');
console.log('   - 1-4: Quick navigation to sections');
console.log('   - Click on name to change it');

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ All website features initialized successfully!');
});

let currentSlide = 0;
let slides = [];
let indicators = [];
let isAutoSliding = true;
let autoSlideInterval;

function initializeHeroSlider() {
    slides = document.querySelectorAll('.slide');
    indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');

    if (!slides.length || !indicators.length) {
        console.warn('Hero slider elements not found');
        return;
    }

    if (prevBtn) prevBtn.addEventListener('click', () => changeSlide('prev'));
    if (nextBtn) nextBtn.addEventListener('click', () => changeSlide('next'));

    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            goToSlide(index);
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            changeSlide('prev');
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            changeSlide('next');
        }
    });

    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        heroSection.addEventListener('mouseenter', pauseAutoSlide);
        heroSection.addEventListener('mouseleave', resumeAutoSlide);
    }

    initializeTouchSupport();

    startAutoSlide();

    preloadSlideImages();

    console.log('✅ Hero slider initialized with', slides.length, 'slides');
}

function changeSlide(direction) {
    slides[currentSlide].classList.remove('active');
    indicators[currentSlide].classList.remove('active');

    if (direction === 'next') {
        currentSlide = (currentSlide + 1) % slides.length;
    } else if (direction === 'prev') {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    }

    slides[currentSlide].classList.add('active');
    indicators[currentSlide].classList.add('active');

    slides[currentSlide].classList.add('fade-in');
    setTimeout(() => {
        slides[currentSlide].classList.remove('fade-in');
    }, 1000);

    if (isAutoSliding) {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }
}

function goToSlide(index) {
    if (index === currentSlide) return;

    slides[currentSlide].classList.remove('active');
    indicators[currentSlide].classList.remove('active');

    currentSlide = index;

    slides[currentSlide].classList.add('active');
    indicators[currentSlide].classList.add('active');
    slides[currentSlide].classList.add('fade-in');

    setTimeout(() => {
        slides[currentSlide].classList.remove('fade-in');
    }, 1000);

    if (isAutoSliding) {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }
}

function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
        changeSlide('next');
    }, 5000); 
}

function pauseAutoSlide() {
    isAutoSliding = false;
    clearInterval(autoSlideInterval);
}

function resumeAutoSlide() {
    isAutoSliding = true;
    startAutoSlide();
}

function initializeTouchSupport() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;

    let startX = 0;
    let endX = 0;
    let startY = 0;
    let endY = 0;
    const minSwipeDistance = 50;

    heroSection.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    }, { passive: true });

    heroSection.addEventListener('touchmove', (e) => {

        if (Math.abs(e.touches[0].clientX - startX) > Math.abs(e.touches[0].clientY - startY)) {
            e.preventDefault();
        }
    }, { passive: false });

    heroSection.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        endY = e.changedTouches[0].clientY;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
            if (deltaX > 0) {
                changeSlide('prev');
            } else {
                changeSlide('next');
            }
        }
    }
}

function preloadSlideImages() {
    slides.forEach((slide, index) => {
        const bgImage = slide.style.backgroundImage;
        if (bgImage) {
            const imageUrl = bgImage.slice(5, -2); 
            const img = new Image();
            
            img.onload = () => {
                slide.classList.remove('loading');
                console.log(`✅ Slide ${index + 1} image loaded`);
            };
            
            img.onerror = () => {
                console.warn(`⚠️ Failed to load slide ${index + 1} image:`, imageUrl);
                slide.style.background = 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)';
            };
            
            slide.classList.add('loading');
            img.src = imageUrl;
        }
    });
}

function initializeWelcomeMessageWithSlider() {
    const userNameSpan = document.getElementById('user-name');
    const popupOverlay = document.getElementById('popup-overlay');
    const popupForm = document.getElementById('popup-form');
    const popupNameInput = document.getElementById('popup-name-input');

    const savedName = localStorage.getItem('userName');

    if (savedName) {
        userNameSpan.textContent = savedName;
    } else {
        pauseAutoSlide();
        popupOverlay.classList.remove('hidden');
    }

    popupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const newName = popupNameInput.value.trim();
        if (newName) {
            userNameSpan.textContent = newName;
            localStorage.setItem('userName', newName);
            popupOverlay.classList.add('hidden');
            resumeAutoSlide();
        }
    });

    userNameSpan.addEventListener('click', function() {
        pauseAutoSlide();
        popupNameInput.value = userNameSpan.textContent;
        popupOverlay.classList.remove('hidden');
    });
}

function initializeHeroAnimations() {
    const heroContent = document.querySelector('.hero-content');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, {
        threshold: 0.1
    });

    if (heroContent) {
        observer.observe(heroContent);
    }
}

function createProgressIndicator() {
    const heroSection = document.querySelector('.hero-section');
    const progressBar = document.createElement('div');
    progressBar.className = 'slider-progress';
    progressBar.innerHTML = '<div class="progress-fill"></div>';

    const style = document.createElement('style');
    style.textContent = `
        .slider-progress {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background: rgba(255, 255, 255, 0.2);
            z-index: 4;
        }
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #ff6b6b, #4ecdc4);
            width: 0%;
            transition: width 0.1s ease;
        }
    `;
    document.head.appendChild(style);
    
    heroSection.appendChild(progressBar);
    return progressBar.querySelector('.progress-fill');
}

let progressFill;
function updateProgress() {
    if (!progressFill) {
        progressFill = createProgressIndicator();
    }
    
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += 2; 
        progressFill.style.width = progress + '%';
        
        if (progress >= 100) {
            clearInterval(progressInterval);
            progressFill.style.width = '0%';
        }
    }, 100);
}

function initializeLazyLoadingSlider() {
    const slideImages = [
        'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        'https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
    ];

    function preloadNextImage() {
        const nextIndex = (currentSlide + 1) % slides.length;
        const img = new Image();
        img.src = slideImages[nextIndex];
    }

    const originalChangeSlide = changeSlide;
    changeSlide = function(direction) {
        originalChangeSlide(direction);
        preloadNextImage();
        updateProgress();
    };
}

document.addEventListener('DOMContentLoaded', function() {
    initializeHeroSlider();
    
    initializeWelcomeMessageWithSlider();
    initializeHeroAnimations();
    initializeLazyLoadingSlider();
    
    console.log('🎬 Hero slider system fully initialized!');
});

window.addEventListener('resize', function() {

    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {

        slides[currentSlide].classList.remove('active');
        setTimeout(() => {
            slides[currentSlide].classList.add('active');
        }, 10);
    }
});

document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        pauseAutoSlide();
    } else if (isAutoSliding) {
        resumeAutoSlide();
    }
});

window.HeroSlider = {
    nextSlide: () => changeSlide('next'),
    prevSlide: () => changeSlide('prev'),
    goToSlide: goToSlide,
    pause: pauseAutoSlide,
    resume: resumeAutoSlide,
    getCurrentSlide: () => currentSlide,
    getTotalSlides: () => slides.length
};