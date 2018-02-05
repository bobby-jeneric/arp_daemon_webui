<?php


class vmrecord
{
	public $ip = "";
	public $mac = "";
	public $name = "";
}

class vmrecordcollection
{
	public $collection = [];
	public function push($prec)
	{
		$this->collection[] = $prec;
	}
}


function get_arp_cmd(&$data, $command)
{
	$cur_dir = getcwd();
	chdir("/home/bobby/Python/arp_daemon");
	$arp_cli_cmd = "arp-cli.py";

	$proc = proc_open("python3 " . $arp_cli_cmd . " " . $command, 
		array( 
			array("pipe", "r"),
			array("pipe", "w"),
			array("pipe", "w")
		),
		$pipes);

	$data = "";
	$return_value = -1;
	if (is_resource($proc))
	{
		//echo "is_resource\n";
		//echo "python3 " . $arp_cli_cmd . " " . $command . "\n";
		fwrite($pipes[0], $command);
		$data = stream_get_contents($pipes[1]);
		fclose($pipes[0]);
		fclose($pipes[1]);
		fclose($pipes[2]);

		$return_value = proc_close($proc);
	}

	chdir($cur_dir);
	return $return_value;
}

function get_current_list(&$data)
{
	return get_arp_cmd($data, "get_current_list");
}

function get_bio_list(&$data)
{
	return get_arp_cmd($data, "get_bio_list");
}

function add_bio(&$data, $ip, $desc)
{
	$data = "";
	return get_arp_cmd($data, 'add_bio "' . $ip . '" "' . $desc . '"');
}


function other_stuff()
{

echo "<pre>";
echo "Hello\n";

//$result = exec("home/bobby/Python/arp-daemon/arp-cli.py");
//$result = exec("whoami");

echo __DIR__ . "\n";
chdir("/home/bobby/Python/arp_daemon");
echo getcwd() . "\n";

$arp_cli_cmd = "arp-cli.py";

$proc = proc_open("python3 " . $arp_cli_cmd . " get_current_list", 
	array( 
		array("pipe", "r"),
		array("pipe", "w"),
		array("pipe", "w")
	),
	$pipes);
if (is_resource($proc))
{
echo "is_resource\n";
	fwrite($pipes[0], "get_current_list");
	$ret_content = stream_get_contents($pipes[1]);
	fclose($pipes[0]);
	fclose($pipes[1]);
	fclose($pipes[2]);

$return_value = proc_close($proc);
echo "returned: $return_value\n";

$vms_collection = json_decode($ret_content, true);

$vmcoll = new vmrecordcollection();
for ($i = 0; $i < count($vms_collection); $i++)
{
$vmrec = new vmrecord();
$vmrec->ip = $vms_collection[$i+1]["IP"];
$vmrec->mac = $vms_collection[$i+1]["MAC"];
$vmrec->name = $vms_collection[$i+1]["NAME"];
$vmcoll->push($vmrec);
}

$table = "<table><tr><td>IP</td><td>MAC</td><td>NAME</td></tr>";
for ($i = 0; $i < count($vmcoll->collection); $i++)
{
$table .= "<tr><td>";
$table .= $vmcoll->collection[$i]->ip;
$table .= "</td><td>";
$table .= $vmcoll->collection[$i]->mac;
$table .= "</td><td>";
$table .= $vmcoll->collection[$i]->name;
$table .= "</td></tr>";
}

$table .= "</table>";
echo $table;
}

//var_dump($pipes);
//$result = stream_get_contents($pipes[1]);

//var_dump($result);
}


