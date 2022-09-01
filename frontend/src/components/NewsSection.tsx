import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createNews, deleteNews } from "../features/news/newsSlice";
import { RootState, AppDispatch } from '../store';
import HeaderBar from './HeaderBar';
import ModalForm from './ModalForm';
import Loading from './Loading';
import { toast } from 'react-toastify';
import NewsCard from './NewsCard';
import Modal from './Modal';
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from 'draftjs-to-html';

const NewsSection = ({ setOpenMenuState }: { setOpenMenuState: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const { newsList, isLoading } = useSelector((state: RootState) => state.news);

    const dispatch = useDispatch<AppDispatch>();

    const [addNewsStatus, setAddNewsStatus] = useState<boolean>(false);
    const [addNewsFormData, setAddNewsFormData] = useState<{ title: string, content: string, picture?: File, author: string }>({ title: '', content: '', picture: undefined, author: ''});
    const { title, content, picture, author } = addNewsFormData;

    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

    const [deleteNewsStatus, setDeleteNewsStatus] = useState<boolean>(false);
    const [deleteNewsId, setDeleteNewsId] = useState<number>();

    const clearAddNewsFormData = () => {
        setAddNewsFormData({ title: '', content: '', picture: undefined, author: ''});
    };

    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setAddNewsFormData(previousData => ({ ...previousData, [e.target.name]: e.target.value  }));
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAddNewsFormData(previousDate => ({ ...previousDate, picture: e.target.files![0] }));
    };

    const handleEditorStateChange = (state: EditorState) => {
        setEditorState(state);
        setAddNewsFormData(previousData => ({ ...previousData, content: draftToHtml(convertToRaw(state.getCurrentContent())) }));
    }

    const onSubmit = () => {

        if (title === '' || content === '' || !picture || author === '') {
            toast.error('Please fill in all the required fields', { autoClose: 3000 });
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('picture', picture);
        formData.append('author', author);

        dispatch(createNews(formData));
        clearAddNewsFormData();
        setAddNewsStatus(false);
    };

    const deleteNewsFunction = (eventId: number | undefined) => {
        dispatch(deleteNews(eventId));
    }

    return (
        <div className='news-section-container'>
            <HeaderBar setOpenMenuState={setOpenMenuState} />
            <section className='news-section'>
                <div className="news-text-container">
                    <h1>News</h1>
                </div>
                <button className='add-news-btn' onClick={() => setAddNewsStatus(true)}>Add news</button>
                {addNewsStatus ? (
                    <ModalForm description='Add News' toggleOpenAndClose={() => {
                        clearAddNewsFormData();
                        setEditorState(() => EditorState.createEmpty());
                        setAddNewsStatus(false);
                    }} onSubmit={onSubmit} >
                        <div className="input-container">
                            <label htmlFor="title">Title <span>*</span></label>
                            <input type="text" name="title" id="title" placeholder='Why Are Crypto Investors Rotating From Bitcoin To Altcoins?' defaultValue={title} onBlur={onChange} autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false" required/>
                        </div>
                        <div className="input-container">
                            <label htmlFor="content">Content <span>*</span></label>
                            <Editor defaultEditorState={editorState} onEditorStateChange={handleEditorStateChange} wrapperClassName='description-wrapper' editorClassName='description-editor' toolbarClassName='description-toolbar' />
                        </div>
                        <div className="input-container">
                            <label htmlFor="picture">Picture <span>*</span></label>
                            <input type='file' name="picture" id="picture" accept='image/*' onChange={handleFileSelect} autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false" required/>
                        </div>
                        <div className="input-container">
                            <label htmlFor="author">Author <span>*</span></label>
                            <input type="text" name="author" id="author" defaultValue={author} onBlur={onChange}  placeholder='John Smith' autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false" required/>
                        </div>
                    </ModalForm>
                ) : null}
                {isLoading ? <Loading border='7px' size='50px' color='#040C43' /> : (
                    <div className="news-list-container">
                        {newsList.length > 0 ? newsList.map(news => <NewsCard key={news.news_id} openDeleteModal={setDeleteNewsStatus} setDeleteNewsId={setDeleteNewsId} {...news} />) : <h3 className='no-news-text'>There are no any news yet...</h3>}
                    </div>
                )}
                {deleteNewsStatus ? (
                    <Modal confirm_btn_text='Delete' confirm_btn_color='red' toggleOpenAndClose={setDeleteNewsStatus} id={deleteNewsId} confirm_function={deleteNewsFunction} >
                        <p className='description'>Are you sure to delete this news?</p>
                    </Modal>
                ) : null}
            </section>
        </div>
    )
};

export default NewsSection;