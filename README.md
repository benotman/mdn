# mdn
Drupal module for Multiple Diagram navigation 

Multiple Diagram Navigation is a Drupal module that allows site owners to incorporate diagrams, maps, info graphics, and other visual structures in their sites. The goal of using diagrams is to provide multiple overviews to the site. The site users can look at the diagrams to get an overview of the content and see the multiple facets of the content. MDN allows users to click or select elements (such as shapes) in the diagrams to retrieve nodes (pages) related to these elements. 

- OPERATIONS FOR SITE AUTHORS (ADMINS)
-- ADDING DIAGRAMS
Site admins can add diagrams in svg format to the site using the diagram content type. Authors can benefit from the svg format and include these types of diagram formats:
1) Converting diagrams already stored in MS Office documents to SVG format using Inkscape, Adobe Illustator, and other software that support SVG.
2) Highlighting or tracking images that contain visual structures. Authors can include images in inkscape and draw ovals, rectangles and other shapes over the image. By changing the opacity of these shapes,  MDN can show and hide these shapes and change their colors during browsing using Javascript.
3) Creating diagrams from scratch. Many diagramming tools can save diagrams in SVG format. Online and desktop diagramming and SVG editing tools include draw.io, inkscape, Adobe illustrator, Mac Sketch, and others.

In case you include diagrams from type 2 (svg with shapes drawn on top of an image), you need to check the "hide SVG elements" option included in the diagram content type.

-- CONNECTING DIAGRAM ELEMENTS AND DRUPAL NODES
MDN includes two types of connections. The first one is between two visual elements; a visual element is a shape in a diagram such as a rectangle, oval, and other shapes. By connecting two elements, the author defines that the two elements are related (e.g. they are the same, one is a countermeasure to the other, one is a sibling to the other, ... etc.)

The second type of connections is visual element to content element; a content element is a drupal node. A connection declares a relationship between the two element (e.g. the drupal nodes contain a describtion for the visual element).



- Colors
- Using Bartik-sub theme

Features 
- hover
- select
- Select Diagrams
- Full Screen
- Related content
-



