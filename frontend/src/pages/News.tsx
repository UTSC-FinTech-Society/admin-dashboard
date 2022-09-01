import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import NewsSection from '../components/NewsSection';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { getMe } from '../features/admin/adminSlice';
import { getAllNews } from '../features/news/newsSlice';
import Loading from '../components/Loading';

const News = () => {
    const dispatch = useDispatch<AppDispatch>();

    const state = useSelector((state: RootState) => state);

    const [openMenuState, setOpenMenuState] = useState(false);

    useEffect(() => {
        if (!state.admin.me.admin_id) dispatch(getMe());
    }, []);

    useEffect(() => {
        if (state.admin.isAuthorized) {
            if (state.news.newsList.length === 0) dispatch(getAllNews());
        }
    }, [state.admin.isAuthorized]);

    if (!state.admin.isAuthorized) {
        return <Loading color='#040C43' border='7px' size='60px'/>;
    }

    return (
        <div className="news-page-container">
            <NavBar openMenuState={openMenuState} setOpenMenuState={setOpenMenuState} />
            <NewsSection setOpenMenuState={setOpenMenuState} />
        </div>
    )
};

export default News;