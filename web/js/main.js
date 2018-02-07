var arp_daemon = null;

function arp_daemon_model()
{
	var _this = this;
	this.status_names = {0: "None", 1: "Added", 2: "Changed MAC", 3: "Changed Node", 4: "Changed MAC and Node", 5: "Closed"};
	this.status_color = {0: "red", 1: "green", 2: "blue", 3: "blue", 4: "blue", 5: "red"};

	this.act_status_names = {0: "Started", 1: "Got changes", 2: "No changes"};
	this.act_status_color = {0: "red", 1: "blue", 2: "green"};
	this.act_type_names = {0: "Scheduled", 1: "Manual"};
	this.act_type_color = {0: "blue", 1: "green"};

	this.current_page = 0;
	this.last_tick_type = 0;

	this.reload_page = function()
	{
		if (this.current_page == 1)
		{
			this.load_current();
		}
		else if (this.current_page == 2)
		{	
			this.load_bio();
		}
		else if (this.current_page == 3)
		{
			this.load_diffs();
		}
		else if (this.current_page == 4)
		{
			this.load_acts();
		}
	}

	this.load_current = function()
	{
		var jqxhr = $.get("/?cmd=get_current_list", function(data) {
				var collection = [];
				collection = JSON.parse(data);
				var stext = "<table class='table table-striped'><tr><td>IP</td><td>MAC</td><td>NAME</td></tr>";
				if (collection != null && collection != undefined)
				{
				
					for (var i = 0; i < collection.length; i++)
					{
						stext += "<tr><td>" + collection[i]["IP"] + "</td>";
						stext += "<td>" + collection[i]["MAC"] + "</td>";
						stext += "<td>" + collection[i]["NAME"] + "</td></tr>";
					}
				}
				stext += "</table>";
				$("#arp_current_table").empty().append(stext);
			})
			.fail(function() {
				alert("fail to load current");
			});
	};

	this.load_bio = function()
	{
		var jqxhr = $.get("/?cmd=get_bio_list", function(data) {
				var collection = [];
				collection = JSON.parse(data);				
				var stext = "<table class='table table-striped'><tr><td width='30%'>IP</td><td width='50%'>DESC</td><td width='20%'>&nbsp;</td></tr>";
				if (collection != null && collection != undefined)
				{
				
					for (var i = 0; i < collection.length; i++)
					{
						stext += "<tr><td>" + collection[i]["IP"] + "</td>";
						stext += "<td>" + collection[i]["DESC"] + "</td>";
						stext += "<td><a href='/?page=edit_bio&id=" + collection[i]["IP"] + "' class='btn btn-info'>Edit</a><a class='btn btn-warning' onclick='on_delete(\"" + collection[i]["IP"] + "\")'>Delete</a></td></tr>";
					}
				}
				stext += "</table>";
				$("#arp_current_table").empty().append(stext);
			})
			.fail(function() {
				alert("fail to load bio");
			});
	};


	this.load_diffs = function()
	{
		var jqxhr = $.get("/?cmd=get_diff_list", function(data) {
				var collection = [];
				collection = JSON.parse(data);				
				var stext = "<table class='table table-striped'><tr><td>IP</td><td>MAC</td><td>NAME</td><td>STATUS</td><td>MAC OLD</td><td>NAME OLD</td><td>CHANGED</td></tr>";
				if (collection != null && collection != undefined)
				{
				
					for (var i = 0; i < collection.length; i++)
					{
						stext += "<tr><td>" + collection[i]["IP"] + "</td>";
						stext += "<td>" + collection[i]["MAC"] + "</td>";
						stext += "<td>" + collection[i]["NAME"] + "</td>";
						stext += "<td><font color='" + _this.status_color[collection[i]["STATUS"]] + "'>" + 
								_this.status_names[collection[i]["STATUS"]] + "</font></td>";
						stext += "<td>" + /*(collection[i]["MACOLD"] === undefined) ? "&nbsp;" : */collection[i]["MACOLD"] + "</td>";
						stext += "<td>" + /*(collection[i]["NAMEOLD"] === undefined) ? "&nbsp;" : */collection[i]["NAMEOLD"]  + "</td>";
						stext += "<td>" + collection[i]["CHANGEDATE"] + "</td></tr>";
					}
				}
				stext += "</table>";
				$("#arp_current_table").empty().append(stext);
			})
			.fail(function() {
				alert("fail to load bio");
			});
	};

	this.load_acts = function()
	{
		var jqxhr = $.get("/?cmd=get_act_list&limit=10", function(data) {
				var collection = [];
				collection = JSON.parse(data);				
				var stext = "<table class='table table-striped'><tr><td>CHANGEDATE</td><td>STATUS</td><td>TYPE</td></tr>";
				if (collection != null && collection != undefined)
				{
				
					for (var i = 0; i < collection.length; i++)
					{
						stext += "<tr><td>" + collection[i]["CHANGEDATE"] + "</td>";
						stext += "<td><font color='" + _this.act_status_color[collection[i]["STATUS"]] + "'>" + 
								_this.act_status_names[collection[i]["STATUS"]] + "</font></td>";
						stext += "<td><font color='" + _this.act_type_color[collection[i]["TYPE"]] + "'>" + 
								_this.act_type_names[collection[i]["TYPE"]] + "</font></td>";
					}
				}
				stext += "</table>";
				$("#arp_current_table").empty().append(stext);
			})
			.fail(function() {
				alert("fail to load bio");
			});
	};

	this.manual_start = function()
	{
		var jqxhr = $.get("/?cmd=manual_start", function(data) {
			})
			.fail(function() {
				alert("fail to load bio");
			});
	};

	this.delete_bio = function(ip)
	{
		if (confirm("Are you sure you want to delete bio for " + ip) == true)
		{
			var jqxhr = $.get("/?cmd=delete_bio&ip=" + ip, function(data) {
				_this.reload_page()
			})
			.fail(function() {
				alert("fail to load bio");
			});
		};
	};

	this.get_ticks = function(pobj)
	{
		if (pobj === null || pobj === undefined)
		{
			return;
		}

		var jqxhr = $.get("/?cmd=get_ticks_to_go", function(data) {		
				var stext = "";
				var collection = JSON.parse(data);
				if (collection != null)
				{
					var cur_tick_type = 0;
					if (collection["STARTDATE"] != "")
					{
						stext = "Current ARP scan started: " + collection["STARTDATE"];
						stext += "&nbsp;&nbsp;&nbsp;Lapsed seconds: " + collection["TICK"];
						cur_tick_type = 1;
					}
					else
					{
						stext = "Seconds to next ARP scan: " + collection["TICK"];
					}

					if (_this.last_tick_type != cur_tick_type)
					{
						_this.last_tick_type = cur_tick_type;
						_this.reload_page()
					}
				}
				$("#arp_ticks_to_go").empty().append(stext);
			})
			.fail(function() {
				alert("fail to load bio");
			});		
	};

	this._constructor = function()
	{
		this.get_ticks();
		setInterval(this.get_ticks, 5000, this);
	};

	this._constructor();
}


function on_load_current()
{
	arp_daemon = new arp_daemon_model();
	arp_daemon.current_page = 1;
	arp_daemon.reload_page();
}

function on_load_bio()
{
	arp_daemon = new arp_daemon_model();
	arp_daemon.current_page = 2;
	arp_daemon.reload_page();
}

function on_load_diffs()
{
	arp_daemon = new arp_daemon_model();
	arp_daemon.current_page = 3;
	arp_daemon.reload_page();
}

function on_load_acts()
{
	arp_daemon = new arp_daemon_model();
	arp_daemon.current_page = 4;
	arp_daemon.reload_page();
}

function on_manual_scan()
{
	arp_daemon.manual_start();
}

function on_delete(ip)
{
	arp_daemon.delete_bio(ip);
}

