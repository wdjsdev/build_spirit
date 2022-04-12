//example label
// "FD-1873_FD-1873-FD-1873Y-1027"

function getMidFromLabel(label)
{
	var result;

	var firstCode = label.substring(0,label.indexOf("_"));
	var secondCode = label.substring(label.indexOf("_")+1,label.length);


	

	if(!secondCode.match(firstCode) || firstCode.match(/[yg]/i))
	{
		result = secondCode.substring(0,nthIndex(secondCode,"-",2));
	}
	else
	{
		result = firstCode;
	}
	return result;
}

function nthIndex(str, pat, n){
    var L= str.length, i= -1;
    while(n-- && i++<L){
        i= str.indexOf(pat, i);
        if (i < 0) break;
    }
    return i;
}