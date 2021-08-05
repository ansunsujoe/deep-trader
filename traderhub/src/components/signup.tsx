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
  const [nameError, setNameError] = useState(true);
  const [usernameError, setUsernameError] = useState(true);
  const [usernameErrText, setUsernameErrText] = useState("");
  const [passwordError, setPasswordError] = useState(true);

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
        if (response.status === 400) {
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
    if (e.target.value.length === 0) {
      setDisabled(true);
      setNameError(true);
    }
    else {
      setNameError(false);
      if (!usernameError && !passwordError) {
        setDisabled(false);
      }
    }
  }

  function handleUsernameChange(e) {
    setUsername(e.target.value);
    if (e.target.value.length === 0) {
      setDisabled(true);
      setUsernameErrText("Username must not be empty.");
      setUsernameError(true);
    }
    else {
      setUsernameError(false);
      if (!nameError && !passwordError) {
        setDisabled(false);
      }
    }
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
    if (e.target.value.length < 8 || !(/\d/.test(e.target.value)) || (!/[^a-zA-Z0-9]/.test(e.target.value))) {
      setDisabled(true);
      setPasswordError(true);
    }
    else {
      setPasswordError(false);
      if (!nameError && !usernameError) {
        setDisabled(false);
      }
    }
  }

  function checkEnableSubmit() {
    if (!nameError && !usernameError && !passwordError) {
      setDisabled(false);
    }
    else {
      setDisabled(true);
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
        <Button color="primary" type="submit" variant="contained" className="mt-3" disabled={disabled}>Submit</Button>
      </form>
    </div>
  );
}