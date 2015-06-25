<script>
<![CDATA[
	var thisSVGid;
	/* var arr2 = document.getElementsByTagName("svg");
	if(arr2.length <= 0){
		thisSVGid="Unknown";
		alert("SVG root element cannot be found");
	}
	else{
		thisSVGid = arr2[0].getAttribute("id"); //EH
	}*/
	
   var scriptTag = document.getElementsByTagName('script');
   scriptTag = scriptTag[scriptTag.length - 1];
   var parentTag = scriptTag.parentNode;
   thisSVGid = parentTag.getAttribute("id");
   
   console.log(thisSVGid);
	
	//var arr = document.getElementsByTagName("path");
	var arr = parentTag.getElementsByTagName("path");
	for (var i = 0; i < arr.length; i++) { 
	   arr[i].addEventListener("click", sendClickToParentDocument, false);
	   arr[i].addEventListener("mouseover", sendMouseOverToParentDocument, false);
	   arr[i].addEventListener("mouseout", sendMouseOutToParentDocument, false);
	   console.log(arr[i].getAttribute("id"));
	}

	arr = parentTag.getElementsByTagName("ellipse");
	for (var i = 0; i < arr.length; i++) { 
	   arr[i].addEventListener("click", sendClickToParentDocument, false);
	   arr[i].addEventListener("mouseover", sendMouseOverToParentDocument, false);
	   arr[i].addEventListener("mouseout", sendMouseOutToParentDocument, false);
	   console.log(arr[i].getAttribute("id"));
	}
	
	function sendClickToParentDocument(evt)
	{
	   // SVGElementInstance objects aren't normal DOM nodes, so fetch the corresponding 'use' element instead
		var target = evt.currentTarget;
		if(target.correspondingUseElement)
			target = target.correspondingUseElement;
      
        // call a method in the parent document if it exists
        if (parent.svgElementClicked)
			parent.svgElementClicked(target, thisSVGid); // after finishing svg loader and identifier, I will have svg id embedded in each element id 
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
		  window.parent.svgElementMouseOver(target,thisSVGid);
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
		  window.parent.svgElementMouseOut(target,thisSVGid);
	//  else
		//  alert("Error: Function svgElementMouseOut does not exist");
	}	
	]]>
</script>