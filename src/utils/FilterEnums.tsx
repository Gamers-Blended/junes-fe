export interface FilterOption {
    display: string;
    value: string;
}

// Release date: year: month[]
export interface HierarchicalFilterOption {
    display: string;
    value: string;
    children?: FilterOption[];
}

// Utility function to format display values into API values
// e.g. "First Person Shooter" becomes "first_person_shooter"
const formatFilterValue = (string: string): string => {
    return string.toLowerCase().replace(/\s+/g, '_');
};

// Helper function to create filter options programmatically
const createFilterOption = (display: string, customValue?: string): FilterOption => ({
    display,
    value: customValue || formatFilterValue(display)
});

// =============================================================================
// FILTER DISPLAYS
// =============================================================================

const GENRE_DISPLAYS = [
    'JRPG',
    'RPG',
    'FPS',
    'TPS',
    'Racing',
    'Action',
    'Adventure',
    'Survival Horror',
    'Visual Novel'
];

const REGION_DISPLAYS = [
    'United States',
    'Europe',
    'Japan',
    'Japan',
    'Asia'
];

const PUBLISHER_DISPLAYS = [
    'Square Enix',
    'Koei Tecmo',
    'Bandai Namco',
    'Capcom',
    'Nintendo',
    'Arc System Works'
];

const EDITION_DISPLAYS = [
    'Standard',
    'Collector\'s Edition',
    'Limited',
    'Deluxe'
];

const LANGUAGE_DISPLAYS = [
    'English',
    'Japanese',
    'French',
    'German',
    'Spanish',
    'Italian',
    'Chinese',
    'Cantonese',
    'Korean',
    'Russian',
    'Portuguese',
    'Thai'
];

const STARTING_LETTER_DISPLAYS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

// =============================================================================
// FILTER OPTIONS
// =============================================================================

export const GENRE_OPTIONS: FilterOption[] = GENRE_DISPLAYS.map(display => 
    createFilterOption(display)
);

export const REGION_OPTIONS: FilterOption[] = REGION_DISPLAYS.map(display => 
    createFilterOption(display, 
        // Custom mappings for regions
        display === 'United States' ? 'us' :
        display === 'Europe' ? 'eur' :
        display === 'Japan' ? 'jp' : undefined
    )
);

export const PUBLISHER_OPTIONS: FilterOption[] = PUBLISHER_DISPLAYS.map(display => 
    createFilterOption(display)
);

export const EDITION_OPTIONS: FilterOption[] = EDITION_DISPLAYS.map(display => 
    createFilterOption(display,
        // Custom mappings for editions
        display === 'Standard' ? 'std' :
        display === 'Collector\'s Edition' ? 'collectors' : undefined
    )
);

export const LANGUAGE_OPTIONS: FilterOption[] = LANGUAGE_DISPLAYS.map(display => 
    createFilterOption(display)
);

export const STARTING_LETTER_OPTIONS: FilterOption[] = STARTING_LETTER_DISPLAYS.map(display => 
    createFilterOption(display)
);

// Month mapping for release dates - exported for use in utility functions
export const MONTH_OPTIONS: FilterOption[] = [
    { display: 'Jan', value: '01' },
    { display: 'Feb', value: '02' },
    { display: 'Mar', value: '03' },
    { display: 'Apr', value: '04' },
    { display: 'May', value: '05' },
    { display: 'Jun', value: '06' },
    { display: 'Jul', value: '07' },
    { display: 'Aug', value: '08' },
    { display: 'Sep', value: '09' },
    { display: 'Oct', value: '10' },
    { display: 'Nov', value: '11' },
    { display: 'Dec', value: '12' }
];

// Helper function to generate years array
const generateYears = (startYear: number, endYear: number): number[] => {
    const years = [];
    for (let year = startYear; year <= endYear; year++) {
        years.push(year);
    }
    return years;
};

// Helper function to create hierarchical release date options
const createReleaseDateOptions = (years: number[]): HierarchicalFilterOption[] => {
    return years.map(year => ({
        display: year.toString(),
        value: year.toString(),
        children: MONTH_OPTIONS.map(month => ({
            display: `${year} ${month.display}`,
            value: `${year}-${month.value}`
        }))
    }));
};

// Release date filter options (hierarchical)
export const RELEASE_DATE_OPTIONS: HierarchicalFilterOption[] = createReleaseDateOptions(
    generateYears(2000, 2025)
);

export class FilterUtils {

