/*
Multiple Diagram Navigation Drupal Module

*/

	var CurrentHoverFill; 
    var CurrentHoverStroke; 
	var CurrentHoverOpacity;  
	var CurrentHoverStrokeWidth;
	var relatedHighlightedElements=[];
	var eventCounter=0;
	
	var visualElements = []; // All visual elements in all diagram; includes elements having at least one connection(to visual or content element)
                             // This is a key data structure where we keep track of element orignial style, status (regular, selected, highlighted)
							 // , and number of highlighting requests for the element (made by other elements)
	var dColors =[];						 
	var svgElementHasConnections=false;
	var flagKeepColor = false;
	var displayedDiagrams=[]; // displayed diagrams for main window
	var connectionsWindow_displayedDiagrams =[]; // // displayed diagrams for connections window
	var connectionsWindow_selections=[];
	var con_window_class =".conWinContainerClass"; 
	var color_window_class =".colorWinContainerClass";
	var tempFillColor;
	var tempStrokeColor;
	
	var CW_original_styles = [];
	
	var thisSide=0;
	var otherSide=0;
	
	var layout;

	// default diagram colors
    var rect = {
   'hoverfill': "rgb(235,131,22)",
   'hoverstroke': "rgb(184,16,16)",
   'hoverstroke_width': "1.0px",

   'highlightfill': "rgb(113,207,51)",
   'highlightstroke': "rgb(113,207,51)",
   'highlightstroke_width': "1.0px",

   'selectfill': "rgb(49,96,62)",
   'selectstroke': "rgb(116,88,36)",
   'selectstroke_width': "1.0px",
   };


function clearSelections(){ 
	var i;
	for(i=0;i<visualElements.length;i++){
		if(visualElements[i][6] === 1 || visualElements[i][6] === 2){
           	 jQuery("#" + visualElements[i][0] + '_' + visualElements[i][1])
			              .css("fill",visualElements[i][2]).css("stroke",visualElements[i][3])
	                      .css("stroke-width",visualElements[i][4]).css("opacity",visualElements[i][5]);
		}
		visualElements[i][6]=0;
		visualElements[i][7]=0;
	}
}   

function DiagramBrowserCancel(){
   jQuery.modal.close();	
}

function DiagramBrowserOK(){

	var count=0;
	var diagramArr =[];
	for (var i=0; i<Drupal.settings.NoOfDiagrams;i++){
		if(jQuery('#' + 'checkbox_' + i).is(':checked')){
			count +=1;
			diagramArr[diagramArr.length] = jQuery('#' + 'checkbox_' + i).attr("nid");
		}
	}
	
	if(count > 2){
		alert("You have selected " + count + " diagrams, Multiple Diagram Navigation supports only up to two diagrams. Please unselect some diagrams");
		return;
	}

	layout =count;
	
	var arg1; var arg2;
    if(count==1){
		arg1=diagramArr[0]; 
		arg2=0; 
	}
    else if(count==2){
		arg1=diagramArr[0]; 
		arg2=diagramArr[1]; 
	} 	
	
	if(count >0){
  	   jQuery("#AllSVGContainer").load("?q=mdn/diagrams/" + arg1 + "/" + arg2, DiagramBroswerOKCallBack);
	   jQuery.modal.close();
	}
	else {
		jQuery("#AllSVGContainer").html('');
		displayedDiagrams.length=0;
		jQuery.modal.close();
	}
}

function DiagramBroswerOKCallBack(){
   	 SVGDisplayPreparation("svgContainer", sendClickToParentDocument, sendMouseOverToParentDocument, sendMouseOutToParentDocument);

    displayedDiagrams.length=0;
	var relatedElements=[];
    jQuery("svg[prepared='yes']").each(function( index ) {

	   displayedDiagrams[displayedDiagrams.length]=jQuery( this ).attr("id");
 	   
	   relatedElements = jQuery.grep(visualElements, function(v,i) {
           return (v[0] === displayedDiagrams[displayedDiagrams.length -1] && v[6] === 1);     
       });
	   
	   for(var i=0; i<relatedElements.length;i++){
		   changeStyle('', relatedElements[i][0] + '_' + relatedElements[i][1], 'select',0);
	   }

	   relatedElements = jQuery.grep(visualElements, function(v,i) {
           return (v[0] === displayedDiagrams[displayedDiagrams.length - 1] && v[6] === 2);  
       });
	   
	   for(var i=0; i<relatedElements.length;i++){
		   changeStyle('', relatedElements[i][0] + '_' + relatedElements[i][1], 'highlight',0);
	   }
	   
    });
	
    jQuery(".svgContainer").each(function( index ) {
 	    if(layout==1){
	         jQuery( this ).removeClass("mdnDoubleLayout");
	         jQuery( this ).addClass("mdnSingleLayout");
	     }
	     else if (layout == 2){
 	         jQuery( this ).removeClass("mdnSingleLayout");
	         jQuery( this ).addClass("mdnDoubleLayout");
	     }
    });

	
}



function displayDiagramBrowser(){
	jQuery("#diagramBrowser").modal({
		maxWidth:1000,
		maxHeight:500
	});
}

function connectionsLanuch(){
	jQuery("#conWinDiagrams").load("?q=mdn/connectionsWindow/", connectionsLanuchCallBack);
}

