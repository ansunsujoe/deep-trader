import React, { useEffect } from 'react';
import styles from '../styles/dashboard.module.css';
import axios from 'axios';
import Navbar from './navbar';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import NetWorthChart from './networth';
import {
  Link
} from "react-router-dom";

export default function Transactions() {
  useEffect(() => {
    axios.get('http://localhost:5001').then(response => {
      console.log("SUCCESS", response);
      alert("Successfully got update from App");
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
            <Col md={9}>
              <Card style={{ border: "none", boxShadow: "none" }}>
                <CardContent>
                  <h1>Ansun's Portfolio</h1>
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
                            <h1 className={styles.number}>$31,487</h1>
                            <p className={styles.subtitle}>Total</p>
                          </Col>
                          <Col>
                            <h1 className={styles.number}>$22,381</h1>
                            <p className={styles.subtitle}>Buying Power</p>
                          </Col>
                          <Col>
                            <h1 className={styles.number}>$7,711</h1>
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
                  <NetWorthChart />
                </CardContent>
              </Card>
            </Col>
            <Col md={3}>
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