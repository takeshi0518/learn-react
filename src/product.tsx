import { PRODUCTS } from './mock';

type Product = {
  category: string;
  price: string;
  stocked: boolean;
  name: string;
};

export default function FilterableProductTable() {
  return (
    <div>
      <SearchBar />
      <ProductTable products={PRODUCTS} />
    </div>
  );
}

function SearchBar() {
  return (
    <form>
      <input type="text" placeholder="Search..." />
      <label>
        <input type="checkbox" /> only show products in stock
      </label>
    </form>
  );
}

function ProductTable({ products }: { products: Product[] }) {
  const rows = [];
  let lastCategory = null;

  products.forEach((p) => {
    if (p.category !== lastCategory) {
      rows.push(<ProductCategoryRow category={p.category} key={p.category} />);
    }
    rows.push(<ProductRow product={p} key={p.name} />);
    lastCategory = p.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function ProductCategoryRow({ category }: { category: string }) {
  return (
    <tr>
      <th colSpan={2}>{category}</th>
    </tr>
  );
}

function ProductRow({ product }: { product: Product }) {
  const name = product.stocked ? (
    product.name
  ) : (
    <span style={{ color: 'red' }}>{product.name}</span>
  );

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}
