// #target Illustrator
function parseSpiritData()
{
	
	
	var garmentsNeeded = {};

	var curGarGroup,curGar,curGarNeeded;
	var curMid,curSize,curRoster,curLine,curLabel,curStyleNum;
	var curGN;
	for(var gar in blah)
	{
		curStyleNum = gar.substring(gar.lastIndexOf("-")+1, gar.lastIndexOf("-")+5)
		curGarGroup = blah[gar];
		curLabel = curGarGroup[0].mid + "_" + curStyleNum;
		curGN = garmentsNeeded[curLabel] = {};
		curGN.roster = {};
		curMid = curGarGroup[0].mid;
		for(var x=0;x<curGarGroup.length;x++)
		{
			curGar = curGarGroup[x];
			curGN.mid = curGar.mid;

			curSize = curGar.itemtext.substring(curGar.itemtext.lastIndexOf("-")+1,curGar.itemtext.length);

			if(!curGN.roster[curSize])
			{
				curGN.roster[curSize] = [];
			}

			if(curGar.playername || curGar.playernumber)
			{
				curGN.roster[curSize].push({name:curGar.playername,number:curGar.playernumber})
			}
			else
			{
				curGN.roster[curSize].push({name:"",number:""})
			}
		}
	}

	return garmentsNeeded;
}
// test();