import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  AutoSizer,
  Table as VirtualizedTable,
  Column
} from 'react-virtualized';

import HeaderRow from './HeaderRow';
import Text from '../Text';
import { connectTheme } from '../../utils';

import 'react-virtualized/styles.css';

const cellRenderer = ({ cellData }) => (
  <Text>{cellData && cellData.toString()}</Text>
);
const headerRenderer = ({ label }) => <Text>{label && label.toString()}</Text>;
cellRenderer.propTypes = { cellData: PropTypes.string };
headerRenderer.propTypes = { label: PropTypes.string };

class Table extends PureComponent {
  static get propTypes() {
    return {
      colProps: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string,
          dataKey: PropTypes.string,
          width: PropTypes.number
        })
      )
    };
  }

  static get defaultProps() {
    return {
      style: {
        bodyStyle: {},
        containerStyle: {},
        headerStyle: {}
      }
    };
  }

  render() {
    const {
      colProps,
      tableData,
      style: { containerStyle, headerStyle, bodyStyle },
      theme: {
        table: { container: containerCss, header: headerCss, body: bodyCss },
        tableRowStyle
      },
      ...tableProps
    } = this.props;

    const _colProps =
      colProps ||
      Object.entries(tableData[0]).map(keyValuePair => ({
        label: keyValuePair[0],
        dataKey: keyValuePair[0],
        width: 400,
        flexGrow: 1,
        cellRenderer,
        headerRenderer
      }));

    return (
      <div className={containerCss} style={containerStyle}>
        <AutoSizer disableHeight>
          {({ width }) => (
            <VirtualizedTable
              width={width}
              height={(tableData.length + 1) * 30}
              headerHeight={30}
              rowCount={tableData.length}
              rowGetter={({ index }) => tableData[index]}
              rowHeight={30}
              className={bodyCss}
              headerClassName={headerCss}
              headerStyle={headerStyle}
              rowStyle={tableRowStyle || tableProps.rowStyle}
              style={bodyStyle}
              headerRowRenderer={props => <HeaderRow {...props} />}
              {...tableProps}
            >
              {_colProps.map(colProp => (
                <Column key={`table-${colProp.dataKey}`} {...colProp} />
              ))}
            </VirtualizedTable>
          )}
        </AutoSizer>
      </div>
    );
  }
}

export default connectTheme(Table);