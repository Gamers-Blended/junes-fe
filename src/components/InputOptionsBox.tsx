import React, { useState, useRef, useEffect } from 'react';

interface InputOptionsBoxProps {
    availableOptions: string[] | { [key: string]: string[] };
    placeholder?: string;
    isHierachical?: boolean;
}

const InputOptionsBox: React.FC<InputOptionsBoxProps> = ({
    availableOptions,
    placeholder = "Select options...",
    isHierachical = false
}) => {
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
    const [isActive, setIsActive] = useState<boolean>(false);
    const [currentLevel, setCurrentLevel] = useState<string | null>(null);
    const inputRef = useRef<HTMLDivElement>(null);
    const popupRef = useRef<HTMLDivElement>(null);

    // Handle clicks outside component to close popup
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (inputRef.current && popupRef.current && 
                !inputRef.current.contains(event.target as Node) &&
                !popupRef.current.contains(event.target as Node)) {
                    setIsPopupOpen(false);
                    setIsActive(false);
                    setCurrentLevel(null);
            }
        };

        if (isPopupOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        // Cleanup function
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isPopupOpen]);

    const handleInputClick = (): void => {
        setIsPopupOpen(true);
        setIsActive(true);
        setCurrentLevel(null); // Reset to top level when opening
    };

    const handleOptionClick = (option: string): void => {
        // Case I: 2nd level options
        if (isHierachical && Array.isArray(availableOptions) === false) {
            // Available options structure: option group: list of options under group
            // e.g. 2025: ['Jan', 'Feb']

            // 1st level selection (e.g. year)
            if (!currentLevel) {
                setCurrentLevel(option);
                return;

            // 2nd level selection (e.g. month)
            } else {
                const fullOption = `${currentLevel} ${option}`;
                // Add current option to selected options
                if (!selectedOptions.includes(fullOption)) {
                    setSelectedOptions([...selectedOptions, fullOption]);
                }
                setIsPopupOpen(false);
                setIsActive(false);
                setCurrentLevel(null);
                return;
            }
        }

        // Case II: Non-hierarchical selection
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

    const handleBackToFirstLevel = (): void => {
        setCurrentLevel(null);
    };

    const getOptionsToDisplay = (): string[] => {
        // Case I: 2nd level options
        if (isHierachical && Array.isArray(availableOptions) === false) {
            const hierarchicalOptions = availableOptions as { [key: string]: string[] };

            if (!currentLevel) {
                // Show 1st level options (e.g. years)
                return Object.keys(hierarchicalOptions);
            } else {
                // Show 2nd level options (e.g. months for selected year)
                return hierarchicalOptions[currentLevel] || [];
            }
        }

        // Case II: Non-hierarchical selection
        return availableOptions as string[];
    };

    const getPopupHeaderText = (): string => {
        // Case I
        if (isHierachical && currentLevel) {
            return `Currently selected: ${currentLevel}`;
        }

        // Case II
        return "Select Options";
    };

    // Option should be disabled if already selected
    const isOptionDisabled = (option: string): boolean => {
        // Case I
        if (isHierachical && currentLevel) {
            const fullOption = `${currentLevel} ${option}`;
            return selectedOptions.includes(fullOption);
        }

        // Case II
        return selectedOptions.includes(option);
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
                        <span className='placeholder'>{placeholder}</span>
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
                            <h3 
                                className='popup-header-text'
                                onClick={isHierachical && currentLevel ? handleBackToFirstLevel : undefined}
                                style={{
                                    cursor: isHierachical && currentLevel ? 'pointer' : 'default',
                                    textDecoration: isHierachical && currentLevel ? 'underline' : 'none'
                                }}
                            >
                                {getPopupHeaderText()}
                                {isHierachical && currentLevel && (
                                    <span style={{ fontSize: '0.8em', marginLeft: '8px' }}>
                                        (click to go back)
                                    </span>
                                )}
                            </h3>
                        </div>

                        <div className='popup-options-container'>
                            {getOptionsToDisplay().map((option: string, index: number) => (
                                <button 
                                    key={index} 
                                    onClick={() => handleOptionClick(option)} 
                                    className={`option-badge ${isOptionDisabled(option) ? 'option-badge-disabled' : ''}`}
                                    disabled={isOptionDisabled(option)}>
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InputOptionsBox;