import React, { ReactNode, useEffect, useState } from 'react';
import { MdClose } from "react-icons/md";

type Prop = {
    description: string,
    children: ReactNode,
    toggleOpenAndClose: () => void,
    onSubmit: () => void;
}

const ModalForm = ({ description, children, toggleOpenAndClose, onSubmit }: Prop) => {
    const [submitFormStatus, setSubmitFormStatus] = useState<boolean>(false);

    useEffect(() => {
        if (submitFormStatus) {
            onSubmit();
            setSubmitFormStatus(false);
        }
    }, [submitFormStatus])

    return (
        <div className="modal-form-container">
            <div className="modal-form">
                <div className="description-container">
                    <h3 className='description'>{ description }</h3>
                    <MdClose size='30px' color='gray' style={{cursor: "pointer"}} onClick={() => toggleOpenAndClose()}/>
                </div>
                <form>
                    {children}
                </form>
                <div className="button-container">
                    <button type="submit" onClick={() => setSubmitFormStatus(true)} >Submit</button>
                </div>
            </div>
        </div>
    )
};

export default ModalForm;