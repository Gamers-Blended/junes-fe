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

    // Clicking on badge will remove it from the box
    const handleBadgeClick = (optionToRemove: string): void => {
        setSelectedOptions(selectedOptions.filter(option => option != optionToRemove));
    };

    const handleClearAll = (): void => {
        setSelectedOptions([]);
    };

    return (
        <div className='input-options-box-container'>

            <div className='input-container'>

                <div
                    ref={inputRef} 
                    onClick={handleInputClick} className={`input-box common-input-box ${isActive ? 'active' : ''}`} 
                    style={{
                        backgroundColor: isActive ? '#C2E0B4' : '#D9D9D9',
                        borderColor: isActive ? '#C2E0B4' : '#D9D9D9'
                    }}
                >

                    {/* Display all selected options */}
                    {selectedOptions.map((option: string, index: number) => (
                        <span 
                            key={index}
                            onClick={(e: React.MouseEvent) => {
                                e.stopPropagation();
                                handleBadgeClick(option);
                            }}
                            className='option-badge'>
                                {option} x
                        </span>
                    ))}

                    {/* Placeholder text */}
                    {selectedOptions.length === 0 && (
                        <span className='placeholder'>Select options...</span>
                    )}

                    {/* Clear All text */}
                    {selectedOptions.length > 0 && (
                        <button onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            handleClearAll();
                        }} className='clear-all'>Clear All</button>
                    )}

                </div>

                {isPopupOpen && (
                    <div ref={popupRef} className='popup-container'>
                        <div className='popup-header-container'>
                            <h3 className='popup-header-text'>Select Options</h3>
                        </div>

                        <div className='popup-options-container'>
                            {availableOptions.map((option: string, index: number) => (
                                <button 
                                    key={index} 
                                    onClick={() => handleOptionClick(option)} 
                                    className={`option-badge ${selectedOptions.includes(option) ? 'option-badge-disabled' : ''}`}
                                    disabled={selectedOptions.includes(option)}>
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default InputOptionsBox;