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
  const authUser = useSelector(state => state.auth.user);

  const dispatch = useDispatch();

  // Fetch tasks from the API when the component mounts
  useEffect(() => {
    if (authUser) {
      // Load tasks for the authenticated user based on their username
      const userTasks = JSON.parse(localStorage.getItem(`tasks_${authUser.username}`)) || [];
      dispatch(fetchTasks(userTasks));
    }
  }, [dispatch, authUser]);

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
