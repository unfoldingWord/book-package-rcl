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
import CircularProgress from '@material-ui/core/CircularProgress';

import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';

import {fetchBookPackageStrongs} from './helpers';
import {validateInputProperties, convertToLink} from './helpers';


function BookPackageStrongs({
  bookId,
  chapter,
  clearFlag,
  classes,
  style,
}) 
{
  const [_book, setVal] = useState(<CircularProgress />);
  useEffect( () => {
    const result = validateInputProperties(bookId, chapter);
    let chlist = chapter ? chapter : "(ALL)";
    if ( ! result ) {
      setVal(
        <Paper className={classes.paper} >
          <Typography variant="h5" gutterBottom>
            Invalid Book "{bookId.toUpperCase()}" 
            or Chapter(s) {chlist}
          </Typography> 
        </Paper>
      );
      return;
    }

    const fetchData = async () => {
      let result;
      try {
        result = await fetchBookPackageStrongs(
          {username: 'unfoldingword', languageId:'en', 
          bookId: bookId, chapters: chapter, clearFlag: clearFlag
        });  
      } catch (error) {
        setVal(
          <div>
            {error.message}
          </div>
        )
        return;
      }
      let gkeys = Array.from(Object.keys(result.summary_ref_map));
      let rootTitle = 'Lexicon Word Count: '+ result.grandTotalWordCount.toLocaleString();
      //let bodyTitle = 'Details'
      setVal(
        <Paper className={classes.paper} >
          <TreeView
            className={classes.root}
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
          >

            <TreeItem nodeId="1" label={rootTitle}>
              <Typography variant="body2" gutterBottom>
                <i>Linked entries:<b>{result.distinctReferences} unique</b>, {result.totalReferences} total links</i>
              </Typography>
                <Table className={classes.table} size="small" aria-label="a dense table" >
                  <TableHead>
                    <TableRow>
                      <TableCell>Strongs Entry</TableCell>
                      <TableCell align="center">Reference Count</TableCell>
                      <TableCell align="center">Word Count</TableCell>
                      <TableCell align="center">Unique Words</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {gkeys.sort().map(skey => (
                      <TableRow key={skey}>
                        <TableCell component="th" scope="row">
                          <Link href={convertToLink(skey,bookId)} target="_blank" rel="noopener" >
                            {skey}
                          </Link>
                        </TableCell>
                        <TableCell align="center">{result.summary_ref_map[skey]}</TableCell>
                        <TableCell align="center">{result.detail_article_map[skey] ? result.detail_article_map[skey]['total'] : 'Non Existent'}</TableCell>
                        <TableCell align="center">{result.detail_article_map[skey] ? result.detail_article_map[skey]['distinct'] : 'Non Existent'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
            </TreeItem>
          
          </TreeView>

        </Paper>
      );  
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
  /** Optional flag to clear and refetch all data. Default is true. */
  clearFlag: PropTypes.bool,
  /** The overriding CSS for this component */
  style: PropTypes.object,
};

const styles = theme => ({
  root: {
  },
});

export default withStyles(styles)(BookPackageStrongs);