const container = document.getElementById('search-grid');

let skelGrid = '';

for (let i = 0; i<15; i++){
    skelGrid += `
        <article class="product-card">
            <div class="image-ctn">
                <div class="skel-image">
                    <div class="chocolate-chip"></div>
                </div>
            </div>
            <div class="card-body">
                <div class="skel skel-word title"></div>
                <div class="skel skel-word title shorter"></div>

                <div class="skel skel-word price"></div>

                <div class="skel skel-word descrip"></div>
                <div class="skel skel-word descrip"></div>
                <div class="skel skel-word descrip shorter"></div>
            </div>
            <div class="skel-shiner">
        </article>
    `
}

container.innerHTML = skelGrid;