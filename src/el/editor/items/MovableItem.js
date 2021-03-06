import { Item } from "./Item";
import { Length } from "el/editor/unit/Length";
import { Transform } from "../property-parser/Transform";
import { TransformOrigin } from "el/editor/property-parser/TransformOrigin";
import { mat4, quat, vec3 } from "gl-matrix";
import { calculateMatrix, calculateMatrixInverse, radianToDegree, round, vertiesMap } from "el/base/functions/math";
import { isFunction } from "el/base/functions/func";
import PathParser from "el/editor/parser/PathParser";
import { polyPoint, polyPoly, rectToVerties } from "el/base/functions/collision";

const ZERO = Length.z()
export class MovableItem extends Item {


    get isAbsolute  (){
        return this.json.position === 'absolute'; 
    }

    get isRelative  (){
        return this.json.position === 'relative'; 
    }

    get isChild() {
        if (this.json.parent) {
            var isParentDrawItem = this.json.parent.is('project') === false; 

            if (isParentDrawItem && this.isAbsolute) {
                return true; 
            }
        }

        return false; 
    }

    toCloneObject(isDeep = true) {
        return {
            ...super.toCloneObject(isDeep),
            ...this.attrs('x', 'y', 'width', 'height')
        }
    }

    convert (json) {
        json = super.convert(json);

        json.x = Length.parse(json.x);
        json.y = Length.parse(json.y);
        json.width = Length.parse(json.width);
        json.height = Length.parse(json.height);

        return json; 
    }

    //////////////////////
    //
    // getters 
    //
    ///////////////////////

    setScreenX(value) {
        var absoluteX = 0;
        if (this.isChild) {
            absoluteX = this.json.parent.screenX.value; 
        }

        this.json.x.set(value - absoluteX);
        this.changed();
    }
    setScreenY(value) {
        var absoluteY = 0;
        if (this.isChild) {
            absoluteY = this.json.parent.screenY.value; 
        }
        this.json.y.set(value - absoluteY);
        this.changed();        
    }    

    get screenX () { 

        if (this.isChild) {
            return Length.px(this.json.parent.screenX.value + this.json.x.value); 
        }

        return this.json.x || Length.z() 
    }
    get screenY () { 

        if (this.isChild) {
            return Length.px(this.json.parent.screenY.value + this.json.y.value); 
        }        
        return this.json.y || Length.z() 
    }


    get offsetX () { 
        if (!this.parent) {
            return this.json.x || ZERO;
        }        
        return this.json.x.toPx(this.screenWidth.value);  
    }

    get offsetY () { 
        if (!this.parent) {
            return this.json.y || ZERO;
        }        
        return this.json.y.toPx(this.screenHeight.value);  
    }
    
    get screenWidth () { 
        if (this.is('project') || !this.parent) {
            return ZERO;  
        }

        if (this.parent.is('project')) {
            return this.json.width.toPx();  
        }

        if (this.is('artboard')) {
            return this.json.width.toPx();  
        }

        return this.json.width.toPx(this.parent.screenWidth.value);  
    }    

    get screenHeight () { 
        if (this.is('project') || !this.parent) {
            return ZERO;  
        }

        if (this.parent.is('project')) {
            return this.json.height.toPx();  
        }

        if (this.is('artboard')) {
            return this.json.height.toPx();  
        }


        return this.json.height.toPx(this.parent.screenHeight.value);  
    }    

    /**
     * Item ???????????? 
     *  
     * @param {vec3} distVector 
     */
    move (distVector = [0, 0, 0]) {
        this.reset({
            x: Length.px(this.offsetX.value + distVector[0]).round(),          // 1px ????????? ?????? ?????? 
            y: Length.px(this.offsetY.value + distVector[1]).round(),
        })
    }

    moveByCenter (newCenter = [0, 0, 0]) {
        const matrix = this.matrix;


        this.reset({
            x: Length.px(newCenter[0] - matrix.width/2),
            y: Length.px(newCenter[1] - matrix.height/2)
        })
    }


    /**
     * ?????? ?????? 
     * 
     * polygon : ploygon ????????? ?????? ????????? ??????. 
     * 
     * @param {*} areaVerties 
     */
    checkInArea (areaVerties) {
        return polyPoly(areaVerties, this.verties())        
    }

    /**
     * ?????? ????????? ????????? ???????????? ????????? ????????????. 
     * 
     * @param {number} x 
     * @param {number} y 
     */
    hasPoint (x, y) {
        return polyPoint(this.verties(), x, y)
    }


