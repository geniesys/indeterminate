### Angular directive to facilitate 'indeterminate' checkbox state (in TypeScript)

####Usage:

 Mode 1 - your \<expression\> directly affects .indeterminate property of the checkbox object.

```
<input type="checkbox"
          indeterminate="<expression>"
        [ ng-model="<assignable_expression>" || ng-checked="ctrl.getTriStateEnum()" ]
        [ ng-click="ctrl.click()" ] [ ng-change="ctrl.change()" ] ... >
```
 1. Where <expression> references a boolean type property on the scope/model or a function that returns boolean.
    It is up to this function to determine what is considered indeterminate state and return true or false otherwise.
 2. Attributes ng-model and ng-checked are optional and work independently from indeterminate directive.
    For ng-model, the property it is bound to will always be interpreted as true/false and values such as null and
    undefined will NOT produce "indeterminate" state.
 3. Note that indeterminate state visually supersedes checked/unchecked state. If it is "on", you'll see dash regardless
    of whether checkbox is checked or unchecked.

---

 Mode 2 - by comparison of ngChecked or ngModel expression vs. value of ng-indeterminate-value attribute.
          The property, expression or function that it is bound to must yield three possible results two of which
          are compatible with .checked property (boolean). The third result is compared against value of
          ng-indeterminate-value attribute and, if matches, sets .indeterminate to true.
          For example, acceptable values could be 0, 1, 2 or false, undefined, true.
```
<input type="checkbox" indeterminate
          ng-model="<assignable_expression>" || ng-checked="ctrl.getTriStateEnum()"
          ng-indeterminate-value="1"      - if value is not specified, undefined is assumed
        [ ng-click="ctrl.click()" ] [ ng-change="ctrl.change()" ] ... >
```

 1. ng-checked - sets the checked attribute on the element, if the expression evaluates to truthy.
    ng-model and ng-checked should not be used together.
 2. <assignable_expression> - a property on the scope/model or a get-set function (dynamic property).
 3. when ng-*-value attribute is mentioned, but has no value a default value appropriate for this property is assumed.

 Mode 3 - by comparison of ngChecked or ngModel expression vs. values of ng-true-value and ng-false-value attributes.
          All values that don't match ng-true-value and ng-false-value trigger indeterminate state.
          Just like above, the expression must yield three possible results, but the comparison logic is slightly
          different. Another difference is that this mode allows to compare against strings in addition to booleans
          and numbers, however you should be aware that clicking on such checkbox will replace model value (string)
          with a boolean. You probably would want to cancel click events in this case.

```
<input type="checkbox" indeterminate
          ng-model="<assignable_expression>"
          ng-false-value="0"              - if value is not specified, false is assumed
          ng-true-value="3"               - if value is not specified, true is assumed
        [ ng-click="ctrl.click()" ] [ ng-change="ctrl.change()" ] ... >
```

 1. ng-checked is not suitable for this mode. You should use ng-model.
 2. same as above
 3. same as above
 