/* eslint-disable react/prop-types */
import { useDispatch } from "react-redux"
import { Item, Details, TaskTexts, TaskText, TaskActions, Icon } from "./styles/TaskItems.styled"
import { MdDelete, MdEdit } from 'react-icons/md'
import { deleteTask, updateTask } from "../features/tasks/tasksSlice"
import toast from "react-hot-toast"
import TaskModal from "./TaskModal"
import { useEffect, useState } from "react"
import CheckBox from "./CheckBox"

function TaskItem({ task }) {
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [checked, setChecked] = useState(false); // Initialize based on task.status

  const dispatch = useDispatch();

  useEffect(() => {
    // Initialize 'checked' based on 'status'
    setChecked(task.status === 'complete');
  }, [task.status]);

  const handleDelete = () => {
    dispatch(deleteTask(task.id));
    toast.success('Task deleted successfully');
  }

  const handleEdit = () => {
    setUpdateModalOpen(true);
  }

  const handleCheck = () => {
    const newChecked = !checked; // Toggle the checked state
    setChecked(newChecked); // Update the local state first

    // Dispatch 'updateTask' with the updated 'status'
    dispatch(
      updateTask({ ...task, status: newChecked ? 'complete' : 'incomplete' })
    );
  };

  return (
    <>
      <Item>
        <Details>
          <CheckBox checked={checked} handleCheck={handleCheck} />
          <TaskTexts>
            <TaskText className={task.status === 'complete' ? 'completed' : ''}>
              {task.title}
            </TaskText>
          </TaskTexts>
        </Details>
        <TaskActions>
          <Icon
            onClick={handleDelete}
            onKeyDown={handleDelete}
            role="button" tabIndex={0}>
            <MdDelete />
          </Icon>
          <Icon
            onKeyDown={handleEdit}
            onClick={handleEdit} role="button" tabIndex={0}>
            <MdEdit />
          </Icon>
        </TaskActions>
      </Item>
      <TaskModal
        task={task}
        type='update'
        modalOpen={updateModalOpen}
        setModalOpen={setUpdateModalOpen}
      />
    </>
  )
}

export default TaskItem;
