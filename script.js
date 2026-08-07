function showAlert(message, type = 'info') {
  
    var existing = document.querySelector('.site-alert');
    if (existing) existing.remove();

    var alert = document.createElement('div');
    alert.className = 'site-alert site-alert-' + type;
    alert.setAttribute('role', 'alert');

   
    alert.style.position = 'fixed';
    alert.style.zIndex = 5;
    alert.style.right = '20px';
    alert.style.top = '20px';
    alert.style.maxWidth = '360px';
    alert.style.padding = '12px 16px';
    alert.style.borderRadius = '10px';
    alert.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
    alert.style.fontFamily = 'inherit';
    alert.style.fontSize = '14px';
    alert.style.opacity = '0';
    alert.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
    alert.style.transform = 'translateY(-6px)';

    var theme = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
    if (theme === 'dark') {
        alert.style.background = '#111827';
        alert.style.color = '#fff';
    } else {
        alert.style.background = '#ffffff';
        alert.style.color = '#0f172a';
        alert.style.border = '1px solid rgba(15,23,42,0.06)';
    }

    if (type === 'success') {
        alert.style.borderLeft = '4px solid #16a34a';
    } else if (type === 'error') {
        alert.style.borderLeft = '4px solid #ef4444';
    } else {
        alert.style.borderLeft = '4px solid #3b82f6';
    }

    alert.textContent = message;
    document.body.appendChild(alert);

    requestAnimationFrame(function() {
        alert.style.opacity = '1';
        alert.style.transform = 'translateY(0)';
    });


    setTimeout(function() {
        alert.style.opacity = '0';
        alert.style.transform = 'translateY(-6px)';
    }, 4200);
    setTimeout(function() { try { alert.remove(); } catch (e) {} }, 4500);
}

function sendMail() {
    var name = document.getElementById("name") ? document.getElementById("name").value.trim() : '';
    var email = document.getElementById("email") ? document.getElementById("email").value.trim() : '';
    var subject = document.getElementById("subject") ? document.getElementById("subject").value.trim() : '';
    var message = document.getElementById("msg") ? document.getElementById("msg").value.trim() : '';

    
    if (!name && !email && !subject && !message) {
        showAlert('Please fill in the form before sending.', 'error');
        return;
    }

    
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        showAlert('Please enter a valid email address.', 'error');
        var emailEl = document.getElementById('email');
        if (emailEl) emailEl.focus();
        return;
    }

    var sendBtn = document.getElementById('send-btn');
    if (sendBtn) { sendBtn.disabled = true; sendBtn.setAttribute('aria-disabled','true'); }

    var parms = {
        from_name: name,
        email_id: email,
        subject: subject,
        message: message
    };

    emailjs.send("service_ch4a6n3", "template_iy33t6o", parms).then(function() {
        showAlert('Email sent successfully. Thank you!', 'success');
        if (sendBtn) { sendBtn.disabled = false; sendBtn.removeAttribute('aria-disabled'); }
       
        try {
            if (document.getElementById('name')) document.getElementById('name').value = '';
            if (document.getElementById('email')) document.getElementById('email').value = '';
            if (document.getElementById('subject')) document.getElementById('subject').value = '';
            if (document.getElementById('msg')) document.getElementById('msg').value = '';
        } catch (e) {}
    }, function(error){
        console.error('Email send error', error);
        showAlert('Failed to send email. Please try again later.', 'error');
        if (sendBtn) { sendBtn.disabled = false; sendBtn.removeAttribute('aria-disabled'); }
    });
}

function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
    var toggle = document.getElementById('theme-toggle');
    if (!toggle) return;
    toggle.innerHTML = theme === 'dark' ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
    toggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
}

function toggleTheme() {
    var current = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
    setTheme(current === 'dark' ? 'light' : 'dark');
}

function initThemeToggle() {
    var toggle = document.getElementById('theme-toggle');
    if (!toggle) return;
    toggle.addEventListener('click', toggleTheme);

    var savedTheme = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(savedTheme ? savedTheme : (prefersDark ? 'dark' : 'light'));
}

