//(function ($) {
	var CurrentHoverFill; 
    var CurrentHoverStroke; 
	var CurrentHoverOpacity;  
	var CurrentHoverStrokeWidth;
	
	
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
      retrieve ids for related visual elements
	  highlight related elements
	   - change attack graph to text boxes
				  
      Loading SVGs
     */
				 //jQuery.get("?q=mdn/hover/" + viewid + "/" + theElement.id, null, hoverCallback);

	console.log(theElement.id);			 
//    var IDs = getViewElementIDs(theElement.id);						  
  //  jQuery.get("?q=mdn/hover/" + IDs[0] + "/" + IDs[1], null, hoverCallback);
				
}

function getViewElementIDs(elementId){
//   var IDs={};
  // IDs.viewId = "Images/Block_04.png";
   //IDs.elementId = "Images/Block_04.png";
   var res = elementId.split('_');
   return res;	
}

function related(itemid){
	/*
	   send ajax request
	*/
}
			
function hoverCallback(response){
   var result = jQuery.parseJSON(response);
   if(result.length <= 1){ // no connections for this element. Note that the ajax request returns source element too
	   return;
   }
   
   var elem = result[result.length].viewId + '_' + result[result.length].elementId;
   	CurrentHoverFill= jQuery("#" + elem).css("fill"); 
	CurrentHoverStroke= jQuery("#" + elem).css("stroke"); 
	CurrentHoverStrokeWidth= jQuery("#" + elem).css("stroke-width"); 
	CurrentHoverOpacity=jQuery("#" + elem).css("opacity");  
				
	jQuery("#" + elem).css("fill",rect.hoverfill).css("stroke",rect.hoverstroke)
	                      .css("stroke-width",rect.hoverstroke_width).css("opacity","1");

   for(i=0; i< (result.length-1); i++){
      console.log(result[0].viewId + ' ' + result[0].elementId);
	}
}
	
function svgElementMouseOut(theElement){
	
}	
/*   
   function svgElementMouseOver(theElement, viewid)
	{
	 if(viewid==="TreeView"){
		}
	else{
    	var item2 =$("#" + theElement.id).find('ellipse, rect, path')[0];
	      var item = $(item2);
	      	$("#" + theElement.id).find('ellipse, rect, path').css("fill",rect.hoverfill)
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