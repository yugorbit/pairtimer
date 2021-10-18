import React, { useCallback, useEffect, useRef, useState } from 'react';
import logo from './logo.svg';


/* Firestore */
import { getFirestore, getDocs, collection, CollectionReference, addDoc } from "firebase/firestore"
import { worker } from 'cluster';
import { async } from '@firebase/util';

type Task = {
  id : string,
  created: Date,
  detail: string,
  driver: string,
  title: string
}

enum PomodoroType  {
  work,
  break
}

enum PomodoroStatus {
  prestart,
  running,
  stop,
  end
}

type Pomodoro = {
  minutes : number,
  next? : Pomodoro,
  task : Task,
  type : PomodoroType,
  status : PomodoroStatus,
  startTime : Date
}

class Timer{
  seconds : number
  minutes : number;
  constructor(minutes : number){
    this.minutes = minutes;
    this.seconds = minutes * 60;
  }

  public tick() : number {
    return --this.seconds;
  }

  public doEnd() : boolean {
    return this.seconds <= 0 ? true : false;
  }
}

//学習用
class Timer2 { 
  seconds: number;
  constructor(seconds: number) {
    this.seconds = seconds
  }
  public tick() : number {
    return --this.seconds;
  }
}
//学習用ここまで

async function getTaskList(): Promise<Task[]> {
  const db = getFirestore();
  const ref: CollectionReference = collection(db, "tasks");
  const q = await getDocs(ref);

  const tasks: Task[] = [];
  q.forEach((task) => {
    tasks.push({
      id : task.id,
      created: task.data().created,
      detail: task.data().detail,
      driver: task.data().driver,
      title: task.data().title
    });
  });
  return tasks;
}

async function createPomodoro(task : Task) {
  const db = getFirestore();
  const ref: CollectionReference = collection(db, "pomodoro");
  addDoc(ref, {
    minutes : 25,
    next : null,
    task : task,
    type : PomodoroType.work,
    status : PomodoroStatus.prestart,
    startTime : Date.now()
  })
}

function useValueRef<T>(val: T) {
  const ref = React.useRef(val);
  React.useEffect(() => {
    ref.current = val;
  }, [val]);
  return ref;
}


function App() {

  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState({
    title: "",
    driver: "Yugo"
  });
  const [count, setCount] = useState(0);

  const [timers, setTimers] = useState<Timer[]>([]);
  const refTimers = useValueRef(timers);

  //State宣言
  const [sample, setSample] = useState<Timer2>();

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

  const callbackTimer = () => {
    for(const t of refTimers.current){
      if(!t.doEnd()){
        console.log(t.tick());
      }
    }
  }
  useEffect(() => {
    getTaskListFromFirestore();
    const id = setInterval(() => {
      callbackTimer();
    }, 1000);
  }, []);

  const handleClickStartButton = () => {
    console.log(timers);
    setTimers(timers.concat(new Timer(25)));
    refTimers.current = timers;
  }

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
        <button className="timer_start" onClick={() =>{
          handleClickStartButton();
        }}>タイマースタート</button>
      </div>
    </div >
  );
}

export default App;