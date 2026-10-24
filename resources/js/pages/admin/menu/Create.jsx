import { Link, useForm } from '@inertiajs/react';
import menu from '@/routes/admin/menu';
import AdminPageLayout from '@/components/admin/AdminPageLayout';

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

    return (
        <AdminPageLayout>
            <div className="mx-auto w-full max-w-3xl space-y-6">
                <section className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6 dark:border-stone-700 dark:bg-stone-900">
                    <Link
                        href={menu.index.url()}
                        className="text-sm font-medium text-amber-700 transition hover:text-amber-800 hover:underline focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:outline-none dark:text-amber-400 dark:hover:text-amber-300 dark:focus-visible:ring-offset-stone-900"
                    >
                        ← Back to menu
                    </Link>

                    <p className="mt-6 text-xs font-bold tracking-widest text-amber-700 uppercase dark:text-amber-400">
                        Menu management
                    </p>

                    <h1 className="mt-2 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl dark:text-stone-50">
                        Add menu item
                    </h1>

                    <p className="mt-2 max-w-xl text-sm leading-6 text-stone-600 dark:text-stone-300">
                        Add a dish to your menu, organize it by category, and
                        set the stock levels used by your team.
                    </p>
                </section>

                <form
                    onSubmit={submit}
                    className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm dark:border-stone-700 dark:bg-stone-900"
                >
                    <div className="space-y-8 p-5 sm:p-7">
                        <FormSection
                            title="Item details"
                            description="Provide the information customers will see on the menu."
                        >
                            <div className="grid gap-5 sm:grid-cols-2">
                                <Field
                                    label="Name"
                                    name="name"
                                    form={form}
                                    required
                                    placeholder="e.g. Momo platter"
                                />

                                <Field
                                    label="Slug"
                                    name="slug"
                                    form={form}
                                    helper="Optional URL-friendly identifier."
                                    placeholder="momo-platter"
                                />
                            </div>

                            <CategoryField
                                form={form}
                                categories={categories}
                            />

                            <Field
                                label="Description"
                                name="description"
                                form={form}
                                type="textarea"
                                helper="Add ingredients, serving details, or other useful information."
                                placeholder="Describe this menu item..."
                            />
                        </FormSection>

                        <FormSection
                            title="Pricing and stock"
                            description="Set the selling price and the inventory thresholds for this item."
                        >
                            <div className="grid gap-5 sm:grid-cols-3">
                                <Field
                                    label="Price"
                                    name="price"
                                    type="number"
                                    step="0.01"
                                    form={form}
                                    required
                                    placeholder="0.00"
                                />

                                <Field
                                    label="Initial quantity"
                                    name="initial_quantity"
                                    type="number"
                                    form={form}
                                    helper="Starting stock count."
                                />

                                <Field
                                    label="Reorder level"
                                    name="reorder_level"
                                    type="number"
                                    form={form}
                                    helper="Alert threshold."
                                />
                            </div>
                        </FormSection>

                        <FormSection
                            title="Visibility"
                            description="Choose how this item should appear to customers."
                        >
                            <div className="grid gap-3 sm:grid-cols-2">
                                <Checkbox
                                    label="Available for ordering"
                                    name="is_available"
                                    form={form}
                                    description="Customers can order this item."
                                />

                                <Checkbox
                                    label="Featured item"
                                    name="is_featured"
                                    form={form}
                                    description="Highlight this item on the menu."
                                />
                            </div>
                        </FormSection>
                    </div>

                    <div className="flex flex-col-reverse gap-3 border-t border-stone-200 bg-stone-50 px-5 py-4 sm:flex-row sm:justify-end sm:px-7 dark:border-stone-700 dark:bg-stone-950">
                        <Link
                            href={menu.index.url()}
                            className="inline-flex items-center justify-center rounded-lg border border-stone-300 px-4 py-2.5 text-sm font-semibold text-stone-700 transition hover:bg-white focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:outline-none dark:border-stone-600 dark:text-stone-200 dark:hover:bg-stone-900 dark:focus-visible:ring-offset-stone-950"
                        >
                            Cancel
                        </Link>

                        <button
                            type="submit"
                            disabled={form.processing}
                            className="inline-flex items-center justify-center rounded-lg bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-700 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:focus-visible:ring-offset-stone-950"
                        >
                            {form.processing ? 'Saving...' : 'Create item'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminPageLayout>
    );
}

