import { registElement } from "@core/registerElement";
import MenuItem from "./MenuItem";
 
export default class AddDrawPath extends MenuItem {
  getIconString() {
    return 'edit';
  }
  getTitle() {
    return this.props.title || "Draw";
  }

  clickButton(e) {
    this.emit('addLayerView', 'brush')
  }

}

registElement({ AddDrawPath })