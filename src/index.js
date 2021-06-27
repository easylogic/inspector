import "./scss/index.scss";

import Util from "./el/base/index";
import EasyLogic from "./editor-layouts/inspector/index";

function startEditor() {
  var app1 = EasyLogic.createInspector({
    container: document.getElementById('app1'),
    items: [
      'title1',
      {
        key: "color",
        editor: "ColorViewEditor",
        editorOptions: {
          label: 'color',
        },
        value: "white",
        defaultValue: "black"
      }
    ]
  });

  var app2 = EasyLogic.createInspector({
    container: document.getElementById('app2'),
    items: [
      'title2',
    ]    
  });  

  return [app1, app2];
}

export default {
  version: '@@VERSION@@',
  ...Util,
  ...EasyLogic,
  startEditor
};

startEditor();
