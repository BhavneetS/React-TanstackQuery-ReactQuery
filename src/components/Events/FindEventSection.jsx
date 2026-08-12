import { useQuery } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import fetchEvents from '../../utils/callhandling';
import ErrorBlock from '../UI/ErrorBlock';
import LoadingIndicator from '../UI/LoadingIndicator';
import EventItem from './EventItem';

export default function FindEventSection() {

  const [searchValue, setSearchvalue] = useState('');
  const searchElement = useRef();

  function handleSubmit(event) {
    event.preventDefault();
    setSearchvalue(searchElement.current.value);
  }


  const {data, isPending, isError, error}= useQuery({

    /* 
      Do not call the queryFunction. Only pass a reference
    */
    queryFn: ({signal}) => fetchEvents({signal, searchTerms: searchValue}),
    queryKey: ['events', {searchKey: searchValue}],
  })

  let content = <p>Please enter a term to find events.</p>

  if(isPending) {
    <LoadingIndicator/>
  }

  if (isError) {
        content = (
          <ErrorBlock title="An error occurred" message={error.info?.message}/>
        );
  }

  if(data) {
    content = <ul className='events-list'>
      {data.map((event) => (
        <li key={event.id}>
            <EventItem event={event} />
        </li>
      ))}
    </ul>
  }
  return (
    <section className="content-section" id="all-events-section">
      <header>
        <h2>Find your next event!</h2>
        <form onSubmit={handleSubmit} id="search-form">
          <input
            type="search"
            placeholder="Search events"
            ref={searchElement}
          />
          <button>Search</button>
        </form>
      </header>
      {content}
    </section>
  );
}
