import BaseProperty from "./BaseProperty";
import { LOAD, CLICK, DEBOUNCE, DRAGSTART, SUBSCRIBE } from "el/base/Event";

import icon from "el/editor/icon/icon";
import Color from "el/base/Color";
import { registElement } from "el/base/registElement";
import colors from "el/editor/preset/colors";

export default class ColorAssetsProperty extends BaseProperty {

  getTitle() {
    return this.$i18n('color.asset.property.title');
  }

  initState() {
    return {
      mode: 'grid',
      preset: 'random',
      isLoaded : false, 
    }
  }

  getTools() {
    return /*html*/`<div ref="$tools"></div>`
  }

  [LOAD('$tools')] () {
    const options = colors.map(it => `${it.key}:${it.title}`)

    return /*html*/`
      <object refClass="SelectEditor"  key="preset" value="${this.state.preset}" options="${options}" onchange="changePreset"  />
    `
  }

  [SUBSCRIBE('changePreset')] (key, value) {

    this.setState({
      [key]: value
    })
  }

  getClassName() {
    return 'color-assets-property'
  }

  [SUBSCRIBE('refreshSelection') + DEBOUNCE(100)] () {
    this.show();
  }

  getBody() {
    return /*html*/`
      <div class='property-item color-assets'>
        <div class='color-list' ref='$colorList' data-view-mode='${this.state.mode}'></div>
      </div>
    `;
  }


  [DRAGSTART('$colorList .color-item')] (e) {
    const color = e.$dt.attr('data-color');
    e.dataTransfer.effectAllowed = "copy";
    e.dataTransfer.setData("text/color", color);
  }  

  [LOAD("$colorList")]() {
    var preset = colors.find(it => it.key === this.state.preset);

    if (!preset) {
      return '';
    }

    var results = preset.execute().map( (item, index) => {

      return /*html*/`
        <div class='color-item' data-index="${index}" data-color="${item.color}" data-custom="${item.custom}">
          <div class='preview' draggable="true" title="${item.color}" data-index="${index}">
            <div class='color-view' style='background-color: ${item.color};'></div>
          </div>
          <div class='tools'>
            <button type="button" class='copy'>${icon.copy}</button>          
            <button type="button" class='remove'>&times;</button>
          </div>
        </div>
      `
    })

    if (preset.edit) {
      results.push(`<div class='add-color-item'><butto type="button">${icon.add}</button></div>`)
    }

    return results
  }

  executeColor (callback, isRefresh = true, isEmit = true ) {
    var project = this.$selection.currentProject;

    if(project) {

      callback && callback (project) 

      if (isRefresh) this.refresh();
      if (isEmit) this.emit('refreshColorAssets');
    } else{
      alert('Please select a project.')
    }
  }
  
  [CLICK('$colorList .add-color-item')] () {

    this.executeColor((project) => {
      project.createColor({
        color: Color.random(),
        name: '',
        variable: ''
      })
    })
  }

  [CLICK('$colorList .remove')] (e) {
    var $item = e.$dt.closest('color-item');
    var index = +$item.attr('data-index');

    this.executeColor(project => {
      project.removeColor(index);
    })
  }


  [CLICK('$colorList .copy')] (e) {
    var $item = e.$dt.closest('color-item');
    var index = +$item.attr('data-index');

    this.executeColor(project => {
      project.copyColor(index);
    })
  }  

  [CLICK("$colorList .preview")](e) {

    const color = e.$dt.$('.color-view').css('background-color');

    // view 에 따라 다른 속성을 가진다. 
    if (this.$editor.modeView === 'CanvasView') { 
      this.emit('addBackgroundColor', color)
    } else {
      this.emit('setColorAsset', { color })
    }
  }
}

registElement({ ColorAssetsProperty })