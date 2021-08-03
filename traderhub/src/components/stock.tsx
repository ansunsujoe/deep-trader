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
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Slider from '@material-ui/core/Slider';
import Select from '@material-ui/core/Select';
import Timeseries from './timeseries';
import { useParams } from "react-router-dom";

export default function Stock() {
  const [ticker, setTicker] = useState("");
  const [price, setPrice] = useState(0);
  const [maxBuy, setMaxBuy] = useState(0);
  const [watchlists, setWatchlists] = useState([]);
  const [watchlist, setWatchlist] = useState("");
  const [timeseries, setTimeseries] = useState([]);
  const [shares, setShares] = useState(0);
  const [buyDisabled, setBuyDisabled] = useState(true);
  const [sellDisabled, setSellDisabled] = useState(true);
  const [currentBuy, setCurrentBuy] = useState(0);
  const [currentSell, setCurrentSell] = useState(0);

  type StockParams = {
    id: string;
  };

  const { id } = useParams<StockParams>();

  const handleBuyChange = (e, val) => {
    setCurrentBuy(val);
    if (val === 0) {
      setBuyDisabled(true);
    }
    else {
      setBuyDisabled(false);
    }
  }

  const handleSellChange = (e, val) => {
    setCurrentSell(val);
    if (val === 0) {
      setSellDisabled(true);
    }
    else {
      setSellDisabled(false);
    }
  }

  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios.get('http://localhost:5001/stock/' + id).then(response => {
      setTicker(response.data.ticker);
      setPrice(response.data.price);
      setMaxBuy(response.data.maxBuy);
      setWatchlists(response.data.watchlists);
      setTimeseries(response.data.timeseries);
      setShares(response.data.shares);
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
                      <h1>{ticker}</h1>
                      <p className={styles.date}>July 27, 2021</p>
                    </Col>
                    <Col className={styles.rightprice}>
                      <h1 className={styles.number}>${price}</h1>
                      <p className={styles.subtitle}>Per Share</p>
                    </Col>
                  </Row>

                </CardContent>
              </Card>
              <Row>
                <Col>
                  <Card variant="outlined" style={{ border: "none", boxShadow: "none" }}>
                    <CardContent>
                      <Timeseries data={timeseries}/>
                    </CardContent>
                  </Card>
                  <Card variant="outlined" className="mt-4">
                    <CardContent>
                      <Row>
                        <Col>
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
                                {watchlists.map((entry) => (
                                  <MenuItem value={entry}>{entry}</MenuItem>
                                ))}
                              </Select>
                            </div>

                            <Button className="mt-3" color="primary" variant="contained" type="submit">Add</Button>
                          </form>
                        </Col>
                      </Row>
                    </CardContent>
                  </Card>
                </Col>
                <Col>
                  <Card variant="outlined">
                    <CardContent>
                      <p className={styles.subtitle}>Buy</p>
                      <p>Maximum Shares: {maxBuy}</p>
                      <form noValidate autoComplete="off">
                        <div className={stockstyles.formmargin}>
                          <Slider
                            defaultValue={0}
                            aria-labelledby="discrete-slider-always"
                            step={1}
                            marks
                            min={0}
                            max={maxBuy}
                            valueLabelDisplay="on"
                            onChange={handleBuyChange}
                          />
                        </div>
                        <p>Current Purchase: ${currentBuy * price}</p>
                        <Button color="primary" variant="contained" type="submit" disabled={buyDisabled}>Buy</Button>
                      </form>
                    </CardContent>
                  </Card>
                  <Card variant="outlined" className="mt-4">
                    <CardContent>
                      <p className={styles.subtitle}>Sell</p>
                      <p>Maximum Shares: {shares}</p>
                      <form noValidate autoComplete="off">
                        <div className={stockstyles.formmargin}>
                          <Slider
                            defaultValue={0}
                            aria-labelledby="discrete-slider-always"
                            step={1}
                            marks
                            min={0}
                            max={shares}
                            valueLabelDisplay="on"
                            color="secondary"
                            onChange={handleSellChange}
                          />
                        </div>
                        <p>Cash Added: ${currentSell * price}</p>
                        <Button color="secondary" variant="contained" type="submit" disabled={sellDisabled}>Sell</Button>
                      </form>
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