function connectionsLanuchCallBack(){
	
	if(jQuery("#conWinDiagrams").html() == 'No Diagrams Available'){
	    alert('No diagrams are found in your site. \nYou need at least one diagram to start connecting diagram elements to Drupal nodes. In case of diagram to diagram connections, you need at leaast two diagrams');
        return;	   
	}
	
	jQuery("#conWinButtom").html(jQuery("#buttomBuffer").html());
	jQuery("#buttomBuffer").html('');  // has to reload when closing connectinons_window
	
    SVGDisplayPreparation("conWinDiagramsClass", sendClickToParentDocument2, sendMouseOverToParentDocument2, sendMouseOutToParentDocument2);

	connectionsWindow_displayedDiagrams.length=0;
	 jQuery(".conWinDiagramsClass svg[prepared='yes']").each(function( index ) {
         connectionsWindow_displayedDiagrams[connectionsWindow_displayedDiagrams.length]=jQuery( this ).attr("id");
     });
	 connectionsWindow_selections[0]=[];
	 connectionsWindow_selections[1]=[];
	 CW_original_styles[0]=[];
	 CW_original_styles[1]=[];
	 
	jQuery("#conWinContainer").modal({
		maxWidth: Math.round(jQuery(window).width() * 10 /10),
		maxHeight:  Math.round(jQuery(window).height() * 10 /10),
		minWidth: Math.round(jQuery(window).width() * 10 /10),
		minHeight:  Math.round(jQuery(window).height() * 10 /10)
	});
}


function colorWinLanuch(){
	jQuery("#colorWinContainer").load("?q=mdn/colorsWindow/", colorWinLanuchCallBack);
}

function colorWinLanuchCallBack(){
	
	if(jQuery("#colorWinContainer").html() == 'No Diagrams Available'){
	    alert('No diagrams are found in your site. \nYou need at least one diagram to change colors of hover, selection, and highlight');
        return;	   
	}
	
	SVGDisplayPreparation("colorWinContainerClass", sendClickToParentDocument3, sendMouseOverToParentDocument3, sendMouseOutToParentDocument3);
    var colorWindowCurrentDiagram= jQuery("#colorWinContainer svg[prepared='yes']").attr("id");
	tempFillColor = dColors[colorWindowCurrentDiagram][0];
	tempStrokeColor = dColors[colorWindowCurrentDiagram][3];	
	
	jQuery("#mdnHoverFillText").val(dColors[colorWindowCurrentDiagram][0]);
	jQuery("#mdnHoverStrokeText").val(dColors[colorWindowCurrentDiagram][3]); 
	jQuery("#mdnSelectFillText").val(dColors[colorWindowCurrentDiagram][1]);
	jQuery("#mdnSelectStrokeText").val(dColors[colorWindowCurrentDiagram][4]); 
	jQuery("#mdnHighlightFillText").val(dColors[colorWindowCurrentDiagram][2]);
	jQuery("#mdnHighlightStrokeText").val(dColors[colorWindowCurrentDiagram][5]); 
	
	jQuery("#colorWinContainer").modal({
		maxWidth: Math.round(jQuery(window).width() * 5 /10),
		maxHeight:  Math.round(jQuery(window).height() * 10 /10),
		minWidth: Math.round(jQuery(window).width() * 5 /10),
		minHeight:  Math.round(jQuery(window).height() * 10 /10)
	});
}

function showColor(theElement){
	if(theElement.id == 'testHover'){
		tempFillColor=jQuery("#mdnHoverFillText").val();
		tempStrokeColor=jQuery("#mdnHoverStrokeText").val(); 
	}
	else if(theElement.id == 'testSelect'){
		tempFillColor=jQuery("#mdnSelectFillText").val();
		tempStrokeColor=jQuery("#mdnSelectStrokeText").val(); 
	}
	else if(theElement.id == 'testHighlight'){
		tempFillColor=jQuery("#mdnHighlightFillText").val();
		tempStrokeColor=jQuery("#mdnHighlightStrokeText").val(); 
	}
}

function colorWinSave(){
	
	var args= jQuery("#colorWinSelectionList").val() + "/" + jQuery("#mdnHoverFillText").val().substring(1) + "/" + jQuery("#mdnSelectFillText").val().substring(1) + "/" + jQuery("#mdnHighlightFillText").val().substring(1) + "/" + jQuery("#mdnHoverStrokeText").val().substring(1) + "/" + jQuery("#mdnSelectStrokeText").val().substring(1) + "/" + jQuery("#mdnHighlightStrokeText").val().substring(1);
	jQuery.get("?q=mdn/saveDiagramColors/" + args, null, null);

	dColors[colorWindowCurrentDiagram][0] = jQuery("#mdnHoverFillText").val();
	dColors[colorWindowCurrentDiagram][3] = jQuery("#mdnHoverStrokeText").val(); 
	dColors[colorWindowCurrentDiagram][1] = jQuery("#mdnSelectFillText").val();
	dColors[colorWindowCurrentDiagram][4] = jQuery("#mdnSelectStrokeText").val(); 
	dColors[colorWindowCurrentDiagram][2] = jQuery("#mdnHighlightFillText").val();
	dColors[colorWindowCurrentDiagram][5] = jQuery("#mdnHighlightStrokeText").val(); 
	
    alert("Color scheme is saved");										  
}

function colorWinClose(){
	jQuery.modal.close();
}

function colorWinselectListChanged(theElement){

	jQuery("#colorWinDiagram").load("?q=mdn/getDiagram/" + jQuery('#colorWinSelectionList').val(), colorWinselectListChangedCallBack);	

    var colorWindowCurrentDiagram= jQuery("#colorWinContainer svg[prepared='yes']").attr("id");
	tempFillColor = dColors[colorWindowCurrentDiagram][0];
	tempStrokeColor = dColors[colorWindowCurrentDiagram][3];	
	
	jQuery("#mdnHoverFillText").val(dColors[colorWindowCurrentDiagram][0]);
	jQuery("#mdnHoverStrokeText").val(dColors[colorWindowCurrentDiagram][3]); 
	jQuery("#mdnSelectFillText").val(dColors[colorWindowCurrentDiagram][1]);
	jQuery("#mdnSelectStrokeText").val(dColors[colorWindowCurrentDiagram][4]); 
	jQuery("#mdnHighlightFillText").val(dColors[colorWindowCurrentDiagram][2]);
	jQuery("#mdnHighlightStrokeText").val(dColors[colorWindowCurrentDiagram][5]); 
	
}

