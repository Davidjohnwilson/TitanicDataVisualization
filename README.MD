#Would you have survived on the Titanic? 

A visualization by David Wilson. 

###Summary

<!-- Summary - in no more than 4 sentences, briefly introduce your data visualization and add any context that can help readers understand it -->

This visualization is intended to show a user which groups were most and least likely to survive the Titanic, and then allow the user to see they're survival chances. The visualization splits passengers by gender, age, and whether they had a sibling or spouse on board. 


###Design

<!-- Design - explain any design choices you made including changes to the visualization after collecting feedback -->

Initially, I decided on a visualization that showed a circle for every passenger in the data set, colored according to if they survived or not. This would then be filterable so users could see the relative survivability of various classes. However, after implementing (see `dot_chart.html`) I realized that although visually interesting, it was very hard to actually compare any classes.

I therefore decided on a slope chart, to try and clearly show how the segmentation of the passengers by gender, age, and sibling/spouse affects survivability. As well as showing the changes in survivability, I also used the size of the circle at each node to show the number of passengers in each class.

In particular, I wanted it to be clear that female passengers unanimously had better survivability than male passengers. As part of this, I wanted to highlight the class with 100% survivability (Female, 60+, No Sibling/Spouse) and the class with 0% survivability (Male, 60+, No Sibling/Spouse).

I highlighted the slopes corresponding to these classes in blue and red (blue having a positive connotation, red having a negative connotation). I also removed the scale values for all but the leftmost axis to avoid chart junk. I added labels to each axis, and to the two highlighted classes.

To add interaction, I allowed users to hover over paths to highlight them in green (which would show the changes in survivability). Hovering over a node would also highlight that node in green, as well as showing a tooltip. The tooltip allows for full detail of the data: the number of passengers, exact survivability rate, and which classes the group of passengers belongs to. I initially played with highlighting or labelling the groups according to the classes they belong to, however I feel it just added extra chart junk.


###Feedback

<!-- Feedback - include all feedback you received from others on your visualization from the first sketch to the final visualization-->

Feedback was collected through this Google Form: [Form](https://docs.google.com/forms/d/1JM7kqiOV1nOZzfnkoC2_QB4Nkv0dSJ73jujjesDxdFs/viewform?usp=send_form). 

The first respondant pointed out that the initial version of the graphic was confusing to understand. In particular, the relationship between each axis was unclear.

###Resources

<!-- Resources - list any sources you consulted to create your visualization -->

[Interactive Data Visualization for the Web by Scott Murray](http://chimera.labs.oreilly.com/books/1230000000345) - for tooltips

