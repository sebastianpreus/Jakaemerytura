<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'error' => 'Tylko POST']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input || empty($input['email'])) {
    echo json_encode(['success' => false, 'error' => 'Brak adresu email']);
    exit;
}

// Dane
$email = filter_var($input['email'], FILTER_SANITIZE_EMAIL);
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'error' => 'Niepoprawny email']);
    exit;
}

$consultation = !empty($input['consultation']);
$contactName = htmlspecialchars($input['contactName'] ?? '');
$contactPhone = htmlspecialchars($input['contactPhone'] ?? '');

$salary = intval($input['salary'] ?? 0);
$currentAge = intval($input['currentAge'] ?? 0);
$retirementAge = intval($input['retirementAge'] ?? 0);
$gender = htmlspecialchars($input['gender'] ?? '');
$isBusiness = !empty($input['isBusiness']);
$expectedPension = intval($input['expectedPension'] ?? 0);
$desiredPension = intval($input['desiredPension'] ?? 0);
$monthlyGap = intval($input['monthlyGap'] ?? 0);
$totalGap = intval($input['totalGap'] ?? 0);
$yearsToRetirement = intval($input['yearsToRetirement'] ?? 0);
$yearsInRetirement = intval($input['yearsInRetirement'] ?? 20);
$monthlyAmount = intval($input['monthlyAmount'] ?? 0);
$delay = intval($input['delay'] ?? 0);
$effectiveYears = intval($input['effectiveYears'] ?? 0);
$totalDeposits = intval($input['totalDeposits'] ?? 0);
$futureValue = intval($input['futureValue'] ?? 0);
$interestGained = intval($input['interestGained'] ?? 0);
$remainingGap = intval($input['remainingGap'] ?? 0);

$genderLabel = ($gender === 'male') ? 'Mężczyzna' : 'Kobieta';
$businessLabel = $isBusiness ? 'Tak (minimalne składki ZUS)' : 'Nie';
$delayLabel = ($delay === 0) ? 'Od teraz' : 'Za ' . $delay . ' lat';

// Formatowanie kwot
function fmt($n) {
    return number_format($n, 0, ',', ' ');
}

// Kolor luki
$gapColor = '#dc2626';
$gapBg = '#fef2f2';
$gapBorder = '#fecaca';
if ($remainingGap <= 0) {
    $gapColor = '#059669';
    $gapBg = '#ecfdf5';
    $gapBorder = '#a7f3d0';
} elseif ($totalGap > 0 && $remainingGap < $totalGap * 0.2) {
    $gapColor = '#d97706';
    $gapBg = '#fffbeb';
    $gapBorder = '#fde68a';
}

// HTML Email
$html = '
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,Helvetica,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:20px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.1);">

<!-- Header -->
<tr>
<td style="background:linear-gradient(135deg,#10b981,#059669);padding:30px 40px;text-align:center;">
    <h1 style="color:white;margin:0;font-size:24px;">jakaemerytura.pl</h1>
    <p style="color:rgba(255,255,255,0.9);margin:8px 0 0;font-size:16px;">Twój raport emerytalny</p>
</td>
</tr>

<!-- Intro -->
<tr>
<td style="padding:30px 40px 10px;">
    <p style="color:#333;font-size:15px;line-height:1.6;margin:0;">
        Cześć! Oto podsumowanie Twojej sytuacji emerytalnej na podstawie danych, które podałeś w kalkulatorze.
    </p>
</td>
</tr>

