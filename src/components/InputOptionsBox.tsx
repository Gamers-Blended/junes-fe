import React, { useState, useRef, useEffect } from 'react';

const InputOptionsBox: React.FC = () => {
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
    const [isActive, setIsActive] = useState<boolean>(false);
    const inputRef = useRef<HTMLDivElement>(null);
    const popupRef = useRef<HTMLDivElement>(null);

    const availableOptions: string[] = ['Asia', 'United States', 'Europe', 'Japan'];

    const handleInputClick = (): void => {
        setIsPopupOpen(true);
        setIsActive(true);
    };

    const handleOptionClick = (option: string): void => {
        if (!selectedOptions.includes(option)) {
            setSelectedOptions([...selectedOptions, option]);
        }
        setIsPopupOpen(false);
        setIsActive(false);
    };

    const handleClearAll = (): void => {
        setSelectedOptions([]);
    };

    return (
        <div className='input-options-box-container'>

            <div className='input-container'>
                <div ref={inputRef} onClick={handleInputClick} className={`input-box common-input-box ${isActive ? 'active' : ''}`}>
                    {selectedOptions.map((option: string, index: number) => (
                        <span key={index}>{option} x</span>
                    ))}

                    {selectedOptions.length === 0 && (
                        <span className='placeholder'>Select options...</span>
                    )}

                    {selectedOptions.length > 0 && (
                        <button onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            handleClearAll();
                        }} className='clear-all'>Clear All</button>
                    )}

                </div>

                {isPopupOpen && (
                    <div ref={popupRef} className='popup-container'>
                        <div>
                            <h3>Select Options</h3>
                        </div>

                        <div>
                            {availableOptions.map((option: string, index: number) => (
                                <button key={index} onClick={() => handleOptionClick(option)} className='option-badge'>{option}</button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default InputOptionsBox;