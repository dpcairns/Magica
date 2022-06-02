import React, { useState, useEffect } from 'react';
import { getRandomCard } from './services/fetch-utils';
import { getDraftedCards } from './services/supabase-utils';
import CardList from './CardList.js';
import { types, sets } from './mtgparams';
import LoadingSpinner from './LoadingSpinner';

export default function DraftPage({ deleteCard, setDeleteCard }) {
  const [cards, setCards] = useState([]);
  const [drafted, setDrafted] = useState([]);
  const [currentDeck, setCurrentDeck] = useState();
  const [rerender, setRerender] = useState(false);
  const [type, setType] = useState('');
  const [set, setSet] = useState('');
  const [colorIdentity, setColorIdentity] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [draftLoading, setDraftLoading] = useState(false);

  useEffect(() => {
    async function load() {
      const localDeck = localStorage.getItem('currentDeckId');
      setIsLoading(true);
      setCurrentDeck(localDeck);
      const draftedCards = await getDraftedCards(localDeck);
      setDrafted(draftedCards);
      setIsLoading(false);
    }
    load();
  }, [rerender, deleteCard]); //eslint-disable-line


  async function handleDraftClick() {
    setDraftLoading(true);
    const randomCards = await getRandomCard(colorIdentity, type, set);
    if (randomCards.length === 0) {
      alert('No results match your search.');
    }
    setCards(randomCards);
    setDraftLoading(false);
  }

  return (
    <div>
      <div className="draft-dropdowns">
        <div>
          <label>Filter By Mana Color</label>
          <select value={colorIdentity} onChange={(e) => setColorIdentity(e.target.value)}>
            {
              <>
                <option key="red" value='R'>
                Red
                </option>
                <option key="green" value='G'>
                Green
                </option>
                <option key="blue" value='U'>
                Blue
                </option>
                <option key="white" value='W'>
                White
                </option>
                <option key="black" value='B'>
                Black
                </option>
                <option key="colorless" value=''>
                No Color Specified
                </option>
              </>
            }
          </select>
        </div>
        <div>
          <label>Filter By Type</label>
          <select onChange={(e) => setType(e.target.value)}>
            <option></option>
            {types.map((item) => (
              <option key={item} value={`${item}`}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Filter By Set</label>
          <select onChange={(e) => setSet(e.target.value)}>
            <option></option>
            {sets.map((item) => (
              <option key={item} value={`${item}`}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <button onClick={handleDraftClick}>Search</button>
      </div>
      <div className='draft-border'>
        {(cards && !isLoading && !draftLoading) ? (
          <CardList
            cards={cards}
            drafted={drafted}
            currentDeck={currentDeck}
            setRerender={setRerender}
            setDeleteCard={setDeleteCard}
            handleDraftClick={handleDraftClick}
          />
        ) : <LoadingSpinner />}
      </div>
    </div>
  );
}

