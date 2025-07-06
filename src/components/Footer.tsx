import React from 'react';

const Footer: React.FC = () => {

    const BackToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <div className="footer-container">
            <div onClick={BackToTop} className="footer-back-to-top">
                Back to Top
            </div>   
        </div>
    )
        

    
}

export default Footer;