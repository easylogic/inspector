import "./scss/index.scss";

import Util from "./el/base/index";
import EasyLogic from "./editor-layouts/inspector/index";

function startEditor() {
  var app = EasyLogic.createInspector({
    container: document.getElementById('app'),
    data: {
      projects: [{
        itemType: 'project', 
        layers: [
          {itemType: 'rect', x: '0px', y: '0px', width: '100px', height: '100px', 'background-color': 'yellow'}
        ]
      }],
    },
    plugins: [
      function (editor) {
        console.log(editor);
      }
    ]
  });

  return app;
}

export default {
  version: '@@VERSION@@',
  ...Util,
  ...EasyLogic,
  startEditor
};

startEditor();
