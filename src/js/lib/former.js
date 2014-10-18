//! former.js - get JSON out of HTML forms
//! version : 1.0.0
//! authors : Jason Jones
//! license : MIT
//! jayjones.me

(function() {

    var forEach = Array.prototype.forEach,
        usage = "Usage: former.get(<form element>, [array of tag names] | [tag name, tag name, tag name])",
        former = {};

    function propMatch(el, propName, propValue) {
        if(arguments.length < 3) throw new Error(usage);
        if(arguments.length === 3) {
            if(Array.isArray(propValue)) {
                for(var i=0,l=propValue.length;i<l;i++) {
                    if(!propMatch(el, propName, propValue[i])) return false;
                }
            } else {
                return el[propName].toLowerCase() === propValue.toLowerCase();
            }
        }
        for(var i=2,l=arguments.length;i<l;i++) {
            if(!propMatch(el, propName, arguments[i])) return false;
        }
        return true;
    }

    function isTag(el, tagName) {
        return propMatch(el, "tagName", tagName);
    }

    function isType(el, type) {
        return propMatch(el, "tagName", type);
    }

    former.get = function(form, stringify) {
        var data = {};

        if(!form || !form.tagName || form.tagName.toLowerCase() !== "form")
            throw new Error(usage);
        
        forEach.call(form.elements, function(el, index) {
            if(!el.name) return;

            if(isTag(el, "textarea")) {
                data[el.name] = el.value;
            } else if(isTag(el, "select")) {
                data[el.name] = el.childNodes[el.selectedIndex].value;
            } else if(isTag(el, "input")) {
                if(isType(el, "checkbox") && el.checked) {
                    if(data.hasOwnProperty(el.name)) {
                        data[el.name] = [el.value].concat(el.name);
                    } else {
                        data[el.name] = el.value;
                    }
                } else if(isType(el, "radio") && el.checked) {
                    data[el.name] = el.value;
                } else {
                    data[el.name] = el.value;
                }
            }
        });

        return stringify ? JSON.stringify(data) : data;
    };

    window.Former = former;

})();
