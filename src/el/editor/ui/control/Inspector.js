

import { CLICK } from "el/base/Event";
import "../property/index";
import icon from "el/editor/icon/icon";
import { registElement } from "el/base/registElement";
import { EditorElement } from "../common/EditorElement";

export default class Inspector extends EditorElement {

  initState() {
    return {
      selectedIndex: 1
    }
  }

  template() {
    return /*html*/`
      <div class="feature-control inspector scrollbar">                                                 
        <!-- Component -->
        <object refClass="ComponentProperty" />                
      </div>
    `;
  }
}

registElement({ Inspector })