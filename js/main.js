document.addEventListener('DOMContentLoaded', () => {
    // Simple mock functionality for sliders
    const dots = document.querySelectorAll('.slider-dots .dot');
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            const activeDot = document.querySelector('.slider-dots .active');
            if (activeDot) activeDot.classList.remove('active');
            dot.classList.add('active');
        });
    });

    const prevHeroBtn = document.querySelector('.hero .prev');
    const nextHeroBtn = document.querySelector('.hero .next');

    if(prevHeroBtn && nextHeroBtn) {
        prevHeroBtn.addEventListener('click', () => {
            console.log('Previous slide');
        });
        nextHeroBtn.addEventListener('click', () => {
            console.log('Next slide');
        });
    }

    // Products Carousel mock functionality
    const prevProdBtn = document.querySelector('.productos-carousel-container .prev');
    const nextProdBtn = document.querySelector('.productos-carousel-container .next');
    const prodGrid = document.querySelector('.productos-grid');

    if(prevProdBtn && nextProdBtn && prodGrid) {
        prevProdBtn.addEventListener('click', () => {
            prodGrid.scrollBy({ left: -200, behavior: 'smooth' });
        });
        nextProdBtn.addEventListener('click', () => {
            prodGrid.scrollBy({ left: 200, behavior: 'smooth' });
        });
    }

    // Dropdown toggle mobile
    const dropdownToggles = document.querySelectorAll('.dropdown > a');
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const menu = toggle.nextElementSibling;
                if (menu && menu.classList.contains('dropdown-menu')) {
                    menu.classList.toggle('show');
                }
            }
        });
    });

    // Close dropdowns when clicking outside or on a dropdown item
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown') || e.target.closest('.dropdown-menu a')) {
            document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
                menu.classList.remove('show');
            });
        }
    });

    // Product Database (for modal detail visualization)
    const productsData = {
        'sofa': {
            category: 'MUEBLES',
            title: 'Sofá Moderno',
            price: '$450.00',
            img: 'images/sofa_1782182122883.png',
            reviews: '(24 reseñas)',
            desc: 'Sofá moderno de 3 plazas con diseño minimalista, ideal para cualquier espacio de tu hogar. Fabricado con materiales de alta resistencia y confort.',
            features: [
                '<i class="fas fa-tag"></i> Material: Tela de alta calidad',
                '<i class="fas fa-ruler-combined"></i> Dimensiones: 180cm (Ancho) x 85cm (Prof.) x 75cm (Alto)',
                '<i class="fas fa-palette"></i> Colores disponibles: Beige, Gris',
                '<i class="fas fa-truck"></i> Envío: 3-5 días hábiles',
                '<i class="fas fa-info-circle"></i> Garantía: 1 año'
            ]
        },
        'comedor': {
            category: 'MUEBLES',
            title: 'Juego de Comedor',
            price: '$650.00',
            img: 'images/comedor_1782182137437.png',
            reviews: '(15 reseñas)',
            desc: 'Elegante juego de comedor de madera sólida con capacidad para 6 personas. Sillas acolchadas para mayor comodidad durante tus comidas.',
            features: [
                '<i class="fas fa-tag"></i> Material: Madera de roble y tapizado',
                '<i class="fas fa-users"></i> Capacidad: 6 puestos',
                '<i class="fas fa-truck"></i> Envío: 5-7 días hábiles',
                '<i class="fas fa-info-circle"></i> Garantía: 2 años'
            ]
        },
        'florero': {
            category: 'DECORACIÓN',
            title: 'Florero Decorativo',
            price: '$35.00',
            img: 'images/florero_1782182149891.png',
            reviews: '(42 reseñas)',
            desc: 'Florero de cerámica con diseño texturizado mate. Perfecto para flores secas o ramas decorativas. Aporta un toque elegante a cualquier mesa o repisa.',
            features: [
                '<i class="fas fa-tag"></i> Material: Cerámica',
                '<i class="fas fa-ruler-combined"></i> Altura: 25cm',
                '<i class="fas fa-truck"></i> Envío: 1-2 días hábiles'
            ]
        },
        'vasos': {
            category: 'DESECHABLES',
            title: 'Vasos Plásticos 16 oz',
            price: 'RD$ 150.00',
            img: 'images/vasos.png',
            reviews: '(120 reseñas)',
            desc: 'Paquete de vasos transparentes desechables, ideales para bebidas frías en fiestas, negocios o eventos al aire libre.',
            features: [
                '<i class="fas fa-tag"></i> Material: Plástico PET reciclable',
                '<i class="fas fa-box"></i> Cantidad: 50 unidades por paquete',
                '<i class="fas fa-glass-whiskey"></i> Capacidad: 16 onzas'
            ]
        },
        'platos': {
            category: 'DESECHABLES',
            title: 'Platos Desechables',
            price: 'RD$ 70.00',
            img: 'images/platos.png',
            reviews: '(85 reseñas)',
            desc: 'Platos redondos desechables súper resistentes, aptos para comidas calientes y frías. Perfectos para catering y eventos.',
            features: [
                '<i class="fas fa-tag"></i> Material: Cartón grueso biodegradable',
                '<i class="fas fa-box"></i> Cantidad: 20 unidades por paquete',
                '<i class="fas fa-ruler-combined"></i> Diámetro: 22cm'
            ]
        },
        'bolsas': {
            category: 'EMPAQUES',
            title: 'Bolsas Kraft',
            price: 'RD$ 25.00',
            img: 'images/bolsas.png',
            reviews: '(300 reseñas)',
            desc: 'Bolsas de papel Kraft con asas reforzadas, ecológicas y resistentes. Ideales para tiendas de ropa, regalos o entregas de comida.',
            features: [
                '<i class="fas fa-tag"></i> Material: Papel Kraft 120g',
                '<i class="fas fa-box"></i> Venta: Por unidad (descuento al mayor)',
                '<i class="fas fa-leaf"></i> 100% Reciclables y Biodegradables'
            ]
        },
        'cubiertos': {
            category: 'DESECHABLES',
            title: 'Cubiertos Plásticos',
            price: 'RD$ 110.00',
            img: 'images/cubiertos.svg',
            reviews: '(45 reseñas)',
            desc: 'Juego de cubiertos desechables de plástico resistente. Incluye cucharas, tenedores y cuchillos. Ideal para picnics y celebraciones.',
            features: [
                '<i class="fas fa-tag"></i> Material: Plástico poliestireno',
                '<i class="fas fa-box"></i> Cantidad: 24 piezas por paquete',
                '<i class="fas fa-truck"></i> Envío: 1-2 días hábiles'
            ]
        },
        'contenedores': {
            category: 'DESECHABLES',
            title: 'Contenedores con Tapa',
            price: 'RD$ 200.00',
            img: 'images/contenedor.svg',
            reviews: '(60 reseñas)',
            desc: 'Contenedor biodegradable para alimentos con tapa integrada. Mantiene el calor y previene derrames. Excelente opción para delivery y restaurantes.',
            features: [
                '<i class="fas fa-tag"></i> Material: Bagazo de caña de azúcar',
                '<i class="fas fa-box"></i> Cantidad: 10 unidades por paquete',
                '<i class="fas fa-leaf"></i> 100% Compostable y apto para microondas'
            ]
        },
        'vasos_foam': {
            category: 'DESECHABLES',
            title: 'Vasos Foam',
            price: 'RD$ 130.00',
            img: 'images/vasos_foam.svg',
            reviews: '(55 reseñas)',
            desc: 'Vasos térmicos de foam para café, té y bebidas calientes. Conservan la temperatura y evitan quemaduras.',
            features: [
                '<i class="fas fa-tag"></i> Material: Poliestireno expandido (Foam)',
                '<i class="fas fa-box"></i> Cantidad: 25 unidades por paquete',
                '<i class="fas fa-glass-whiskey"></i> Capacidad: 8 onzas'
            ]
        },
        'platos_divisiones': {
            category: 'DESECHABLES',
            title: 'Platos con Divisiones',
            price: 'RD$ 170.00',
            img: 'images/platos_divisiones.svg',
            reviews: '(35 reseñas)',
            desc: 'Platos desechables rígidos con 3 divisiones, ideales para servir almuerzos completos sin mezclar alimentos.',
            features: [
                '<i class="fas fa-tag"></i> Material: Cartón grueso impermeable',
                '<i class="fas fa-box"></i> Cantidad: 15 unidades por paquete',
                '<i class="fas fa-ruler-combined"></i> Diámetro: 26cm'
            ]
        },
        'servilletas': {
            category: 'DESECHABLES',
            title: 'Servilletas',
            price: 'RD$ 55.00',
            img: 'images/servilletas.svg',
            reviews: '(150 reseñas)',
            desc: 'Servilletas de papel absorbente de doble hoja. Ideales para el uso diario en mesa o eventos especiales.',
            features: [
                '<i class="fas fa-tag"></i> Material: Celulosa de doble hoja',
                '<i class="fas fa-box"></i> Cantidad: 100 unidades por paquete',
                '<i class="fas fa-leaf"></i> Biodegradable y suave al tacto'
            ]
        },
        'bandeja_kraft': {
            category: 'DESECHABLES',
            title: 'Bandejas para Alimentos',
            price: 'RD$ 250.00',
            img: 'images/bandeja_kraft.svg',
            reviews: '(40 reseñas)',
            desc: 'Bandejas desechables de cartón kraft resistente para catering, ideales para servir aperitivos y bocadillos en reuniones y eventos.',
            features: [
                '<i class="fas fa-tag"></i> Material: Cartón Kraft de alta densidad',
                '<i class="fas fa-box"></i> Cantidad: 10 unidades por paquete',
                '<i class="fas fa-ruler-combined"></i> Dimensiones: 32cm x 22cm'
            ]
        },
        'vaso_cafe': {
            category: 'DESECHABLES',
            title: 'Vasos de Papel para Café',
            price: 'RD$ 180.00',
            img: 'images/vaso_cafe.svg',
            reviews: '(95 reseñas)',
            desc: 'Vasos desechables de papel kraft de doble pared para bebidas calientes. Incluye tapa protectora de plástico biodegradable.',
            features: [
                '<i class="fas fa-tag"></i> Material: Papel Kraft y bioplástico',
                '<i class="fas fa-box"></i> Cantidad: 20 vasos con tapa por paquete',
                '<i class="fas fa-glass-whiskey"></i> Capacidad: 12 onzas'
            ]
        },
        'bandeja_aluminio': {
            category: 'DESECHABLES',
            title: 'Bandejas de Aluminio',
            price: 'RD$ 320.00',
            img: 'images/bandeja_aluminio.svg',
            reviews: '(30 reseñas)',
            desc: 'Bandejas rectangulares de aluminio desechables para hornear y transportar alimentos. Perfectas para catering caliente.',
            features: [
                '<i class="fas fa-tag"></i> Material: Aluminio reciclable grueso',
                '<i class="fas fa-box"></i> Cantidad: 5 unidades por paquete',
                '<i class="fas fa-ruler-combined"></i> Dimensiones: 40cm x 28cm'
            ]
        },
        'portavasos': {
            category: 'DESECHABLES',
            title: 'Portavasos de Cartón',
            price: 'RD$ 90.00',
            img: 'images/portavasos.svg',
            reviews: '(78 reseñas)',
            desc: 'Portavasos de cartón prensado con capacidad para 4 vasos de cualquier tamaño. Práctico y seguro para el transporte de bebidas.',
            features: [
                '<i class="fas fa-tag"></i> Material: Cartón prensado ecológico',
                '<i class="fas fa-box"></i> Cantidad: 10 unidades por paquete',
                '<i class="fas fa-leaf"></i> 100% Reciclable y apilable'
            ]
        }
    };

    // Modal View Trigger Logic (using Event Delegation)
    const modalOverlay = document.getElementById('product-modal');
    const modalClose = document.querySelector('.modal-close');
    
    // Modal Elements to update
    const mImg = document.getElementById('modal-img');
    const mCategory = document.getElementById('modal-category');
    const mTitle = document.getElementById('modal-title');
    const mPrice = document.getElementById('modal-price');
    const mReviewsCount = document.getElementById('modal-reviews-count');
    const mDesc = document.getElementById('modal-desc');
    const mFeatures = document.getElementById('modal-features');
    const qtyInput = document.querySelector('.qty-input');

    if (modalOverlay) {
        // Delegate click for product cards (both static on index and dynamic on store)
        document.addEventListener('click', (e) => {
            const card = e.target.closest('.producto-card, .store-card');
            if (card) {
                // Skip if clicking inside fav buttons
                if (e.target.closest('.fav-btn-card') || e.target.closest('.fav-btn')) {
                    return;
                }
                const id = card.getAttribute('data-id');
                if (id && productsData[id]) {
                    const data = productsData[id];
                    if (mImg) mImg.src = data.img;
                    if (mCategory) mCategory.textContent = data.category;
                    if (mTitle) mTitle.textContent = data.title;
                    if (mPrice) mPrice.textContent = data.price;
                    if (mReviewsCount) mReviewsCount.textContent = data.reviews;
                    if (mDesc) mDesc.textContent = data.desc;
                    
                    if (mFeatures) {
                        mFeatures.innerHTML = data.features.map(f => `<li>${f}</li>`).join('');
                    }
                    if (qtyInput) qtyInput.value = 1;

                    modalOverlay.classList.add('active');
                    document.body.style.overflow = 'hidden'; // Prevent background scrolling
                }
            }
        });

        // Close Modal via Button
        if (modalClose) {
            modalClose.addEventListener('click', () => {
                modalOverlay.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        }

        // Close Modal via Click Outside
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                modalOverlay.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
        
        // Quantity Buttons inside Modal
        const btnMinus = document.querySelector('.qty-btn.minus');
        const btnPlus = document.querySelector('.qty-btn.plus');
        
        if (btnMinus && btnPlus && qtyInput) {
            btnMinus.addEventListener('click', () => {
                let current = parseInt(qtyInput.value);
                if (current > 1) qtyInput.value = current - 1;
            });
            btnPlus.addEventListener('click', () => {
                let current = parseInt(qtyInput.value);
                qtyInput.value = current + 1;
            });
        }
    }

    // Toggle card favorite status
    document.addEventListener('click', (e) => {
        const favBtn = e.target.closest('.fav-btn-card');
        if (favBtn) {
            favBtn.classList.toggle('active');
            const heartIcon = favBtn.querySelector('i');
            if (heartIcon) {
                heartIcon.classList.toggle('fas');
                heartIcon.classList.toggle('far');
            }
        }
    });

    /* ==========================================
       DESECHABLES STORE FUNCTIONALITY
       ========================================== */
    const storeGrid = document.getElementById('store-grid');
    if (storeGrid) {
        let desechablesProductsList = [];

        const defaultDesechablesList = [
            {
                id: 'platos',
                title: 'Platos Desechables',
                price: 'RD$ 70.00',
                priceNum: 70.00,
                img: 'images/platos.png',
                subCategory: 'platos',
                material: 'carton',
                uso: ['diario', 'para llevar', 'eventos'],
                recentScore: 10,
                desc: 'Platos redondos desechables súper resistentes, aptos para comidas calientes y frías. Perfectos para catering y eventos.',
                features: [
                    '<i class="fas fa-tag"></i> Material: Cartón grueso biodegradable',
                    '<i class="fas fa-box"></i> Cantidad: 20 unidades por paquete',
                    '<i class="fas fa-ruler-combined"></i> Diámetro: 22cm'
                ]
            },
            {
                id: 'vasos',
                title: 'Vasos Plásticos 16 oz',
                price: 'RD$ 150.00',
                priceNum: 150.00,
                img: 'images/vasos.png',
                subCategory: 'vasos',
                material: 'plastico',
                uso: ['fiestas', 'eventos'],
                recentScore: 8,
                desc: 'Paquete de vasos transparentes desechables, ideales para bebidas frías en fiestas, negocios o eventos al aire libre.',
                features: [
                    '<i class="fas fa-tag"></i> Material: Plástico PET reciclable',
                    '<i class="fas fa-box"></i> Cantidad: 50 unidades por paquete',
                    '<i class="fas fa-glass-whiskey"></i> Capacidad: 16 onzas'
                ]
            },
            {
                id: 'cubiertos',
                title: 'Cubiertos Plásticos',
                price: 'RD$ 110.00',
                priceNum: 110.00,
                img: 'images/cubiertos.svg',
                subCategory: 'cubiertos',
                material: 'plastico',
                uso: ['fiestas', 'diario'],
                recentScore: 9,
                desc: 'Juego de cubiertos desechables de plástico resistente. Incluye cucharas, tenedores y cuchillos. Ideal para picnics y celebraciones.',
                features: [
                    '<i class="fas fa-tag"></i> Material: Plástico poliestireno',
                    '<i class="fas fa-box"></i> Cantidad: 24 piezas por paquete',
                    '<i class="fas fa-truck"></i> Envío: 1-2 días hábiles'
                ]
            },
            {
                id: 'contenedores',
                title: 'Contenedores con Tapa',
                price: 'RD$ 200.00',
                priceNum: 200.00,
                img: 'images/contenedor.svg',
                subCategory: 'contenedores',
                material: 'biodegradable',
                uso: ['para llevar', 'restaurantes'],
                recentScore: 7,
                desc: 'Contenedor biodegradable para alimentos con tapa integrada. Mantiene el calor y previene derrames. Excelente opción para delivery y restaurantes.',
                features: [
                    '<i class="fas fa-tag"></i> Material: Bagazo de caña de azúcar',
                    '<i class="fas fa-box"></i> Cantidad: 10 unidades por paquete',
                    '<i class="fas fa-leaf"></i> 100% Compostable y apto para microondas'
                ]
            },
            {
                id: 'vasos_foam',
                title: 'Vasos Foam',
                price: 'RD$ 130.00',
                priceNum: 130.00,
                img: 'images/vasos_foam.svg',
                subCategory: 'vasos',
                material: 'foam',
                uso: ['diario', 'para llevar'],
                recentScore: 6,
                desc: 'Vasos térmicos de foam para café, té y bebidas calientes. Conservan la temperatura y evitan quemaduras.',
                features: [
                    '<i class="fas fa-tag"></i> Material: Poliestireno expandido (Foam)',
                    '<i class="fas fa-box"></i> Cantidad: 25 unidades por paquete',
                    '<i class="fas fa-glass-whiskey"></i> Capacidad: 8 onzas'
                ]
            },
            {
                id: 'platos_divisiones',
                title: 'Platos con Divisiones',
                price: 'RD$ 170.00',
                priceNum: 170.00,
                img: 'images/platos_divisiones.svg',
                subCategory: 'platos',
                material: 'carton',
                uso: ['eventos', 'restaurantes'],
                recentScore: 5,
                desc: 'Platos con tres divisiones para separar alimentos cómodamente. Ideales para picnics y buffets.',
                features: [
                    '<i class="fas fa-tag"></i> Material: Cartón grueso impermeable',
                    '<i class="fas fa-box"></i> Cantidad: 15 unidades por paquete'
                ]
            },
            {
                id: 'bolsas',
                title: 'Bolsas Kraft',
                price: 'RD$ 25.00',
                priceNum: 25.00,
                img: 'images/bolsas.png',
                subCategory: 'bolsas',
                material: 'papel',
                uso: ['para llevar', 'restaurantes'],
                recentScore: 11,
                desc: 'Bolsas de papel Kraft con asas reforzadas, ecológicas y resistentes. Ideales para tiendas de ropa, regalos o entregas de comida.',
                features: [
                    '<i class="fas fa-tag"></i> Material: Papel Kraft 120g',
                    '<i class="fas fa-box"></i> Venta: Por unidad (descuento al mayor)',
                    '<i class="fas fa-leaf"></i> 100% Reciclables y Biodegradables'
                ]
            },
            {
                id: 'servilletas',
                title: 'Servilletas',
                price: 'RD$ 55.00',
                priceNum: 55.00,
                img: 'images/servilletas.svg',
                subCategory: 'servilletas',
                material: 'papel',
                uso: ['diario', 'fiestas'],
                recentScore: 4,
                desc: 'Servilletas de papel absorbente de doble hoja, muy suaves y resistentes para eventos o el día a día.',
                features: [
                    '<i class="fas fa-tag"></i> Material: Celulosa de alta calidad',
                    '<i class="fas fa-box"></i> Cantidad: 100 unidades por paquete'
                ]
            },
            {
                id: 'bandeja_kraft',
                title: 'Bandejas para Alimentos',
                price: 'RD$ 250.00',
                priceNum: 250.00,
                img: 'images/bandeja_kraft.svg',
                subCategory: 'bandejas',
                material: 'carton',
                uso: ['eventos', 'restaurantes'],
                recentScore: 12,
                desc: 'Bandejas de cartón kraft para picaderas y postres, perfectas para eventos y repostería.',
                features: [
                    '<i class="fas fa-tag"></i> Material: Cartón kraft resistente a grasas',
                    '<i class="fas fa-box"></i> Cantidad: 10 unidades por paquete'
                ]
            },
            {
                id: 'vaso_cafe',
                title: 'Vasos de Papel para Café',
                price: 'RD$ 180.00',
                priceNum: 180.00,
                img: 'images/vaso_cafe.svg',
                subCategory: 'vasos',
                material: 'papel',
                uso: ['diario', 'para llevar'],
                recentScore: 13,
                desc: 'Vasos de cartón térmicos para café expreso y capuchino. No queman las manos.',
                features: [
                    '<i class="fas fa-tag"></i> Material: Cartón con recubrimiento de PLA',
                    '<i class="fas fa-box"></i> Cantidad: 50 unidades por paquete'
                ]
            },
            {
                id: 'bandeja_aluminio',
                title: 'Bandejas de Aluminio',
                price: 'RD$ 320.00',
                priceNum: 320.00,
                img: 'images/bandeja_aluminio.svg',
                subCategory: 'bandejas',
                material: 'biodegradable',
                uso: ['eventos', 'restaurantes'],
                recentScore: 14,
                desc: 'Bandejas desechables de aluminio grueso, ideales para hornear y transportar comidas calientes.',
                features: [
                    '<i class="fas fa-tag"></i> Material: Aluminio de grado alimenticio',
                    '<i class="fas fa-box"></i> Cantidad: 5 unidades por paquete'
                ]
            },
            {
                id: 'portavasos',
                title: 'Portavasos de Cartón',
                price: 'RD$ 90.00',
                priceNum: 90.00,
                img: 'images/portavasos.svg',
                subCategory: 'bandejas',
                material: 'carton',
                uso: ['para llevar'],
                recentScore: 15,
                desc: 'Portavasos rígidos de cartón prensado para transportar hasta 4 bebidas frías o calientes simultáneamente.',
                features: [
                    '<i class="fas fa-tag"></i> Material: Cartón prensado reciclado',
                    '<i class="fas fa-box"></i> Capacidad: 4 vasos de 8 a 32 oz'
                ]
            }
        ];

        
let categoriesList = [];

async function loadStoreCategories() {
    if (typeof supabaseClient !== 'undefined' && supabaseClient) {
        try {
            const { data, error } = await supabaseClient.from('categories').select('*');
            if (error) throw error;
            categoriesList = data || [];
        } catch (err) {
            console.error(err);
        }
    }
    renderStoreCategories();
}

function renderStoreCategories() {
    const filterContainer = document.querySelector('.category-links');
    if (!filterContainer) return;
    
    let html = '<li><a href="#" class="cat-link active" data-category="all">Todos los productos</a></li>';
    categoriesList.forEach(c => {
        html += `
        <li><a href="#" class="cat-link" data-category="${c.id}">${c.name}</a></li>
        `;
    });
    filterContainer.innerHTML = html;
    
    const newLinks = filterContainer.querySelectorAll('.cat-link');
    newLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.cat-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            activeCategory = link.getAttribute('data-category');
            applyFilters();
        });
    });
}