    /**
     * areaVerties ?????? Layer ??? ????????? ?????? 
     * 
     * @param {vec3[]} areaVerties 
     */
    isIncludeByArea (areaVerties) {

        return this.rectVerties().map(vector => {
            return polyPoint(areaVerties, ...vector);
        }).filter(Boolean).length === 4;
    }

    getPerspectiveMatrix () {

        const hasPerspective = this.json['perspective'] || Transform.get(this.json['transform'], 'perspective')

        if (!hasPerspective) {
            return undefined;
        }

        let [
            perspectiveOriginX = Length.percent(50), 
            perspectiveOriginY = Length.percent(50), 
        ] = TransformOrigin.parseStyle(this.json['perspective-origin'])

        const width = this.screenWidth.value;
        const height = this.screenHeight.value

        perspectiveOriginX = perspectiveOriginX.toPx(width).value
        perspectiveOriginY = perspectiveOriginY.toPx(height).value

        // 1. Start with the identity matrix.
        const view = mat4.create();

        // 2. Translate by the computed X and Y values of perspective-origin     
        mat4.translate(view, view, [perspectiveOriginX, perspectiveOriginY, 0]);        
        

        // 3. Multiply by the matrix that would be obtained from the perspective() transform function, 
        // where the length is provided by the value of the perspective property
        const perspective = Transform.get(this.json['transform'], 'perspective')

        if (perspective.length) {
            mat4.multiply(view, view, mat4.fromValues(
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, -1/perspective[0].value, 1 
            ))
        } else if (this.json['perspective'] && this.json['perspective'] != 'none' ) {
            mat4.multiply(view, view, mat4.fromValues(
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, -1/Length.parse(this.json['perspective']).value, 1 
            ))            
        } else {
            return undefined;
        }

        // 4. Translate by the negated computed X and Y values of perspective-origin
        mat4.translate(view, view, [-perspectiveOriginX, -perspectiveOriginY, 0]);                

        return view; 
    }

    getItemTransformMatrix () {

        const list = Transform.parseStyle(Transform.rotate(this.json['transform'], this.json['rotate']));
        const width = this.screenWidth.value;
        const height = this.screenHeight.value;

        return Transform.createTransformMatrix(list, width, height);
    }

    getItemTransformMatrixInverse () {
        return mat4.invert([], this.getItemTransformMatrix());
    }

    /**
     * refer to https://www.w3.org/TR/css-transforms-2/
     * 
     * 1. Start with the identity matrix.
     * 2. Translate by the computed X, Y and Z of transform-origin
     * 3. Multiply by each of the transform functions in transform property from left to right
     * 4. Translate by the negated computed X, Y and Z values of transform-origin
     */    
    getTransformMatrix () {
        const origin = TransformOrigin.scale(
            this.json['transform-origin'] || '50% 50% 0px', 
            this.screenWidth.value, 
            this.screenHeight.value
        )

        // start with the identity matrix 
        const view = mat4.create();

        // 2. Translate by the computed X, Y and Z of transform-origin        
        mat4.translate(view, view, origin);

        // 3. Multiply by each of the transform functions in transform property from left to right        
        mat4.multiply(view, view, this.getItemTransformMatrix())        

        // 4. Translate by the negated computed X, Y and Z values of transform-origin        
        mat4.translate(view, view, vec3.negate([], origin));

        return view; 
    }      

    getTransformMatrixInverse () {
        return mat4.invert([], this.getTransformMatrix());
    }

    /**
     * ????????? ?????? matrix ????????? 
     * 
     * @param {ReadOnlyVec3} vertextOffset 
     * @param {ReadOnlyVec3} center 
     */
    getDirectionTransformMatrix (vertextOffset, width, height) {
        const x = this.offsetX.value;
        const y = this.offsetY.value; 

        const center = vec3.add([], TransformOrigin.scale(
            this.json['transform-origin'] || '50% 50% 0px', 
            width, 
            height
        ), vec3.negate([], vertextOffset));

        const view = mat4.create();
        mat4.translate(view, view, [x, y, 0]);
        mat4.translate(view, view, vertextOffset);            
        mat4.translate(view, view, center)        
        mat4.multiply(view, view, this.getItemTransformMatrix())        
        mat4.translate(view, view, vec3.negate([], center))            

        return view; 
    }

    getDirectionTopLeftMatrix (width, height) {
        return this.getDirectionTransformMatrix([0, 0, 0], width, height)
    }

