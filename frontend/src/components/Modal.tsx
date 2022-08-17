import React, { ReactNode } from 'react';

type Prop = {
    confirm_btn_text: string,
    confirm_btn_color: string,
    toggleOpenAndClose: React.Dispatch<React.SetStateAction<boolean>>,
    id: number | undefined,
    cancel_function?: (memberId: number | undefined) => void,
    confirm_function: (id: number | undefined) => void,
    children: ReactNode
}

const Modal = ({ confirm_btn_text, confirm_btn_color, toggleOpenAndClose, id, cancel_function,confirm_function, children }: Prop) => {

    return (
        <div className="modal-container">
            <div className="modal">
                <div className="title-container">
                    <h3 className='title'>Confirmation Box</h3>
                </div>
                <div className="description-container">
                    {children}
                </div>
                <div className="button-container">
                    <div className="button-box">
                        <button className='cancel-btn' onClick={() => {
                            if (cancel_function) cancel_function(id);
                            toggleOpenAndClose(false);
                        }}>Cancel</button>
                        <button type='submit' className='confirm-btn' style={{backgroundColor: `${confirm_btn_color}`}} onClick={() =>{
                            toggleOpenAndClose(false);
                            confirm_function(id);
                        }}>{confirm_btn_text}</button>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Modal;