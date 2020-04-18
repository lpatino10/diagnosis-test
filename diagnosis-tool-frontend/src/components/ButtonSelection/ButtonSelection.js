import React from 'react';
import './ButtonSelection.scss';

export const ButtonSelection = ({ buttonData, onSelect }) => {
  const handleClick = (evt) => {
    onSelect(evt.target.id);
  };

  return (
    <div className="button-selection">
      <div className="button-wrapper">
        {buttonData.map(data => {
          return (
            <div
              className="button"
              id={data.value}
              key={data.value}
              onClick={handleClick}
            >
              <p>{data.label}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
};
