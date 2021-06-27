import refreshElement from "./refreshElement";
import refreshProject from './refreshProject';
import setAttribute from "./setAttribute";
import resizeArtBoard from "./resizeArtBoard";
import convertPath from "./convertPath";
import clipboardCopy from "./clipboard.copy";
import clipboardPaste from "./clipboard.paste";
import switchTheme from "./switchTheme";
import showExportView from "./showExportView";
import updateScale from "./updateScale";
import updateResource from "./updateResource";
import downloadJSON from "./downloadJSON";
import saveJSON from "./saveJSON";
import loadJSON from "./load.json";
import setLocale from "./setLocale";
import keymapKeydown from "./keymap.keydown";
import keymapKeyup from "./keymap.keyup";
import changeModeView from "./change.mode.view";
import scaleMinus from "./scale.minus";
import scalePlus from "./scale.plus";
import resetSelection from "./resetSelection"; 
import refreshArtboard from "./refreshArtboard";
import setEditorLayout from "./setEditorLayout";
import groupItem from "./group.item";
import ungroupItem from "./ungroup.item";
import refreshSelection from "./refreshSelection";
import setAttributeForMulti from "./setAttributeForMulti";
import updatePathItem from "./updatePathItem";
import updateClipPath from "./updateClipPath";
export default {
    // command 
    groupItem,
    ungroupItem,
    setEditorLayout,
    refreshSelection,
    refreshArtboard,
    resetSelection,
    changeModeView,
    keymapKeydown,
    keymapKeyup,
    scaleMinus,
    scalePlus, 
    setLocale,
    loadJSON,
    saveJSON,
    downloadJSON,
    updateResource,
    updateScale,
    showExportView,
    switchTheme,
    clipboardPaste,
    clipboardCopy,
    convertPath,    
    refreshElement,
    refreshProject,
    resizeArtBoard,
    setAttribute,  
    setAttributeForMulti,
    updatePathItem,
    updateClipPath
}