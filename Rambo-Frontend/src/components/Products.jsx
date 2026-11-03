import React, { useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Star,
  X,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Truck,
  RotateCcw,
} from "lucide-react";

/* ============================================================
   RAMBO PRODUCT CATALOGUE
   ============================================================ */

const featuredProducts = [
  {
    productId: "RAM-ACC-001",
    sku: "TR-001",
    name: "Towel Rod",
    category: "Bathroom Accessories",
    subcategory: "Towel Accessories",
    description:
      "Premium wall-mounted towel rod designed for durability and everyday bathroom use.",
    material: "Stainless Steel",
    finish: "Chrome",
    color: "Silver",
    price: 2500,
    salePrice: 2250,
    stockQuantity: 50,
    availability: "In Stock",
    rating: 4.8,
    reviewsCount: 42,
    image: "/images/products/towel-rod.png",
    featured: true,
    active: true,
  },
  {
    productId: "RAM-ACC-002",
    sku: "TR-002",
    name: "Towel Ring",
    category: "Bathroom Accessories",
    subcategory: "Towel Accessories",
    description:
      "Elegant towel ring providing a practical and durable bathroom storage solution.",
    material: "Stainless Steel",
    finish: "Chrome",
    color: "Silver",
    price: 3000,
    salePrice: 2700,
    stockQuantity: 30,
    availability: "In Stock",
    rating: 4.9,
    reviewsCount: 28,
    image: "/images/products/towel-ring.png",
    featured: true,
    active: true,
  },
  {
    productId: "RAM-ACC-003",
    sku: "TR-003",
    name: "Tumbler Holder",
    category: "Bathroom Accessories",
    subcategory: "Towel Accessories",
    description:
      "Compact tumbler holder with a premium finish for modern bathroom interiors.",
    material: "Stainless Steel",
    finish: "Chrome",
    color: "Silver",
    price: 1800,
    salePrice: 1620,
    stockQuantity: 40,
    availability: "In Stock",
    rating: 4.7,
    reviewsCount: 19,
    image: "/images/products/tumbler-holder.png",
    featured: true,
    active: true,
  },
  {
    productId: "RAM-ACC-004",
    sku: "SH-001",
    name: "Soap Dish",
    category: "Bathroom Accessories",
    subcategory: "Soap Accessories",
    description:
      "Durable wall-mounted soap dish designed for convenient everyday use.",
    material: "Stainless Steel",
    finish: "Chrome",
    color: "Silver",
    price: 1600,
    salePrice: 1440,
    stockQuantity: 35,
    availability: "In Stock",
    rating: 4.6,
    reviewsCount: 15,
    image: "/images/products/soap-dish.png",
    featured: true,
    active: true,
  },
  {
    productId: "RAM-ACC-005",
    sku: "SRH-001",
    name: "Single Robe Hook",
    category: "Bathroom Accessories",
    subcategory: "Hooks & Hangers",
    description:
      "Sleek and robust robe hook suitable for towels, robes, and garments.",
    material: "Stainless Steel",
    finish: "Chrome",
    color: "Silver",
    price: 1200,
    salePrice: 990,
    stockQuantity: 60,
    availability: "In Stock",
    rating: 4.8,
    reviewsCount: 31,
    image: "/images/products/single-robe-hook.png",
    featured: true,
    active: true,
  },
  {
    productId: "RAM-ACC-006",
    sku: "TPC-001",
    name: "Toilet Paper Cover",
    category: "Bathroom Accessories",
    subcategory: "Paper Holders",
    description:
      "Wall-mounted toilet paper holder with protective splash cover plate.",
    material: "Stainless Steel",
    finish: "Chrome",
    color: "Silver",
    price: 2100,
    salePrice: 1890,
    stockQuantity: 25,
    availability: "In Stock",
    rating: 4.5,
    reviewsCount: 18,
    image: "/images/products/toilet-paper-cover.png",
    featured: true,
    active: true,
  },
  {
    productId: "RAM-ACC-007",
    sku: "TS-001",
    name: "Towel Shelf",
    category: "Bathroom Accessories",
    subcategory: "Towel Accessories",
    description:
      "Multi-tier towel rack with upper shelf and lower hanging rod for maximum storage.",
    material: "Stainless Steel",
    finish: "Chrome",
    color: "Silver",
    price: 5200,
    salePrice: 4680,
    stockQuantity: 15,
    availability: "In Stock",
    rating: 4.9,
    reviewsCount: 54,
    image: "/images/products/towel-shelf.png",
    featured: true,
    active: true,
  },
];

/* ============================================================
   MOCK REVIEWS
   ============================================================ */

const mockReviews = [
  {
    id: 1,
    author: "Muhammad Ali",
    rating: 5,
    date: "September 12, 2026",
    comment:
      "Exceptional build quality! The chrome finish looks extremely high-end in my modern bathroom setup.",
  },
  {
    id: 2,
    author: "Sara Khan",
    rating: 5,
    date: "August 28, 2026",
    comment:
      "Solid stainless steel feel. Installation was quick and all fitting accessories were provided.",
  },
  {
    id: 3,
    author: "Usman Tariq",
    rating: 4,
    date: "August 15, 2026",
    comment:
      "Good value for money. Delivery was fast and packing was secure.",
  },
];

