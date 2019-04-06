(function($) {
// jQuery on an empty object, we are going to use this as our Queue
var ajaxQueue = $({});
$.ajaxQueue = function( ajaxOpts ) {
    var jqXHR,
        dfd = $.Deferred(),
        promise = dfd.promise();
    // queue our ajax request
    ajaxQueue.queue( doRequest );
    // add the abort method
    promise.abort = function( statusText ) {
        // proxy abort to the jqXHR if it is active
        if ( jqXHR ) {
            return jqXHR.abort( statusText );
        }
        // if there wasn't already a jqXHR we need to remove from queue
        var queue = ajaxQueue.queue(),
            index = $.inArray( doRequest, queue );
        if ( index > -1 ) {
            queue.splice( index, 1 );
        }
        // and then reject the deferred
        dfd.rejectWith( ajaxOpts.context || ajaxOpts,
            [ promise, statusText, "" ] );
        return promise;
    };
    // run the actual query
    function doRequest( next ) {
        jqXHR = $.ajax( ajaxOpts )
            .done( dfd.resolve )
            .fail( dfd.reject )
            .then( next, next );
    }
    return promise;
  };
})(jQuery);


var httpRequest=createRequestObject();
function createRequestObject(){
	var browser=navigator.appName;
	if(browser == "Microsoft Internet Explorer"){
    	return new ActiveXObject("Microsoft.XMLHTTP");
	}
	else{
    	return new XMLHttpRequest();
	}  		
}
function showCorePostData(fname,_div,form){
	if(fname.length >0){
		var filename=fname;
		var start = new Date();
		var postString = generateCorePostQuery(form);
		setval="YES";
		httpRequest.open("POST",filename+"?AJAX=YES&ts="+start);
		httpRequest.onreadystatechange = function (){
		//alert(httpRequest.status);
		if(httpRequest.readyState == 4){	
			var response=httpRequest.responseText;
			document.getElementById(_div).innerHTML=httpRequest.responseText;
			evalScript( response );
		}
	};
		httpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		//httpRequest.setRequestHeader("Content-length", postString.length);
		//httpRequest.setRequestHeader("Connection", "close");
		httpRequest.send(postString);
	}else{
		alert('Please Select an option First');
	}
}
function generateCorePostQuery(form)
{
doc = form;
var alertString = "";
var    postString = "";
    for(i=0; i<doc.elements.length; i++)
    {
        alertString = "";
        if(doc.elements[i].disabled ==false){
	        if(doc.elements[i].type=="button"){
	        	continue;
	        }else if(doc.elements[i].type=="checkbox"){
                if(doc.elements[i].checked==true){alertString += doc.elements[i].value;}
                else{ continue;}
            }else if(doc.elements[i].type=="radio"){
                if(doc.elements[i].checked==true){alertString += doc.elements[i].value;}
                else{continue;}
            }else if(doc.elements[i].type=="select-one"){
                alertString += doc.elements[i].value;
            }else if(doc.elements[i].type=="checkbox"){
                if(doc.elements[i].checked==true){alertString += doc.elements[i].value;}
                else{continue;}
            }else if(doc.elements[i].type=="password"){
				alertString += CryptoJS.MD5(doc.elements[i].value);
			}else {alertString += doc.elements[i].value;}
            if(alertString == ""){alertString="NULL";}
            postString += doc.elements[i].name+"="+encodeURI(alertString)+"&";
        }
    }
    return postString;
}

var newTitlePage = "";
function getAjaxData(_url,_div,_title){
	//alert('_url');
	try{
	clearInterval(var4Clear);TimeLeft = 100000;
	}catch(e){}
	if(_url.indexOf('?') >= 0){
		_url=_url+'&AJAX=Y';
	}else{
		_url=_url+'?AJAX=Y';
	}
	_url = _url.replace(new RegExp("#", 'g'), "");
	if(_url != 'javascript:void(0);'){
		$.ajaxQueue({
			
    	    url: _url,
        	type: 'POST',
			data: 'pageName='+_url,
			 beforeSend: function( xhr ) {
				//xhr.overrideMimeType( "text/plain; charset=x-user-defined" );
				$("#"+_div).html('<img src="/js/loading.gif">');
			},
    	    success: function(responsedata,textStatus,jqXHR) {
				//evalScript(responsedata);
				if(jqXHR.getResponseHeader("content-type") == 'application/json'){
					$("#"+_div).html("Loading..");
					var i=0;
					for(i=0;i<responsedata.length;i++){
					//var response=jQuery.parseJSON(responsedata);
					//alert((responsedata[i]) + i);
						if(typeof responsedata[i] =='object'){
							if(responsedata[i].FE_TYPE == 'MESSAGE'){
								
							}else if(responsedata[i].FE_TYPE == 'FORM'){
								jsonForm(responsedata[i].DATA,_div);
							}else if(responsedata[i].FE_TYPE == 'PAGE-CONFIG'){
								if(responsedata[i].PAGE_NAME)eval("newRequestPage = \""+responsedata[i].PAGE_NAME+"\"");
								if(responsedata[i].PAGE_TITLE)eval("newTitlePage = \""+responsedata[i].PAGE_TITLE+"\"");
							}else if(responsedata[i].FE_TYPE == 'TABLE-DATA'){
								//jsonForm(responsedata[i].DATA,_div);
							}else if(responsedata[i].FE_TYPE == 'HTML/SCRIPT'){
								$_oldData = $('#'+_div).html();
								$('#'+_div).html(responsedata[i][j].DATA);
								$_oldData1 = $('#'+_div).html();
								$('#'+_div).html($_oldData+$_oldData1);
							}else {
								if(responsedata[i].length > 0 ){
									for(j=0;j<responsedata[i].length;++j){
										if(responsedata[i][j].FE_TYPE == 'MESSAGE'){
										}else if(responsedata[i][j].FE_TYPE == 'FORM'){
											jsonForm(responsedata[i][j].DATA,_div);
										}else if(responsedata[i][j].FE_TYPE == 'TABLE-DATA'){
											//jsonForm(responsedata[i].DATA,_div);
										}else if(responsedata[i][j].FE_TYPE == 'HTML/SCRIPT'){
											$_oldData = $('#'+_div).html();
											$('#'+_div).html(responsedata[i][j].DATA);
											$_oldData1 = $('#'+_div).html();
											$('#'+_div).html($_oldData+$_oldData1);
										}
									}
								}
							}
						}
					}
				}else if(jqXHR.getResponseHeader("content-type") == 'application/xml'){
					
				}else{
					$('#topRow').show();
					$('a[class="left-sidebar-toggle open"]').click();
					$("#"+_div).html(responsedata);
					
				}
				$("#PageTitle").val('+ Add '+newTitlePage);
				$('#PageTitle').attr('tour_for',newTitlePage);
				$('#PageTitle').attr('tour_text',"Used for Add "+newTitlePage);
				//$('#PageTitle').attr('tour_no',optionClicked+1);
				$('#PageTitle').addClass('tour_cls');
				$('#PageTitle').html(newTitlePage);
				if($.isFunction('tour_on')){
					
					tour_on();
				}
        	}
    	});
    }
	return false;
} 
function showParallelData(fname,csum,_div){
	if(_div == '' || _div == undefined || _div == null ){
		_div = "htm2display";
	}
	if(fname.indexOf('?') >= 0){
		getParallelAjaxData(fname+'&AJAX=Y&checksum='+csum+'&',_div,'');
	}else{
		getParallelAjaxData(fname+'?AJAX=Y&checksum='+csum+'&',_div,'');
	}
	return false;
}
function getParallelAjaxData(_url,_div,_title){
	//alert('_url');
	_url = _url.replace(new RegExp("#", 'g'), "");
	if(_url != 'javascript:void(0);'){
		$.ajax({
			
    	    url: _url+"?AJAX=Y",
        	type: 'POST',
			data: 'pageName='+_url,
			 beforeSend: function( xhr ) {
				//xhr.overrideMimeType( "text/plain; charset=x-user-defined" );
				$("#"+_div).html('<img src="/js/loading.gif">');
			},
    	    success: function(responsedata,textStatus,jqXHR) {
				evalScript(responsedata);
            	$("#"+_div).html(responsedata);
        	}
    	});
    }
	return false;
} 
function showData(fname,csum,_div){
	try{
		document.getElementById('CNButton').style.visibility = "hidden";
		clearInterval(var4Clear);TimeLeft = 100000;
	}catch(e){}
	if(_div == '' || _div == undefined || _div == null ){
		_div = "htm2display";
	}
	if(fname.indexOf('?') >= 0){
		getAjaxData(fname+'&AJAX=Y&checksum='+csum+'&',_div,'');
	}else{
		getAjaxData(fname+'?AJAX=Y&checksum='+csum+'&',_div,'');
	}
	return false;
}
function showParallelData(fname,csum,_div){
	if(_div == '' || _div == undefined || _div == null ){
		_div = "htm2display";
	}
	if(fname.indexOf('?') >= 0){
		getParallelAjaxData(fname+'&AJAX=Y&checksum='+csum+'&',_div,'');
	}else{
		getParallelAjaxData(fname+'?AJAX=Y&checksum='+csum+'&',_div,'');
	}
	return false;
}
function showSecurePostData(_url,csum,form){
	//alert(_url);
	_div="htm2display";
	_url = _url.replace(new RegExp("#", 'g'), "");
	if(_url.length >0){
		$.ajaxQueue({
			
    	    url: _url+"?AJAX=Y",
	        data: generatePostQuery(form),
        	type: 'POST',
			 beforeSend: function( xhr ) {
				//xhr.overrideMimeType( "text/plain; charset=x-user-defined" );
				$("#"+_div).html('<img src="/js/loading.gif">');
			},
    	    success: function(responsedata,textStatus,jqXHR) {
	            // Write to #output
				evalScript(responsedata);
            	$("#"+_div).html(responsedata);
        	}
    	});
    }else{
		alert('Please Select an option First');
	}/**/
}

