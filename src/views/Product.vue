<template>
  <v-container>
        <!-- NOTE START OF FILTER FIELD -->
        <v-row class="align-center justify-center">
            <v-col 
                cols="12"
                xl="2"
                lg="4"
                md="4"
                sm="4"
                xs="6"
            >
                <v-btn 
                    @click="openAddDialog" 
                    text="Add product"
                    color="primary" 
                    block
                    class="mr-2"
                ></v-btn>
            </v-col>
            <v-col
                cols="12"
                xl="2"
                lg="4"
                md="4"
                sm="4"
                xs="6"
            >
                <v-text-field 
                    v-model="searchProduct" 
                    label="Search products" 
                    clearable
                    class="pr-2"
                    hide-details
                ></v-text-field>
            </v-col>
            <v-col
                cols="12"
                xl="2"
                lg="4"
                md="4"
                sm="4"
                xs="6"
            >
                <v-autocomplete 
                    v-model="selectedCategory" 
                    :items="categories" 
                    item-title="name" 
                    item-value="id" 
                    hide-details
                    class="pr-2"
                    label="Filter by Category"
                ></v-autocomplete>
            </v-col>
            <v-col
                cols="12"
                xl="6"
                lg="12"
                md="12"
                sm="12"
                xs="12"
            >
                <v-pagination
                class="pagination-style"
                v-model="currentPage"
                :length="totalPages"
                :total-visible="5"
                @update:model-value="changePage"
                ></v-pagination>
            </v-col>
        </v-row>
        <!-- NOTE END OF FILTER FIELD  -->

        <!-- NOTE START OF MAIN DISPLAY DATA -->
        <TransitionGroup name="slide-up" tag="div" class="d-flex flex-wrap mr-n3 ml-n3">
            <v-col 
            class="position-relative hovering-card"
                v-show="productDelay[index]"
                v-for="(product, index) in paginatedData" 
                :key="index" 
                cols="6"  
                sm="4" 
                md="3" 
                lg="3" 
                xl="2" 
                xxl="1">
                <div class="actions-button">
                    <v-btn @click="editProduct(product)" class=" mr-1 mt-1" icon="mdi-pencil" size="x-small" density="comfortable" color="success" tile rounded></v-btn>
                    <v-btn @click="deleteProducts(product.id)" class=" mr-1 mt-1" icon="mdi-delete" size="x-small" density="comfortable" color="error" tile rounded></v-btn>
                </div>
                <div @click="openImageModal(product.images, 0)" class="custom-card-design bg-secondary  ">
                    <div class="card-image">
                        <img 
                            :src="getImageSrc(product.images)"
                            :height="200"
                            cover>
                        / >
                    </div>
                    <div class="card-details">
                        <div class="text-white">
                            <p>{{ product.title }}</p>
                            <p>₱ {{ product.price }}</p>
                        </div>
                    </div>
                </div>
            </v-col>
            <div v-if="filteredProducts.length === 0">
                <p>No products found.</p>
            </div>
        </TransitionGroup>
        <!-- NOTE END OF MAIN DISPLAY DATA -->

        <!-- NOTE START PREVIEW IMAGE DIALOG  -->
        <v-dialog v-model="imageDialog" max-width="800" persistent>
            <v-card>
                <v-card-title class="d-flex align-center justify-space-between pa-2 bg-primary">
                    <span class="headline">Image Gallery</span>
                    <v-btn @click="imageDialog = false" icon="mdi-close" color="error" density="compact" tile></v-btn>
                </v-card-title>
                <v-card-text>
                    <v-carousel v-model="currentImageIndex" hide-delimiters>
                        <v-carousel-item v-for="(image, index) in imagesToShow" :key="index">
                            <div style="text-align: center;">
                                <img :src="image" alt="Image Preview" style="width: 50%; height: auto;" />
                            </div>
                        </v-carousel-item>
                    </v-carousel>
                    <v-row class="thumbnails">
                        <v-col v-for="(image, index) in imagesToShow" :key="index" cols="2" sm="1" md="1" lg="1">
                            <v-img :src="image" alt="Thumbnail" @click="currentImageIndex = index" />
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-dialog>
        <!-- NOTE END OF PREVIEW IMAGE DIALOG  -->

        <!-- NOTE START ADD PRODUCT DIALOG  -->
        <v-dialog v-model="addDialog" max-width="400" persistent>
            <v-form @submit.prevent="createProduct" ref="form">
                <v-card>
                    <v-card-title class="pa-2 bg-primary d-flex justify-space-between align-center">
                    <p>Add Product</p>
                    <v-btn @click="addDialog = false" icon="mdi-close" variant="tonal" color="error" density="compact" tile rounded></v-btn>
                    </v-card-title>
                    <v-card-text class="pa-2">
                        <v-text-field 
                            v-model="productData.title" 
                            label="Title"
                            :rules="[ v => !!v || 'Name is required']"
                        ></v-text-field>
                        <v-text-field 
                            v-model="productData.price" 
                            label="Price" 
                            type="number"
                            :rules="[ v => !!v || 'Price is required']"
                        ></v-text-field>
                        <v-text-field 
                            v-model="productData.description" 
                            label="Description"
                            :rules="[ v => !!v || 'Description is required']"
                        ></v-text-field>
                        <v-autocomplete 
                            v-model="productData.categoryId" 
                            :items="categories" 
                            item-title="name" 
                            item-value="id" 
                            label="Category"
                            :rules="[ v => !!v || 'Category is required']"
                        ></v-autocomplete>
                        <v-text-field v-model="newImageUrl" label="Image URL" type="url"></v-text-field>
                        <v-btn @click="addImageUrl" color="primary">Add Image URL</v-btn>
                        <div v-if="imageUrls.length">
                            <h5>Image URLs:</h5>
                            <v-row class="">
                                <v-col v-for="(url, index) in imageUrls" :key="index">
                                    <img :src="url" alt="Image Preview" style="max-width: 20%; height: auto;"/>
                                </v-col>
                            </v-row>
                        </div>
                        <div v-if="newImageUrl">
                            <img :src="newImageUrl" alt="Image Preview" style="max-width: 20%; height: 20%;"/>
                        </div>
                    </v-card-text>
                    <v-card-actions><v-btn type="submit">Save</v-btn></v-card-actions>
                </v-card>
            </v-form>
        </v-dialog>
        <!-- NOTE END ADD PRODUCT DIALOG -->

        <!-- NOTE START UPDATE PRODUCT DIALOG -->
        <v-dialog v-model="updateDialog" max-width="800" persistent>
            <v-form @submit.prevent="updateProduct">
                <v-card>
                    <v-card-title class="pa-2 bg-primary d-flex justify-space-between align-center">
                    <p>Update Product</p>
                    <v-btn @click="updateDialog = false" icon="mdi-close" variant="tonal" color="error" density="compact" tile rounded></v-btn>
                    </v-card-title>
                    <v-card-text class="pa-2">
                    <v-row>
                        <v-col cols="12" sm="12" md="6" lg="6" xl="6">
                            <v-text-field v-model="productData.title" label="Title"></v-text-field>
                            <v-text-field v-model="productData.price" label="Price" type="number"></v-text-field>
                            <v-text-field v-model="productData.description" label="Description"></v-text-field>
                            <v-autocomplete v-model="productData.categoryId" :items="categories" item-title="name" item-value="id" label="Category"></v-autocomplete>
                            <v-text-field v-model="newImageUrl" label="Image URL" type="url"></v-text-field>
                        </v-col>
                        <v-col cols="12" xs="12" sm="16" md="6" lg="6" xl="6">
                            <div v-if="imageUrls.length">
                                <h5>Image/s:</h5>
                                <v-row>
                                    <v-col class="position-relative overflow-hidden " v-for="(url, index) in imageUrls" :key="index">
                                        <v-btn v-tooltip="`delete`" class="image-button-delete" @click="deleteImage(index)" icon="mdi-delete" size="x-small" density="comfortable" color="error" tile rounded></v-btn>
                                        <img class="rounded w-100" :src="url" alt="Image Preview"/>
                                    </v-col>
                                </v-row>
                            </div>
                            <div v-if="newImageUrl">
                                <img :src="newImageUrl" alt="Image Preview" style="max-width: 20%; height: 20%;"/>
                            </div>
                        </v-col>
                    </v-row>
                    </v-card-text>
                    <v-card-actions><v-btn type="submit">Save</v-btn></v-card-actions>
                </v-card>
            </v-form>
        </v-dialog>
        <!-- NOTE END UPDATE PRODUCT DIALOG -->

        <Snackbar ref="snackbar" :message="snackbar.message" :type="snackbar.type" />
  </v-container>
