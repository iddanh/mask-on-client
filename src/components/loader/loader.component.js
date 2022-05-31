import React from 'react';

import './loader.style.scss';

export default function Loader() {
  return (
    <div className="loader">
      {[...Array(20)].map((x, i) =>
        <div className="dot" key={i} />
      )}
    </div>
  );
}
