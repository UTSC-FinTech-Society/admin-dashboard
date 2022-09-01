import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { AiFillCaretDown } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";

const HeaderBar = ({ setOpenMenuState }: { setOpenMenuState: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const admin = useSelector((state: RootState) => state.admin.me);

    const dropdownMenuRef = useRef<HTMLDivElement>(null);
    const showMenuBtnRef = useRef<HTMLDivElement>(null);

    const navigate = useNavigate();

    const showMenu = () => {
        if (dropdownMenuRef.current) dropdownMenuRef!.current.classList.add('show');
    };

    document.onclick = (e: any) => {
        if (!dropdownMenuRef.current?.contains(e.target) && !showMenuBtnRef.current?.contains(e.target)) {
            dropdownMenuRef.current?.classList.remove('show');
        }
    };

    return (
        <header className='header-bar-container'>
            <div className="mobile-menu-btn" onClick={() => setOpenMenuState(true)} ></div>
            <div className="profile-container">
                {admin.profile_pic_data? <img src={`data:${admin.profile_pic_type};base64, ${admin.profile_pic_data}`} alt={`${admin.name} Profile Pic`} /> : <FaUserCircle size='35px' color='#f1f1f1' />}
                <p className='name'>{admin.username}</p>
                <div className="popup-menu-btn" onClick={showMenu} ref={showMenuBtnRef}><AiFillCaretDown size='12px' color='white'/></div>
                <div className="popup-menu-container" ref={dropdownMenuRef}>
                    <div className="edit-profile" onClick={() => navigate('/dashboard/edit-profile')} ><div className="icon"><FaEdit size="18px" color="navy" /></div><h4>Edit Profile</h4></div>   
                </div>
            </div>
        </header>
    )
};

export default HeaderBar;