function colorWinselectListChangedCallBack(){
	SVGDisplayPreparation("colorWinContainerClass", sendClickToParentDocument3, sendMouseOverToParentDocument3, sendMouseOutToParentDocument3);
	
}

function selectListChanged(theElement){

	if(theElement.id == 'diagramSelectionList1'){
		thisSide= 1;
		otherSide= 2;
	}
	else{
		thisSide= 2;
		otherSide= 1;
	}
	
	if(jQuery('#diagramSelectionList' + thisSide).val() == jQuery('#diagramSelectionList' + otherSide).val()){
		alert("The two sides of the window have to show different diagrams or a diagram and content");
		return;
	}
	
	
	if(jQuery('#diagramSelectionList' + thisSide).val() === 'cnt1'){
	   
	   jQuery("#conWinDiagram" + thisSide).hide();
	   jQuery("#conWinDiagram" + thisSide).removeClass("d2d").addClass("d2c");
	   jQuery("#conWinDiagram" + otherSide).removeClass("d2d").addClass("d2c");	   
	   jQuery("#conWinDiagrams").removeClass("d2d").addClass("d2c");
	   jQuery("#conWinContent").show();
	   
	   
       connectionsWindow_displayedDiagrams[thisSide-1]='cnt1';
	   connectionsWindow_selections[thisSide-1]=[];
	   CW_original_styles[thisSide-1]=[];
	}
	else{
    	jQuery("#conWinDiagram" + thisSide).load("?q=mdn/getDiagram/" + jQuery('#diagramSelectionList' + thisSide).val(), selectListChangedCallBack);	

	}
	
}

	
function selectListChangedCallBack(){
	if(connectionsWindow_displayedDiagrams[otherSide-1] != 'cnt1'){
	   jQuery("#conWinContent").hide();
	   jQuery("#conWinDiagram" + thisSide).removeClass("d2c").addClass("d2d");
	   jQuery("#conWinDiagram" + otherSide).removeClass("d2c").addClass("d2d");	   
	   jQuery("#conWinDiagrams").removeClass("d2c").addClass("d2d");
	   jQuery("#conWinDiagram" + thisSide).show();
	}
		
	SVGDisplayPreparation("conWinDiagram" + thisSide + "Class", sendClickToParentDocument2, sendMouseOverToParentDocument2, sendMouseOutToParentDocument2);
    
	jQuery("#conWinDiagram" + thisSide + " svg").each(function( index ) {
         connectionsWindow_displayedDiagrams[thisSide-1]=jQuery( this ).attr("id");
    });

	connectionsWindow_selections[thisSide-1]=[];
	CW_original_styles[thisSide-1]=[];
}



function fullScreen(){
	jQuery(".svgContainer").each(function(index){
		
		jQuery(this).removeClass("mdnMediumScreen").addClass("mdnFullScreen");
	});
	
	jQuery("#mdnContainer").modal({
		maxWidth: Math.round(jQuery(window).width() * 7 /10),
		maxHeight:  Math.round(jQuery(window).height() * 7 /10),
		minWidth: Math.round(jQuery(window).width() * 7 /10),
		minHeight:  Math.round(jQuery(window).height() * 7 /10),
		
		persist:true,
		onClose: function (dialog){
		   	jQuery(".svgContainer").each(function(index){
		       jQuery(this).removeClass("mdnFullScreen").addClass("mdnMediumScreen");
	        });
		   jQuery.modal.close();	
		}
		
	});

}

function getIndexOfElement(arr, viewId, elemId){
    for(var i=0; i<arr.length; i++){
        if (arr[i][0] === viewId && arr[i][1] === elemId){
            return i;
        }
    }
	return -1;
}

function svgElementClicked(theElement){

	if(svgElementHasConnections === false) // variable is set in mouseover. svg element has no connections 
		return;                            // to visual nor content elements -> element is not clickable(selectable)
	
	var IDs = getViewElementIDs(theElement.id);		
	
	var elemIndex = getIndexOfElement(visualElements, IDs[0], IDs[1]); // 
	if(elemIndex === -1) //element must exist in visualElements since svgElementHasConnections = true
		return;
	
	var elemId = visualElements[elemIndex][0] + '_' + visualElements[elemIndex][1];
	
	var otherElements = getRelatedVisualElements(theElement.id); // in displayed or hidden diagrams
	//be aware that otherElements may be empty of the current element is only related to content elements
	
	if(visualElements[elemIndex][6] === 0 || visualElements[elemIndex][6] === 2){ //element is unselected or highlighted
	    changeStyle('', elemId,'select',0);
		visualElements[elemIndex][6]=1; //element is selected now
        flagKeepColor=true; // in mouseOut, do not change element style
       
	    for(i=0;i<otherElements.length;i++){ 
			if(visualElements[otherElements[i]][6] === 0){ // related element is currently regular
				//change to green
				changeStyle('', '','highlight',otherElements[i]);
				visualElements[otherElements[i]][6]=2; //change element to highlighted
				visualElements[otherElements[i]][7]=1; // highlighting count
				
				ind = getIndexOfElement(relatedHighlightedElements,visualElements[otherElements[i]][0],visualElements[otherElements[i]][1]);
				relatedHighlightedElements[ind][6]=true; // flagKeepColor for this element so in mouseout it is not changed back to its style before the mouse entered the element
			}
			else if(visualElements[otherElements[i]][6] === 1){ // element is currently selected
				//no change to style
				visualElements[otherElements[i]][7] += 1; // highlighting count
			}
			else if(visualElements[otherElements[i]][6] === 2){ // element is currently highlighetd
				//no change to style
				visualElements[otherElements[i]][7] += 1; // highlighting count
			}
		}		
	}
	else{ //element is selected -> unselect
	    if(visualElements[elemIndex][7] === 0){ // current element highlight count = 0 --> change to regular
		   changeStyle('', elemId,'regular',elemIndex); 	
		   visualElements[elemIndex][6]=0; //element is regular now		   
		}else{ // current element highlight count > 0 --> change to highlighted
		   changeStyle('', elemId,'highlight',elemIndex);
           visualElements[elemIndex][6]=2; //element is highlighted now		   
		}
		flagKeepColor= true;
		
		for(i=0;i<otherElements.length;i++){
		   if(visualElements[otherElements[i]][6] === 1){  //selected -> decrease highlighted
			   visualElements[otherElements[i]][7] -= 1;
		   }
		   else if(visualElements[otherElements[i]][6] === 2){ //highlighted -> decrease highlight count, if 0 -> change to regular		 
			       visualElements[otherElements[i]][7] -= 1;
			       if(visualElements[otherElements[i]][7] === 0){
				       visualElements[otherElements[i]][6]=0;
				      changeStyle('','regular',otherElements[i]);
				   
				      ind = getIndexOfElement(relatedHighlightedElements,visualElements[otherElements[i]][0],visualElements[otherElements[i]][1]);
				      relatedHighlightedElements[ind][6]=true; // flagKeepColor for this element so in mouseout it is not changed back to its style before the mouse entered the element
			       }
		   }
             
		}
		
	    
	}
			
}

