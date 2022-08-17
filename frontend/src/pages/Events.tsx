import React, { useEffect } from 'react';
import NavBar from '../components/NavBar';
import EventsSection from '../components/EventsSection';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { getMe } from '../features/admin/adminSlice';
import { getAllEvents } from '../features/events/eventsSlice';
import Loading from '../components/Loading';

const Events = () => {
    const dispatch = useDispatch<AppDispatch>();

    const state = useSelector((state: RootState) => state);

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
        <div className="events-page-container">
            <NavBar />
            <EventsSection />
        </div>
    );
};

export default Events;