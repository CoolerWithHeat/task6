import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Menu from './Components/ThreadsMenu';
import getCurrentHost from './Components/host';

function ArrangeThreads(){
  const [threads, Update_threads] = React.useState()
  const [ThreadAction, Update_ThreadAction] = React.useState(false)
  const [Keyword, Update_Keyword] = React.useState()
  async function fetchThreads(){
    const link = getCurrentHost()+'availableThreads/'
    const request = await fetch(link, {
        method:"GET"
    })
    const result = await request.json()
    if (request.status == 200){
      const processeData = result.threads.map(Each=><Menu key={Each.id} title={Each.related_thread}/> )
      Update_threads(()=>processeData)
    }
  }

  function CreateThread(tagpoint){
    Update_ThreadAction(!ThreadAction)
  }

  function UpdateKeyWord(tagpoint){
    Update_Keyword(MAin=>tagpoint.target.value)
  }

  const CreateNewThread = ()=>{
    window.location.pathname = 'drawing/'+Keyword
  }

  React.useEffect(Main=>{
    fetchThreads()
  }, [])

  return (
    <div>
      <nav class="navbar navbar-dark bg-primary" ><h2 className='threadsText'>Threads to Join</h2></nav>
      {threads}
      <br/>
      <br/>
      <br/>
      <div id='AddSignWindow'>
        {ThreadAction ? 
        <div>
          <input onChange={UpdateKeyWord} style={{display:'inline-block', width:'150px'}} className='form-control'/> 
          <button onClick={CreateNewThread} className='btn btn-primary'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill" viewBox="0 0 16 16">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
            </svg>
          </button>
        </div> : <svg onClick={CreateThread} id='AddSign' xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="currentColor" class="bi bi-plus-square" viewBox="0 0 16 16">
          <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
        </svg>}
        <br/>
        <h3>{ThreadAction ? null : 'Create Thread'}</h3>
      </div>
    </div>
  )
}

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/:segment*" element={<App />} />
      <Route path="/" element={<ArrangeThreads/>} />
    </Routes>
  </BrowserRouter>,
  document.getElementById('root')
);

reportWebVitals();