import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

type PageProps = {
    flash: {
        success?: string | null;
        id?: string | null;
    };
};

export default function FlashMessage() {
    const { flash } = usePage<PageProps>().props;
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        if (!flash?.success || !flash?.id) return;

        setMessage(flash.success);

        const timer = setTimeout(() => {
            setMessage(null);
        }, 1000);

        return () => clearTimeout(timer);
    }, [flash?.id]);

    if (!message) return null;

    return (
        <div className="fixed top-5 right-5 z-50 rounded-lg bg-green-600 px-4 py-3 text-white shadow-lg">
            {message}
        </div>
    );
}
