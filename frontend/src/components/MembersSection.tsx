import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addNewMember, deleteMember, updateEditMode, updateSubmitUpdatedInfoMode } from '../features/members/membersSlice';
import { RootState, AppDispatch } from '../store';
import HeaderBar from './HeaderBar';
import MemberCard from './MemberCard';
import Loading from './Loading';
import ModalForm from './ModalForm';
import { toast } from 'react-toastify';
import Modal from './Modal';

const MembersSection = () => {
    const { membersList, isLoading } = useSelector((state: RootState) => state.members);

    const dispatch = useDispatch<AppDispatch>();

    const [addNewMemberStatus, setAddNewMemberStatus] = useState<boolean>(false);
    const [addNewMemberFormData, setAddNewMemberFormData] = useState({ first_name: '', last_name: '', student_number: '' , email_address: '', year_of_study: '1st', program: '', campus: 'UTSC' });
    const { first_name, last_name, student_number, email_address, year_of_study, program, campus } = addNewMemberFormData;

    const [updateMemberStatus, setUpdateMemberStatus] = useState<boolean>(false);
    const [updateMemberId, setUpdateMemberId] = useState<number>();

    const [deleteMemberStatus, setDeleteMemberStatus] = useState<boolean>(false);
    const [deleteMemberId, setDeleteMemberId] = useState<number>();

    const clearAddNewMemberFormData = () => {
        setAddNewMemberFormData({ first_name: '', last_name: '', student_number: '' , email_address: '', year_of_study: '1st', program: '', campus: 'UTSC' });
    };

    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setAddNewMemberFormData(previousData => ({ ...previousData, [e.target.name]: e.target.value  }));
    };

    const onSubmit = () => {

        if (first_name === '' || last_name === '' || student_number === '' || email_address === '' || year_of_study === '' || program === '' || campus === '') {
            toast.error('Please fill in all the required fields', { autoClose: 3000 });
            return;
        }

        if (!(/^\w+([.-]?\w+)*@mail.utoronto.ca/.test(email_address))) {
            toast.error('Please provide a valid UofT email address', { autoClose: 3000 });
            return;
        }

        dispatch(addNewMember({ ...addNewMemberFormData, student_number: Number(student_number) }));
        clearAddNewMemberFormData();
        setAddNewMemberStatus(false);
    }

    const cancelUpdateMemberFunction = (memberId: number | undefined) => {
        dispatch(updateEditMode({ member_id: memberId, status: false }));
    }

    const updateMemberFunction = (memberId: number | undefined) => {
        dispatch(updateSubmitUpdatedInfoMode({ member_id: memberId, status: true }));
    }

    const deleteMemberFunction = (memberId: number | undefined) => {
        dispatch(deleteMember(memberId));
    }

    return (
        <div className='members-section-container'>
            <HeaderBar />
            <section className='members-section'>
                <div className="members-text-container">
                    <h1>Members</h1>
                </div>
                <button className='add-new-member-btn' onClick={() => setAddNewMemberStatus(true)} >Add new member</button>
                {addNewMemberStatus ? (
                    <ModalForm description='Add New Member' toggleOpenAndClose={() => {
                        clearAddNewMemberFormData();
                        setAddNewMemberStatus(false);
                    }} onSubmit={onSubmit} >
                        <div className="input-container">
                            <label htmlFor="first_name">First Name <span>*</span></label>
                            <input type="text" name="first_name" id="first_name" placeholder='John' defaultValue={first_name} onBlur={onChange} autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false" required/>
                        </div>
                        <div className="input-container">
                            <label htmlFor="last_name">Last Name <span>*</span></label>
                            <input type="text" name="last_name" id="last_name" placeholder='Smith' defaultValue={last_name} onBlur={onChange} autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false" required/>
                        </div>
                        <div className="input-container">
                            <label htmlFor="student_number">Student Number <span>*</span></label>
                            <input type='number' name="student_number" id="student_number" defaultValue={student_number} onBlur={onChange} placeholder='102832627' autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false" required/>
                        </div>
                        <div className="input-container">
                            <label htmlFor="email_address">Email Address <span>*</span></label>
                            <input type="email" name="email_address" id="email_address" defaultValue={email_address} onBlur={onChange}  placeholder='john.smith@mail.utoronto.ca' autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false" required/>
                        </div>
                        <div className="input-container">
                            <label htmlFor="year_of_study">Year of Study <span>*</span></label>
                            <select name='year_of_study' id='year_of_study' defaultValue={year_of_study} onBlur={onChange} required>
                                <option value="1st">1st</option>
                                <option value="2nd">2nd</option>
                                <option value="3rd">3rd</option>
                                <option value="4th">4th</option>
                                <option value="5th">5th</option>
                            </select>
                        </div>
                        <div className="input-container">
                            <label htmlFor="program">Program <span>*</span></label>
                            <input type="text" name="program" id="program" value={program} onChange={onChange} placeholder='Co-op Computer Science' autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false" required/>
                        </div>
                        <div className="input-container">
                            <label htmlFor="campus">Campus <span>*</span></label>
                            <select name='campus' id='campus' value={campus} onChange={onChange} required>
                                <option value="UTSC">UTSC</option>
                                <option value="UTSG">UTSG</option>
                                <option value="UTM">UTM</option>
                            </select>
                        </div>
                    </ModalForm>
                ) : null}
                {isLoading ? <Loading border='7px' size='50px' color='#040C43' /> : null}
                <div className="members-list-table-container">
                    <table className='members-list-table'>
                        <thead>
                            <tr>
                                <th></th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Student Number</th>
                                <th>Email Address</th>
                                <th>Year of Study</th>
                                <th>Program</th>
                                <th>Campus</th>
                                <th></th>
                            </tr>
                        </thead>
                        {!isLoading && membersList? <tbody>{membersList.map(member => <MemberCard key={member.member_id} openUpdateModal={setUpdateMemberStatus} setUpdateMemberId={setUpdateMemberId} openDeleteModal={setDeleteMemberStatus} setDeleteMemberId={setDeleteMemberId} {...member} />)}</tbody> : null}
                    </table>
                </div>
                {updateMemberStatus? (
                    <Modal confirm_btn_text='Update' confirm_btn_color='#0275d8' toggleOpenAndClose={setUpdateMemberStatus} id={updateMemberId} cancel_function={cancelUpdateMemberFunction} confirm_function={updateMemberFunction} >
                    <p className='description'>Are you sure to update this member?</p>
                </Modal>
                ): null}
                {deleteMemberStatus ? (
                    <Modal confirm_btn_text='Delete' confirm_btn_color='red' toggleOpenAndClose={setDeleteMemberStatus} id={deleteMemberId} confirm_function={deleteMemberFunction} >
                        <p className='description'>Are you sure to delete this member?</p>
                    </Modal>
                ) : null}
            </section>
        </div>
    )
};

export default MembersSection;