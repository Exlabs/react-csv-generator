

function ___$insertStyle(css) {
  if (!css) {
    return;
  }
  if (typeof window === 'undefined') {
    return;
  }

  var style = document.createElement('style');

  style.setAttribute('type', 'text/css');
  style.innerHTML = css;
  document.head.appendChild(style);
  return css;
}

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var fileSaver = require('file-saver');
var _dateFormat = require('dateformat');
var _dateFormat__default = _interopDefault(_dateFormat);
var axios = _interopDefault(require('axios'));
var cn = _interopDefault(require('classnames'));
var arrayFlatten = require('array-flatten');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

___$insertStyle(".csv-generator-loader {\n  animation-fill-mode: both;\n  animation: shadowAnimation 1.8s -0.16s infinite ease-in-out;\n  border-radius: 50%;\n  color: white;\n  font-size: 10px;\n  height: 2.5em;\n  margin: 20px auto;\n  position: relative;\n  text-indent: -9999em;\n  top: 45%;\n  transform: translateZ(0) scale(0.5, 0.5);\n  width: 2.5em;\n  z-index: 99991;\n}\n.csv-generator-loader::before, .csv-generator-loader::after {\n  animation-fill-mode: both;\n  animation: shadowAnimation 1.8s infinite ease-in-out;\n  border-radius: 50%;\n  content: \"\";\n  height: 2.5em;\n  position: absolute;\n  top: 0;\n  width: 2.5em;\n}\n.csv-generator-loader::before {\n  animation-delay: -0.32s;\n  left: -3.5em;\n}\n.csv-generator-loader::after {\n  animation-delay: 0s;\n  left: 3.5em;\n}\n.csv-generator-loader-container {\n  background: rgba(0, 0, 0, 0.3);\n  height: 100%;\n  left: 0;\n  margin: 0 auto;\n  position: fixed;\n  top: 0;\n  width: 100%;\n  z-index: 9999;\n}\n\n@keyframes shadowAnimation {\n  0%, 80%, 100% {\n    box-shadow: 0 2.5em 0 -1.3em;\n  }\n  40% {\n    box-shadow: 0 2.5em 0 0;\n  }\n}");

var Loader = function () { return (React.createElement("div", { className: "csv-generator-loader-container", role: "alert", "aria-label": "Loading" },
    React.createElement("div", { className: "csv-generator-loader" }))); };

var isIsoDate = function (value) {
    if (!!Number(value)) {
        return false;
    }
    return !!Date.parse(value);
};

___$insertStyle(".csv-generator-btn {\n  background: transparent;\n  border: 0;\n  cursor: pointer;\n  display: inline-block;\n  font-size: inherit;\n  font-weight: inherit;\n  letter-spacing: inherit;\n  line-height: inherit;\n  padding: 0;\n  text-transform: inherit;\n}\n\n.csv-generator-hide {\n  visibility: hidden;\n}");

