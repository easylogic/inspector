import BaseProperty from "./BaseProperty";
import { DEBOUNCE, LOAD, SUBSCRIBE } from "el/base/Event";
import { isFunction, isString, OBJECT_TO_PROPERTY } from "el/base/functions/func";
import { registElement } from "el/base/registElement";


export default class ComponentProperty extends BaseProperty {

  getTitle() {
    return "Component";
  }

  isShow() {
    return true; 
  }

  getBody() {
    return /*html*/`
      <div ref='$body'></div>
    `;
  }

  getPropertyEditor (index, key, value, selfEditor, selfEditorOptions) {
    return /*html*/`
        <object refClass="${selfEditor}" ${OBJECT_TO_PROPERTY({
          ...selfEditorOptions,
          onchange: 'changeComponentProperty',
          ref: `${key}${index}`,
          key,
        })}>
          <property name="value" valueType="json">${JSON.stringify(value || {})}</property>
        </object>
      `
  }

  [LOAD('$body')] () {

    const inspector = this.$editor.components.createInspector({ itemType: this.props.targetinspector});

    var self = inspector.map((it, index)=> {

      if (isString(it)) {
        return /*html*/`
          <div class='property-item is-label'> 
            <label class='label string-label'>${it}</label>
          </div>`
      } else {
        return /*html*/`
          <div class='property-item'> 
            ${this.getPropertyEditor(index, it.key, it.value || it.defaultValue, it.editor, it.editorOptions)}
          </div>
        `
      }

    })

    return self; 
  }

  [SUBSCRIBE('changeComponentProperty')] (key, value) {

    console.log(key, value);
  }
}

registElement({ ComponentProperty })