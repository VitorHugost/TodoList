import { useState,useEffect } from 'react';
import {BsTrash,BsBookmarkCheck,BsBookmarkCheckFill} from 'react-icons/bs';
import './App.css';

const API = 'http://localhost:5000';

function App() {
  const [title,setTitle] = useState('')
  const [time,setTime] = useState('') 
  const [loading,setLoading] = useState(false) 
  const [todos,setTodos] = useState([]) ;

  //Load todos on pages
  //Carregar todos na pagina

  useEffect(()=>{
    //Carregar dados
    const loadData = async(e) =>{

      setLoading(true)

      const res = await fetch(API + "/todos")
      .then((res) => res.json())
      .then((data) => data)
      .catch((err)=>console.log(err));
      setLoading(false)
      setTodos(res)
    };
    loadData()

  },[])

  const handleSubmit = async (e) =>{
    e.preventDefault()
    const todo = {
      id:Math.random(),
      title:title,
      time:time,
      done:false
    };

    await fetch(API + "/todos",{
      method: "POST",
      body: JSON.stringify(todo),
      headers:{"Content-Type": "application/json"},
    })

    setTodos((prevStates) => [...prevStates,todo])

    console.log(todo)
    setTitle("")
    setTime("")
  }

  const handleEdit = async(todo) => {

    todo.done = !todo.done

    const data = await fetch(API + "/todos"+ todo.id,{
      method: "PUT",
      body: JSON.stringify(todos),
      headers:{"Content-Type":"application/json"},
    })

    setTodos((prevStates) => 
    prevStates.map((t) => (t.id === data.id ? (t = data) : t)))
  }

  const handleDelete = async (id) => {

    await fetch(API + "/todos/" + id ,{
      method:"DELETE",
    });
    setTodos((prevStates) => prevStates.filter((todo) => todo.id !== id));

  }

  return (

    <div className="App">
      <div className='todo-header'>
        <h2>Lista de Tarefas</h2>
      </div>

      <div className='todo-form'>
        <h3>Insira sua atividade:</h3>
        <form onSubmit={handleSubmit}>
          <div className='form-control'>
            <label className='title-form'>O que você vai fazer ?</label>
            <input type='text' name='title-form' placeholder='Título da tarefa' onChange={(e)=>setTitle(e.target.value)} value={title} required/>
          </div>
          <div className='form-control'>
            <label className='time-form'>Duração:</label>
            <input type='text' name='time-form' placeholder='Tempo estimado (em horas)' onChange={(e)=>setTime(e.target.value)} value={time} required/>
          </div>
          <input className='button' type="submit" value="Enviar"/>
        </form>
      </div>

      <div className='todo-list'>
        <p>Lista de tarefas:</p>
        {todos.length === 0 && <p>Não há tarefas</p>}
        {todos.map((todo) =>(
          <div className='todo' key={todo.id}>   
           <h4 className={todo.done ? "todo-done" : "" }>{todo.title}</h4>   
            <p>Duração: {todo.time}</p> 
            <span onClick={() => handleEdit(todo)}>
              {!todo.done ? <BsBookmarkCheck/> : <BsBookmarkCheckFill/>}
              </span>    
              <BsTrash onClick={() => handleDelete(todo.id)} />
          </div>
        ))}
      </div>

    </div>
  );
}

export default App;
