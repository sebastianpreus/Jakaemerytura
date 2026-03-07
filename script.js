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
        // Uncheck business toggle
        var bizToggle = document.getElementById('businessToggle');
        if (bizToggle) bizToggle.checked = false;
        updateCalculator();
    }
}

// Business toggle - minimum ZUS contribution base
function toggleBusiness(checked) {
    var salaryInput = document.getElementById('salary');
    if (checked) {
        // DG na minimalnych składkach ZUS - netto ~3200 zł
        salaryInput.value = 3200;
        // Deactivate quick salary buttons
        document.querySelectorAll('.quick-salary-btn').forEach(function(btn) {
            btn.classList.remove('active');
        });
    }
    updateCalculator();
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
                gapMonthlyEl.textContent = monthlyGap.toLocaleString('pl-PL') + ' zl';
                gapMonthlyEl.className = 'result-gap-value negative';
            } else {
                gapMonthlyEl.textContent = '0 zl';
                gapMonthlyEl.className = 'result-gap-value positive';
            }
        }
        if (gapTotalEl) {
            if (totalGap > 0) {
                gapTotalEl.textContent = totalGap.toLocaleString('pl-PL') + ' zl';
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

    // Update savings simulator
    updateSavingsSimulator();
}

// Savings simulator - procent składany z miesięcznymi wpłatami
function updateSavingsSimulator() {
    var simulator = document.getElementById('savingsSimulator');
    var resultValueEl = document.getElementById('savingsResultValue');
    var depositsValueEl = document.getElementById('savingsDepositsValue');
    var interestValueEl = document.getElementById('savingsInterestValue');
    var delaySlider = document.getElementById('savingsStartDelay');
    var delayValueEl = document.getElementById('savingsStartDelayValue');
    if (!simulator || !resultValueEl) return;

    var retirementAge = parseInt(document.getElementById('retirementAge')?.value) || 0;
    var currentAge = parseInt(document.getElementById('currentAge')?.value) || 0;
    var yearsToRetirement = retirementAge - currentAge;

    if (yearsToRetirement > 0 && currentAge >= 18 && selectedGender) {
        // Ustaw max suwaka na lata do emerytury minus 1
        if (delaySlider) {
            var maxDelay = yearsToRetirement - 1;
            if (maxDelay < 1) maxDelay = 1;
            delaySlider.max = maxDelay;
            if (parseInt(delaySlider.value) > maxDelay) {
                delaySlider.value = 0;
            }
        }

        var delay = parseInt(delaySlider?.value) || 0;
        var effectiveYears = yearsToRetirement - delay;
        if (effectiveYears < 1) effectiveYears = 1;

        // Aktualizuj label suwaka
        if (delayValueEl) {
            delayValueEl.textContent = delay === 0 ? 'Teraz' : 'za ' + delay + ' lat';
        }

        var monthlyAmount = parseFloat(document.getElementById('monthlyAmount')?.value) || 500;
        var annualRate = 0.04;
        var monthlyRate = annualRate / 12;
        var months = effectiveYears * 12;

        var totalDeposits = monthlyAmount * months;
        // FV = PMT × [((1 + r)^n - 1) / r]
        var futureValue = monthlyAmount * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
        futureValue = Math.round(futureValue);
        var interestGained = futureValue - totalDeposits;

        if (depositsValueEl) depositsValueEl.textContent = Math.round(totalDeposits).toLocaleString('pl-PL') + ' zl';
        if (interestValueEl) interestValueEl.textContent = '+' + Math.round(interestGained).toLocaleString('pl-PL') + ' zl';
        resultValueEl.textContent = futureValue.toLocaleString('pl-PL') + ' zl';

        // Karta luki emerytalnej
        var gapCard = document.getElementById('savingsGapCard');
        var gapValueEl = document.getElementById('savingsGapValue');
        if (gapCard && gapValueEl) {
            var desiredPension = parseFloat(document.getElementById('desiredPension')?.value) || 0;
            var expectedPension = parseFloat(document.getElementById('expectedPension')?.value) || 0;
            var yearsInRetirement = getYearsInRetirement();
            var totalNeed = (desiredPension - expectedPension) * yearsInRetirement * 12;
            if (totalNeed < 0) totalNeed = 0;

            var remainingGap = totalNeed - futureValue;
            if (remainingGap < 0) remainingGap = 0;

            gapValueEl.textContent = Math.round(remainingGap).toLocaleString('pl-PL') + ' zl';

            // Kolorowanie: zielony (brak luki), żółty (<20% zapotrzebowania), czerwony
            gapCard.classList.remove('gap-green', 'gap-yellow');
            if (remainingGap <= 0) {
                gapCard.classList.add('gap-green');
            } else if (totalNeed > 0 && remainingGap < totalNeed * 0.2) {
                gapCard.classList.add('gap-yellow');
            }
        }

        simulator.style.display = 'block';
    } else {
        simulator.style.display = 'none';
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

    // Savings simulator sliders
    var monthlyAmountSlider = document.getElementById('monthlyAmount');
    var monthlyAmountValueEl = document.getElementById('monthlyAmountValue');
    if (monthlyAmountSlider) {
        monthlyAmountSlider.addEventListener('input', function() {
            if (monthlyAmountValueEl) {
                monthlyAmountValueEl.textContent = this.value + ' zl';
            }
            updateSavingsSimulator();
        });
    }

    var delaySlider = document.getElementById('savingsStartDelay');
    if (delaySlider) {
        delaySlider.addEventListener('input', function() {
            updateSavingsSimulator();
        });
    }

    // Modal: zamykanie Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeReportModal();
    });
});