function ConnectionsWindow_svgElementClicked(theElement){

	var IDs = getViewElementIDs(theElement.id);		
	var side;
	
	if(connectionsWindow_displayedDiagrams[0]==IDs[0])
	   side =0;
    else if(connectionsWindow_displayedDiagrams[1]==IDs[0])
	   side =1;
    else
       return; //error		
    
	
	var ind = connectionsWindow_selections[side].indexOf(IDs[1]);
    if(ind < 0){ // element is not selected
	    if(connectionsWindow_displayedDiagrams[1-side] == 'cnt1'){
			prepareVE2CEConnections(IDs[0],IDs[1],side);
		}
	    var location = connectionsWindow_selections[side].length;
		connectionsWindow_selections[side][location]=IDs[1];
		CW_original_styles[side][location]= [CurrentHoverFill,
											 CurrentHoverStroke,
											 CurrentHoverStrokeWidth,
											 CurrentHoverOpacity];

		changeStyle(con_window_class, IDs[0] + '_' + IDs[1],'select',0);
	}
	else{  // element is already selected, delete it from selection
	   jQuery(con_window_class + " #" + theElement.id).css("fill",CW_original_styles[side][ind][0])
		                          .css("stroke",CW_original_styles[side][ind][1])
		                          .css("stroke-width",CW_original_styles[side][ind][2])
							   	  .css("opacity",CW_original_styles[side][ind][3]);
	   connectionsWindow_selections[side].splice(ind, 1);
       CW_original_styles[side].splice(ind, 1);	   
	}

	flagKeepColor = true;	
	
}

function prepareVE2CEConnections(viewId, elementId, side){
	clearSide(side);
	jQuery("#connectedNodes").html('');
	jQuery("#connectedNodes").load("?q=mdn/nodeTitles/" + viewId + "/" + elementId, prepareVE2CEConnectionsCallback);
}

function prepareVE2CEConnectionsCallback(){
	jQuery("#textBoxNodeEntry").attr('disabled',false);
}

function CreateConnection(){

	if(connectionsWindow_selections[0].length <=0 || connectionsWindow_selections[1].length <=0){
		alert("you need to select at least one element in each diagram. Selection can be made by clicking diagram elements such as squares and ovals");
		return;
	}

	if(connectionsWindow_selections[0].length >1 && connectionsWindow_selections[1].length >1){
		alert("Multiple selections are found in both diagrams. S One diagram can have only one selection, the other diagram can have multiple selections");
		return;
	}

	var newConnections=0;
	var oldConnections=0;
	
	for(i=0; i< connectionsWindow_selections[0].length; i++){
		for(j=0; j< connectionsWindow_selections[1].length; j++){
		   	
			var result = jQuery.grep(Drupal.settings.connections, function(v,k) {
               return ((v[0] === connectionsWindow_displayedDiagrams[0] && v[1] === connectionsWindow_selections[0][i] 
			        && v[2] === connectionsWindow_displayedDiagrams[1] && v[3] === connectionsWindow_selections[1][j])
					||
					(v[2] === connectionsWindow_displayedDiagrams[0] && v[3] === connectionsWindow_selections[0][i] 
			        && v[0] === connectionsWindow_displayedDiagrams[1] && v[1] === connectionsWindow_selections[1][j]) );
              }); 
					 
			if(result.length <= 0){ // save new connection
                 Drupal.settings.connections[Drupal.settings.connections.length]=[connectionsWindow_displayedDiagrams[0],
				                                                                  connectionsWindow_selections[0][i],
				                                                                  connectionsWindow_displayedDiagrams[1],
				                                                                  connectionsWindow_selections[1][j]];
																				  
		         jQuery.get("?q=mdn/createConnection/" + connectionsWindow_displayedDiagrams[0] 
		                                         + "/" + connectionsWindow_selections[0][i]
												 + "/" + connectionsWindow_displayedDiagrams[1]
												 + "/" + connectionsWindow_selections[1][j], null, null);
				newConnections++;								 
			}
            else { // conneciton already exists
				oldConnections++;
			}
		    									 
	    }
	}
	
	jQuery("#connectionWindowStatus").html(newConnections + " connection(s) saved, " + oldConnections + " already exist(s)");

}

