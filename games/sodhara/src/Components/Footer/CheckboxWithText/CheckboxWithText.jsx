import React from "react";
import "./CheckboxWithText.css";

const CheckboxWithText = ({ text }) => {
    return (
        <div className="checkbox-with-text">
            <div className="checkbox-column">
                <input type="checkbox" id="customCheckbox" />
            </div>
            <div className="text-column">
                <label htmlFor="customCheckbox">{text}</label>
            </div>
        </div>
    );
};

export default CheckboxWithText;
