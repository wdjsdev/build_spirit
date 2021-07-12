
function getSpiritData()
{
	var url = "https://460511.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1356&deploy=1&compid=460511&h=b071363468e747c7d5a9&action=will&programId=";
	
	var data = curlData(url,programId);
	return data;
}
