import "../property/index";
import { registElement } from "el/base/registElement";
import { EditorElement } from "../common/EditorElement";

export default class Inspector extends EditorElement {

  initState() {
    return {
      selectedIndex: 1,
    }
  }

  template() {
    console.log(this.props)
    return /*html*/`
      <div class="feature-control inspector scrollbar">                                                 
        <!-- Component -->
        <object refClass="ComponentProperty" targetInspector="${this.props.targetinspector}" />
      </div>
    `;
  }
}

registElement({ Inspector })