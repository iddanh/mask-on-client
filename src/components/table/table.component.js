import React from 'react';

import './table.style.scss';

export default function Table({ meta, onRatioChange }) {
  const total = meta.reduce((partialSum, a) => partialSum + a, 0);
  const ratio = total > 0 ? (meta[0] / total) * 100 : 0;

  React.useEffect(() => {
    if (total > 0) {
      onRatioChange(ratio);
    }
  }, [meta, ratio]);

  return (
    <table>
      <tbody>
      <tr>
        <td>Detected faces:</td>
        <td>{total}</td>
      </tr>
      <tr>
        <td>Correctly masked:</td>
        <td>{meta[0]}</td>
      </tr>
      <tr>
        <td>Incorrectly masked:</td>
        <td>{meta[1]}</td>
      </tr>
      <tr>
        <td>No Mask:</td>
        <td>{meta[2]}</td>
      </tr>
      <tr>
        <td>Ratio:</td>
        <td>{ratio}%</td>
      </tr>
      </tbody>
    </table>
  );
}
