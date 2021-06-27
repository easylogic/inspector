# EasyLogic Inspector

Fantastic Inspector for UI System 

This project is [sapa](https://github.com/easylogic/sapa) based. 

# How to use (comming soon)

```js
import Inspector from "@easylogic/inspector";

const obj = Inspector.createInspector({
  container: document.getElementById("app"),
  layout: {
    type: "box",  // default 
  },
  items: [
    'title'
  ]  
})

const obj2 = Inspector.createInspector({
  container: document.getElementById('tabContent'),
  layout: {
    type: 'grid',
    rows: 3,
    cols: 2,
  },
  items: [
    {}
  ]  
})

// control layout 
obj.setLayout({
  type: "grid",
  rows: 2,
  cols: 3
})

// set item editor 
obj.setItems([
  { 
    type: 'color', 
    key: 'background-color', 
    defaultValue: '#ededed', 
    layout: {
      row: 1,
      col: 1
    } 
  }
])

obj.defaultValue // return { 'background-color': '#ededed' }

// set value 
obj.set("key", value);
obj.set({
  key: 1,
  key2: 2,
  key3: 3
});
obj.key = value; 

// get value 
obj.get("key");   // return one value 
obj.key;          // return one value 
obj.get("key", "key2", "key3");  // return { key, key2, key3 }

// event 
obj.on("change", (obj) => {
  // obj is all value 
})

obj.on("change:key", (newValue, oldValue) => {
  // when key is changed
})

obj.on("lastChanged", (obj) => {
  // obj is all value 
})

obj.on("lastChanged:key", (newValue, oldValue) => {
  // when key is changed
})



```




# Development 

```
git clone https://github.com/easylogic/editor.git
cd editor
npm install 
npm run dev 
``` 

# build 

```
npm run build 
```


# License : MIT
