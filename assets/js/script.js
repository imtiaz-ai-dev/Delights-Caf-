// Menu category switching
function showCategory(categoryName) {
    // Remove active class from all categories
    document.querySelectorAll('.menu-category').forEach(category => {
        category.classList.remove('active');
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected category
    const selectedCategory = document.getElementById(categoryName);
    if (selectedCategory) {
        selectedCategory.classList.add('active');
    }
    
    // Add active class to clicked button
    if (event && event.target) {
        event.target.classList.add('active');
    } else {
        // Fallback: find button by category name
        const buttons = document.querySelectorAll('.category-btn');
        buttons.forEach(btn => {
            if (btn.textContent.toLowerCase().includes(categoryName.toLowerCase()) || 
                btn.getAttribute('onclick').includes(categoryName)) {
                btn.classList.add('active');
            }
        });
    }
}

// Tab functionality for Order page
function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const selectedTab = document.getElementById(tabName + '-tab');
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    event.target.classList.add('active');
}

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));
}

// Form handling
function handleFormSubmission(formId, successMessage, requiredFields) {
    const form = document.getElementById(formId);
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const isValid = requiredFields.every(fieldId => {
            const field = document.getElementById(fieldId);
            return field && field.value.trim();
        });
        
        if (isValid) {
            showNotification(successMessage);
            form.reset();
            if (formId === 'orderForm') updateOrderSummary();
        } else {
            showNotification('Please fill in all required fields.', 'error');
        }
    });
}

// Order summary
function updateOrderSummary() {
    const selectedItems = document.querySelectorAll('input[name="items"]:checked');
    const summaryDiv = document.getElementById('orderSummary');
    const totalDiv = document.getElementById('totalAmount');
    
    if (!summaryDiv || !totalDiv) return;
    
    if (selectedItems.length === 0) {
        summaryDiv.innerHTML = 'No items selected';
        totalDiv.textContent = '0.00';
        return;
    }
    
    let total = 0;
    let summaryHTML = '<ul>';
    
    selectedItems.forEach(item => {
        const [name, price] = item.value.split('|');
        const itemPrice = parseFloat(price);
        total += itemPrice;
        summaryHTML += `<li>${name} - $${itemPrice.toFixed(2)}</li>`;
    });
    
    summaryHTML += '</ul>';
    summaryDiv.innerHTML = summaryHTML;
    totalDiv.textContent = total.toFixed(2);
}

// Notification system
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Gallery View Full Size functionality
function showFullSizeImage(src, title) {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                <img src="${src}" alt="${title}">
                <h3>${title}</h3>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    const closeBtn = modal.querySelector('.modal-close');
    const overlay = modal.querySelector('.modal-overlay');
    
    closeBtn.addEventListener('click', () => modal.remove());
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) modal.remove();
    });
    
    document.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', escHandler);
        }
    });
}

// Scroll to top
function createScrollToTop() {
    const scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.innerHTML = '↑';
    scrollBtn.onclick = () => window.scrollTo({top: 0, behavior: 'smooth'});
    document.body.appendChild(scrollBtn);
    
    window.addEventListener('scroll', () => {
        scrollBtn.classList.toggle('visible', window.scrollY > 300);
    });
}

// Initialize everything
document.addEventListener('DOMContentLoaded', function() {
    // Initialize menu navigation
    initializeMenuNavigation();
    
    // Initialize chatbot
    window.chatbot = new SimpleChatbot();
    
    // Add to cart functionality
    document.querySelectorAll('.add-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.menu-card');
            const itemName = card.querySelector('h4').textContent;
            const itemPrice = card.querySelector('.price').textContent.replace(/[^0-9.]/g, '');
            
            this.textContent = 'Added!';
            this.style.background = 'var(--green)';
            setTimeout(() => {
                this.textContent = 'Add to Order';
                this.style.background = '';
            }, 1500);
            
            addToCart(itemName, itemPrice);
        });
    });
    
    // Gallery view buttons
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const galleryCard = this.closest('.gallery-card');
            const img = galleryCard.querySelector('img');
            const title = galleryCard.querySelector('h4').textContent;
            
            if (img) showFullSizeImage(img.src, title);
        });
    });
    
    // Order summary listeners
    document.querySelectorAll('input[name="items"]').forEach(checkbox => {
        checkbox.addEventListener('change', updateOrderSummary);
    });
    
    // Load cart items on order page
    if (window.location.pathname.includes('order.html')) {
        loadCartItems();
    }
    
    // Form submissions
    handleFormSubmission('contactForm', 'Message sent successfully!', ['firstName', 'email', 'message']);
    handleFormSubmission('orderForm', 'Order placed successfully!', ['customerName', 'customerPhone', 'customerEmail']);
    handleFormSubmission('reservationForm', 'Table reserved successfully!', ['reservationName', 'reservationPhone', 'reservationEmail']);
    
    // Set minimum date for reservations
    const reservationDate = document.getElementById('reservationDate');
    if (reservationDate) {
        reservationDate.setAttribute('min', new Date().toISOString().split('T')[0]);
    }
    
    // Initialize scroll to top
    createScrollToTop();
});

