import React from 'react';
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

interface Column {
  id: 'time' | 'ticker' | 'action' | 'price';
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
  price: number;
}

function createData(time: string, ticker: string, action: string, price: number): Transaction {
  return { time, ticker, action, price};
}

const originalRows = [
  createData('India', 'IN', "BUY", 3287263),
  createData('China', 'CN', "BUY", 9596961),
  createData('Italy', 'IT', "BUY", 301340),
  createData('United States', 'US', "BUY", 9833520),
  createData('Canada', 'CA', "BUY", 9984670),
  createData('Australia', 'AU', "BUY", 7692024),
  createData('Germany', 'DE', "BUY", 357578),
  createData('Ireland', 'IE', "BUY", 70273),
  createData('Mexico', 'MX', "BUY", 1972550),
  createData('Japan', 'JP', "BUY", 377973),
  createData('France', 'FR', "BUY", 640679),
  createData('United Kingdom', 'GB', "BUY", 242495),
  createData('Russia', 'RU', "BUY", 17098246),
  createData('Nigeria', 'NG', "BUY", 923768),
  createData('Brazil', 'BR', "BUY", 8515767),
];

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 440,
  },
});

export default function StickyHeadTable() {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [searched, setSearched] = React.useState<string>("");
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows, setRows] = React.useState<Transaction[]>(originalRows);

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