async function fetchStoreProducts() {
            if (supabaseClient) {
                try {
                    const { data, error } = await supabaseClient
                        .from('products')
                        .select('*')
                        .eq('status', 'Activo');
                    if (error) throw error;
                    
                    if (data && data.length > 0) {
                        desechablesProductsList = data.map(p => ({
                            id: p.id,
                            title: p.title,
                            price: p.price,
                            priceNum: p.price_num,
                            img: p.img,
                            subCategory: p.sub_category,
                            material: p.material || '',
                            uso: p.uso || [],
                            recentScore: p.recent_score || 0
                        }));

                        // Inject database details into productsData dynamically
                        data.forEach(p => {
                            productsData[p.id] = {
                                category: 'DESECHABLES',
                                title: p.title,
                                price: p.price,
                                img: p.img,
                                reviews: `(${Math.floor(Math.random() * 80) + 20} reseñas)`,
                                desc: p.description || p.title,
                                features: p.features || [
                                    `<i class="fas fa-tag"></i> Material: ${p.material || 'Varios'}`
                                ]
                            };
                        });
                    } else {
                        useDefaultProducts();
                    }
                } catch (err) {
                    console.error("Error cargando productos de Supabase:", err);
                    useDefaultProducts();
                }
            } else {
                useDefaultProducts();
            }
            applyFilters();
        }

        function useDefaultProducts() {
            const stored = localStorage.getItem('ivad_custom_products');
            let sourceList = [];
            if (stored) {
                try {
                    sourceList = JSON.parse(stored);
                } catch(e) {
                    sourceList = [];
                }
            } else {
                sourceList = [];
            }

            desechablesProductsList = sourceList.filter(p => p.status === 'Activo').map(p => ({
                id: p.id,
                title: p.title,
                price: p.price,
                priceNum: p.price_num || p.priceNum || parseFloat(p.price.replace(/[^0-9.]/g, '')) || 0,
                img: p.img,
                subCategory: p.sub_category || p.subCategory,
                material: p.material || '',
                uso: p.uso || [],
                recentScore: p.recent_score || p.recentScore || 0
            }));

            sourceList.forEach(p => {
                productsData[p.id] = {
                    category: 'DESECHABLES',
                    title: p.title,
                    price: p.price,
                    img: p.img,
                    reviews: `(${Math.floor(Math.random() * 85) + 15} reseñas)`,
                    desc: p.description || p.desc || p.title,
                    features: p.features || [
                        `<i class="fas fa-tag"></i> Material: ${p.material || 'Varios'}`
                    ]
                };
            });
        }

        const searchInput = document.getElementById('search-input');
        const sortSelect = document.getElementById('sort-select');
        const catLinks = document.querySelectorAll('.cat-link');
        const highlightCards = document.querySelectorAll('.highlight-card');
        const materialCheckboxes = document.querySelectorAll('input[name="material"]');
        const usoCheckboxes = document.querySelectorAll('input[name="uso"]');
        const btnClearFilters = document.getElementById('btn-clear-filters');
        const resultsCount = document.getElementById('results-count');
        const btnShowAllPromo = document.getElementById('btn-show-all-promo');

        const urlParams = new URLSearchParams(window.location.search);
        let activeCategory = urlParams.get('category') || 'all';

        // Ocultar parámetro de la URL
        if (urlParams.has('category')) {
            window.history.replaceState(null, '', window.location.pathname);
        }

        // Sync initial active state in UI if category is from URL
        if (activeCategory !== 'all') {
            catLinks.forEach(l => {
                if (l.getAttribute('data-category') === activeCategory) {
                    l.classList.add('active');
                } else {
                    l.classList.remove('active');
                }
            });
            highlightCards.forEach(c => {
                if (c.getAttribute('data-category') === activeCategory) {
                    c.style.borderColor = 'var(--secondary-color)';
                    c.style.boxShadow = '0 5px 15px rgba(0,0,0,0.05)';
                } else {
                    c.style.borderColor = 'var(--border-color)';
                    c.style.boxShadow = 'none';
                }
            });
        }

        function renderProducts(products) {
            if (products.length === 0) {
                storeGrid.innerHTML = `
                    <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: var(--gray-text);">
                        <i class="fas fa-box-open" style="font-size: 3.5rem; margin-bottom: 15px; color: #ccc;"></i>
                        <p style="font-size: 1rem; font-weight: 500;">No se encontraron productos con los filtros seleccionados.</p>
                    </div>
                `;
                if (resultsCount) resultsCount.textContent = 'Mostrando 0 productos';
                return;
            }
            
            storeGrid.innerHTML = products.map(p => {
                const isNew = Math.random() > 0.7 ? '<span class="modern-badge badge-new">Nuevo</span>' : '';
                return `
                <div class="store-card modern-card" data-id="${p.id}">
                    <div class="producto-img-container">
                        ${isNew}
                        <img src="${p.img}" alt="${p.title}" loading="lazy">
                        <div class="card-overlay-actions">
                            <button class="btn-icon-action add-to-cart-quick" data-id="${p.id}" title="Añadir al Carrito"><i class="fas fa-cart-plus"></i></button>
                            <button class="btn-icon-action btn-quick-view" title="Vista Rápida"><i class="far fa-eye"></i></button>
                        </div>
                    </div>
                    <div class="producto-info">
                        <h4>${p.title}</h4>
                        <div class="store-card-actions">
                            <span class="modern-price">${p.price}</span>
                        </div>
                    </div>
                </div>
                `;
            }).join('');
            
            if (resultsCount) {
                resultsCount.textContent = `Mostrando 1-${products.length} de ${products.length} productos`;
            }
        }

        function applyFilters() {
            let filtered = [...desechablesProductsList];
            
            // 1. Filter by Category
            if (activeCategory !== 'all') {
                filtered = filtered.filter(p => p.subCategory === activeCategory);
            }
            
            // 2. Filter by Search Query
            if (searchInput) {
                const query = searchInput.value.toLowerCase().trim();
                if (query) {
                    filtered = filtered.filter(p => p.title.toLowerCase().includes(query));
                }
            }
            
            // 3. Filter by Materials
            const selectedMaterials = Array.from(materialCheckboxes)
                .filter(cb => cb.checked)
                .map(cb => cb.value);
            if (selectedMaterials.length > 0) {
                filtered = filtered.filter(p => selectedMaterials.includes(p.material));
            }
            
            // 4. Filter by Uso
            const selectedUsos = Array.from(usoCheckboxes)
                .filter(cb => cb.checked)
                .map(cb => cb.value);
            if (selectedUsos.length > 0) {
                filtered = filtered.filter(p => {
                    const usos = Array.isArray(p.uso) ? p.uso : [p.uso];
                    return selectedUsos.some(u => usos.includes(u));
                });
            }
            
            // 5. Sort
            if (sortSelect) {
                const sortBy = sortSelect.value;
                if (sortBy === 'recent') {
                    filtered.sort((a, b) => b.recentScore - a.recentScore);
                } else if (sortBy === 'price-asc') {
                    filtered.sort((a, b) => a.priceNum - b.priceNum);
                } else if (sortBy === 'price-desc') {
                    filtered.sort((a, b) => b.priceNum - a.priceNum);
                }
            }
            
            renderProducts(filtered);
        }

        // Bind input listeners
        if (searchInput) searchInput.addEventListener('input', applyFilters);
        if (sortSelect) sortSelect.addEventListener('change', applyFilters);
        
        materialCheckboxes.forEach(cb => cb.addEventListener('change', applyFilters));
        usoCheckboxes.forEach(cb => cb.addEventListener('change', applyFilters));

        // Bind categories click
        catLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                catLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                activeCategory = link.getAttribute('data-category');
                
                // Highlight corresponding card if exists
                highlightCards.forEach(c => {
                    if (c.getAttribute('data-category') === activeCategory) {
                        c.style.borderColor = 'var(--secondary-color)';
                        c.style.boxShadow = '0 5px 15px rgba(0,0,0,0.05)';
                    } else {
                        c.style.borderColor = 'var(--border-color)';
                        c.style.boxShadow = 'none';
                    }
                });
                
                applyFilters();
            });
        });

        // Bind highlight cards click
        highlightCards.forEach(card => {
            card.addEventListener('click', () => {
                const category = card.getAttribute('data-category');
                activeCategory = category;
                
                // Sync sidebar links
                catLinks.forEach(l => {
                    if (l.getAttribute('data-category') === category) {
                        l.classList.add('active');
                    } else {
                        l.classList.remove('active');
                    }
                });
                
                // Update highlight cards style
                highlightCards.forEach(c => {
                    if (c === card) {
                        c.style.borderColor = 'var(--secondary-color)';
                        c.style.boxShadow = '0 5px 15px rgba(0,0,0,0.05)';
                    } else {
                        c.style.borderColor = 'var(--border-color)';
                        c.style.boxShadow = 'none';
                    }
                });
                
                applyFilters();
            });
        });

        // Clear filters logic
        if (btnClearFilters) {
            btnClearFilters.addEventListener('click', () => {
                if (searchInput) searchInput.value = '';
                if (sortSelect) sortSelect.value = 'recent';
                activeCategory = 'all';
                
                catLinks.forEach(l => {
                    if (l.getAttribute('data-category') === 'all') {
                        l.classList.add('active');
                    } else {
                        l.classList.remove('active');
                    }
                });
                
                highlightCards.forEach(c => {
                    c.style.borderColor = 'var(--border-color)';
                    c.style.boxShadow = 'none';
                });
                
                materialCheckboxes.forEach(cb => cb.checked = false);
                usoCheckboxes.forEach(cb => cb.checked = false);
                
                applyFilters();
            });
        }

        if (btnShowAllPromo) {
            btnShowAllPromo.addEventListener('click', (e) => {
                e.preventDefault();
                if (btnClearFilters) btnClearFilters.click();
            });
        }

        // Initialize grid on load
        loadStoreCategories();
        fetchStoreProducts();

        if (typeof supabaseClient !== 'undefined' && supabaseClient) {
            supabaseClient.channel('store-products')
                .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, (payload) => {
                    console.log('Realtime products payload:', payload);
                    fetchStoreProducts(); 
                })
                .subscribe();

            supabaseClient.channel('store-categories')
                .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, (payload) => {
                    console.log('Realtime categories payload:', payload);
                    loadStoreCategories(); 
                })
                .subscribe();
        }
    }

    /* ==========================================
       GLOBAL SHOPPING CART FUNCTIONALITY
       ========================================== */
    // Initialize Cart state from LocalStorage
    let cart = JSON.parse(localStorage.getItem('ivad_cart')) || [];

    // Inject HTML structure for Cart Drawer and Overlay if not exists
    if (!document.getElementById('cart-drawer')) {
        const drawerHtml = `
            <div id="cart-overlay"></div>
            <div id="cart-drawer">
                <div class="cart-header">
                    <h2>Tu Carrito</h2>
                    <button class="cart-close-btn" aria-label="Cerrar"><i class="fas fa-times"></i></button>
                </div>
                <div class="cart-items-list" id="cart-items-container">
                    <!-- Cart items will be loaded dynamically here -->
                </div>
                <div class="cart-footer">
                    <div class="cart-summary-line">
                        <span>Subtotal</span>
                        <span id="cart-subtotal">RD$ 0.00</span>
                    </div>
                    <div class="cart-summary-line">
                        <span>ITBIS (18%)</span>
                        <span id="cart-tax">RD$ 0.00</span>
                    </div>
                    <div class="cart-summary-line total">
                        <span>Total</span>
                        <span id="cart-total">RD$ 0.00</span>
                    </div>
                    <button class="cart-checkout-btn" id="btn-cart-checkout">Pagar ahora</button>
                </div>
            </div>

            <!-- Checkout Success Modal -->
            <div class="checkout-modal-overlay" id="checkout-success-modal">
                <div class="checkout-modal-content">
                    <i class="fas fa-check-circle"></i>
                    <h3>¡Pedido Confirmado!</h3>
                    <p>Muchas gracias por tu compra en IVAD. Tu orden está siendo procesada y te enviaremos los detalles del envío por correo electrónico.</p>
                    <button class="checkout-modal-close-btn" id="btn-checkout-close">Cerrar</button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', drawerHtml);
    }

    // Elements
    const cartOverlay = document.getElementById('cart-overlay');
    const cartDrawer = document.getElementById('cart-drawer');
    const cartCloseBtn = document.querySelector('.cart-close-btn');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartSubtotalEl = document.getElementById('cart-subtotal');
    const cartTaxEl = document.getElementById('cart-tax');
    const cartTotalEl = document.getElementById('cart-total');
    const cartCheckoutBtn = document.getElementById('btn-cart-checkout');
    const checkoutModal = document.getElementById('checkout-success-modal');
    const checkoutCloseBtn = document.getElementById('btn-checkout-close');

    // Sync Cart Badge Count
    function updateCartBadge() {
        const totalItemsCount = cart.reduce((sum, item) => sum + item.qty, 0);
        document.querySelectorAll('.cart-count').forEach(badge => {
            badge.textContent = totalItemsCount;
            // Highlight animation on count change
            badge.style.transform = 'scale(1.2)';
            setTimeout(() => {
                badge.style.transform = 'scale(1)';
            }, 200);
        });
    }

    // Save Cart to LocalStorage and Render
    function saveAndRenderCart() {
        localStorage.setItem('ivad_cart', JSON.stringify(cart));
        updateCartBadge();
        renderCartItems();
    }

    // Render Items inside Drawer
    function renderCartItems() {
        if (!cartItemsContainer) return;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="cart-empty-message">
                    <i class="fas fa-shopping-basket"></i>
                    <p>Tu carrito está vacío.</p>
                </div>
            `;
            if (cartSubtotalEl) cartSubtotalEl.textContent = 'RD$ 0.00';
            if (cartTaxEl) cartTaxEl.textContent = 'RD$ 0.00';
            if (cartTotalEl) cartTotalEl.textContent = 'RD$ 0.00';
            if (cartCheckoutBtn) cartCheckoutBtn.disabled = true;
            return;
        }

        if (cartCheckoutBtn) cartCheckoutBtn.disabled = false;

        let subtotal = 0;

        cartItemsContainer.innerHTML = cart.map(item => {
            const itemTotal = item.price * item.qty;
            subtotal += itemTotal;
            return `
                <div class="cart-item" data-id="${item.id}">
                    <img src="${item.img}" alt="${item.title}" class="cart-item-img">
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.title}</div>
                        <div class="cart-item-price">RD$ ${item.price.toFixed(2)}</div>
                        <div class="cart-item-controls">
                            <button class="cart-item-qty-btn minus-qty" data-id="${item.id}"><i class="fas fa-minus"></i></button>
                            <span class="cart-item-qty">${item.qty}</span>
                            <button class="cart-item-qty-btn plus-qty" data-id="${item.id}"><i class="fas fa-plus"></i></button>
                        </div>
                    </div>
                    <button class="cart-item-delete" data-id="${item.id}" aria-label="Eliminar"><i class="fas fa-trash-alt"></i></button>
                </div>
            `;
        }).join('');

        const tax = subtotal * 0.18;
        const total = subtotal + tax;

        if (cartSubtotalEl) cartSubtotalEl.textContent = `RD$ ${subtotal.toFixed(2)}`;
        if (cartTaxEl) cartTaxEl.textContent = `RD$ ${tax.toFixed(2)}`;
        if (cartTotalEl) cartTotalEl.textContent = `RD$ ${total.toFixed(2)}`;
    }

    // Toggle Cart Drawer
    function toggleCart(show = true) {
        if (show) {
            cartOverlay.classList.add('active');
            cartDrawer.classList.add('active');
            renderCartItems();
        } else {
            cartOverlay.classList.remove('active');
            cartDrawer.classList.remove('active');
        }
    }

    // Event Listeners for Cart drawer visibility
    document.querySelectorAll('.cart-icon').forEach(icon => {
        icon.addEventListener('click', (e) => {
            e.preventDefault();
            toggleCart(true);
        });
    });

    if (cartCloseBtn) cartCloseBtn.addEventListener('click', () => toggleCart(false));
    if (cartOverlay) cartOverlay.addEventListener('click', () => toggleCart(false));

    // Handle Item Modifications inside Drawer (delegated clicks)
    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', (e) => {
            const btnMinus = e.target.closest('.minus-qty');
            const btnPlus = e.target.closest('.plus-qty');
            const btnDelete = e.target.closest('.cart-item-delete');

            if (btnMinus) {
                const id = btnMinus.getAttribute('data-id');
                const idx = cart.findIndex(item => item.id === id);
                if (idx !== -1) {
                    if (cart[idx].qty > 1) {
                        cart[idx].qty -= 1;
                    } else {
                        cart.splice(idx, 1);
                    }
                    saveAndRenderCart();
                }
            }

            if (btnPlus) {
                const id = btnPlus.getAttribute('data-id');
                const idx = cart.findIndex(item => item.id === id);
                if (idx !== -1) {
                    cart[idx].qty += 1;
                    saveAndRenderCart();
                }
            }

            if (btnDelete) {
                const id = btnDelete.getAttribute('data-id');
                cart = cart.filter(item => item.id !== id);
                saveAndRenderCart();
            }
        });
    }

    // Add to Cart Logic
    function addToCart(id, title, priceStr, img, qty = 1) {
        const price = parseFloat(priceStr.replace(/[^0-9.-]+/g, ""));
        const existingIdx = cart.findIndex(item => item.id === id);
        
        if (existingIdx !== -1) {
            cart[existingIdx].qty += qty;
        } else {
            cart.push({ id, title, price, img, qty });
        }
        saveAndRenderCart();
        if (window.innerWidth <= 768) {
            window.showToast("Agregado: " + title);
        } else {
            toggleCart(true); // En escritorio sí lo abrimos
        }
    }

    // Add to Cart from the Detail Modal
    const modalAddBtn = document.querySelector('.add-to-cart');
    if (modalAddBtn) {
        modalAddBtn.addEventListener('click', () => {
            const activeModal = document.getElementById('product-modal');
            if (activeModal && activeModal.classList.contains('active')) {
                const title = document.getElementById('modal-title').textContent;
                const priceStr = document.getElementById('modal-price').textContent;
                const img = document.getElementById('modal-img').getAttribute('src');
                const qty = parseInt(document.querySelector('.qty-input').value) || 1;
                
                let id = 'unknown';
                for (const key in productsData) {
                    if (productsData[key].title === title) {
                        id = key;
                        break;
                    }
                }

                if (id !== 'unknown') {
                    addToCart(id, title, priceStr, img, qty);
                    const modalClose = document.querySelector('.modal-close');
                    if (modalClose) modalClose.click();
                }
            }
        });
    }

    // Add to Cart from Quick Add buttons on Store Grid
    document.addEventListener('click', (e) => {
        const quickAdd = e.target.closest('.add-to-cart-quick');
        if (quickAdd) {
            e.stopPropagation();
            const id = quickAdd.getAttribute('data-id');
            if (id && productsData[id]) {
                const data = productsData[id];
                addToCart(id, data.title, data.price, data.img, 1);
            }
        }
    });

    // Checkout button handler
    if (cartCheckoutBtn) {
        cartCheckoutBtn.addEventListener('click', () => {
            toggleCart(false);
            window.location.href = 'checkout.html';
        });
    }

    if (checkoutCloseBtn) {
        checkoutCloseBtn.addEventListener('click', () => {
            if (checkoutModal) {
                checkoutModal.classList.remove('active');
            }
        });
    }

    if (checkoutModal) {
        checkoutModal.addEventListener('click', (e) => {
            if (e.target === checkoutModal) {
                checkoutModal.classList.remove('active');
            }
        });
    }

    // Initial load
    updateCartBadge();
    renderCartItems();

    // User session management (Header user icon)
    function syncUserSession(userData) {
        const userLinks = document.querySelectorAll('a[href="login.html"]');
        userLinks.forEach(anchor => {
            const initial = userData.name ? userData.name.charAt(0).toUpperCase() : 'U';
            anchor.innerHTML = `<span class="user-logged-initial" style="
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 28px;
                height: 28px;
                background-color: var(--secondary-color);
                color: var(--text-light);
                font-weight: 700;
                font-size: 0.85rem;
                border-radius: 50%;
                border: 2px solid transparent;
                transition: border-color 0.2s;
            " title="${userData.name} (Haga clic para cerrar sesión)">${initial}</span>`;
            
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                if (confirm(`Hola, ${userData.name}. ¿Deseas cerrar sesión?`)) {
                    if (supabaseClient) {
                        supabaseClient.auth.signOut().then(() => {
                            localStorage.removeItem('ivad_user');
                            alert('Sesión cerrada.');
                            window.location.reload();
                        });
                    } else {
                        localStorage.removeItem('ivad_user');
                        alert('Sesión cerrada.');
                        window.location.reload();
                    }
                }
            });
        });
    }

    // Sync session on load
    if (supabaseClient) {
        supabaseClient.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                const user = {
                    name: session.user.user_metadata.full_name || session.user.email.split('@')[0],
                    email: session.user.email,
                    phone: session.user.user_metadata.phone || ''
                };
                localStorage.setItem('ivad_user', JSON.stringify(user));
                syncUserSession(user);
            } else {
                localStorage.removeItem('ivad_user');
            }
        });
    } else {
        const ivadUserStr = localStorage.getItem('ivad_user');
        if (ivadUserStr) {
            try {
                const userData = JSON.parse(ivadUserStr);
                syncUserSession(userData);
            } catch (err) {
                console.error('Error parsing user data:', err);
            }
        }
    }
});

// Toast Notifications System
window.showToast = function(message) {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = `<i class="fas fa-check-circle"></i> <span>` + message + `</span>`;
    
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 400); // Wait for fade out animation
    }, 3000); // Show for 3 seconds
};

    // Mobile Filter Toggle
    const btnToggleFilters = document.getElementById('btn-toggle-filters');
    const filtersSidebar = document.getElementById('filters-sidebar');
    if (btnToggleFilters && filtersSidebar) {
        btnToggleFilters.addEventListener('click', () => {
            filtersSidebar.classList.toggle('show-mobile');
        });
    }