function showPostData(_url,checksum,form,_div){
	try{
		clearInterval(var4Clear);TimeLeft = 100000;
	}catch(e){}
	if(_div == '' || _div == undefined || _div == null  || _div == "NULL" ){
		_div = "htm2display";
	}
	if(_url.indexOf('?') >= 0){
		_url=_url+'&AJAX=Y';
	}else{
		_url=_url+'?AJAX=Y';
	}
	_url = _url.replace(new RegExp("#", 'g'), "");
	if(_url.length > 0){
			$.ajaxQueue({
			
    	    url: _url,
	        data: generatePostQuery(form),
        	type: 'POST',
			 beforeSend: function( xhr ) {
				//xhr.overrideMimeType( "text/plain; charset=x-user-defined" );
				$("#"+_div).html('<img src="/js/loading.gif">');
			},
    	    success: function(responsedata,textStatus,jqXHR) {
	            if(jqXHR.getResponseHeader("content-type") == 'application/json'){
					$("#"+_div).html("Loading..");
					var i=0;
					for(i=0;i<responsedata.length;i++){
					//var response=jQuery.parseJSON(responsedata);
					//alert((responsedata[i]) + i);
						if(typeof responsedata[i] =='object'){
							if(responsedata[i].FE_TYPE == 'MESSAGE'){
								
							}else if(responsedata[i].FE_TYPE == 'FORM'){
								jsonForm(responsedata[i].DATA,_div);
							}else if(responsedata[i].FE_TYPE == 'PAGE-CONFIG'){
								if(responsedata[i].PAGE_NAME)eval("newRequestPage = \""+responsedata[i].PAGE_NAME+"\"");
								if(responsedata[i].PAGE_TITLE)eval("newTitlePage = \""+responsedata[i].PAGE_TITLE+"\"");
							}else if(responsedata[i].FE_TYPE == 'TABLE-DATA'){
								//jsonForm(responsedata[i].DATA,_div);
							}else if(responsedata[i].FE_TYPE == 'HTML/SCRIPT'){
								$_oldData = $('#'+_div).html();
								$('#'+_div).html(responsedata[i][j].DATA);
								$_oldData1 = $('#'+_div).html();
								$('#'+_div).html($_oldData+$_oldData1);
							}else {
								if(responsedata[i].length > 0 ){
									for(j=0;j<responsedata[i].length;++j){
										if(responsedata[i][j].FE_TYPE == 'MESSAGE'){
										}else if(responsedata[i][j].FE_TYPE == 'FORM'){
											jsonForm(responsedata[i][j].DATA,_div);
										}else if(responsedata[i][j].FE_TYPE == 'TABLE-DATA'){
											//jsonForm(responsedata[i].DATA,_div);
										}else if(responsedata[i][j].FE_TYPE == 'HTML/SCRIPT'){
											$_oldData = $('#'+_div).html();
											$('#'+_div).html(responsedata[i][j].DATA);
											$_oldData1 = $('#'+_div).html();
											$('#'+_div).html($_oldData+$_oldData1);
										}
									}
								}
							}
						}
					}
				}else if(jqXHR.getResponseHeader("content-type") == 'application/xml'){
					
				}else{
					$("#"+_div).html(responsedata);
					
				}
				$("#PageTitle").val('+ Add '+newTitlePage);
				$('#PageTitle').attr('tour_for',newTitlePage);
				$('#PageTitle').attr('tour_text',"Used for Add "+newTitlePage);
				//$('#PageTitle').attr('tour_no',optionClicked+1);
				$('#PageTitle').addClass('tour_cls');
				$('#PageTitle').html(newTitlePage);
				if($.isFunction('tour_on')){
					
					tour_on();
				}
				
        	}
    	});
    }else{
		alert('Please Select an option First');
	}/**/
}
function showPostDataNoFail(_url,checksum,form,_div){
	if(_div == '' || _div == undefined || _div == null  || _div == "NULL" ){
		_div = "htm2display";
	}
	if(_url.indexOf('?') >= 0){
		_url=_url+'&AJAX=Y';
	}else{
		_url=_url+'?AJAX=Y';
	}
	_data = generatePostQuery(form);
	_url = _url.replace(new RegExp("#", 'g'), "");
	$("#"+_div).html('<img src="/js/loading.gif">');
	//sleep(10000);
	if(_url.length > 0){
			$.ajax({
			
    	    url: _url,
	        data: _data,
        	type: 'POST',
			tryCount : 0,
			retryLimit : 10,
			 beforeSend: function( xhr ) {
				//xhr.overrideMimeType( "text/plain; charset=x-user-defined" );
				$("#"+_div).html('<img src="/js/loading.gif">');
			},
    	    success: function(responsedata,textStatus,jqXHR) {
	            if(jqXHR.getResponseHeader("content-type") == 'application/json'){
					$("#"+_div).html("Loading..");
					var i=0;
					for(i=0;i<responsedata.length;i++){
					//var response=jQuery.parseJSON(responsedata);
					//alert((responsedata[i]) + i);
						if(typeof responsedata[i] =='object'){
							if(responsedata[i].FE_TYPE == 'MESSAGE'){
								
							}else if(responsedata[i].FE_TYPE == 'FORM'){
								jsonForm(responsedata[i].DATA,_div);
							}else if(responsedata[i].FE_TYPE == 'PAGE-CONFIG'){
								if(responsedata[i].PAGE_NAME)eval("newRequestPage = \""+responsedata[i].PAGE_NAME+"\"");
								if(responsedata[i].PAGE_TITLE)eval("newTitlePage = \""+responsedata[i].PAGE_TITLE+"\"");
							}else if(responsedata[i].FE_TYPE == 'TABLE-DATA'){
								//jsonForm(responsedata[i].DATA,_div);
							}else if(responsedata[i].FE_TYPE == 'HTML/SCRIPT'){
								$_oldData = $('#'+_div).html();
								$('#'+_div).html(responsedata[i][j].DATA);
								$_oldData1 = $('#'+_div).html();
								$('#'+_div).html($_oldData+$_oldData1);
							}else {
								if(responsedata[i].length > 0 ){
									for(j=0;j<responsedata[i].length;++j){
										if(responsedata[i][j].FE_TYPE == 'MESSAGE'){
										}else if(responsedata[i][j].FE_TYPE == 'FORM'){
											jsonForm(responsedata[i][j].DATA,_div);
										}else if(responsedata[i][j].FE_TYPE == 'TABLE-DATA'){
											//jsonForm(responsedata[i].DATA,_div);
										}else if(responsedata[i][j].FE_TYPE == 'HTML/SCRIPT'){
											$_oldData = $('#'+_div).html();
											$('#'+_div).html(responsedata[i][j].DATA);
											$_oldData1 = $('#'+_div).html();
											$('#'+_div).html($_oldData+$_oldData1);
										}
									}
								}
							}
						}
					}
				}else if(jqXHR.getResponseHeader("content-type") == 'application/xml'){
					
				}else{
					$("#"+_div).html(responsedata);
					
				}
				$("#PageTitle").val('+ Add '+newTitlePage);
				$('#PageTitle').attr('tour_for',newTitlePage);
				$('#PageTitle').attr('tour_text',"Used for Add "+newTitlePage);
				//$('#PageTitle').attr('tour_no',optionClicked+1);
				$('#PageTitle').addClass('tour_cls');
				$('#PageTitle').html(newTitlePage);
				if($.isFunction('tour_on')){
					
					tour_on();
				}
				
        	},error : function(xhr, textStatus, errorThrown ) {
				$('#'+_div).append('<br><br><br>Try '+this.tryCount+'<br><br> Conneccting again with server... <br>wait for 10 seconds.');
				if (xhr.status != 500) {
					this.tryCount++;
					if (this.tryCount <= this.retryLimit) {
						setTimeout(retryObjAjax(this), 10000);
						//return;
					}   
				} else {
					$('#'+_div).html('Issue in server programming report to administrator');
				}
			}
    	});
    }else{
		alert('Please Select an option First');
	}/**/
}
function retryObjAjax(_obj){
	sleep(10000);
	$.ajax(_obj);
}
function showParallelPostData(_url,_div,form){
	//alert(_url.length);
	//_div="htm2display";
	_url = _url.replace(new RegExp("#", 'g'), "");
	if(_url.length > 0){
			$.ajax({
			
    	    url: _url+"?AJAX=Y",
	        data: generatePostQuery(form),
        	type: 'POST',
			 beforeSend: function( xhr ) {
				$("#"+_div).html('<img src="/js/loading.gif">');
			},
    	    success: function(responsedata,textStatus,jqXHR) {
            	evalScript(responsedata);
				$("#"+_div).html(responsedata);
				
        	}
    	});
    }else{
		alert('Please Select an option First');
	}/**/
}
function showInDivPostData(_url,csum,form,_div){
	alert(_url);
	//_div="htm2display";
	_url = _url.replace(new RegExp("#", 'g'), "");
	if(_url.length >0){
		$.ajaxQueue({
			
    	    url: _url+"?AJAX=Y",
	        data: generatePostQuery(form),
        	type: 'POST',
			 beforeSend: function( xhr ) {
				//xhr.overrideMimeType( "text/plain; charset=x-user-defined" );
				$("#"+_div).html('<img src="/js/loading.gif">');
			},
    	    success: function(responsedata,textStatus,jqXHR) {
	            // Write to #output
				evalScript(responsedata);
            	$("#"+_div).html(responsedata);
        	}
    	});
    }else{
		alert('Please Select an option First');
	}/**/
}


