import React, { useState, useEffect } from 'react';
import styles from '../styles/dashboard.module.css';
import Navbar from './navbar';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import GroupList from './grouplist';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import {useHistory} from "react-router-dom";

export default function Groups() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState(null);
  let history = useHistory()

  const handleDialogOpen = () => {
    setDialogOpen(true);
  }

  const handleDialogClose = () => {
    setDialogOpen(false);
  }

  function handleNameChange(e: any) {
    setName(e.target.value);
  }

  const handleWatchlistSubmit = (e: any) => {
    e.preventDefault();
    const data = {
      name: name
    };

    axios.post('http://localhost:5001/watchlist', data, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      console.log("SUCCESS", response);
      setDialogOpen(false);
      history.push("/groups");
    }).catch(error => {
      console.log(error);
    })
  }

  return (
    <div>
      <Navbar />
      <div className={styles.container}>
        <Dialog open={dialogOpen} onClose={handleDialogClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Enter a name for a new watchlist that you would like to create.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Watchlist Name"
              type="name"
              fullWidth
              onChange={handleNameChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleWatchlistSubmit} color="primary">
              Create
            </Button>
          </DialogActions>
        </Dialog>
        <Container fluid>
          <Row>
            <Col>
              <Card style={{ border: "none", boxShadow: "none" }}>
                <CardContent>
                  <h1>My Watchlists</h1>
                </CardContent>
              </Card>
            </Col>
          </Row>
          <Card style={{ border: "none", boxShadow: "none" }}>
            <CardContent>
              <GroupList />
              <Button variant="contained" color="primary" className="mt-4" onClick={handleDialogOpen}>
                Create Watchlist
              </Button>
            </CardContent>
          </Card>
        </Container>
      </div>
    </div>
  );
}