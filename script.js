function sendMail() {
    let parms = {
        from_name: document.getElementById("name").value,
        email_id: document.getElementById("email").value,
        subject: document.getElementById("subject").value,
        message: document.getElementById("msg").value
    };
    emailjs.send("service_ch4a6n3", "template_iy33t6o", parms).then(function() {
        alert("Email sent successfully");
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

        // Move theme toggle into the nav when menu opens, move back when closes
        if (themeToggle) {
            if (open) {
                // avoid duplicating if already moved
                if (!nav.querySelector('.nav-theme')) {
                    var wrapper = document.createElement('li');
                    wrapper.className = 'nav-theme';
                    wrapper.appendChild(themeToggle);
                    nav.appendChild(wrapper);
                }
            } else {
                var existing = nav.querySelector('.nav-theme');
                if (existing) {
                    // move button back to its original place
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

function initProductCardLinks() {
    var cards = document.querySelectorAll('.product-card, .cards');

    cards.forEach(function (card) {
        if (!card || card.dataset.productLinkBound === 'true') return;

        card.dataset.productLinkBound = 'true';
        card.style.cursor = 'pointer';
        card.setAttribute('tabindex', '0');

        card.addEventListener('click', function (e) {
            if (e.target.closest('a')) return;
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
    initProductCardLinks();
});
