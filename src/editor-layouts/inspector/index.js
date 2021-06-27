import InspectorEditor from "./InspectorEditor";
import * as App from 'el/base/App'

export default {
  createDesignEditor(opts = { type: "white" }) {

    return App.start(InspectorEditor, {
      ...opts
    });
  },
  DesignEditor,
};
