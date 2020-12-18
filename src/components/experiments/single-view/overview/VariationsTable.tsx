import { Chip, Tooltip, Typography } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import React from 'react'

import { ExperimentFull, nameSchema } from 'src/lib/schemas'
import * as Variations from 'src/lib/variations'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& th, & td': {
        paddingLeft: 0,
      },
    },
    default: {
      color: theme.palette.grey[500],
    },
    defaultLabel: {},
    variation: {
      borderBottomWidth: 1,
      borderBottomStyle: 'dashed',
      borderBottomColor: theme.palette.grey[500],
    },
    tooltip: {
      maxWidth: '500px',
      padding: theme.spacing(2),
      '& a:link': {
        color: '#cee6f8',
      },
    },
    monospace: {
      fontFamily: theme.custom.fonts.monospace,
    },
  }),
)

function assignmentHref(variationName: string, experimentName: string) {
  nameSchema.validateSync(variationName)
  nameSchema.validateSync(experimentName)
  return `javascript:(async () => {
    const token = JSON.parse(localStorage.getItem('experiments_auth_info'));
    const headers = {'Content-Type': 'application/json'};
    if(token && token.accessToken) {
       headers.Authorization = 'Bearer ' + token['accessToken'];
    }
    const response = await fetch(
      'https://public-api.wordpress.com/wpcom/v2/experiments/0.1.0/assignments', 
      {
        credentials: 'include', 
        method: 'PATCH', 
        headers, 
        body: JSON.stringify({variations: {${experimentName}: '${variationName}'}})
      }
    );
    const responseBody = await response.json();
    switch (responseBody.code) {
      case 'variation_not_found':
        alert('The variation was not found, please update your bookmark');
        break;
      case 'experiment_not_found':
        alert('The experiment is disabled, please update your bookmark');
        break;
      case 'user_not_assignable':
        alert('You must be proxied or sandboxed to use this bookmark');
        break;
      default:
        if (!responseBody.variations) {
          alert('An unknown error occurred: ' + responseBody.message);
          break;
        }
        const duration = responseBody.duration === 'unlimited' ?
          responseBody.duration : Math.ceil(responseBody.duration / 60 / 60);
        if(responseBody.storage_method === 'user_attribute') {
          alert('Your logged in user has been assigned to ' + responseBody.variations.${experimentName} + '. If you want to assign a different user, run this bookmarklet outside of Abacus.');
        } else {
          alert('Your current session has been assigned to ' + responseBody.variations.${experimentName} + ' for ' + duration + ' hours via cookie.');
        }
    }
})()`
}

function dangerousAssignmentLink(variationName: string, experimentName: string) {
  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __html: `<a href="${assignmentHref(variationName, experimentName)}">${variationName} - ${experimentName}</a>`,
  }
}

/**
 * Renders the variations in tabular formation, in the order that they're given.
 *
 * @param variations - The variations to render.
 */
function VariationsTable({
  experiment: { variations, name: experimentName },
}: {
  experiment: ExperimentFull
}): JSX.Element {
  const classes = useStyles()
  return (
    <Table className={classes.root}>
      <TableHead>
        <TableRow>
          <TableCell component='th' variant='head'>
            Name
          </TableCell>
          <TableCell component='th' variant='head'>
            Percent
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {Variations.sort(variations).map((variation) => {
          return (
            <TableRow key={variation.variationId}>
              <TableCell className={classes.monospace}>
                <Tooltip
                  interactive
                  arrow
                  placement={'left'}
                  classes={{
                    popper: classes.tooltip,
                  }}
                  title={
                    <>
                      <Typography color='inherit' variant='body1' gutterBottom>
                        Drag this link to your bookmarks to make it easier to switch between active variations:
                      </Typography>
                      <Typography
                        color='inherit'
                        variant='body1'
                        dangerouslySetInnerHTML={dangerousAssignmentLink(variation.name, experimentName)}
                      />
                    </>
                  }
                >
                  <span className={classes.variation}>{variation.name}</span>
                </Tooltip>{' '}
                {variation.isDefault && <Chip label='Default' variant='outlined' disabled />}
              </TableCell>
              <TableCell className={classes.monospace}>{variation.allocatedPercentage}%</TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

export default VariationsTable
