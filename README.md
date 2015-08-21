# mdn
Drupal module for Multiple Diagram navigation 

Multiple Diagram Navigation is a Drupal module that allows site owners to incorporate diagrams, maps, info graphics, and other visual structures in their sites. The goal of using diagrams is to provide multiple overviews to the site. The site users can look at the diagrams to get an overview of the content and see the multiple facets of the content. MDN allows users to click or select elements (such as shapes) in the diagrams to retrieve nodes (pages) related to these elements. 

OPERATIONS FOR SITE AUTHORS (ADMINS)

- ADDING DIAGRAMS
Site admins can add diagrams in svg format to the site using the diagram content type. Authors can benefit from the svg format and include these types of diagram formats:
1) Converting diagrams already stored in MS Office documents to SVG format using Inkscape, Adobe Illustator, and other software that support SVG.
2) Highlighting or tracking images that contain visual structures. Authors can include images in inkscape and draw ovals, rectangles and other shapes over the image. By changing the opacity of these shapes,  MDN can show and hide these shapes and change their colors during browsing using Javascript.
3) Creating diagrams from scratch. Many diagramming tools can save diagrams in SVG format. Online and desktop diagramming and SVG editing tools include draw.io, inkscape, Adobe illustrator, Mac Sketch, and others.

In case you include diagrams from type 2 (svg with shapes drawn on top of an image), you need to check the "hide SVG elements" option included in the diagram content type.

- CONNECTING DIAGRAM ELEMENTS AND DRUPAL NODES
MDN includes two types of connections. The first one is between two visual elements; a visual element is a shape in a diagram such as a rectangle, oval, and other shapes. By connecting two elements, the author defines that the two elements are related (e.g. they are the same, one is a countermeasure to the other, one is a sibling to the other, ... etc.)

The second type of connections is visual element to content element; a content element is a drupal node. A connection declares a relationship between the two element (e.g. the drupal nodes contain a describtion for the visual element).

Site authors can create connections using the connections window which can be viewed using the connections button on the main MDN block. The window contain two sides. Using the two drop-down lists, authors can choose the diagrams to display. When you hover on a diagram element, connected visual elements on the other diagrams are highlighted so the authors know the available connections. To create a new connection between two visual elements, select the two visual elements (by clicking them) and click on "create connection" button. You can select one visual element on one side and multiple visual elements on the the other side in order to create connections quickly. The "Clear Selections" button clear selections on one side so the author can select new visual elements. 

To delete connection select two connected visual elements and click the "delete connection" button.

For connections between visual elements and Drupal nodes, select the "Content: Drupal Nodes" option on the right drop-down list. The content browser will be displayed. To create a new connection, select (click) a visual element on the diagram (on the left side). The content browser will displayed already connected nodes on the right side. On the top textbox, you can enter a node title to connect to it. The auto-complete module will suggest nodes for you once you start typing. Once the title is entered you can click connect to create a connection between the visual element and the drupal node.

To delete a connection with a drupal node, you can click on the "delete connection" button beside a node title. 

- CHANGING COLOR SCHEME
To change colors used for hovered, selected, and highlighted elements you can click on the "colors" button on the main MDN block. Each diagram can have a different color scheme. Use the drop-down list To change to the wanted diagram. You can select different colors for the shape fill and stroke. To see and test a color, click on the "test on diagram" button and hover the mouse pointer on diagram elements. After setting the colors, click save to save the new color scheme.

- USING BARTIKSUB THEME
To display mdn side by side with drupal main content side, you can use the bartiksub theme. This theme is a subtheme from Bartik theme that come with drupal. The difference in this theme is the wide left side to create enough space to display MDN block.

OPERATIONS FOR END USERS
- HOVER MOUSE POINTER
When hovering the mouse pointer on a diagram element, the related (connected) elements in the other diagram will change color (same hover color). This operation allow site users to disover relationships between elements in different diagrams. Be aware that two diagrams need to be displayed to use this operation.

- SELECTING AND HIGHLIGHTING ELEMENTS
An end user can select a visual element by clicking on it; Related (connected) elements in other diagrams will be highlighted (even if the diagram is not displayed on the screen). This operation is useful if the site contain many diagrams so users can display one or two diagrams at a time and select interesting visual elements. Then they can display other diagrams and see related elements in a higlighted style.

- RELATED CONTENT

Features 
- hover
- select
- Select Diagrams
- Full Screen
- Related content
-



