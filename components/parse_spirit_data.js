
function parseSpiritData(data)
{
	
	
	var garmentsNeeded = {};

	var curGarGroup,curGar,curGarNeeded;
	var curSize,curRoster,curLine,curLabel,curStyleNum,curPlayer;
	var curGN;
	var playerLen = 0;
	for(var gar in data)
	{
		
		curStyleNum = gar.substring(gar.lastIndexOf("-")+1, gar.lastIndexOf("-")+5)
		curGarGroup = data[gar];
		curLabel = curGarGroup[0].mid + "_" + curStyleNum;
		curGN = garmentsNeeded[curLabel] = {};
		curGN.roster = {};
		for(var x=0;x<curGarGroup.length;x++)
		{
			curGar = curGarGroup[x];

			if(curGar.style.match(curGar.mid))
			{
				curGN.mid = curGar.style.match(/^[^-]*-[^-]*/)[0];
			}
			else
			{
				curGN.mid = curGar.mid;	
			}
			

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