// Add to cart function
function addToCart(itemName, itemPrice) {
    let cart = JSON.parse(localStorage.getItem('heartyDelightsCart') || '[]');
    
    const existingItem = cart.find(item => item.name === itemName);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: itemName,
            price: parseFloat(itemPrice),
            quantity: 1
        });
    }
    
    localStorage.setItem('heartyDelightsCart', JSON.stringify(cart));
    showNotification(`${itemName} added to cart!`);
}

// Load cart items on order page
function loadCartItems() {
    const cart = JSON.parse(localStorage.getItem('heartyDelightsCart') || '[]');
    
    cart.forEach(cartItem => {
        const checkbox = document.querySelector(`input[value="${cartItem.name}|${cartItem.price}"]`);
        if (checkbox) {
            checkbox.checked = true;
        }
    });
    
    updateOrderSummary();
}
// Handle menu section navigation from home page
window.addEventListener('load', function() {
    const hash = window.location.hash;
    if (hash && document.querySelector(hash)) {
        showCategory(hash.substring(1));
    }
});
// Simple Chatbot
class SimpleChatbot {
    constructor() {
        this.responses = {
            'hello': 'Hello! Welcome to Hearty Delights Café! How can I help you?',
            'hi': 'Hi there! What can I do for you today?',
            'menu': 'Check out our delicious menu with fresh pastries, coffee, and meals!',
            'hours': 'We are open Monday-Friday 7AM-8PM, Saturday-Sunday 8AM-9PM.',
            'location': 'We are located at 105 N 1st St #1710, San Jose, CA 95113',
            'order': 'You can place an order online or call us at +1(555) 123-4567',
            'coffee': 'We serve premium coffee - Espresso, Cappuccino, Latte, and Premium Tea!',
            'price': 'Our prices range from $100-$1400. Check our menu for details!',
            'contact': 'Call us at +1(555) 123-4567 or email theophmmm8@gmail.com',
            'default': 'Thanks for your message! You can ask about our menu, hours, location, or orders.'
        };
        this.init();
    }

    init() {
        this.createChatbot();
    }

    createChatbot() {
        const chatbotHTML = `
            <div class="chatbot-container">
                <button class="chatbot-toggle" onclick="toggleChat()">💬</button>
                <div class="chatbot-window" id="chatbotWindow">
                    <div class="chatbot-header">
                        <span>Hearty Delights Assistant</span>
                        <button onclick="toggleChat()">×</button>
                    </div>
                    <div class="chatbot-messages" id="chatbotMessages">
                        <div class="message bot">
                            <div class="message-bubble">Hello! I'm here to help. Ask me about our menu, hours, or location!</div>
                        </div>
                    </div>
                    <div class="chatbot-input">
                        <input type="text" id="chatInput" placeholder="Type your message..." onkeypress="if(event.key==='Enter') sendMessage()">
                        <button onclick="sendMessage()">Send</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    }

    getResponse(message) {
        const lowerMessage = message.toLowerCase();
        for (const [key, response] of Object.entries(this.responses)) {
            if (lowerMessage.includes(key)) {
                return response;
            }
        }
        return this.responses.default;
    }
}

// Chatbot functions
function toggleChat() {
    const window = document.getElementById('chatbotWindow');
    window.style.display = window.style.display === 'flex' ? 'none' : 'flex';
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (message) {
        addMessage(message, 'user');
        input.value = '';
        
        setTimeout(() => {
            const response = window.chatbot.getResponse(message);
            addMessage(response, 'bot');
        }, 500);
    }
}

function addMessage(text, sender) {
    const messagesContainer = document.getElementById('chatbotMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    messageDiv.innerHTML = `<div class="message-bubble">${text}</div>`;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}