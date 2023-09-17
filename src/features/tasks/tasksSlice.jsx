import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define your API base URL
const apiUrl = 'https://jsonplaceholder.typicode.com/todos';

// Create an async thunk for fetching tasks from the API
export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
    try {
        const response = await axios.get(`${apiUrl}?_limit=5`);
        const apiTasks = response.data.map(task => ({
            ...task,
            status: task.completed ? 'complete' : 'incomplete',
        }));

        return apiTasks; // Fetch only from the API
    } catch (error) {
        console.error(error);
        throw error;
    }
});



export const addTask = createAsyncThunk('tasks/addTask', async (newTask) => {
    try {
      // Fetch the current tasks to determine the next available ID
    const response = await axios.get(apiUrl);
    const currentTasks = response.data;

    // Find the maximum ID among the current tasks
    const maxId = currentTasks.reduce((max, task) => (task.id > max ? task.id : max), 0);
        console.log(maxId);
    // Generate a new ID within the valid range (1 to 200)
    const newId = +maxId < 200 ? +maxId + 1 : 1;

    // Set the new ID for the task
    newTask.id = newId;
        console.log(newId)
    // Add the task to the API
    const addResponse = await axios.post(apiUrl, newTask);
    const addedTask = addResponse.data;
        console.log(addedTask)
    // Update the local tasks array
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    savedTasks.push(addedTask);
    localStorage.setItem('tasks', JSON.stringify(savedTasks));

    return addedTask;
} catch (error) {
    console.error(error);
    throw error;
}
});




export const updateTask = createAsyncThunk('tasks/updateTask', async (updatedTask) => {
    const response = await axios.put(`${apiUrl}/${updatedTask.id}`, updatedTask);
    const updatedTaskData = response.data;

    // Update the local tasks array
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const updatedTasks = savedTasks.map((task) =>
        task.id === updatedTaskData.id ? updatedTaskData : task
    );
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));

    return updatedTaskData;
});


export const deleteTask = createAsyncThunk('tasks/deleteTask', async (taskId) => {
    await axios.delete(`${apiUrl}/${taskId}`);

    // Update the local tasks array
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const updatedTasks = savedTasks.filter((task) => task.id !== taskId);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));

return taskId;
});

const initialState = {
    filterStatus: 'all', // Default filter status
    tasks: [], // Your tasks data
    status: 'idle',
    error: null,
    };

const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
    updateFilterStatus: (state, action) => {
        state.filterStatus = action.payload;},
    },
    extraReducers: (builder) => {
    builder
        .addCase(fetchTasks.pending, (state) => {
        state.status = 'loading';
        })
        .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tasks = action.payload;
        })
        .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
        })
        .addCase(addTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
        })
        .addCase(updateTask.fulfilled, (state, action) => {
        const updatedTask = action.payload;
        const existingTaskIndex = state.tasks.findIndex((task) => task.id === updatedTask.id);
        if (existingTaskIndex !== -1) {
            state.tasks[existingTaskIndex] = updatedTask;
        }
        })
        .addCase(deleteTask.fulfilled, (state, action) => {
        const taskId = action.payload;
        state.tasks = state.tasks.filter((task) => task.id !== taskId);
        });
    },
});

export const { updateFilterStatus } = tasksSlice.actions;

export default tasksSlice.reducer;
