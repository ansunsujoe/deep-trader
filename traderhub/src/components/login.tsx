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
        margin: theme.spacing(2),
        width: 500,
      },
    },
  }),
);

export default function Login() {
  const classes = useStyles();
  let history = useHistory();

  // Use states
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);

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

    axios.post('http://localhost:5001/login', data, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      if (response.status == 200) {
        console.log("SUCCESS", response);
        history.push("/dashboard");
      }
    }).catch(error => {
      console.log(error);
    })
  }

  return (
    <div className={styles.loginform}>
      <h1>Login</h1>
      <form className={classes.root} noValidate autoComplete="off" onSubmit={handleSubmit}>
        <div>
          <TextField
            id="outlined-error"
            label="Username"
            placeholder="Username"
            variant="outlined"
            onChange={handleUsernameChange}
          />
        </div>
        <div>
          <TextField
            id="outlined-error"
            label="Password"
            placeholder="Password"
            variant="outlined"
            onChange={handlePasswordChange}
          />
        </div>
        <Button color="primary" type="submit">Submit</Button>
      </form>
    </div>
  );
}