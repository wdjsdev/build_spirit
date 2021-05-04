
function getSpiritData()
{

	// var file = File("~/Desktop/automation/spirit_site.js");
	var file = "~/Desktop/automation/spirit_site/test.js";
	var blah;
	eval("#include \"" + file + "\"");

	return spiritData;


	////////////////////////
	////////ATTENTION://////
	//
	//		the above is temporary dev code..
	//		I'm waiting on adam to provide a direct link
	// 		to get the data. the link below leads to a redirect
	//		which breaks the curlData logic
	//
	////////////////////////

	// var url = "https://www.boombah.com/app/site/hosting/scriptlet.nl?script=1356&deploy=1&compid=460511&h=b071363468e747c7d5a9&action=will&programId="
	// var programId = "SFc-ETk-vcX-G8A"
	// var data = curlData(url,programId);
	// return data;
}
