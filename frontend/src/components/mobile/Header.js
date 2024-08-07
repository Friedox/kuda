import React from 'react';
import back from '../../assets/icon/back.svg';
import forward from '../../assets/icon/forward.svg';
function Header({header_text, href}) {

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Check out this trip!',
                text: 'Here are the details for the trip.',
                url: href,
            }).then(() => {
                console.log('Successfully shared');
            }).catch((error) => {
                console.error('Error sharing', error);
            });
        } else {
            console.log('Web Share API is not supported in your browser.');
        }
    }

    return (
        <>
            <div className="header_panel">
                <a href='fellow_travel_cards' className="back_btn">
                    <img src={back}/>
                </a>
                <h1>{header_text}</h1>
                <button onClick={handleShare} className="forward_btn">
                    <img src={forward}/>
                </button>
            </div>
        </>
    );
}

export default Header;
