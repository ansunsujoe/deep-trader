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

export default function GroupForm() {
  const classes = useStyles();

  return (
    <div className={styles.loginform}>
      <h1>Login</h1>
      <form className={classes.root} noValidate autoComplete="off">
        <div>
          <TextField
            id="outlined-error"
            label="Watchlist Name"
            placeholder="Name"
            variant="outlined"
          />
        </div>
      </form>
    </div>
  );
}