import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Link } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

import {fetchBookPackageStrongs} from './helpers';

function convertRC2Link(lnk) {
  const ugl_path = 'https://git.door43.org/unfoldingWord/en_ugl/src/branch/master/content/';
  //const uhal_path = 'https://git.door43.org/unfoldingWord/en_uhal/src/branch/master/content/';
  let s = lnk.skey;
  s = ugl_path+lnk.skey+"/01.md";
  return s;
}

function BookPackageStrongs({
  bookId,
  chapter,
  classes,
  style,
}) 
{

  const [_book, setVal] = useState("Waiting");
  useEffect( () => {
    const fetchData = async () => {
      const result = await fetchBookPackageStrongs(
        {username: 'unfoldingword', languageId:'en', 
        bookId: bookId, chapters: chapter
      });
      let gkeys = Array.from(Object.keys(result));
      let chlist = chapter ? chapter : "(ALL)";
      setVal(
        <Paper className={classes.paper}>
          <Typography variant="h6" gutterBottom>
            Lexicon Entries for "{bookId.toUpperCase()}" 
            and Chapters {chlist}
          </Typography>
          <Typography variant="body2" gutterBottom>
            Distinct Number of Entries: {gkeys.length}
          </Typography>
          <Table className={classes.table} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell>Strongs Entry</TableCell>
                <TableCell align="center">Count</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {gkeys.map(skey => (
                <TableRow key={skey}>
                  <TableCell component="th" scope="row">
                    <Link href={convertRC2Link({skey})} target="_blank" rel="noopener" >
                      {skey}
                    </Link>
                  </TableCell>
                  <TableCell align="center">{result[skey]}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      );  
      /* debugging
      Object.keys(result).forEach(skey => (
        console.log("BP Strongs- skey:",skey,", val:",result[skey])
      ));
      */
    };
    fetchData();
  }, []); 
  // the parameter [] allows the effect to skip if value unchanged
  // an empty [] will only update on mount of component

  return (
    <div className={classes.root}>
      {_book}
    </div>
  );
};

BookPackageStrongs.propTypes = {
  /** @ignore */
  classes: PropTypes.object,
  /** The Book ID to package. */
  bookId: PropTypes.string.isRequired,
  /** Comma list of chapters to package. Default is empty string and returns all chapters of book*/
  chapter: PropTypes.string,
  /** The overriding CSS for this component */
  style: PropTypes.object,
};

const styles = theme => ({
  root: {
  },
});

export default withStyles(styles)(BookPackageStrongs);
