import { resultGenerator, BaseSVGFilter } from "./BaseSVGFilter";
import { OBJECT_TO_PROPERTY } from "../../../util/functions/func";
import { Length } from "../../unit/Length";


export class SpecularLightingSVGFilter extends BaseSVGFilter {
  getDefaultObject() {
    return super.getDefaultObject({
      type: "SpecularLighting",
      surfaceScale: SpecularLightingSVGFilter.spec.surfaceScale.defaultValue,      
      lightingColor: SpecularLightingSVGFilter.spec.lightingColor.defaultValue,      
      specularConstant: SpecularLightingSVGFilter.spec.specularConstant.defaultValue,      
      specularExponent: SpecularLightingSVGFilter.spec.specularExponent.defaultValue
    });
  }
  getInCount() { return 1 }  

  toString() {
    var { surfaceScale, specularConstant, specularExponent, lightingColor } = this.json; 

    return /*html*/`<feSpecularLighting ${OBJECT_TO_PROPERTY({
      surfaceScale,
      specularConstant, 
      specularExponent,
      'lighting-color': lightingColor
    })}  ${this.getDefaultAttribute()} >
    
    </feSpecularLighting>`;
  }
}

SpecularLightingSVGFilter.spec = {
  surfaceScale: {
    title: "surfaceScale",
    inputType: "number-range",
    min: 0,
    max: 100,
    step: 1,
    defaultValue: Length.number(1)
  },
  specularConstant: {
    title: "specularConstant",
    inputType: "number-range",
    min: 0,
    max: 100,
    step: 1,
    defaultValue: Length.number(1)
  },  
  specularExponent: {
    title: "specularExponent",
    inputType: "number-range",
    min: 0,
    max: 100,
    step: 1,
    defaultValue: Length.number(1)
  },  
 
  lightingColor: {
    title: "Lighting Color",
    inputType: "color",
    defaultValue: 'rgba(0, 0, 0, 1)'
  }
};
