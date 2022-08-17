import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MdEdit, MdCheck, MdDelete } from 'react-icons/md';
import { AppDispatch, RootState } from '../store';
import { updateEditMode, updateSubmitUpdatedInfoMode, updateMember } from '../features/members/membersSlice';
import { toast } from 'react-toastify';

type Prop = {
    member_id: number,
    first_name: string,
    last_name: string,
    student_number: number,
    email_address: string,
    year_of_study: string,
    program: string,
    campus: string,
    timestamp: Date,
    openUpdateModal: React.Dispatch<React.SetStateAction<boolean>>,
    setUpdateMemberId: React.Dispatch<React.SetStateAction<number | undefined>>,
    openDeleteModal: React.Dispatch<React.SetStateAction<boolean>>,
    setDeleteMemberId: React.Dispatch<React.SetStateAction<number | undefined>>
};

const MemberCard = ({ member_id, first_name, last_name, student_number, email_address, year_of_study, program, campus, timestamp, openUpdateModal, setUpdateMemberId, openDeleteModal, setDeleteMemberId }: Prop) => {
    const dispatch = useDispatch<AppDispatch>();

    const member = useSelector((state: RootState) => state.members.membersList.find(member => member.member_id === member_id));
    const [editInfoData, setEditInfoData] = useState({ first_name, last_name, student_number, email_address, year_of_study, program, campus });

    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setEditInfoData(previousData => ({ ...previousData, [e.target.name]: e.target.value  }));
    }

    useEffect(() => {

        const submitUpdatedMemberInfo = () => {

            if (member?.submitUpdatedInfoMode) {
                if (editInfoData.first_name === '' || editInfoData.last_name === '' || editInfoData.student_number.toString() === '' || editInfoData.email_address === '' || editInfoData.year_of_study === '' || editInfoData.program === '' || editInfoData.campus === '') {
                    toast.error('Please fill in all required fields', { autoClose: 3000 });
                    updateSubmitUpdatedInfoMode({ member_id, status: false });
                    return;
                }
    
                dispatch(updateMember({ memberId: member_id, updatedInfo: { first_name: editInfoData.first_name, last_name: editInfoData.last_name, student_number: editInfoData.student_number, email_address: editInfoData.email_address, year_of_study: editInfoData.year_of_study, program: editInfoData.program, campus: editInfoData.campus } }));
                updateSubmitUpdatedInfoMode({ member_id, status: false });
            }
        }

        submitUpdatedMemberInfo();

    }, [member?.submitUpdatedInfoMode])

    return (
        <tr className='member-card-container'>
            {!member!.editMode ? (
                <>
                    <td><MdEdit color='black' size='15px' onClick={() => dispatch(updateEditMode({ member_id, status: true }))} /></td>
                    <td>{first_name}</td>
                    <td>{last_name}</td>
                    <td>{student_number}</td>
                    <td>{email_address}</td>
                    <td>{year_of_study}</td>
                    <td>{program}</td>
                    <td>{campus}</td>
                    <td><MdDelete color='red' size='20px' onClick={() => {
                        openDeleteModal(true);
                        setDeleteMemberId(member_id);
                    }} /></td>
                </>
            ) : (
                <>
                    <td><MdCheck color='#0275d8' size='20px' onClick={() => {
                        setUpdateMemberId(member_id);
                        openUpdateModal(true);
                    }} /></td>
                    <td><input type="text" name="first_name" id="first_name" value={editInfoData.first_name} onChange={onChange} autoComplete='off' required/></td>
                    <td><input type="text" name="last_name" id="last_name" value={editInfoData.last_name} onChange={onChange} autoComplete='off' required/></td>
                    <td><input type="number" name="student_number" id="student_number" value={editInfoData.student_number} onChange={onChange} autoComplete='off' required/></td>
                    <td><input type="email" name="email_address" id="email_address" value={editInfoData.email_address} onChange={onChange} autoComplete='off' required/></td>
                    <td>
                        <select name='year_of_study' id='year_of_study' value={editInfoData.year_of_study} onChange={onChange} autoComplete='off' required>
                            <option value="1st">1st</option>
                            <option value="2nd">2nd</option>
                            <option value="3rd">3rd</option>
                            <option value="4th">4th</option>
                            <option value="5th">5th</option>
                        </select>
                    </td>
                    <td><input type="text" name="program" id="program" value={editInfoData.program} onChange={onChange} autoComplete='off' required/></td>
                    <td>
                        <select name='campus' id='campus' value={editInfoData.campus} onChange={onChange} autoComplete='off' required>
                            <option value="UTSC">UTSC</option>
                            <option value="UTSG">UTSG</option>
                            <option value="UTM">UTM</option>
                        </select>
                    </td>
                    <td><MdDelete color='red' size='20px' onClick={() => {
                        openDeleteModal(true);
                        setDeleteMemberId(member_id);
                    }} /></td>
                </>
            )}
        </tr>
    )
};

export default MemberCard;