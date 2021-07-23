import React, { useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import styles from '../styles/login.module.css';
import axios from 'axios';

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

export default function Signup() {
  const classes = useStyles();

  // Use states
  const [name, setName] = useState(null);
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);

  const handleSubmit = e => {
    e.preventDefault();
    const data = {
      name: name,
      username: username,
      password: password
    }
    axios.post('http://localhost:5001', {data}).then(response => {
      console.log("SUCCESS", response);
      alert("Successfully got update from App");
    }).catch(error => {
      console.log(error);
    })
  }

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleUsernameChange(e) {
    setUsername(e.target.value);
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  return (
    <div className={styles.loginform}>
      <h1>Sign Up</h1>
      <form className={classes.root} noValidate autoComplete="off" onSubmit={handleSubmit}>
        <div>
          <TextField
            id="outlined-error"
            label="Full Name"
            placeholder="Full Name"
            variant="outlined"
            onChange={handleNameChange}
          />
        </div>
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
            helperText="Must contain 8+ characters, 1+ numbers, 1+ special characters"
            variant="outlined"
            onChange={handlePasswordChange}
          />
        </div>
        <Button color="primary" type="submit">Submit</Button>
      </form>
    </div>
  );
}