import React, { useState, useEffect } from 'react';
import './LeftNav.css';

const LeftNavList = props => {
  const [item, setItem] = useState(props.item);
  useEffect(() => {
    setItem(props.item);
  }, [props.item]);

  const [className, setClassName] = useState(props.className);
  useEffect(() => {
    setClassName(props.className);
  }, [props.className]);

  return (
    <div className={className} onClick={e => props.onItemClick({...item})}>
      {item.name}
    </div>
  );
};

export default LeftNavList;