function searchData(checksum,formEle){
	showData(newRequestPage+'?&Search='+document.getElementById('sDB').value,"");
}
function searchDataBar(checksum,formEle){
	showData(newRequestPage+'?&Search='+document.getElementById('sDB').value,"");
}
function evalScript(scripts){
	try{
		if(scripts != ''){
			var script = "";
			scripts = scripts.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, 
			function(){ if (scripts !== null) script += arguments[1] + '\n'; return ''; });
 	          // alert(script);
 	          eval(script);
			if(script) (window.execScript) ? window.execScript(script) : window.setTimeout(script, 0);
		}
		return false;
	}
	catch(e){
		alert(e)
	}
}


function generatePostQuery(form){
	doc = form;
	var alertString = "";
	var postString = "";
	var form = {};
    for(i=0; i<doc.elements.length; i++){
        alertString = "";
        if(doc.elements[i].disabled ==false){
			
	        if(doc.elements[i].type=="button"){
	        	continue;
	        }else if(doc.elements[i].type=="checkbox"){
                if(doc.elements[i].checked==true){alertString += doc.elements[i].value;}
                else{ continue;}
            }else if(doc.elements[i].type=="radio"){
                if(doc.elements[i].checked==true){alertString += doc.elements[i].value;}
                else{continue;}
            }else if(doc.elements[i].type=="select-one"){
                alertString += doc.elements[i].value;
            }else if(doc.elements[i].type=="select-multiple"){
				//alert( $( doc.elements[i] ).serialize());
				for (var j = 0; j < doc.elements[i].length; j++) {
					if (doc.elements[i].options[j].selected){
						if(alertString.length != 0){
							alertString +=','
						}
						alertString +=doc.elements[i].options[j].value;
					}
				}
               // alertString +=  $( doc.elements[i] ).serialize();
            }else if(doc.elements[i].type=="checkbox"){
                if(doc.elements[i].checked==true){alertString += doc.elements[i].value;}
                else{continue;}
            }
            else {alertString += doc.elements[i].value;}
            if(alertString == ""){alertString="NULL";}
            if (form[doc.elements[i].name]) {
        	    form[doc.elements[i].name] = form[doc.elements[i].name] + ',' + encodeURIComponent(alertString);
    	    }
	        else {
            	form[doc.elements[i].name] = (alertString);
         	}
            //postString += doc.elements[i].name+":"+encodeURIComponent(alertString)+",";
        }
    }
   // alert(form);
    return form;
}
function loadAjaxElementDiv(){
	//document.getElementById('htm2display').innerHTML = "";
	document.getElementById('loadAjaxElementDiv').style.display = "Block";
	document.getElementById('loadAjaxElementDiv').style.visibility = "visible";
}
function hideAjaxElementDiv(){
	document.getElementById('loadAjaxElementDiv').style.display = "none";
	document.getElementById('loadAjaxElementDiv').style.visibility = "hidden";

}
function checkUnique(_value,_tbl,_clm,_name,_eleID,csum){
	//alert('here');
	var chksum=csum;var start = new Date();
	var httpRequestChkUq=createRequestObject();	
	httpRequestChkUq.open("GET","feops.php?OPS=CUK&checksum="+chksum+"&ts="+start+"&VAL="+_value+"&TBL="+_tbl+"&CLM="+_clm+"");
	httpRequestChkUq.onreadystatechange = function(){
		if(httpRequest.readyState == 4){	
			var response=httpRequestChkUq.responseText;
			//alert(response);
			if(response.indexOf("Not Found") != -1){	
				//alert(response);
			}else{
				if(response == 1){
					alert(_name+' is not Unique');
					document.getElementById(_eleID).focus();
				}else{
				
				}
			}
			if(response == 1){
				//return false;
			}
		}
	
	}
	httpRequestChkUq.send(null);
}
function getOptionsAjax(val,element,element_name){
		$.post('ajaxcheck.php',{'catId':val,'elementName':element_name},
			function(data){
				//alert(element+''+ data);
				$("#"+element).html(data);
				//document.getElementById(element).innerHTML= data;
			}
		);
}
function autoSuggestFE(){
$(".autocomplete").bind("keydown.autocomplete", function() {
        $(this).autocomplete({source: function( request, response ) {
			var xhr = null;if(xhr!=null){/*xhr.abort();/**/}
			xhr = 	$.ajax({url: $(this.element).attr('action'),dataType: "jsonp",data: {	style: "full",maxRows: 10,token: request.term,action : $(this.element).attr('action')},complete: function( data, status ) {
					if(status!=0){response( $.map( eval(data.responseText),function(item){return {label: item.label, value: item.value, id:item.id}}));}xhr=null;}
		});
		},
		minLength: 3,delay : 0,
		select : function(event, ui){
			if(ui.item){	$('#'+$(this).attr('target')).val(ui.item.id);
			}else{	$('#'+$(this).attr('target')).val("");	}
		},change: function(event, ui) {
			if(ui.item){	$('#'+$(this).attr('target')).val(ui.item.id);
			}else{	$('#'+$(this).attr('target')).val("");}
			if ( !ui.item ) {	$( this ).val( "" );	return false; }
		}
		});
    });
}
function tagSuggestFE(tagRef){
	$("#"+tagRef+"_disp").bind("keydown.autocomplete", function() {
		var keyword = $('#'+tagRef+'_disp').val();
        if(event.keyCode==13 && keyword !=""){
			addTag(keyword,tagRef);
			$('#'+$(this).attr('target')).val("");
			$(".ui-autocomplete").hide();
			return false;
		}else{		
			$(this).autocomplete({source: function( request, response ) {
				var xhr = null;if(xhr!=null){/*xhr.abort();/**/}
				xhr = 	$.ajax({url: $(this.element).attr('action'),dataType: "jsonp",data: {	style: "full",maxRows: 10,token: request.term,action : $(this.element.context).attr('action')},complete: function( data, status ) {
						if(status!=0){response( $.map( eval(data.responseText),function(item){return {label: item.label, value: item.value, id:item.id}}));}xhr=null;}
				});
				},
				minLength: 3,delay : 0,
				select : function(event, ui){
					if(ui.item){	addTag(ui.item.label,tagRef);//$('#'+$(this).attr('target')).val(ui.item.id);
					}else{	$('#'+$(this).attr('target')).val("");	}
				},change: function(event, ui) {
					if(ui.item){	$('#'+$(this).attr('target')).val(ui.item.id);
					}else{	$('#'+$(this).attr('target')).val("");}
					if ( !ui.item ) {	$( this ).val( "" );	return false; }
				}
				});
		}
    });
	
}
function addTag(tag,tagRef){
			var TagExist = document.getElementById(tag+'_tag');
			if(TagExist===null){
				$(".git_topicMain"+tagRef).append('<a href="javascript:void(0);" class="git_topic_List">'+tag+'<input type="hidden" name="'+tagRef+'[]" id="'+tag+'_tag" value="'+tag+'"><span onclick="removeTag(this);"></span></a>');
				$("#"+tagRef+"_disp").val('');
			}
			$(".git_AddTags_Details").html("");
			$(".git_AddTags_Details").hide();
		}
	function removeTag(tag){
			$(tag).parent().remove();
	}
