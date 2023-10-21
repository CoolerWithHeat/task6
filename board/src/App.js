import './App.css';
import Canvas from './Components/Canvas';
import React from 'react';
import { SketchPicker } from 'react-color';
import getCurrentHost from './Components/host';

function DownloadImage(filename) {
  const targetElement = document.querySelector('canvas');
  const canvas = document.createElement('canvas');
  canvas.width = targetElement.clientWidth;
  canvas.height = targetElement.clientHeight;
  const context = canvas.getContext('2d');
  context.drawImage(targetElement, 0, 0);
  const dataURL = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.href = dataURL;
  link.download = filename;
  link.click();
}

function App() {

  const [eraseSelected, Update_eraseStatus] = React.useState(false)
  const [horizontal_Line, Update_horizontal_Line] = React.useState(false)
  const [vertical_Line, Update_vertical_Line] = React.useState(false)
  const [pointerstrength, Update_pointerstrength] = React.useState(10)
  const [currentColor, Update_currentColor] = React.useState('dark')
  const [ClearCanvas, Update_ClearCanvas] = React.useState(false)
  const ThreadName = window.location.pathname.split('/').pop();

  function ChangeColor(colorBase){
    Update_currentColor(colorBase.hex)
  }

  function SetEraser(){
    Update_eraseStatus(!eraseSelected)
    Update_horizontal_Line(false)
    Update_vertical_Line(false)
  }

  function clearAll(){
    const request = fetch(getCurrentHost()+'Clear/'+ThreadName+'/', {
      method: 'POST'
    }).then(Main=>{
        window.location.reload()
      })
  }

  const setLine = (each)=>{
    const buttonname = each.target.name
    const index = {
      vertical: [horizontal_Line, Update_vertical_Line],
      horizontal: [horizontal_Line, Update_horizontal_Line],

    }
    for (let key in index) {
      if (buttonname == key)
        index[key][1](!index[key][0])
      else  
        index[key][1](false)
    }
    if (!vertical_Line){
      Update_eraseStatus(false)
    }
  }

  return (
    <div className="App">

      <Canvas
          width={'1800%'}
          height={'1200%'}
          EraserMode = {eraseSelected}
          pointerstrength = {pointerstrength}
          color = {currentColor} 
          vert = {vertical_Line}
          hor = {horizontal_Line}
      /> 

      <div id='ToolBar'>
        <button name='eraser' onClick={SetEraser} className={`btn btn-${eraseSelected ? 'dark' : 'light'}`}>Eraser</button>
        <input style={{width:'45px'}} onChange={(tag)=>Update_pointerstrength(tag.target.value)} defaultValue={pointerstrength} />
        <SketchPicker color={currentColor} onChangeComplete={ChangeColor}/>
        <button onClick={()=>DownloadImage('Your Drawing.png')} className="btn btn-info">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="25" fill="white" class="bi bi-download" viewBox="0 0 16 16">
            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
            <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
          </svg>
        </button>
        <button onClick={clearAll} className='btn btn-danger'>Clear</button>
      </div>

      <button name='vertical' onClick={setLine} className={`btn btn-${vertical_Line ? 'warning' : 'white'}`}>Vertical</button>
      <button name='horizontal' onClick={setLine} className={`btn btn-${horizontal_Line ? 'warning' : 'white'}`}>Horizontal</button>
    </div>
  );
}

export default App;