import React, { useState } from "react";
import styles from "../../styles/Home.module.css";

type InlineEditableParamType = { text: string } & { type: string } & { placeholder: string } & { children: React.ReactNode };

const InlineEditable = ({
  text,
  type,
  placeholder,
  children,
  ...props
}: InlineEditableParamType) => {
    const [isEditing, setEditing] = useState(false);

    const handleKeyDown = () => {};

    return (
        <section {...props} className={styles.thinSection}>
        {isEditing ? (
            <div
                onBlur={() => setEditing(false)}
                onKeyDown={e => handleKeyDown()}
            >
                {children}
            </div>
        ) : (
            <div
                onClick={() => setEditing(true)}
            >
                <span>
                    {text || placeholder || "NULL"}
                </span>
            </div>
        )}
        </section>
    );
};

export default InlineEditable;