function parseSpiritData(data)
{
	
	
	var garmentsNeeded = {};

	var curGarGroup,curGar,curGarNeeded;
	var curSize,curRoster,curLine,curLabel,curStyleNum,curPlayer;
	var curGN,curMid;
	var playerLen = 0;
	for(var gar in data)
	{
		//sample gar value = "FD-1873_FD-1873-FD-1873Y-1027"
		// curStyleNum = gar.substring(gar.lastIndexOf("-")+1, gar.lastIndexOf("-")+5)
		curStyleNum = gar.substring(gar.lastIndexOf("-")+1, gar.length);
		curGarGroup = data[gar];


		curMid = getMidFromLabel(gar);
		curLabel = curMid + "_" + curStyleNum;
		curGN = garmentsNeeded[curLabel] = {};
		curGN.roster = {};
		for(var x=0;x<curGarGroup.length;x++)
		{
			curGar = curGarGroup[x];
			curGN.mid = curMid;
			curGN.styleNum = curStyleNum;

			curSize = curGar.itemtext.substring(curGar.itemtext.lastIndexOf("-")+1,curGar.itemtext.length);

			if(!curGN.roster[curSize])
			{
				curGN.roster[curSize] = {"players":[]};
			}

			curPlayer = {name:"",number:""};

			

			if(curGar.playername)
			{
				curPlayer.name = curGar.playername;
			}

			if(curGar.playernumber)
			{
				curPlayer.number = curGar.playernumber;
			}

			curGN.roster[curSize].players.push(curPlayer);

			curGN.roster[curSize].qty = x+1;
		}
		playerLen = 0;
	}

	return garmentsNeeded;
}
