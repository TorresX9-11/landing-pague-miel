// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    // Variables globales
    const comprarBtn = document.getElementById('comprar-btn');
    const comprarProductoBtns = document.querySelectorAll('.comprar-producto');
    const cartModal = document.getElementById('cart-modal');
    const closeBtn = document.querySelector('.close');
    const checkoutBtn = document.getElementById('checkout-btn');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const contactForm = document.getElementById('contacto-form');
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    const contactameBtn = document.getElementById('contactame-btn');
    
    // Datos de productos
const productos = [
        { id: 1, nombre: 'Miel de Flores 1kl', precio: 8990 },
        { id: 2, nombre: 'Miel de Bosque 1kl', precio: 10990 },
        { id: 3, nombre: 'Miel con Panal 200gr', precio: 12990 }
    ];
    
    // Carrito de compras
    let carrito = [];
    
    // Menú móvil toggle
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
    }
    
    // Ocultar menú móvil al hacer clic en un enlace
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            }
        });
    });
    
    // Funcionalidad de navegación suave
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });
        });
    });
    
    // Botón de contáctame - abrir email
    if (contactameBtn) {
        contactameBtn.addEventListener('click', () => {
            // Aquí puedes cambiar la dirección de correo por la tuya
            const email = 'info@mielpura.com';
            const subject = 'Consulta sobre productos de miel';
            const body = 'Hola, estoy interesado en tus productos de miel y me gustaría obtener más información.';
            
            window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        });
    }
    
    // Mostrar modal de carrito al hacer clic en "Comprar Ahora"
    comprarBtn.addEventListener('click', () => {
        scrollToSection('productos');
    });
    
    // Función para desplazarse a una sección
    function scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        window.scrollTo({
            top: section.offsetTop - 70,
            behavior: 'smooth'
        });
    }
    
    // Añadir productos al carrito
    comprarProductoBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const productoId = parseInt(btn.getAttribute('data-id'));
            agregarAlCarrito(productoId);
            mostrarCarrito();
        });
    });
    
    // Cerrar modal de carrito
    closeBtn.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });
    
    // Cerrar modal al hacer clic fuera del contenido
    window.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });
    
    // Finalizar compra
    checkoutBtn.addEventListener('click', () => {
        if (carrito.length === 0) {
            alert('Tu carrito está vacío. Añade algunos productos primero.');
            return;
        }
        
        alert('¡Gracias por tu compra! Procesando tu pedido...');
        carrito = [];
        actualizarCarrito();
        cartModal.style.display = 'none';
    });
    
    // Enviar formulario de contacto
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nombre = document.getElementById('nombre').value;
        const email = document.getElementById('email').value;
        const mensaje = document.getElementById('mensaje').value;
        
        // Aquí normalmente enviarías los datos a un servidor
        alert(`Gracias ${nombre} por tu mensaje. Te contactaremos pronto en ${email}.`);
        
        // Limpiar formulario
        contactForm.reset();
    });
    
    // Función para agregar productos al carrito
    function agregarAlCarrito(id) {
        const producto = productos.find(p => p.id === id);
        
        // Verificar si el producto ya está en el carrito
        const itemEnCarrito = carrito.find(item => item.id === id);
        
        if (itemEnCarrito) {
            itemEnCarrito.cantidad++;
        } else {
            carrito.push({
                id: producto.id,
                nombre: producto.nombre,
                precio: producto.precio,
                cantidad: 1
            });
        }
        
        actualizarCarrito();
    }
    
    // Función para actualizar la visualización del carrito
    function actualizarCarrito() {
        // Limpiar el contenido actual del carrito
        cartItems.innerHTML = '';
        
        // Calcular el total
        let total = 0;
        
        // Añadir cada item al carrito
        carrito.forEach(item => {
            const itemTotal = item.precio * item.cantidad;
            total += itemTotal;
            
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <div>
                    <span>${item.nombre}</span>
                    <span>x ${item.cantidad}</span>
                </div>
                <div>
<span>${itemTotal.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</span>
                    <button class="remove-btn" data-id="${item.id}">x</button>
                </div>
            `;
            
            cartItems.appendChild(itemElement);
        });
        
        // Actualizar el total
cartTotal.textContent = total.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
        
        // Añadir event listeners a los botones de eliminar
        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                eliminarDelCarrito(id);
            });
        });
    }
    
    // Función para eliminar productos del carrito
    function eliminarDelCarrito(id) {
        const itemIndex = carrito.findIndex(item => item.id === id);
        
        if (itemIndex !== -1) {
            if (carrito[itemIndex].cantidad > 1) {
                carrito[itemIndex].cantidad--;
            } else {
                carrito.splice(itemIndex, 1);
            }
            
            actualizarCarrito();
        }
    }
    
    // Función para mostrar el carrito
    function mostrarCarrito() {
        cartModal.style.display = 'block';
    }
    
    // Efecto de parallax para la sección hero
    window.addEventListener('scroll', () => {
        const heroSection = document.querySelector('.hero');
        const scrollPosition = window.pageYOffset;
        
        // Solo aplicar el efecto si la sección está en el viewport
        if (scrollPosition < window.innerHeight) {
            heroSection.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
        }
    });
    
    // Animación de entrada para las secciones
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.2 });
    
    // Observar todas las secciones para animar su entrada
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
});
