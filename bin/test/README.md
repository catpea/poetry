# Feed

This should be a database table type device, try to avoid nesting beyond what is strictly necessary.

Feed has gone through many versions.

It must be a simple array, **do not calculate chapters**, just leave the list alone.

It must have a .data property that will store nested lists, **BUT!** all other properties should be stored in object root.

```JSON

{
  "title": "The Feline Adventures of Dr. Fancypants",
  "data": [
    {"name": "Hola", "data":[]},
    {"name": "Bueno", "data":[]}
  ]
}


```

So help you god, make this a simple program, or the older you will come to haunt you.