function DeleteConnection(){
	if(connectionsWindow_selections[0].length <=0 || connectionsWindow_selections[1].length <=0){
		alert("you need to select at least one element in each diagram. Selection can be made by clicking diagram elements such as squares and ovals");
		return;
	}

	if(connectionsWindow_selections[0].length >1 && connectionsWindow_selections[1].length >1){
		alert("Multiple selections are found in both diagrams. S One diagram can have only one selection, the other diagram can have multiple selections");
		return;
	}

	var deletedConnections=0;
	var notFoundConnections=0;
	
	for(i=0; i< connectionsWindow_selections[0].length; i++){
		for(j=0; j< connectionsWindow_selections[1].length; j++){
			
			var ind=-1;
			for(var k=0; k< Drupal.settings.connections.length; k++){
		       if((Drupal.settings.connections[k][0] === connectionsWindow_displayedDiagrams[0] 
			    && Drupal.settings.connections[k][1] === connectionsWindow_selections[0][i] 
			    && Drupal.settings.connections[k][2] === connectionsWindow_displayedDiagrams[1] 
				&& Drupal.settings.connections[k][3] === connectionsWindow_selections[1][j])
				||
				  (Drupal.settings.connections[k][2] === connectionsWindow_displayedDiagrams[0] 
			    && Drupal.settings.connections[k][3] === connectionsWindow_selections[0][i] 
			    && Drupal.settings.connections[k][0] === connectionsWindow_displayedDiagrams[1] 
				&& Drupal.settings.connections[k][1] === connectionsWindow_selections[1][j]) ){
					                                              // connection in Drupal.settings.connections
					Drupal.settings.connections.splice(k,1);
					jQuery.get("?q=mdn/deleteConnection/" + connectionsWindow_displayedDiagrams[0] 
		                                         + "/" + connectionsWindow_selections[0][i]
												 + "/" + connectionsWindow_displayedDiagrams[1]
												 + "/" + connectionsWindow_selections[1][j], null, null);
					deletedConnections++;
					break;
				}
				else{
					notFoundConnections++;
				}
	        
			}       
			
			
		}
	}

    jQuery("#connectionWindowStatus").html(deletedConnections + " connection(s) deleted");
	
}

function c2dConnection(){

    var textVal = jQuery("#textBoxNodeEntry").val();
	if(textVal ==''){
		alert("Please select a node to connect a diagram element to");
		return;
	}
	
	var otherSide;
	if(connectionsWindow_displayedDiagrams[0]=='cnt1'){
		otherSide = 1;
	}
	else{
		otherSide = 0;
	}
	
	if(connectionsWindow_selections[otherSide].length < 1){
		alert("Please select a diagram element to connect it to a drupal node");
		return;
	}
	if(connectionsWindow_selections[otherSide].length > 1){
		alert("Please select only one diagram element to connect it to a drupal node");
		return;
	}
	
	jQuery.get("?q=mdn/hover/" + connectionsWindow_displayedDiagrams[otherSide] + "/" + connectionsWindow_selections[otherSide][0] + "/" + textVal, null, c2dConnectionCallback);


}

function c2dConnectionCallback(response){
   	var nid = jQuery.parseJSON(response);
	if(nid.mdn_nid == 'title not found'){
		alert("error, connection was not saved: node title was not found");
		return;
	}
	
    var nodeEntry = '<div id="nid_' + nid.mdn_nid + '">' 
                   + '<button type="submit" value="Submit" class="mdnButton" onClick="deleteVE2CEConnection(' + nid.mdn_nid + ');">delete Connection</button>'				
				      + '<span>' + jQuery("#textBoxNodeEntry").val() + '</span>'
				   + '</div>';	
	
		
    jQuery("#connectedNodes").prepend(nodeEntry);
	jQuery("#textBoxNodeEntry").val('');
	
}

function deleteVE2CEConnection(nid){
	
	var otherSide;
	if(connectionsWindow_displayedDiagrams[0]=='cnt1'){
		otherSide = 1;
	}
	else{
		otherSide = 0;
	}
	
	if(connectionsWindow_selections[otherSide].length < 1){
		alert("Please select a diagram element to in order to delete a connection");
		return;
	}
	if(connectionsWindow_selections[otherSide].length > 1){
		alert("Please select only one diagram element to delete a connection");
		return;
	}
	
	jQuery.get("?q=mdn/deleteConnection/" + connectionsWindow_displayedDiagrams[otherSide] 
	                                      + "/" + connectionsWindow_selections[otherSide][0]
										 + "/" + 'cnt1'
										 + "/" + nid, null, null);
    
    jQuery("#nid_" + nid).remove();	
	
}

function ClearLeftSide(){
	clearSide(0);
}

function ClearRightSide(){
	clearSide(1);
}

function clearSide(side){
	for(var i=0;i<connectionsWindow_selections[side].length;i++){
 	    jQuery(con_window_class + " #" + connectionsWindow_displayedDiagrams[side] + '_' + connectionsWindow_selections[side][i])
		                          .css("fill",CW_original_styles[side][i][0])
		                          .css("stroke",CW_original_styles[side][i][1])
		                          .css("stroke-width",CW_original_styles[side][i][2])
							   	  .css("opacity",CW_original_styles[side][i][3]);
	
	}
	connectionsWindow_selections[side].length=0;
	CW_original_styles[side].length=0;	 
}

