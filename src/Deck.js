import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { getAllCardsByDeckId, deleteDeck, getDeckName, changeDeckName } from './services/supabase-utils';
import DraftedCard from './DraftedCard';

export default function Deck({ deleteCard, setDeleteCard }) {
  const params = useParams();
  const [cards, setCards] = useState([]);
  const history = useHistory();
  const [deckName, setDeckName] = useState();
  const [editDeckName, setEditDeckName] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    async function load() {
      const cardsReceived = await getAllCardsByDeckId(params.id);
      setDeckName(await getDeckName(params.id));
      setCards(cardsReceived);
    }

    load();
  }, [params.id, deleteCard, deckName]);

  function handleEdit() {
    setShowButton(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await changeDeckName(params.id, editDeckName);
    setDeckName(editDeckName);
    setShowButton(false);
  }

  function handleClick() {
    localStorage.setItem('currentDeckId', params.id);

    history.push('/DraftPage');
  }

  async function handleDelete() {
    await deleteDeck(params.id);

    history.push('/DecksPage');
  }
  return (
    <>
      <div>
        <h3> {deckName} </h3>
      </div>
      <button onClick={handleEdit}>Edit Deck Name </button>
      {showButton ? <form onSubmit={handleSubmit}>
        <input onChange={(e) => setEditDeckName(e.target.value)} />
        <button> Submit</button>
      </form> : null
      }


      <button onClick={handleClick}>Redraft Deck</button>
      <button onClick={handleDelete}>Delete Deck</button>
      <div className="card-list">
        {cards.map(({ name, imageUrl, id }) => (
          <DraftedCard
            key={name + id}
            name={name}
            imageUrl={imageUrl}
            id={id}
            setDeleteCard={setDeleteCard}
          />
        ))}
      </div>
    </>
  );
}
