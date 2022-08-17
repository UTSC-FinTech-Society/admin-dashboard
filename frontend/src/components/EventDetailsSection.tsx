import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { updateEvent, deleteEvent } from '../features/events/eventsSlice';
import { AppDispatch, RootState } from '../store';
import HeaderBar from './HeaderBar';
import { toast } from 'react-toastify';
import Modal from './Modal';
import Loading from './Loading';
import axios, { AxiosResponse, AxiosError } from "axios";
import convertArrayBufferToBase64String from '../utils/displayImage';
import { MdKeyboardBackspace } from "react-icons/md";
import { EditorState, ContentState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import DOMPurify from "dompurify";
 
const EventDetailsSection = () => {
    const event_id = Number(useParams().event_id);
    const { eventsList, isLoading } = useSelector((state: RootState) => state.events);

    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const [event, setEvent] = useState<{ event_id: number, name: string, description: string, register_deadline: Date, start_datetime: Date, end_datetime: Date, entry_fee?: number, location: string, poster_type: string, poster_data: string, signup_link?: string, created_at: Date} | undefined>(undefined);

    const [eventData, setEventData] = useState<{ name?: string, description?: string, register_deadline?: string, start_datetime?: string, end_datetime?: string, entry_fee?: string, location?: string, poster?: File, signup_link?: string }>({ name: '', description: '', register_deadline: '', start_datetime: '', end_datetime: '', entry_fee: '', location: '', poster: undefined, signup_link: '' });
    const { name, description, register_deadline, start_datetime, end_datetime, entry_fee, location, poster, signup_link } = eventData;

    useEffect(() => {

        if (!isLoading) {

            if (eventsList.length > 0) {
                const eventExist = eventsList.find(event => event.event_id === event_id);
    
                if (eventExist) {
                    setEvent({ event_id: eventExist!.event_id, name: eventExist!.name, description: eventExist!.description, register_deadline: eventExist!.register_deadline, start_datetime: eventExist!.start_datetime, end_datetime: eventExist!.end_datetime, entry_fee: eventExist?.entry_fee, location: eventExist!.location, poster_type: eventExist!.poster_type, poster_data: eventExist!.poster_data, signup_link: eventExist?.signup_link, created_at: eventExist!.created_at });
                    setEventData({ name: eventExist?.name, description: eventExist?.description, register_deadline: eventExist?.register_deadline.toString(), start_datetime: eventExist?.start_datetime.toString(), end_datetime: eventExist?.end_datetime.toString(), entry_fee: eventExist?.entry_fee?.toString(), location: eventExist?.location, poster: undefined, signup_link: eventExist?.signup_link });
                } else {
                    toast.error('Event does not exist', { autoClose: 3000 });
                    navigate('/dashboard/event');
                }
            } else {
                axios.get(`${process.env.REACT_APP_SERVER_URL}/api/events/${event_id}`).then((response: AxiosResponse) => {
                    setEvent({ event_id: response.data.event.event_id, name: response.data.event.name, description: response.data.event.description, register_deadline: response.data.event.register_deadline, start_datetime: response.data.event.start_datetime, end_datetime: response.data.event.end_datetime, entry_fee: response.data.event.entry_fee, location: response.data.event.location, poster_type: response.data.event.poster_type, poster_data: convertArrayBufferToBase64String(response.data.event.poster_data.data)!, signup_link: response.data.event.signup_link, created_at: response.data.event.created_at });
                    setEventData({ name: response.data.event.name, description: response.data.event.description, register_deadline: response.data.event.register_deadline.toString(), start_datetime: response.data.event.start_datetime.toString(), end_datetime: response.data.event.end_datetime.toString(), entry_fee: response.data.event.entry_fee?.toString(), location: response.data.event.location, poster: undefined, signup_link: response.data.event.signup_link });
                }).catch((error: AxiosError | any) => {
                    toast.error('Event does not exist', { autoClose: 3000 });
                    navigate('/dashboard/event');
                });
            }
            
        }            

    }, [eventsList]);

    const [editorState, setEditorState] = useState<EditorState>(() => EditorState.createEmpty());

    useEffect(() => {
        if (description !== '') {
            const blocksFromHtml = htmlToDraft(description!);
            const stateWithContent = EditorState.createWithContent(ContentState.createFromBlockArray(blocksFromHtml.contentBlocks, blocksFromHtml.entityMap));
            setEditorState(stateWithContent);
        }
    }, [description]);

    const [updateEventStatus, setUpdateEventStatus] = useState<boolean>(false);
    const [submitUpdateEventStatus, setSubmitUpdateEventStatus] = useState<boolean>(false);
    const [deleteEventStatus, setDeleteEventStatus] = useState<boolean>(false);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEventData(previousData => ({ ...previousData, [e.target.name]: e.target.value }));
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEventData(previousDate => ({ ...previousDate, poster: e.target.files![0] }));
    };

    const handleEditorStateChange = (state: EditorState) => {
        setEditorState(state);
        setEventData(previousData => ({ ...previousData, description: draftToHtml(convertToRaw(state.getCurrentContent())) }));
    };

    const displayPhoto = (image: File) => {
        return URL.createObjectURL(image);
    };

    const updateEventFunction = async (eventId: number | undefined) => {
        if (name === '' || description === '' || register_deadline === '' || start_datetime === '' || end_datetime === '' || location === '') {
            toast.error('Please provide all the necessary fields', { autoClose: 3000 });
            return;
        } 

        const formData = new FormData();
        formData.append('name', name!);
        formData.append('description', description!);
        formData.append('register_deadline', register_deadline!);
        formData.append('start_datetime', start_datetime!);
        formData.append('end_datetime', end_datetime!);
        formData.append('entry_fee', entry_fee!);
        formData.append('location', location!);
        if (poster) formData.append('poster', poster);
        formData.append('signup_link', signup_link!);
        dispatch(updateEvent({ eventId: eventId, updatedInfo: formData }));
        setUpdateEventStatus(false);
    };

    const deleteEventFunction = (newsId: number | undefined) => {
        dispatch(deleteEvent(event_id));
        navigate('/dashboard/events');
    };

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

    const formatDate = (datetime: string) => {
        const register_deadline = new Date(datetime);
        const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][register_deadline.getUTCMonth()];
        const day = register_deadline.getUTCDate();
        const hour = register_deadline.getUTCHours();
        const min = register_deadline.getUTCMinutes();

        return `${month} ${day} @ ${formatTime(hour, min)}`;
    };

    const formatEventTimePeriod = (start_time: string, end_time: string) => {
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
        <div className="event-details-section-container">
            <HeaderBar />
            <section className="event-details-section">
                {updateEventStatus ? <button className='back-btn' onClick={() => {
                    const eventExist = eventsList.find(event => event.event_id === event_id);
                    setEventData({ name: eventExist?.name, description: eventExist?.description, register_deadline: eventExist?.register_deadline.toString(), start_datetime: eventExist?.start_datetime.toString(), end_datetime: eventExist?.end_datetime.toString(), entry_fee: eventExist?.entry_fee?.toString(), location: eventExist?.location, poster: undefined, signup_link: eventExist?.signup_link });
                    setUpdateEventStatus(false);
                }} ><MdKeyboardBackspace color='gray' size='35px' /></button> : <button className='back-btn' onClick={() => navigate('/dashboard/events')} ><MdKeyboardBackspace color='gray' size='35px' /></button>}
                <div className="tool-btn-container">
                    {!updateEventStatus ? <button className="edit-btn" onClick={() => setUpdateEventStatus(true)}>Edit</button> : <button className="save-btn" onClick={() => setSubmitUpdateEventStatus(true)}>Save</button>}
                    <button className="delete-btn" onClick={() => setDeleteEventStatus(true)}>Delete</button>
                </div>
                {event ? (
                    <>
                        <div className="event-details-card-container">
                            {!updateEventStatus ? (
                                <div className="poster-container">
                                    {poster ? <img src={displayPhoto(poster)} alt={`${name} Poster`} className='poster' />  : <img src={`data:${event?.poster_type};base64, ${event?.poster_data}`} alt={`${name} Poster`} className='poster' />}
                                </div>
                            ) : (
                                <div className="poster-container edit-mode">
                                    {poster ? <img src={displayPhoto(poster)} alt={`${name} Poster`} className='poster' />  : <img src={`data:${event?.poster_type};base64, ${event?.poster_data}`} alt={`${name} Poster`} className='poster' />}
                                    <label htmlFor="poster">+</label>
                                    <input type="file" name="poster" id="poster" accept='image/*' onChange={handleFileSelect} autoComplete='off'/>
                                </div>
                            )}
                            <div className="details-container">
                                {!updateEventStatus ? (
                                    <>
                                        <h1 className='name'>{name}</h1>
                                        <div className='description' dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(description!) }}></div>
                                        <div className="metadata-container">
                                            <p className='entry-fee'>Entry Fee: {entry_fee && entry_fee !== '0' ? `$${entry_fee}` :  'Free'}</p>
                                            <p className='register-deadline'>{`Sign Up Deadline: ${formatDate(register_deadline!)}`}</p>
                                            <p className='start-and-end-datetime'>{`Date: ${formatEventTimePeriod(start_datetime!, end_datetime!)}`}</p>
                                            <p className='location'>{`Location: ${location}`}</p>
                                            <p className='signup_link'>Sign Up Link: {signup_link && signup_link !== '' ? <a href={signup_link} target='_blank'>{signup_link}</a> : 'None'} </p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <input type='text' name='name' id='name' className='name-input' value={name} onChange={onChange} autoComplete='off' required/>
                                        <Editor defaultEditorState={editorState} onEditorStateChange={handleEditorStateChange} wrapperClassName='description-wrapper' editorClassName='description-editor' toolbarClassName='description-toolbar' />
                                        <div className="metadata-container">
                                            <p className='entry-fee'>Entry Fee: <input type='number' name='entry_fee' id='entry_fee' className='entry-fee-input' value={entry_fee} onChange={onChange} placeholder='15' autoComplete='off'/></p>
                                            <p className='register-deadline'>Sign Up Deadline: <input type='datetime-local' name='register_deadline' id='register_deadline' className='register-deadline-input' defaultValue={register_deadline?.slice(0, register_deadline.length - 2)} onChange={onChange} autoComplete='off' required/></p>
                                            <p className='start-datetime'>Start Datetime: <input type='datetime-local' name='start_datetime' id='start_datetime' className='start-datetime-input' defaultValue={start_datetime?.slice(0, start_datetime.length - 2)} onChange={onChange} autoComplete='off' required/></p>
                                            <p className='end-datetime'>End Datetime: <input type='datetime-local' name='end_datetime' id='end_datetime' className='end-datetime-input' defaultValue={end_datetime?.slice(0, end_datetime.length - 2)} onChange={onChange} autoComplete='off' required/></p>
                                            <p className='location'>Location: <input type='text' name='location' id='location' className='location-input' value={location} onChange={onChange} placeholder='The Bridge' autoComplete='off' required/></p>
                                            <p className='signup_link'>Sign Up Link: <input type='url' name='signup_link' id='signup_link' className='signup-link-input' value={signup_link} onChange={onChange} placeholder='https://utsc-fts/fintech-case-competition/application-form' autoComplete='off'/></p>
                                        </div>
                                    </>
                                )}
                            
                            </div>
                        </div>
                    </>
                ) : <Loading border='7px' size='50px' color='#040C43' />}
                {submitUpdateEventStatus ? (
                    <Modal confirm_btn_text='Update' confirm_btn_color='#0275d8' toggleOpenAndClose={setSubmitUpdateEventStatus} id={event_id} confirm_function={updateEventFunction} >
                        <p className='description'>Are you sure to update this event?</p>
                    </Modal>
                ) : null}
                {deleteEventStatus ? (
                        <Modal confirm_btn_text='Delete' confirm_btn_color='red' toggleOpenAndClose={setDeleteEventStatus} id={event_id} confirm_function={deleteEventFunction} >
                            <p className='description'>Are you sure to delete this event?</p>
                        </Modal>
                    ) : null}
            </section>
        </div>
    )
};

export default EventDetailsSection;