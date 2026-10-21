
import { Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import menu from '@/routes/admin/menu';
import categories from '@/routes/admin/categories';
import inventory from '@/routes/admin/inventory';
import AdminPageLayout from '@/components/admin/AdminPageLayout';

function CategoryForm({ category, onCancel }) {
    const form = useForm({
        name: category?.name ?? '',
        slug: category?.slug ?? '',
        description: category?.description ?? '',
        is_active: category?.is_active ?? true,
    });

    function submit(event) {
        event.preventDefault();

        if (category) {
            form.put(categories.update.url(category), {
                preserveScroll: true,
            });
        } else {
            form.post(categories.store.url(), {
                preserveScroll: true,
            });
        }
    }

    const inputClasses =
        'w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-100 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:placeholder:text-stone-500 dark:focus:ring-amber-900';

    return (
        <form
            onSubmit={submit}
            className="space-y-4 rounded-xl border border-stone-200 bg-white p-5 text-stone-900 shadow-sm dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
        >
            <div className="flex items-center justify-between gap-3 border-b border-stone-100 pb-3 dark:border-stone-800">
                <div>
                    <h2 className="text-base font-semibold">
                        {category ? 'Edit category' : 'Add category'}
                    </h2>
                    <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                        {category
                            ? 'Update the category details.'
                            : 'Create a category for your menu.'}
                    </p>
                </div>

                {category && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="text-sm font-medium text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
                    >
                        Cancel
                    </button>
                )}
            </div>

            <div className="space-y-1.5">
                <label
                    htmlFor="category-name"
                    className="block text-sm font-medium text-stone-700 dark:text-stone-300"
                >
                    Category name
                </label>
                <input
                    id="category-name"
                    value={form.data.name}
                    onChange={(event) =>
                        form.setData('name', event.target.value)
                    }
                    placeholder="e.g. Main Course"
                    required
                    className={inputClasses}
                />
                {form.errors.name && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                        {form.errors.name}
                    </p>
                )}
            </div>

            <div className="space-y-1.5">
                <label
                    htmlFor="category-slug"
                    className="block text-sm font-medium text-stone-700 dark:text-stone-300"
                >
                    Slug
                    <span className="ml-1 font-normal text-stone-500">
                        (optional)
                    </span>
                </label>
                <input
                    id="category-slug"
                    value={form.data.slug}
                    onChange={(event) =>
                        form.setData('slug', event.target.value)
                    }
                    placeholder="e.g. main-course"
                    className={inputClasses}
                />
                {form.errors.slug && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                        {form.errors.slug}
                    </p>
                )}
            </div>

            <div className="space-y-1.5">
                <label
                    htmlFor="category-description"
                    className="block text-sm font-medium text-stone-700 dark:text-stone-300"
                >
                    Description
                    <span className="ml-1 font-normal text-stone-500">
                        (optional)
                    </span>
                </label>
                <textarea
                    id="category-description"
                    value={form.data.description}
                    onChange={(event) =>
                        form.setData('description', event.target.value)
                    }
                    placeholder="Briefly describe this category"
                    rows={3}
                    className={`${inputClasses} resize-y`}
                />
                {form.errors.description && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                        {form.errors.description}
                    </p>
                )}
            </div>

            <label className="flex cursor-pointer items-center gap-2.5 rounded-lg bg-stone-50 p-3 text-sm text-stone-700 dark:bg-stone-950 dark:text-stone-300">
                <input
                    type="checkbox"
                    checked={form.data.is_active}
                    onChange={(event) =>
                        form.setData('is_active', event.target.checked)
                    }
                    className="size-4 rounded border-stone-300 accent-amber-600 focus:ring-amber-500"
                />
                <span>
                    <span className="block font-medium text-stone-900 dark:text-stone-100">
                        Active category
                    </span>
                    <span className="mt-0.5 block text-xs text-stone-500 dark:text-stone-400">
                        Allow this category to be used on the menu.
                    </span>
                </span>
            </label>

            <button
                type="submit"
                disabled={form.processing}
                className="inline-flex w-full items-center justify-center rounded-lg bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus-visible:ring-offset-stone-900"
            >
                {form.processing
                    ? 'Saving...'
                    : category
                      ? 'Update category'
                      : 'Add category'}
            </button>
        </form>
    );
}