    getDirectionLeftMatrix (width, height) {
        return this.getDirectionTransformMatrix([0, height/2, 0], width, height)
    }            
 

    getDirectionTopMatrix (width, height) {
        return this.getDirectionTransformMatrix([width/2, 0, 0], width, height)
    }    

    getDirectionBottomLeftMatrix (width, height) {
        return this.getDirectionTransformMatrix([0, height, 0], width, height)
    }    

    getDirectionTopRightMatrix (width, height) {
        return this.getDirectionTransformMatrix([width, 0, 0], width, height)
    }        

    getDirectionRightMatrix (width, height) {
        return this.getDirectionTransformMatrix([width, height/2, 0], width, height)
    }        

    getDirectionBottomRightMatrix (width, height) {
        return this.getDirectionTransformMatrix([width, height, 0], width, height)
    }            

    getDirectionBottomMatrix (width, height) {
        return this.getDirectionTransformMatrix([width/2, height, 0], width, height)
    }            

    getAccumulatedMatrix () {
        let transform = mat4.create();

        let path = this.path.filter(p => p.is('project') === false);

        for(let i = 0, len = path.length; i < len; i++) {
            const current = path[i];

            // multiply parent perspective 
            if (current.parent && isFunction(current.parent.getPerspectiveMatrix)) {
                const perspectiveMatrix = current.parent.getPerspectiveMatrix();
                if (perspectiveMatrix) {
                    mat4.multiply(transform, transform, perspectiveMatrix)
                }
            }       
            
            const offsetX = current.offsetX.value;
            const offsetY = current.offsetY.value; 
            // 5. Translate by offset x, y
            mat4.translate(transform, transform, [offsetX, offsetY, 0]);                   
                    
            mat4.multiply(transform, transform, current.getTransformMatrix())            
        }

        return transform;
    }

    getAccumulatedMatrixInverse () {
        return mat4.invert([], this.getAccumulatedMatrix());
    }

    verties (width, height) {
        let model = rectToVerties(0, 0, width || this.screenWidth.value, height || this.screenHeight.value, this.json['transform-origin']);

        return vertiesMap(model, this.getAccumulatedMatrix())
    }

    selectionVerties () {
        let selectionModel = rectToVerties(-6, -6, this.screenWidth.value+12, this.screenHeight.value+12, this.json['transform-origin']);
        
        return vertiesMap(selectionModel, this.getAccumulatedMatrix())
    }    

    rectVerties () {
        return this.verties().filter((_, index) => index < 4)
    }    

    guideVerties () {
        return this.verties();
    }        

    get matrix () {
        const id = this.id; 
        const x =  this.offsetX.value;
        const y = this.offsetY.value;
        const width = this.screenWidth.value;
        const height = this.screenHeight.value; 
        const originalTransform = this.json.transform;
        const originalTransformOrigin = this.json['transform-origin'] || '50% 50% 0%';
        const parentMatrix = (this.parent && isFunction(this.parent.getAccumulatedMatrix)) ? this.parent.getAccumulatedMatrix() : mat4.create()
        const parentMatrixInverse = mat4.invert([], parentMatrix);
        const localMatrix = this.getTransformMatrix()
        const localMatrixInverse = this.getTransformMatrixInverse();
        const itemMatrix = this.getItemTransformMatrix()
        const itemMatrixInverse = this.getItemTransformMatrixInverse();
        const accumulatedMatrix = this.getAccumulatedMatrix();
        const accumulatedMatrixInverse = this.getAccumulatedMatrixInverse();

        const directionMatrix = {
            'to top left': this.getDirectionTopLeftMatrix(width, height),
            'to top': this.getDirectionTopMatrix(width, height),            
            'to top right': this.getDirectionTopRightMatrix(width, height),
            'to right': this.getDirectionRightMatrix(width, height),                        
            'to bottom left': this.getDirectionBottomLeftMatrix(width, height),
            'to bottom': this.getDirectionBottomMatrix(width, height),                        
            'to bottom right': this.getDirectionBottomRightMatrix(width, height),
            'to left': this.getDirectionLeftMatrix(width, height),                        
        }

        const verties = this.verties(width, height);
        const xList = verties.map(it => it[0])
        const yList = verties.map(it => it[1])

        return {
            id, 
            x, 
            y, 
            width, 
            height,
            transform: originalTransform,
            originalTransformOrigin,      
            /**
             * ???????????? ?????? vertext ??? ?????? 
             */
            verties,
            /**
             * ???????????? vertext ??? ????????? ?????? vertext 
             * ?????? ????????? ????????? ?????? ??? ??? ??????. 
             */            
            rectVerties: verties,
            xList,
            yList,
            directionMatrix,
            parentMatrix,   // ????????? matrix 
            parentMatrixInverse,
            localMatrix,    // ?????? ????????? matrix with translate offset(x,y)
            localMatrixInverse,    
            itemMatrix,     // ?????? ????????? matrix without translate offset(x,y)
            itemMatrixInverse,
            accumulatedMatrix,  // parentMatrix * offset translate * localMatrix , ????????? matrix 
            accumulatedMatrixInverse,
        }
    }


