import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchTasks } from '../features/tasks/tasksSlice';
import TaskItem from "./TaskItem";
import { TaskWrapper } from "./styles/Containers.styled";
import { LoneText } from "./styles/Title.styled";

function TaskContent() {
  const taskList = useSelector(state => state.tasks.tasks);
  const status = useSelector(state => state.tasks.status);
  const filterStatus = useSelector(state => state.tasks.filterStatus);

  const dispatch = useDispatch();

  // Fetch tasks from the API when the component mounts
  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  // Load tasks from localStorage and merge with tasks from the API
  // useEffect(() => {
  //   const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];

  //   // Filter out tasks that already exist in taskList
  //   const newTasks = savedTasks.filter(savedTask => {
  //     return !taskList.some(task => task.id === savedTask.id);
  //   });

  //   // Merge the new tasks with the existing taskList
  //   if (newTasks.length > 0) {
  //     dispatch(fetchTasks(newTasks));
  //   }
  // }, [dispatch, taskList]);

  const filteredTaskList = taskList.filter(item => {
    if(filterStatus === 'all') return true;
    return item.status === filterStatus;
  });

  if (status === "loading") {
    return <LoneText>Loading...</LoneText>;
  }

  if (status === "failed") {
    return <LoneText>Error loading tasks.</LoneText>;
  }
  // console.log(filteredTaskList);
  return (
    <TaskWrapper>
      {filteredTaskList.length === 0 ? (
        <LoneText>No tasks found</LoneText>
      ) : (
        <div>
          {filteredTaskList.map(task => (
            <TaskItem key={task.id} task={task}/>
          ))}
        </div>
      )}
    </TaskWrapper>
  );
}

export default TaskContent;
