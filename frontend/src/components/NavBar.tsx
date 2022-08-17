import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Logo from "../assets/utsc-fts-logo2.png";
import { FaUserCircle, FaHome, FaUsers, FaCalendarAlt, FaPoll, FaPowerOff } from "react-icons/fa";
import { AppDispatch, RootState } from '../store';
import { logoutAdmin } from '../features/admin/adminSlice';

const NavBar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const admin = useSelector((state: RootState) => state.admin.me);

    const dispatch = useDispatch<AppDispatch>();

    const path = location.pathname.split('/')[location.pathname.split('/').length - 1];
    const prevPath = location.pathname.split('/')[location.pathname.split('/').length - 2];

    const homeBtnRef = useRef<HTMLDivElement>(null);
    const membersBtnRef = useRef<HTMLDivElement>(null);
    const eventsBtnRef = useRef<HTMLDivElement>(null);
    const newsBtnRef = useRef<HTMLDivElement>(null);
    const logoutBtnRef = useRef<HTMLDivElement>(null);

    const [logoColorList, setLogoColorList] = useState<string[]>(['#f1f1f1', '#f1f1f1', '#f1f1f1', '#f1f1f1', '#f1f1f1']);

    useEffect(() => {

        if (Number(path) !== NaN && prevPath === 'events') {
            homeBtnRef.current?.classList.remove('select');
            membersBtnRef.current?.classList.remove('select');
            eventsBtnRef.current?.classList.add('select');
            newsBtnRef.current?.classList.remove('select');
            logoutBtnRef.current?.classList.remove('select');
            setLogoColorList(['#f1f1f1', '#f1f1f1', '#98dfeb', '#f1f1f1', '#f1f1f1']);
            return;
        } else if (Number(path) !== NaN && prevPath === 'news') {
            homeBtnRef.current?.classList.remove('select');
            membersBtnRef.current?.classList.remove('select');
            eventsBtnRef.current?.classList.remove('select');
            newsBtnRef.current?.classList.add('select');
            logoutBtnRef.current?.classList.remove('select');
            setLogoColorList(['#f1f1f1', '#f1f1f1', '#f1f1f1', '#98dfeb', '#f1f1f1']);
            return;
        }

        switch (path) {
            case 'home':
                homeBtnRef.current?.classList.add('select');
                membersBtnRef.current?.classList.remove('select');
                eventsBtnRef.current?.classList.remove('select');
                newsBtnRef.current?.classList.remove('select');
                logoutBtnRef.current?.classList.remove('select');
                setLogoColorList(['#98dfeb', '#f1f1f1', '#f1f1f1', '#f1f1f1', '#f1f1f1']);
                break;
            case 'members':
                homeBtnRef.current?.classList.remove('select');
                membersBtnRef.current?.classList.add('select');
                eventsBtnRef.current?.classList.remove('select');
                newsBtnRef.current?.classList.remove('select');
                logoutBtnRef.current?.classList.remove('select');
                setLogoColorList(['#f1f1f1', '#98dfeb', '#f1f1f1', '#f1f1f1', '#f1f1f1']);
                break;
            case 'events':
                homeBtnRef.current?.classList.remove('select');
                membersBtnRef.current?.classList.remove('select');
                eventsBtnRef.current?.classList.add('select');
                newsBtnRef.current?.classList.remove('select');
                logoutBtnRef.current?.classList.remove('select');
                setLogoColorList(['#f1f1f1', '#f1f1f1', '#98dfeb', '#f1f1f1', '#f1f1f1']);
                break;
            case 'news':
                homeBtnRef.current?.classList.remove('select');
                membersBtnRef.current?.classList.remove('select');
                eventsBtnRef.current?.classList.remove('select');
                newsBtnRef.current?.classList.add('select');
                logoutBtnRef.current?.classList.remove('select');
                setLogoColorList(['#f1f1f1', '#f1f1f1', '#f1f1f1', '#98dfeb', '#f1f1f1']);
                break;
            default:
                return;
        };

    }, [path, prevPath]);

    return (
        <nav className='nav-bar-container'>
            <img src={Logo} alt="FTS Logo" className='logo' />
            <div className="profile-container">
                <div className="profile-pic-container">
                    {admin.profile_pic_data ? <img src={`data:${admin.profile_pic_type};base64, ${admin.profile_pic_data}`} alt={`${admin.name} Profile Pic`} /> : <FaUserCircle size='100px' color='#f1f1f1' />}
                </div>
                <div className="profile-description">
                    <p className='name'>{admin.name}</p>
                    <p className='position'>{admin.position}</p>
                </div>
            </div>
            <div className="nav-btn-container">
                <div ref={homeBtnRef} className="nav-btn home" onClick={() => navigate('/dashboard/home')} >
                    <FaHome color={logoColorList[0]} size='20px' />
                    <h3>Home</h3>
                </div>
                <div ref={membersBtnRef} className="nav-btn members" onClick={() => navigate('/dashboard/members')} >
                    <FaUsers color={logoColorList[1]} size='20px' />
                    <h3>Members</h3>
                </div>
                <div ref={eventsBtnRef} className="nav-btn events" onClick={() => navigate('/dashboard/events')} >
                    <FaCalendarAlt color={logoColorList[2]} size='20px' />
                    <h3>Events</h3>
                </div>
                <div ref={newsBtnRef} className="nav-btn news" onClick={() => navigate('/dashboard/news')} >
                    <FaPoll color={logoColorList[3]} size='20px' />
                    <h3>News</h3>
                </div>
                <div ref={logoutBtnRef} className="nav-btn logout" onClick={() => {
                    homeBtnRef.current?.classList.remove('select');
                    membersBtnRef.current?.classList.remove('select');
                    eventsBtnRef.current?.classList.remove('select');
                    newsBtnRef.current?.classList.remove('select');
                    logoutBtnRef.current?.classList.add('select');
                    setLogoColorList(['#f1f1f1', '#f1f1f1', '#f1f1f1', '#f1f1f1', '#98dfeb']);
                    dispatch(logoutAdmin(admin.admin_id));
                }}>
                    <FaPowerOff color={logoColorList[4]} size='20px' />
                    <h3>Logout</h3>
                </div>
            </div>
        </nav>
    )
};

export default NavBar;