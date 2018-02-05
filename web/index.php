<?php

if (preg_match('/\.(?:png|jpg|jpeg|gif|css|js)$/', $_SERVER["REQUEST_URI"]))
{
//echo "static";
	return false;
}

if (isset($_POST))
{
	if (isset($_POST['ip']) && isset($_POST['desc']))
	{
		include_once("../app/arp_daemon_webui.php");
		$ip = $_POST['ip'];
		$desc = $_POST['desc'];
		$data = "";		
		$ret = add_bio($data, $ip, $desc);
		if ($ret != 0)
		{
			echo $ip . " " . $desc;
		}
		return 0;
	}
}

if (isset($_GET['cmd']))
{
	$cmd = $_GET['cmd'];
	if ($cmd == 'get_current_list')
	{
		include_once("../app/arp_daemon_webui.php");
		$data = "";
		if (get_current_list($data) == 0)
		{
			echo $data;
		}
		return 0;
	}
	else if ($cmd == 'get_bio_list')
	{
		include_once("../app/arp_daemon_webui.php");
		$data = "";
		if (get_bio_list($data) == 0)
		{
			echo $data;
		}
		return 0;
	}

	return 0;
}

if (isset($_GET['page']))
{
	$page = $_GET['page'];
	if ($page == 'bio')
	{
		echo file_get_contents("./view/bio.html");
		return 0;
	}
	else if ($page == 'add_bio')
	{
		echo file_get_contents("./view/add_bio.html");
		return 0;
	}
}

echo file_get_contents("./view/current.html");