function FormSection({ title, description, children }) {
    return (
        <section className="space-y-5">
            <div className="border-b border-stone-200 pb-4 dark:border-stone-700">
                <h2 className="text-base font-semibold text-stone-900 dark:text-stone-100">
                    {title}
                </h2>
                <p className="mt-1 text-sm leading-6 text-stone-500 dark:text-stone-400">
                    {description}
                </p>
            </div>

            <div className="space-y-5">{children}</div>
        </section>
    );
}

function CategoryField({ form, categories }) {
    const hasError = Boolean(form.errors.category_id);

    return (
        <div>
            <label
                htmlFor="category_id"
                className="block text-sm font-semibold text-stone-800 dark:text-stone-200"
            >
                Category <span className="text-amber-600">*</span>
            </label>

            <select
                id="category_id"
                value={form.data.category_id}
                onChange={(event) =>
                    form.setData('category_id', event.target.value)
                }
                aria-invalid={hasError}
                className={inputClasses(hasError)}
            >
                <option value="">Select a category</option>
                {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                        {category.name}
                    </option>
                ))}
            </select>

            {form.errors.category_id && (
                <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">
                    {form.errors.category_id}
                </p>
            )}
        </div>
    );
}

function Field({
    label,
    name,
    form,
    type = 'text',
    step,
    helper,
    required = false,
    placeholder,
}) {
    const hasError = Boolean(form.errors[name]);
    const fieldProps = {
        id: name,
        name,
        value: form.data[name],
        onChange: (event) => form.setData(name, event.target.value),
        'aria-invalid': hasError,
        'aria-describedby': helper || hasError ? `${name}-hint` : undefined,
        placeholder,
        className: inputClasses(hasError),
    };

    return (
        <div className={type === 'textarea' ? 'sm:col-span-2' : ''}>
            <label
                htmlFor={name}
                className="block text-sm font-semibold text-stone-800 dark:text-stone-200"
            >
                {label} {required && <span className="text-amber-600">*</span>}
            </label>

            {type === 'textarea' ? (
                <textarea {...fieldProps} rows="4" />
            ) : (
                <input
                    {...fieldProps}
                    type={type}
                    step={step}
                    min={type === 'number' ? '0' : undefined}
                />
            )}

            {helper && !hasError && (
                <p
                    id={`${name}-hint`}
                    className="mt-1.5 text-xs leading-5 text-stone-500 dark:text-stone-400"
                >
                    {helper}
                </p>
            )}

            {form.errors[name] && (
                <p
                    id={`${name}-hint`}
                    className="mt-1.5 text-sm text-red-600 dark:text-red-400"
                >
                    {form.errors[name]}
                </p>
            )}
        </div>
    );
}

function Checkbox({ label, name, form, description }) {
    return (
        <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-stone-200 p-4 transition hover:border-amber-300 hover:bg-amber-50/50 dark:border-stone-700 dark:hover:border-amber-700 dark:hover:bg-amber-950/20">
            <input
                type="checkbox"
                checked={form.data[name]}
                onChange={(event) => form.setData(name, event.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-stone-300 text-amber-600 focus:ring-amber-500 dark:border-stone-600 dark:bg-stone-800"
            />

            <span>
                <span className="block text-sm font-semibold text-stone-800 dark:text-stone-200">
                    {label}
                </span>
                <span className="mt-1 block text-xs leading-5 text-stone-500 dark:text-stone-400">
                    {description}
                </span>
            </span>
        </label>
    );
}

function inputClasses(hasError) {
    return `mt-2 block w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-stone-900 shadow-sm outline-none transition placeholder:text-stone-400 focus:ring-2 dark:bg-stone-950 dark:text-stone-100 dark:placeholder:text-stone-600 ${
        hasError
            ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500'
            : 'border-stone-300 focus:border-amber-500 focus:ring-amber-500/20 dark:border-stone-600'
    }`;
}
