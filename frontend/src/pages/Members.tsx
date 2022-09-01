import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import MembersSection from '../components/MembersSection';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { getMe } from '../features/admin/adminSlice';
import { getMembers } from '../features/members/membersSlice';
import Loading from '../components/Loading';

const Members = () => {
    const dispatch = useDispatch<AppDispatch>();

    const state = useSelector((state: RootState) => state);

    const [openMenuState, setOpenMenuState] = useState(false);

    useEffect(() => {
        if (!state.admin.me.admin_id) dispatch(getMe());
    }, []);

    useEffect(() => {
        if (state.admin.isAuthorized) {
            if (state.members.membersList.length === 0) dispatch(getMembers())
        };
    }, [state.admin.isAuthorized]);

    if (!state.admin.isAuthorized) {
        return <Loading color='#040C43' border='7px' size='60px'/>;
    }

    return (
        <div className="members-page-container">
            <NavBar openMenuState={openMenuState} setOpenMenuState={setOpenMenuState} />
            <MembersSection setOpenMenuState={setOpenMenuState} />
        </div>
    );
};

export default Members;