import React from 'react';

function Loading() {
    return (
        <div className="fixed inset-0 flex justify-center items-center bg-bg z-[9999]" aria-label="Loading" role="status">
            <div className="relative w-20 h-20 sm:w-16 sm:h-16 xs:w-12 xs:h-12">
                <div className="absolute top-[33px] w-[13px] h-[13px] rounded-full bg-btn animate-lds-ellipsis1 sm:top-[24px] sm:w-[10px] sm:h-[10px] xs:top-[20px] xs:w-[8px] xs:h-[8px] left-[8px]"></div>
                <div className="absolute top-[33px] w-[13px] h-[13px] rounded-full bg-btn animate-lds-ellipsis2 sm:top-[24px] sm:w-[10px] sm:h-[10px] xs:top-[20px] xs:w-[8px] xs:h-[8px] left-[8px]"></div>
                <div className="absolute top-[33px] w-[13px] h-[13px] rounded-full bg-btn animate-lds-ellipsis2 sm:top-[24px] sm:w-[10px] sm:h-[10px] xs:top-[20px] xs:w-[8px] xs:h-[8px] left-[32px]"></div>
                <div className="absolute top-[33px] w-[13px] h-[13px] rounded-full bg-btn animate-lds-ellipsis3 sm:top-[24px] sm:w-[10px] sm:h-[10px] xs:top-[20px] xs:w-[8px] xs:h-[8px] left-[56px]"></div>
            </div>
        </div>
    );
}

export default Loading;
