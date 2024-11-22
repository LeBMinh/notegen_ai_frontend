import React, { useState } from 'react';
import './ThemeSwitch.css'
import SunIcon from '../../../assets/Icon_fill/Light_btn.svg';
import MoonIcon from '../../../assets/Icon_fill/Night_btn.svg';

export default function ThemeSwitch() {
    const [isChecked, setIsChecked] = useState(false);

    // Toggle function
    const handleToggle = () => {
        setIsChecked(!isChecked);
    };

    return (
        <div className="toggle-switch">
            <label className={`switch-label ${isChecked ? 'checked' : ''}`}>
                <input
                    type="checkbox"
                    className="checkbox"
                    checked={isChecked}
                    onChange={handleToggle}
                />
                <span className={`slider ${isChecked ? 'slider-checked' : ''}`}>
                    {/* Conditional rendering of the SVG icons */}
                    <img
                        src={isChecked ? MoonIcon : SunIcon}
                        alt={isChecked ? 'Moon Icon' : 'Sun Icon'}
                        className="icon"
                    />
                </span>
            </label>
        </div>
    )
}