// ========== REPORT MODAL ==========

function openReportModal() {
    var overlay = document.getElementById('reportModalOverlay');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeReportModal(event) {
    if (event && event.target !== event.currentTarget) return;
    var overlay = document.getElementById('reportModalOverlay');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
}

function toggleConsultationFields() {
    var checked = document.getElementById('reportConsultation').checked;
    var fields = document.getElementById('reportConsultationFields');
    if (fields) fields.style.display = checked ? 'block' : 'none';
}

function sendReport() {
    var emailInput = document.getElementById('reportEmail');
    var email = emailInput?.value?.trim();
    var statusEl = document.getElementById('reportStatus');
    var submitBtn = document.getElementById('reportSubmitBtn');

    if (!email || !email.includes('@')) {
        if (statusEl) {
            statusEl.textContent = 'Wpisz poprawny adres email.';
            statusEl.style.color = '#dc2626';
        }
        return;
    }

    var consultation = document.getElementById('reportConsultation')?.checked || false;
    var contactName = '';
    var contactPhone = '';

    if (consultation) {
        contactName = document.getElementById('reportName')?.value?.trim() || '';
        contactPhone = document.getElementById('reportPhone')?.value?.trim() || '';
        if (!contactName || !contactPhone) {
            if (statusEl) {
                statusEl.textContent = 'Podaj imię, nazwisko i numer telefonu.';
                statusEl.style.color = '#dc2626';
            }
            return;
        }
    }

    // Zbierz dane z kalkulatora
    var salary = parseFloat(document.getElementById('salary')?.value) || 0;
    var currentAge = parseInt(document.getElementById('currentAge')?.value) || 0;
    var retirementAge = parseInt(document.getElementById('retirementAge')?.value) || 0;
    var expectedPension = parseFloat(document.getElementById('expectedPension')?.value) || 0;
    var desiredPension = parseFloat(document.getElementById('desiredPension')?.value) || 0;
    var isBusiness = document.getElementById('businessToggle')?.checked || false;
    var gender = selectedGender || '';
    var yearsToRetirement = retirementAge - currentAge;
    var monthlyGap = desiredPension - expectedPension;
    if (monthlyGap < 0) monthlyGap = 0;
    var yearsInRetirement = getYearsInRetirement();
    var totalGap = monthlyGap * yearsInRetirement * 12;

    // Dane z savings simulator
    var monthlyAmount = parseFloat(document.getElementById('monthlyAmount')?.value) || 500;
    var delay = parseInt(document.getElementById('savingsStartDelay')?.value) || 0;
    var effectiveYears = yearsToRetirement - delay;
    if (effectiveYears < 1) effectiveYears = 1;
    var annualRate = 0.04;
    var monthlyRate = annualRate / 12;
    var months = effectiveYears * 12;
    var totalDeposits = monthlyAmount * months;
    var futureValue = Math.round(monthlyAmount * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate));
    var interestGained = futureValue - totalDeposits;
    var remainingGap = totalGap - futureValue;
    if (remainingGap < 0) remainingGap = 0;

    var data = {
        email: email,
        consultation: consultation,
        contactName: contactName,
        contactPhone: contactPhone,
        salary: salary,
        currentAge: currentAge,
        retirementAge: retirementAge,
        gender: gender,
        isBusiness: isBusiness,
        expectedPension: expectedPension,
        desiredPension: desiredPension,
        monthlyGap: monthlyGap,
        totalGap: totalGap,
        yearsToRetirement: yearsToRetirement,
        yearsInRetirement: yearsInRetirement,
        monthlyAmount: monthlyAmount,
        delay: delay,
        effectiveYears: effectiveYears,
        totalDeposits: Math.round(totalDeposits),
        futureValue: futureValue,
        interestGained: Math.round(interestGained),
        remainingGap: Math.round(remainingGap)
    };

    // Wyślij
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Wysylanie...';
    }
    if (statusEl) {
        statusEl.textContent = '';
    }

    fetch('send-report.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(function(response) { return response.json(); })
    .then(function(result) {
        if (result.success) {
            if (statusEl) {
                statusEl.textContent = 'Raport wyslany! Sprawdz swoją skrzynke.';
                statusEl.style.color = '#059669';
            }
            if (submitBtn) {
                submitBtn.textContent = 'Wyslano!';
            }
            setTimeout(function() {
                closeReportModal();
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Wyslij raport';
                }
                if (statusEl) statusEl.textContent = '';
            }, 2500);
        } else {
            if (statusEl) {
                statusEl.textContent = result.error || 'Blad wysylki. Sprobuj ponownie.';
                statusEl.style.color = '#dc2626';
            }
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Wyslij raport';
            }
        }
    })
    .catch(function() {
        if (statusEl) {
            statusEl.textContent = 'Blad polaczenia. Sprobuj ponownie.';
            statusEl.style.color = '#dc2626';
        }
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Wyslij raport';
        }
    });
}