    /**
     * Create filter options from display strings using the formatFilterValue utility
     */
    static createFilterOptions(displays: string[], customMappings?: Record<string, string>): FilterOption[] {
        return displays.map(display => ({
            display,
            value: customMappings?.[display] || formatFilterValue(display)
        }));
    }

    /**
     * Get display values from filter options
     */
    static getDisplayValues(options: FilterOption[]): string[] {
        return options.map(option => option.display);
    }

    /**
     * Get hierarchical display values for InputOptionsBox
     * Returns an object with parent keys and child arrays
     */
    static getHierarchicalDisplayValues(options: HierarchicalFilterOption[]): Record<string, string[]> {
        const result: Record<string, string[]> = {};
        options.forEach(parent => {
            if (parent.children) {
                // Use only the month part for the children, not the full "year month" display
                result[parent.display] = parent.children.map(child => {
                    // Extract just the month part from "2025 Aug" -> "Aug"
                    const monthPart = child.display.split(' ')[1];
                    return monthPart;
                });
            }
        });
        return result;
    }

    /**
     * Convert display values to API values
     */
    static convertDisplayToApiValues(displayValues: string[], filterOptions: FilterOption[]): string[] {
        return displayValues
            .map(displayValue => {
                const option = filterOptions.find(filterOption => filterOption.display === displayValue);
                return option?.value;
            })
            .filter((value): value is string => value !== undefined);
    }
    
    /**
     * Convert hierarchical display values to API values
     */
    static convertHierarchicalDisplayToValues(displayValues: string[], hierarchicalOptions: HierarchicalFilterOption[]): string[] {
        // Create a flat map of all display -> value mappings from children
        const displayToValueMap: Record<string, string> = {};
        
        hierarchicalOptions.forEach(parent => {
            if (parent.children) {
                parent.children.forEach(child => {
                    displayToValueMap[child.display] = child.value;
                });
            }
        });

        return displayValues
            .map(displayValue => displayToValueMap[displayValue])
            .filter((value): value is string => value !== undefined);
    }

    /**
     * Get filter option by display value
     */
    static getOptionByDisplay(displayValue: string, filterOptions: FilterOption[]): FilterOption | undefined {
        return filterOptions.find(filterOption => filterOption.display === displayValue);
    }

    /**
     * Get filter option by value
     */
    static getOptionByValue(value: string, filterOptions: FilterOption[]): FilterOption | undefined {
        return filterOptions.find(filterOption => filterOption.value === value);
    }
}

export const genreOptions = {
    display: FilterUtils.getDisplayValues(GENRE_OPTIONS),
    options: GENRE_OPTIONS,
    convertToValues: (displayValues: string[]) => 
        FilterUtils.convertDisplayToApiValues(displayValues, GENRE_OPTIONS)
}

export const regionOptions = {
    display: FilterUtils.getDisplayValues(REGION_OPTIONS),
    options: REGION_OPTIONS,
    convertToValues: (displayValues: string[]) => 
        FilterUtils.convertDisplayToApiValues(displayValues, REGION_OPTIONS)
};

export const publisherOptions = {
    display: FilterUtils.getDisplayValues(PUBLISHER_OPTIONS),
    options: PUBLISHER_OPTIONS,
    convertToValues: (displayValues: string[]) => 
        FilterUtils.convertDisplayToApiValues(displayValues, PUBLISHER_OPTIONS)
};

export const editionOptions = {
    display: FilterUtils.getDisplayValues(EDITION_OPTIONS),
    options: EDITION_OPTIONS,
    convertToValues: (displayValues: string[]) => 
        FilterUtils.convertDisplayToApiValues(displayValues, EDITION_OPTIONS)
};

export const languageOptions = {
    display: FilterUtils.getDisplayValues(LANGUAGE_OPTIONS),
    options: LANGUAGE_OPTIONS,
    convertToValues: (displayValues: string[]) => 
        FilterUtils.convertDisplayToApiValues(displayValues, LANGUAGE_OPTIONS)
};

export const startingLetterOptions = {
    display: FilterUtils.getDisplayValues(STARTING_LETTER_OPTIONS),
    options: STARTING_LETTER_OPTIONS,
    convertToValues: (displayValues: string[]) => 
        FilterUtils.convertDisplayToApiValues(displayValues, STARTING_LETTER_OPTIONS)
};

export const releaseDateOptions = {
    display: FilterUtils.getHierarchicalDisplayValues(RELEASE_DATE_OPTIONS),
    options: RELEASE_DATE_OPTIONS,
    convertToValues: (displayValues: string[]) => 
        FilterUtils.convertHierarchicalDisplayToValues(displayValues, RELEASE_DATE_OPTIONS)
};