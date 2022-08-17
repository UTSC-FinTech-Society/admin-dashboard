import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createEvent, deleteEvent } from "../features/events/eventsSlice";
import { RootState, AppDispatch } from '../store';
import HeaderBar from './HeaderBar';
import ModalForm from './ModalForm';
import Loading from './Loading';
import { toast } from 'react-toastify';
import EventCard from './EventCard';
import Modal from './Modal';
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from 'draftjs-to-html';

const EventsSection = () => {
    const { eventsList, isLoading } = useSelector((state: RootState) => state.events);

    const dispatch = useDispatch<AppDispatch>();

    const [addNewEventStatus, setAddNewEventStatus] = useState<boolean>(false);
    const [addNewEventFormData, setAddNewEventFormData] = useState<{ name: string, description: string, register_deadline: string, start_datetime: string, end_datetime: string, entry_fee?: string, location: string, poster?: File, signup_link?: string }>({ name: '', description: '', register_deadline: '', start_datetime: '', end_datetime: '', entry_fee: '', location: '', poster: undefined, signup_link: '' });
    const { name, description, register_deadline, start_datetime, end_datetime, entry_fee, location, poster, signup_link } = addNewEventFormData;

    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

    const [deleteEventStatus, setDeleteEventStatus] = useState<boolean>(false);
    const [deleteEventId, setDeleteEventId] = useState<number>();

    const clearAddNewEventFormData = () => {
        setAddNewEventFormData({ name: '', description: '', register_deadline: '', start_datetime: '', end_datetime: '', entry_fee: '', location: '', poster: undefined, signup_link: '' });
    };

    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setAddNewEventFormData(previousData => ({ ...previousData, [e.target.name]: e.target.value  }));
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAddNewEventFormData(previousDate => ({ ...previousDate, poster: e.target.files![0] }));
    };

    const handleEditorStateChange = (state: EditorState) => {
        setEditorState(state);
        setAddNewEventFormData(previousData => ({ ...previousData, description: draftToHtml(convertToRaw(state.getCurrentContent())) }));
    }

    const onSubmit = () => {

        if (name === '' || description === '' || register_deadline === '' || start_datetime === '' || end_datetime === '' || location === '' || !poster) {
            toast.error('Please fill in all the required fields', { autoClose: 3000 });
            return;
        }

        if (new Date(start_datetime).getTime() >= new Date(end_datetime).getTime()) {
            toast.error('End Datetime must be greater that Start Datetime', { autoClose: 3000 });
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('register_deadline', register_deadline);
        formData.append('start_datetime', start_datetime);
        formData.append('end_datetime', end_datetime);
        if (entry_fee !== '') formData.append('entry_fee', entry_fee!);
        formData.append('location', location);
        formData.append('poster', poster);
        if (signup_link !== '') formData.append('signup_link', signup_link!);

        dispatch(createEvent(formData));
        clearAddNewEventFormData();
        setAddNewEventStatus(false);
    };

    const deleteEventFunction = (eventId: number | undefined) => {
        dispatch(deleteEvent(eventId));
    }

    return (
        <div className='events-section-container'>
            <HeaderBar />
            <section className='events-section'>
                <div className="events-text-container">
                    <h1>Events</h1>
                </div>
                <button className='add-new-event-btn' onClick={() => setAddNewEventStatus(true)}>Add new event</button>
                {addNewEventStatus ? (
                        <ModalForm description='Add New Event' toggleOpenAndClose={() => {
                            clearAddNewEventFormData();
                            setEditorState(() => EditorState.createEmpty());
                            setAddNewEventStatus(false);
                        }} onSubmit={onSubmit} >
                            <div className="input-container">
                                <label htmlFor="name">Name <span>*</span></label>
                                <input type="text" name="name" id="name" placeholder='FinTech Case Competition' defaultValue={name} onBlur={onChange} autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false" required/>
                            </div>
                            <div className="input-container">
                                <label htmlFor="description">Description <span>*</span></label>
                                <Editor editorState={editorState} onEditorStateChange={handleEditorStateChange} wrapperClassName='description-wrapper' editorClassName='description-editor' toolbarClassName='description-toolbar' />
                            </div>
                            <div className="input-container">
                                <label htmlFor="register_deadline">Register Deadline <span>*</span></label>
                                <input type='datetime-local' name="register_deadline" id="register_deadline" defaultValue={register_deadline} onBlur={onChange} autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false" required/>
                            </div>
                            <div className="input-container">
                                <label htmlFor="start_datetime">Start Datetime <span>*</span></label>
                                <input type='datetime-local' name="start_datetime" id="start_datetime" defaultValue={start_datetime} onBlur={onChange} autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false" required/>
                            </div>
                            <div className="input-container">
                                <label htmlFor="end_datetime">End Datetime <span>*</span></label>
                                <input type='datetime-local' name="end_datetime" id="end_datetime" defaultValue={end_datetime} onBlur={onChange} autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false" required/>
                            </div>
                            <div className="input-container">
                                <label htmlFor="entry_fee">Entry Fee ($)</label>
                                <input type="number" name="entry_fee" id="entry_fee" placeholder='15' defaultValue={entry_fee} onBlur={onChange} autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false" required/>
                            </div>
                            <div className="input-container">
                                <label htmlFor="location">Location <span>*</span></label>
                                <input type="text" name="location" id="location" placeholder='The Bridge' defaultValue={location} onBlur={onChange} autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false" required/>
                            </div>
                            <div className="input-container">
                                <label htmlFor="poster">Poster <span>*</span></label>
                                <input type='file' name="poster" id="poster" accept='image/*' onChange={handleFileSelect} autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false" required/>
                            </div>
                            <div className="input-container">
                                <label htmlFor="signup_link">Signup Link</label>
                                <input type="url" name="signup_link" id="signup_link" defaultValue={signup_link} onBlur={onChange}  placeholder='https://utsc-fts/fintech-case-competition/application-form' autoComplete='off' required/>
                            </div>
                        </ModalForm>
                    ) : null}
                {isLoading ? <Loading border='7px' size='50px' color='#040C43' /> : (
                    <div className="events-list-container">
                        {eventsList.length > 0 ? eventsList.map(event => <EventCard key={event.event_id} openDeleteModal={setDeleteEventStatus} setDeleteEventId={setDeleteEventId} {...event} />) : <h3 className='no-events-text'>There are no any events yet...</h3>}
                    </div>
                )}
                {deleteEventStatus ? (
                    <Modal confirm_btn_text='Delete' confirm_btn_color='red' toggleOpenAndClose={setDeleteEventStatus} id={deleteEventId} confirm_function={deleteEventFunction} >
                        <p className='description'>Are you sure to delete this event?</p>
                    </Modal>
                ) : null}
            </section>
        </div>
    )
};

export default EventsSection;