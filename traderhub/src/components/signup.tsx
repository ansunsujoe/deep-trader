import React, { useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import styles from '../styles/login.module.css';
import axios from 'axios';
import {useHistory} from "react-router-dom";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& .MuiTextField-root': {
        marginTop: theme.spacing(2),
        width: 500,
      },
    },
  }),
);

export default function Signup() {
  const classes = useStyles();
  let history = useHistory();

  // Use states
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [nameError, setNameError] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [usernameErrText, setUsernameErrText] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  const handleSubmit = e => {
    e.preventDefault();
    const data = {
      name: name,
      username: username,
      password: password
    };

    axios.defaults.withCredentials = true;
    axios.post('http://localhost:5001/users', data, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      console.log("SUCCESS", response);
      if (response.status === 200) {
        history.push("/dashboard");
      }
      else {
        if (response.data === "Username Exists") {
          setUsernameErrText("Username is already taken.");
          setUsernameError(true);
        }
      }
    }).catch(error => {
      console.log(error);
    })
  }

  function handleNameChange(e) {
    setName(e.target.value);
    if (name === "") {
      setDisabled(true);
      setNameError(true);
    }
    else {
      setNameError(false);
      checkEnableSubmit();
    }
  }

  function handleUsernameChange(e) {
    setUsername(e.target.value);
    if (username === "") {
      setDisabled(true);
      setUsernameErrText("Username must not be empty.");
      setUsernameError(true);
    }
    else {
      setUsernameError(false);
      checkEnableSubmit();
    }
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
    if (password.length < 8 || !(/\d/.test(password)) || !(!/[^a-zA-Z0-9]/.test(password))) {
      setDisabled(true);
      setPasswordError(true);
    }
    else {
      setPasswordError(false);
      checkEnableSubmit();
    }
  }

  function checkEnableSubmit() {
    if (nameError === false && usernameError === false && passwordError === false) {
      setDisabled(false);
    }
  }

  return (
    <div className={styles.loginform}>
      <h1>Sign Up</h1>
      <form className={classes.root} noValidate autoComplete="off" onSubmit={handleSubmit}>
        <div>
          <TextField
            error={nameError}
            id="outlined-error"
            label="Full Name"
            placeholder="Full Name"
            helperText="Name must not be empty."
            variant="outlined"
            onChange={handleNameChange}
          />
        </div>
        <div>
          <TextField
            error={usernameError}
            id="outlined-error"
            label="Username"
            placeholder="Username"
            helperText={usernameErrText}
            variant="outlined"
            onChange={handleUsernameChange}
          />
        </div>
        <div>
          <TextField
            error={passwordError}
            id="outlined-error"
            label="Password"
            placeholder="Password"
            helperText="Must contain 8+ characters, 1+ numbers, 1+ special characters"
            variant="outlined"
            onChange={handlePasswordChange}
          />
        </div>
        <Button color="primary" type="submit" disabled={disabled}>Submit</Button>
      </form>
    </div>
  );
}