    /**
     * 
     * @returns {vec3[]} ????????? verties 
     */
    pathVerties () {
        return this.accumulatedPath().verties; 
    }

    /**
     * ????????? matrix ????????? path segment 
     * 
     * @returns {PathParser} 
     */
    accumulatedPath (pathString = '') {

        const d = pathString || this.json.d;

        const pathParser = new PathParser(d);


        const transform = this.getAccumulatedMatrix();

        pathParser.transformMat4(transform);

        return pathParser; 
    }    

    // ?????? ???????????? ????????? path ??? ?????? verties ??? 
    // svg container ??? matrix ??? inverse matrix ??? ????????? ????????? ??????.     
    invertPath (pathString = '') {
        const path = new PathParser(pathString)
        path.transformMat4(this.getAccumulatedMatrixInverse())    
    
        return path; 
    }

    /**
     * pathString ??? ????????? ?????? ????????? ?????????. 
     * 
     * @param {string} pathString   svg path string 
     */
    invertPathString (pathString = '') {
        return this.invertPath(pathString).d;
    }

    /**
     * ?????? ????????? ?????? layer ??? ????????? ????????????. 
     * 
     * project, artboard ??? ?????? 
     * 
     * @param {vec3[]} areaVerties 
     */
    checkInAreaForAll (areaVerties) {
        const items = [...this.checkInAreaForLayers(areaVerties)];

        if (this.is('artboard')) return items;
        if (this.is('project')) return items;

        if (this.checkInArea(areaVerties)) {
            // ref ??? ????????? proxy ????????? ????????? ?????? ??? ??? ??????. 
            // ????????? ????????? ???????????? ????????? ?????? ?????? ??? ?????? ?????????. ???, json ??? ????????? ?????? ??????. 
            items.push(this.ref);       
        }

        return items; 
    }

    /**
     * area ??? ???????????? ?????? ??????, 
     * 
     * @param {vec3[]} areaVerties 
     * @returns {Item[]}  ?????? ????????? ????????? ?????? ????????? 
     */
    checkInAreaForLayers(areaVerties) {
        var items = [] 
        this.layers.forEach(layer => {

            items.push.apply(items, layer.checkInAreaForLayers(areaVerties));

            if (layer.checkInArea(areaVerties)) {
                items.push(layer);
            }
        })

        return items; 
    }

    getTransformOriginMatrix () {
        return mat4.fromTranslation([], TransformOrigin.scale(
            this.json['transform-origin'] || '50% 50% 0px', 
            this.screenWidth.value, 
            this.screenHeight.value
        ))
    }

    getTransformOriginMatrixInverse () {
        return mat4.invert([], this.getTransformOriginMatrix())
    }    

