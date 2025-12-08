'use client';

const BookLoader = ({ size = 80, color = '#3B82F6' }) => {
    return (
        <div className="relative" style={{ width: size, height: size }}>
            <style jsx>{`
                .book {
                    width: 40px;
                    height: 50px;
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    transform-origin: center;
                    animation: openClose 1.2s infinite ease-in-out;
                }

                @keyframes openClose {
                    0%, 100% {
                        transform: translate(-50%, -50%) rotateY(0deg);
                    }
                    50% {
                        transform: translate(-50%, -50%) rotateY(180deg);
                    }
                }

                .cover, .page {
                    width: 100%;
                    height: 100%;
                    border: 2px solid ${color};
                    border-radius: 4px;
                    position: absolute;
                }

                .page {
                    background: ${color}33;
                    width: 80%;
                    left: 10%;
                }
            `}</style>

            <div className="book">
                <div className="cover" />
                <div className="page" />
            </div>
        </div>
    );
};

export default BookLoader;
