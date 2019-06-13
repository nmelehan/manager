import { intersection, pathOr } from 'ramda';
import * as React from 'react';
import { compose } from 'recompose';
import CheckBox from 'src/components/CheckBox';
import {
  StyleRulesCallback,
  withStyles,
  WithStyles
} from 'src/components/core/styles';
import TableBody from 'src/components/core/TableBody';
import TableCell from 'src/components/core/TableCell';
import TableHead from 'src/components/core/TableHead';
import TableRow from 'src/components/core/TableRow';
import Grid from 'src/components/Grid';
import Paginate from 'src/components/Paginate';
import PaginationFooter from 'src/components/PaginationFooter';
import Table from 'src/components/Table';
import TableRowEmptyState from 'src/components/TableRowEmptyState';
import { DiskSelection } from './utilities';

type ClassNames = 'root' | 'tableCell' | 'labelCol' | 'sizeCol';

const styles: StyleRulesCallback<ClassNames> = theme => ({
  root: {},
  tableCell: {
    paddingTop: 0,
    paddingBottom: 0
  },
  labelCol: {
    width: '65%'
  },
  sizeCol: {
    width: '35%'
  }
});

interface Props {
  disks: Linode.Disk[];
  diskSelection: DiskSelection;
  selectedConfigIds: number[];
  handleSelect: (id: number) => void;
}

type CombinedProps = Props & WithStyles<ClassNames>;

export const Configs: React.FC<CombinedProps> = props => {
  const {
    classes,
    disks,
    diskSelection,
    selectedConfigIds,
    handleSelect
  } = props;

  return (
    <Paginate data={disks}>
      {({
        data: paginatedData,
        handlePageChange,
        handlePageSizeChange,
        page,
        pageSize,
        count
      }) => {
        return (
          <React.Fragment>
            <Grid container>
              <Grid item xs={12} md={9}>
                <Table isResponsive={false} aria-label="List of Disks" border>
                  <TableHead>
                    <TableRow>
                      <TableCell className={classes.labelCol}>Label</TableCell>
                      <TableCell className={classes.sizeCol}>Size</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedData.length === 0 ? (
                      <TableRowEmptyState colSpan={2} />
                    ) : (
                      paginatedData.map((disk: Linode.Disk) => {
                        const isDiskSelected =
                          diskSelection[disk.id].isSelected;

                        const isConfigSelected =
                          // Is there anything in common between this disk's
                          // associatedConfigIds and the selectedConfigsIds?
                          intersection(
                            pathOr(
                              [],
                              [disk.id, 'associatedConfigIds'],
                              diskSelection
                            ),
                            selectedConfigIds
                          ).length > 0;

                        return (
                          <TableRow key={disk.id} data-qa-disk={disk.label}>
                            <TableCell className={classes.tableCell}>
                              <CheckBox
                                text={disk.label}
                                checked={isDiskSelected || isConfigSelected}
                                disabled={isConfigSelected}
                                onChange={() => handleSelect(disk.id)}
                              />
                            </TableCell>
                            <TableCell>{disk.size} MB</TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </Grid>
            </Grid>
            <PaginationFooter
              count={count}
              page={page}
              pageSize={pageSize}
              handlePageChange={handlePageChange}
              handleSizeChange={handlePageSizeChange}
              eventCategory="linode disks"
            />
          </React.Fragment>
        );
      }}
    </Paginate>
  );
};

const styled = withStyles(styles);
const enhanced = compose<CombinedProps, Props>(styled);

export default enhanced(Configs);
