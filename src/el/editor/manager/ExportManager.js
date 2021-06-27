import { CSS_TO_STRING } from "el/base/functions/func";
import SVGRenderer from "el/editor/renderer/SVGRenderer";

export default {

  makeProjectStyle (item) {

    const keyframeString = item.toKeyframeString();
    const rootVariable = item.toRootVariableCSS()
    
    return `
      :root {
        ${CSS_TO_STRING(rootVariable)}
      }
      /* keyframe */
      ${keyframeString}
    `
  },

  makeStyle (item,appendCSS = '') {

    if (item.is('project')) {
      return this.makeProjectStyle(item);
    }

    const cssString = item.generateView(`[data-id='${item.id}']`, appendCSS)
    return `
    ${cssString}
    ` + item.layers.map(it => {
      return this.makeStyle(it);
    }).join('')
  },

  makeSvg (project) {
    const SVGString = project.toSVGString ? project.toSVGString() : ''
    return `
      ${SVGString ? `<svg width="0" height="0">${SVGString}</svg>` : ''}
    `
  },

  generate (editor) {
    var project = editor.selection.currentProject;
    var current = editor.selection.current;
    var artboard = current.artboard;

    var css = `${this.makeStyle(project)}`
    var html = `
${artboard.html}
${this.makeSvg(project)}
    `

    var js = '';

    html = editor.replaceLocalUrltoRealUrl(html);
    css = editor.replaceLocalUrltoRealUrl(css);
  
    return { html, css, js }
  },

  generateSVG (editor, rootItem) {
    return editor.replaceLocalUrltoRealUrl(SVGRenderer.render(rootItem, null, true));
  }

}