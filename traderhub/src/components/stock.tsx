import React, { useState, useEffect } from 'react';
import styles from '../styles/dashboard.module.css';
import stockstyles from '../styles/stock.module.css';
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
import { Badge } from 'react-bootstrap';
import axios from 'axios';
import { useParams, useHistory } from "react-router-dom";
import { getDate } from '../modules/getDate';

export default function Stock() {
  axios.defaults.withCredentials = true;
  let history = useHistory();

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
  const [isActive, setIsActive] = useState(true);
  const [description, setDescription] = useState("");

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

  const handleWatchlistChange = (e) => {
    setWatchlist(e.target.value);
  }

  const handleWatchlistSubmit = (e: any) => {
    e.preventDefault();
    const data = {
      tickerId: id,
      watchlist: watchlist
    };
    axios.post('http://localhost:5001/watchlistItem', data, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      console.log("SUCCESS", response);
      if (response.status === 200) {
        initialize();
      }
    }).catch(error => {
      console.log(error);
    })
  }

  function modifyAsset(data) {
    axios.put('http://localhost:5001/asset', data, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      console.log("SUCCESS", response);
      if (response.status === 200) {
        history.push("/dashboard");
      }
    }).catch(error => {
      console.log(error);
    })
  }

  const handleBuySubmit = (e: any) => {
    e.preventDefault();
    const data = {
      tickerId: id,
      currentPrice: price,
      currentShares: shares,
      shareChange: currentBuy,
      action: "buy"
    };
    modifyAsset(data);
  }

  const handleSellSubmit = (e: any) => {
    e.preventDefault();
    const data = {
      tickerId: id,
      currentPrice: price,
      currentShares: shares,
      shareChange: currentSell,
      action: "sell"
    };
    modifyAsset(data);
  }

  function initialize() {
    axios.get('http://localhost:5001/stock/' + id).then(response => {
      setTicker(response.data.ticker);
      setIsActive(response.data.isActive);
      setPrice(response.data.price);
      setMaxBuy(response.data.maxBuy);
      setWatchlists(response.data.watchlists);
      setTimeseries(response.data.timeseries);
      setShares(response.data.shares);
      setDescription(response.data.desc);
    }).catch(error => {
      console.log(error);
    })
  }

  useEffect(() => {
    initialize();
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
                      <h1>{ticker} <Badge color="primary">New</Badge></h1>
                      <p className={styles.date}>{getDate()}</p>
                    </Col>
                    <Col className={styles.rightprice}>
                      <h1 className={styles.number}>${price}</h1>
                      <p className={styles.subtitle}>Per Share</p>
                    </Col>
                  </Row>

                </CardContent>
              </Card>
              <Row>
                {description.length > 0 ? (
                  <Col>
                    <p className={styles.subtitle}>About</p>
                    <p>{description}</p>
                  </Col>
                ) : undefined}
              </Row>
              <Row>
                <Col>
                  <Card variant="outlined" style={{ border: "none", boxShadow: "none" }}>
                    <CardContent>
                      <Timeseries data={timeseries} />
                    </CardContent>
                  </Card>
                  <Card variant="outlined" className="mt-4">
                    <CardContent>
                      <Row>
                        <Col>
                          <p className={styles.subtitle}>Add to Watchlist</p>
                          <form noValidate autoComplete="off" onSubmit={handleWatchlistSubmit}>
                            <div>
                              <InputLabel className="mt-2" id="demo-simple-select-label">Watchlist</InputLabel>
                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={watchlist}
                                className="mt-2"
                                onChange={handleWatchlistChange}
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
                      <form noValidate autoComplete="off" onSubmit={handleBuySubmit}>
                        <div className={stockstyles.formmargin}>
                          <Slider
                            disabled={!isActive}
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
                        <p>Current Purchase: ${Math.round(currentBuy * price * 100) / 100}</p>
                        <Button color="primary" variant="contained" type="submit" disabled={buyDisabled}>Buy</Button>
                      </form>
                    </CardContent>
                  </Card>
                  <Card variant="outlined" className="mt-4">
                    <CardContent>
                      <p className={styles.subtitle}>Sell</p>
                      <p>Maximum Shares: {shares}</p>
                      <form noValidate autoComplete="off" onSubmit={handleSellSubmit}>
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
                        <p>Cash Added: ${Math.round(currentSell * price * 100) / 100}</p>
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