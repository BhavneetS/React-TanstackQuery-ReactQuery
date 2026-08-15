import { useQuery } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import {fetchEvents} from '../../utils/callhandling';
import ErrorBlock from '../UI/ErrorBlock';
import LoadingIndicator from '../UI/LoadingIndicator';
import EventItem from './EventItem';

export default function FindEventSection() {

  const [searchValue, setSearchvalue] = useState();
  const searchElement = useRef();

  function handleSubmit(event) {
    event.preventDefault();
    setSearchvalue(searchElement.current.value);
  }


  const {data, /* isPending */ isLoading, isError, error}= useQuery({

    /* 
      Do not call the queryFunction. Only pass a reference
    */
    queryFn: ({signal}) => fetchEvents({signal, searchTerms: searchValue}),
    queryKey: ['events', {searchKey: searchValue}],
    // we can disabled the query from firing by using the enabled property. This is useful when we want to wait for some condition to be met before firing the query.
    // if the enabled flag is set to false, the isPending flag will be set to true hence showing a loading state.
    // for this, tanstack provides another property called isLoading, which is true only when the query is in the loading state and not in the disabled state.
    enabled: searchValue !== undefined
  })

  let content = <p>Please enter a term to find events.</p>

  if(isLoading) {
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
