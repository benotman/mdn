<script>
		//document.getElementById("idone").addEventListener("click", sendClickToParentDocument, false);
		var arr = document.getElementsByTagName("g");
		for (var i = 0; i < arr.length; i++) { 
		   arr[i].addEventListener("click", sendClickToParentDocument, false);
		    arr[i].addEventListener("mouseover", sendMouseOverToParentDocument, false);
		  // arr[i].addEventListener("mouseout", sendMouseOutToParentDocument, false);
		   //arr[i].addEventListener("mouseout", sendClickToParentDocument2, false);
		}
		
		function sendClickToParentDocument(evt)
		{
			// SVGElementInstance objects aren't normal DOM nodes, so fetch the corresponding 'use' element instead
			var target = evt.currentTarget;
			if(target.correspondingUseElement)
				target = target.correspondingUseElement;
      
      // call a method in the parent document if it exists
            if (parent.svgElementClicked)
				parent.svgElementClicked(target,"AGView");
			else
				alert("You clicked '" + target.id + "' which is a " + target.nodeName + " element");
		}
		
	   function sendMouseOverToParentDocument(evt)
		{
			// SVGElementInstance objects aren't normal DOM nodes, so fetch the corresponding 'use' element instead
			var target = evt.currentTarget;
			if(target.correspondingUseElement)
				target = target.correspondingUseElement;
      
      // call a method in the parent document if it exists
            if (window.parent.svgElementMouseOver)
				window.parent.svgElementMouseOver(target,"AGView");
			else
				alert("error");
		}

</script>