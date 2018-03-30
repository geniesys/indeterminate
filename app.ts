/*
*   This is an example.
*   Demo is not available at this time, but the dirrective is fully functional.
*   If you are an Angular developer you should know how to incorporate this code into your app.
*/
module webapp {
    'use strict';

    angular.module('app', [

        // ... your app's dependencies ...

    ]).directive('indeterminate', [function () {
        // console.log('.directive(\'indeterminate\') - CREATING');
        return {
            restrict: 'A',
            scope   : false,    // use parent scope
            compile : function (jq: angular.IAugmentedJQuery, Attributes: angular.IAttributes) {

                console.log('directive("indeterminate").compile() - BEGIN');
                console.log(arguments);
                let attributes: any = <any>Attributes;
                let element = attributes.$$element[0] || jq[0];

                // Pre-flight check for browser compatibility and improper usage
                if (!element) {    // use parent scope
                    console.error('directive("indeterminate"): Unable to locate corresponding object in DOM !?');
                    return;
                } else if (element.indeterminate === undefined) {
                    console.error('directive("indeterminate"): It looks like .indeterminate property is not supported in this browser');
                    return;
                } else if (!element.type || element.type.toLowerCase() !== 'checkbox') {
                    console.error(
                        'indeterminate directive: This directive cannot be used on objects of type \'' + element.type + '\''
                    );
                    return;
                } else if (!attributes['ngChecked'] && !attributes['ngModel'] && !attributes['indeterminate']) {
                    console.error('directive("indeterminate"): Control is unbound. Please bind it using ' +
                        'ng-checked or ng-model attribute or remove \'indeterminate\' attribute');
                    return;
                }

                //console.log('element.indeterminate:', attributes.$$element[0].indeterminate);
                //console.log('directive("indeterminate").compile() - END (returning anonymous function)');

                return function (scope: angular.IScope, jq: angular.IAugmentedJQuery, Attributes: angular.IAttributes) {
                    let attributes = <any>Attributes;
                    let element = attributes.$$element || jq[0];
                    if (attributes['indeterminate']) {
                        // Mode 1 - manipulating value of indeterminate attribute directly
                        // console.log('.directive(indeterminate).compile().anonymous() - setting up a watch on .indeterminate');
                        scope.$watch(attributes.indeterminate, function (
                                newVal: string | number | boolean,
                                oldVal: string | number | boolean,
                                scope: angular.IScope
                        ) {
                            //console.log('value of .indeterminate is now', newVal);
                            element.indeterminate = !!newVal;
                        });
                    } else {
                        // Find our expression to watch. It can come through either ng-checked or ng-model attribute.
                        // false and undefined values are not an issue here because these are always strings until
                        // scope.$watch or we $eval() it.
                        let expression = attributes.ngChecked || attributes.ngModel;
                        if (expression === undefined) { return; }

                        if (attributes.ngIndeterminateValue) {
                            // mode 2: compare value of our expression vs. value of ng-indeterminate-value attribute

                            // This is the value that is considered "indeterminate". Defaults to undefined if
                            // it is mentioned in the tag but actual value is not specified.
                            let indeterminateValue = scope.$eval(attributes.ngIndeterminateValue) || undefined;

                            //console.log('directive("indeterminate").compile().anonymous() - setting up a watch on currentValue');
                            scope.$watch(expression, function (
                                        newVal: string | number | boolean,
                                        oldVal: string | number | boolean,
                                        scope: angular.IScope
                            ) {
                                element.indeterminate = (newVal + '' === indeterminateValue + '');
                            });
                        } else if (attributes.ngTrueValue && attributes.ngFalseValue) {
                            // mode 3: compare value of our expression vs. values of ng-true-value and ng-false-value
                            // attributes. All values that don't match one of these two trigger indeterminate state.

                            // Values that would yield truthy when compared against our expression.
                            // Defaults to true and false if attribute is mentioned in the tag but actual value is not specified.
                            let trueValue  = scope.$eval(attributes.ngTrueValue  || true);
                            let falseValue = scope.$eval(attributes.ngFalseValue || false);

                            //console.log('directive("indeterminate").compile().anonymous() - setting up a watch on currentValue');
                            scope.$watch(expression, function (
                                        newVal: string | number | boolean,
                                        oldVal: string | number | boolean,
                                        scope: angular.IScope
                            ) {
                                console.log('attributes:', attributes);
                                console.log('my values old:', oldVal, 'new:', newVal, 'trueValue:', trueValue, 'falseValue:', falseValue);

                                // comparing operands as strings allows for some flexibility with datatypes (e.g. "1" eq 1 => true)
                                // undefined.toString() results in error; undefined + '' - Ok
                                if (newVal + '' === trueValue + '') {
                                    element.indeterminate = false;
                                    element.checked = true;
                                } else if (newVal + '' === falseValue + '') {
                                    element.indeterminate = false;
                                    element.checked = false;
                                } else {
                                    element.indeterminate = true;
                                    element.checked = false;
                                }
                            });
                        } else {
                            console.error('indeterminate directive: Invalid usage. See documentation.');
                            return;
                        }
                    }
                };
            }
        };
    }]);
}