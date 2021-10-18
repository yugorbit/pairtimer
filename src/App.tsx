import React, { useCallback, useEffect, useRef, useState } from 'react';
import logo from './logo.svg';


/* Firestore */
import { getFirestore, getDocs, collection, CollectionReference } from "firebase/firestore"

type Task = {
  created: Date,
  detail: string,
  driver: string,
  title: string
}

async function getTaskList(): Promise<Task[]> {
  const db = getFirestore();
  const ref: CollectionReference = collection(db, "tasks");
  const q = await getDocs(ref);

  const tasks: Task[] = [];
  q.forEach((task) => {
    tasks.push({
      created: task.data().created,
      detail: task.data().detail,
      driver: task.data().driver,
      title: task.data().title
    });
  });
  return tasks;
}


function App() {

  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState({
    title: "",
    driver: "Yugo"
  });
  const [count, setCount] = useState(0);
  const intervalRef = useRef(null);

  const getTaskListFromFirestore = async () => {
    const tasks = await getTaskList();
    setTasks(tasks);
  }

  const addTaskToFirestore = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    console.log(input);
  }

  const handleChangeInputTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput({
      title: e.target.value,
      driver: input.driver
    });
  }

  const handleChangeInputDriver = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setInput({
      title: input.title,
      driver: e.target.value
    });
  }

  const timerStart = useCallback(() => {
    if (intervalRef.current !== null) {
      return;
    }
  }, []);

  useEffect(() => {
    getTaskListFromFirestore();
  }, []);

  const TaskList = (<ul className="tasklist">
    {
      tasks.map((task, i) => {
        return (
          <li className="taskitem" key={i}>
            <p className="taskitem_name">{task.title}</p>
            <p className="taskitem_driver">{task.driver}</p>
          </li>)
      })
    }</ul >)

  return (
    <div className="App">
      <div className="task">
        <p className="heading">タスク一覧</p>
        {TaskList}
        <form className="taskform" name="addTaskForm">
          <input className="taskform_name" type="text" name="taskName" placeholder="新しいタスク名を入力"
            value={input.title} onChange={(e) => {
              handleChangeInputTitle(e)
            }}></input>
          <div className="taskform_asignee" >
            <select value={input.driver} onChange={(e) => {
              handleChangeInputDriver(e)
            }}>
              <option value="Kei">Kei</option>
              <option value="Yugo">Yugo</option>
            </select>
          </div>
          <button className="taskform_button" onClick={(e) => { addTaskToFirestore(e) }}>追加</button>
        </form>
      </div>
      <div className="timer">
        <div className="timer_circle" id="">
          <svg width="240" height="240" viewBox="0, 0, 200, 200" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="90" strokeWidth="12" stroke="#006989" fill="none" />
          </svg>
          <div className="timer_circle_count">25:00</div>
        </div>
        <button className="timer_start">タイマースタート</button>
      </div>
    </div >
  );
}

export default App;