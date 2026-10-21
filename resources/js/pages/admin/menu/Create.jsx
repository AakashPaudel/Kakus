import { Link, useForm } from '@inertiajs/react';
import menu from '@/routes/admin/menu';

export default function Create({ categories = [] }) {
    const form = useForm({
        category_id: '',
        name: '',
        slug: '',
        description: '',
        price: '',
        is_available: true,
        is_featured: false,
        initial_quantity: 0,
        reorder_level: 5,
    });

    function submit(event) {
        event.preventDefault();
        form.post(menu.store.url());
    }

    return <MenuItemForm form={form} categories={categories} title="Add menu item" submitLabel="Create item" onSubmit={submit} />;
}

function MenuItemForm({ form, categories, title, submitLabel, onSubmit }) {
    return (
        <div className="mx-auto max-w-2xl space-y-6">
            <div>
                <Link href={menu.index.url()} className="text-sm font-medium text-amber-700 hover:underline">← Back to menu</Link>
                <h1 className="mt-4 text-3xl font-bold text-stone-900">{title}</h1>
            </div>
            <form onSubmit={onSubmit} className="space-y-5 rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
                <Field label="Name" name="name" form={form} />
                <Field label="Slug (optional)" name="slug" form={form} />
                <div>
                    <label className="block text-sm font-medium text-stone-700">Category</label>
                    <select value={form.data.category_id} onChange={(event) => form.setData('category_id', event.target.value)} className="mt-2 w-full rounded-lg border border-stone-300 px-3 py-2">
                        <option value="">Select a category</option>
                        {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                    </select>
                    {form.errors.category_id && <p className="mt-1 text-sm text-red-600">{form.errors.category_id}</p>}
                </div>
                <Field label="Price" name="price" type="number" step="0.01" form={form} />
                <Field label="Description" name="description" type="textarea" form={form} />
                <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Initial quantity" name="initial_quantity" type="number" form={form} />
                    <Field label="Reorder level" name="reorder_level" type="number" form={form} />
                </div>
                <Checkbox label="Available for ordering" name="is_available" form={form} />
                <Checkbox label="Featured item" name="is_featured" form={form} />
                <div className="flex justify-end gap-3">
                    <Link href={menu.index.url()} className="rounded-lg border border-stone-300 px-4 py-2 font-medium text-stone-700 hover:bg-stone-50">Cancel</Link>
                    <button type="submit" disabled={form.processing} className="rounded-lg bg-amber-600 px-4 py-2 font-semibold text-white hover:bg-amber-700 disabled:opacity-50">{form.processing ? 'Saving...' : submitLabel}</button>
                </div>
            </form>
        </div>
    );
}

function Field({ label, name, form, type = 'text', step }) {
    const props = { value: form.data[name], onChange: (event) => form.setData(name, event.target.value), className: 'mt-2 w-full rounded-lg border border-stone-300 px-3 py-2' };
    return <div><label className="block text-sm font-medium text-stone-700">{label}</label>{type === 'textarea' ? <textarea {...props} rows="4" /> : <input {...props} type={type} step={step} min={type === 'number' ? '0' : undefined} />}{form.errors[name] && <p className="mt-1 text-sm text-red-600">{form.errors[name]}</p>}</div>;
}

function Checkbox({ label, name, form }) {
    return <label className="flex items-center gap-2 text-sm text-stone-700"><input type="checkbox" checked={form.data[name]} onChange={(event) => form.setData(name, event.target.checked)} />{label}</label>;
}
