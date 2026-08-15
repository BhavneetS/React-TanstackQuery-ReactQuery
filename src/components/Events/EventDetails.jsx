import { Link, Outlet, useNavigate, useParams } from 'react-router-dom';

import Header from '../Header.jsx';
import { useMutation, useQuery } from '@tanstack/react-query';
import { deleteEvent, fetchEvent, queryClient } from '../../utils/callhandling.js';
import LoadingIndicator from '../UI/LoadingIndicator.jsx';
import ErrorBlock from '../UI/ErrorBlock.jsx';

export default function EventDetails() {

  const {id} = useParams();
  const navigate = useNavigate();
  
  const {data, isPending, isError, error} = useQuery({
    queryKey: ['events', id],
    queryFn: ({signal}) => fetchEvent({signal, id}),
    staleTime:1000
  })

  const {mutate} = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      // since we are invalidating all the queries for 'event', react will refetch all the queries again before navigating back to the events page. 
      // This is not ideal as we are refetching the data for the event that we just deleted. Hence, we can use the exact flag to invalidate only the queries that match the exact query key. This is useful when we want to invalidate a specific query and not all queries that match the query key.
      queryClient.invalidateQueries({
        queryKey:['events'],
        // the RefetchType 'none' is used to prevent the query from refetching the data after invalidating the query. 
        // This is useful when we want to invalidate the query but do not want to refetch the data immediately. We can use this when we know that the data has changed and we do not want to refetch the data immediately.
        refetchType: 'none'
      })
      navigate(`../events`);
    }
  })


  return (
    <>
      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>

      
      { isPending && <div style={{textAlign: 'center'}}><LoadingIndicator  /></div>}
      { isError && <ErrorBlock message={error.message} /> }
      { !isPending && !isError &&
        <article id="event-details">
        <header>
          <h1>{data?.title || 'EVENT TITLE'}</h1>
          <nav>
            <button onClick={() => mutate({id})}>Delete</button>
            <Link to="edit">Edit</Link>
          </nav>
        </header>
        <div id="event-details-content">
          <img src={`http://localhost:3000/${data?.image}`} alt={data?.title} />
          <div id="event-details-info">
            <div>
              <p id="event-details-location">{data?.location || 'EVENT LOCATION'}</p>
              <time dateTime={data?.date}>{data?.date || 'DATE @ TIME'}</time>
            </div>
            <p id="event-details-description">{data?.description || 'EVENT DESCRIPTION'}</p>
          </div>
        </div>
      </article>}
    </>
  );
}