export default function Index({ categories = [], items = [] }) {
    const [editingCategory, setEditingCategory] = useState(null);

    return (
        <AdminPageLayout>
            <div className="space-y-6">
            {/* Page heading */}
            <section className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6 dark:border-stone-700 dark:bg-stone-900">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400">
                            Administration
                        </p>

                        <h1 className="mt-2 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl dark:text-stone-50">
                            Menu Management
                        </h1>

                        <p className="mt-2 max-w-xl text-sm leading-6 text-stone-600 dark:text-stone-300">
                            Manage menu categories, prices, availability, and
                            stock in one place.
                        </p>
                    </div>

                    <Link
                        href={menu.create.url()}
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-amber-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-amber-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-stone-900"
                    >
                        <span aria-hidden="true">+</span>
                        Add menu item
                    </Link>
                </div>
            </section>

            {/* Category management and menu items */}
            <div className="grid items-start gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
                {/* Left column */}
                <div className="space-y-6">
                    <CategoryForm
                        category={editingCategory}
                        onCancel={() => setEditingCategory(null)}
                    />

                    {/* Categories list */}
                    <section className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-700 dark:bg-stone-900">
                        <div className="mb-4 flex items-center justify-between border-b border-stone-100 pb-3 dark:border-stone-800">
                            <h2 className="font-semibold text-stone-900 dark:text-stone-100">
                                Categories
                            </h2>
                            <span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-semibold text-stone-600 dark:bg-stone-800 dark:text-stone-300">
                                {categories.length}
                            </span>
                        </div>

                        <div className="space-y-2">
                            {categories.map((category) => (
                                <div
                                    key={category.id}
                                    className="flex items-center justify-between gap-3 rounded-lg border border-stone-200 bg-stone-50 p-3 dark:border-stone-700 dark:bg-stone-950"
                                >
                                    <div className="min-w-0">
                                        <p className="break-words text-sm font-medium text-stone-900 dark:text-stone-100">
                                            {category.name}
                                        </p>
                                        <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                                            {category.menu_items_count}{' '}
                                            {category.menu_items_count === 1
                                                ? 'menu item'
                                                : 'menu items'}
                                        </p>
                                    </div>

                                    <div className="flex shrink-0 items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setEditingCategory(category)
                                            }
                                            className="text-sm font-medium text-amber-700 hover:underline dark:text-amber-400"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                router.delete(
                                                    categories.destroy.url(
                                                        category,
                                                    ),
                                                    { preserveScroll: true },
                                                )
                                            }
                                            className="text-sm font-medium text-red-600 hover:underline dark:text-red-400"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {categories.length === 0 && (
                                <p className="rounded-lg bg-stone-50 px-3 py-6 text-center text-sm text-stone-500 dark:bg-stone-950 dark:text-stone-400">
                                    No categories found. Add your first
                                    category above.
                                </p>
                            )}
                        </div>
                    </section>
                </div>

                {/* Right column: menu items table */}
                <section className="min-w-0 overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm dark:border-stone-700 dark:bg-stone-900">
                    <div className="flex flex-col gap-3 border-b border-stone-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-stone-700">
                        <div>
                            <h2 className="font-semibold text-stone-900 dark:text-stone-100">
                                Menu Items
                            </h2>
                            <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                                View and manage your restaurant dishes.
                            </p>
                        </div>

                        <Link
                            href={inventory.index.url()}
                            className="inline-flex items-center justify-center self-start rounded-lg border border-stone-300 px-3 py-2 text-sm font-semibold text-stone-700 transition-colors hover:bg-stone-100 sm:self-auto dark:border-stone-600 dark:text-stone-200 dark:hover:bg-stone-800"
                        >
                            Manage inventory
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[650px] text-left">
                            <thead className="bg-stone-50 dark:bg-stone-950">
                                <tr className="border-b border-stone-200 dark:border-stone-700">
                                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-stone-600 dark:text-stone-300">
                                        Item
                                    </th>
                                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-stone-600 dark:text-stone-300">
                                        Category
                                    </th>
                                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-stone-600 dark:text-stone-300">
                                        Price
                                    </th>
                                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-stone-600 dark:text-stone-300">
                                        Stock
                                    </th>
                                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-stone-600 dark:text-stone-300">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
                                {items.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="transition-colors hover:bg-stone-50 dark:hover:bg-stone-800/50"
                                    >
                                        <td className="px-5 py-4">
                                            <p className="font-medium text-stone-900 dark:text-stone-100">
                                                {item.name}
                                            </p>

                                            <span
                                                className={`mt-1 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                                    item.is_available
                                                        ? 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400'
                                                        : 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400'
                                                }`}
                                            >
                                                {item.is_available
                                                    ? 'Available'
                                                    : 'Unavailable'}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4 text-sm text-stone-600 dark:text-stone-300">
                                            {item.category?.name ??
                                                'Uncategorized'}
                                        </td>

                                        <td className="whitespace-nowrap px-5 py-4 text-sm font-medium text-stone-800 dark:text-stone-200">
                                            Rs.{' '}
                                            {Number(
                                                item.price,
                                            ).toLocaleString()}
                                        </td>

                                        <td className="px-5 py-4 text-sm text-stone-600 dark:text-stone-300">
                                            {item.inventory?.quantity ?? 0}
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <Link
                                                    href={menu.edit.url(item)}
                                                    className="text-sm font-semibold text-amber-700 hover:underline dark:text-amber-400"
                                                >
                                                    Edit
                                                </Link>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        router.delete(
                                                            menu.destroy.url(
                                                                item,
                                                            ),
                                                        )
                                                    }
                                                    className="text-sm font-semibold text-red-600 hover:underline dark:text-red-400"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {items.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-5 py-12 text-center"
                                        >
                                            <p className="font-medium text-stone-700 dark:text-stone-200">
                                                No menu items found
                                            </p>
                                            <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                                                Add a menu item to get started.
                                            </p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
            </div>
        </AdminPageLayout>
    );
}
