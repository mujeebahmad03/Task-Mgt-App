/* eslint-disable react/prop-types */
import {StyledForm, FormTitle, FormContainer, FormWrapper, ButtonContainer} from '../component/styles/StyledForm.styled'
import { Button } from '../component/styles/Button.styled';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateTask } from '../features/tasks/tasksSlice';
import toast from 'react-hot-toast';

// Function to convert 'completed' to 'status'
function convertCompletedToStatus(completed) {
  return completed ? 'complete' : 'incomplete';
}

function TaskDetails({task}) {
  
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('incomplete');

  const dispatch = useDispatch()

  useEffect(()=>{
    if(task){
      setTitle(task.title);
      setStatus(convertCompletedToStatus(task.completed)); // Convert 'completed' to 'status'
    } else{
      setTitle('');
      setStatus('incomplete');
    }
  }, [task])

  const handleSubmit = e => {
    e.preventDefault();
    if (!title){
        toast.error('Title should not be empty');
    }

      if(task.title !== title || task.completed !== (status === 'complete')){ // Convert 'status' to 'completed'
        dispatch(updateTask({
          ...task,
          title, 
          completed: status === 'complete', // Convert 'status' to 'completed'
        }))
      } else{
        toast.error('No changes made')
      }
    (false);
  }

  return (
    <>
        <FormWrapper>
        <FormContainer>
          <StyledForm onSubmit={handleSubmit}>
            <FormTitle>Update Task</FormTitle>
            <label htmlFor="title">Title
              <input type="text" id='title' value={title}
                onChange={(e) => setTitle(e.target.value)}
                />
            </label>
            <label htmlFor="status">Status
              <select name="status" id="status"
                value={status}
                onChange={e => setStatus(e.target.value)}
                >
                <option value="incomplete">Incomplete</option>
                <option value="complete">Complete</option>
              </select>
            </label>
            <ButtonContainer>
              <Button $primary='true'>Update Task</Button>
              <Button $secondary='true' type='button'
                onClick={() => (false)} 
                onKeyDown={() => (false)}
                >Cancel</Button>
            </ButtonContainer>
            </StyledForm>
        </FormContainer>
      </FormWrapper>
    </>
  )
}

export default TaskDetails