function validateForm(form){
    //alert(form);
    var errorInForm = false;
    doc = form;
    var form = {};var checkFor="";
    for(i=0; i<doc.elements.length; i++){
	var isErrorInElement = false;
	var checkFor = 'ERROR_REQUIRED';
	//alert(doc.elements[i].name);
	try{
        if(doc.elements[i].type){
            //
        }
		if($(doc.elements[i]).attr(checkFor)!='' && typeof $(doc.elements[i]).attr(checkFor) !== "undefined" ){
			//alert(doc.elements[i].value.length+"======="+'ERROR_'+doc.elements[i].name);
			if(doc.elements[i].value.length == 0 ){
                errorInForm = setErrorMessage('ERROR_'+doc.elements[i].name,$(doc.elements[i]).attr(checkFor),isErrorInElement );
                isErrorInElement =  true;
                continue;
			}else{
                unsetErrorMessage('ERROR_'+doc.elements[i].name,isErrorInElement);
			}
		}else{
			unsetErrorMessage('ERROR_'+doc.elements[i].name,isErrorInElement);
        }
        var checkFor = 'MINLENGTH';		
        if($(doc.elements[i]).attr(checkFor)!='' && typeof $(doc.elements[i]).attr(checkFor) !== "undefined" && doc.elements[i].value.length < $(doc.elements[i]).attr(checkFor) ){
            //alert(doc.elements[i].name+'_ERROR_'+checkFor); die;
            if(doc.elements[i].name+'_ERROR_'+checkFor !== "undefined"){
                if(doc.elements[i].name+'_ERROR_'+checkFor!='PASSWORD_ERROR_MINLENGTH'){
					errorInForm = setErrorMessage('ERROR_'+doc.elements[i].name,eval(doc.elements[i].name+'_ERROR_'+checkFor),isErrorInElement);
                }
			}else{
                errorInForm = setErrorMessage('ERROR_'+doc.elements[i].name,'Min length for '+$(doc.elements[i]).attr('DISPLAY-LABEL')+' is '+ $(doc.elements[i]).attr(checkFor),isErrorInElement);
			}
            isErrorInElement =  true;
			continue;
        }else{
			unsetErrorMessage('ERROR_'+doc.elements[i].name,isErrorInElement);
        }
		
        var checkFor = 'MAXLENGTH';
        if($(doc.elements[i]).attr(checkFor)!='' && typeof $(doc.elements[i]).attr(checkFor) !== "undefined" && doc.elements[i].value.length > $(doc.elements[i]).attr(checkFor)){
         	if(doc.elements[i].name+'_ERROR_'+checkFor !== "undefined"){
                errorInForm = setErrorMessage('ERROR_'+doc.elements[i].name,eval(doc.elements[i].name+'_ERROR_'+checkFor),isErrorInElement);
			}else{
                errorInForm = setErrorMessage('ERROR_'+doc.elements[i].name,'Max length for '+$(doc.elements[i]).attr('DISPLAY-LABEL')+' is '+ $(doc.elements[i]).attr(checkFor),isErrorInElement);
			}
            isErrorInElement =  true;
			continue;
        }else{
			unsetErrorMessage('ERROR_'+doc.elements[i].name,isErrorInElement);
        }
        if($(doc.elements[i]).attr('VALUE_TYPE') == 'NUMBER' || $(doc.elements[i]).attr('VALUE_TYPE') == 'INTEGER'){			
			var checkFor = 'MINVALUE';
			if($(doc.elements[i]).attr(checkFor)!='' && typeof $(doc.elements[i]).attr(checkFor) !== "undefined" && (doc.elements[i].value*1) < $(doc.elements[i]).attr(checkFor)){
                if(doc.elements[i].name+'_ERROR_'+checkFor !== "undefined"){
					errorInForm = setErrorMessage('ERROR_'+doc.elements[i].name,eval(doc.elements[i].name+'_ERROR_'+checkFor),isErrorInElement);
                }else{
					errorInForm = setErrorMessage('ERROR_'+doc.elements[i].name,'Min value for '+$(doc.elements[i]).attr('DISPLAY-LABEL')+' is '+ $(doc.elements[i]).attr(checkFor),isErrorInElement);
                    }
                    isErrorInElement =  true;
                    continue;
		}else{
                    unsetErrorMessage('ERROR_'+doc.elements[i].name,isErrorInElement);
		}
		var checkFor = 'MAXVALUE';
		if($(doc.elements[i]).attr(checkFor)!='' && typeof $(doc.elements[i]).attr(checkFor) !== "undefined" && (doc.elements[i].value*1) > 	$(doc.elements[i]).attr(checkFor)){
                    if(doc.elements[i].name+'_ERROR_'+checkFor !== "undefined"){
			errorInForm = setErrorMessage('ERROR_'+doc.elements[i].name,eval(doc.elements[i].name+'_ERROR_'+checkFor),isErrorInElement);
                    }else{
			errorInForm = setErrorMessage('ERROR_'+doc.elements[i].name,'Max value for '+$(doc.elements[i]).attr('DISPLAY-LABEL')+' is '+ $(doc.elements[i]).attr(checkFor),isErrorInElement);
                    }
                    isErrorInElement =  true;
                    continue;
		}else{
                    unsetErrorMessage('ERROR_'+doc.elements[i].name,isErrorInElement);
		}
	}
   // alert($(doc.elements[i]).attr('VALUE_TYPE'));
	var checkFor = 'VALUE_TYPE';
	if($(doc.elements[i]).attr('VALUE_TYPE') == 'EMAIL' ){
		
		if(isEmail(doc.elements[i].value)){
			unsetErrorMessage('ERROR_'+doc.elements[i].name,isErrorInElement);
		}else{
			errorInForm = inErrorEvent(doc.elements[i].name,isErrorInElement,'Value of '+$(doc.elements[i]).attr('DISPLAY-LABEL')+' is not a valid '+$(doc.elements[i]).attr('VALUE_TYPE'),checkFor);
			isErrorInElement =  true;
			continue;
		}
    }else if($(doc.elements[i]).attr('VALUE_TYPE') == 'INTEGER'){
		if(isInt(doc.elements[i].value)){
                    unsetErrorMessage('ERROR_'+doc.elements[i].name,isErrorInElement);
		}else{
                    errorInForm = inErrorEvent(doc.elements[i].name,isErrorInElement,'Value of '+$(doc.elements[i]).attr('DISPLAY-LABEL')+' is not a valid '+$(doc.elements[i]).attr('VALUE_TYPE'),checkFor);
                    isErrorInElement =  true;
                    continue;
		}
    }else if($(doc.elements[i]).attr('VALUE_TYPE') == 'NUMBER'){
        if(isNum(doc.elements[i].value)){
            unsetErrorMessage('ERROR_'+doc.elements[i].name,isErrorInElement);
		}else{
			errorInForm = inErrorEvent(doc.elements[i].name,isErrorInElement,'Value of '+$(doc.elements[i]).attr('DISPLAY-LABEL')+' is not a valid '+$(doc.elements[i]).attr('VALUE_TYPE'),checkFor);
			isErrorInElement =  true;
			continue;
		}
    }else if($(doc.elements[i]).attr('VALUE_TYPE') == 'ALPHANUM'){
		if(isAlphanum(doc.elements[i].value)){
			unsetErrorMessage('ERROR_'+doc.elements[i].name,isErrorInElement);
		}else{
			errorInForm = inErrorEvent(doc.elements[i].name,isErrorInElement,'Value of '+$(doc.elements[i]).attr('DISPLAY-LABEL')+' is not a valid '+$(doc.elements[i]).attr('VALUE_TYPE'),checkFor);
			isErrorInElement =  true;
			continue;
		}
    }
	else if($(doc.elements[i]).attr('VALUE_TYPE') == 'URL'){
		if(isCompany_Url(doc.elements[i].value)){
			unsetErrorMessage('ERROR_'+doc.elements[i].name,isErrorInElement);
		}else{
			errorInForm = inErrorEvent(doc.elements[i].name,isErrorInElement,'Value of '+$(doc.elements[i]).attr('DISPLAY-LABEL')+' is not a valid '+$(doc.elements[i]).attr('VALUE_TYPE'),checkFor);
			isErrorInElement =  true;
			continue;
		}
    }
	else if($(doc.elements[i]).attr('VALUE_TYPE') == 'PASSWORD'){
		//alert(password(doc.elements[i].value));
		if(password(doc.elements[i].value)){
			unsetErrorMessage('ERROR_'+doc.elements[i].name,isErrorInElement);
		}else{
			errorInForm = inErrorEvent(doc.elements[i].name,isErrorInElement,'Value of '+$(doc.elements[i]).attr('DISPLAY-LABEL')+' is not a valid '+$(doc.elements[i]).attr('VALUE_TYPE'),checkFor);
			isErrorInElement =  true;
			continue;
		}
    }	
	  }catch(err){
            console.log(err.message);
	  }
	  if(errorInForm) {
		  console.log($(doc.elements[i]).attr('NAME'));
		}
	}
	if(!errorInForm){
            if( customValidate && typeof customValidate == 'function'){
		errorInForm = customValidate();
            }
	}
	return !errorInForm ;
}
function inErrorEvent(elementName,isErrorInElement,DefaultMessage,checkFor){
    if(eval(elementName+'_ERROR_'+checkFor) !== "undefined"){
	return errorInForm = setErrorMessage('ERROR_'+elementName,eval(elementName+'_ERROR_'+checkFor),isErrorInElement);
    }else{
	return errorInForm = setErrorMessage('ERROR_'+elementName,DefaultMessage,isErrorInElement);
    }
}
function setErrorMessage(errorElementId,errorMessage,isErrorInElement){
    errorElementId=errorElementId.replace("[]", ''); 
    //alert(errorElementId);
    if(isErrorInElement){
    	$('#'+errorElementId).html('<p class="error-block"><span>'+errorMessage+'</span></p>').show();
    }else{
	$('#'+errorElementId).html('<p class="error-block"><span>'+errorMessage+'</span></p>').show();
    }
    return true;
}
function unsetErrorMessage(errorElementId,isErrorInElement){
    errorElementId=errorElementId.replace("[]", ''); 
    if(isErrorInElement){
    }
    else{
	$('#'+errorElementId).html('').hide();
    }	
}
var customValidateCode='';
function customValidate() {
        var isError = false;
		try {
			eval(customValidateCode);
        }catch(err){ console.log(err.message);}
		return isError;
}

