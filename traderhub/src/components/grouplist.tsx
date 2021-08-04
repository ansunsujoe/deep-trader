import React, { useState, useEffect } from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Divider from '@material-ui/core/Divider';
import AccordionActions from '@material-ui/core/AccordionActions';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Container from 'react-bootstrap/Container';
import styles from '../styles/dashboard.module.css';

import axios from 'axios';

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

export default function GroupList(props) {
  const classes = useStyles();
  const [data, setData] = useState([]);

  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios.get('http://localhost:5001/watchlist').then(response => {
      console.log("SUCCESS", response);
      setData(response.data.watchlists);
    }).catch(error => {
      console.log(error);
    })
  }, [])

  return (
    <div className={classes.root}>
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
                              <Col className="p-0">
                                <h4 className="m-0">{stock.ticker}</h4>
                              </Col>
                              <Col>
                                <h4 className={styles.price}>${stock.price}</h4>
                              </Col>
                              <Col>
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
    </div>
  );
}
