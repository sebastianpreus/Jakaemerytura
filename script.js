// ========== INTERSECTION OBSERVER (fade-in animations) ==========

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.fade-in-section').forEach(el => observer.observe(el));
    document.querySelectorAll('.stat-card').forEach(el => observer.observe(el));
    document.querySelectorAll('.solution-card').forEach(el => observer.observe(el));
});

// ========== NAVIGATION ==========

function scrollToFooterForm() {
    const form = document.querySelector('.footer-form');
    if (form) {
        form.scrollIntoView({ behavior: 'smooth' });
    }
}

function scrollToContact() {
    const contact = document.getElementById('contact');
    if (contact) {
        contact.scrollIntoView({ behavior: 'smooth' });
    }
}

// Hamburger menu toggle
function toggleMenu() {
    const nav = document.querySelector('.main-nav');
    if (nav) {
        nav.classList.toggle('open');
    }
}

// Mobile dropdown toggle
document.addEventListener('DOMContentLoaded', function() {
    if (window.innerWidth <= 768) {
        document.querySelectorAll('.main-nav > li').forEach(function(li) {
            var dropdown = li.querySelector('.dropdown-menu');
            if (dropdown) {
                li.querySelector('a').addEventListener('click', function(e) {
                    if (window.innerWidth <= 768) {
                        e.preventDefault();
                        li.classList.toggle('dropdown-open');
                    }
                });
            }
        });
    }
});

// ========== CALCULATOR (luka emerytalna) ==========

let selectedGender = null;

function selectGender(gender) {
    selectedGender = gender;

    document.querySelectorAll('.gender-btn').forEach(function(btn) {
        btn.classList.remove('active');
    });

    var selected = document.querySelector('[data-gender="' + gender + '"]');
    if (selected) selected.classList.add('active');

    var retirementAgeInput = document.getElementById('retirementAge');
    if (retirementAgeInput) {
        retirementAgeInput.value = (gender === 'female') ? 60 : 65;
    }

    calculateTotalNeeded();
}

function calculateTotalNeeded() {
    var desiredPension = parseFloat(document.getElementById('desiredPension')?.value) || 0;
    var expectedPension = parseFloat(document.getElementById('expectedPension')?.value) || 0;
    var yearsInRetirement = parseInt(document.getElementById('yearsInRetirement')?.value) || 20;

    var monthlyGap = desiredPension - expectedPension;
    var totalNeeded = monthlyGap * yearsInRetirement * 12;

    var totalNeededValue = document.getElementById('totalNeededValue');
    if (totalNeededValue) {
        totalNeededValue.textContent = totalNeeded.toLocaleString('pl-PL') + ' zl';
    }

    // Show/hide calculator CTA
    var ctaBanner = document.querySelector('.calculator-cta');
    if (ctaBanner) {
        if (desiredPension > 0 && expectedPension > 0 && monthlyGap > 0) {
            ctaBanner.classList.add('visible');
            // Update the gap text
            var gapText = document.getElementById('gapMonthly');
            var gapTotal = document.getElementById('gapTotal');
            if (gapText) gapText.textContent = monthlyGap.toLocaleString('pl-PL') + ' zl';
            if (gapTotal) gapTotal.textContent = totalNeeded.toLocaleString('pl-PL') + ' zl';
        } else {
            ctaBanner.classList.remove('visible');
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    var yearsSlider = document.getElementById('yearsInRetirement');
    var yearsValue = document.getElementById('yearsValue');

    if (yearsSlider && yearsValue) {
        yearsSlider.addEventListener('input', function() {
            yearsValue.textContent = this.value;
            calculateTotalNeeded();
        });
    }

    var desiredInput = document.getElementById('desiredPension');
    var expectedInput = document.getElementById('expectedPension');
    if (desiredInput) desiredInput.addEventListener('input', calculateTotalNeeded);
    if (expectedInput) expectedInput.addEventListener('input', calculateTotalNeeded);
});
