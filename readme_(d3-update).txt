
install:
 - $> 
 
transcompilar
 - $> `npm run tsc`







 (*) TypeError: Cannot read property 'format' of undefined
     time.format() --> timeFormat()

 (*) TypeError: ... 'scale' of undefined
     
     d3.timeFormat("%d-%b-%y").parse  ------> d3.timeParse("%Y-%m-%d")