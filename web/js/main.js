var arp_daemon = null;

function arp_daemon_model()
{
	this.load_current = function()
	{
		var jqxhr = $.get("/?cmd=get_current_list", function(data) {
				var collection = [];
				collection = JSON.parse(data);
				console.log(collection);
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
				console.log(collection);
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