function initMenuToggle() {
    var btn = document.querySelector('.hamburger');
    var nav = document.querySelector('header ul');
    var themeToggle = document.getElementById('theme-toggle');
    var originalThemeParent = themeToggle ? themeToggle.parentElement : null;

    if (!btn || !nav) return;

    btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var open = nav.classList.toggle('open');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');

        
        if (themeToggle) {
            if (open) {
                if (!nav.querySelector('.nav-theme')) {
                    var wrapper = document.createElement('li');
                    wrapper.className = 'nav-theme';
                    wrapper.appendChild(themeToggle);
                    nav.appendChild(wrapper);
                }
            } else {
                var existing = nav.querySelector('.nav-theme');
                if (existing) {
                    if (originalThemeParent) originalThemeParent.appendChild(themeToggle);
                    existing.remove();
                }
            }
        }
    });

    document.addEventListener('click', function (e) {
        if (!nav.classList.contains('open')) return;
        if (!e.target.closest('header')) {
            nav.classList.remove('open');
            btn.setAttribute('aria-expanded', 'false');
            // ensure theme toggle moved back
            var existing = nav.querySelector('.nav-theme');
            if (existing && themeToggle && originalThemeParent) {
                originalThemeParent.appendChild(themeToggle);
                existing.remove();
            }
        }
    });
}

function getStoredActionItems(key) {
    try {
        var items = JSON.parse(localStorage.getItem(key) || '[]');
        return Array.isArray(items) ? items : [];
    } catch (e) {
        return [];
    }
}

function setStoredActionItems(key, items) {
    try {
        localStorage.setItem(key, JSON.stringify(items));
    } catch (e) {}
}

function getActionCount(key) {
    try {
        return Number(localStorage.getItem(key) || 0);
    } catch (e) {
        return 0;
    }
}

function setActionCount(key, count) {
    try {
        localStorage.setItem(key, String(count));
    } catch (e) {}
}

function renderActionPanel() {
    var cartItems = getStoredActionItems('furniro-cart-items');
    var wishlistItems = getStoredActionItems('furniro-wishlist-items');
    var cartCountEl = document.querySelector('.cart-count');
    var wishlistCountEl = document.querySelector('.wishlist-count');
    var panelCartCountEl = document.querySelector('.panel-cart-count');
    var panelWishlistCountEl = document.querySelector('.panel-wishlist-count');

    if (cartCountEl) {
        cartCountEl.textContent = String(cartItems.length);
    }

    if (wishlistCountEl) {
        wishlistCountEl.textContent = String(wishlistItems.length);
    }

    if (panelCartCountEl) {
        panelCartCountEl.textContent = String(cartItems.length);
    }

    if (panelWishlistCountEl) {
        panelWishlistCountEl.textContent = String(wishlistItems.length);
    }

    renderActionList('cart', cartItems);
    renderActionList('wishlist', wishlistItems);
}

function renderActionList(type, items) {
    var listEl = document.getElementById(type + '-list');
    if (!listEl) return;

    if (!items.length) {
        listEl.innerHTML = '<li class="empty-state">No ' + (type === 'cart' ? 'cart' : 'wishlist') + ' items yet.</li>';
        return;
    }

    listEl.innerHTML = items.map(function (item) {
        return '<li><div><div class="action-item-name">' + item.name + '</div><div class="action-item-price">' + item.price + '</div></div></li>';
    }).join('');
}

function openActionPanel(view) {
    var panel = document.getElementById('action-panel');
    if (!panel) return;
    panel.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');

    var tabs = document.querySelectorAll('.action-tab');
    tabs.forEach(function (tab) {
        var isActive = tab.getAttribute('data-panel-view') === view;
        tab.classList.toggle('active', isActive);
    });

    var sections = document.querySelectorAll('.panel-section');
    sections.forEach(function (section) {
        var isActive = section.getAttribute('data-panel-section') === view;
        section.classList.toggle('active', isActive);
    });
}

function closeActionPanel() {
    var panel = document.getElementById('action-panel');
    if (!panel) return;
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
}

function toggleActionPanel(view) {
    var panel = document.getElementById('action-panel');
    if (!panel || !panel.classList.contains('open')) {
        openActionPanel(view);
        return;
    }

    var activeTab = document.querySelector('.action-tab.active');
    if (activeTab && activeTab.getAttribute('data-panel-view') === view) {
        closeActionPanel();
    } else {
        openActionPanel(view);
    }
}

