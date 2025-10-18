import React from "react";
import { getData } from "country-list";

interface CountrySelectorProps {
  value?: string;
  onChange?: (countryCode: string, countryName: string) => void;
  className?: string;
  error?: boolean;
}

const CountrySelector: React.FC<CountrySelectorProps> = ({
  value = "",
  onChange,
  className = "",
  error = false,
}) => {
  const countries = getData(); // array of { code: 'SG', name: 'Singapore' }

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCode = e.target.value;
    const selectedCountry = countries.find(
      (country) => country.code === selectedCode
    );

    if (onChange && selectedCountry) {
      onChange(selectedCountry.code, selectedCountry.name);
    }
  };

  return (
    <select
      value={value}
      onChange={handleChange}
      className={`input-field ${className} ${error ? "error" : ""}`}
    >
      <option value=""></option>
      {countries.map((country) => (
        <option key={country.code} value={country.code}>
          {country.name}
        </option>
      ))}
    </select>
  );
};

export default CountrySelector;
