// ===== NAVEGACIÓN SUAVE =====
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling para enlaces ancla
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
  
    // ===== EFECTO SCROLL EN NAVBAR =====
    const navbar = document.querySelector('.navbar-container');
    let lastScrollY = window.scrollY;
  
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.style.background = 'rgba(20, 20, 20, 0.98)';
        navbar.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        navbar.style.transform = 'translateY(0)';
      } else {
        navbar.style.background = 'rgba(30, 30, 30, 0.95)';
        navbar.style.borderColor = 'rgba(255, 255, 255, 0.1)';
      }
  
      // Ocultar navbar al hacer scroll hacia abajo, mostrar al subir
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        navbar.style.transform = 'translateY(-100%)';
      } else {
        navbar.style.transform = 'translateY(0)';
      }
      lastScrollY = window.scrollY;
    });
  
    // ===== ANIMACIONES AL HACER SCROLL =====
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
  
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in-up');
        }
      });
    }, observerOptions);
  
    // Observar elementos para animaciones
    document.querySelectorAll('.service-card').forEach(card => {
      observer.observe(card);
    });
  
    // ===== EFECTOS HOVER MEJORADOS =====
    document.querySelectorAll('.service-card').forEach(card => {
      card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
      });
      
      card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
      });
    });
  
    // ===== EFECTOS DE PARTÍCULAS (OPCIONAL) =====
    function createParticle() {
      const particle = document.createElement('div');
      particle.style.position = 'fixed';
      particle.style.width = '2px';
      particle.style.height = '2px';
      particle.style.background = 'rgba(246, 246, 246, 0.5)';
      particle.style.borderRadius = '50%';
      particle.style.pointerEvents = 'none';
      particle.style.zIndex = '1';
      
      const startX = Math.random() * window.innerWidth;
      const startY = window.innerHeight + 10;
      
      particle.style.left = startX + 'px';
      particle.style.top = startY + 'px';
      
      document.body.appendChild(particle);
      
      const animation = particle.animate([
        { transform: 'translateY(0px)', opacity: 0 },
        { transform: 'translateY(-100px)', opacity: 1 },
        { transform: 'translateY(-' + (window.innerHeight + 100) + 'px)', opacity: 0 }
      ], {
        duration: 3000 + Math.random() * 2000,
        easing: 'linear'
      });
      
      animation.onfinish = () => {
        particle.remove();
      };
    }
  
    // Crear partículas ocasionalmente (descomenta para activar)
    // setInterval(createParticle, 300);
  
    // ===== MANEJO DE BOTONES CTA =====
    document.querySelectorAll('.cta-button').forEach(button => {
      button.addEventListener('click', function(e) {
        // Si es un enlace interno, no hacer nada especial
        if (this.getAttribute('href') && this.getAttribute('href').startsWith('#')) {
          return;
        }
        
        // Si es un botón, agregar efecto de click
        e.preventDefault();
        
        // Efecto ripple
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.3)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s linear';
        ripple.style.pointerEvents = 'none';
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => {
          ripple.remove();
        }, 600);
        
        // Aquí puedes agregar la lógica para el CTA
        console.log('CTA button clicked!');
        // window.location.href = 'contact.html'; // Ejemplo
      });
    });
  
    // ===== LAZY LOADING PARA IMÁGENES =====
    if ('IntersectionObserver' in window) {
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
  
      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  
    // ===== DETECCIÓN DE DISPOSITIVO MÓVIL =====
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      // Deshabilitar efectos parallax en móviles para mejor rendimiento
      document.querySelector('.hero-section').style.backgroundAttachment = 'scroll';
    }
  
    // ===== CONTADOR DE ESTADÍSTICAS (OPCIONAL) =====
    function animateCounter(element, target, duration = 2000) {
      let start = 0;
      const increment = target / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        element.textContent = Math.floor(start);
        
        if (start >= target) {
          element.textContent = target;
          clearInterval(timer);
        }
      }, 16);
    }
  
    // Usar para contadores si los agregas:
    // animateCounter(document.querySelector('.counter'), 1000);
  });
  
  // ===== CSS ANIMATION KEYFRAMES EN JS =====
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
  
  // ===== UTILIDADES GLOBALES =====
  window.TeleportMassive = {
    // Función para cambiar tema (si quieres agregar modo claro)
    toggleTheme: function() {
      document.documentElement.classList.toggle('light-theme');
    },
    
    // Función para mostrar notificaciones
    showNotification: function(message, type = 'info') {
      const notification = document.createElement('div');
      notification.className = `notification notification-${type}`;
      notification.textContent = message;
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: rgba(30, 30, 30, 0.95);
        color: #F6F6F6;
        border-radius: 10px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        z-index: 1000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
      `;
      
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.style.transform = 'translateX(0)';
      }, 10);
      
      setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
      }, 3000);
    }
  };

  function toggleFaq(button) {
    const faqItem = button.closest('.faq-item');
    const answer = faqItem.querySelector('.faq-answer');
    const icon = faqItem.querySelector('.faq-icon');
    
    // Toggle la respuesta
    answer.classList.toggle('hidden');
    
    // Rotar el icono
    if (answer.classList.contains('hidden')) {
      icon.textContent = '+';
      icon.style.transform = 'rotate(0deg)';
    } else {
      icon.textContent = '−';
      icon.style.transform = 'rotate(180deg)';
    }
    
    // Cerrar otros FAQs (opcional)
    const allFaqItems = document.querySelectorAll('.faq-item');
    allFaqItems.forEach(item => {
      if (item !== faqItem) {
        const otherAnswer = item.querySelector('.faq-answer');
        const otherIcon = item.querySelector('.faq-icon');
        otherAnswer.classList.add('hidden');
        otherIcon.textContent = '+';
        otherIcon.style.transform = 'rotate(0deg)';
      }
    });
  }