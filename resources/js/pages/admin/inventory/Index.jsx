import { useForm } from '@inertiajs/react';
import inventoryRoutes from '@/routes/admin/inventory';

function InventoryRow({ item }) {
    const form = useForm({
        quantity: item.quantity,
        reorder_level: item.reorder_level,
    });

    function submit(event) {
        event.preventDefault();
        form.patch(inventoryRoutes.update.url(item), { preserveScroll: true });
    }

    const lowStock = item.quantity <= item.reorder_level;

    return (
        <tr>
            <td className="px-5 py-4 font-medium text-stone-900">{item.menu_item?.name ?? 'Unknown item'}</td>
            <td className="px-5 py-4"><span className={lowStock ? 'rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700' : 'rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700'}>{item.quantity} in stock</span></td>
            <td className="px-5 py-4">
                <form onSubmit={submit} className="flex flex-wrap items-center gap-2">
                    <input type="number" min="0" value={form.data.quantity} onChange={(event) => form.setData('quantity', event.target.value)} className="w-24 rounded-lg border border-stone-300 px-2 py-2" aria-label={`Quantity for ${item.menu_item?.name}`} />
                    <input type="number" min="0" value={form.data.reorder_level} onChange={(event) => form.setData('reorder_level', event.target.value)} className="w-24 rounded-lg border border-stone-300 px-2 py-2" aria-label={`Reorder level for ${item.menu_item?.name}`} />
                    <button type="submit" disabled={form.processing} className="rounded-lg bg-amber-600 px-3 py-2 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-50">Save</button>
                </form>
                {form.errors.quantity && <p className="mt-1 text-sm text-red-600">{form.errors.quantity}</p>}
            </td>
        </tr>
    );
}

export default function Index({ inventory = [] }) {
    return (
        <div className="space-y-8">
            <div><p className="text-sm font-semibold uppercase tracking-widest text-amber-700">Administration</p><h1 className="mt-2 text-3xl font-bold text-stone-900">Inventory management</h1><p className="mt-2 text-stone-600">Update stock quantities and reorder levels for every menu item.</p></div>
            <div className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-stone-50"><tr><th className="px-5 py-3 text-sm font-semibold text-stone-700">Menu item</th><th className="px-5 py-3 text-sm font-semibold text-stone-700">Status</th><th className="px-5 py-3 text-sm font-semibold text-stone-700">Adjust stock</th></tr></thead>
                        <tbody className="divide-y divide-stone-200">{inventory.map((item) => <InventoryRow key={item.id} item={item} />)}{inventory.length === 0 && <tr><td colSpan="3" className="px-5 py-10 text-center text-stone-500">No inventory records found.</td></tr>}</tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
