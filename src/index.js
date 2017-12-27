import './CSS/index.css';
import 'bootstrap/dist/css/bootstrap.css';

import App from './JS/App';
import registerServiceWorker from './registerServiceWorker';
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
