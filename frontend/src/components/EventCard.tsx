import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AiFillEdit } from "react-icons/ai";
import { MdDelete } from "react-icons/md";

type Prop = {
    event_id: number,
    name: string,
    description: string,
    register_deadline: Date,
    start_datetime: Date,
    end_datetime: Date,
    entry_fee?: number,
    location: string,
    poster_type: string,
    poster_data: string, 
    signup_link?: string,
    created_at: Date,
    openDeleteModal: React.Dispatch<React.SetStateAction<boolean>>,
    setDeleteEventId: React.Dispatch<React.SetStateAction<number | undefined>>,
};

const EventCard = ({ event_id, name, description, register_deadline, start_datetime, end_datetime, entry_fee, location, poster_type, poster_data, signup_link, created_at, openDeleteModal, setDeleteEventId }: Prop) => {

    const navigate = useNavigate();

    const formatTime = (hour: number, min: number) => {
        const formattedMin = min < 10 ? `0${min}` : min;

        if (hour > 12) {
            return `${hour - 12}:${formattedMin}pm`;
        } else if (hour === 12) {
            return `${hour}:${formattedMin}pm`;
        } else {
            return `${hour}:${formattedMin}am`;
        }
    }

    const formatDate = (datetime: Date) => {
        const register_deadline = new Date(datetime);
        const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][register_deadline.getUTCMonth()];
        const day = register_deadline.getUTCDate();
        const hour = register_deadline.getUTCHours();
        const min = register_deadline.getUTCMinutes();

        return `${month} ${day} @ ${formatTime(hour, min)}`;
    };

    const formatEventTimePeriod = (start_time: Date, end_time: Date) => {
        const start_datetime = new Date(start_time);
        const end_datetime = new Date(end_time);

        const start_month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][start_datetime.getUTCMonth()];
        const end_month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][end_datetime.getUTCMonth()];
        const start_day = start_datetime.getUTCDate();
        const end_day = end_datetime.getUTCDate();
        const start_hour = start_datetime.getUTCHours(); 
        const end_hour = end_datetime.getUTCHours();
        const start_min = start_datetime.getUTCMinutes();
        const end_min = end_datetime.getUTCMinutes();

        if (((end_datetime.getTime() - start_datetime.getTime()) / (1000 * 60 * 60)) <= 24) {
            return `${start_month} ${start_day} @ ${formatTime(start_hour, start_min)} - ${formatTime(end_hour, end_min)}`;
        } else {
            if (start_hour === 0 && end_hour === 0 && start_min === 0 && end_hour === 0) {
                return `${start_month} ${start_day} - ${end_month} ${end_day}`;
            } else {
                return `${start_month} ${start_day} ${formatTime(start_hour, start_min)} - ${end_month} ${end_day} ${formatTime(end_hour, end_min)}`;
            }
        }
    };

    return (
        <div className="event-card-container">
            <div className="poster-container">
                <img src={`data:${poster_type};base64, ${poster_data}`} alt={`${name} Poster`} />
                <div className="edit-btn" onClick={() => navigate(`/dashboard/events/${event_id}`)}><AiFillEdit color='#ffa700' size='30px' /></div>
                <div className="delete-btn" onClick={() => {
                    openDeleteModal(true);
                    setDeleteEventId(event_id);
                }} ><MdDelete color='red' size='30px' /></div>
            </div>
            <div className="description-container">
                <h3 className='name'>{name}</h3>
                <div className="details-container">
                    <p className='entry-fee'>Entry Fee: {!entry_fee || entry_fee === 0 ? 'Free' : `$${entry_fee}`}</p>
                    <p className='register-deadline'>{`Sign Up Deadline: ${formatDate(register_deadline)}`}</p>
                    <p className='start-and-end-datetime'>{`Date: ${formatEventTimePeriod(start_datetime, end_datetime)}`}</p>
                    <p className='location'>{`Location: ${location}`}</p>
                </div>
            </div>
        </div>
    )
};

export default EventCard;