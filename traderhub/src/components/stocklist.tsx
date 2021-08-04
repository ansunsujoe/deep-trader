import React, { useState, useEffect } from 'react';
import styles from '../styles/dashboard.module.css';
import Navbar from './navbar';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import TickerTable from './tickerTable';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import { useHistory } from 'react-router-dom';

export default function StockList() {
  let history = useHistory();
  const [admin, setAdmin] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newStock, setNewStock] = useState(null);
  const [dialogError, setDialogError] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [tickerDesc, setTickerDesc] = useState("");

  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios.get('http://localhost:5001/currentuser').then(response => {
      setAdmin(response.data.admin);
    }).catch(error => {
      console.log(error);
    })
  }, []);

  const handleDialogOpen = () => {
    setDialogOpen(true);
  }

  const handleDialogClose = () => {
    setDialogOpen(false);
  }

  function handleNewStockChange(e: any) {
    setNewStock(e.target.value);
  }

  const handleDescChange = (e) => {
    setTickerDesc(e.target.value);
  }

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  }

  const handleNewStockSubmit = (e: any) => {
    e.preventDefault();
    let formdata = new FormData();
    formdata.append('image', imageFile);
    formdata.append('ticker', newStock);
    formdata.append('desc', tickerDesc);

    // Make request to insert watchlist
    axios.defaults.withCredentials = true;
    axios.post('http://localhost:5001/tickers', formdata, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(response => {
      if (response.status === 200) {
        history.push("/dashboard");
      }
      else {
        setDialogError(true);
      }
    }).catch(error => {
      console.log(error);
    })
  }

  return (
    <div>
      <Navbar />
      <div className={styles.container}>
        <Dialog open={dialogOpen} onClose={handleDialogClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">New Ticker</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Enter a ticker name for a new stock to trade.
            </DialogContentText>
            <TextField
              error={dialogError}
              autoFocus
              margin="dense"
              id="name"
              label="Ticker Name"
              type="name"
              fullWidth
              onChange={handleNewStockChange}
            />
            {dialogError ? (
              <p>The ticker does not exist.</p>
            ) : undefined}
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Description"
              type="name"
              fullWidth
              onChange={handleDescChange}
            />
            <Button
              variant="contained"
              component="label"
              color="primary"
            >
              Upload Image
              <input type="file" hidden onChange={handleImageChange} />
            </Button>

          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleNewStockSubmit} color="primary">
              Create
            </Button>
          </DialogActions>
        </Dialog>
        <Container fluid>
          <Row>
            <Col>
              <Card style={{ border: "none", boxShadow: "none" }}>
                <CardContent>
                  <h1>All Stocks</h1>
                </CardContent>
              </Card>
            </Col>
          </Row>
          <Card style={{ border: "none", boxShadow: "none" }}>
            <CardContent>
              <TickerTable admin={admin} />
            </CardContent>
          </Card>
          {admin ? (
            <Button variant="contained" color="primary" className="m-3" onClick={handleDialogOpen}>Add Stock</Button>
          ) : undefined}
        </Container>
      </div>
    </div>
  );
}