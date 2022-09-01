import React, { useState, useRef } from 'react';
import HeaderBar from './HeaderBar';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import Loading from './Loading';
import { toast } from 'react-toastify';
import { updateMe } from '../features/admin/adminSlice';

const EditProfileSection = ({ setOpenMenuState }: { setOpenMenuState: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const admin = useSelector((state: RootState) => state.admin);

    const dispatch = useDispatch<AppDispatch>();

    const [editProfileFormData, setEditProfileFormData] = useState<{ username: string, password: string, profile_pic?: File }>({ username: admin.me.username!, password: '', profile_pic: undefined });
    const { username, password, profile_pic } = editProfileFormData;

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditProfileFormData(previousData => ({ ...previousData, [e.target.name]: e.target.value }));
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditProfileFormData(previousDate => ({ ...previousDate, profile_pic: e.target.files![0] }));
    };

    const displayPhoto = (image: File) => {
        return URL.createObjectURL(image);
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (username === '') {
            toast.error('Please fill in all required fields', { autoClose: 3000 });
            return;
        }

        if (password !== '' && password.length < 6) {
            toast.error('Your new password should have at least 6 characters', { autoClose: 3000 });
            return;
        }

        const formData = new FormData();
        formData.append('username', username);
        if (password !== '') formData.append('password', password);
        if (profile_pic) formData.append('profile_pic', profile_pic);

        dispatch(updateMe({ admin_id: admin.me.admin_id, updatedInfo: formData }));
        setEditProfileFormData({ username, password: '', profile_pic });
    }

    return (
        <div className="edit-profile-section-container">
            <HeaderBar setOpenMenuState={setOpenMenuState} />
            <section className="edit-profile-section">
                <div className="edit-profile-form-container">
                    <h1 className='title'>Edit Profile</h1>
                    <form onSubmit={onSubmit}>
                        {admin.isLoading ? <Loading border='7px' size='50px' color='#040C43' /> : (
                            <>
                                <div className="input-container profile-pic">
                                    <div className="profile-pic-container">
                                        {profile_pic ? <img src={displayPhoto(profile_pic)} alt={`${admin.me.name} Profile Pic`} className='profile-pic' />  : admin.me.profile_pic_data ? <img src={`data:${admin.me.profile_pic_type};base64, ${admin.me.profile_pic_data}`} alt={`${admin.me.name} Profile Pic`} className='profile-pic' /> : <p className='add-profile-pic-sign'>+</p>}
                                    </div>
                                    <div className="choose-image-btn-container">
                                        <label htmlFor="profile_pic">Choose an image</label>
                                        <input type="file" name="profile_pic" id="profile_pic" accept="image/*" onChange={handleFileSelect} />
                                    </div>
                                </div>
                                <div className="account-information-container">
                                    <h3 className='description'>Account Information</h3>
                                    <div className="input-container name">
                                        <label htmlFor="name">Name</label>
                                        <input type="text" name="name" id="name" value={admin.me.name} autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false" required readOnly/>
                                    </div>
                                    <div className="input-container position">
                                        <label htmlFor="position">Position</label>
                                        <input type="text" name="position" id="position" value={admin.me.position} autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false" required readOnly/>
                                    </div>
                                    <div className="input-container username">
                                        <label htmlFor="username">Username</label>
                                        <input type="text" name="username" id="username" defaultValue={username} onBlur={onChange} placeholder='Enter your username...' autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false" required/>
                                    </div>
                                    <div className="input-container password">
                                        <label htmlFor="username">Password</label>
                                        <input type="password" name="password" id="password" defaultValue={password} onBlur={onChange} placeholder='Enter your new password...' autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false"/>
                                    </div>
                                </div>
                                <button type="submit" className='save-btn'>{admin.isUpdating ? <Loading border='2px' color='white' size='18px' /> : 'Save'}</button>
                            </>
                        )}
                    </form>
                </div>
            </section>
        </div>
    )
};

export default EditProfileSection;