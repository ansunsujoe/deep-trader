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
                <p>Image</p>
              </Col>
              <Col xs={8}>
                <Typography>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                  sit amet blandit leo lobortis eget.
                </Typography>
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
