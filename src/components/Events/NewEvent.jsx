import { Link, useNavigate } from 'react-router-dom';

import Modal from '../UI/Modal.jsx';
import EventForm from './EventForm.jsx';
import { useMutation } from '@tanstack/react-query';
import { createNewEvent, queryClient } from '../../utils/callhandling.js';
import ErrorBlock from '../UI/ErrorBlock.jsx';

export default function NewEvent() {
  const navigate = useNavigate();

  // we can use useQuery as well to post data but useMutation is better suited as it is only triggered when the user submits the form and not on every render. 
  // It also provides a way to handle the response and errors from the server.

  // useMutation hook retruns a function 'mutate' that we can call to trigger the mutation. It also returns an object with properties like isLoading, isError, error, data, etc. that we can use to handle the state of the mutation.
  const {mutate, isPending, isError, error} = useMutation({
    mutationFn: createNewEvent,
    onSuccess: () => {
      // the invalidateQueries method is used to invalidate the cache for a specific query key. 
      // This means that the next time the query is called, it will fetch fresh data from the server instead of using the cached data. This is useful when we want to ensure that the data displayed to the user is up-to-date and reflects any changes made on the server.
      // we can use the exact flag to invalidate only the queries that match the exact query key. This is useful when we want to invalidate a specific query and not all queries that match the query key.
      queryClient.invalidateQueries({queryKey:['events'], /* exact: true */});
      // navigate to the newly created event's page
      navigate(`../events`);
    }
  })

  function handleSubmit(formData) {
    mutate({event: formData})
  }

  return (
    <Modal onClose={() => navigate('../')}>
      <EventForm onSubmit={handleSubmit}>
        {isPending ?  'Submitting...' : 
          <>
            <Link to="../" className="button-text">
              Cancel
            </Link>
            <button type="submit" className="button">
              Create
            </button>
          </>
        }
      </EventForm>
      {isError && (
        <ErrorBlock
          title="Failed to create Event"
          message= {error.info?.message || "Please try again later."}
        />
      )}
    </Modal>
  );
}
