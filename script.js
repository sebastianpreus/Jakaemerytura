// ========== INTERSECTION OBSERVER (fade-in animations) ==========

var observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.fade-in-section').forEach(function(el) { observer.observe(el); });
    document.querySelectorAll('.stat-card').forEach(function(el) { observer.observe(el); });
    document.querySelectorAll('.solution-card').forEach(function(el) { observer.observe(el); });
});

// ========== NAVIGATION ==========

function scrollToFooterForm() {
    var form = document.querySelector('.footer-form');
    if (form) {
        form.scrollIntoView({ behavior: 'smooth' });
    }
}

function scrollToContact() {
    var contact = document.getElementById('contact');
    if (contact) {
        contact.scrollIntoView({ behavior: 'smooth' });
    }
}

function scrollToCalculator() {
    var calc = document.getElementById('calculator');
    if (calc) {
        calc.scrollIntoView({ behavior: 'smooth' });
    }
}

// Hamburger menu toggle
function toggleMenu() {
    var nav = document.querySelector('.main-nav');
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

// ========== HERO COUNT-UP ANIMATION ==========

function animateCountUp(element, target, suffix, duration) {
    var start = 0;
    var startTime = null;

    function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        // Ease out cubic
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = Math.round(start + (target - start) * eased);
        element.textContent = current + suffix;
        if (progress < 1) {
            requestAnimationFrame(step);
        }
    }

    requestAnimationFrame(step);
}

function startHeroAnimations() {
    var heroStats = document.querySelectorAll('.hero-stat-number');
    if (heroStats.length === 0) return;

    var heroObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                entry.target.dataset.animated = 'true';
                var target = parseInt(entry.target.dataset.target);
                var suffix = entry.target.dataset.suffix || '';
                animateCountUp(entry.target, target, suffix, 1500);
            }
        });
    }, { threshold: 0.5 });

    heroStats.forEach(function(el) { heroObserver.observe(el); });
}

document.addEventListener('DOMContentLoaded', startHeroAnimations);

// ========== CALCULATOR (luka emerytalna v2) ==========

var selectedGender = null;

// Replacement rate interpolation based on retirement year
function getReplacementRate(year) {
    var dataPoints = [
        { year: 2025, rate: 0.56 },
        { year: 2030, rate: 0.47 },
        { year: 2040, rate: 0.37 },
        { year: 2050, rate: 0.29 },
        { year: 2060, rate: 0.25 }
    ];

    // Before first data point
    if (year <= dataPoints[0].year) return dataPoints[0].rate;
    // After last data point
    if (year >= dataPoints[dataPoints.length - 1].year) return dataPoints[dataPoints.length - 1].rate;

    // Find surrounding points and interpolate
    for (var i = 0; i < dataPoints.length - 1; i++) {
        if (year >= dataPoints[i].year && year <= dataPoints[i + 1].year) {
            var yearRange = dataPoints[i + 1].year - dataPoints[i].year;
            var rateRange = dataPoints[i + 1].rate - dataPoints[i].rate;
            var progress = (year - dataPoints[i].year) / yearRange;
            return dataPoints[i].rate + (rateRange * progress);
        }
    }

    return 0.30; // fallback
}

// Years in retirement (average for Poland)
function getYearsInRetirement() {
    return 20;
}

function getRetirementAge(gender) {
    return gender === 'female' ? 60 : 65;
}

// Quick salary buttons
function setSalary(amount) {
    var salaryInput = document.getElementById('salary');
    if (salaryInput) {
        salaryInput.value = amount;
        // Remove active from all quick buttons
        document.querySelectorAll('.quick-salary-btn').forEach(function(btn) {
            btn.classList.remove('active');
        });
        // Mark clicked as active
        document.querySelectorAll('.quick-salary-btn').forEach(function(btn) {
            if (parseInt(btn.dataset.amount) === amount) {
                btn.classList.add('active');
            }
        });
        updateCalculator();
    }
}

function selectGender(gender) {
    selectedGender = gender;

    document.querySelectorAll('.gender-btn').forEach(function(btn) {
        btn.classList.remove('active');
    });

    var selected = document.querySelector('[data-gender="' + gender + '"]');
    if (selected) selected.classList.add('active');

    var retirementAgeInput = document.getElementById('retirementAge');
    if (retirementAgeInput) {
        retirementAgeInput.value = getRetirementAge(gender);
    }

    updateCalculator();
}

function updateCalculator() {
    var salary = parseFloat(document.getElementById('salary')?.value) || 0;
    var currentAge = parseInt(document.getElementById('currentAge')?.value) || 0;
    var retirementAge = parseInt(document.getElementById('retirementAge')?.value) || 0;

    // Step 2: Estimate ZUS pension
    var zusBox = document.getElementById('zusEstimateBox');
    var zusValueEl = document.getElementById('zusEstimateValue');
    var zusDescEl = document.getElementById('zusEstimateDesc');
    var expectedPensionInput = document.getElementById('expectedPension');

    if (salary > 0 && currentAge >= 18 && currentAge <= 66 && selectedGender && retirementAge > 0) {
        var yearsToRetirement = retirementAge - currentAge;
        var currentYear = new Date().getFullYear();
        var retirementYear = currentYear + yearsToRetirement;
        var rate = getReplacementRate(retirementYear);
        var estimatedPension = Math.round(salary * rate);

        if (zusValueEl) zusValueEl.textContent = estimatedPension.toLocaleString('pl-PL') + ' zl netto / miesiac';
        if (zusDescEl) {
            var ratePercent = Math.round(rate * 100);
            zusDescEl.textContent = 'Przy obecnych trendach osoby przechodzace na emeryture za ~'
                + yearsToRetirement + ' lat moga liczyc na ok. ' + ratePercent + '% ostatnich zarobkow netto.';
        }
        if (zusBox) zusBox.style.display = 'block';

        // Auto-fill the editable pension field
        if (expectedPensionInput && !expectedPensionInput.dataset.userEdited) {
            expectedPensionInput.value = estimatedPension;
        }
    } else {
        if (zusBox) zusBox.style.display = 'none';
    }

    // Step 4: Calculate gap
    calculateGap();
}