var dateFormat = _dateFormat__default || _dateFormat;
var CsvGenerator = function (props) {
    var errorMessage = props.errorMessage || 'Something went wrong, please try again.';
    var noDataMessage = props.noDataMessage || 'No data to generate the file.';
    var _a = React.useState(false), isGenerating = _a[0], setIsGenerating = _a[1];
    var csvFileContent = '';
    var fetchAllData = function () {
        var finalData = [];
        setIsGenerating(true);
        if (props.baseEndpoint) {
            axios.get("" + props.baseEndpoint, { params: props.endpointDetails })
                .then(function (res) {
                var total_pages = res.data.total_pages;
                finalData = getDataObject(res);
                if (!finalData.length) {
                    setIsGenerating(false);
                    return alert(noDataMessage);
                }
                if (total_pages > 1) {
                    var promises = [];
                    for (var page = 2; page <= total_pages; page++) {
                        var newParams = __assign({}, props.endpointDetails, { page: page });
                        promises.push(fetchData(newParams));
                    }
                    Promise.all(promises)
                        .then(function (res) {
                        finalData = finalData.concat(arrayFlatten.flatten(res));
                        generateCSV(finalData);
                    })
                        .catch(function () {
                        setIsGenerating(false);
                        alert(errorMessage);
                    });
                }
                else {
                    generateCSV(finalData);
                }
            })
                .catch(function () {
                setIsGenerating(false);
                alert(errorMessage);
            });
        }
        else if (props.items && props.items.length) {
            generateCSV(props.items);
        }
        else {
            setIsGenerating(false);
            alert(noDataMessage);
        }
    };
    var fetchData = function (params) { return (new Promise(function (resolve, reject) {
        axios.get("" + props.baseEndpoint, { params: params })
            .then(function (res) {
            var data = getDataObject(res);
            resolve(data);
        })
            .catch(function () {
            reject(errorMessage);
        });
    })); };
    var generateCSV = function (array) {
        array.forEach(function (obj, index) {
            if (index === 0) {
                fillFileHeadlines(obj);
            }
            fillFileData(obj);
        });
        var blob = new Blob([addExcelUtf8Support(csvFileContent)], { type: 'text/csv;encoding:utf-8' });
        fileSaver.saveAs(blob, props.fileName + ".csv");
        setIsGenerating(false);
    };
    var fillFileHeadlines = function (obj) {
        Object.keys(obj).forEach(function (key, i) {
            updateFileContentWithProperData(key, i);
        });
        csvFileContent += '\n';
    };
    var fillFileData = function (obj) {
        Object.keys(obj).forEach(function (key, i) {
            updateFileContentWithProperData(obj[key], i);
        });
        csvFileContent += '\n';
    };
    var updateFileContentWithProperData = function (value, i) {
        var result;
        var stringValue = value === null ? '' : value.toString();
        if (typeof value === 'object' && value !== null) {
            result = getObjectValues(value);
        }
        else if (isIsoDate(stringValue)) {
            result = dateFormat(stringValue, 'dd/mm/yyyy');
        }
        else {
            var label = getLabel(stringValue);
            result = label.replace(/"/g, '""');
        }
        result = escapeValue(result);
        if (i > 0) {
            csvFileContent += ',';
        }
        csvFileContent += result;
    };
    var getObjectValues = function (obj) {
        var objectValues = '';
        var setObjectValues = function (val, name) {
            if (val === null)
                return;
            if (typeof val === 'object') {
                Object.keys(val).forEach(function (key) {
                    var isNestedObject = typeof val[key] === 'object' && val[key] !== null;
                    if (isNestedObject) {
                        var label = getLabel(key);
                        objectValues += label + ": \u2028";
                    }
                    setObjectValues(val[key], key);
                    if (isNestedObject) {
                        objectValues += "\u2028";
                    }
                });
            }
            else {
                var result = val.toString().replace(/"/g, '""');
                var labelName = name ? getLabel(name) : '';
                var labelResult = getLabel(result);
                result = "  " + labelName + ": " + labelResult;
                objectValues += result + "\u2028";
            }
            return;
        };
        setObjectValues(obj);
        return objectValues;
    };
    var escapeValue = function (value) {
        if (value.search(/("|,|\n)/g) >= 0) {
            return "\"" + value + "\"";
        }
        return value;
    };
    var getLabel = function (value) {
        var label = props.labels && props.labels[value];
        if (label) {
            return label;
        }
        return value;
    };
    var addExcelUtf8Support = function (data) {
        return '\uFEFF' + data;
    };
    var getDataObject = function (res) { return (props.objectNameInResponse ? res.data[props.objectNameInResponse] : res.data); };
    return (React.createElement("div", { className: cn('csv-generator-holder', props.className) },
        React.createElement("button", { onClick: fetchAllData, className: cn('csv-generator-btn', isGenerating && 'csv-generator-hide'), "data-cy": "csv-generator-btn" }, props.children),
        isGenerating && (props.loader || React.createElement(Loader, null))));
};

exports.default = CsvGenerator;
//# sourceMappingURL=index.js.map
