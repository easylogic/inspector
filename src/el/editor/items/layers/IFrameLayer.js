import { Layer } from "../Layer";
import icon from "el/editor/icon/icon";
import { ComponentManager } from "el/editor/manager/ComponentManager";

export class IFrameLayer extends Layer {

  getIcon () {
    return icon.web;
  }  

  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: 'iframe',
      elementType: 'iframe',
      name: 'New IFrame',      
      url: '',
      ...obj
    });
  }

  toCloneObject() {
    return {
      ...super.toCloneObject(),
      ...this.attrs('url'),
    }
  }


  getDefaultTitle() {
    return "IFrame";
  } 


}
 
ComponentManager.registerComponent('iframe', IFrameLayer); 