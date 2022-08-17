import React from 'react';
import HeaderBar from './HeaderBar';
import { useSelector } from 'react-redux';
import { FiUsers } from "react-icons/fi";
import { FaLongArrowAltUp } from "react-icons/fa";
import { MdEvent } from "react-icons/md";
import { BiNews } from "react-icons/bi";
import { RootState } from '../store';
import AdminCard from './AdminCard';
import Loading from './Loading';
import { MemberType } from '../features/members/membersSlice';
import { EventType } from '../features/events/eventsSlice';
import { NewsType } from '../features/news/newsSlice';

const HomeSection = () => {
    const admin = useSelector((state: RootState) => state.admin);
    const members = useSelector((state: RootState) => state.members);
    const events = useSelector((state: RootState) => state.events);
    const news = useSelector((state: RootState) => state.news);

    const calculate_no_of_new_members = (membersList: MemberType[]) => {
        const no_of_new_members = membersList.filter(member => ((new Date().getTime() - new Date(member.timestamp).getTime()) / (1000 * 3600 * 24)) <= 31).length;
        return no_of_new_members;
    };

    const calculate_no_of_old_members = (no_of_new_members: number) => {
        return members.membersList.length - no_of_new_members;
    };

    const calculate_members_growth = (no_of_new_members: number, no_of_old_members: number) => {
        return Math.round((no_of_new_members / no_of_old_members) * 100);
    };

    const calculate_no_of_new_events = (eventsList: EventType[]) => {
        const no_of_new_events = eventsList.filter(event => ((new Date().getTime() - new Date(event.created_at).getTime()) / (1000 * 3600 * 24)) <= 31).length;
        return no_of_new_events;
    };

    const calculate_no_of_old_events = (no_of_new_events: number) => {
        return events.eventsList.length - no_of_new_events;
    };

    const calculate_events_growth = (no_of_new_events: number, no_of_old_events: number) => {
        return Math.round((no_of_new_events / no_of_old_events) * 100);
    };

    const calculate_no_of_latest_news = (newsList: NewsType[]) => {
        const no_of_latest_news = newsList.filter(news => ((new Date().getTime() - new Date(news.created_at).getTime()) / (1000 * 3600 * 24)) <= 31).length;
        return no_of_latest_news;
    };

    const calculate_no_of_old_news = (no_of_latest_news: number) => {
        return news.newsList.length - no_of_latest_news;
    };

    const calculate_news_growth = (no_of_latest_news: number, no_of_old_news: number) => {
        return Math.round((no_of_latest_news / no_of_old_news) * 100);
    };

    return (
        <div className='home-section-container'>
            <HeaderBar />
            <section className='home-section'>
                <div className="welcome-text-container">
                    <h1>Hello, {admin.me.name?.split(' ')[0]}</h1>
                    <h3>Welcome back!</h3>
                </div>
                <div className="content-container">
                    <div className="stats-panels-container">
                        <div className="new-member-stats-container">
                            {!members.isLoading ? (
                                <>
                                    <div className="number-container">
                                        <div className="description-container">
                                            <h3 className='description'>New members</h3>
                                            <p className='number'>{members.membersList.length > 0 ? calculate_no_of_new_members(members.membersList) : 0}</p>
                                        </div>
                                        <div className="icon-container">
                                            <FiUsers size='25px' color='white' />
                                        </div>
                                    </div>
                                    <div className="stats-container">
                                        <div className="stats">
                                            <FaLongArrowAltUp color='green' size='10px' />
                                            <p>{members.membersList.length > 0 ? calculate_no_of_old_members(calculate_no_of_new_members(members.membersList)) > 0 ? `${calculate_members_growth(calculate_no_of_new_members(members.membersList), calculate_no_of_old_members(calculate_no_of_new_members(members.membersList)))}%` : '100%' : '0%'}</p>
                                        </div>
                                        <p className='description'>Since last month</p>
                                    </div>
                                </>
                            ) : <Loading border='5px' color='#040c43' size='30px' />}
                        </div>
                        <div className="new-event-stats-container">
                            {!events.isLoading ? (
                                <>
                                    <div className="number-container">
                                        <div className="description-container">
                                            <h3 className='description'>New events</h3>
                                            <p className='number'>{events.eventsList.length > 0 ? calculate_no_of_new_events(events.eventsList) : 0}</p>
                                        </div>
                                        <div className="icon-container">
                                            <MdEvent size='28px' color='white' />
                                        </div>
                                    </div>
                                    <div className="stats-container">
                                        <div className="stats">
                                            <FaLongArrowAltUp color='green' size='10px' />
                                            <p>{events.eventsList.length > 0 ? calculate_no_of_old_events(calculate_no_of_new_events(events.eventsList)) > 0 ? `${calculate_events_growth(calculate_no_of_new_events(events.eventsList), calculate_no_of_old_events(calculate_no_of_new_events(events.eventsList)))}%` : '100%' : '0%'}</p>
                                        </div>
                                        <p className='description'>Since last month</p>
                                    </div>
                                </>
                            ) : <Loading border='5px' color='#040c43' size='30px' />}
                        </div>
                        <div className="latest-news-stats-container">
                            {!news.isLoading ? (
                                <>
                                    <div className="number-container">
                                        <div className="description-container">
                                            <h3 className='description'>Latest news</h3>
                                            <p className='number'>{news.newsList.length > 0 ? calculate_no_of_latest_news(news.newsList) : 0}</p>
                                        </div>
                                        <div className="icon-container">
                                            <BiNews size='28px' color='white' />
                                        </div>
                                    </div>
                                    <div className="stats-container">
                                        <div className="stats">
                                            <FaLongArrowAltUp color='green' size='10px' />
                                            <p>{news.newsList.length > 0 ? calculate_no_of_old_news(calculate_no_of_latest_news(news.newsList)) > 0 ? `${calculate_news_growth(calculate_no_of_latest_news(news.newsList), calculate_no_of_old_news(calculate_no_of_latest_news(news.newsList)))}%` : '100%' : '0%'}</p>
                                        </div>
                                        <p className='description'>Since last month</p>
                                    </div>
                                </>
                            ) : <Loading border='5px' color='#040c43' size='30px' />}
                        </div>
                    </div>
                    <div className="admins-panel-container">
                        <h3 className='description'>Other Admins</h3>
                        <div className="admins-list">
                            {!admin.isLoading ? admin.otherAdminsList.length > 0 ? admin.otherAdminsList.map(admin => <AdminCard key={admin.admin_id} {...admin} />) : <p className='no-admin-text'>There are no any admins yet...</p> : <Loading border='5px' size='30px' color='#040c43' />}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
};

export default HomeSection;