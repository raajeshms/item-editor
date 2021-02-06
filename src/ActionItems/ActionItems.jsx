import React, { useState, useEffect } from 'react';
import './ActionItems.css';

const ActionItems = props => {
  const [item, setItem] = useState(props);
  useEffect(() => {
    console.log(item);
    setItem(props);
  }, [props]);

  return (
    <div className="action-items">
      <button className="action action-undo">Undo</button>
      <button className="action action-redo">Redo</button>
      <button className="action action-save">Save</button>
      <button className="action action-cancel">Cancel</button>
    </div>
  );
};

export default ActionItems;
