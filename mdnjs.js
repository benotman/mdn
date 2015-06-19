//(function ($) {
	
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
   
   function svgElementClicked(theElement, viewid){
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
	   window.open("?q=mdn/get/ajax/" + viewid + "/" + theElement.id, "_self");
	  // window.open("?q=node/5","_self");
   }
   	   
   function svgElementMouseOver(theElement, viewid)
			{
				 if(viewid==="TreeView"){
						//objfillColor= $("#" + theElement.id).css("fill"); 
					    //objstrokeColor= $("#" + theElement.id).css("stroke"); 
					    //objopacity=$("#" + theElement.id).css("opacity"); 
						
						//$("#" + theElement.id).css("fill",ellipse.hoverfill).css("stroke",ellipse.hoverstroke)
						  //                    .css("stroke-width",ellipse.hoverstroke_width).css("opacity","1");
						
					}
					else{
					
					var item2 =jQuery("#" + theElement.id).find('ellipse, rect, path')[0];
				        var item = jQuery(item2);
				//		objfillColor= item.css("fill"); 
					//    objstrokeColor= item.css("stroke"); 
			        	jQuery("#" + theElement.id).find('ellipse, rect, path').css("fill",rect.hoverfill)
						                                                  .css("stroke",rect.hoverstroke)
																		  .css("stroke-width",rect.hoverstroke_width);

						//related("AGView",theElement.id,"hoverhighlight");

						}

						

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