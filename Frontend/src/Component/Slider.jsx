import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiX } from 'react-icons/fi';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

function Slider() {
    const location = useLocation();
    const navigate = useNavigate();
    const { image } = location.state || {};

    const handleClose = () => {
        navigate(-1);
    };

    return (
        <div className="h-[92vh] flex flex-col bg-bg p-4 md:p-8">
            <div className="w-full flex justify-end mb-4 flex-shrink-0">
                <button
                    onClick={handleClose}
                    className="text-textSubtle hover:text-textMain text-3xl sm:text-3xl md:text-4xl transition duration-200"
                >
                    <FiX />
                </button>
            </div>

            <div className="flex justify-center items-center flex-1 overflow-hidden p-2 sm:p-4 md:p-8">
                {image ? (
                    <TransformWrapper
                        initialScale={1}
                        minScale={0.5}
                        maxScale={5}
                        wheel={{ step: 0.1 }}
                        pinch={{ step: 5 }}
                        doubleClick={{ disabled: true }}
                        pan={{ disabled: false }}
                    >
                        <TransformComponent>
                            <img
                                src={image}
                                alt="Notice Slider"
                                className="max-w-full max-h-full sm:max-h-[85vh] md:max-h-[90vh] object-contain rounded-lg shadow transition duration-300"
                            />
                        </TransformComponent>
                    </TransformWrapper>
                ) : (
                    <p className="text-textMain text-base sm:text-lg md:text-xl text-center">
                        No image to display
                    </p>
                )}
            </div>
        </div>
    );
}

export default Slider;
