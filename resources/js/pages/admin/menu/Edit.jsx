import { Link, useForm } from '@inertiajs/react';
import menu from '@/routes/admin/menu';
import AdminPageLayout from '@/components/admin/AdminPageLayout';

export default function Edit({ item, categories = [] }) {
    const form = useForm({
        category_id: item.category_id ?? '',
        name: item.name ?? '',
        slug: item.slug ?? '',
        description: item.description ?? '',
        price: item.price ?? '',
        is_available: item.is_available ?? false,
        is_featured: item.is_featured ?? false,
        reorder_level: item.inventory?.reorder_level ?? 5,
    });

    function submit(event) {
        event.preventDefault();
        form.put(menu.update.url(item));
    }

    return <CreateForm form={form} categories={categories} onSubmit={submit} />;
}

function CreateForm({ form, categories, onSubmit }) {
    return (
        <AdminPageLayout>
            <div className="mx-auto max-w-2xl space-y-6">
                <div>
                    <Link
                        href={menu.index.url()}
                        className="text-sm font-medium text-amber-700 hover:underline"
                    >
                        ← Back to menu
                    </Link>
                    <h1 className="mt-4 text-3xl font-bold text-stone-900">
                        Edit menu item
                    </h1>
                </div>
                <form
                    onSubmit={onSubmit}
                    className="space-y-5 rounded-xl border border-stone-200 bg-white p-6 shadow-sm"
                >
                    <Field label="Name" name="name" form={form} />
                    <Field label="Slug" name="slug" form={form} />
                    <div>
                        <label className="block text-sm font-medium text-stone-700">
                            Category
                        </label>
                        <select
                            value={form.data.category_id}
                            onChange={(event) =>
                                form.setData('category_id', event.target.value)
                            }
                            className="mt-2 w-full rounded-lg border border-stone-300 px-3 py-2"
                        >
                            <option value="">Select a category</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        {form.errors.category_id && (
                            <p className="mt-1 text-sm text-red-600">
                                {form.errors.category_id}
                            </p>
                        )}
                    </div>
                    <Field
                        label="Price"
                        name="price"
                        type="number"
                        step="0.01"
                        form={form}
                    />
                    <Field
                        label="Description"
                        name="description"
                        type="textarea"
                        form={form}
                    />
                    <Field
                        label="Reorder level"
                        name="reorder_level"
                        type="number"
                        form={form}
                    />
                    <Checkbox
                        label="Available for ordering"
                        name="is_available"
                        form={form}
                    />
                    <Checkbox
                        label="Featured item"
                        name="is_featured"
                        form={form}
                    />
                    <div className="flex justify-end gap-3">
                        <Link
                            href={menu.index.url()}
                            className="rounded-lg border border-stone-300 px-4 py-2 font-medium text-stone-700"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={form.processing}
                            className="rounded-lg bg-amber-600 px-4 py-2 font-semibold text-white disabled:opacity-50"
                        >
                            {form.processing ? 'Saving...' : 'Update item'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminPageLayout>
    );
}

function Field({ label, name, form, type = 'text', step }) {
    return (
        <div>
            <label className="block text-sm font-medium text-stone-700">
                {label}
            </label>
            <input
                value={form.data[name] ?? ''}
                onChange={(event) => form.setData(name, event.target.value)}
                type={type}
                step={step}
                min={type === 'number' ? '0' : undefined}
                className="mt-2 w-full rounded-lg border border-stone-300 px-3 py-2"
            />
            {form.errors[name] && (
                <p className="mt-1 text-sm text-red-600">{form.errors[name]}</p>
            )}
        </div>
    );
}

function Checkbox({ label, name, form }) {
    return (
        <label className="flex items-center gap-2 text-sm text-stone-700">
            <input
                type="checkbox"
                checked={form.data[name]}
                onChange={(event) => form.setData(name, event.target.checked)}
            />
            {label}
        </label>
    );
}
