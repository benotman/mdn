//(function ($) {
	//var CurrentHoverElement=""; 
	var CurrentHoverFill; 
    var CurrentHoverStroke; 
	var CurrentHoverOpacity;  
	var CurrentHoverStrokeWidth;
	var relatedHighlightedElements=[];
	var eventCounter=0;
	
	var visualElements = []; // All visual elements in all diagram; includes elements having at least one connection(to visual or content element)
                             // This is a key data structure where we keep track of element orignial style, status (regular, selected, highlighted)
							 // , and number of highlighting requests for the element (made by other elements)
	var svgElementHasConnections=false;
	var flagKeepColor = false;
	var displayedDiagrams=[]; // displayed diagrams for main window
	var connectionsWindow_displayedDiagrams =[]; // // displayed diagrams for connections window
	var connectionsWindow_selections=[];
	var con_window_class =".connectionsSVGContainer"; 
	var CW_original_styles = [];
	
	var thisSide=0;
	
	var layout;
	
    var rect = {
   'hoverfill': "rgba(235,131,22,1)",
   'hoverstroke': "rgba(184,16,16,1)",
   'hoverstroke_width': "1.0px",

   'highlightfill': "rgba(113,207,51,1)",
   'highlightstroke': "rgba(113,207,51,1)",
   'highlightstroke_width': "1.0px",

   'selectfill': "rgba(49,96,62,1)",
   'selectstroke': "rgba(116,88,36,1)",
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
	/*
	 create a list of diagrams
	 check if selected is less than layout
        error
     if selected is more 
        error
     else same
    	change current diagrams_list	 
	*/
	/*
	if # of selected < LayoutNoOfDiagrams
       if # of selected < NoOfDiagrams
         error
	     return (stay in the same screen)
       else
         OK
	     change LayoutNoOfDiagrams = # of selected
    if # of selected > LayoutNoOfDiagrams	  
       error
       return (stay in the same screen)
	*/
	var count=0;
	var diagramArr =[];
	for (var i=0; i<Drupal.settings.NoOfDiagrams;i++){
		if(jQuery('#' + 'checkbox_' + i).is(':checked')){
			count +=1;
			diagramArr[diagramArr.length] = jQuery('#' + 'checkbox_' + i).attr("nid");
		}
	}
	
	/*
	 if(count >2)
		 error
	 else if 1
	    layout = 1
		CurrentDiagrams = 
	 else if 2
	 
	 else 0
	 
	 onload
	   I will get 0, 1, 2
	   0 to 1 ok, 0 to 2 ok
	   1 to 2 ok, 1 to 0 ok
		 
	*/
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
   /*
   get all svg ids
   add them to displayedDiagrams
   get all selected, highlighted in current diagrams and change them
   */   
    displayedDiagrams.length=0;
	var relatedElements=[];
    jQuery("svg[prepared='yes']").each(function( index ) {
       //console.log( index + ": " + jQuery( this ).attr("id") );
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


function heatmap(){

  for (var i=0;i<Drupal.settings.heatmap.length;i++){
	  
	  var minCount = Drupal.settings.heatmapMin;
	  var maxCount = Drupal.settings.heatmapMax;
	  console.log("MinHeatmap =" + Drupal.settings.heatmapMin + " MaxHeatmap =" + Drupal.settings.heatmapMax)
	  var value = ((Drupal.settings.heatmap[i][1] - minCount) / (maxCount - minCount));
	  var aR = 255;   var aG = 255; var aB=255;  // RGB for our 1st color (blue in this case).
      var bR = 0; var bG = 0; var bB=0;    // RGB for our 2nd color (red in this case).
 
      var red   = (bR - aR) * value + aR;      // Evaluated as -255*value + 255.
      var green = (bG - aG) * value + aG;      // Evaluates as 0.
      var blue  = (bB - aB) * value + aB;      // Evaluates as 255*value + 0.
	 // console.log(Math.round(red) + ' ' + Math.round(green) + ' ' + Math.round(blue));
	  var newRGB = 'rgba(' + Math.round(red) + ',' + Math.round(green) + ',' + Math.round(blue) + ',255)';
	  //var newRGB = 'rgba(' + Math.round(red) + ',' + 0 + ',' + 0 + ',1)';
	  if(Drupal.settings.heatmap[i][2] == 'AGView')
	      jQuery("#" + "svg1_" + Drupal.settings.heatmap[i][0]).css("fill",newRGB);
	  else
		  jQuery("#" + "svg2_" + Drupal.settings.heatmap[i][0]).css("fill",newRGB).css("opacity","1"); 
	  
	  //console.log(Drupal.settings.heatmap[i][0] + " " + newRGB);
  }
	
}

var userDataCounter=-1;
var userDataArr;

function userData(){
	
	if(userDataCounter >= userDataArr.length){
		alert("end browsing");
		return;
	}
	
	var viewid='';
	if(userDataCounter>=0){
		if(userDataArr[userDataCounter][1] == 'AGView'){
		   changeStyle('', + 'svg1' + '_' + userDataArr[userDataCounter][2],'regular',0);	
		}
		else if(userDataArr[userDataCounter][1] == 'TreeView'){
		   changeStyle('', + 'svg2' + '_' + userDataArr[userDataCounter][2],'regular',0);		
		}
	}
	
   userDataCounter++;	
   if(userDataArr[userDataCounter][3] == 'click'){
      if(userDataArr[userDataCounter][1] == 'AGView'){
	      changeStyle('', 'svg1' + '_' + userDataArr[userDataCounter][2],'select',0); 
      }
	  else if(userDataArr[userDataCounter][1] == 'TreeView'){
		  changeStyle('', 'svg2' + '_' + userDataArr[userDataCounter][2],'select',0); 
	  }
   }
   else if(userDataArr[userDataCounter][3] == 'hover' || userDataArr[userDataCounter][3] == 'hoverout'){
      if(userDataArr[userDataCounter][1] == 'AGView'){
	      changeStyle('', 'svg1' + '_' + userDataArr[userDataCounter][2],'highlight',0); 
      }
	  else if(userDataArr[userDataCounter][1] == 'TreeView'){
		  changeStyle('', 'svg2' + '_' + userDataArr[userDataCounter][2],'highlight',0); 
	  }
   }
   else if(userDataArr[userDataCounter][3] == 'page_lookup') {
	   alert("page lookup " + userDataArr[userDataCounter][2]);
   } 	
   
   
}

function displayDiagramBrowser(){
	jQuery("#diagramBrowser").modal({
		maxWidth:1000,
		maxHeight:500
	});
}

function connectionsLanuch(){
	jQuery("#connectionsWindow").load("?q=mdn/connectionsWindow/", connectionsLanuchCallBack);
}

function connectionsLanuchCallBack(){
	//console.log("test" + jQuery("#connectionsWindow").html());
	
	if(jQuery("#connectionsWindow").html() == 'No Diagrams Available'){
	    alert('No diagrams are found in your site. \nYou need at least one diagram to start connecting diagram elements to Drupal nodes. In case of diagram to diagram connections, you need at leaast two diagrams');
        return;	   
	}
	
    SVGDisplayPreparation("connectionsSVGContainer", sendClickToParentDocument2, sendMouseOverToParentDocument2, sendMouseOutToParentDocument2);

	connectionsWindow_displayedDiagrams.length=0;
	 jQuery(".connectionsSVGContainer svg[prepared='yes']").each(function( index ) {
         connectionsWindow_displayedDiagrams[connectionsWindow_displayedDiagrams.length]=jQuery( this ).attr("id");
     });
	 connectionsWindow_selections[0]=[];
	 connectionsWindow_selections[1]=[];
	 CW_original_styles[0]=[];
	 CW_original_styles[1]=[];
	 
	jQuery("#bb").modal({
		maxWidth: Math.round(jQuery(window).width() * 10 /10),
		maxHeight:  Math.round(jQuery(window).height() * 10 /10),
		minWidth: Math.round(jQuery(window).width() * 10 /10),
		minHeight:  Math.round(jQuery(window).height() * 10 /10)
	});
}

function selectListChanged(theElement){

	var otherSide='';
	
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
	   //jQuery("#connections_side" + thisSide).html(jQuery("#contentBrowser").html());
	   //jQuery("#contentBrowser").html('');
	   
	   jQuery("#connections_side" + thisSide).hide();
	   jQuery("#contentBrowser").show();
       connectionsWindow_displayedDiagrams[thisSide-1]='cnt1';
	   connectionsWindow_selections[thisSide-1]=[];
	   CW_original_styles[thisSide-1]=[];
	}
	else{
    	jQuery("#connections_side" + thisSide).load("?q=mdn/getDiagram/" + jQuery('#diagramSelectionList' + thisSide).val(), selectListChangedCallBack);	
	}
	
}

	
function selectListChangedCallBack(){
    SVGDisplayPreparation("connections_svgContainer" + thisSide, sendClickToParentDocument2, sendMouseOverToParentDocument2, sendMouseOutToParentDocument2);

    jQuery("#connections_side" + thisSide + " svg").each(function( index ) {
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
		   jQuery.modal.close(); // must call this!	
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
      //jQuery("#content").load("?q=mdn/get/ajax/" + viewid + "/" + theElement.id);
	   //window.open("?q=mdn/get/ajax/" + viewid + "/" + theElement.id, "_self");
	/*
       if selected or not
    */	
	//console.log(theElement.id);
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
    
    //var result = jQuery.grep(connectionsWindow_selections[side], function(v,i) {
      // return (v === IDs[1]);
    //});
	
	var ind = connectionsWindow_selections[side].indexOf(IDs[1]);
    if(ind < 0){ // element is not selected
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

	/*
    for i=0 to side1.length
	   grip visual element for side1 element 
	   if does not exist
	      add it, get original color from temp variables used by hover functions
		  
       for j=0 to side2.length
          request server to add connection record
          if i == 0
	         grip visual element for side1 element 
	         if does not exist
	           add it, get original color from temp variables used by hover functions
            		  
		  add pair to connection array
	   end for
	*/
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
					deletedConnections++;
				}
	        
			}       
			
			
		}
	}

    jQuery("#connectionWindowStatus").html(deletedConnections + " connection(s) deleted");
	
	/*
	   ensure one to many
	   for all
	     function find
		 if found 
		    delet from function
		    request server to delete
	     else
			just display count of are not connected in the first place

         clear selections
		 
       content connections	  
	   add clear selections
	   add clear selections to drop-down list change
	   color browser
	  
	*/
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
/*
svgElementHasConnections = false
  exit mouseover

svgElementHasConnections = true
    
*/   	   
function ConnectionsWindow_svgElementMouseOver(theElement){
	var IDs = getViewElementIDs(theElement.id);						  

    CurrentHoverFill= jQuery(con_window_class + " #" + theElement.id).css("fill"); 
    CurrentHoverStroke= jQuery(con_window_class + " #" + theElement.id).css("stroke"); 
    CurrentHoverStrokeWidth= jQuery(con_window_class + " #" + theElement.id).css("stroke-width"); 
    CurrentHoverOpacity=jQuery(con_window_class + " #" + theElement.id).css("opacity");  
		
	changeStyle(con_window_class, theElement.id,'hover',0);		
		
    flagKeepColor = false; // after mouseover, if mouseclick is fired and element style is changed
                               // this flag will equal true so mouseout will not restore element style		
		
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

   /* an old way of retrieving connections using ajax
   Ajax way of retrieving connections 
   jQuery.get("?q=mdn/hover/" + IDs[0] + "/" + IDs[1], null, hoverCallback);
   */
   //console.log(theElement.id);
    var IDs = getViewElementIDs(theElement.id);						  

    var relatedElements = jQuery.grep(visualElements, function(v,i) { // if element is in visualElements then this element has 
           return (v[0] === IDs[0] && v[1] === IDs[1]);              // we make it hoverable and clickable   
    });
   
    //console.log(relatedElements.length);
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
 
  if(newStyle === 'select'){
	 jQuery(ParentSelector + "#" + elementId).css("fill",rect.selectfill).css("stroke",rect.selectstroke)
	                      .css("stroke-width",rect.selectstroke_width).css("opacity","1");
  }
  else if(newStyle === 'highlight'){
	 jQuery(ParentSelector + "#" + elementId).css("fill",rect.highlightfill).css("stroke",rect.highlightstroke)
	                      .css("stroke-width",rect.highlightstroke_width).css("opacity","1");
  }
  else if(newStyle === 'hover'){
	 jQuery(ParentSelector + "#" + elementId).css("fill",rect.hoverfill).css("stroke",rect.hoverstroke)
	                      .css("stroke-width",rect.hoverstroke_width).css("opacity","1");
  }
  else if(newStyle === 'regular'){
	 jQuery(ParentSelector + "#" + elementId).css("fill",visualElements[elementIndex][2])
	                        .css("stroke",visualElements[elementIndex][3])
	                        .css("stroke-width",visualElements[elementIndex][4])
							.css("opacity",visualElements[elementIndex][5]);
  }

}


function related(itemid){
	/*
	   send ajax request
	*/
}

/*	Ajax way of retrieving connections		 
function hoverCallback(response){
   var result = jQuery.parseJSON(response);
   if(result.length <= 1){ // no connections for this element. Note that the ajax request returns source element too
	   return;
   }
   
    var elem = result[result.length -1].viewId + '_' + result[result.length -1].elementId;
   	CurrentHoverFill= jQuery("#" + elem).css("fill"); 
	CurrentHoverStroke= jQuery("#" + elem).css("stroke"); 
	CurrentHoverStrokeWidth= jQuery("#" + elem).css("stroke-width"); 
	CurrentHoverOpacity=jQuery("#" + elem).css("opacity");  
				
	jQuery("#" + elem).css("fill",rect.hoverfill).css("stroke",rect.hoverstroke)
	                      .css("stroke-width",rect.hoverstroke_width).css("opacity","1");

   for(i=0; i< (result.length-1); i++){
      //console.log(result[0].viewId + ' ' + result[0].elementId);
	  targetElem = result[i].viewId + '_' + result[i].elementId;
	  jQuery("#" + targetElem).css("fill",rect.hoverfill).css("stroke",rect.hoverstroke)
	                      .css("stroke-width",rect.hoverstroke_width).css("opacity","1");
	}
}
*/
	
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

function relatedContent(){
	/*
	  Get selections from visualElements
	  send that 
	  server will do union 
	  and return results
	*/
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
       // console.log(visualElements[i][0] + " & " + visualElements[i][1] + " & " + visualElements[i][2] + " & " + visualElements[i][3]+ " & " + visualElements[i][4]+ " & " + visualElements[i][5] + " & " + visualElements[i][6]);	 
	 }
	 
	 userDataArr = Drupal.settings.userData;
	 layout = Drupal.settings.LayoutNoOfDiagrams;
	 
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
	// var ff = sendMouseOverToParentDocument;
	 for(var j = 0; j < arrParents.length; j++){
	    var arr = arrParents[j].getElementsByTagName("path");	 
	   
	   	for (var i = 0; i < arr.length; i++) { 
//	       arr[i].addEventListener("click", sendClickToParentDocument, false);
	//       arr[i].addEventListener("mouseover", ff, false);
	  //     arr[i].addEventListener("mouseout", sendMouseOutToParentDocument, false);
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
