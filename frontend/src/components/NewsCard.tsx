import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AiFillEdit } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import DOMPurify from "dompurify";

type Prop = {
    news_id: number, 
    title: string, 
    content: string, 
    picture_type?: string, 
    picture_data?: string, 
    author: string, 
    created_at: Date,
    openDeleteModal: React.Dispatch<React.SetStateAction<boolean>>,
    setDeleteNewsId: React.Dispatch<React.SetStateAction<number | undefined>>,
};

const NewsCard = ({ news_id, title, content, picture_type, picture_data, author, created_at, openDeleteModal, setDeleteNewsId }: Prop) => {

    const navigate = useNavigate();

    const formatDate = (date: Date) => {
        const created_at = new Date(date);
        const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][created_at.getUTCMonth()];
        const day = created_at.getUTCDate();
        const year = created_at.getFullYear();
        return `${month} ${day}, ${year}`;
    }

    return (
        <div className="news-card-container">
            <div className="picture-container">
                <img src={`data:${picture_type};base64, ${picture_data}`} alt={`News ${news_id} Picture`} />
                <div className="edit-btn" onClick={() => navigate(`/dashboard/news/${news_id}`)} ><AiFillEdit color='#ffa700' size='30px' /></div>
                <div className="delete-btn" onClick={() => {
                    openDeleteModal(true);
                    setDeleteNewsId(news_id);
                }} ><MdDelete color='red' size='30px' /></div>
            </div>
            <div className="description-container">
                <h3 className='title'>{title}</h3>
                <div className='content' dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content.replace(/style="((.|\s)*?)"/gim, '')) }} ></div>
                <div className="meta-data-container">
                    <p className='author'>{`By: ${author}`}</p>
                    <p className='created_at'>{`Created at: ${formatDate(created_at)}`}</p>
                </div>
            </div>
        </div>
    );
};

export default NewsCard;