import React from 'react';
import { createRoot } from 'react-dom/client';

//import TestUI from './components/testui/TestUI';
import Login from './components/login/Login';

const root = createRoot(document.getElementById('app'));
root.render(<>
    <Login/>
</>);