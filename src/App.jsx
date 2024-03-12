import { nanoid } from 'nanoid';
import { useState, useRef, useEffect } from 'react';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const inputRef = useRef();

  useEffect(() => {
    if (!localStorage.getItem('oks-todo-extension')) {
      localStorage.setItem('oks-todo-extension', JSON.stringify(tasks));
    } else {
      setTasks(JSON.parse(localStorage.getItem('oks-todo-extension')));
    }
  }, []);

  const addTaskFromInput = (e) => {
    const addTask = () => {
      const taskValue = inputRef.current.value;
      if (taskValue) {
        setTasks((prev) => {
          const temp = [...prev, { id: nanoid(), name: taskValue, isComplete: false }];
          localStorage.setItem('oks-todo-extension', JSON.stringify(temp));

          return temp;
        });
        inputRef.current.value = '';
      }
    };

    if ((e && e.type === 'keydown' && e.key === 'Enter') || e.type === 'click') {
      addTask();
    }
  };

  const toggleTask = (taskId) => {
    const tempTasks = tasks.map((task) => {
      if (task.id === taskId) {
        task.isComplete = !task.isComplete;
      }
      return task;
    });

    localStorage.setItem('oks-todo-extension', JSON.stringify(tempTasks));
    setTasks(tempTasks);
  };

  const deleteTask = (taskId) => {
    const tempTasks = tasks.filter((task) => task.id !== taskId);

    localStorage.setItem('oks-todo-extension', JSON.stringify(tempTasks));
    setTasks(tempTasks);
  };

  const editTask = (taskId, taskName) => {
    const newTask = prompt('Edit Your Task:', taskName);

    if (newTask !== null) {
      const tempTasks = tasks.map((task) => {
        if (task.id === taskId) {
          task.name = newTask;
        }
        return task;
      });

      localStorage.setItem('oks-todo-extension', JSON.stringify(tempTasks));
      setTasks(tempTasks);
    }
  };

  return (
    <div className="w-[350px] bg-[#f4f4f4]">
      <div id="container" className="bg-white p-[15px] rounded-lg shadow-[0_4px_8px_rgba(0,0,0,0.1)]">
        <input
          type="text"
          id="new-task"
          placeholder="Add a new task..."
          className="p-[10px] w-full mb-[10px] border border-solid border-[#ddd] rounded outline-none"
          ref={inputRef}
          onKeyDown={(e) => addTaskFromInput(e)}
        />
        <button
          id="add-task"
          className="p-[10px] w-full bg-[#4caf50] text-white border-none rounded cursor-pointer mt-[10px] text-[13px] transition-opacity duration-300 ease-in-out hover:opacity-80"
          onClick={addTaskFromInput}>
          Add Task
        </button>
        <ul id="task-list" className="mt-5 p-0">
          {tasks.map((task) => (
            <li key={task.id} className="flex items-center p-[10px] bg-[#e0e0e0] mb-[5px] rounded overflow-hidden">
              <input
                className="cursor-pointer"
                type="checkbox"
                checked={task.isComplete}
                onChange={() => toggleTask(task.id)}
              />
              <span className={`flex-1 ml-[10px] break-all ${task.isComplete ? 'line-through' : ''}`}>{task.name}</span>
              <button
                className="ml-[5px] py-[5px] px-2 border-none bg-[#F2EEE9] rounded cursor-pointer text-xs hover:opacity-80"
                onClick={() => editTask(task.id, task.name)}>
                Edit
              </button>
              <button
                className="ml-[5px] py-[5px] px-2 border-none bg-[#F2EEE9] rounded cursor-pointer text-xs hover:opacity-80"
                onClick={() => deleteTask(task.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
