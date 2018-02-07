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
	}

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
						stext += "<td><a href='/?page=edit_bio&id=" + collection[i]["IP"] + "' class='btn btn-info'>Edit</a><a href='/?page=delete_bio&id=" + collection[i]["IP"] + "' class='btn btn-info'>Delete</a></td></tr>";
					}
				}
				stext += "</table>";
				$("#arp_current_table").empty().append(stext);
			})
			.fail(function() {
				alert("fail to load bio");
			});
	}


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
	}

	this.load_acts = function()
	{
		var jqxhr = $.get("/?cmd=get_act_list", function(data) {
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
	}
}


function on_load_current()
{
	arp_daemon = new arp_daemon_model();
	arp_daemon.load_current();
}

function on_load_bio()
{
	arp_daemon = new arp_daemon_model();
	arp_daemon.load_bio();
}

function on_load_diffs()
{
	arp_daemon = new arp_daemon_model();
	arp_daemon.load_diffs();
}

function on_load_acts()
{
	arp_daemon = new arp_daemon_model();
	arp_daemon.load_acts();
}


