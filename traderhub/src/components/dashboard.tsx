import React, { useState, useEffect } from 'react';
import styles from '../styles/dashboard.module.css';
import axios from 'axios';
import Navbar from './navbar';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import NetWorthChart from './networth';
import InvestedChart from './investedchart';

interface Asset {
  ticker: string;
  shares: number;
}

export default function Dashboard() {
  const [username, setUsername] = useState(null);
  const [total, setTotal] = useState(0);
  const [cash, setCash] = useState(0);
  const [invested, setInvested] = useState(0);
  const [assets, setAssets] = useState<Asset[]>([]);

  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios.get('http://localhost:5001/traderinfo').then(response => {
      console.log(response)
      setUsername(response.data.username);
      setTotal(response.data.total);
      setCash(response.data.cash);
      setInvested(response.data.invested);
      setAssets(response.data.assets);
    }).catch(error => {
      console.log(error);
    })
  }, [])

  return (
    <div>
      <Navbar />
      <div className={styles.container}>
        <Container fluid>
          <Row>
            <Col lg={9}>
              <Card style={{ border: "none", boxShadow: "none" }}>
                <CardContent>
                  <h1>{username}'s Portfolio</h1>
                  <p className={styles.date}>July 27, 2021</p>
                </CardContent>
              </Card>
              <Row>
                <Col>
                  <Card variant="outlined" style={{ border: "none", boxShadow: "none" }}>
                    <CardContent>
                      <Container fluid>
                        <Row>
                          <Col>
                            <h1 className={styles.number}>${total}</h1>
                            <p className={styles.subtitle}>Total</p>
                          </Col>
                          <Col>
                            <h1 className={styles.number}>${cash}</h1>
                            <p className={styles.subtitle}>Buying Power</p>
                          </Col>
                          <Col>
                            <h1 className={styles.number}>${invested}</h1>
                            <p className={styles.subtitle}>Invested</p>
                          </Col>
                        </Row>
                      </Container>
                    </CardContent>
                  </Card>
                </Col>
              </Row>
              <Card variant="outlined">
                <CardContent>
                  <Row>
                    <Col xs={6}>
                      <NetWorthChart />
                    </Col>
                    <Col xs={6}>
                      <InvestedChart />
                    </Col>
                  </Row>
                </CardContent>
              </Card>
            </Col>
            <Col lg={3}>
              <Card className={styles.assets}>
                <CardContent>
                  <p>My Assets</p>
                  <Card>
                    <CardContent>
                      <Container fluid>
                        <Row>
                          <Col className="p-0">
                            <p className="m-0">TSLA</p>
                            <p className={styles.subtitle}>47 Shares</p>
                          </Col>
                          <Col>
                            <h4 className={styles.price}>$22,381</h4>
                          </Col>
                        </Row>
                      </Container>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}