function jsonForm(form,_div){
		$form = $("<form></form>");
		$form.attr('action',form.PAGE_NAME);
		$form.attr('onsubmit',"javascript:if(validateForm(this)){showPostData('"+form.PAGE_NAME+"','"+form.CHECKSUM+"',this,'"+_div+"'); return false;}else{ return false; }");
		ScriptAtEnd = [];
		$form.attr('enctype',"multipart/form-data");
		$form.attr('method',"post");
		for(i=0;i<form.ELEMENT.length;++i){
			$string =$('<div></div>').html(form.ELEMENT[i].TITLE);
			$string.append('<div>').
			attributes = '';
			$tmp=$('<div><div/>');
			try{
			if(form.ELEMENT[i].TYPE == 'TEXT' || form.ELEMENT[i].TYPE == 'PASSWORD' || form.ELEMENT[i].TYPE == 'HIDDEN' ){
				$tmp = $("<input/>", {type: form.ELEMENT[i].TYPE,relFeId: form.ELEMENT[i].NAME,name: form.ELEMENT[i].NAME,placeholder: form.ELEMENT[i].TITLE});
			}else if(form.ELEMENT[i].TYPE == 'TEXTAREA'){
				$tmp = $("<textarea/>", {relFeId: form.ELEMENT[i].NAME,name: form.ELEMENT[i].NAME,placeholder: form.ELEMENT[i].TITLE});
			}else if(form.ELEMENT[i].TYPE == 'DATE'){
				$tmp = $("<input />", {type: 'TEXT',relFeId: form.ELEMENT[i].NAME,name: form.ELEMENT[i].NAME,placeholder: form.ELEMENT[i].TITLE});
				ScriptAtEnd.push(' $( "[relFeId='+form.ELEMENT[i].NAME+']").datepicker();');
			}else if(form.ELEMENT[i].TYPE == 'MULTIDATE'){
				$tmp = $("<input />", {type: 'TEXT',relFeId: form.ELEMENT[i].NAME,name: form.ELEMENT[i].NAME,placeholder: form.ELEMENT[i].TITLE});
				ScriptAtEnd.push(' $( "[relFeId='+form.ELEMENT[i].NAME+']").multiDatesPicker({dateFormat: "d-m-yy"});');
			}else if(form.ELEMENT[i].TYPE == 'DATETIME'){
				$tmp = $("<input />", {type: 'TEXT',relFeId: form.ELEMENT[i].NAME,name: form.ELEMENT[i].NAME,placeholder: form.ELEMENT[i].TITLE});
				//ScriptAtEnd +=' $( "[relFeId='+form.ELEMENT[i].NAME+']").datepicker();';
				ScriptAtEnd.push("$('[relFeId="+form.ELEMENT[i].NAME+"]').datetimepicker().datetimepicker({value:'',format:'d/m/Y H:i',step:1, allowTimes:[ '00:00', '00:15', '00:30', '00:45','01:00', '01:15', '01:30', '01:45','02:00', '02:15', '02:30', '02:45','03:00', '03:15', '03:30', '03:45','04:00', '04:15', '04:30', '04:45','05:00', '05:15', '05:30', '05:45','06:00', '06:15', '06:30', '06:45','07:00', '07:15', '07:30', '07:45','08:00', '08:15', '08:30', '08:45','09:00', '09:15', '09:30', '09:45','10:00', '10:15', '10:30', '10:45','11:00', '11:15', '11:30', '11;45','12:00', '12:15', '12:30', '12:45','13:00', '13:15', '13:30', '13:45','14:00', '14:15', '14:30', '14:45','15:00', '15:15', '15:30', '15:45','16:00', '16:15', '16:30', '16:45','17:00', '17:15', '17:30', '17:45','18:00', '18:15', '18:30', '18:45','19:00', '19:15', '19:30', '19:45','20:00', '20:15', '20:30', '20:45','21:00', '21:15', '21:30', '21:45','22:00', '22:15', '22:30', '22:45', '23:00', '23:15', '23:30', '23:45',]});");
			}else if(form.ELEMENT[i].TYPE == 'TIME'){
				$tmp = $("<input />", {type: 'TEXT','class':'ptTimeSelect',relFeId: form.ELEMENT[i].NAME,name: form.ELEMENT[i].NAME,placeholder: form.ELEMENT[i].TITLE});
				ScriptAtEnd.push(' $( "[relFeId='+form.ELEMENT[i].NAME+']").ptTimeSelect();');
			}else if(form.ELEMENT[i].TYPE == 'SELECTSUGGEST'){
				$tmp1 = $("<input />", {type: 'TEXT','class':'ptTimeSelect',relFeId: form.ELEMENT[i].NAME+'_disp',target: form.ELEMENT[i].NAME,name: ''+form.ELEMENT[i].NAME+'_disp',placeholder: form.ELEMENT[i].TITLE,action:form.ELEMENT[i].ACTION,autocomplete:'off','class':'autocomplete'});
				$tmp = $("<input />", {type: 'HIDDEN','class':'ptTimeSelect',relFeId: form.ELEMENT[i].NAME,name: form.ELEMENT[i].NAME,placeholder: form.ELEMENT[i].TITLE,autocomplete:'off'});
				ScriptAtEnd.push(' autoSuggestFE(); ');
				$string.append($tmp1);
			}else if(form.ELEMENT[i].TYPE == "FILE"){
				$tmp = $("<input/>", {type: form.ELEMENT[i].TYPE,relFeId: form.ELEMENT[i].NAME,name: form.ELEMENT[i].NAME,placeholder: form.ELEMENT[i].TITLE});
				$tmp1 = $("<input/>", {type: 'HIDDEN',relFeId: form.ELEMENT[i].NAME+'_TYPE',name: form.ELEMENT[i].NAME+'_TYPE',placeholder: form.ELEMENT[i].TITLE});
				$tmp2 = $("<input/>", {type: 'HIDDEN',relFeId: form.ELEMENT[i].NAME+'_SIZE',name: form.ELEMENT[i].NAME+'_SIZE',placeholder: form.ELEMENT[i].TITLE});
				$string.append($tmp1);
				$string.append($tmp2);
			}else if(form.ELEMENT[i].TYPE == 'CHECKBOX'){
				$tmp = $("<input/>", {type: form.ELEMENT[i].TYPE,relFeId: form.ELEMENT[i].NAME,name: form.ELEMENT[i].NAME,placeholder: form.ELEMENT[i].TITLE});
			}else if(form.ELEMENT[i].TYPE == 'CHECKBOXARRAY'){
				for(var key in form.ELEMENT[i].DEFAULT_VALUE) {
					$tmp1 = $("<div style='float:left'>"+form.ELEMENT[i].DEFAULT_VALUE[key].LABEL+"</div>");
					$tmp2 = $("<input/>", {style:'float:left' ,type: 'CHECKBOX',relFeId: form.ELEMENT[i].NAME,name: form.ELEMENT[i].DEFAULT_VALUE[key].NAME,value:form.ELEMENT[i].DEFAULT_VALUE[key].VALUE});
					$string.append($tmp1);
					$string.append($tmp2);
				}
			}else if(form.ELEMENT[i].TYPE == 'CHECKBOXMULTI'){
				for(var key in form.ELEMENT[i].DEFAULT_VALUE) {
					$tmp1 = $("<div style='float:left'>"+form.ELEMENT[i].DEFAULT_VALUE[key].LABEL+"</div>");
					$tmp2 = $("<input/>", { style:'float:left' ,type: 'CHECKBOX',relFeId: form.ELEMENT[i].NAME,name: form.ELEMENT[i].NAME+"[]",value:form.ELEMENT[i].DEFAULT_VALUE[key].VALUE});
					$string.append($tmp1);
					$string.append($tmp2);
				}
			}else if(form.ELEMENT[i].TYPE == 'RADIO'){
				for(var key in form.ELEMENT[i].DEFAULT_VALUE) {
					$tmp1 = $("<div style='float:left'>"+form.ELEMENT[i].DEFAULT_VALUE[key].LABEL+"</div>");
					$tmp2 = $("<input/>", { style:'float:left' ,type: 'RADIO',relFeId: form.ELEMENT[i].NAME,name: form.ELEMENT[i].NAME+"[]",value:form.ELEMENT[i].DEFAULT_VALUE[key].VALUE});
					$string.append($tmp1);
					$string.append($tmp2);
				}
			}else if(form.ELEMENT[i].TYPE == 'SELECT'){
				$tmp = $("<select />",{relFeId: form.ELEMENT[i].NAME,name: form.ELEMENT[i].NAME,placeholder: form.ELEMENT[i].TITLE});
				for(var val in form.ELEMENT[i].DEFAULT_VALUE) {
					$("<option />", {value: form.ELEMENT[i].DEFAULT_VALUE[val].VALUE, text: form.ELEMENT[i].DEFAULT_VALUE[val].LABEL}).appendTo($tmp);
				}
			}else if(form.ELEMENT[i].TYPE == 'HTMLEDITOR'){
				$tmp = $("<textarea/>", {relFeId: form.ELEMENT[i].NAME,name: form.ELEMENT[i].NAME,placeholder: form.ELEMENT[i].TITLE});
				ScriptAtEnd.push("$('[relFeId="+form.ELEMENT[i].NAME+"]').redactor({lang: 'en',cleanOnPaste: false,linkTooltip: true,paragraphize: false,imageUpload: 'redactor/inc/editor_images.php',imageManagerJson: 'redactor/inc/data_json.php',fileUpload: 'redactor/inc/editor_files.php',replaceDivs: true,autoresize: false,minHeight: 400,buttonSource: false,plugins: ['imagemanager', 'video']});");
			}else if(form.ELEMENT[i].TYPE == 'IMAGEUPLOAD'){
				$tmp = $("<input/>", {type: 'HIDDEN',relFeId: form.ELEMENT[i].NAME,value:form.ELEMENT[i].DEFAULT_VALUE,name: form.ELEMENT[i].NAME,placeholder: form.ELEMENT[i].TITLE});
				if(form.ELEMENT[i].VALUE){
					$tmp1 ="<div relFeId=\""+form.ELEMENT[i].NAME+"_ulp\"><img src=\""+form.ELEMENT[i].REMOTE_PATH+"/"+form.ELEMENT[i].VALUE+"\" height=\"100px\"></div>";					
					$string.append($tmp1);
				}
				$tmp2 ="<div relFeId=\""+form.ELEMENT[i].NAME+"_ul\"></div>";
				
				$string.append($tmp2);
				ScriptAtEnd.push("jQuery( function($) { \$('[relFeId="+form.ELEMENT[i].NAME+"_ul]').ajaxupload({url:'upload.php',remotePath:'"+form.ELEMENT[i].REMOTE_PATH+"' , allowExt:["+form.ELEMENT[i].ALLOW_EXTENSION+"] ,autoStart:true,finish:function(files, filesObj){},success:function(file,info){$('[relFeId="+form.ELEMENT[i].NAME+"]').value = file;},beforeUpload: function(filename, fileobj){if(filename.length>50){alert('FileName Must be less than 50 Char');return false;}else{return true;}},error:function(txt, obj){alert('An error occour '+ txt +'#'+ obj);}});});");
			}else if(form.ELEMENT[i].TYPE == 'IMAGEUPLOADMULTI'){
				$tmp = $("<input/>", {type: 'HIDDEN',relFeId: form.ELEMENT[i].NAME,value:form.ELEMENT[i].DEFAULT_VALUE,name: form.ELEMENT[i].NAME,placeholder: form.ELEMENT[i].TITLE});
				if(form.ELEMENT[i].VALUE){
					$tmp1 ="<div relFeId=\""+form.ELEMENT[i].NAME+"_ulp\"><img src=\""+form.ELEMENT[i].REMOTE_PATH+"/"+form.ELEMENT[i].VALUE+"\" height=\"100px\"></div>";					
					$string.append($tmp1);
				}
				$tmp2 ="<div relFeId=\""+form.ELEMENT[i].NAME+"_ul\"></div>";
				
				$string.append($tmp2);
				ScriptAtEnd.push("jQuery( function($) { \$('[relFeId="+form.ELEMENT[i].NAME+"_ul]').ajaxupload({url:'upload.php',remotePath:'"+form.ELEMENT[i].REMOTE_PATH+"' , allowExt:["+form.ELEMENT[i].ALLOW_EXTENSION+"] ,autoStart:true,finish:function(files, filesObj){},success:function(file,info){$('[relFeId="+form.ELEMENT[i].NAME+"]').value = file;},beforeUpload: function(filename, fileobj){if(filename.length>50){alert('FileName Must be less than 50 Char');return false;}else{return true;}},error:function(txt, obj){alert('An error occour '+ txt +'#'+ obj);}});});");
			}
			
			else if(form.ELEMENT[i].TYPE == 'SUBMIT_RESET'){
				$tmp = $("<input/>", {type: 'SUBMIT',relFeId: form.ELEMENT[i].NAME,value:form.ELEMENT[i].DEFAULT_VALUE,name: form.ELEMENT[i].NAME,placeholder: form.ELEMENT[i].TITLE});
				$tmp1 = $("<input/>", {type: 'RESET',relFeId: form.ELEMENT[i].NAME,name: form.ELEMENT[i].NAME,placeholder: form.ELEMENT[i].TITLE});
				$string.append($tmp1);
			}
			else{
				$tmp = $("<input/>", {type: form.ELEMENT[i].TYPE,relFeId: form.ELEMENT[i].NAME,name: form.ELEMENT[i].NAME,placeholder: form.ELEMENT[i].TITLE});
			}
			$tmp
			//for all elements setting up value
			{	
			for (var key in form.ELEMENT[i]) {
					if (form.ELEMENT[i].hasOwnProperty(key)) {
						if(typeof form.ELEMENT[i][key] == 'object'){
							for (var key1 in form.ELEMENT[i][key]){
								if(typeof form.ELEMENT[i][key][key1] == 'object'){
								}else{
									try{
										if(key1.toLowerCase() !='type')
										$tmp.attr(key1,form.ELEMENT[i][key][key1]);
									}catch(e){}
								}
							}
						}else{
							try{
								if(key.toLowerCase() !='type')
								$tmp.attr(key,form.ELEMENT[i][key]);
							}catch(e){}
						}
					}
				}
				if($tmp.val()==''){
					$tmp.val(form.ELEMENT[i].DEFAULT_VALUE);
				}
				if(form.ELEMENT[i].ERROR_REQUIRED){
					$string.append($tmp).append('<font style="color:red">*</font>');
				}else{
					$string.append($tmp);
				}
			}	
			$string.append('<div class="error" style="display:none;" id="ERROR_'+form.ELEMENT[i].NAME+'"><p class="error-block"><span></span></p></div></div>');
			$form.append($string).append('<div style="clear:both"></div>');
			if(form.ELEMENT[i].FE_ERROR){
					setErrorMessage(form.ELEMENT[i].NAME,form.ELEMENT[i].FE_ERROR,'TRUE')
			}
			}catch(e){
				console.log(e.message+'#'+form.ELEMENT[i].NAME);
			}
			

			//$form.append(_string);
		}
		$_oldData = $('#'+_div).html();
		$('#'+_div).html($form);
		$_oldData1 = $('#'+_div).html();
		$('#'+_div).html($_oldData+$_oldData1);
		var i=0;
		for(i=0;i<ScriptAtEnd.length;i++){
			try{eval(ScriptAtEnd[i]); }
			catch(e){ console.log(e.message);}
		}
	}
