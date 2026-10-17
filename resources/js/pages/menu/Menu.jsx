import { Head } from '@inertiajs/react';
import MenuSection from '../../components/restaurant/MenuSection';
import CategoryFilter from '../../components/restaurant/CategoryFilter';
import { useState } from 'react';

export default function Menu({ categories = [], items = [] }) {
    const [selectedCategory, setSelectedCategory] = useState(null);

    const filteredItems =
        selectedCategory === null
            ? items
            : items.filter(
                  (item) =>
                      String(item.category_id) ===
                      String(selectedCategory)
              );

    return (
        <div>
            {/* Keep your existing menu heading and introduction here */}

            <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
            />

            {/* Keep your existing menu section and card components */}
            <MenuSection items={filteredItems} />
        </div>
    );
}
