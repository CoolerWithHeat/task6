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

  React.useEffect(Main=>{
    fetchThreads()
  }, [])

  return (
    <div>
      <nav class="navbar navbar-dark bg-primary" ><h2 className='threadsText'>Threads to Join</h2></nav>
      {threads}
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