// import { useEffect, useState } from 'react';

import LoadingIndicator from '../UI/LoadingIndicator.jsx';
import ErrorBlock from '../UI/ErrorBlock.jsx';
import EventItem from './EventItem.jsx';
import fetchEvents from '../../utils/callhandling.js';
import { useQuery } from '@tanstack/react-query';

export default function NewEventsSection() {
  // const [data, setData] = useState();
  // const [error, setError] = useState();
  // const [isLoading, setIsLoading] = useState(false);

  /* 
      Some benefits of using tanstack/react-query over useEffect and useState for data fetching:
      1. Caching: React Query automatically caches the data fetched from the server, which can improve performance and reduce the number of network requests made.
      2. Automatic refetching: React Query can automatically refetch data when it becomes stale or when certain conditions are met, such as when the user navigates back to a page.
      3. Background updates: React Query can update the cached data in the background, so that the user always sees the most up-to-date information without having to manually refresh the page.
      4. Error handling: React Query provides built-in error handling and retry mechanisms, which can simplify error handling in your application.
      5. Devtools: React Query provides a set of devtools that allow you to inspect and debug your queries and mutations in real-time.
      6: Switching between windows: Reqct query fetches the data again from the server if user naviagtes away from the screen and comes back, if the time to come back is more than the staleTime */

  const {data, isError, isPending, error} = useQuery({
    queryKey: ['events'],
    // React query passes a default parameter to the query function, which is an object containing the query key and other metadata. The metadata includes a Signal object that can be used to cancel the query if it is no longer needed. This is useful for preventing memory leaks and improving performance, especially in cases where the user navigates away from a page before the query has completed.
    // The query function can use this signal to cancel the request if it is no longer needed. This is done by passing the signal to the fetch function as an option. If the signal is aborted, the fetch function will throw an error, which can be caught and handled appropriately.
    queryFn: fetchEvents,
    gcTime: 1500, /* time for which the data is kept in the cache, default 5mins, 5*60*1000 millisecs */
    staleTime: 100, /* Time for which no new data is fetched from the server and the cached data is considerd relevant/fresh, default: 0 */
  }) 
 
  let content;

  if (isPending) {
    content = <LoadingIndicator />;
  }

  if (isError) {
    content = (
      <ErrorBlock title="An error occurred" message={error.message}/>
    );
  }

  if (data) {
    content = (
      <ul className="events-list">
        {data.map((event) => (
          <li key={event.id}>
            <EventItem event={event} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section className="content-section" id="new-events-section">
      <header>
        <h2>Recently added events</h2>
      </header>
      {content}
    </section>
  );
}