function relatedVisualElementsInDisplayedDiagrams(diagramsArr, viewId, elementId){
	var result=[];
	var relatedElements=[];
	var view;
	for(i=0; i < diagramsArr.length;i++){
		 if(diagramsArr[i] === viewId)
            continue;
		
		 view = diagramsArr[i];
		 relatedElements = jQuery.grep(Drupal.settings.connections, function(v,i) {
           return (v[0] === viewId && v[1] === elementId && v[2] === view);
         });
		 
		 for(j=0 ; j<relatedElements.length ; j++){
			 result[result.length]=[relatedElements[j][2], relatedElements[j][3]];
		 }

		 relatedElements = jQuery.grep(Drupal.settings.connections, function(v,i) {
           return (v[2] === viewId && v[3] === elementId  && v[0] === view);
         });
		 for(j=0 ; j<relatedElements.length ; j++){
			 result[result.length]=[relatedElements[j][0], relatedElements[j][1]];		 
	     }		 
	}
	
	return result;
}
   

function ColorWindow_svgElementMouseOver(theElement){
	var IDs = getViewElementIDs(theElement.id);						  

    CurrentHoverFill= jQuery(color_window_class + " #" + theElement.id).css("fill"); 
    CurrentHoverStroke= jQuery(color_window_class + " #" + theElement.id).css("stroke"); 
    CurrentHoverStrokeWidth= jQuery(color_window_class + " #" + theElement.id).css("stroke-width"); 
    CurrentHoverOpacity=jQuery(color_window_class + " #" + theElement.id).css("opacity");  

    jQuery(color_window_class + " #" + theElement.id).css("fill",tempFillColor).css("stroke",tempStrokeColor)
	                      .css("stroke-width",rect.selectstroke_width).css("opacity","1");
}

function ConnectionsWindow_svgElementMouseOver(theElement){
	var IDs = getViewElementIDs(theElement.id);						  

    CurrentHoverFill= jQuery(con_window_class + " #" + theElement.id).css("fill"); 
    CurrentHoverStroke= jQuery(con_window_class + " #" + theElement.id).css("stroke"); 
    CurrentHoverStrokeWidth= jQuery(con_window_class + " #" + theElement.id).css("stroke-width"); 
    CurrentHoverOpacity=jQuery(con_window_class + " #" + theElement.id).css("opacity");  
		
	changeStyle(con_window_class, theElement.id,'hover',0);		
		
    flagKeepColor = false; // after mouseover, if mouseclick is fired and element style is changed
                               // this flag will equal true so mouseout will not restore element style		
	
    var otherDiagram;
	if(connectionsWindow_displayedDiagrams[0]==IDs[0]){
		otherDiagram=connectionsWindow_displayedDiagrams[1];
	}
	else{
		otherDiagram=connectionsWindow_displayedDiagrams[0];
	}
	
	if(otherDiagram == 'cnt1'){
		relatedHighlightedElements.length=0;
		return;
	}
	
	//search for related visual elements in displayed diagrams
	var relVisDispElems = relatedVisualElementsInDisplayedDiagrams(connectionsWindow_displayedDiagrams, IDs[0], IDs[1]);
		
	//save style for related elements in other diagrams so we can restore the style in mouseout
    relatedHighlightedElements.length=0; 
    for( var i = 0, len = relVisDispElems.length; i < len; i++ ) {
		otherId = relVisDispElems[i][0] + '_' + relVisDispElems[i][1];
	    relatedHighlightedElements[relatedHighlightedElements.length]= [relVisDispElems[i][0],
		                                                                relVisDispElems[i][1],
		                                                    jQuery(con_window_class + " #" + otherId).css("fill"),
															jQuery(con_window_class + " #" + otherId).css("stroke"),
															jQuery(con_window_class + " #" + otherId).css("stroke-width"),
														    jQuery(con_window_class + " #" + otherId).css("opacity"),
															false]; // flagKeepColor for this element
																		
	    changeStyle(con_window_class, otherId, 'hover',0);
	} // end for
}

function svgElementMouseOver(theElement){

    var IDs = getViewElementIDs(theElement.id);						  

    var relatedElements = jQuery.grep(visualElements, function(v,i) { // if element is in visualElements then this element has 
           return (v[0] === IDs[0] && v[1] === IDs[1]);              // we make it hoverable and clickable   
    });
   
	if(relatedElements.length <= 0){
		svgElementHasConnections = false;	
	}
	else{ // element has connections to elements (visual in displayed and hidden diagrams, or content elements) 
	                            	// -> do highlighting  (this indicates the element is clickable (selectable))
		svgElementHasConnections = true;						
     	CurrentHoverFill= jQuery("#" + theElement.id).css("fill"); 
	    CurrentHoverStroke= jQuery("#" + theElement.id).css("stroke"); 
	    CurrentHoverStrokeWidth= jQuery("#" + theElement.id).css("stroke-width"); 
	    CurrentHoverOpacity=jQuery("#" + theElement.id).css("opacity");  
		
		changeStyle('', theElement.id,'hover',0);		
		
        flagKeepColor = false; // after mouseover, if mouseclick is fired and element style is changed
                               // this flag will equal true so mouseout will not restore element style		
		
		//search for related visual elements in displayed diagrams
		var relVisDispElems = relatedVisualElementsInDisplayedDiagrams(displayedDiagrams, IDs[0], IDs[1]);
		
		//save style for related elements in other diagrams so we can restore the style in mouseout
        relatedHighlightedElements.length=0; 
		for( var i = 0, len = relVisDispElems.length; i < len; i++ ) {
			otherId = relVisDispElems[i][0] + '_' + relVisDispElems[i][1];
		    relatedHighlightedElements[relatedHighlightedElements.length]= [relVisDispElems[i][0],
			                                                                relVisDispElems[i][1],
		                                                    jQuery("#" + otherId).css("fill"),
															jQuery("#" + otherId).css("stroke"),
															jQuery("#" + otherId).css("stroke-width"),
														    jQuery("#" + otherId).css("opacity"),
															false]; // flagKeepColor for this element
																		
		    changeStyle('', otherId, 'hover',0);
		} // end for
		
    } // end element has connections

} // end mouseover event

