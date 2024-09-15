<template>
  <v-container>
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
                    @click="addDialog = true" 
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
        <TransitionGroup name="slide-up" tag="div" class="d-flex flex-wrap mr-n3 ml-n3">
            <v-col 
                v-show="productDelay[index]"
                v-for="(product, index) in paginatedData" 
                :key="index" 
                cols="6"  
                sm="4" 
                md="3" 
                lg="3" 
                xl="2" 
                xxl="1">
                <div class="text-secondary custom-card-design bg-secondary">
                    <div class="card-image">
                        <img 
                            :src="getImageSrc(product.images)"
                            :height="200"
                            cover>
                        </img>
                        <div class="actions-button">
                            <v-btn @click="editProduct(product)" class=" mr-1 mt-1" icon="mdi-pencil" size="x-small" density="comfortable" color="success" tile rounded></v-btn>
                            <v-btn class=" mr-1 mt-1" icon="mdi-delete" size="x-small" density="comfortable" color="error" tile rounded></v-btn>
                        </div>
                    </div>
                    <div class="card-details">
                        <div>
                            <p>{{ product.title }}</p>
                            <p>₱ {{ product.price }}</p>
                        </div>
                    </div>
                </div>
            </v-col>
        </TransitionGroup>

      <v-dialog v-model="addDialog" max-width="400" persistent>
            <v-form @submit.prevent="createProduct">
                <v-card>
                    <v-card-title class="pa-2 bg-primary d-flex justify-space-between align-center">
                    <p>Add Product</p>
                    <v-btn @click="addDialog = false" icon="mdi-close" variant="tonal" color="error" density="compact" tile rounded></v-btn>
                    </v-card-title>
                    <v-card-text class="pa-2">
                        <v-text-field v-model="productData.title" label="Title"></v-text-field>
                        <v-text-field v-model="productData.price" label="Price" type="number"></v-text-field>
                        <v-text-field v-model="productData.description" label="Description"></v-text-field>
                        <v-autocomplete v-model="productData.categoryId" :items="categories" item-title="name" item-value="id" label="Category"></v-autocomplete>
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


      <v-dialog v-model="updateDialog" max-width="400" persistent>
            <v-form @submit.prevent="updateProduct">
                <v-card>
                    <v-card-title class="pa-2 bg-primary d-flex justify-space-between align-center">
                    <p>Update Product</p>
                    <v-btn @click="updateDialog = false" icon="mdi-close" variant="tonal" color="error" density="compact" tile rounded></v-btn>
                    </v-card-title>
                    <v-card-text class="pa-2">
                        <v-text-field v-model="productData.title" label="Title"></v-text-field>
                        <v-text-field v-model="productData.price" label="Price" type="number"></v-text-field>
                        <v-text-field v-model="productData.description" label="Description"></v-text-field>
                        <v-autocomplete v-model="productData.categoryId" :items="categories" item-title="name" item-value="id" label="Category"></v-autocomplete>
                        <v-text-field v-model="newImageUrl" label="Image URL" type="url"></v-text-field>
                        <div v-if="imageUrls.length">
                            <h5>Image URLs:</h5>
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
                    </v-card-text>
                    <v-card-actions><v-btn type="submit">Save</v-btn></v-card-actions>
                </v-card>
            </v-form>
      </v-dialog>
  </v-container>
</template>

<script>
import { mainStore } from '@/stores/mainStore';
import { mapState, mapActions } from "pinia";

export default {
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
        };
    },

    computed: {
        ...mapState(mainStore, [
            'products',
            'categories',
        ]),

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

        paginatedData() {
            const startIndex = (this.currentPage - 1) * this.itemsPerPage;
            return this.filteredProducts.slice(startIndex, startIndex + this.itemsPerPage);
        },
        
        totalPages() {
            return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
        },
    },

    methods: {
        ...mapActions(mainStore, [
            'getProducts',
            'getCategories',
            'createProducts',
            'updateProducts'
        ]),

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

            this.productData.images = [...new Set(this.productData.images)];

            this.updateProducts(this.productData).then(() => {
                this.loadProducts();
                this.updateDialog = false;
                this.resetProductData();
            });
        },

        deleteImage(index) {
            this.imageUrls.splice(index, 1);
            this.productData.images.splice(index, 1);
        },

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
            this.updateDialog = true
        },

        addImageUrl() {
            if (this.newImageUrl) {
                this.imageUrls.push(this.newImageUrl);
                this.newImageUrl = '';
            } else {
                alert("Please enter a valid image URL.");
            }
        },

        createProduct(){
            if (this.newImageUrl) {
                this.imageUrls.push(this.newImageUrl);
                this.newImageUrl = '';
            }

            if (this.imageUrls.length) {
                this.productData.images = [...this.productData.images, ...this.imageUrls];
                this.imageUrls = [];
            } else {
                alert("Please enter at least one valid image URL.");
            }

            this.createProducts(this.productData).then(()=>{
                this.loadProducts()
            })
            this.addDialog = false
            this.resetProductData();
        },

        resetProductData() {
            this.productData = {
                title: '',
                price: 0,
                description: '',
                categoryId: null,
                images: [],
            };
            this.newImageUrl = '';
        },

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


        changePage() {
            this.loadProducts()
        },
        
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

        }
    },

    async mounted() {
        await this.getProducts();
        this.loadProducts()
        await this.getCategories();
    },

    watch:{
        filteredProducts() {
        this.currentPage = 1;
        },
    }
};
</script>