function makeTable(container, data,configs) {
	
    var table = $("<table/>").addClass('git_table table');
    $.each(data, function(rowIndex, r) {
		var  opsValue='';
        var row = $("<tr/>");
		var _i = 0;
        $.each(r, function(colIndex, c) { 
			if(colIndex == configs.MAINCOLUMN || _i == configs.MAINCOLUMN ){ opsValue = c;}
            row.append($("<t"+(rowIndex == 0 ?  "h" : "d")+"/>").text(c));
			++_i;
        });
		if(configs.OPERATION && configs.PAGENAME){
			row.click(function() {
				showData(configs.PAGENAME,'&'+configs.OPERATION+'='+opsValue);
				//alert( "Handler for .click() called." );
			});
			//row.append($("<t"+(rowIndex == 0 ?  "h" : "d")+" onclick = 'showData(\""+configs.PAGENAME+"\",'&\""+configs.OPERATION+"="+opsValue+"\"')'/>").text(configs.OPERATION));
		}
        table.append(row);
    });
    return container.append(table);
}

	uploadFile = function(file, type, finishEvent, progressEvt) {
        var fd, xhr;
        if (finishEvent == null) {
          finishEvent = null;
        }
        if (progressEvt == null) {
          progressEvt = null;
        }
        fd = new FormData();
        fd.append("file", file, file.name);
        xhr = new XMLHttpRequest();
        xhr.upload.onprogress = function(evt) {
          var percentComplete;
          if (evt.lengthComputable) {
            percentComplete = Math.min(95, evt.loaded / evt.total * 100);
            if (progressEvt) {
              return progressEvt(percentComplete);
            }
          }
        };
        xhr.onreadystatechange = function(evt) {
          if (xhr.readyState === 4) {
			  deleteImage();
            if (finishEvent && xhr.response) {
              return finishEvent({
                status: xhr.status,
                data: JSON.parse(xhr.response)
              });
            }
          }
        };
        xhr.open("POST", "uploading.php?type=" + type);
        xhr.send(fd);
        return xhr;
      }

	
		
		
		window.showProcess = function(show) {
        if (show == null) {
          show = true;
        }
        return $timeout(function() {
          return $scope.processing = show;
        }, 0, true);
      };
	  function fileReadOps(file,key,cursorPostion,editableDiv){
		var reader;
        reader = new FileReader();
        reader.readAsDataURL(file);
		reader.onloadend = function(e) {
          var image;
          image = {
            url: reader.result,
            name: file.name
          };
         $('#'+editableDiv+'').append("<div id='uploader_"+key+"' class=\"uploadPhotoDiv\"><div class='upload-indicator' ></div><img style='width:100%' class='uploaded-image' src='" + image.url + "'/></div>");
		 setXHR(key, file);
        };
	  }
	  
