import React from 'react';
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

  const handleSubmit = e => {
    e.preventDefault();
    axios.get('http://localhost:5001').then(response => {
      console.log("SUCCESS", response);
      alert("Successfully got update from App");
    }).catch(error => {
      console.log(error);
    })
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
          />
        </div>
        <div>
          <TextField
            id="outlined-error"
            label="Username"
            placeholder="Username"
            variant="outlined"
          />
        </div>
        <div>
          <TextField
            id="outlined-error"
            label="Password"
            placeholder="Password"
            helperText="Must contain 8+ characters, 1+ numbers, 1+ special characters"
            variant="outlined"
          />
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
}