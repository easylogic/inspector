(window.webpackJsonpEasylogicStudio=window.webpackJsonpEasylogicStudio||[]).push([[0],{177:function(e,t,a){"use strict";a.r(t);var r=a(31),n=(a(160),{title:"random",key:"random",execute:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:42,t=r.a.randomByCount(e).map((function(e){return{color:e}}));return t.sort((function(e,t){var a=r.a.parse(e.color),n=r.a.parse(t.color);return a.h>n.h?1:-1})),t}}),c=["#ffebee","#ffcdd2","#ef9a9a","#e57373","#ef5350","#f44336","#e53935","#d32f2f","#c62828","#b71c1c","#f44336","#ff8a80","#ff5252","#ff1744","#d50000"].map((function(e){return{color:e}})),i={title:"material red",key:"material-red",execute:function(){return c}},o=["#fce4ec","#f8bbd0","#f48fb1","#f06292","#ec407a","#e91e63","#d81b60","#c2185b","#ad1457","#880e4f","#e91e63","#ff80ab","#ff4081","#f50057","#c51162"].map((function(e){return{color:e}})),f={title:"material pink",key:"material-pink",execute:function(){return o}},u=["#f3e5f5","#e1bee7","#ce93d8","#ba68c8","#ab47bc","#9c27b0","#8e24aa","#7b1fa2","#6a1b9a","#4a148c","#9c27b0","#ea80fc","#e040fb","#d500f9","#aa00ff"].map((function(e){return{color:e}})),l={title:"material purple",key:"material-purple",execute:function(){return u}},F=["#ede7f6","#d1c4e9","#b39ddb","#9575cd","#7e57c2","#673ab7","#5e35b1","#512da8","#4527a0","#311b92","#673ab7","#b388ff","#7c4dff","#651fff","#6200ea"].map((function(e){return{color:e}})),d={title:"material deep purple",key:"material-deeppurple",execute:function(){return F}},m=["#e8eaf6","#c5cae9","#9fa8da","#7986cb","#5c6bc0","#3f51b5","#3949ab","#303f9f","#283593","#1a237e","#3f51b5","#8c9eff","#536dfe","#3d5afe","#304ffe"].map((function(e){return{color:e}})),p={title:"material indigo",key:"material-indigo",execute:function(){return m}},b=["#e3f2fd","#bbdefb","#90caf9","#64b5f6","#42a5f5","#2196f3","#1e88e5","#1976d2","#1565c0","#0d47a1","#2196f3","#82b1ff","#448aff","#2979ff","#2962ff"].map((function(e){return{color:e}})),g={title:"material blue",key:"material-blue",execute:function(){return b}},E=["#e1f5fe","#b3e5fc","#81d4fa","#4fc3f7","#29b6f6","#03a9f4","#039be5","#0288d1","#0277bd","#01579b","#03a9f4","#80d8ff","#40c4ff","#00b0ff","#0091ea"].map((function(e){return{color:e}})),C={title:"material light blue",key:"material-lightblue",execute:function(){return E}},y=["#e0f7fa","#b2ebf2","#80deea","#4dd0e1","#26c6da","#00bcd4","#00acc1","#0097a7","#00838f","#006064","#00bcd4","#84ffff","#18ffff","#00e5ff","#00b8d4"].map((function(e){return{color:e}})),D={title:"material cyan",key:"material-cyan",execute:function(){return y}},A=["#e0f2f1","#b2dfdb","#80cbc4","#4db6ac","#26a69a","#009688","#00897b","#00796b","#00695c","#004d40","#009688","#a7ffeb","#64ffda","#1de9b6","#00bfa5"].map((function(e){return{color:e}})),k={title:"material teal",key:"material-teal",execute:function(){return A}},B=["#E8F5E9","#C8E6C9","#A5D6A7","#81C784","#66BB6A","#4CAF50","#43A047","#388E3C","#2E7D32","#1B5E20","#B9F6CA","#69F0AE","#00E676","#00C853"].map((function(e){return{color:e}})),x={title:"material green",key:"material-green",execute:function(){return B}},v=["#F1F8E9","#DCEDC8","#C5E1A5","#AED581","#9CCC65","#8BC34A","#7CB342","#689F38","#558B2F","#33691E","#CCFF90","#B2FF59","#76FF03","#64DD17"].map((function(e){return{color:e}})),h={title:"material lightgreen",key:"material-lightgreen",execute:function(){return v}},s=["#F9FBE7","#F0F4C3","#E6EE9C","#DCE775","#D4E157","#CDDC39","#C0CA33","#AFB42B","#9E9D24","#827717","#F4FF81","#EEFF41","#C6FF00","#AEEA00"].map((function(e){return{color:e}})),j={title:"material lime",key:"material-lime",execute:function(){return s}},O=["#FFFDE7","#FFF9C4","#FFF59D","#FFF176","#FFEE58","#FFEB3B","#FDD835","#FBC02D","#F9A825","#F57F17","#FFFF8D","#FFFF00","#FFEA00","#FFD600"].map((function(e){return{color:e}})),R={title:"material yellow",key:"material-yellow",execute:function(){return O}},S=["#FFF8E1","#FFECB3","#FFE082","#FFD54F","#FFCA28","#FFC107","#FFB300","#FFA000","#FF8F00","#FF6F00","#FFE57F","#FFD740","#FFC400","#FFAB00"].map((function(e){return{color:e}})),w={title:"material amber",key:"material-amber",execute:function(){return S}},I=["#FFF3E0","#FFE0B2","#FFCC80","#FFB74D","#FFA726","#FF9800","#FB8C00","#F57C00","#EF6C00","#E65100","#FFD180","#FFAB40","#FF9100","#FF6D00"].map((function(e){return{color:e}})),L={title:"material orange",key:"material-orange",execute:function(){return I}},N=["#FBE9E7","#FFCCBC","#FFAB91","#FF8A65","#FF7043","#FF5722","#F4511E","#E64A19","#D84315","#BF360C","#FF9E80","#FF6E40","#FF3D00","#DD2C00"].map((function(e){return{color:e}})),J={title:"material deep orange",key:"material-deeporange",execute:function(){return N}},q=["#EFEBE9","#D7CCC8","#BCAAA4","#A1887F","#8D6E63","#795548","#6D4C41","#5D4037","#4E342E","#3E2723"].map((function(e){return{color:e}})),z={title:"material brown",key:"material-brown",execute:function(){return q}},G=["#FAFAFA","#F5F5F5","#EEEEEE","#E0E0E0","#BDBDBD","#9E9E9E","#757575","#616161","#424242","#212121"].map((function(e){return{color:e}})),H={title:"material gray",key:"material-gray",execute:function(){return G}},K=["#ECEFF1","#CFD8DC","#B0BEC5","#90A4AE","#78909C","#607D8B","#546E7A","#455A64","#37474F","#263238"].map((function(e){return{color:e}})),M={title:"material bluegray",key:"material-bluegray",execute:function(){return K}},P=["#f8f9fa","#f1f3f5","#e9ecef","#dee2e6","#ced4da","#adb5bd","#868e96","#495057","#343a40","#212529"].map((function(e){return{color:e}})),Q={title:"opencolor gray",resource:"https://yeun.github.io/open-color/",key:"opencolor-gray",execute:function(){return P}};t.default=[n,Q,i,f,l,d,p,g,C,D,k,x,h,j,R,w,L,J,z,H,M]},178:function(e,t,a){"use strict";a.r(t);var r=a(8),n=a(28),c=["0deg","45deg","90deg"],i={title:"Linear",key:"linear",execute:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:42;return Object(r.repeat)(e).map((function(e){return{gradient:"linear-gradient(".concat(r.randomItem.apply(void 0,c),", ").concat(n.a.createColorStep(2),")")}}))}},o={title:"Radial",key:"radial",execute:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:42;return Object(r.repeat)(e).map((function(e){return{gradient:"radial-gradient(".concat("circle",", ").concat(n.a.createColorStep(2),")")}}))}},f=(a(31),a(64)),u={title:"Conic",key:"conic",execute:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:42;return Object(r.repeat)(e).map((function(e){var t=Object(f.randomNumber)(45,55),a=Object(f.randomNumber)(45,55),r=Object(f.randomNumber)(0,360);return{gradient:"conic-gradient(from ".concat(r,"deg at ").concat(t,"% ").concat(a,"%, ").concat(n.a.createColorStep(2,360,"deg"),")")}}))}},l=["0deg","45deg","90deg"],F={title:"Random Linear",key:"random-linear",execute:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:42;return Object(r.repeat)(e).map((function(e){return{gradient:"linear-gradient(".concat(r.randomItem.apply(void 0,l),", ").concat(n.a.createColorStep(10),")")}}))}},d={title:"Random Radial",key:"random-radial",execute:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:42;return Object(r.repeat)(e).map((function(e){return{gradient:"radial-gradient(circle, ".concat(n.a.createColorStep(10),")")}}))}},m={title:"Random Conic",key:"random-conic",execute:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:42;return Object(r.repeat)(e).map((function(e){return{gradient:"conic-gradient(from 0deg at 50% 50%, ".concat(n.a.createColorStep(10,360,"deg"),")")}}))}},p=["0deg","45deg","90deg"],b={title:"Repeat Linear",key:"repeat-linear",execute:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:42;return Object(r.repeat)(e).map((function(e){return{gradient:"repeating-linear-gradient(".concat(r.randomItem.apply(void 0,p),", ").concat(n.a.createRepeatColorStep(2,"10px"),")")}}))}},g={title:"Repeat Radial",key:"repeat-radial",execute:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:42;return Object(r.repeat)(e).map((function(e){return{gradient:"repeating-radial-gradient(".concat("circle",", ").concat(n.a.createRepeatColorStep(3,"6px"),")")}}))}},E={title:"Repeat Conic",key:"repeat-conic",execute:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:42;return Object(r.repeat)(e).map((function(e){return{gradient:"repeating-conic-gradient(from 0deg at 0% 50%, ".concat(n.a.createRepeatColorStep(10,"10deg"),")")}}))}};t.default=[i,F,b,o,d,g,u,m,E]}}]);