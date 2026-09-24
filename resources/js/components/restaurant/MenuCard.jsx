export default function MenuCard({ name, description, price }) {
    return (
        <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">{name}</h2>

            <p className="mt-2 text-gray-600">{description}</p>

            <p className="mt-4 text-lg font-bold">Rs. {price}</p>
        </div>
    );
}
