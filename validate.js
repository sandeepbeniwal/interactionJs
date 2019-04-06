function isNum(str){
	var string = str + '';
	var flag=1;
	for (var i=0;i < string.length;i++){
		if (((string.substring(i,i+1) < '0') || (string.substring(i,i+1) > '9')) && (string.substring(i,i+1) != "."))
		return false;
	}
	return true;
}

function isInt(string){
	var flag=1;
	for (var i=0;i < string.length;i++){
		if ((string.substring(i,i+1) < '0') || (string.substring(i,i+1) > '9')){
			return false;
		}
	}
	return true;
}
function isAlphanum(string){
	//var invalidchar = new Array('#','\'','"','\\','/',' ','!','@','$','%','^','&','*','?','.',':','~','`','(',')','-','_','+','=','{','}','[',']','|','<','>',',',';');
        var invalidchar = new Array('#','\'','"','\\','/','!','@','$','%','^','&','*','?','~','`','(',')','+','=','{','}','[',']','|','<','>',',',';');
	return validate_characters(string,invalidchar);
}
function isAlphanumDesc(string){
	var invalidchar = new Array('#','\'','"','\\','/','!','@','$','%','^','&','*','?',':','~','`','(',')','+','=','{','}','[',']','|','<','>',';');
	return validate_characters(string,invalidchar);
}
function isName(string){
	var invalidchar = new Array('#','"','\\','!','@','$','%','^','&','*','?',':','~','`','(',')','_','+','=','{','}','[',']','|','<','>',';','1','2','3','4','5','6','7','8','9','0');
	return validate_characters(string,invalidchar);
}
function isCompanyName(string){
	var invalidchar = new Array('#','"','!','@','$','%','^','&','*','?',':','~','`','_','+','=','{','}','[',']','|','<','>',';','\'');
	return validate_characters(string,invalidchar);
}
function isPropertyName(string){
	var invalidchar = new Array('#','\\','!','@','$','%','^','*','?',':','~','`','_','+','=','{','}','[',']','|','<','>');
	return validate_characters(string,invalidchar);
}
function isNumText(string){
	var invalidchar = new Array('\'','"','\\','!','@','$','%','^','&','*','?',':','~','`','(',')','_','+','=','{','}','[',']','|','<','>');
	return validate_characters(string,invalidchar);
}
function isUsername(username){
	var invalidchar = new Array('#','\'','"','\\','/',' ','!','$','%','^','&','*','?','@');
	return validate_characters(username,invalidchar);
}
function isAddress(string){
	var invalidchar = new Array('\\','!','@','$','%','^','*','?','~','`','_','+','=','{','}','[',']','|','<','>');
		return validate_characters(string,invalidchar);
}
function isCompany_Url(string){
	string=string.toLowerCase();
	if((string.substr(0,4))!= "http")
	string="http://"+string;
	var RegExp=/^(((ht|f)tp(s?))\:\/\/)([0-9a-zA-Z\-]+\.)+[a-zA-Z]{2,6}(\:[0-9]+)?(\/\S*)?$/
	//	var RegExp = /^(http|https):\/\/[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(([0-9]{1,5})?\/.*)?$/
	var str = RegExp.test(string);
	if(RegExp.test(string)){
		return true;
	}
	else
		return false;
}

function isEmail(str){
	var regex = /^[-_.a-z0-9]+@(([-_a-z0-9]+\.)+(ad|ae|aero|af|ag|ai|al|am|an|ao|aq|ar|arpa|as|at|au|aw|az|ba|bb|bd|be|bf|bg|bh|bi|biz|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|com|coop|cr|cs|cu|cv|cx|cy|cz|de|dj|dk|dm|do|dz|ec|edu|ee|eg|eh|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gh|gi|gl|gm|gn|gov|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|in|info|int|io|iq|ir|is|it|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|mg|mh|mil|mk|ml|mm|mn|mo|mobi|mp|mq|mr|ms|mt|mu|museum|mv|mw|mx|my|mz|na|name|nc|ne|net|nf|ng|ni|nl|no|np|nr|nt|nu|nz|om|org|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|pro|ps|pt|pw|py|qa|re|ro|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sk|sl|sm|sn|so|sr|st|su|sv|sy|sz|tc|td|tf|tg|th|tj|tk|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|um|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|yu|za|zm|zw)|(([0-9][0-9]?|[0-1][0-9][0-9]|[2][0-4][0-9]|[2][5][0-5])\.){3}([0-9][0-9]?|[0-1][0-9][0-9]|[2][0-4][0-9]|[2][5][0-5]))$/i;
	return regex.test(str);
}
function checkemail(emailadd){
	if (emailadd.length>50)
		return false;
	else if (emailadd.length<8)
		return false;
	else
		return isEmail(trim(emailadd));
}
function trim(inputString){

	if (typeof inputString != "string") { return inputString; }
	var retValue = inputString;
	var ch = retValue.substring(0, 1);
	while (ch == " "){
		retValue = retValue.substring(1, retValue.length);
		ch = retValue.substring(0, 1);
	}
	ch = retValue.substring(retValue.length-1, retValue.length);
	while (ch == " "){
		retValue = retValue.substring(0, retValue.length-1);
		ch = retValue.substring(retValue.length-1, retValue.length);
	}
	while (retValue.indexOf("  ") != -1){
		retValue = retValue.substring(0, retValue.indexOf("  ")) + retValue.substring(retValue.indexOf("  ")+1, retValue.length);
	}
	return retValue;
}
function strlen(str){
	return str.length;
}
/* string : the string to be validated
invalidchar : array of invalid characters !@#$%^&*()_)
*/
function validate_characters(string,invalidchar){
	var valid=true;
	for(var _i=0;_i<string.length;_i++){
	for(var _j=0;_j<invalidchar.length;_j++){
		if (string.charAt(_i)==invalidchar[_j]){
				valid=false;
				break;
			}
		}
	}
	if(string.charAt(0)=='.' || string.charAt(0)=='\'')
		valid=false;
	return valid;
}
function password(pass){
	var ck_password =  /^[A-Za-z0-9!@#$%^&*()_]{6,10}$/;
    if(!ck_password.test(pass))
	{
	  return false
	}
	else
	{
	  return true;
	}	
}