/* ============================================================
   PRODUCTS COMPONENT
   ============================================================ */

export default function Products({ onAddToCart }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchQuery = searchParams.get("search") || "";

  const modalScrollRef = useRef(null);

  const [selectedSizes, setSelectedSizes] = useState({});

  const [selectedProduct, setSelectedProduct] = useState(null);

  const [activeSize, setActiveSize] = useState("");

  const [itemQuantity, setItemQuantity] = useState(1);

  const [zoomStyle, setZoomStyle] = useState({
    transformOrigin: "center center",
    transform: "scale(1)",
  });

  const [isHovered, setIsHovered] = useState(false);

  const [carouselIndex, setCarouselIndex] = useState(0);

  /* ============================================================
     SIZE SELECT
     ============================================================ */

  const handleSizeSelect = (productId, size, e) => {
    if (e) e.stopPropagation();

    setSelectedSizes((prev) => ({
      ...prev,
      [productId]: size,
    }));
  };

  /* ============================================================
     ADD TO CART
     ============================================================ */

  const handleAddToCart = (product, e) => {
    if (e) e.stopPropagation();

    const size =
      (selectedProduct?.productId === product.productId
        ? activeSize
        : selectedSizes[product.productId]) ||
      product.defaultSize ||
      "Standard";

    const cartItem = {
      id: `${product.productId}-${size}`,
      productId: product.productId,
      name: `${product.name} (${size})`,
      price: product.salePrice || product.price,
      image: product.image,
      material: product.material,
      quantity:
        selectedProduct?.productId === product.productId
          ? itemQuantity
          : 1,
    };

    if (onAddToCart) {
      onAddToCart(cartItem);
    }
  };

  /* ============================================================
     OPEN PRODUCT DETAIL
     ============================================================ */

  const openProductDetail = (product) => {
    setSelectedProduct(product);

    setActiveSize(
      selectedSizes[product.productId] ||
        product.defaultSize ||
        "Standard"
    );

    setItemQuantity(1);

    setCarouselIndex(0);

    setIsHovered(false);

    if (modalScrollRef.current) {
      modalScrollRef.current.scrollTop = 0;
    }
  };

  /* ============================================================
     CLOSE PRODUCT DETAIL
     ============================================================ */

  const closeProductDetail = () => {
    setSelectedProduct(null);
  };

  /* ============================================================
     CLEAR SEARCH
     ============================================================ */

  const clearSearch = () => {
    searchParams.delete("search");
    setSearchParams(searchParams);
  };

  /* ============================================================
     IMAGE ZOOM
     ============================================================ */

  const handleMouseMove = (e) => {
    const {
      left,
      top,
      width,
      height,
    } = e.currentTarget.getBoundingClientRect();

    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(2.2)",
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);

    setZoomStyle({
      transformOrigin: "center center",
      transform: "scale(1)",
    });
  };

  /* ============================================================
     FILTER PRODUCTS
     ============================================================ */

  const filteredProducts = featuredProducts.filter(
    (product) =>
      product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      product.category
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      product.sku
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  /* ============================================================
     RELATED PRODUCTS
     ============================================================ */

  const relatedProducts = featuredProducts.filter(
    (p) => p.productId !== selectedProduct?.productId
  );

  const nextRelated = () => {
    if (carouselIndex < relatedProducts.length - 1) {
      setCarouselIndex((prev) => prev + 1);
    } else {
      setCarouselIndex(0);
    }
  };

  const prevRelated = () => {
    if (carouselIndex > 0) {
      setCarouselIndex((prev) => prev - 1);
    } else {
      setCarouselIndex(relatedProducts.length - 1);
    }
  };

  /* ============================================================
     RETURN
     ============================================================ */

  return (
    <section
      id="products"
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-gradient-to-br
        from-white
        via-[#eef6ff]
        to-[#dfeefa]
        pt-20
        sm:pt-16
        lg:pt-20
      "
    >
      {/* ========================================================
          BACKGROUND GLOWS
      ======================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -top-72
          left-1/2
          h-[700px]
          w-[1100px]
          -translate-x-1/2
          rounded-full
          bg-[#b8d9f5]/45
          blur-[140px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -right-60
          top-1/4
          h-[550px]
          w-[550px]
          rounded-full
          bg-[#8fc3ed]/20
          blur-[130px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          bottom-[-180px]
          right-[-120px]
          h-[500px]
          w-[500px]
          rounded-full
          bg-[#d4af37]/10
          blur-[130px]
        "
      />

      {/* ========================================================
          GRID BACKGROUND
      ======================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-[0.025]
          bg-[linear-gradient(to_right,#173b68_1px,transparent_1px),linear-gradient(to_bottom,#173b68_1px,transparent_1px)]
          bg-[size:80px_80px]
        "
      />

      {/* ========================================================
          HEADER
      ======================================================== */}

      <div
        className="
          relative
          z-10
          mx-auto
          max-w-7xl
          px-3
          text-center
          sm:px-8
          lg:px-12
        "
      >
        {/* Collection Label */}

        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.3,
          }}
          transition={{
            duration: 0.8,
          }}
          className="
            mb-4
            flex
            items-center
            justify-center
            gap-2
            sm:mb-6
            sm:gap-4
          "
        >
          <span
            className="
              h-px
              w-6
              bg-[#c7a52d]/70
              sm:w-10
            "
          />

          <span
            className="
              text-[8px]
              font-semibold
              uppercase
              tracking-[0.3em]
              text-[#173b68]
              sm:text-[10px]
              sm:tracking-[0.4em]
            "
          >
            Rambo Collection
          </span>

          <span
            className="
              h-px
              w-6
              bg-[#c7a52d]/70
              sm:w-10
            "
          />
        </motion.div>

        {/* ======================================================
            MAIN HEADING
            MOBILE: BATH ACCESSORIES MUST STAY ON ONE LINE
        ======================================================= */}

        <motion.h2
          initial={{
            opacity: 0,
            y: 25,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.3,
          }}
          transition={{
            duration: 0.9,
            delay: 0.1,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            whitespace-nowrap
            leading-none
            tracking-[-0.03em]
          "
          style={{
            fontFamily:
              "'Brush Script MT', 'Segoe Script', cursive",
            fontWeight: 400,
          }}
        >
          {/* BATH */}

          <motion.span
            className="
              inline-block
              text-[2rem]
              text-[#173b68]
              sm:text-6xl
              md:text-7xl
              lg:text-8xl
              xl:text-9xl
            "
            initial={{
              opacity: 0,
              x: -30,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.8,
              delay: 0.25,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            Bath
          </motion.span>

          {" "}

          {/* ACCESSORIES */}

          <motion.span
            className="
              inline-block
              text-[2rem]
              text-[#173b68]
              sm:text-6xl
              md:text-7xl
              lg:text-8xl
              xl:text-9xl
            "
            initial={{
              opacity: 0,
              x: 30,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.8,
              delay: 0.4,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            Accessories
          </motion.span>
        </motion.h2>

        {/* ======================================================
            FLOOR WASTE
        ======================================================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.8,
            delay: 0.65,
          }}
          className="
            mt-2
            text-lg
            font-light
            italic
            tracking-tight
            text-[#173b68]/80
            sm:text-2xl
            md:text-3xl
            lg:text-4xl
          "
        >
          &amp; Floor Waste
        </motion.div>

        {/* GOLD UNDERLINE */}

        <motion.div
          initial={{
            opacity: 0,
            scaleX: 0,
          }}
          whileInView={{
            opacity: 1,
            scaleX: 1,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.8,
            delay: 0.8,
          }}
          className="
            mx-auto
            mt-5
            h-[2px]
            w-20
            origin-center
            bg-gradient-to-r
            from-transparent
            via-[#c7a52d]
            to-transparent
            sm:mt-6
            sm:w-24
          "
        />

        {/* SEARCH RESULT */}

        {searchQuery && (
          <motion.div
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="
              mt-6
              inline-flex
              max-w-[90%]
              items-center
              gap-2
              rounded-full
              border
              border-[#173b68]/20
              bg-white/80
              px-4
              py-1.5
              text-xs
              text-[#173b68]
              shadow-sm
              backdrop-blur-md
            "
          >
            <span>
              Showing results for:{" "}
              <strong className="text-[#c7a52d]">
                "{searchQuery}"
              </strong>
            </span>

            <button
              onClick={clearSearch}
              className="
                ml-1
                rounded-full
                p-1
                transition-colors
                hover:bg-slate-200
              "
              title="Clear search"
            >
              <X size={12} />
            </button>
          </motion.div>
        )}
      </div>

      {/* ============================================================
          PRODUCT CATALOGUE GRID
      ============================================================ */}

      <div
        className="
          relative
          z-10
          mx-auto
          mt-7
          max-w-7xl
          px-3
          pb-20
          sm:mt-10
          sm:px-8
          lg:mt-12
          lg:px-12
        "
      >
        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-lg font-medium text-[#173b68]">
              No products found matching "{searchQuery}"
            </p>

            <button
              onClick={clearSearch}
              className="
                mt-4
                rounded-xl
                bg-[#173b68]
                px-5
                py-2
                text-xs
                font-bold
                text-white
                transition-all
                hover:bg-[#0f2847]
              "
            >
              View All Products
            </button>
          </div>
        ) : (
          <div
            className="
              grid
              grid-cols-2
              gap-3
              sm:grid-cols-2
              sm:gap-6
              lg:grid-cols-4
            "
          >
            {filteredProducts.map((product, index) => {
              const selectedSize =
                selectedSizes[product.productId] ||
                product.defaultSize ||
                "Standard";

              return (
                <motion.article
                  key={product.productId}
                  initial={{
                    opacity: 0,
                    y: 30,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.2,
                  }}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  onClick={() =>
                    openProductDetail(product)
                  }
                  className="
                    group
                    flex
                    cursor-pointer
                    flex-col
                    justify-between
                    rounded-xl
                    border
                    border-[#173b68]/10
                    bg-white/90
                    p-2.5
                    shadow-xl
                    shadow-[#173b68]/5
                    backdrop-blur-sm
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:border-[#c7a52d]/50
                    hover:shadow-2xl
                    hover:shadow-[#173b68]/10
                    sm:rounded-2xl
                    sm:p-4
                  "
                >
                  <div>
                    {/* IMAGE */}

                    <div
                      className="
                        relative
                        aspect-square
                        w-full
                        overflow-hidden
                        rounded-lg
                        bg-gradient-to-br
                        from-[#f8fbff]
                        to-[#e6f0f8]
                        p-2
                        sm:rounded-xl
                        sm:p-4
                      "
                    >
                      {/* SKU */}

                      <div
                        className="
                          absolute
                          left-2
                          top-2
                          z-20
                          sm:left-3
                          sm:top-3
                        "
                      >
                        <span
                          className="
                            rounded-md
                            bg-[#173b68]
                            px-1.5
                            py-1
                            text-[8px]
                            font-bold
                            text-white
                            shadow-sm
                            sm:px-2
                            sm:text-[10px]
                          "
                        >
                          {product.sku}
                        </span>
                      </div>

                      {/* MATERIAL */}

                      <div
                        className="
                          absolute
                          right-2
                          top-2
                          z-20
                          max-w-[65%]
                          sm:right-3
                          sm:top-3
                        "
                      >
                        <span
                          className="
                            block
                            truncate
                            rounded-full
                            border
                            border-[#c7a52d]/30
                            bg-white/90
                            px-1.5
                            py-0.5
                            text-[7px]
                            font-semibold
                            text-[#173b68]
                            shadow-sm
                            backdrop-blur-md
                            sm:px-2.5
                            sm:py-0.5
                            sm:text-[9px]
                          "
                        >
                          {product.material}
                        </span>
                      </div>

                      <motion.img
                        src={product.image}
                        alt={product.name}
                        className="
                          h-full
                          w-full
                          object-contain
                          transition-transform
                          duration-500
                          group-hover:scale-105
                        "
                      />
                    </div>

                    {/* RATING / STOCK */}

                    <div
                      className="
                        mt-2
                        flex
                        items-center
                        justify-between
                        gap-1
                        px-0.5
                        sm:mt-3
                        sm:px-1
                      "
                    >
                      <div className="flex items-center gap-0.5 sm:gap-1">
                        <Star
                          size={11}
                          className="
                            fill-[#c7a52d]
                            text-[#c7a52d]
                            sm:h-[13px]
                            sm:w-[13px]
                          "
                        />

                        <span
                          className="
                            text-[10px]
                            font-bold
                            text-slate-700
                            sm:text-xs
                          "
                        >
                          {product.rating}
                        </span>

                        <span
                          className="
                            text-[8px]
                            text-slate-400
                            sm:text-[10px]
                          "
                        >
                          ({product.reviewsCount})
                        </span>
                      </div>

                      <span
                        className={`
                          text-[7px]
                          font-bold
                          uppercase
                          tracking-wide
                          sm:text-[10px]
                          sm:tracking-wider
                          ${
                            product.availability ===
                            "In Stock"
                              ? "text-emerald-600"
                              : "text-rose-500"
                          }
                        `}
                      >
                        {product.availability}
                      </span>
                    </div>

                    {/* PRODUCT TITLE */}

                    <h3
                      className="
                        mt-1
                        truncate
                        text-sm
                        font-bold
                        text-[#173b68]
                        transition-colors
                        group-hover:text-[#b28d16]
                        sm:mt-2
                        sm:text-base
                      "
                    >
                      {product.name}
                    </h3>

                    {/* PRICE */}

                    <div
                      className="
                        mt-1
                        flex
                        flex-wrap
                        items-baseline
                        gap-1
                        sm:gap-2
                      "
                    >
                      <span
                        className="
                          text-base
                          font-extrabold
                          text-[#173b68]
                          sm:text-xl
                        "
                      >
                        Rs.{" "}
                        {product.salePrice.toLocaleString()}
                      </span>

                      {product.salePrice <
                        product.price && (
                        <span
                          className="
                            text-[9px]
                            text-slate-400
                            line-through
                            sm:text-xs
                          "
                        >
                          Rs.{" "}
                          {product.price.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* ACTION BUTTONS */}

                  <div
                    className="
                      mt-3
                      flex
                      items-center
                      gap-2
                      sm:mt-5
                    "
                  >
                    <button
                      onClick={(e) => {
                        handleAddToCart(product, e);
                        openProductDetail(product);
                      }}
                      className="
                        flex-1
                        rounded-lg
                        bg-[#173b68]
                        py-2.5
                        text-[10px]
                        font-bold
                        text-white
                        transition-all
                        hover:bg-[#0f2847]
                        hover:shadow-lg
                        active:scale-[0.98]
                        sm:rounded-xl
                        sm:py-2.5
                        sm:text-xs
                      "
                    >
                      Buy Now
                    </button>

                    <button
                      onClick={(e) =>
                        handleAddToCart(product, e)
                      }
                      aria-label="Add to Cart"
                      className="
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        border
                        border-slate-200
                        bg-slate-100
                        text-[#173b68]
                        transition-all
                        hover:bg-[#173b68]
                        hover:text-white
                        active:scale-95
                        sm:rounded-xl
                      "
                    >
                      <ShoppingCart size={15} />
                    </button>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>

      {/* ============================================================
          PRODUCT DETAIL MODAL
      ============================================================ */}

      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            className="
              fixed
              inset-0
              z-50
              flex
              items-center
              justify-center
              overflow-y-auto
              bg-black/60
              p-2
              backdrop-blur-md
              sm:p-4
            "
          >
            <motion.div
              ref={modalScrollRef}
              initial={{
                scale: 0.95,
                opacity: 0,
                y: 20,
              }}
              animate={{
                scale: 1,
                opacity: 1,
                y: 0,
              }}
              exit={{
                scale: 0.95,
                opacity: 0,
                y: 20,
              }}
              className="
                relative
                my-2
                max-h-[94vh]
                w-full
                max-w-5xl
                overflow-y-auto
                rounded-2xl
                border
                border-white/20
                bg-white
                p-4
                shadow-2xl
                sm:my-8
                sm:rounded-3xl
                sm:p-8
                lg:p-10
              "
            >
              {/* CLOSE */}

              <button
                onClick={closeProductDetail}
                className="
                  absolute
                  right-3
                  top-3
                  z-30
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  bg-slate-100
                  text-slate-600
                  transition-colors
                  hover:bg-slate-200
                  hover:text-slate-900
                  sm:right-5
                  sm:top-5
                  sm:h-10
                  sm:w-10
                "
              >
                <X size={19} />
              </button>

              <div
                className="
                  grid
                  grid-cols-1
                  gap-5
                  sm:gap-8
                  lg:grid-cols-2
                "
              >
                {/* ====================================================
                    PRODUCT IMAGE
                ===================================================== */}

                <div className="flex flex-col items-center">
                  <div
                    onMouseMove={handleMouseMove}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    className="
                      relative
                      aspect-square
                      w-full
                      cursor-zoom-in
                      overflow-hidden
                      rounded-xl
                      border
                      border-slate-100
                      bg-gradient-to-br
                      from-[#f8fbff]
                      to-[#e6f0f8]
                      p-3
                      shadow-inner
                      sm:rounded-2xl
                      sm:p-6
                    "
                  >
                    <div
                      className="
                        absolute
                        left-2
                        top-2
                        z-10
                        flex
                        max-w-[90%]
                        gap-1
                        sm:left-4
                        sm:top-4
                        sm:gap-2
                      "
                    >
                      <span
                        className="
                          rounded-md
                          bg-[#173b68]
                          px-2
                          py-1
                          text-[9px]
                          font-bold
                          text-white
                          shadow-sm
                          sm:px-2.5
                          sm:text-xs
                        "
                      >
                        SKU: {selectedProduct.sku}
                      </span>

                      <span
                        className="
                          rounded-md
                          bg-emerald-600
                          px-2
                          py-1
                          text-[9px]
                          font-bold
                          text-white
                          shadow-sm
                          sm:px-2.5
                          sm:text-xs
                        "
                      >
                        {selectedProduct.availability}
                      </span>
                    </div>

                    <div className="h-full w-full overflow-hidden">
                      <img
                        src={selectedProduct.image}
                        alt={selectedProduct.name}
                        style={{
                          transformOrigin:
                            zoomStyle.transformOrigin,
                          transform: isHovered
                            ? zoomStyle.transform
                            : "scale(1)",
                        }}
                        className="
                          h-full
                          w-full
                          object-contain
                          transition-transform
                          duration-150
                          ease-out
                        "
                      />
                    </div>

                    <div
                      className="
                        pointer-events-none
                        absolute
                        bottom-2
                        left-1/2
                        -translate-x-1/2
                        rounded-full
                        bg-slate-900/60
                        px-2
                        py-1
                        text-[8px]
                        text-white
                        backdrop-blur-sm
                        sm:bottom-3
                        sm:px-3
                        sm:text-[10px]
                      "
                    >
                      Hover image to zoom
                    </div>
                  </div>

                  {/* VALUE HIGHLIGHTS */}

                  <div
                    className="
                      mt-4
                      grid
                      grid-cols-3
                      gap-2
                      text-center
                      sm:mt-6
                      sm:gap-3
                    "
                  >
                    <div
                      className="
                        flex
                        flex-col
                        items-center
                        rounded-xl
                        border
                        border-slate-100
                        bg-slate-50
                        p-2
                        sm:p-3
                      "
                    >
                      <Truck
                        size={16}
                        className="text-[#173b68]"
                      />

                      <span
                        className="
                          mt-1
                          text-[8px]
                          font-semibold
                          text-slate-700
                          sm:text-[11px]
                        "
                      >
                        Fast Delivery
                      </span>
                    </div>

                    <div
                      className="
                        flex
                        flex-col
                        items-center
                        rounded-xl
                        border
                        border-slate-100
                        bg-slate-50
                        p-2
                        sm:p-3
                      "
                    >
                      <ShieldCheck
                        size={16}
                        className="text-[#173b68]"
                      />

                      <span
                        className="
                          mt-1
                          text-[8px]
                          font-semibold
                          text-slate-700
                          sm:text-[11px]
                        "
                      >
                        1 Year Warranty
                      </span>
                    </div>

                    <div
                      className="
                        flex
                        flex-col
                        items-center
                        rounded-xl
                        border
                        border-slate-100
                        bg-slate-50
                        p-2
                        sm:p-3
                      "
                    >
                      <RotateCcw
                        size={16}
                        className="text-[#173b68]"
                      />

                      <span
                        className="
                          mt-1
                          text-[8px]
                          font-semibold
                          text-slate-700
                          sm:text-[11px]
                        "
                      >
                        Easy Returns
                      </span>
                    </div>
                  </div>
                </div>

                {/* ====================================================
                    PRODUCT DETAILS
                ===================================================== */}

                <div className="flex flex-col justify-between">
                  <div>
                    <div
                      className="
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-wider
                        text-[#c7a52d]
                        sm:text-xs
                      "
                    >
                      {selectedProduct.category} •{" "}
                      {selectedProduct.subcategory}
                    </div>

                    <h1
                      className="
                        mt-1
                        text-2xl
                        font-extrabold
                        text-[#173b68]
                        sm:text-4xl
                      "
                    >
                      {selectedProduct.name}
                    </h1>

                    {/* RATING */}

                    <div className="mt-3 flex items-center gap-2">
                      <div className="flex items-center text-[#c7a52d]">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={15}
                            className={
                              i <
                              Math.floor(
                                selectedProduct.rating
                              )
                                ? "fill-[#c7a52d]"
                                : "text-slate-300"
                            }
                          />
                        ))}
                      </div>

                      <span className="text-sm font-bold text-slate-800">
                        {selectedProduct.rating}
                      </span>

                      <span className="text-[10px] text-slate-400 sm:text-xs">
                        ({selectedProduct.reviewsCount}{" "}
                        customer reviews)
                      </span>
                    </div>

                    {/* PRICE */}

                    <div
                      className="
                        mt-4
                        flex
                        flex-wrap
                        items-baseline
                        gap-2
                        sm:gap-3
                      "
                    >
                      <span
                        className="
                          text-2xl
                          font-extrabold
                          text-[#173b68]
                          sm:text-3xl
                        "
                      >
                        Rs.{" "}
                        {selectedProduct.salePrice.toLocaleString()}
                      </span>

                      {selectedProduct.salePrice <
                        selectedProduct.price && (
                        <span
                          className="
                            text-sm
                            text-slate-400
                            line-through
                            sm:text-base
                          "
                        >
                          Rs.{" "}
                          {selectedProduct.price.toLocaleString()}
                        </span>
                      )}

                      <span
                        className="
                          rounded-md
                          bg-emerald-100
                          px-2
                          py-0.5
                          text-[10px]
                          font-bold
                          text-emerald-800
                        "
                      >
                        Save Rs.{" "}
                        {(
                          selectedProduct.price -
                          selectedProduct.salePrice
                        ).toLocaleString()}
                      </span>
                    </div>

                    <p
                      className="
                        mt-4
                        text-sm
                        leading-relaxed
                        text-slate-600
                      "
                    >
                      {selectedProduct.description}
                    </p>

                    {/* SPECIFICATIONS */}

                    <div
                      className="
                        mt-5
                        rounded-xl
                        border
                        border-slate-100
                        bg-slate-50/80
                        p-3
                        sm:p-4
                      "
                    >
                      <h4
                        className="
                          text-[10px]
                          font-bold
                          uppercase
                          tracking-wider
                          text-[#173b68]
                          sm:text-xs
                        "
                      >
                        Technical Specifications
                      </h4>

                      <div
                        className="
                          mt-2
                          grid
                          grid-cols-2
                          gap-y-2
                          text-[10px]
                          text-slate-600
                          sm:text-xs
                        "
                      >
                        <div>
                          <strong className="text-slate-800">
                            Material:
                          </strong>{" "}
                          {selectedProduct.material}
                        </div>

                        <div>
                          <strong className="text-slate-800">
                            Finish:
                          </strong>{" "}
                          {selectedProduct.finish}
                        </div>

                        <div>
                          <strong className="text-slate-800">
                            Color:
                          </strong>{" "}
                          {selectedProduct.color}
                        </div>

                        <div>
                          <strong className="text-slate-800">
                            Stock:
                          </strong>{" "}
                          {selectedProduct.stockQuantity} units
                          left
                        </div>
                      </div>
                    </div>

                    {/* QUANTITY */}

                    <div className="mt-6">
                      <label
                        className="
                          text-[10px]
                          font-bold
                          uppercase
                          tracking-wider
                          text-slate-700
                        "
                      >
                        Quantity:
                      </label>

                      <div className="mt-2 flex items-center gap-3">
                        <div
                          className="
                            flex
                            items-center
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            shadow-sm
                          "
                        >
                          <button
                            onClick={() =>
                              setItemQuantity((q) =>
                                Math.max(1, q - 1)
                              )
                            }
                            className="
                              px-3
                              py-1.5
                              text-sm
                              font-bold
                              text-slate-600
                              hover:bg-slate-100
                            "
                          >
                            -
                          </button>

                          <span
                            className="
                              w-10
                              text-center
                              text-sm
                              font-bold
                              text-[#173b68]
                            "
                          >
                            {itemQuantity}
                          </span>

                          <button
                            onClick={() =>
                              setItemQuantity(
                                (q) => q + 1
                              )
                            }
                            className="
                              px-3
                              py-1.5
                              text-sm
                              font-bold
                              text-slate-600
                              hover:bg-slate-100
                            "
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ADD TO CART */}

                  <div className="mt-6 sm:mt-8">
                    <button
                      onClick={() =>
                        handleAddToCart(selectedProduct)
                      }
                      className="
                        w-full
                        rounded-2xl
                        bg-[#173b68]
                        py-3.5
                        text-sm
                        font-bold
                        text-white
                        transition-all
                        hover:bg-[#0f2847]
                        hover:shadow-xl
                        active:scale-[0.98]
                      "
                    >
                      Add To Cart{" "}
                      (Rs.{" "}
                      {(
                        selectedProduct.salePrice *
                        itemQuantity
                      ).toLocaleString()}
                      )
                    </button>
                  </div>
                </div>
              </div>

              <hr className="my-8 border-slate-200 sm:my-10" />

              {/* ====================================================
                  CUSTOMER REVIEWS
              ===================================================== */}

              <div>
                <h3
                  className="
                    text-lg
                    font-bold
                    text-[#173b68]
                    sm:text-xl
                  "
                >
                  Customer Reviews &amp; Ratings
                </h3>

                <div
                  className="
                    mt-5
                    grid
                    grid-cols-1
                    gap-5
                    sm:mt-6
                    sm:gap-8
                    md:grid-cols-3
                  "
                >
                  {/* RATING BREAKDOWN */}

                  <div
                    className="
                      rounded-2xl
                      border
                      border-slate-100
                      bg-slate-50
                      p-4
                      sm:p-5
                    "
                  >
                    <div
                      className="
                        text-3xl
                        font-extrabold
                        text-[#173b68]
                      "
                    >
                      {selectedProduct.rating}
                    </div>

                    <div className="mt-1 flex items-center text-[#c7a52d]">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={
                            i <
                            Math.floor(
                              selectedProduct.rating
                            )
                              ? "fill-[#c7a52d]"
                              : "text-slate-300"
                          }
                        />
                      ))}
                    </div>

                    <p className="mt-1 text-xs text-slate-500">
                      Based on{" "}
                      {selectedProduct.reviewsCount} reviews
                    </p>

                    <div className="mt-4 space-y-2">
                      {[
                        {
                          stars: "5 Stars",
                          percentage: "80%",
                        },
                        {
                          stars: "4 Stars",
                          percentage: "15%",
                        },
                        {
                          stars: "3 Stars",
                          percentage: "3%",
                        },
                        {
                          stars: "2 Stars",
                          percentage: "1%",
                        },
                        {
                          stars: "1 Stars",
                          percentage: "1%",
                        },
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          className="
                            flex
                            items-center
                            gap-2
                            text-xs
                            text-slate-600
                          "
                        >
                          <span className="w-12">
                            {item.stars}
                          </span>

                          <div
                            className="
                              h-2
                              flex-1
                              overflow-hidden
                              rounded-full
                              bg-slate-200
                            "
                          >
                            <div
                              className="
                                h-full
                                bg-[#c7a52d]
                              "
                              style={{
                                width: item.percentage,
                              }}
                            />
                          </div>

                          <span
                            className="
                              w-8
                              text-right
                              text-[10px]
                              text-slate-400
                            "
                          >
                            {item.percentage}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* REVIEWS */}

                  <div
                    className="
                      space-y-4
                      md:col-span-2
                    "
                  >
                    {mockReviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="
                          rounded-2xl
                          border
                          border-slate-100
                          bg-slate-50/50
                          p-4
                        "
                      >
                        <div
                          className="
                            flex
                            items-center
                            justify-between
                            gap-2
                          "
                        >
                          <div
                            className="
                              flex
                              items-center
                              gap-3
                            "
                          >
                            <div
                              className="
                                flex
                                h-8
                                w-8
                                shrink-0
                                items-center
                                justify-center
                                rounded-full
                                bg-[#173b68]
                                text-xs
                                font-bold
                                text-white
                              "
                            >
                              {rev.author.charAt(0)}
                            </div>

                            <div>
                              <h4
                                className="
                                  text-xs
                                  font-bold
                                  text-slate-800
                                "
                              >
                                {rev.author}
                              </h4>

                              <p
                                className="
                                  text-[10px]
                                  text-slate-400
                                "
                              >
                                {rev.date}
                              </p>
                            </div>
                          </div>

                          <div className="flex text-[#c7a52d]">
                            {[...Array(rev.rating)].map(
                              (_, i) => (
                                <Star
                                  key={i}
                                  size={12}
                                  className="fill-[#c7a52d]"
                                />
                              )
                            )}
                          </div>
                        </div>

                        <p
                          className="
                            mt-2
                            text-xs
                            leading-relaxed
                            text-slate-600
                          "
                        >
                          {rev.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <hr className="my-8 border-slate-200 sm:my-10" />

              {/* ====================================================
                  RELATED PRODUCTS
              ===================================================== */}

              <div>
                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-3
                  "
                >
                  <h3
                    className="
                      text-lg
                      font-bold
                      text-[#173b68]
                      sm:text-xl
                    "
                  >
                    Related Products
                  </h3>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={prevRelated}
                      className="
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-slate-200
                        text-slate-600
                        transition-colors
                        hover:bg-[#173b68]
                        hover:text-white
                        sm:h-9
                        sm:w-9
                      "
                    >
                      <ChevronLeft size={17} />
                    </button>

                    <button
                      onClick={nextRelated}
                      className="
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-slate-200
                        text-slate-600
                        transition-colors
                        hover:bg-[#173b68]
                        hover:text-white
                        sm:h-9
                        sm:w-9
                      "
                    >
                      <ChevronRight size={17} />
                    </button>
                  </div>
                </div>

                <div className="mt-5 overflow-hidden sm:mt-6">
                  <motion.div
                    animate={{
                      x: -carouselIndex * 260,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                    className="flex gap-4"
                  >
                    {relatedProducts.map(
                      (relProduct) => (
                        <div
                          key={relProduct.productId}
                          onClick={() =>
                            openProductDetail(relProduct)
                          }
                          className="
                            group
                            flex
                            w-60
                            shrink-0
                            cursor-pointer
                            flex-col
                            justify-between
                            rounded-2xl
                            border
                            border-slate-100
                            bg-slate-50/50
                            p-3
                            transition-all
                            hover:border-[#c7a52d]/50
                            hover:bg-white
                            hover:shadow-lg
                          "
                        >
                          <div>
                            <div
                              className="
                                relative
                                aspect-square
                                w-full
                                overflow-hidden
                                rounded-xl
                                bg-white
                                p-2
                              "
                            >
                              <span
                                className="
                                  absolute
                                  left-2
                                  top-2
                                  z-10
                                  rounded-md
                                  bg-[#173b68]
                                  px-2
                                  py-0.5
                                  text-[9px]
                                  font-bold
                                  text-white
                                  shadow-sm
                                "
                              >
                                {relProduct.sku}
                              </span>

                              <img
                                src={relProduct.image}
                                alt={relProduct.name}
                                className="
                                  h-full
                                  w-full
                                  object-contain
                                  transition-transform
                                  duration-300
                                  group-hover:scale-105
                                "
                              />
                            </div>

                            <h4
                              className="
                                mt-2
                                text-xs
                                font-bold
                                text-[#173b68]
                                group-hover:text-[#c7a52d]
                              "
                            >
                              {relProduct.name}
                            </h4>

                            <div
                              className="
                                mt-1
                                flex
                                items-center
                                justify-between
                              "
                            >
                              <span
                                className="
                                  text-xs
                                  font-extrabold
                                  text-[#173b68]
                                "
                              >
                                Rs.{" "}
                                {relProduct.salePrice.toLocaleString()}
                              </span>

                              <span
                                className="
                                  text-[10px]
                                  font-semibold
                                  text-slate-400
                                "
                              >
                                {relProduct.sku}
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openProductDetail(relProduct);
                            }}
                            className="
                              mt-3
                              w-full
                              rounded-xl
                              bg-[#173b68]
                              py-2
                              text-center
                              text-xs
                              font-bold
                              text-white
                              transition-all
                              hover:bg-[#0f2847]
                            "
                          >
                            View Details
                          </button>
                        </div>
                      )
                    )}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}