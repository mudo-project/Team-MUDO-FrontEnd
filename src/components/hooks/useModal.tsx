'use client'

import { useEffect, useState } from "react"


function useModal(activefunc?: () => void, noneActivefunc?: () => void) {
    const [isModal, setIsModal] = useState<boolean>(false);

    useEffect(() => {
        if (!isModal) return;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [isModal]);

    //모달 여는 함수 
    const openModal = (): void => {
        setIsModal(true);
    }

    //모달 닫히는 함수
    const closeModal = (): void => {
        setIsModal(false);
    }

    //모달이 닫을 때 일어나는 함수
    const noneActiveModal = (): void => {
        setIsModal(false);
        noneActivefunc?.();
    }

    //모달이 실행될 때 일어나는 함수
    const activeModal = (): void => {
        setIsModal(false);
        activefunc?.();
    }

    return { openModal, closeModal, activeModal, noneActiveModal, isModal }
}

export default useModal