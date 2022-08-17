import React, { useEffect } from 'react';
import NavBar from '../components/NavBar';
import HomeSection from '../components/HomeSection';
import { useDispatch, useSelector } from 'react-redux';
import { getMe, getOtherAdmins } from '../features/admin/adminSlice';
import { AppDispatch, RootState } from '../store';
import { getMembers } from '../features/members/membersSlice';
import { getAllEvents } from '../features/events/eventsSlice';
import { getAllNews } from '../features/news/newsSlice';
import Loading from '../components/Loading';

const Home = () => {
    const dispatch = useDispatch<AppDispatch>();

    const state = useSelector((state: RootState) => state);

    useEffect(() => {
        if (!state.admin.me.admin_id) dispatch(getMe());
    }, []);

    useEffect(() => {
        if (state.admin.isAuthorized) {
            if (state.members.membersList.length === 0) dispatch(getMembers());
            if (state.events.eventsList.length === 0) dispatch(getAllEvents());
            if (state.news.newsList.length === 0) dispatch(getAllNews());
            if (state.admin.otherAdminsList.length === 0) dispatch(getOtherAdmins());
        }
    }, [state.admin.isAuthorized]);

    if (!state.admin.isAuthorized) {
        return <Loading color='#040C43' border='7px' size='60px'/>;
    }

    return (
        <div className="home-page-container">
            <NavBar />
            <HomeSection />
        </div>
    )
};

export default Home;