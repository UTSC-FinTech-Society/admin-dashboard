import React from 'react';
import { FaUserCircle } from 'react-icons/fa';

type Prop = {
    admin_id: number, 
    username: string, 
    name: string, 
    position: string, 
    profile_pic_type?: string,
    profile_pic_data?: string 
    last_login: Date, 
    status: string
};

const AdminCard = ({ admin_id, username, name, position, profile_pic_type, profile_pic_data, last_login, status }: Prop) => {

    const calculate_time_difference = (last_login_time: Date) => {
        const now = new Date();
        const last_login = new Date(last_login_time);
        const time_difference = (now.getTime() - last_login.getTime()) / (1000 * 60);
        if (time_difference >= 60) {
            return `${Math.floor(time_difference / 60)}h ${Math.round(((time_difference / 60) - Math.floor(time_difference / 60)) * 60)}m ago`;
        } else {
            return `${Math.round(time_difference)}min ago`;
        }
    }

    return (
        <div className="admin-card-container">
            <div className="admin-card">
                <div className="profile-container">
                    <div className="profile-pic-container">
                        {profile_pic_data ? <img src={`data:${profile_pic_type};base64, ${profile_pic_data}`} alt={`${name} Profile Pic`} /> : <FaUserCircle size='40px' color='black' />}
                    </div>
                    <div className="description-container">
                        <p className='name'>{name}</p>
                        <p className='position'>{position}</p>
                    </div>
                </div>
                <div className="status-container">
                    <div className="status">
                        {status === 'online'? (
                            <>
                                <div className="status-circle-container">
                                    <div className="status-circle" style={{backgroundColor: '#5cb85c'}}></div>
                                </div>
                                <p style={{color: '#5cb85c'}} >{status}</p>
                            </>
                        ) : (
                            <>
                                <div className="status-circle-container">
                                    <div className="status-circle" style={{backgroundColor: 'gray'}}></div>
                                </div>
                                <p style={{color: 'gray'}}>{status}</p>
                            </>
                        )}
                    </div>
                    {last_login ? status === 'online' ?  <p className='last-login'>currently~</p> : <p className='last-login'>{calculate_time_difference(last_login)}</p> : <p className='last-login'>never login...</p>}
                </div>
            </div>
        </div>
    )
};

export default AdminCard;