function syncActionButtonState(card) {
    var buttons = card.querySelectorAll('.action-btn');
    var heading = card.querySelector('h4') || card.querySelector('h1');
    var itemName = heading ? heading.textContent.trim() : 'This item';
    var cartItems = getStoredActionItems('furniro-cart-items');
    var wishlistItems = getStoredActionItems('furniro-wishlist-items');

    buttons.forEach(function (button) {
        var action = button.getAttribute('data-action');
        var list = action === 'cart' ? cartItems : wishlistItems;
        var isAdded = list.some(function (item) {
            return item.name === itemName;
        });

        button.classList.toggle('is-added', isAdded);
        button.setAttribute('aria-pressed', isAdded ? 'true' : 'false');

        var textEl = button.querySelector('span');
        if (textEl) {
            textEl.textContent = isAdded ? (action === 'cart' ? 'Added to Cart' : 'Added to Wishlist') : (action === 'cart' ? 'Add to Cart' : 'Add to Wishlist');
        }
    });
}

function initProductActions() {
    var cards = document.querySelectorAll('.product-card, .cards, .product-summary');

    cards.forEach(function (card) {
        if (!card || card.dataset.productActionsBound === 'true') return;
        card.dataset.productActionsBound = 'true';

        syncActionButtonState(card);

        var buttons = card.querySelectorAll('.action-btn');
        buttons.forEach(function (button) {
            button.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();

                var action = this.getAttribute('data-action');
                var heading = card.querySelector('h4') || card.querySelector('h1');
                var itemName = heading ? heading.textContent.trim() : 'This item';
                var priceEl = card.querySelector('.price') || card.querySelector('.price-tag');
                var price = priceEl ? priceEl.textContent.trim() : 'Price available';
                var key = action === 'cart' ? 'furniro-cart-items' : 'furniro-wishlist-items';

                var items = getStoredActionItems(key);
                var alreadyAdded = items.some(function (item) {
                    return item.name === itemName;
                });

                if (alreadyAdded) {
                    items = items.filter(function (item) {
                        return item.name !== itemName;
                    });
                    setStoredActionItems(key, items);
                    renderActionPanel();

                    this.classList.remove('is-added');
                    this.setAttribute('aria-pressed', 'false');
                    var textEl = this.querySelector('span');
                    if (textEl) {
                        textEl.textContent = action === 'cart' ? 'Add to Cart' : 'Add to Wishlist';
                    }

                    showAlert(itemName + ' removed from your ' + (action === 'cart' ? 'cart' : 'wishlist') + '.', 'info');
                    return;
                }

                items.unshift({ name: itemName, price: price });
                setStoredActionItems(key, items);
                renderActionPanel();

                this.classList.add('is-added');
                this.setAttribute('aria-pressed', 'true');
                var textEl = this.querySelector('span');
                if (textEl) {
                    textEl.textContent = action === 'cart' ? 'Added to Cart' : 'Added to Wishlist';
                }

                showAlert(itemName + ' added to your ' + (action === 'cart' ? 'cart' : 'wishlist') + '.', 'success');
                openActionPanel(action === 'cart' ? 'cart' : 'wishlist');
            });

            button.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.stopPropagation();
                }
            });
        });
    });
}

function initProductCardLinks() {
    var cards = document.querySelectorAll('.product-card, .cards');

    cards.forEach(function (card) {
        if (!card || card.dataset.productLinkBound === 'true') return;

        card.dataset.productLinkBound = 'true';
        card.style.cursor = 'pointer';
        card.setAttribute('tabindex', '0');

        card.addEventListener('click', function (e) {
            if (e.target.closest('a') || e.target.closest('.cards-actions, .action-btn')) return;
            window.location.href = 'product-detail.html';
        });

        card.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                window.location.href = 'product-detail.html';
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', function () {
    initMenuToggle();
    initThemeToggle();
    initProductActions();
    initProductCardLinks();
    renderActionPanel();

    document.querySelectorAll('.icon-btn[data-action-view]').forEach(function (button) {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            toggleActionPanel(this.getAttribute('data-action-view'));
        });
    });

    var closeButton = document.querySelector('.action-panel-close');
    if (closeButton) {
        closeButton.addEventListener('click', closeActionPanel);
    }

    document.querySelectorAll('.action-tab').forEach(function (tab) {
        tab.addEventListener('click', function () {
            openActionPanel(this.getAttribute('data-panel-view'));
        });
    });

    document.addEventListener('click', function (e) {
        var panel = document.getElementById('action-panel');
        if (!panel || !panel.classList.contains('open')) return;
        if (!e.target.closest('.action-panel') && !e.target.closest('.icon-btn[data-action-view]')) {
            closeActionPanel();
        }
    });
});
