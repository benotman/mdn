	
//   var scriptTag = document.getElementsByTagName('script');
  // scriptTag = scriptTag[scriptTag.length - 1];
  // var parentTag = scriptTag.parentNode;
  // thisSVGid = parentTag.getAttribute("id");
   
   //console.log(thisSVGid);
	
	var arr = document.getElementsByTagName("path");
	for (var i = 0; i < arr.length; i++) { 
	   arr[i].addEventListener("click", sendClickToParentDocument, false);
	   arr[i].addEventListener("mouseover", sendMouseOverToParentDocument, false);
	   arr[i].addEventListener("mouseout", sendMouseOutToParentDocument, false);
	   
	}

	arr = document.getElementsByTagName("ellipse");
	for (var i = 0; i < arr.length; i++) { 
	   arr[i].addEventListener("click", sendClickToParentDocument, false);
	   arr[i].addEventListener("mouseover", sendMouseOverToParentDocument, false);
	   arr[i].addEventListener("mouseout", sendMouseOutToParentDocument, false);
	   
	}
	
	function sendClickToParentDocument(evt)
	{
	   console.log(evt.target.getAttribute("id") + " " + evt.currentTarget.getAttribute("id"));
	   //evt.stopPropagation();
	   // SVGElementInstance objects aren't normal DOM nodes, so fetch the corresponding 'use' element instead
	    //evt.cancelBubble = true;
		var target = evt.currentTarget;
		if(target.correspondingUseElement)
			target = target.correspondingUseElement;
        
		
        // call a method in the parent document if it exists
        if (parent.svgElementClicked)
			parent.svgElementClicked(target); // after finishing svg loader and identifier, I will have svg id embedded in each element id 
		//else
		//	alert("Error: Function svgElementClicked does not exist");
	}
		
	function sendMouseOverToParentDocument(evt)
	{
	  // SVGElementInstance objects aren't normal DOM nodes, so fetch the corresponding 'use' element instead
	  var target = evt.currentTarget;
	  if(target.correspondingUseElement)
		  target = target.correspondingUseElement;
      
      // call a method in the parent document if it exists
      if (window.parent.svgElementMouseOver)
		  window.parent.svgElementMouseOver(target);
	  //else
		//  alert("Error: Function svgElementMouseOver does not exist");
	}

	function sendMouseOutToParentDocument(evt)
	{
	  // SVGElementInstance objects aren't normal DOM nodes, so fetch the corresponding 'use' element instead
	  var target = evt.currentTarget;
	  if(target.correspondingUseElement)
		  target = target.correspondingUseElement;
      
      // call a method in the parent document if it exists
      if (window.parent.svgElementMouseOut)
		  window.parent.svgElementMouseOut(target);
	//  else
		//  alert("Error: Function svgElementMouseOut does not exist");
	}	
