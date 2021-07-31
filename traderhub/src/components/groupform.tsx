import React, { useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import styles from '../styles/login.module.css';
import { useHistory } from "react-router-dom";
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

export default function GroupForm() {
  const classes = useStyles();
  let history = useHistory();

  // Use states
  const [name, setName] = useState(null);

  const handleSubmit = e => {
    e.preventDefault();
    const data = {
      name: name,
    };

    axios.defaults.withCredentials = true;
    axios.post('http://localhost:5001/watchlist', data, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      console.log("SUCCESS", response);
      history.push("/groups");
    }).catch(error => {
      console.log(error);
    })
  }

  function handleNameChange(e) {
    setName(e.target.value);
  }

  return (
    <div className={styles.loginform}>
      <h1>Login</h1>
      <form className={classes.root} noValidate autoComplete="off" onSubmit={handleSubmit}>
        <div>
          <TextField
            id="outlined-error"
            label="Watchlist Name"
            placeholder="Name"
            variant="outlined"
            onChange={handleNameChange}
          />
        </div>
      </form>
    </div>
  );
}