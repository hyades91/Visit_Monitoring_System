import React from 'react';
import PropTypes from 'prop-types';
import Spin from './Spin';

const Loading = props => (
  <Spin {...props} />
);

Loading.propTypes = {
  background: PropTypes.string,
  color: PropTypes.string,
  duration: PropTypes.number,
  size: PropTypes.number,
};

Loading.defaultProps = {
  background: '#f5f5f5',
  color: '#002c41',
  duration: 1.4,
  size: 12,
};

export default Loading;
