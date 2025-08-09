export interface FilterOption {
    display: string;
    value: string;
}

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

// Genre filter options
const GENRE_DISPLAYS = [
    'JRPG',
    'RPG',
    'FPS',
    'TPS',
    'Racing',
    'Action',
    'Adventure'
];

export const GENRE_OPTIONS: FilterOption[] = GENRE_DISPLAYS.map(display => 
    createFilterOption(display)
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
     * Get display values from filter options.
     */
    static getDisplayValues(options: FilterOption[]): string[] {
        return options.map(option => option.display);
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
