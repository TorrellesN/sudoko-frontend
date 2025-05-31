import React from 'react'

type NavItemsProps = {
    options: Record<string, () => void>
}

export default function NavItems({ options }: NavItemsProps) {
    return (
        <>
            {Object.entries(options).map(([label, action], index) => (
                <div key={index}
                    className="navItem"
                    onClick={(e) => action()}>
                    <h6>{label}</h6>
                    <div></div>
                </div>
            ))}
        </>
    )
}
