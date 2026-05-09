<?php
error_log('submit header'. print_r($_SERVER, true));
error_log('submit request'. print_r($_POST, true));
error_log("Name:" . $_POST['Name:']);


$email_from = "kontakt@fewo-mainau.de";   //Absender falls keiner angegeben wurde
$sendermail_antwort = 1;      //E-Mail Adresse des Besuchers als Absender. 0= Nein ; 1 = Ja
$name_von_emailfeld = "Email:";   //Feld in der die Absenderadresse steht

$name = htmlspecialchars($_POST['Name:'], ENT_QUOTES, 'UTF-8');
$name_von_namensfeld = $_POST['Name:'];

//$send_dat ist ein mehrdimensionales Array, in dem zuerst die Empfängeradresse steht,
//dann die CC-Adresse, dann der Betreff und dann die URL, auf die der Besucher weitergeleitet
//wird, wenn die Mail gesendet wurde und zum Schluss die URL, auf die der Besucher weitergeleitet
//wird, wenn ein Fehler beim senden auftrat
$send_dat = array(
"dat1" => array("kontakt@fewo-mainau.de","Anfrage Ferienwohnung Mainau")

 );


//Diese Felder werden nicht in der Mail stehen
$ignore_fields = array('send_index','Submit','senden_y','Mobile:','Fax:');

//Hier wird ausgehwählt, welcher "Datensatz" aus $send_dat die Mail bekommt
$send_index = @$_POST['send_index'];

//Wenn kein send_index gesetzt wurde, bekommt der 1 Datensatz die Mail
if ($send_index!="") {
   $st=$send_index;
} else {
   $st="dat1";
}


$mailto = $send_dat[$st][0];   //An diese Adresse geht die Email
$subject = $send_dat[$st][1];  //Betreff der Mail


//Datum, wann die Mail erstellt wurde
$name_tag[0] = "Sonntag";
$name_tag[1] = "Montag";
$name_tag[2] = "Dienstag";
$name_tag[3] = "Mittwoch";
$name_tag[4] = "Donnerstag";
$name_tag[5] = "Freitag";
$name_tag[6] = "Samstag";
$num_tag = date("w");
$tag = $name_tag[$num_tag];
$jahr = date("Y");
$n = date("d");
$monat = date("m");
$time = date("H:i");


//Erste Zeile unserer Email
$msg = ">> Gesendet am $tag, den $n.$monat.$jahr um $time Uhr von $name_von_namensfeld \n\n";

//Hier werden alle Eingabefelder abgefragt
//while (list($name,$value) = each($_POST)) {
//   if (in_array($name, $ignore_fields)) {
//        continue; //Ignore Feld wird nicht in die Mail eingefügt
//   }
//   $msg .= "$name $value\n";
//}
foreach ( $_POST as $name => $value ) {
    if ( ! in_array( $name, $ignore_fields ) ) {
        $msg .= "$name $value\n";
    }
}


//E-Mail Adresse des Besuchers als Absender
if ($sendermail_antwort==1 and isset($_POST[$name_von_emailfeld])) {
   $email_from = $_POST[$name_von_emailfeld];
}

$header="From: $email_from ";
//Honeypot
if (!empty($_POST['Mobile:']) || !empty($_POST['Fax:'])) {
    // Honeypot field is filled, likely spam
    // You can choose to log this, send a fake success message, or simply ignore it
    echo "success"; // Pretend it was successful to fool bots
    exit; // Stop executing the script
}

//Wann leer dann Email nicht abschicken
if (empty(@$_POST['Name:']) || empty(@$_POST['Email:'])) {
    die(1);
}
$mail_senden = mail ($mailto,$subject,$msg,$header);

//Weiterleitung, hier konnte jetzt per echo auch Ausgaben stehen
if ($mail_senden === true) {
    echo "success"; // Simplify the response for AJAX handling
} else {
    echo "error"; // Indicate an error
}


?>

