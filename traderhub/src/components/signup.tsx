import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import styles from '../styles/login.module.css';

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

  return (
    <div className={styles.loginform}>
      <h1>Sign Up</h1>
      <form className={classes.root} noValidate autoComplete="off">
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
      </form>
    </div>
  );
}