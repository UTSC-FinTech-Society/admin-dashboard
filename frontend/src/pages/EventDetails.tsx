import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import EventDetailsSection from '../components/EventDetailsSection';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { getMe } from '../features/admin/adminSlice';
import { getAllEvents } from '../features/events/eventsSlice';
import Loading from '../components/Loading';

const EventDetails = () => {
    const dispatch = useDispatch<AppDispatch>();

    const state = useSelector((state: RootState) => state);

    const [openMenuState, setOpenMenuState] = useState(false);

    useEffect(() => {
        if (!state.admin.me.admin_id) dispatch(getMe());
    }, []);

    useEffect(() => {
        if (state.admin.isAuthorized) {
            if (state.events.eventsList.length === 0) dispatch(getAllEvents());
        }
    }, [state.admin.isAuthorized]);

    if (!state.admin.isAuthorized) {
        return <Loading color='#040C43' border='7px' size='60px'/>;
    }

    return (
      <div className="event-details-page-container">
          <NavBar openMenuState={openMenuState} setOpenMenuState={setOpenMenuState} />
          <EventDetailsSection setOpenMenuState={setOpenMenuState} />
      </div>
    )
};

export default EventDetails;