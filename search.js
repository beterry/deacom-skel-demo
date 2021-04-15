//http://localhost:8114/Item/GetEcommerceParts?PageNumber=1&NumberOfItemsPerPage=9&GroupBy=cp_epid&Paging=true&EcommerceCategory=LAUNDRY&SiteID=1

let products = [];
const perPage = 25;
let page = 1;

const initPage = () => {
    fetch('https://cookiesb2b.com/ecomapissl/Item/GetEcommerceParts?SiteID=1&EcommerceParentCategoryID=1')
    .then(res => res.json())
    .then(data => {
        products = data.GetEcommercePartsResult.response['Item.GetEcommerceParts'].EcommerceParts.map((item, i) => {
            return {
                name: item.ep_name,
                descrip: item.ep_descrip,
                price: item.SaleableParts[0].Price,
                id: item.SaleableParts[0].PartID,
                image: "",
                index: i,
            };
        })
        console.log(products);
        renderCards()
        return products;
    })
    .then(() => {
        console.log('Fetching images...')
        document.getElementById('sort').removeAttribute('disabled');
        renderPagination(products.length);
        fetchProductImages();
    });
}

const renderCards = () => {
    console.log('Rendering cards...')
    const grid = document.getElementById("search-grid");
    let cards = ''
    getProductsOnPage(page).forEach((details) => {
        cards += `
            <article id="card-${details.id}" class="product-card">
                <div class="image-ctn">
                    ${details.image ? `<img src="${details.image}" alt="" />` : `<div class="skel-image"><div class="skel-shiner"></div></div>`}
                </div>
                <div class="card-body">
                    <h3 class="card-title">${details.name}</h3>
                    <p class="card-price">$${details.price}</p>
                    <p class="card-description">${details.descrip}</p>
                </div>
            </article>
        `
    })
    grid.innerHTML = cards;
    updatePaginationText();
    updatePaginationButtons();
}

const fetchProductImages = () => {
    products.forEach((item) => {
        fetchImageId(item.id)
        .then(id => fetchImage(id))
        .then(image => {
            renderImage(item.id, image);
            storeImage(item.id, image);
        })
    })
}

const fetchImageId = (id) => {
    return new Promise((resolve, reject) => {
        fetch('https://cookiesb2b.com/ecomapissl/Item/GetData?SiteID=1&PartID=' + id)
        .then(res => res.json())
        .then(data => {
            const idArray = data.GetDataResult.response['Item.GetData'].Items[0].ImageIDs.split(",");
            resolve(parseInt(idArray[0]));
        })
        .catch(error => reject("There was a problem:" + error));
    })
}

const fetchImage = (id) => {
    return new Promise((resolve, reject) => {
        if (id){
            fetch('https://cookiesb2b.com/ecomapissl/Documents/GetImage?SiteID=1&ImageID=' + id)
            .then(res => res.text())
            .then(img => {
                resolve(img);
            })
            .catch(error => reject("There was a problem:" + error));
        } else {
            resolve('images/noimage.png');
        }
    })
}

const renderImage = (cardID, image) => {
    const container = document.querySelector(`#card-${cardID} .image-ctn`);

    if (container){
        const img = `<img src="${image}" alt="" />`;
        container.innerHTML = img;
    }
}

const storeImage = (id, image) => {
    const i = products.findIndex(item => item.id === id);
    products[i].image = image;
}

document.getElementById("sort").addEventListener("change", (e) => {
    switch(e.target.value){
        case 'price-down':
            products.sort((a,b) => a.price - b.price);
            break;
        case 'price-up':
            products.sort((a,b) => b.price - a.price);
            break;
        default:
            products.sort((a,b) => a.index - b.index);
    }
    page = 1;
    renderCards();
})

const getProductsOnPage = (pageNum) => {
    const lowIndex = (pageNum - 1) * perPage;
    const highIndex = lowIndex + perPage;

    const productsOnPage = products.slice(lowIndex, highIndex);

    return productsOnPage;
}

const renderPagination = (totalItems) => {
    const numberOfPages = Math.ceil(totalItems / perPage);
    const container = document.getElementById('pagination');

    let pageButtons = '';
    
    for (let i = 0; i < numberOfPages; i++){
        pageButtons += `<button class="page-btn ${page - 1 === i ? "active" : ""}" value="${i + 1}">${i + 1}</button>`
    }

    container.innerHTML = pageButtons;

    const renderedButtons = document.getElementsByClassName("page-btn");
    for (let i = 0; i < renderedButtons.length; i++){
        renderedButtons[i].addEventListener("click", (e) => {
            changePage(e.target.value);
        })
    }
}

const changePage = (newPage) => {
    page = newPage;
    renderCards();

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
}

const updatePaginationText = () => {
    const text = document.getElementById("pagination-text");

    const lowIndex = ((page - 1) * perPage) + 1;
    const highIndex = lowIndex + getProductsOnPage(page).length - 1;

    text.innerText = `Showing products ${lowIndex} - ${highIndex} of ${products.length}`;
}

const updatePaginationButtons = () => {
    const renderedButtons = document.getElementsByClassName("page-btn");
    for (let i = 0; i < renderedButtons.length; i++){
        renderedButtons[i].classList.remove('active');
        if(page - 1 === i){
            renderedButtons[i].classList.add('active');
        }
    }
}

initPage();