function getRelatedVisualElements(elementId){
	
	var IDs = getViewElementIDs(elementId);						  

    var result = jQuery.grep(Drupal.settings.connections, function(v,i) {
           return (v[0] === IDs[0] && v[1] === IDs[1] && v[2] != 'cnt1') || (v[2] === IDs[0] && v[3] === IDs[1]  && v[0] != 'cnt1');
    });
	
	var arr=[];
	var otherIndex;
	for( var i = 0, len = result.length; i < len; i++ ) {
		if(result[i][0] === IDs[0]){
			otherView =result[i][2];
			otherElement = result[i][3];
		}
		else{
			otherView =result[i][0];
			otherElement = result[i][1];
		}
       	otherIndex = getIndexOfElement(visualElements, otherView, otherElement);
		if(otherIndex != -1)
           arr[arr.length]= otherIndex;			
	}
	
	return arr;
}

function getViewElementIDs(elementId){
   var res = elementId.split('_');
   return res;	
}

function changeStyle(ParentSelector, elementId, newStyle, elementIndex){
  if(elementId === '')
     elementId = visualElements[elementIndex][0] + '_' + visualElements[elementIndex][1]; 	  
  if(ParentSelector != '')
	  ParentSelector = ParentSelector + ' ';
 
  var IDs = getViewElementIDs(elementId);	
 
  if(newStyle === 'select'){
	 jQuery(ParentSelector + "#" + elementId).css("fill",dColors[IDs[0]][1]).css("stroke",dColors[IDs[0]][4])
	                      .css("stroke-width",rect.selectstroke_width).css("opacity","1");
  }
  else if(newStyle === 'highlight'){
	 jQuery(ParentSelector + "#" + elementId).css("fill",dColors[IDs[0]][2]).css("stroke",dColors[IDs[0]][5])
	                      .css("stroke-width",rect.highlightstroke_width).css("opacity","1");
  }
  else if(newStyle === 'hover'){
	 jQuery(ParentSelector + "#" + elementId).css("fill",dColors[IDs[0]][0]).css("stroke",dColors[IDs[0]][3])
	                      .css("stroke-width",rect.hoverstroke_width).css("opacity","1");
  }
  else if(newStyle === 'regular'){
	 jQuery(ParentSelector + "#" + elementId).css("fill",visualElements[elementIndex][2])
	                        .css("stroke",visualElements[elementIndex][3])
	                        .css("stroke-width",visualElements[elementIndex][4])
							.css("opacity",visualElements[elementIndex][5]);
  }

}



function svgElementMouseOut(theElement){
	if(svgElementHasConnections === false)
		return;

	if(flagKeepColor === false) // if color was not changed in mouseclick
		      jQuery("#" + theElement.id).css("fill",CurrentHoverFill).css("stroke",CurrentHoverStroke)
		                                 .css("stroke-width",CurrentHoverStrokeWidth).css("opacity",CurrentHoverOpacity);

    if(relatedHighlightedElements.length > 0){ // element has connections in displayed diagrams
       //restore style 							     
       for(i=0;i<relatedHighlightedElements.length;i++){
		   if(relatedHighlightedElements[i][6] === false) // if related element color was not changed in mouseclick
		           jQuery("#" + relatedHighlightedElements[i][0] + '_' + relatedHighlightedElements[i][1])
		                                       .css("fill",relatedHighlightedElements[i][2])
		                                       .css("stroke",relatedHighlightedElements[i][3])
		                                       .css("stroke-width",relatedHighlightedElements[i][4])
							   				   .css("opacity",relatedHighlightedElements[i][5]);
	   }
       relatedHighlightedElements.length=0;	   
	}
	CurrentHoverElement="";
}	

function ConnectionsWindow_svgElementMouseOut(theElement){

	if(flagKeepColor === false) // if color was not changed in mouseclick
		      jQuery(con_window_class + " #" + theElement.id).css("fill",CurrentHoverFill).css("stroke",CurrentHoverStroke)
		                                 .css("stroke-width",CurrentHoverStrokeWidth).css("opacity",CurrentHoverOpacity);

    if(relatedHighlightedElements.length > 0){ // element has connections in displayed diagrams
       //restore style 							     
       for(i=0;i<relatedHighlightedElements.length;i++){
		   if(relatedHighlightedElements[i][6] === false) // if related element color was not changed in mouseclick
		           jQuery(con_window_class + " #" + relatedHighlightedElements[i][0] + '_' + relatedHighlightedElements[i][1])
		                                       .css("fill",relatedHighlightedElements[i][2])
		                                       .css("stroke",relatedHighlightedElements[i][3])
		                                       .css("stroke-width",relatedHighlightedElements[i][4])
							   				   .css("opacity",relatedHighlightedElements[i][5]);
	   }
       relatedHighlightedElements.length=0;	   
	}
	CurrentHoverElement="";
}

function ColorWindow_svgElementMouseOut(theElement){

    jQuery(color_window_class + " #" + theElement.id).css("fill",CurrentHoverFill).css("stroke",CurrentHoverStroke)
		                                 .css("stroke-width",CurrentHoverStrokeWidth).css("opacity",CurrentHoverOpacity);

}


function relatedContent(){

	var	selectedElements = jQuery.grep(visualElements, function(v,i) {
        return (v[6] === 1);     
    });
	
    if(selectedElements.length <= 0){
		alert("No selected elements");
		return;
	}
	
	var par ='';
	for(var i=0; i<selectedElements.length;i++){
		if(i==0)
		   par = par + selectedElements[i][0] + '_' + selectedElements[i][1];
	    else
		   par = par + '_' + selectedElements[i][0] + '_' + selectedElements[i][1];	
	}
	
	jQuery("#content").load("?q=mdn/get/ajax/" + par);
	console.log(par);
}

