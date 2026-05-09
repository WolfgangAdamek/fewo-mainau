<?php
// Debugging Logs
error_log('submit header'. print_r($_SERVER, true));
error_log('submit request'. print_r($_POST, true));

// Sicherstellen, dass der Name existiert und kodiert ist
$name = isset($_POST['Name:']) ? htmlspecialchars($_POST['Name:'], ENT_QUOTES, 'UTF-8') : '';
if ($name === '') {
    error_log("Name field is missing or empty");
}

// Erweiterte Debugging Logs
error_log("Name: " . $name);

$email_from = "kontakt@fewo-mainau.de";   // Absender falls keiner angegeben wurde
$sendermail_antwort = 1;      // E-Mail Adresse des Besuchers als Absender. 0= Nein ; 1 = Ja
$name_von_emailfeld = "Email:";   // Feld in der die Absenderadresse steht

$name_von_namensfeld = $name;

// Empfängerdaten
$send_dat = array(
    "dat1" => array("kontakt@fewo-mainau.de","Anfrage Ferienwohnung Mainau")
);

// Ignorierte Felder
$ignore_fields = array('send_index','Submit','senden_y','Mobile:','Fax:');

// Ausgewählter Datensatz
$send_index = @$_POST['send_index'];
$st = ($send_index != "") ? $send_index : "dat1";

$mailto = $send_dat[$st][0];   // Empfänger
$subject = $send_dat[$st][1];  // Betreff

// Datum
$name_tag = array("Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag");
$num_tag = date("w");
$tag = $name_tag[$num_tag];
$jahr = date("Y");
$n = date("d");
$monat = date("m");
$time = date("H:i");

// Nachricht vorbereiten
$msg = ">> Gesendet am $tag, den $n.$monat.$jahr um $time Uhr von $name_von_namensfeld \n\n";

foreach ($_POST as $name => $value) {
    if (!in_array($name, $ignore_fields)) {
        // Zeilenumbrüche vereinheitlichen
        $clean_value = preg_replace("/\r\n|\r|\n/", PHP_EOL, $value);
        $msg .= "$name $clean_value\n";
    }
}

// E-Mail des Besuchers als Absender
if ($sendermail_antwort == 1 && isset($_POST[$name_von_emailfeld])) {
    $email_from = $_POST[$name_von_emailfeld];
}

$header = "From: $email_from ";

// Honeypot Schutz
if (!empty($_POST['Mobile:']) || !empty($_POST['Fax:'])) {
    echo "success"; // Bots täuschen
    exit;
}

// Leere Pflichtfelder prüfen
if (empty($_POST['Name:']) || empty($_POST['Email:'])) {
    die(1);
}

// Mail senden
$mail_senden = mail($mailto, $subject, $msg, $header);

// Rückmeldung
if ($mail_senden === true) {
    echo "success";
} else {
    echo "error";
}
?>
