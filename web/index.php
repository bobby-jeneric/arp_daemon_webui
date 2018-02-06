<?php

if (preg_match('/\.(?:png|jpg|jpeg|gif|css|js)$/', $_SERVER["REQUEST_URI"]))
{
//echo "static";
	return false;
}

if (isset($_POST))
{
	//var_dump($_POST);
	if (isset($_POST['ip']) && isset($_POST['desc']))
	{																			
		include_once("../app/arp_daemon_webui.php");
		$ip = $_POST['ip'];
		$desc = $_POST['desc'];
		$data = "";
		//var_dump($ip);
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
	else if ($cmd == 'get_diff_list')
	{
		include_once("../app/arp_daemon_webui.php");
		$data = "";
		if (get_diff_list($data) == 0)
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
	else if ($page == 'edit_bio')
	{
		include_once("../app/arp_daemon_webui.php");

		$id="<unknown>";
		if (isset($_GET['id']))
		{
			$id = $_GET['id'];
		}
		$data = "";
		if (get_bio($data, $id) == 0)
		{
			$bio = json_decode($data, true);
			if ($bio != null)
			{
				//var_dump($bio);
				$contents = file_get_contents("./view/edit_bio.html");
				$contents = str_replace("{{id}}", $id,  $contents);
				$contents = str_replace("{{desc}}", $bio["DESC"],  $contents);
				echo $contents;
			}
		}
		
		return 0;
	}
	else if ($page == 'diffs')
	{
		echo file_get_contents("./view/diffs.html");
		return 0;
	}
}

echo file_get_contents("./view/current.html");