<!-- Sekcja 1: Twoja sytuacja -->
<tr>
<td style="padding:20px 40px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f9fa;border-radius:10px;padding:20px;">
    <tr><td style="padding:20px;">
        <h2 style="color:#059669;font-size:16px;margin:0 0 15px;text-transform:uppercase;letter-spacing:1px;">📊 Twoja sytuacja</h2>
        <table width="100%" cellpadding="4" cellspacing="0">
            <tr>
                <td style="color:#666;font-size:14px;padding:4px 0;">Wiek:</td>
                <td style="color:#333;font-size:14px;font-weight:bold;text-align:right;">' . $currentAge . ' lat</td>
            </tr>
            <tr>
                <td style="color:#666;font-size:14px;padding:4px 0;">Płeć:</td>
                <td style="color:#333;font-size:14px;font-weight:bold;text-align:right;">' . $genderLabel . '</td>
            </tr>
            <tr>
                <td style="color:#666;font-size:14px;padding:4px 0;">Emerytura za:</td>
                <td style="color:#333;font-size:14px;font-weight:bold;text-align:right;">' . $yearsToRetirement . ' lat</td>
            </tr>
            <tr>
                <td style="color:#666;font-size:14px;padding:4px 0;">Zarobki netto:</td>
                <td style="color:#333;font-size:14px;font-weight:bold;text-align:right;">' . fmt($salary) . ' zł / mies.</td>
            </tr>
            ' . ($isBusiness ? '<tr>
                <td style="color:#666;font-size:14px;padding:4px 0;">Działalność gospodarcza:</td>
                <td style="color:#333;font-size:14px;font-weight:bold;text-align:right;">' . $businessLabel . '</td>
            </tr>' : '') . '
        </table>
    </td></tr>
    </table>
</td>
</tr>

<!-- Sekcja 2: Prognoza -->
<tr>
<td style="padding:10px 40px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#fffbeb;border:1px solid #fde68a;border-radius:10px;">
    <tr><td style="padding:20px;">
        <h2 style="color:#92400e;font-size:16px;margin:0 0 15px;text-transform:uppercase;letter-spacing:1px;">📉 Prognoza emerytalna</h2>
        <table width="100%" cellpadding="4" cellspacing="0">
            <tr>
                <td style="color:#666;font-size:14px;padding:4px 0;">Prognozowana emerytura:</td>
                <td style="color:#333;font-size:14px;font-weight:bold;text-align:right;">~' . fmt($expectedPension) . ' zł / mies.</td>
            </tr>
            <tr>
                <td style="color:#666;font-size:14px;padding:4px 0;">Oczekiwana emerytura:</td>
                <td style="color:#333;font-size:14px;font-weight:bold;text-align:right;">' . fmt($desiredPension) . ' zł / mies.</td>
            </tr>
            <tr>
                <td colspan="2" style="padding:10px 0 4px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;">
                    <tr><td style="text-align:center;padding:12px;">
                        <span style="color:#991b1b;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Luka emerytalna</span><br>
                        <span style="color:#dc2626;font-size:22px;font-weight:800;">' . fmt($monthlyGap) . ' zł / mies.</span><br>
                        <span style="color:#991b1b;font-size:12px;">' . fmt($totalGap) . ' zł przez ' . $yearsInRetirement . ' lat emerytury</span>
                    </td></tr>
                    </table>
                </td>
            </tr>
        </table>
    </td></tr>
    </table>
</td>
</tr>

<!-- Sekcja 3: Potencjał oszczędzania -->
<tr>
<td style="padding:10px 40px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#ecfdf5;border:1px solid #a7f3d0;border-radius:10px;">
    <tr><td style="padding:20px;">
        <h2 style="color:#065f46;font-size:16px;margin:0 0 15px;text-transform:uppercase;letter-spacing:1px;">💰 Potencjał oszczędzania</h2>
        <p style="color:#333;font-size:14px;margin:0 0 12px;">
            Odkładając <strong>' . fmt($monthlyAmount) . ' zł miesięcznie</strong> przez <strong>' . $effectiveYears . ' lat</strong> przy 4% rocznie:
        </p>
        <table width="100%" cellpadding="0" cellspacing="8">
            <tr>
                <td width="33%" style="background:white;border-radius:8px;text-align:center;padding:12px 8px;">
                    <span style="color:#666;font-size:11px;display:block;">Twoje wpłaty</span>
                    <span style="color:#333;font-size:16px;font-weight:800;">' . fmt($totalDeposits) . ' zł</span>
                </td>
                <td width="33%" style="background:white;border:1px solid #10b981;border-radius:8px;text-align:center;padding:12px 8px;">
                    <span style="color:#666;font-size:11px;display:block;">Zysk z odsetek</span>
                    <span style="color:#059669;font-size:16px;font-weight:800;">+' . fmt($interestGained) . ' zł</span>
                </td>
                <td width="33%" style="background:#059669;border-radius:8px;text-align:center;padding:12px 8px;">
                    <span style="color:rgba(255,255,255,0.85);font-size:11px;display:block;">Razem</span>
                    <span style="color:white;font-size:16px;font-weight:800;">' . fmt($futureValue) . ' zł</span>
                </td>
            </tr>
        </table>
        ' . ($delay > 0 ? '<p style="color:#666;font-size:13px;margin:10px 0 0;font-style:italic;">Start oszczędzania: za ' . $delay . ' lat</p>' : '') . '
    </td></tr>
    </table>
