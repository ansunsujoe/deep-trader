import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import {useHistory} from "react-router-dom";
import styles from '../styles/dashboard.module.css';

import {
  Link
} from "react-router-dom";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    title: {
      flexGrow: 1,
    },
  }),
);

export default function Navbar() {
  const classes = useStyles();
  let history = useHistory();

  const handleLogout = e => {
    axios.get('http://localhost:5001/logout').then(response => {
      console.log("SUCCESS", response);
      history.push("/");
    }).catch(error => {
      console.log(error);
    })
  }

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Trader Hub
          </Typography>
          <Link to="/dashboard" className={styles.navlink}>
            <Button color="inherit">
              Home
            </Button>
          </Link>
          <Link to="/stocklist" className={styles.navlink}>
            <Button color="inherit">
              Stocks
            </Button>
          </Link>
          <Link to="/groups" className={styles.navlink}>
            <Button color="inherit">
              My Groups
            </Button>
          </Link>
          <Link to="/transactions" className={styles.navlink}>
            <Button color="inherit">
              Transactions
            </Button>
          </Link>
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}