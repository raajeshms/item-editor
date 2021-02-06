import React, { useState, useEffect } from 'react';
import './ItemEditor.css';
import LeftNavList from './LeftNav/LeftNav'
import MainContent from './MainContent/MainContent'
import { ItemLists } from '../DemoData'
// import ActionItems from '../ActionItems/ActionItems';

const ItemEditor = (props) => {
  const itemList = JSON.parse(JSON.stringify(ItemLists.items));
  const currentItemObj = JSON.parse(JSON.stringify(itemList?.[0] || null));
  const [items, setItems] = useState(JSON.parse(JSON.stringify(ItemLists.items)));
  const [changingItems, setChangingItems] = useState(JSON.parse(JSON.stringify(ItemLists.items)));

  const [currentItem, setCurrentItem] = useState(currentItemObj);

  const [title, setTitle] = useState(ItemLists.title);
  const [undoItem, setUndoItem] = useState({undoChange: false, changedItemId: null, changedItem: null});
  const [redoItem, setRedoItem] = useState({redoChange: false, redoItemId: null, redoItem: null});
  const [savedItems, setSavedItems] = useState(JSON.parse(JSON.stringify(ItemLists.items)));
  const [savedCurrentItem, setSavedCurrentItem] = useState(ItemLists?.items?.[0]?.id || 0);
  const [changedItem, setChangedItem] = useState(false);

  const updateItem = (item) => {
    let unchangedItem = null;
    changingItems.forEach(itemObj => {
      if (itemObj.id === item.id) {
        unchangedItem = JSON.parse(JSON.stringify(itemObj));
      }
    });
    items && items.forEach((itemObj) => {
      if (itemObj.id === item.id) {
        itemObj.fields = item.fields;
      }
    });
    const changingItemList = JSON.parse(JSON.stringify(items));
    setChangingItems([...changingItemList])
    setCurrentItem({...item});
    setUndoItem({undoChange: true, changedItemId: null, changedItem: unchangedItem});
    setRedoItem({redoChange: false, redoItemId: null, redoItem: null});
    setItems([...items]);
    setChangedItem(true);
  }

  const updateCurrentItem = (item) => {
    setUndoItem({undoChange: true, changedItemId: currentItem.id, changedItem: null});
    setRedoItem({redoChange: false, redoItemId: null, redoItem: null});
    setCurrentItem({...item});
    setChangedItem(true);
  }

  const undoChanges = (event) => {
    if (undoItem.undoChange) {
      let changedItem = null, changedItemId = null;
      if (undoItem.changedItemId === null) {
        items && items.forEach((itemObj) => {
          if (itemObj.id === undoItem.changedItem.id) {
            changedItem = JSON.parse(JSON.stringify(itemObj));
            itemObj.fields = undoItem.changedItem.fields;
          }
        });
        const changingItemList = JSON.parse(JSON.stringify(items));
        setChangingItems([...changingItemList])
        setItems([...items]);
        setCurrentItem({...undoItem.changedItem});
      } else {
        changedItemId = currentItem.id;
        const prevCurrentItem = items.find(item => {
          return item.id === undoItem.changedItemId;
        });
        setCurrentItem({...prevCurrentItem});
      }
      
      setRedoItem({redoChange: true, redoItemId: changedItemId, redoItem: changedItem});
      setUndoItem({undoChange: false, changedItemId: null, changedItem: null});
    } else {
      event.preventDefault();
    }
  }

  const redoChanges = (event) => {
    if (redoItem.redoChange) {
      let changingItem = null, changingItemId = null;
      if (redoItem.redoItemId === null) {
        items && items.forEach((itemObj) => {
          if (itemObj.id === redoItem.redoItem.id) {
            changingItem = JSON.parse(JSON.stringify(itemObj));
            itemObj.fields = redoItem.redoItem.fields;
          }
        });
        const changingItemList = JSON.parse(JSON.stringify(items));
        setChangingItems([...changingItemList])
        setItems([...items]);
        setCurrentItem({...redoItem.redoItem});
      } else {
        changingItemId = currentItem.id;
        const prevCurrentItem = items.find(item => {
          return item.id === redoItem.redoItemId;
        });
        setCurrentItem({...prevCurrentItem});
      }
      setRedoItem({redoChange: false, redoItemId: null, redoItem: null});
      setUndoItem({undoChange: true, changedItemId: changingItemId, changedItem: changingItem});
    } else {
      event.preventDefault();
    }
  }

  const saveChanges = (event) => {
    if (changedItem) {
      const changedItems = JSON.parse(JSON.stringify(items));
      setSavedItems([...changedItems]);
      setSavedCurrentItem(currentItem.id);
      setChangedItem(false);
      setUndoItem({undoChange: false, changedItemId: null, changedItem: null});
      setRedoItem({redoChange: false, redoItemId: null, redoItem: null});
    } else {
      event.preventDefault();
    }
  }

  const cancelChanges = (event) => {
    if (changedItem) {
      const prevSavedItems = JSON.parse(JSON.stringify(savedItems));
      const prevCurrentItem = prevSavedItems.find(item => {
        return item.id === savedCurrentItem;
      });
      setItems([...prevSavedItems]);
      setChangedItem(false);
      setUndoItem({undoChange: false, changedItemId: null, changedItem: null});
      setRedoItem({redoChange: false, redoItemId: null, redoItem: null});
      setCurrentItem({...prevCurrentItem});
    } else {
      event.preventDefault();
    }
  }

  return (
    <div className="item-editor">
      <div className="ie-header">
        <div className="ie-header-label">{title}</div>
        <div className="ie-header-buttons">
          {/* <ActionItems></ActionItems> */}
          <div className="action-items">
            <button
              className={`action action-undo ${undoItem.undoChange ? '' : 'disable'}`}
              onClick={undoChanges}
            >
              Undo
            </button>
            <button
              className={`action action-redo ${redoItem.redoChange ? '' : 'disable'}`}
              onClick={redoChanges}
            >
              Redo
            </button>
            <button
              className={`action action-save ${changedItem ? '' : 'disable'}`}
              onClick={saveChanges}
            >
              Save
            </button>
            <button
              className={`action action-cancel ${changedItem ? '' : 'disable'}`}
              onClick={cancelChanges}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      <div className="ie-body">
        <div className="ie-left-nav">
          {items && items.map((item, index) => {
            return (
            <LeftNavList 
              key={index} 
              item={item} 
              className={"left-nav-list" + (currentItem && currentItem.id === item.id ? " active" : "")}
              onItemClick={updateCurrentItem}
            />
            )
          })}
        </div>
        <div className="ie-right-body">
          <MainContent currentItem={currentItem} updateItem={updateItem}/>
        </div>
      </div>
    </div>
  );
}

export default ItemEditor;