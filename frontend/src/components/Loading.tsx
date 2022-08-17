import React from 'react';

type Prop = {
    border: string,
    size: string,
    color: string,
}

const Loading = ({ border, size, color }: Prop) => {
    return (
        <div className="loading-container">
            <div className='loading' style={{ border: `${border} solid ${color}`, borderTop: `${border} solid transparent`, borderBottom: `${border} solid transparent`, width: size, height: size }} ></div>
        </div>
    );
};

export default Loading;