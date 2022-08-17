import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { updateNews, deleteNews } from '../features/news/newsSlice';
import HeaderBar from './HeaderBar';
import { AppDispatch, RootState } from '../store';
import axios, { AxiosResponse, AxiosError } from "axios";
import convertArrayBufferToBase64String from '../utils/displayImage';
import { toast } from 'react-toastify';
import Modal from './Modal';
import Loading from './Loading';
import { MdKeyboardBackspace } from "react-icons/md";
import { EditorState, ContentState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import DOMPurify from "dompurify";

const NewsDetailsSection = () => {
    const news_id = Number(useParams().news_id);
    const { newsList, isLoading } = useSelector((state: RootState) => state.news);

    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const [news, setNews] = useState<{ news_id: number, title: string, content: string, picture_type: string, picture_data: string, author: string, created_at: Date } | undefined>(undefined);

    const [newsData, setNewsData] = useState<{ title?: string, content?: string, picture?: File, author?: string }>({ title: '', content: '', picture: undefined, author: '' });
    const { title, content, picture, author } = newsData;

    useEffect(() => {

        if (!isLoading) {
            
            if (newsList.length > 0) {
                const newsExist = newsList.find(news => news.news_id === news_id);
    
                if (newsExist) {
                    setNews({ news_id: newsExist!.news_id, title: newsExist!.title, content: newsExist!.content, picture_type: newsExist!.picture_type, picture_data: newsExist!.picture_data, author: newsExist!.author, created_at: newsExist!.created_at });
                    setNewsData({title: newsExist?.title, content: newsExist?.content, picture: undefined, author: newsExist?.author});
                } else {
                    toast.error('News does not exist', { autoClose: 3000 });
                    navigate('/dashboard/news');
                }
            } else {
                axios.get(`${process.env.REACT_APP_SERVER_URL}/api/news/${news_id}`).then((response: AxiosResponse) => {
                    setNews({ news_id: response.data.news.news_id, title: response.data.news.title, content: response.data.news.content, picture_type: response.data.news.picture_type, picture_data: convertArrayBufferToBase64String(response.data.news.picture_data.data)!, author: response.data.news.author, created_at: response.data.news.created_at });
                    setNewsData({ title: response.data.news.title, content: response.data.news.content, picture: undefined, author: response.data.news.author });
                }).catch((error: AxiosError | any) => {
                    toast.error('News does not exist', { autoClose: 3000 });
                    navigate('/dashboard/news');
                });
            }
        }
        
    }, [newsList]);

    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

    useEffect(() => {
        if (content) {
            const blocksFromHtml = htmlToDraft(content!);
            setEditorState(EditorState.createWithContent(ContentState.createFromBlockArray(blocksFromHtml.contentBlocks, blocksFromHtml.entityMap)));
        }
    }, [content]);

    const [updateNewsStatus, setUpdateNewsStatus] = useState<boolean>(false);
    const [submitUpdateNewsStatus, setSubmitUpdateNewsStatus] = useState<boolean>(false);
    const [deleteNewsStatus, setDeleteNewsStatus] = useState<boolean>(false);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewsData(previousData => ({ ...previousData, [e.target.name]: e.target.value }));
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewsData(previousDate => ({ ...previousDate, picture: e.target.files![0] }));
    };

    const displayPhoto = (image: File) => {
        return URL.createObjectURL(image);
    };

    const handleEditorStateChange = (state: EditorState) => {
        setEditorState(state);
        setNewsData(previousData => ({ ...previousData, content: draftToHtml(convertToRaw(state.getCurrentContent())) }));
    };

    const formatDate = (date: string) => {
        const created_at = new Date(date);
        const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][created_at.getUTCMonth()];
        const day = created_at.getUTCDate();
        const year = created_at.getFullYear();
        return `${month} ${day}, ${year}`;
    };

    const updateNewsFunction = async (newsId: number | undefined) => {
        if (title === '' || content === '' || author === '') {
            toast.error('Please provide all necessary fields', { autoClose: 3000 });
            return;
        }

        const formData = new FormData();
        formData.append('title', title!);
        formData.append('content', content!);
        if (picture) formData.append('picture', picture);
        formData.append('author', author!);
        dispatch(updateNews({ newsId: newsId, updatedInfo: formData }));
        setUpdateNewsStatus(false);
    };

    const deleteNewsFunction = (newsId: number | undefined) => {
        dispatch(deleteNews(newsId));
        navigate('/dashboard/news');
    };

    return (
        <div className="news-details-section-container">
            <HeaderBar />
            <section className="news-details-section">
                <div className="news-details-card-container">
                    {updateNewsStatus ? <button className='back-btn' onClick={async () => {
                        const newsExist = newsList.find(news => news.news_id === news_id);
                        setNewsData({title: newsExist?.title, content: newsExist?.content, picture: undefined, author: newsExist?.author});
                        setUpdateNewsStatus(false);
                    }} ><MdKeyboardBackspace color='gray' size='35px' /></button> : <button className='back-btn' onClick={() => navigate('/dashboard/news')}><MdKeyboardBackspace color='gray' size='35px' /></button>}
                    <div className="tool-btn-container">
                        {!updateNewsStatus ? <button className="edit-btn" onClick={() => setUpdateNewsStatus(true)}>Edit</button> : <button className="save-btn" onClick={() => setSubmitUpdateNewsStatus(true)}>Save</button>}
                        <button className="delete-btn" onClick={() => setDeleteNewsStatus(true)}>Delete</button>
                    </div>
                    {news? (
                        <>
                            <div className="title-container">
                                {!updateNewsStatus ? <h1 className='title'>{title}</h1> : <input type='text' name='title' id='title' defaultValue={title} onBlur={onChange} placeholder='Title' autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false" required/>}
                            </div>
                            {!updateNewsStatus ? (
                                <div className="picture-container">
                                    {picture ? <img src={displayPhoto(picture)} alt={`News ${news_id} Picture`} className='picture' />  : <img src={`data:${news?.picture_type};base64, ${news?.picture_data}`} alt={`News ${news_id} Picture`} className='picture' />}
                                </div>
                            ) : (
                                <div className="picture-container edit-mode">
                                    {picture ? <img src={displayPhoto(picture)} alt={`News ${news_id} Picture`} className='picture' />  : <img src={`data:${news?.picture_type};base64, ${news?.picture_data}`} alt={`News ${news_id} Picture`} className='picture' />}
                                    <label htmlFor="picture">+</label>
                                    <input type="file" name="picture" id="picture" accept='image/*' onChange={handleFileSelect} autoComplete='off'/>
                                </div>
                            )}
                            <div className="metadata-container">
                                {!updateNewsStatus ?  <p className='metadata'>{`${author} | ${formatDate(news?.created_at.toString())}`}</p> : (
                                    <>
                                        <input type="text" name="author" id="author" defaultValue={author} onBlur={onChange} placeholder='Author' autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false" required/>
                                        <p className='metadata'>{`| ${formatDate(news?.created_at.toString())}`}</p>
                                    </>
                                ) }
                            </div>
                            <div className="content-container">
                                {!updateNewsStatus ? <div className='content' dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content!) }}></div> : <Editor defaultEditorState={editorState} onEditorStateChange={handleEditorStateChange} wrapperClassName='description-wrapper' editorClassName='description-editor' toolbarClassName='description-toolbar' />}
                            </div>
                        </>
                    ) : <Loading border='7px' size='50px' color='#040C43' />}
                </div>
                {submitUpdateNewsStatus ? (
                    <Modal confirm_btn_text='Update' confirm_btn_color='#0275d8' toggleOpenAndClose={setSubmitUpdateNewsStatus} id={news_id} confirm_function={updateNewsFunction} >
                        <p className='description'>Are you sure to update this news?</p>
                    </Modal>
                ) : null}
                {deleteNewsStatus ? (
                    <Modal confirm_btn_text='Delete' confirm_btn_color='red' toggleOpenAndClose={setDeleteNewsStatus} id={news_id} confirm_function={deleteNewsFunction} >
                        <p className='description'>Are you sure to delete this news?</p>
                    </Modal>
                ) : null}
            </section>
        </div>
    )
};

export default NewsDetailsSection;