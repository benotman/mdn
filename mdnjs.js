//(function ($) {
	var CurrentHoverFill; 
    var CurrentHoverStroke; 
	var CurrentHoverOpacity;  
	var CurrentHoverStrokeWidth;
	var relatedHighlightedElements=[];
	var eventCounter=0;
	
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
   
   'none1fill': "rgba(22,87,136,1)",
   'none1stroke': "rgba(82,129,164,1)",
   'none1stroke_width': "1.0px",

   'none2fill': "rgba(137,14,39,1)",
   'none2stroke': "rgba(82,129,164,1)",
   'none2stroke_width': "1.0px",
 
   'none3fill': "rgba(73,132,181,1)",
   'none3stroke': "rgba(134,192,235,1)",
   'none3stroke_width': "0.566px"
   };
   
   jQuery(document).ready(function($) {
   
     jQuery("svg[hide_elements='1'] path").css("opacity","0");
	 jQuery("svg[hide_elements='1'] ellipse").css("opacity","0");
	 
	 console.log(Drupal.settings.connections[0][0]);
});
   
   function svgElementClicked(theElement){
	   //jQuery("#mdnNodeViewer").load("?q=mdn/get/ajax/1");
	   //winodw.open("?q=mdn/get/ajax/1");
	   
	   /*
	      DB Schema(ViewID,itemID,ViewID,ItemID)
		  ViewID=cnt1 --> Content nodes
		  
		  load a specific url
		  hook_menu
		    Retrieve connections from DB
		    if one connection
		       view node
	        else
               construct a list of links		  
		  
	   */
	   //jQuery("#mdnNodeViewer").load("?q=mdn/get/ajax/" + viewid + "/" + theElement.id);
	   jQuery("#content").load("?q=mdn/get/ajax/" + viewid + "/" + theElement.id);
	   //window.open("?q=mdn/get/ajax/" + viewid + "/" + theElement.id, "_self");
	 // window.open("?q=ajaxreader/ajax/5", "_self"); // + viewid + "/" + theElement.id, "_self"
	  // window.open("?q=node/5","_self");
   }
   	   
  function svgElementMouseOver(theElement){

   /*
   Ajax way of retrieving connections 
   jQuery.get("?q=mdn/hover/" + IDs[0] + "/" + IDs[1], null, hoverCallback);
   */
   console.log(eventCounter + " Tried mouseOver " + theElement.id);
   eventCounter++;
   var IDs = getViewElementIDs(theElement.id);						  

    var result = jQuery.grep(Drupal.settings.connections, function(v,i) {
           return (v[0] === IDs[0] && v[1] === IDs[1] && v[2] != 'cnt1') || (v[2] === IDs[0] && v[3] === IDs[1]  && v[0] != 'cnt1');
    });
   
    if(result.length > 0){
		console.log(eventCounter + " entered mouseOver " + theElement.id);
		eventCounter++;
		
     	CurrentHoverFill= jQuery("#" + theElement.id).css("fill"); 
	    CurrentHoverStroke= jQuery("#" + theElement.id).css("stroke"); 
	    CurrentHoverStrokeWidth= jQuery("#" + theElement.id).css("stroke-width"); 
	    CurrentHoverOpacity=jQuery("#" + theElement.id).css("opacity");  
				
	    jQuery("#" + theElement.id).css("fill",rect.hoverfill).css("stroke",rect.hoverstroke)
	                      .css("stroke-width",rect.hoverstroke_width).css("opacity","1");
		
        relatedHighlightedElements.length=0;
		var otherIndex;
		for( var i = 0, len = result.length; i < len; i++ ) {
			if(result[i][0] === IDs[0]){
				otherView =result[i][2];
				otherElement = result[i][3];
				otherId = otherView + '_' + otherElement;
			}
			else{
				otherView =result[i][0];
				otherElement = result[i][1];
				otherId = otherView + '_' + otherElement;
			}

		    relatedHighlightedElements[relatedHighlightedElements.length]= [otherView,
			                                                                otherElement,
		                                                    jQuery("#" + otherId).css("fill"),
															jQuery("#" + otherId).css("stroke"),
															jQuery("#" + otherId).css("stroke-width"),
														    jQuery("#" + otherId).css("opacity")];
																		
		    jQuery("#" + otherId).css("fill",rect.hoverfill).css("stroke",rect.hoverstroke)
	                             .css("stroke-width",rect.hoverstroke_width).css("opacity","1");
		}
		

	}

				
}

function getViewElementIDs(elementId){
   var res = elementId.split('_');
   return res;	
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
	console.log(eventCounter + " Tried mouseout " + theElement.id);
	eventCounter++;
	if(relatedHighlightedElements.length > 0){
		console.log(eventCounter + " entered mouseout " + theElement.id);
		eventCounter++;
		jQuery("#" + theElement.id).css("fill",CurrentHoverFill).css("stroke",CurrentHoverStroke)
		                      .css("stroke-width",CurrentHoverStrokeWidth).css("opacity",CurrentHoverOpacity);

       for(i=0;i<relatedHighlightedElements.length;i++){
		   jQuery("#" + relatedHighlightedElements[i][0] + '_' + relatedHighlightedElements[i][1])
		                                    .css("fill",relatedHighlightedElements[i][2])
		                                    .css("stroke",relatedHighlightedElements[i][3])
		                                    .css("stroke-width",relatedHighlightedElements[i][4])
											.css("opacity",relatedHighlightedElements[i][5]);
	   }
       relatedHighlightedElements.length=0;	   
	}
}	
/*   
   function svgElementMouseOver(theElement, viewid)
	{
	 if(viewid==="TreeView"){
		}
	else{
    	var item2 =jQuery("#" + theElement.id).find('ellipse, rect, path')[0];
	      var item = jQuery(item2);
	      	jQuery("#" + theElement.id).find('ellipse, rect, path').css("fill",rect.hoverfill)
			                                                  .css("stroke",rect.hoverstroke)
															  .css("stroke-width",rect.hoverstroke_width);
		}
	}
	  
	  //console.log("hello");
  	  var arr = document.getElementsByTagName("g");
		for (var i = 0; i < arr.length; i++) { 
		   //arr[i].addEventListener("click", sendClickToParentDocument, false);
		    arr[i].addEventListener("mouseover", sendMouseOverToParentDocument, false);
		   //arr[i].addEventListener("mouseout", sendMouseOutToParentDocument, false);
		   //arr[i].addEventListener("mouseout", sendClickToParentDocument2, false);
		}
		

		function sendMouseOverToParentDocument(evt)
		{
			// SVGElementInstance objects aren't normal DOM nodes, so fetch the corresponding 'use' element instead
			var target = evt.currentTarget;
			if(target.correspondingUseElement)
				target = target.correspondingUseElement;
      
      // call a method in the parent document if it exists
          svgElementMouseOver(target,"AGView");
			
		}
		*/
		
//})(jQuery);