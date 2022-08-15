import React, { useEffect, useReducer } from "react";

import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Button from "../UI/Button/Button";

const formReducer = (state, action) => {
  switch (action.type) {
    case "SET_EMAIL":
      return {
        ...state,
        emailValue: action.value,
        emailIsValid: action.value.includes("@"),
        formIsValid: state.passwordIsValid && action.value.includes("@"),
      };
    case "SET_PASSWORD":
      return {
        ...state,
        passwordValue: action.value,
        passwordIsValid: action.value.length >= 6,
        formIsValid: state.emailIsValid && action.value.length >= 6,
      };
    case "VALIDATE_EMAIL":
      return {
        ...state,
        emailIsValid: state.emailValue.includes("@"),
        formIsValid: state.passwordIsValid && state.emailIsValid,
      };
    case "VALIDATE_PASSWORD":
      return {
        ...state,
        passwordIsValid: state.passwordValue.length >= 6,
        formIsValid: state.emailIsValid && state.passwordIsValid,
      };
    case "VALIDATE_FORM":
      return {
        ...state,
        formIsValid: state.emailIsValid && state.passwordIsValid,
      };
    default:
      return {
        emailValue: "",
        emailIsValid: false,
        passwordValue: "",
        passwordIsValid: false,
        formIsValid: false,
      };
  }
};

const Login = (props) => {
  const [formState, formDispatch] = useReducer(formReducer, {
    emailValue: "",
    emailIsValid: null,
    passwordValue: "",
    passwordIsValid: null,
    formIsValid: false,
  });

  // similar to componentDidUpdate
  useEffect(() => {
    const checkValidTimer = setTimeout(() => {
      console.log("enter");
      formDispatch({ type: "VALIDATE_FORM" });
    }, 500);

    // this is equivalent to componentWillUnmount
    // we are cleaning the useEffect cycle with a return function
    return () => {
      console.log("cleanup");
      clearTimeout(checkValidTimer);
    };
  }, [formState.emailValue, formState.passwordValue]);

  const passwordChangeHandler = (event) => {
    // setEnteredPassword(event.target.value);
    formDispatch({ type: "SET_PASSWORD", value: event.target.value });
  };

  const emailChangeHandler = (event) => {
    // setEnteredEmail(event.target.value);
    formDispatch({ type: "SET_EMAIL", value: event.target.value });
  };

  const validateEmailHandler = () => {
    // setEmailIsValid(enteredEmail.includes("@"));
    formDispatch({ type: "VALIDATE_EMAIL" });
  };

  const validatePasswordHandler = () => {
    // setPasswordIsValid(enteredPassword.length >= 6);
    formDispatch({ type: "VALIDATE_PASSWORD" });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    props.onLogin(formState.emailValue, formState.passwordValue);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <div
          className={`${classes.control} ${
            formState.emailIsValid === false ? classes.invalid : ""
          }`}
        >
          <label htmlFor="email">E-Mail</label>
          <input
            type="email"
            id="email"
            value={formState.emailValue}
            onChange={emailChangeHandler}
            onBlur={validateEmailHandler}
          />
        </div>
        <div
          className={`${classes.control} ${
            formState.passwordIsValid === false ? classes.invalid : ""
          }`}
        >
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={formState.passwordValue}
            onChange={passwordChangeHandler}
            onBlur={validatePasswordHandler}
          />
        </div>
        <div className={classes.actions}>
          <Button
            type="submit"
            className={classes.btn}
            disabled={!formState.formIsValid}
          >
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
