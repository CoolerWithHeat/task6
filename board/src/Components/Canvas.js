import {useOnDraw} from './Hooks';
import React from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';
import getCurrentHost from './host';

const Canvas = ({
    width,
    height,
    EraserMode,
    pointerstrength,
    color,
    hor,
    vert,
}) => {
    const lineIndexes = {
        
    }
    const lineStyle = vert ? [{x:1000, y: -100000}, {x: 800, y: 1000}] : hor ? [{ x: 1000, y: 1000 }, { x: 800, y: 1000 }] : []
    const [socket, set_websocket] = React.useState()
    const ThreadName = window.location.pathname.split('/').pop();

    React.useEffect(Main=>{
        const socket = new ReconnectingWebSocket(getCurrentHost(false)+'draw/'+ThreadName+'/')
        set_websocket(socket)
    }, [])

    const {
        setCanvasRef,
        onCanvasMouseDown
    } = useOnDraw(onDraw);

    
    function onDraw(ctx, point, prevPoint, linecolor, pointerSize, toSocket=false) {
        
        if (socket && toSocket){
            const data = [lineStyle[0] ? lineStyle[0] : prevPoint, lineStyle[1] ? lineStyle[1] : point, ctx, EraserMode ? 'white' : color, pointerstrength]
            setTimeout(() => {
                if (lineStyle){
                    drawLine(...data)
                    socket.send(JSON.stringify(data))
                }else{
                    drawLine(prevPoint, point, ctx, EraserMode ? 'white' : color, pointerstrength)
                    socket.send(JSON.stringify([prevPoint, point, ctx, EraserMode ? 'white' : color, pointerstrength]))}
            }, 11);}

        else if(prevPoint && point){
            drawLine(prevPoint, point, ctx, linecolor, pointerstrength)
        }
        
    }   

    function drawLine(start, end, ctx, color, width){
        start = start ?? end;
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.strokeStyle = color;
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(start.x, start.y, 2, 0, 2 * Math.PI);
        ctx.fill();
    }

    
    return(
        <canvas
            width={width}
            height={height}
            onMouseDown={onCanvasMouseDown}
            style={canvasStyle}
            ref={setCanvasRef}
        />
    );

}

export default Canvas;

const canvasStyle = {
    
}