<?php
// Debugging Logs
error_log('submit header' . print_r($_SERVER, true));
error_log('submit request' . print_r($_POST, true));

// Pflichtfeld Name prüfen und kodieren
$name = isset($_POST['Name:']) ? htmlspecialchars($_POST['Name:'], ENT_QUOTES, 'UTF-8') : '';
if ($name === '') {
    error_log("Name field is missing or empty");
}

// Erweiterte Debugging Logs
error_log("Name: " . $name);

// Feste Absenderadresse der eigenen Domain
$email_from = "kontakt@fewo-mainau.de";
$name_von_emailfeld = "Email:";
$name_von_namensfeld = $name;

// Empfängeradresse und Betreff
$send_dat = array(
    "dat1" => array("kontakt@fewo-mainau.de", "Anfrage Ferienwohnung Mainau")
);
$send_index = $_POST['send_index'] ?? '';
$st = ($send_index !== "") ? $send_index : "dat1";

$mailto = $send_dat[$st][0];
$subject = $send_dat[$st][1];

// Datum/Zeit
$wochentage = array("Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag");
$tag = $wochentage[date("w")];
$datum = date("d.m.Y");
$uhrzeit = date("H:i");

// Nachricht aufbauen
$msg = ">> Gesendet am $tag, den $datum um $uhrzeit Uhr von $name_von_namensfeld\n\n";

$ignore_fields = array('send_index', 'Submit', 'senden_y', 'Mobile:', 'Fax:');
foreach ($_POST as $feld => $wert) {
    if (!in_array($feld, $ignore_fields)) {
        $clean_value = preg_replace("/\r\n|\r|\n/", PHP_EOL, $wert);
        $msg .= "$feld $clean_value\n";
    }
}

// Header vorbereiten
$header = "From: $email_from\r\n";
if (!empty($_POST[$name_von_emailfeld])) {
    $reply_to = filter_var($_POST[$name_von_emailfeld], FILTER_VALIDATE_EMAIL);
    if ($reply_to) {
        $header .= "Reply-To: $reply_to\r\n";
    }
}

// Honeypot-Feld: Bot-Schutz
if (!empty($_POST['Mobile:']) || !empty($_POST['Fax:'])) {
    echo "success"; // Antwort an Bot
    exit;
}

// Pflichtfelder prüfen
if (empty($_POST['Name:']) || empty($_POST['Email:'])) {
    die(1);
}

// Mail senden
$mail_senden = mail($mailto, $subject, $msg, $header);

// Ergebnis prüfen und loggen
if ($mail_senden === true) {
    echo "success";
} else {
    error_log("Mailversand fehlgeschlagen an $mailto mit Header: $header und Nachricht: $msg");
    echo "error";
}
?>
