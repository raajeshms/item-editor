import React, { useState, useEffect } from 'react';
import './MainContent.css';

const MainContent = ({currentItem, updateItem}) => {
  const [item, setItem] = useState(currentItem);
  useEffect(() => {
    function handleCurrentItemChange(item) {
      setItem(item);
    }
    handleCurrentItemChange(currentItem);
    return function cleanup() {
      handleCurrentItemChange(null);
    }
  }, [currentItem]);

  const onChange = (fieldId, value) => {
    item.fields.forEach((field) => {
      if(field.id === fieldId) {
        field.fieldValue = value;
      }
    })
    setItem(item);
    updateItem(item);
  }

  const renderFormFields = (field) => {
    switch (field.fieldType) {
      case 'text':
        return (
          <div className="text-div" key={`${item.id}-${field.id}`}>
            <div>
              <label htmlFor={`${item.id}-${field.id}`}>{field.fieldName}</label>
            </div>
            <input
              id={`${item.id}-${field.id}`}
              type="text"
              value={field.fieldValue}
              onChange={({target}) => onChange(field.id, target.value)}
            />
          </div>
        );
      case 'option':
        return (
          <div className="option-div" key={`${item.id}-${field.id}`}>
            <div>
              <label htmlFor={`${item.id}-${field.id}`}>{field.fieldName}</label>
            </div>
            <select
              id={`${item.id}-${field.id}`}
              value={field.fieldValue}
              onChange={(e) => onChange(field.id, e?.target?.value || e)}
            >
              {
                field.fieldOptions.map((opt, i) => {
                  return (<option value={opt.optionValue}>{opt.optionName}</option>)
                })
              }
            </select>
          </div>
        );
      case 'toggle':
        return (
          <div className="toggle-div" key={`${item.id}-${field.id}`}>
            <input
              id={`${item.id}-${field.id}`}
              type="checkbox"
              value={field.fieldValue} 
              checked={field.fieldValue}
              onChange={({ target }) => onChange(field.id, target.checked)}
            />
            <label htmlFor={`${item.id}-${field.id}`}>{field.fieldName}</label>
          </div>
        );
      default:
        break;
    }
  }

  return (
    <form>
      {
        item && item.fields.map((field, i) => {
          return (
            renderFormFields(field)
          )
        })
      }
    </form>
  );
}

export default MainContent;