</template>

<script>
import { mainStore } from '@/stores/mainStore';
import { mapState, mapActions } from "pinia";
import Snackbar from '../components/SnackBar.vue';

export default {
    components: {
        Snackbar
    },

    // NOTE start of data
    data() {
        return {
            itemsPerPage: 12,
            currentPage: 1,
            totalDataCount: 0,
            selectedCategory:null,
            searchProduct:'',
            newImageUrl: '',
            imageUrls: [],
            windowHeight:window.innerHeight,
            productData: {
                title: '',
                price: 0,
                description: '',
                categoryId: null,
                images: [],
            },
            productDelay:[],
            addDialog:false,
            updateDialog: false,
            imageDialog: false,
            imagesToShow: [],
            currentImageIndex: 0,
            originalImages: [],

            snackbar:{
                message: '',
                type: 'success'
            }
        };
    },
    // NOTE end of data

    // NOTE start of computed
    computed: {
        ...mapState(mainStore, [
            'products',
            'categories',
            'rules',
        ]),

        //NOTE start of filter function
        filteredProducts() {
            let products = this.products;

            if (this.selectedCategory) {
                products = products.filter(product => product.category.id === this.selectedCategory);
            }

            if (this.searchProduct) {
                    products = products.filter(product => {
                    const productName = product.title.toLowerCase();
                    const searchProduct = this.searchProduct.toLowerCase();
                    return productName.includes(searchProduct);
                });
            }


            return products;
        },
        //NOTE end of filter function

        //NOTE start of paginated data function
        paginatedData() {
            const startIndex = (this.currentPage - 1) * this.itemsPerPage;
            return this.filteredProducts.slice(startIndex, startIndex + this.itemsPerPage);
        },
        
        totalPages() {
            return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
        },
        //NOTE end of paginated data function
    },
    // NOTE End of computed

    // NOTE start of methods
    methods: {
        ...mapActions(mainStore, [
            'getProducts',
            'getCategories',
            'createProducts',
            'updateProducts',
            'deleteProduct'
        ]),

        // NOTE start of delete product function
        deleteProducts(productId) {
            if (confirm('Are you sure you want to delete this product?')) {
                this.deleteProduct(productId).then(() => {
                    this.showSnackbar('Product deleted successfully!', 'error');
                    this.loadProducts();
                }).catch((err) => {
                    console.error('Failed to delete product:', err);
                });
            }
        },
        // NOTE end of delete product function

        // NOTE start of Priview of image function
        openImageModal(images, index) {
            const parsedImages = images.map(image => {
                return image.replace(/[\["\]]/g, '');
            });
            this.imagesToShow = parsedImages;
            this.currentImageIndex = index;
            this.imageDialog = true;
        },
        // NOTE end of Priview of image function

        // NOTE start of update product function
        updateProduct(){
            if (this.newImageUrl) {
                this.imageUrls.push(this.newImageUrl);
                this.newImageUrl = '';
            }

            
            const existingImages = this.productData.images;

            const filteredExistingImages = existingImages.filter(image => {
            try {
                new URL(image);
                return true;
            } catch (e) {
                return false;
            }
            });

            this.productData.images = [...filteredExistingImages, ...this.imageUrls];

            this.productData.images = [...this.imageUrls];
            this.productData.images = [...new Set(this.productData.images)];

            this.updateProducts(this.productData).then(() => {
                this.showSnackbar('Product updated successfully!', 'success');
                this.loadProducts();
                this.updateDialog = false;
                this.resetProductData();
            });
        },
        // NOTE end of update product function

        // NOTE start delete preview images function
        deleteImage(index) {
            this.imageUrls.splice(index, 1);
            // this.productData.images.splice(index, 1);
        },
        // NOTE end delete preview images function

        // NOTE start edit function
        editProduct(data){
            this.productData = {
                id: data.id,
                title: data.title,
                price: data.price,
                description: data.description,
                categoryId: data.category.id,
                images: data.images || [],
            }
            this.newImageUrl = '';
            // this.imageUrls = [];
            this.imageUrls = data.images.map(image => image.replace(/["\[\]]/g, ''));
            this.originalImages = data.images.map(image => image.replace(/["\[\]]/g, ''));
            this.imageUrls = [...this.originalImages];
            this.updateDialog = true
        },
        // NOTE end edit function

        // NOTE start add multiple image using url
        addImageUrl() {
            if (this.newImageUrl) {
                this.imageUrls.push(this.newImageUrl);
                this.newImageUrl = '';
            } else {
                alert("Please enter a valid image URL.");
            }
        },
        // NOTE end add multiple image using url

        // NOTE start create product
        openAddDialog() {
            this.resetProductData();
            this.addDialog = true;
        },
        
        async createProduct() {
            this.$refs.form.validate();
            if (this.$refs.form.validate()) {
                if (this.newImageUrl) {
                    this.imageUrls.push(this.newImageUrl);
                    this.newImageUrl = '';
                }

                if (this.imageUrls.length > 0) {
                    this.productData.images = [...this.productData.images, ...this.imageUrls];
                    this.imageUrls = [];
                } else {
                    this.showSnackbar('Please enter at least one valid image URL.', 'warning');
                    return;
                }

                this.addDialog = false;
                await this.createProducts(this.productData).then(() => {
                    this.showSnackbar('Product created successfully!', 'success');
                    this.loadProducts();
                    this.resetProductData();
                })
            }
        },
        // NOTE start create product

        // NOTE start reset fields function
        resetProductData() {
            this.productData = {
                title: '',
                price: 0,
                description: '',
                categoryId: null,
                images: [],
            };
            this.imageUrls = [];
            this.newImageUrl = '';
        },
        // NOTE end reset fields function

        // NOTE start conversion of jason string url
        getImageSrc(image) {
            if (this.isJsonString(image)) {
                const imageData = JSON.parse(image);
                return imageData[0] || '';
            } else {
                return image;
            }
        },

        isJsonString(str) {
            try {
                JSON.parse(str);
                return true;
            } catch (e) {
                return false;
            }
        },
        // NOTE end conversion of jason string url

        // NOTE start dispatch of data
        loadProducts(){
            for (let i = 0; i < this.productDelay.length; i++) {
                this.productDelay[i] = false
            }
            let delay = 500
            for (let index = 0; index < this.paginatedData.length; index++) {
                setTimeout(() => {
                    this.productDelay[index] = true        
                }, delay);
                delay += 100
            }

        },
        // NOTE end dispatch of data

        // NOTE Start of snackbar message
        showSnackbar(message, type) {
            this.snackbar.message = message;
            this.snackbar.type = type;
            this.$refs.snackbar.show();
        },
        // NOTE end of snackbar message

        changePage() {
            this.loadProducts()
        },
    },
    // NOTE end of methods

    // NOTE start of mounted
    async mounted() {
        await this.getProducts();
        this.loadProducts()
        await this.getCategories();
    },
    // NOTE end of mounted

    // NOTE start of watch
    watch:{
        filteredProducts() {
        this.currentPage = 1;
        },

        updateDialog: {
            handler(val) {
            if (!val) {
                this.imageUrls = [...this.originalImages];
            }
            },
        },
    }
    // NOTE end of watch
};
</script>