function sendClickToParentDocument(evt)
	{
		var target = evt.currentTarget;
		if(target.correspondingUseElement)
			target = target.correspondingUseElement;

		if (parent.svgElementClicked)
			parent.svgElementClicked(target); // after finishing svg loader and identifier, I will have svg id embedded in each element id 
	}

function sendClickToParentDocument2(evt)
	{
		var target = evt.currentTarget;
		if(target.correspondingUseElement)
			target = target.correspondingUseElement;
        
		
        if (parent.ConnectionsWindow_svgElementClicked)
			parent.ConnectionsWindow_svgElementClicked(target); // after finishing svg loader and identifier, I will have svg id embedded in each element id 
	}

function sendClickToParentDocument3(evt)
	{
      return;
	}

	
function sendMouseOverToParentDocument(evt)
	{
	  var target = evt.currentTarget;
	  if(target.correspondingUseElement)
		  target = target.correspondingUseElement;
      
      if (window.parent.svgElementMouseOver)
		  window.parent.svgElementMouseOver(target);

	}

	function sendMouseOverToParentDocument2(evt)
	{
	  var target = evt.currentTarget;
	  if(target.correspondingUseElement)
		  target = target.correspondingUseElement;
      
      if (window.parent.ConnectionsWindow_svgElementMouseOver)
		  window.parent.ConnectionsWindow_svgElementMouseOver(target);

	}


	function sendMouseOverToParentDocument3(evt)
	{
	  var target = evt.currentTarget;
	  if(target.correspondingUseElement)
		  target = target.correspondingUseElement;
      
      if (window.parent.ColorWindow_svgElementMouseOver)
		  window.parent.ColorWindow_svgElementMouseOver(target);

	}
	
	function sendMouseOutToParentDocument(evt)
	{
	  var target = evt.currentTarget;
	  if(target.correspondingUseElement)
		  target = target.correspondingUseElement;
      
      if (window.parent.svgElementMouseOut)
		  window.parent.svgElementMouseOut(target);
	}	

	function sendMouseOutToParentDocument2(evt)
	{
	  var target = evt.currentTarget;
	  if(target.correspondingUseElement)
		  target = target.correspondingUseElement;
      
      if (window.parent.ConnectionsWindow_svgElementMouseOut)
		  window.parent.ConnectionsWindow_svgElementMouseOut(target);
	}		

	function sendMouseOutToParentDocument3(evt)
	{
	  var target = evt.currentTarget;
	  if(target.correspondingUseElement)
		  target = target.correspondingUseElement;
      
      if (window.parent.ColorWindow_svgElementMouseOut)
		  window.parent.ColorWindow_svgElementMouseOut(target);
	}			

jQuery(document).ready(function($) {
	 SVGDisplayPreparation("svgContainer", sendClickToParentDocument, sendMouseOverToParentDocument, sendMouseOutToParentDocument);
	 var elemId='';
	 for (var i=0;i<Drupal.settings.visualElements.length;i++){
        elemId ="#" + Drupal.settings.visualElements[i][0] + '_' + Drupal.settings.visualElements[i][1];
		visualElements[i]=[Drupal.settings.visualElements[i][0],
		                   Drupal.settings.visualElements[i][1],
		                   jQuery(elemId).css("fill"),
		                   jQuery(elemId).css("stroke"),
		                   jQuery(elemId).css("stroke-width"),
		                   jQuery(elemId).css("opacity"),
		                   0,0]; // [0] = viewid, [1] = elementId, [6] = status (0 unselected, 1 selected, 2 highlighted), 
						         // [7] number of highlighting requests made by other elements
	 }
	 
	 userDataArr = Drupal.settings.userData;
	 layout = Drupal.settings.LayoutNoOfDiagrams;
	 dColors = Drupal.settings.diagram_colors;
	 
	 displayedDiagrams.length=0;
	 jQuery(".svgContainer svg[prepared='yes']").each(function( index ) {
         displayedDiagrams[displayedDiagrams.length]=jQuery( this ).attr("id");
     });
	 
	  jQuery(".svgContainer").each(function( index ) {
 	    if(layout==1){
	         jQuery( this ).removeClass("mdnDoubleLayout");
	         jQuery( this ).addClass("mdnSingleLayout");
	     }
	     else if (layout == 2){
 	         jQuery( this ).removeClass("mdnSingleLayout");
	         jQuery( this ).addClass("mdnDoubleLayout");
	     }
      });
});

function SVGDisplayPreparation(containerClass, clickFunction, mouseoverFunction, mouseoutFunction){
	
     var arrParents = document.getElementsByClassName(containerClass);
	 for(var j = 0; j < arrParents.length; j++){
	    var arr = arrParents[j].getElementsByTagName("path");	 
	   
	   	for (var i = 0; i < arr.length; i++) { 
  	       arr[i].addEventListener("click", clickFunction, false);
	       arr[i].addEventListener("mouseover", mouseoverFunction, false);
	       arr[i].addEventListener("mouseout", mouseoutFunction, false);
	    }
	   
	   	arr = arrParents[j].getElementsByTagName("ellipse");
	    for (var i = 0; i < arr.length; i++) { 
	      arr[i].addEventListener("click", clickFunction, false);
	      arr[i].addEventListener("mouseover", mouseoverFunction, false);
	      arr[i].addEventListener("mouseout", mouseoutFunction, false);
	    }
	 }

     jQuery("." + containerClass + " svg[hide_elements='1'] path").css("opacity","0");
	 jQuery("." + containerClass + " svg[hide_elements='1'] ellipse").css("opacity","0");
	 jQuery("." + containerClass + " text").css("pointer-events","none");
}
