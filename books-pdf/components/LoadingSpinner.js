import BookLoader from './BookLoader';
import { ClipLoader, BounceLoader, PulseLoader, RingLoader } from 'react-spinners';

const LoadingSpinner = ({ 
    size = 40, 
    color = '#3B82F6', 
    type = 'clip',
    fullScreen = false,
    text = 'Loading...'
}) => {

    const spinners = {
        clip: ClipLoader,
        bounce: BounceLoader,
        pulse: PulseLoader,
        ring: RingLoader,
        book: BookLoader   // <-- Adding new custom loader
    };

    const SpinnerComponent = spinners[type] || ClipLoader;

    const content = (
        <div className="flex flex-col items-center justify-center gap-4">
            <SpinnerComponent color={color} size={size} />
            {text && <p className="text-gray-600 font-medium animate-pulse">{text}</p>}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
                {content}
            </div>
        );
    }

    return content;
};

export default LoadingSpinner;