function calculateGap() {
    var salary = parseFloat(document.getElementById('salary')?.value) || 0;
    var currentAge = parseInt(document.getElementById('currentAge')?.value) || 0;
    var retirementAge = parseInt(document.getElementById('retirementAge')?.value) || 0;
    var expectedPension = parseFloat(document.getElementById('expectedPension')?.value) || 0;
    var desiredPension = parseFloat(document.getElementById('desiredPension')?.value) || 0;

    var resultBox = document.getElementById('resultBox');
    var ctaBanner = document.querySelector('.calculator-cta');

    if (desiredPension > 0 && expectedPension > 0 && selectedGender && currentAge >= 18) {
        var monthlyGap = desiredPension - expectedPension;
        var yearsInRetirement = getYearsInRetirement();
        var totalGap = monthlyGap * yearsInRetirement * 12;
        var yearsToRetirement = retirementAge - currentAge;

        // Update result box
        var gapMonthlyEl = document.getElementById('resultGapMonthly');
        var gapTotalEl = document.getElementById('resultGapTotal');
        var yearsToEl = document.getElementById('resultYearsTo');
        var yearsInEl = document.getElementById('resultYearsIn');

        if (gapMonthlyEl) {
            if (monthlyGap > 0) {
                gapMonthlyEl.textContent = monthlyGap.toLocaleString('pl-PL') + ' zl / miesiac';
                gapMonthlyEl.className = 'result-gap-value negative';
            } else {
                gapMonthlyEl.textContent = '0 zl – gratulacje!';
                gapMonthlyEl.className = 'result-gap-value positive';
            }
        }
        if (gapTotalEl) {
            if (totalGap > 0) {
                gapTotalEl.textContent = totalGap.toLocaleString('pl-PL') + ' zl lacznie';
            } else {
                gapTotalEl.textContent = 'Brak luki – Twoja emerytura pokrywa potrzeby';
            }
        }
        if (yearsToEl) yearsToEl.textContent = yearsToRetirement + ' lat';
        if (yearsInEl) {
            yearsInEl.textContent = '~' + yearsInRetirement + ' lat';
        }

        if (resultBox) {
            resultBox.style.display = 'block';
            resultBox.style.animation = 'slideIn 0.5s ease';
        }

        // Dynamic CTA
        if (ctaBanner) {
            var ctaTextEl = document.getElementById('ctaDynamicText');
            var ctaText = '';

            if (monthlyGap <= 0) {
                ctaText = 'Swietnie! Twoja planowana emerytura pokrywa potrzeby. Warto jednak upewnic sie ze plan jest bezpieczny.';
            } else if (monthlyGap < 1000) {
                ctaText = 'Twoja luka jest do zamkniecia. Kilka dobrych decyzji wystarczy – porozmawiajmy.';
            } else if (monthlyGap < 3000) {
                ctaText = 'Twoja luka to ' + monthlyGap.toLocaleString('pl-PL') + ' zl miesiecznie. To rozwiazywalne – ale im szybciej zaczniesz, tym lepiej.';
            } else {
                ctaText = 'Twoja luka to ' + monthlyGap.toLocaleString('pl-PL') + ' zl miesiecznie. Nie czekaj – czas dziala na Twoja korzysc tylko jesli zaczniesz teraz.';
            }

            if (ctaTextEl) ctaTextEl.textContent = ctaText;
            ctaBanner.classList.add('visible');
        }
    } else {
        if (resultBox) resultBox.style.display = 'none';
        if (ctaBanner) ctaBanner.classList.remove('visible');
    }
}

// Setup calculator listeners
document.addEventListener('DOMContentLoaded', function() {
    var salaryInput = document.getElementById('salary');
    var currentAgeInput = document.getElementById('currentAge');
    var expectedPensionInput = document.getElementById('expectedPension');
    var desiredPensionInput = document.getElementById('desiredPension');

    if (salaryInput) {
        salaryInput.addEventListener('input', function() {
            // Deactivate quick buttons when user types custom value
            document.querySelectorAll('.quick-salary-btn').forEach(function(btn) {
                btn.classList.remove('active');
            });
            updateCalculator();
        });
    }

    if (currentAgeInput) currentAgeInput.addEventListener('input', updateCalculator);

    if (expectedPensionInput) {
        expectedPensionInput.addEventListener('input', function() {
            expectedPensionInput.dataset.userEdited = 'true';
            calculateGap();
        });
    }

    if (desiredPensionInput) desiredPensionInput.addEventListener('input', calculateGap);
});
