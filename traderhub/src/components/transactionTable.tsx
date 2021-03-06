import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import SearchBar from "material-ui-search-bar";
import axios from "axios";

interface Column {
  id: 'time' | 'ticker' | 'action' | 'shares' | 'price';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

const columns: Column[] = [
  { id: 'time', label: 'Time', minWidth: 170 },
  { id: 'ticker', label: 'Ticker', minWidth: 100 },
  {
    id: 'action',
    label: 'Action',
    minWidth: 100,
  },
  {
    id: 'shares',
    label: 'Shares',
    minWidth: 100,
  },
  {
    id: 'price',
    label: 'Price',
    minWidth: 170,
    format: (value: number) => value.toFixed(2),
  },
];

interface Transaction {
  time: string;
  ticker: string;
  action: string;
  shares: number;
  price: number;
}

function createData(time: string, ticker: string, action: string, shares: number, price: number): Transaction {
  return { time, ticker, action, shares, price};
}

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 440,
  },
});

export default function TransactionTable(props) {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [searched, setSearched] = useState<string>("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [originalRows, setOriginalRows] = useState<Transaction[]>([]);
  const [rows, setRows] = useState<Transaction[]>([]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const requestSearch = (searchedVal: string) => {
    const filteredRows = originalRows.filter((row) => {
      return row.ticker.toLowerCase().includes(searchedVal.toLowerCase());
    });
    setRows(filteredRows);
  };

  const cancelSearch = () => {
    setSearched("");
    requestSearch(searched);
  };

  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios.get('http://localhost:5001/transactions/' + props.action).then(response => {
      setOriginalRows(response.data);
      setRows(response.data);
    }).catch(error => {
      console.log(error);
    })
  }, [])

  return (
    <Paper className={classes.root}>
      <SearchBar
          value={searched}
          onChange={(searchVal) => requestSearch(searchVal)}
          onCancelSearch={() => cancelSearch()}
        />
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.time}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format && typeof value === 'number' ? column.format(value) : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
}