</td>
</tr>

<!-- Sekcja 4: Pozostała luka -->
<tr>
<td style="padding:10px 40px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:' . $gapBg . ';border:2px solid ' . $gapBorder . ';border-radius:10px;">
    <tr><td style="text-align:center;padding:20px;">
        <span style="color:' . $gapColor . ';font-size:12px;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Pozostała luka emerytalna</span><br>
        <span style="color:' . $gapColor . ';font-size:28px;font-weight:800;">' . fmt($remainingGap) . ' zł</span>
        ' . ($remainingGap <= 0 ? '<br><span style="color:#059669;font-size:13px;">🎉 Gratulacje! Twój plan pokrywa potrzeby emerytalne.</span>' : '') . '
    </td></tr>
    </table>
</td>
</tr>

<!-- CTA -->
<tr>
<td style="padding:25px 40px;text-align:center;">
    <p style="color:#333;font-size:15px;margin:0 0 15px;">
        Każda sytuacja jest inna. Porozmawiaj z doradcą i sprawdź,<br>jakie rozwiązania najlepiej pasują do Ciebie.
    </p>
    <a href="https://jakaemerytura.pl/#footerForm" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#10b981,#059669);color:white;text-decoration:none;border-radius:8px;font-size:16px;font-weight:600;">
        Umów bezpłatną konsultację
    </a>
</td>
</tr>

<!-- Footer -->
<tr>
<td style="background:#2c3e50;padding:20px 40px;text-align:center;">
    <p style="color:rgba(255,255,255,0.7);font-size:12px;margin:0;">
        jakaemerytura.pl &middot; Raport wygenerowany automatycznie<br>
        Dane mają charakter poglądowy i nie stanowią porady finansowej.
    </p>
</td>
</tr>

</table>
</td></tr>
</table>
</body>
</html>';

// Nagłówki emaila
$subject = 'Twój raport emerytalny - jakaemerytura.pl';
$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers .= "From: jakaemerytura.pl <noreply@jakaemerytura.pl>\r\n";

// Wyślij do użytkownika
$sent = mail($email, $subject, $html, $headers);

// Kopia do doradcy (jeśli konsultacja)
if ($consultation && $contactName && $contactPhone) {
    $advisorSubject = 'Nowy lead - ' . $contactName . ' - jakaemerytura.pl';

    $leadInfo = '
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#fef3c7;border:2px solid #f59e0b;border-radius:10px;margin-bottom:20px;">
    <tr><td style="padding:20px;">
        <h2 style="color:#92400e;font-size:18px;margin:0 0 12px;">📋 DANE KONTAKTOWE KLIENTA</h2>
        <table cellpadding="4" cellspacing="0">
            <tr>
                <td style="color:#666;font-size:14px;padding:4px 0;">Imię i nazwisko:</td>
                <td style="color:#333;font-size:14px;font-weight:bold;">' . $contactName . '</td>
            </tr>
            <tr>
                <td style="color:#666;font-size:14px;padding:4px 0;">Telefon:</td>
                <td style="color:#333;font-size:14px;font-weight:bold;">' . $contactPhone . '</td>
            </tr>
            <tr>
                <td style="color:#666;font-size:14px;padding:4px 0;">Email:</td>
                <td style="color:#333;font-size:14px;font-weight:bold;">' . $email . '</td>
            </tr>
        </table>
    </td></tr>
    </table>';

    // Wstaw dane kontaktowe na początek raportu (po headerze)
    $advisorHtml = str_replace(
        '<!-- Intro -->',
        '<!-- Lead info -->
        <tr><td style="padding:20px 40px 0;">' . $leadInfo . '</td></tr>
        <!-- Intro -->',
        $html
    );

    $advisorEmail = 'sebastian.preus@phinance.pl';
    mail($advisorEmail, $advisorSubject, $advisorHtml, $headers);
}

if ($sent) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Nie udało się wysłać emaila. Spróbuj ponownie.']);
}
