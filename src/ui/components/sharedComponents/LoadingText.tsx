import React, { useContext } from 'react'
import RollingSquare from './LoadingSquare'
import { ThemeContext } from '../../../application/context/themeContext';

export default function LoadingText() {
    const { theme } = useContext(ThemeContext);
    return (
        <div className="flex flex-row items-center justify-center w-full gap-4 pb-4">
            <div className="h-6 w-6">
                <RollingSquare theme={theme} />
            </div>
            <h3>Esperando oponentes...</h3>
        </div>
    )
}
