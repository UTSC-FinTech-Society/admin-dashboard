import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import EditProfileSection from '../components/EditProfileSection';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { getMe } from '../features/admin/adminSlice';
import Loading from '../components/Loading';

const EditProfile = () => {
    const dispatch = useDispatch<AppDispatch>();

    const admin = useSelector((state: RootState) => state.admin);

    const [openMenuState, setOpenMenuState] = useState(false);

    useEffect(() => {
        if (!admin.me.admin_id) dispatch(getMe());
    }, []);

    if (!admin.isAuthorized) {
        return <Loading color='#040C43' border='7px' size='60px'/>;
    }

    return (
        <div className="edit-profile-page-container">
            <NavBar openMenuState={openMenuState} setOpenMenuState={setOpenMenuState} />
            <EditProfileSection setOpenMenuState={setOpenMenuState} />
        </div>
    )
};

export default EditProfile;