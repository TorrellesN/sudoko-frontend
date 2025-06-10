import { RolNumber } from "../../../domain";
import { profileImgs } from "../../../utilities/constants";
import { getPlayerStyle, getRolBgBase, getPlayerGradient } from "../../styles/sudokuCardStyles";
import { AnimatedNumber } from "./AnimatedNumber";
import FireComboIcon from "./FireComboIcon";

type userSudokuCardProps = {
    user: {
        username: string;
        email: string;
        profileImg: string;
    },
    rol: RolNumber,
    points: number,
    comboAcc: number,
    theme: "light" | "dark" | "system"

}

export default function UserSudokuCard({ rol, theme, user, points, comboAcc }: userSudokuCardProps) {
    return (
        <div className='p-5 rounded-3xl flex flex-col md:flex-row items-center justify-start gap-6 lg:gap-8 w-full'
            style={{ ...getPlayerStyle(rol, theme, true) }}>
            <div className='flex flex-row md:flex-col flex-1 items-center justify-between md:items-start gap-8 md:gap-2.5 text-md font-semibold'>

                <div
                    className="mb-1 rounded-full h-[2.8rem] w-[2.8rem] hidden md:block aspect-square border-2 border-[var(--dark-color-border)]/70"
                    style={{ ...getRolBgBase(rol) }}
                >
                    <img src={profileImgs[user.profileImg]} alt="" className="h-[2.6rem] w-[2.6rem] aspect-square rounded-full opacity-80"/>
                </div>

                <h4 className='pl-1.5 pt-0.5 md:pt-0'>{user.username}</h4>
                <div className='flex items-center gap-2 pl-1.5'>
                    <AnimatedNumber className='pt-0.5' value={points || 0} />
                    <FireComboIcon comboAcc={comboAcc || 0} />
                </div>
            </div>
            <div className='hidden md:block w-2.5 h-25 rounded-full'
                style={{ ...getPlayerGradient(rol) }}
            ></div>

        </div>
    )
}
