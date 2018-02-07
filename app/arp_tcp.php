<?php


function request($indata, &$outdata)
{
	$outdata = '';
	$address = '127.0.0.1';
	$port = 10001;

	try
	{
		$socket = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);
		if ($socket === false)
		{
			return -1;
		}

		$result = socket_connect($socket, $address, $port);
		if ($socket === false)
		{
			return -1;
		}

		socket_write($socket, $indata, strlen($indata));

		$out_ = "";
		$out_p = "";
		while ($out_p = socket_read($socket, 2048))
		{
			$out_ .= $out_p;
			if (strlen($out_) > 1)
			{
				if ($out_[0] == '|')
				{
					$i = 1;
					$slen = "";
					while ($out_[$i] != '|')
					{
						$slen .= $out_[$i];
						$i++;
					}

					if ($slen + 2 + strlen($slen) == strlen($out_))
					{
						$out_ = substr($out_, 2 + strlen($slen));
						$outdata = $out_;
						break;
					}
				}
			}
		}

		$outdata = $out_;

		socket_close($socket);
	}
	catch(Exception $ex)
	{
		var_dump($ex);
		return -1;
	}

	return 0;
}

function get_arp_cmd(&$data, $command)
{
	$outdata = "";

	$indata = "|";
	$indata .= strlen($command);
	$indata .= "|";
	$indata .= $command;
	//echo $indata_;
	//exit(1);

	return request($indata, $data);
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
	return get_arp_cmd($data, 'add_bio|' . $ip . '|' . $desc);
}

function get_bio(&$data, $ip)
{
	$data = "";
	return get_arp_cmd($data, 'get_bio|' . $ip );
}

function get_diff_list(&$data)
{
	return get_arp_cmd($data, "get_diff_list");
}

function get_act_list(&$data, $limit)
{
	return get_arp_cmd($data, "get_act_list|" . $limit);
}

function get_ticks_to_go(&$data)
{
	return get_arp_cmd($data, "get_ticks_to_go");
}

function manual_start(&$data)
{
	return get_arp_cmd($data, "manual_start");
}

function delete_bio(&$data, $ip)
{
	return get_arp_cmd($data, "delete_bio|" . $ip);
}

