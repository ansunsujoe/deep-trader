import React, { useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import styles from '../styles/login.module.css';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& .MuiTextField-root': {
        marginTop: theme.spacing(3),
        width: 500,
      },
    },
  }),
);

export default function Login() {
  const classes = useStyles();
  let history = useHistory();
  axios.defaults.withCredentials = true;

  // Use states
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordErrText, setPasswordErrText] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  function handleUsernameChange(e: any) {
    setUsername(e.target.value);
  }

  function handlePasswordChange(e: any) {
    setPassword(e.target.value);
  }

  const handleSubmit = e => {
    e.preventDefault();
    const data = {
      username: username,
      password: password
    };

    if (username === "") {
      setUsernameError(true);
    }
    else if (password === "") {
      setPasswordErrText("Password must not be empty.");
      setPasswordError(true);
    }
    else {
      axios.post('http://localhost:5001/login', data, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          history.push("/dashboard");
        }
        else if (response.status === 401) {
          setPasswordErrText("Incorrect password.");
          setPasswordError(true);
        }
      }).catch(error => {
        console.log(error);
      })
    }
  }

  return (
    <div className={styles.loginform}>
      <h1>Login</h1>
      <form className={classes.root} noValidate autoComplete="off" onSubmit={handleSubmit}>
        <div>
          <TextField
            error={usernameError}
            id="outlined-error"
            label="Username"
            placeholder="Username"
            helperText="Username must not be empty."
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
            helperText={passwordErrText}
            variant="outlined"
            onChange={handlePasswordChange}
          />
        </div>
        <Button color="primary" type="submit" variant="contained">Submit</Button>
      </form>
    </div>
  );
}