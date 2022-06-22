import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import assign from 'assign-variable'
import _StringSpec from 'string-spec'
import { forceString, forceObject } from 'types.js'



const isTabKey    = (event) => (event.key === 'Tab') || (event.keyCode === 9);
const isEnterKey  = (event) => (event.key === 'Enter') || (event.keyCode === 13);
const isEscapeKey = (event) => (event.key === 'Escape') || (event.keyCode === 27);



const defaultSettings = {
  initialValue         : '',
  focus                : false,
  focusOnSetValue      : true,
  touchedOnChange      : false,
  trimOnBlur           : true,
};




// all (optional) settings are set to the defaults if not given or invalid
const assignSettings = (settings, spec) => {
  settings = forceObject( settings );
  return {
    id                  : assign( settings.id, spec.id || '' ),
    initialValue        : assign( settings.initialValue, defaultSettings.initialValue ),
    focus               : assign( settings.focus, defaultSettings.focus ),
    focusOnSetValue     : assign( settings.focusOnSetValue, defaultSettings.focusOnSetValue ),
    trimOnBlur          : assign( settings.trimOnBlur, defaultSettings.trimOnBlur ),
    touchedOnChange     : assign( settings.touchedOnChange, defaultSettings.touchedOnChange ),
    onValidate          : assign( settings.onValidate, () => {} ),
    onDone              : assign( settings.onDone, () => {} ),
  };
};




const useValidInput = (spec, _settings) => {
  const [settings]                   = useState( assignSettings(_settings, spec) );
  const input                        = useRef( null );
  const checkTrimInputLength         = useCallback( () => settings.trimOnBlur && (input.current.value= input.current.value.trim()), [] );
  const isFocused                    = useCallback( () => (document.activeElement === input.current), [] );
  const [touched, setTouched]        = useState( false );


  const getValidation = ( props= {} ) => {
    const value      = forceString( input.current && input.current.value, settings.initialValue );
    const validation = spec.validate( value );

    // validation props coming from string-spec
    // validation.id    : string
    // validation.value : string
    // validation.error : string
    // validation.code  : number
    // validation.found : any

    validation.id             = settings.id || validation.id;
    validation.lastKey        = props.key;
    validation.focused        = isFocused();
    validation.changed        = value !== settings.initialValue;
    validation.touched        = settings.touchedOnChange ? validation.changed ? true : false : (props.touched || touched);
    validation.entered        = props.hasOwnProperty('entered') ? (!!props.entered && validation.changed): false;
    validation.valid          = !validation.error;
    validation.validatedValue = validation.error ? '' : validation.value;
    validation.infoState      = validation.focused && !validation.entered;
    validation.errorState     = !!(validation.touched && validation.error);
    return validation;
  };


  const [validation, setValidation] = useState( getValidation() );
  const validate                    = (props= {}) => setValidation( getValidation(props) );



  //
  // attributes
  //
  const onBlur = useCallback( () => {
    if ( settings.trimOnBlur ){
      input.current.value = input.current.value.trim();
    }
    validate( {entered: true} );
  });


  const onKeyDown = (event) => {
    // only filtering out the TAB key as it's missing in keyUp event
    if ( isTabKey(event.key) ){
      if ( input.current.value.length ) checkTrimInputLength();
      validate( {entered: true, key: 'Tab'} );
    }
  };


  const onKeyUp = (event) => {
    const props = { key: event.key };

    if ( isEnterKey(event) || isEscapeKey(event) ){
      props.entered = true;
    }

    if (isEnterKey( event )) checkTrimInputLength();
    else if (isEscapeKey( event )) input.current.blur();

    validate( props );
  };


  const onFocus = (event) => {
    validate( {touched: true} );
    if (!settings.touchedOnChange) setTouched( true );
  };


  const attributes = {
    ref: input,
    onBlur,
    onKeyDown,
    onKeyUp,
    onFocus,
  };
  //
  //




  //
  // control
  //
  const focus = useCallback( () => input.current.focus(), [] );

  const setValue = (value) => {
    input.current.value = value;
    if (settings.focusOnSetValue) focus();
    validate();
  };

  const control = {
    focus,
    setValue,
  };
  //
  //



  // run once on mount
  useEffect( () => {
    input.current.value = settings.initialValue;
    if (settings.focus) focus();
  }, [] );


  // run on validation change
  useEffect( () => {
    if (validation.entered) settings.onDone( validation );
    settings.onValidate( validation );
  }, [validation] );


  return [ validation, attributes, control ];
};



// allows for changing the golbal default settings
useValidInput.init = (settings) => {
  Object.keys(settings).map( (key) => {
    if ( defaultSettings.hasOwnProperty(key) )
      defaultSettings[key] = assign( settings[key], defaultSettings[key] );
  });
};



export const StringSpec = _StringSpec;

export default useValidInput;