function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}
function deleteImage(){
	$('[action=deleteimage]').unbind('click');
	$('[action=deleteimage]').click(function(){
		//alert('hi');
		var $currentObject = $(this);
		_url = './deleteAwmImage.php?_='+$(this).attr('fileid');
		$.ajax({
		type:'POST',
		url: _url,
		data:'',
		success:function(data,textStatus,jqXHR){
			$currentObject.parent().parent().parent().parent().parent().parent().parent().remove();
			App.pageGallery();
		},
		error: function(data){
			console.log("error");
			console.log(data);
		}
		});
	});
}
	var TimeLeft = 100000;
	var lastQuestion = 0;
	var var4Clear ='';
	var showWarnTimeNotification = true;
	var showErrorTimeNotification = true;
	var start_time = new Date();
	function timeLeftFun(){
		var miliseconds = 1;
		var seconds = miliseconds * 1000;
		var minutes = seconds * 60;
		var hours = minutes * 60;
		var days = hours * 24;
		var years = days * 365;
		TimeLeft = TimeLeft -1000;
		//Getting the date time in terms of units
		//Floored so that they go together (to get just year/days/hours etc.. by themselves you need to use Math.round(diff/desired unit);
		var numYears = Math.floor(TimeLeft / years);
		var numDays = Math.floor((TimeLeft % years) / days);
		var numHours = Math.floor((TimeLeft % days) / hours);
		var numMinutes = Math.floor((TimeLeft % hours) / minutes);
		var numSeconds = Math.round((TimeLeft % minutes) / seconds);
		document.getElementById('timeLeft').innerHTML = '<b class="panel-heading panel-heading-divider"> '+numHours+':'+ numMinutes +':'+numSeconds+'</b>';
		if(showWarnTimeNotification && numMinutes == 10 && numHours == 0 ){
				$.extend($.gritter.options, {
                    position: "top-right"
                }),  $.gritter.add({
                    title: "Hurry Up !!",
                    text: "Only "+numMinutes+" minutes left",
                    class_name: "color warning"
                })
			showWarnTimeNotification = false;
		}
		if(showErrorTimeNotification && numMinutes == 5 && numHours == 0 ){
				$.extend($.gritter.options, {
                    position: "top-right"
                }),  $.gritter.add({
                    title: "Hurry Up !!",
                    text: "Only "+numMinutes+" minutes left",
                    class_name: "color error"
                })
			showErrorTimeNotification = false;
		}
		if(TimeLeft < 0 ){
			$('form[name=\'MyFORM\']').append('<input type=hidden name=mode value=review >' );//.submit();
			$('form[name=\'MyFORM\']').append('<input type=hidden name=gotoq value="'+lastQuestion+'" >' ).submit();
		}
	}
