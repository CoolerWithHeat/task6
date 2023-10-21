function getCurrentHost(useHttp=true) {
    const protocol = useHttp ? window.location.protocol : 'ws';
    let host = window.location.host;
  
    if (window.location.host == 'localhost:3000') {
        host = '127.0.0.1:8000';
        
    }
  
    return `${protocol}${!useHttp ? ":" : ''}//${host}/`;
  }

export default getCurrentHost