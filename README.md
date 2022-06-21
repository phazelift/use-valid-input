# use-valid-input

## React hook for easy and solid input validation

<br/>


## Features:

- usable on any input type that returns a string value
- returns elaborate validation state
- create reusable validation rules with ease
- use optional settings to fine-tune the hook behaviour
- thouroughly tested

<br/>

## Basic usage
```jsx
import useValidInput, { StringSpec } from 'use-valid-input'

// define a validation spec using StringSpec
const tUser = new StringSpec({
	min: 3,
	max: 24,
	include: '_-abcdefghijklmnopqrstuvwxyz',
});


const UserInput = () => {
	const [validation, attributes] = useValidInput(tUser);
	const error = validation.error ? <div>error: {validation.error}</div> : null;

	return (
		<div>
			<input {...attributes}/>
			{ error }
		</div>
	);
};
```

The hook uses <a href='https://www.npmjs.com/package/string-spec'>string-spec</a> npm library. With string-spec you can define re-usable string definitions with ease. Check the link for more info.


<br/>

## Example with all options and validation results
```jsx
import useValidInput, { StringSpec } from './use-valid-input.js'

const tAge = new StringSpec({
  // allow for 0 to 150
  validator: (value) => (value === '0') || ((value[0] !== '0') && (value <= 150)),
});

const AgeInput = ( {onDone, onValidate} ) => {
  const [ageValidation, ageInputAttributes, ageControl] = useValidInput(tAge, {
    // all settings are optional
    id               : 'age',
    initialValue     : '0',
    focus            : true,
    focusOnSetValue  : true,
    trimOnBlur       : true,
    touchedOnChange  : false,
    onValidate,
    onDone,
  });

  const info = validation.infoState && <div>enter a number between 0 and 150</div>;
  const error = validation.errorState && <div style={{color: 'red'}}>{ validation.error }</div>;
  const message = info || error || null;

  return (
    <div>
      <div>{ validation.id }</div>
      <input {...ageInputAttributes}/>
      { message }

      <div>id: { validation.id }</div>
      <div>value: { validation.value }</div>
      <div>lastKey: { validation.lastKey }</div>
      <div>validatedValue: { validation.validatedValue }</div>
      <div>focused: { validation.valid.toString() }</div>
      <div>error: { validation.error }</div>
      <div>code: { validation.code }</div>
      <div>found: { validation.found }</div>
      <div>focused: { validation.focused.toString() }</div>
      <div>touched: { validation.touched.toString() }</div>
      <div>entered: { validation.entered.toString() }</div>
      <div>changed: { validation.changed.toString() }</div>
      <div>infoState: { validation.infoState.toString() }</div>
      <div>errorState: { validation.errorState.toString() }</div>

      <input type='button' value='reset' onClick={ ageControl.setValue.bind(null,'0') }/>
      <input type='button' value='focus' onClick={ ageControl.focus }/>
    </div>
  );
};


const App = () => {
  // onDone is only called when validation.entered becomes true
  const handleAgeValidation = (validation) => console.log(validation);
  return (
    <AgeInput onDone={ handleAgeValidation } onValidate={ handleAgeValidation }/>
  );
}

```
---

<br/>

All optional settings with their defaults:

	id                  : ''         an optional id to show in the validations
	initialValue        : ''         initial value for the input
	focus               : true       focus the input on mount
	focusOnSetValue     : true       auto focus when a value is set with control.setValue
	trimOnBlur          : true       trim spaces automatically when input loses focus
	touchedOnChange     : false      set touched on any key stroke instead of on focus
	onValidate          : (v) => {}  fired at every validation, use your handler
	onDone              : (v) => {}  on Enter, Escape or Tab key press and on blur

<br/>

The full validation object with its default values:

	id                  : ''         the id from settings or string-spec id
	value               : ''         the actual value of the input
	lastKey             : ''         the last keyboard key pressed
	valid               : false      true when value is validated
	validatedValue      : ''         contains the value when valid is true
	error               : ''         default error messages from string-spec
	code                : 0          unique error codes from string-spec
	found               : ''         can contain a hint to what caused the error
	focused             : false      true when the input is focused
	touched             : false      set to true once focussed (depends on touchedOnChange)
	changed             : false      whether value != initialValue
	entered             : false      set on Enter, Tab, Escape or blurred
	infoState           : false      true when focussed and not entered
	errorState          : false      true when touched and error is true

Info and error state are opinionated and for convenience. infoState is nothing more than `focused && !entered`. errorState is `touched && error`. Both can be true at the same time, so the user can choose which best supports the UX at what moment.

<br/>

You can access some specific state variables through the 'control' return value.
```jsx
const [validation, attributes, control] = useValidInput(someStringSpec);

control.focus();	// focus the input
control.setValue('into the input and validated at once, updates the validation result');
```

<br/>

There is also the possibility to change the default settings for use-valid-input application wide. Individual hooks can of course still override these 'global' settings.
```jsx
import useValidInput from 'use-valid-input'
// shown are the default settings
useValidInput.init({
  initialValue         : '',
  focus                : false,
  focusOnSetValue      : true,
  touchedOnChange      : false,
  trimOnBlur           : true,
});
```

This hook is based upon my <a href='https://www.npmjs.com/package/string-spec'>string-spec</a> npm library.

Any suggestions for improvements or feedback is always welcome. Enjoy!

<br/>

---


## change log

0.1.0

- first commit

<br/>

---
## license MIT