    /**
     * ????????? ????????? ???????????? childItem ??? transform ??? ?????????. 
     * 
     * 1. childItem ??? accumulatedMatrix ??? ?????????. 
     * 2. ????????? ????????? ???????????? ????????? ?????? ?????????.   parentItem.accumulatedMatrixInverse 
     * 
     * childItem ??? ????????? ????????? parent ??? ?????? ??????  
     * itemMatrix (rotateZ) ??? ?????? ????????? offset ??? ?????? ????????? ????????? ??????. 
     * 
     * @param {Item} childItem 
     */
    resetMatrix (childItem) {

        // ????????? offset ????????? ????????? ?????? ?????????. 
        // [newParentMatrix] * [newTranslate] * [newItemTransform] = [newAccumulatedMatrix]

        // [newTranslate] * [newItemTransform] = [newParentMatrix * -1] * [newAccumulatedMatrix]
        const matrix = calculateMatrix(
            this.getAccumulatedMatrixInverse(),
            childItem.getAccumulatedMatrix(),
        )

        // scale ????????? 
        const newScaleTransform = Transform.fromScale(mat4.getScaling([], matrix).map(it => round(it, 1000)));

        // ?????? ?????? ?????? ????????? 
        const q = mat4.getRotation([], matrix);
        const axis = []
        const rad = quat.getAxisAngle(axis, q)

        const newRotateTransform = [
            { angle : axis[0] ? radianToDegree(rad * axis[0]) : 0, type: 'rotateX' },
            { angle : axis[1] ? radianToDegree(rad * axis[1]) : 0, type: 'rotateY' },
            { angle : axis[2] ? radianToDegree(rad * axis[2]) : 0, type: 'rotateZ' },
        ]
        .filter(it => it.angle !== 0)
        .map(it => `${it.type}(${Length.deg(it.angle % 360).round(1000)})`).join(' ');

        // ?????? ????????? item transform ?????? 
        const newChildItemTransform = Transform.replaceAll(childItem.transform, `${newScaleTransform} ${newRotateTransform}`)

        const list = Transform.parseStyle(newChildItemTransform);
        const width = childItem.screenWidth.value;
        const height = childItem.screenHeight.value;

        const newTransformMatrix = Transform.createTransformMatrix(list, width, height);

        // ?????? ????????? item transform ?????? 
        // [newLocalMatrix] * [
        //     [origin] * [newTransformMatrix] * [origin * -1]
        //      * -1 
        // ]
        // 
        const [x, y, z] = mat4.getTranslation([], calculateMatrix(
            matrix,
            calculateMatrixInverse(
                childItem.getTransformOriginMatrix(),
                newTransformMatrix,
                childItem.getTransformOriginMatrixInverse(),
            )
        ));


        childItem.reset({
            x: Length.px(x),
            y: Length.px(y),
            transform: newChildItemTransform
        })

    }

    /** order by  */

    getIndex () {
        var parentLayers = this.json.parent.layers;    
        var startIndex = -1; 
        for(var i = 0, len = parentLayers.length; i < len; i++) {
            if (parentLayers[i] === this.ref) {
                startIndex = i; 
                break;
            }
        }

        return startIndex;
    }

    setOrder (targetIndex) {
        var parent = this.json.parent; 

        var startIndex = this.getIndex()

        if (startIndex > -1) {
        parent.layers[startIndex] = parent.layers[targetIndex]
        parent.layers[targetIndex] = this.ref; 
        }
    }

    // get next sibiling item 
    next () {
        if (this.isLast()) {
        return this.ref; 
        }

        const index = this.getIndex();

        return this.json.parent.layers[index+1];
    }

    // get prev sibiling item   
    prev () {
        if (this.isFirst()) {
        return this.ref; 
        }

        const index = this.getIndex();

        return this.json.parent.layers[index-1];    
    }

    /**
     * ???????????? ????????? ???????????? ?????????. 
     * ???, ???????????? ????????? ???????????? ????????????. 
     */
    orderNext() {   

        if (this.isLast()) {
        // ????????? ??? ??????  
        // parent ??? next ??? ????????? ????????? ??????. 
        if (this.json.parent.is('artboard')) {    // ????????? artboard ??????  ????????? ??? ?????? ??????. 
            return; 
        }

        this.json.parent.next().add(this, 'prepend')
        return; 
        }

        var startIndex = this.getIndex();
        if (startIndex > -1) {
            this.setOrder(startIndex + 1);
        }
    }

    isFirst () {
        return this.getIndex() === 0;
    }

    isLast () {
        return this.getIndex() === this.json.parent.layers.length-1
    }

    /**
     * ???????????? ????????? ???????????? ?????????. 
     * ???, ???????????? ????????? ???????????? ????????????.
     */  
    orderPrev () {
        if (this.isFirst()) {
        // ?????? ??? ??????  
        // parent ??? prev ??? ????????? ????????? ??????.

        if (this.json.parent.is('artboard')) {    // ????????? artboard ??????  ????????? ??? ?????? ??????. 
            return; 
        }

        this.json.parent.prev().add(this)
        return; 
        }

        var startIndex = this.getIndex();
        if (startIndex > 0) {
        this.setOrder(startIndex - 1);
        }
    }

    // ????????? ???????????? ????????? 
    orderFirst () {
        this.setOrder(0)
    }

    // ????????? ??????????????? ????????? 
    orderLast () {
        this.setOrder(this.json.parent.layers.length-1)
    }

    //TODO: ???????????? ???????????? ????????? 
    orderTop() {}
    //TODO: ???????????? ??????????????? ????????? 
    orderBottom () {}
}