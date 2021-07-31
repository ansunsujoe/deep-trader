import React, { useState, useEffect } from 'react';
import styles from '../styles/dashboard.module.css';
import stockstyles from '../styles/stock.module.css';
import axios from 'axios';
import Navbar from './navbar';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import NetWorthChart from './networth';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Slider from '@material-ui/core/Slider';
import Select from '@material-ui/core/Select';
import { useParams } from "react-router-dom";

export default function Stock() {
  const [watchlist, setWatchlist] = useState('');

  type StockParams = {
    id: string;
  };

  const { id } = useParams<StockParams>();

  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios.get('http://localhost:5001').then(response => {
      console.log("SUCCESS", response);
      alert("Successfully got update from App");
    }).catch(error => {
      console.log(error);
    })
  }, []);

  return (
    <div>
      <Navbar />
      <div className={styles.container}>
        <Container fluid>
          <Row>
            <Col>
              <Card style={{ border: "none", boxShadow: "none" }}>
                <CardContent>
                  <Row>
                    <Col>
                      <h1>ID {id}</h1>
                      <p className={styles.date}>July 27, 2021</p>
                    </Col>
                    <Col className={styles.rightprice}>
                      <h1 className={styles.number}>$31,487</h1>
                      <p className={styles.subtitle}>Per Share</p>
                    </Col>
                  </Row>

                </CardContent>
              </Card>
              <Row>
                <Col>
                  <Card variant="outlined" style={{ border: "none", boxShadow: "none" }}>
                    <CardContent>
                      <NetWorthChart />
                    </CardContent>
                  </Card>
                </Col>
                <Col>
                  <Card variant="outlined">
                    <CardContent>
                      <p className={styles.subtitle}>Buy</p>
                      <p>Maximum Shares: 110</p>
                      <form noValidate autoComplete="off">
                        <div className={stockstyles.formmargin}>
                          <Slider
                            defaultValue={0}
                            aria-labelledby="discrete-slider-always"
                            step={1}
                            marks
                            min={0}
                            max={110}
                            valueLabelDisplay="on"
                          />
                        </div>
                        <p>Current Purchase: $572.22</p>
                        <Button color="primary" variant="contained" type="submit">Buy</Button>
                      </form>
                    </CardContent>
                  </Card>
                  <Card variant="outlined" className="mt-4">
                    <CardContent>
                      <p className={styles.subtitle}>Sell</p>
                      <p>Maximum Shares: 5</p>
                      <form noValidate autoComplete="off">
                        <div className={stockstyles.formmargin}>
                          <Slider
                            defaultValue={0}
                            aria-labelledby="discrete-slider-always"
                            step={1}
                            marks
                            min={0}
                            max={5}
                            valueLabelDisplay="on"
                            color="secondary"
                          />
                        </div>
                        <p>Cash Added: $572.22</p>
                        <Button color="secondary" variant="contained" type="submit">Sell</Button>
                      </form>
                    </CardContent>
                  </Card>
                  <Card variant="outlined" className="mt-4">
                    <CardContent>
                      <Row>
                        <Col md={6}>
                          <p className={styles.subtitle}>Add to Watchlist</p>
                          <form noValidate autoComplete="off">
                            <div>
                              <InputLabel className="mt-2" id="demo-simple-select-label">Watchlist</InputLabel>
                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={watchlist}
                                className="mt-2"
                              >
                                <MenuItem value={10}>Ten</MenuItem>
                                <MenuItem value={20}>Twenty</MenuItem>
                                <MenuItem value={30}>Thirty</MenuItem>
                              </Select>
                            </div>

                            <Button className="mt-3" color="primary" variant="contained" type="submit">Add</Button>
                          </form>
                        </Col>
                        <Col md={6}>
                          <p className={styles.subtitle}>Remove from Watchlist</p>
                          <form noValidate autoComplete="off">
                            <div>
                              <InputLabel className="mt-2" id="demo-simple-select-label">Watchlist</InputLabel>
                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={watchlist}
                                className="mt-2"
                                color="secondary"
                              >
                                <MenuItem value={10}>Ten</MenuItem>
                                <MenuItem value={20}>Twenty</MenuItem>
                                <MenuItem value={30}>Thirty</MenuItem>
                              </Select>
                            </div>

                            <Button className="mt-3" color="secondary" variant="contained" type="submit">Remove</Button>
                          </form>
                        </Col>
                      </Row>

                    </CardContent>
                  </Card>
                </Col>
              </Row>
              <Row>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}