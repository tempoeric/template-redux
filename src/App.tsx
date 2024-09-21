import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ContactList, NotFound } from 'pages';

import 'antd/dist/reset.css';
import 'App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ContactList />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
