/* eslint-disable react/prop-types */
import {StyledForm, FormTitle, FormContainer, FormWrapper, ButtonContainer, CloseButton} from '../component/styles/StyledForm.styled'
import { MdOutlineClose } from "react-icons/md";
import { Button } from './styles/Button.styled';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTask, updateTask } from '../features/tasks/tasksSlice';
import {v4 as uuid} from 'uuid';
import toast from 'react-hot-toast';

// Function to convert 'completed' to 'status'
function convertCompletedToStatus(completed) {
  return completed ? 'complete' : 'incomplete';
}

function TaskModal({modalOpen, setModalOpen, type, task}) {
  
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('incomplete');
  const authUser = useSelector(state => state.auth.user);

  const dispatch = useDispatch()

  useEffect(()=>{
    if(type === 'update' && task){
      setTitle(task.title);
      setStatus(convertCompletedToStatus(task.completed)); // Convert 'completed' to 'status'
    } else{
      setTitle('');
      setStatus('incomplete');
    }
  }, [type, task, modalOpen])

  // ...

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title) {
        toast.error('Title should not be empty');
        return;
    }

    const updatedTask = {
        id: task ? task.id : uuid(),
        title,
        completed: status === 'complete',
    };

    if (type === 'update') {
        dispatch(updateTask(updatedTask));
        
        // Update the task in local storage
        const userTasks = JSON.parse(localStorage.getItem(`tasks_${authUser.username}`)) || [];
        const updatedTasks = userTasks.map(t => (t.id === updatedTask.id ? updatedTask : t));
        localStorage.setItem(`tasks_${authUser.username}`, JSON.stringify(updatedTasks));
        toast.success('Task updated successfully');
    } else {
        dispatch(addTask(updatedTask));
        
        // Add the task to local storage
        const userTasks = JSON.parse(localStorage.getItem(`tasks_${authUser.username}`)) || [];
        userTasks.push(updatedTask);
        localStorage.setItem(`tasks_${authUser.username}`, JSON.stringify(userTasks));
        toast.success('Task added successfully');
    }

    setModalOpen(false);
  }


  return (
    <>
      {modalOpen && (
        <FormWrapper>
        <FormContainer>
          <CloseButton onClick={() => setModalOpen(false)}
            onKeyDown={() => setModalOpen(false)}
            tabIndex={0}
            role='button'
            >
          <MdOutlineClose/>
          </CloseButton>
          <StyledForm onSubmit={handleSubmit}>
            <FormTitle>{type === 'update' ? 'Update' : 'Add'} Task</FormTitle>
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
              <Button $primary='true'>{type === 'update'?'Update': 'Add'}Task</Button>
              <Button $secondary='true' type='button'
                onClick={() => setModalOpen(false)} 
                onKeyDown={() => setModalOpen(false)}
                >Cancel</Button>
            </ButtonContainer>
            </StyledForm>
        </FormContainer>
      </FormWrapper>
      )}
    </>
  )
}

export default TaskModal
