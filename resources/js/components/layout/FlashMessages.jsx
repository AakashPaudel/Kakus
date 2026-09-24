import { useState } from 'react';
import { usePage } from '@inertiajs/react';

export default function FlashMessages() {
    const { flash } = usePage().props;

    const [visible, setVisible] = useState(true);

    if (!visible || (!flash?.success && !flash?.error)) {
        return null;
    }

    return (
        <div className="mx-auto max-w-7xl px-4 pt-5 sm:px-6 lg:px-8">
            {flash.success && (
                <div className="flex justify-between rounded-lg border border-green-200 bg-green-50 p-4 text-green-800">
                    <span>{flash.success}</span>

                    <button onClick={() => setVisible(false)}>×</button>
                </div>
            )}

            {flash.error && (
                <div className="flex justify-between rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
                    <span>{flash.error}</span>

                    <button onClick={() => setVisible(false)}>×</button>
                </div>
            )}
        </div>
    );
}
