import Dom from "el/base/Dom";

import { DRAGOVER, DROP, PREVENT, SUBSCRIBE } from "el/base/Event";

import "el/editor/items";
import "el/editor/ui/control";

import "./PopupManager";
import "./KeyboardManager";

import { registElement } from "el/base/registElement";
import { isArray } from "el/base/functions/func";
import { Component } from "el/editor/items/Component";
import MenuItem from "el/editor/ui/menu-items/MenuItem";
import LayerRender from "el/editor/renderer/HTMLRenderer/LayerRender";
import BaseLayout from "../BaseLayout";

export default class InspectorEditor extends BaseLayout {
  
  initialize () {
    super.initialize()

    if (isArray(this.opt.plugins)) {
      this.$editor.registerPluginList(this.opt.plugins);
    }

    this.emit('load.json', this.opt.data.projects);

    this.$editor.initPlugins({
      Component,
      MenuItem,
      LayerRender
    });
  }

  initState() {
    return {
      leftSize: 340,
      rightSize: 260,
      bottomSize: 0,
      lastBottomSize: 150,
      ua: navigator.userAgent.includes('Windows') ? 'ua-window': 'ua-default'
    }
  }

  template() {
    return /*html*/`
      <div class="easylogic-inspector ${this.state.ua}" data-theme="${this.$editor.theme}">
        <div class="layout-main">
            <object refClass='Inspector' />
        </div>
        <object refClass="KeyboardManager" />
        <object refClass="PopupManager" />   
      </div>
    `;
  }


  refresh () {    
    this.emit('resizeEditor');
  }


  [SUBSCRIBE('changeTheme')] () {
    Dom.body().attr('data-theme', this.$editor.theme);
  }


  [SUBSCRIBE('refreshAll')] () {
    this.emit('refreshProjectList');
    this.trigger('refreshAllSelectProject');
  }

  [SUBSCRIBE('refreshAllSelectProject')] () {      
    this.emit('refreshArtboard')
  }

  /** 드랍존 설정을 위해서 남겨놔야함 */
  [DRAGOVER('$middle') + PREVENT] (e) {}
  [DROP('$middle') + PREVENT] (e) {}
  /** 드랍존 설정을 위해서 남겨놔야함 */  

  [SUBSCRIBE('toggle.fullscreen')] () {
    this.$el.toggleFullscreen();
  }
}

registElement({ InspectorEditor })