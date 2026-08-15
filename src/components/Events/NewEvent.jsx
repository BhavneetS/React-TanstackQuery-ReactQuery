import { Link, useNavigate } from 'react-router-dom';

import Modal from '../UI/Modal.jsx';
import EventForm from './EventForm.jsx';
import { useMutation } from '@tanstack/react-query';
import { createNewEvent } from '../../utils/callhandling.js';
import ErrorBlock from '../UI/ErrorBlock.jsx';

export default function NewEvent() {
  const navigate = useNavigate();

  // we can use useQuery as well to post data but useMutation is better suited as it is only triggered when the user submits the form and not on every render. 
  // It also provides a way to handle the response and errors from the server.

  // useMutation hook retruns a function 'mutate' that we can call to trigger the mutation. It also returns an object with properties like isLoading, isError, error, data, etc. that we can use to handle the state of the mutation.
  const {mutate, isPending, isError, error} = useMutation({
    mutationFn: createNewEvent,
    onSuccess: () => {
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
