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
    if (!btn || !nav) return;
    btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var open = nav.classList.toggle('open');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('click', function (e) {
        if (!nav.classList.contains('open')) return;
        if (!e.target.closest('header')) {
            nav.classList.remove('open');
            btn.setAttribute('aria-expanded', 'false');
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    initMenuToggle();
    initThemeToggle();
});
