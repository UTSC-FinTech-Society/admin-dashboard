import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Members from './pages/Members';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import News from './pages/News';
import NewsDetails from './pages/NewsDetails';
import EditProfile from './pages/EditProfile';

const App = () => {
  return (
    <>
      <Router basename='/'>
        <div className="container">
          <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/dashboard/home' element={<Home />} />
            <Route path='/dashboard/members' element={<Members />} />
            <Route path='/dashboard/events' element={<Events />} />
            <Route path='/dashboard/events/:event_id' element={<EventDetails />} />
            <Route path='/dashboard/news' element={<News />} />
            <Route path='/dashboard/news/:news_id' element={<NewsDetails />} />
            <Route path='/dashboard/edit-profile' element={<EditProfile />} />
          </Routes>
        </div>
      </Router>
    </>
  );
};

export default App;
