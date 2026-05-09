<?php
//	include the calendar file
$the_file="ac-includes/cal.inc.php";
if(!file_exists($the_file)) die("<b>".$the_file."</b> not found");
else		require_once($the_file);
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<title>Buchungskalender - <?php echo AC_TITLE; ?></title>
		<link rel="stylesheet" href="<?php echo AC_DIR_CSS; ?>avail-calendar.css">
	</head>
	<body>
	<div id="cal_wrapper">
		<div id="cal_controls">
			
			<!-- end options -->
		</div>
		
		<div id="the_months">
			<?php echo $calendar_months; ?>
		</div>
		
	</div>
	<script type="text/javascript">		
	//	define vars
	var url_ajax_cal 		= '<?php echo AC_DIR_AJAX; ?>calendar.ajax.php'; // ajax file for loading calendar via ajax
	var img_loading_day		= '<?php echo AC_DIR_IMAGES; ?>ajax-loader-day.gif'; // animated gif for loading	
	var img_loading_month	= '<?php echo AC_DIR_IMAGES; ?>ajax-loader-month.gif'; // animated gif for loading	
	//	don't change these values
	var id_item 			= '<?php echo ID_ITEM; ?>'; // id of item to be modified (via ajax)
	var lang 				= '<?php echo AC_LANG; ?>'; // language
	var months_to_show		= <?php echo AC_NUM_MONTHS; ?>; // number of months to show
	var clickable_past		= '<?php echo AC_ACTIVE_PAST_DATES; ?>'; // previous dates
	</script>
	<script type="text/javascript" src="<?php echo AC_DIR_JS; ?>mootools-core-1.3.2-full-compat-yc.js"></script>
	<script type="text/javascript" src="<?php echo AC_DIR_JS; ?>mootools-cal-public.js"></script>
	</body>
</html>