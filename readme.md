# jsonmap

streaming command line newline-delimited json transformer utility

```
$ npm install jsonmap -g

$ echo '{"foo": "bar"}\n{"baz": "taco"}' | jsonmap "this.pizza = 1"
{"foo":"bar","pizza":1}
{"baz":"taco","pizza":1}
```
