import React, { useState, useEffect } from 'react';
import styles from '../styles/dashboard.module.css';
import Navbar from './navbar';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionActions from '@material-ui/core/AccordionActions';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider';
import axios from 'axios';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
  }),
);

export default function Groups() {
  const classes = useStyles();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState(null);
  const [data, setData] = useState([])

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

    // Make request to insert watchlist
    axios.defaults.withCredentials = true;
    axios.post('http://localhost:5001/watchlist', data, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      setDialogOpen(false);
      axios.get('http://localhost:5001/watchlist').then(response => {
        setData(response.data.watchlists);
      }).catch(error => {
        console.log(error);
      })
    }).catch(error => {
      console.log(error);
    })
  }

  // When the loading prop changes, get all watchlist items
  useEffect(() => {
    axios.get('http://localhost:5001/watchlist').then(response => {
      console.log("SUCCESS", response);
      setData(response.data.watchlists);
    }).catch(error => {
      console.log(error);
    });
  }, []);

  return (
    <div className={classes.root}>
      <Navbar />
      <div className={styles.container}>
        <Dialog open={dialogOpen} onClose={handleDialogClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Watchlist</DialogTitle>
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
              {data.map((entry) => (
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography className={classes.heading}>{entry.name}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Row>
                      <Col xs={4}>
                        <Typography>
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                          sit amet blandit leo lobortis eget.
                        </Typography>
                      </Col>
                      <Col xs={8}>
                        <Row>
                          {entry.stocks.map((stock) => (
                            <Col md={4} xs={6}>
                              <Card>
                                <CardContent>
                                  <Container fluid>
                                    <Row>
                                      <Col xs={5} className="p-0">
                                        <h4 className="m-0">{stock.ticker}</h4>
                                      </Col>
                                      <Col xs={5}>
                                        <h4 className={styles.price}>${stock.price}</h4>
                                      </Col>
                                      <Col xs={2}>
                                        <Button color="secondary">X</Button>
                                      </Col>
                                    </Row>
                                  </Container>
                                </CardContent>
                              </Card>
                            </Col>
                          ))}
                        </Row>
                      </Col>
                    </Row>
                  </AccordionDetails>
                  <Divider />
                  <AccordionActions>
                    <Button size="small">Edit Image</Button>
                    <Button size="small" color="secondary">
                      Delete
                    </Button>
                  </AccordionActions>
                </Accordion>
              ))}
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