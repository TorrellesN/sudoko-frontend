import { motion } from 'framer-motion';
import { LoginForm } from './LoginFormZod';
import { bgBlueGradient, bgRedLogo } from '../../../assets/bgItems';

export default function LoginView() {
  return (
    <>
      <motion.div className="bg-gradient-svg pointer-events-none"
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 1.5,
          delay: 0.5,
          type: "spring",
          damping: 25,
          stiffness: 100
        }}
      >
        <img src={bgBlueGradient} alt="landing background" className="bg-gradient-blue w-full h-full" />
      </motion.div>
      <motion.div className="bg-gradient-svg pointer-events-none"
        initial={{ scale: 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 0.7,
          delay: 1.0,
          type: "spring",
          damping: 30
        }}
      >
        <img src={bgRedLogo} alt="landing background" className="bg-logo-blured w-full h-full" />
      </motion.div>

      <div className='container flex flex-col mx-auto max-w-screen-lg'>

        <LoginForm />
      </div>
    </>

  );
}
