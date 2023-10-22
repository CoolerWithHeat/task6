import { useEffect, useRef, useState } from "react";
import ReconnectingWebSocket from 'reconnecting-websocket';
import getCurrentHost from "./host";


export function useOnDraw(onDraw) {
    const [socket, set_websocket] = useState()
    const canvasRef = useRef(null);
    const isDrawingRef = useRef(false);
    const prevPointRef = useRef(null);
    const ThreadName = window.location.pathname.split('/').pop();
    const mouseMoveListenerRef = useRef(null);
    const mouseUpListenerRef = useRef(null);

    function setCanvasRef(ref) {
        canvasRef.current = ref;
    }

    function onCanvasMouseDown() {
        isDrawingRef.current = true;
    }

    function drawDrawingBasedOnData(canvas, data) {
        const ctx = canvas.getContext('2d');
        for (const path of data.paths) {
          ctx.strokeStyle = data.strokeColor;
          ctx.lineWidth = data.strokeWidth;
          ctx.beginPath()
          for (const point of path) {
            ctx.lineTo(point.x, point.y);
          }
          ctx.stroke();
        }
      }

    async function fetchPatterns(){
        
        const link = getCurrentHost()+'GetThread/'+ThreadName
        console.log(link)
        const request = await fetch(link, {
            method:"GET"
        })
        const result = await request.json()

        const ctx = canvasRef.current.getContext('2d');
        for(let i = 0; i < result.pattern.length; i++){
            const pattern = result.pattern[i]
            const point = pattern[0];
            const prevPoint = pattern[1];
            const color = pattern[3]
            const pointerStrength = pattern[4]
            if (ctx && point && prevPoint)
                console.log(color, pointerStrength)
                if (onDraw) onDraw(ctx, point, prevPoint, color, pointerStrength, false);
        }
    }
    useEffect(Main=>{
        fetchPatterns()
    }, [])

    useEffect(()=>{

        const socket = new ReconnectingWebSocket(getCurrentHost(false) + 'draw/'+ThreadName+'/')
        
        socket.onmessage = (flow)=>{
            const pattern = JSON.parse(JSON.parse(flow.data).pattern)
            const point = pattern[0];
            const prevPoint = pattern[1];
            const color = pattern[3]
            const pointerStrength = pattern[4]
            const ctx = canvasRef.current.getContext('2d');
            if (ctx && point && prevPoint)
                console.log(color, pointerStrength)
                if (onDraw) onDraw(ctx, point, prevPoint, color, pointerStrength, false);
        }
        set_websocket(socket)

    }, [])

    useEffect(() => {
        function computePointInCanvas(clientX, clientY) {
            if (canvasRef.current) {
                const boundingRect = canvasRef.current.getBoundingClientRect();
                return {
                    x: clientX - boundingRect.left,
                    y: clientY - boundingRect.top
                }
            } else {
                return null;
            }
        }

        function initMouseMoveListener() {
            const mouseMoveListener = (e) => {
                if (isDrawingRef.current && canvasRef.current) {
                    const point = computePointInCanvas(e.clientX, e.clientY);
                    const ctx = canvasRef.current.getContext('2d');
                    if (onDraw) onDraw(ctx, point, prevPointRef.current, 75, 75, true);
                    prevPointRef.current = point;
                }
            }
            mouseMoveListenerRef.current = mouseMoveListener;
            window.addEventListener("mousemove", mouseMoveListener);
        }

        function initMouseUpListener() {
            const listener = () => {
                isDrawingRef.current = false;
                prevPointRef.current = null;
            }
            mouseUpListenerRef.current = listener;
            window.addEventListener("mouseup", listener);
        }

        function cleanup() {
            if (mouseMoveListenerRef.current) {
                window.removeEventListener("mousemove", mouseMoveListenerRef.current);
            }
            if (mouseUpListenerRef.current) {
                window.removeEventListener("mouseup", mouseUpListenerRef.current);
            }
        }

        initMouseMoveListener();
        initMouseUpListener();
        return () => cleanup();

    }, [onDraw]);

    return {
        setCanvasRef,
        onCanvasMouseDown
    }

};