<template>
  <v-container>
    <v-text-field 
      v-model="searchProduct" 
      label="Search products" 
      clearable
    ></v-text-field>
    <v-autocomplete 
      v-model="selectedCategory" 
      :items="categories" 
      item-title="name" 
      item-value="id" 
      label="Filter by Category"
    ></v-autocomplete>
    <v-container>

        <TransitionGroup name="slide-up" tag="div" class="d-flex flex-wrap align-stretch">
          <v-col  v-for="(product, index) in paginatedData" :key="index" cols="10" xs="5" sm="4" md="3" lg="2">
            <div class="text-secondary custom-card-design">
              <div class="card-image">
                <img :src="getImageSrc(product.images)" alt="Product Image" width="100%">
              </div>
              <div class="card-details">
                <h4>{{ product.title }}</h4>
                <p>{{ product.price }}</p>
              </div>
            </div>
          </v-col>
        </TransitionGroup>
      <v-pagination
        v-model="currentPage"
        :length="totalPages"
        :total-visible="5"
        @input="changePage"
      ></v-pagination>
    </v-container>
    <v-form @submit.prevent="createProduct">
      <v-text-field v-model="newProduct.title" label="Title"></v-text-field>
      <v-text-field v-model="newProduct.price" label="Price" type="number"></v-text-field>
      <v-text-field v-model="newProduct.description" label="Description"></v-text-field>
      <v-autocomplete v-model="newProduct.categoryId" :items="categories" item-title="name" item-value="id" label="Category"></v-autocomplete>
      <v-text-field v-model="newImageUrl" label="Image URL" type="url"></v-text-field>

      <v-btn type="submit">Create Product</v-btn>
    </v-form>
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

      newProduct: {
        title: '',
        price: 0,
        description: '',
        categoryId: null,
        images: [],
      },
      
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
      'createProducts'
    ]),

    createProduct(){

      if (this.newImageUrl) {
        this.newProduct.images.push(this.newImageUrl);
        this.newImageUrl = '';
      } else {
        alert("Please enter a valid image URL.");
      }

      this.createProducts(this.newProduct)
      this.resetNewProduct();
    },

    resetNewProduct() {
      this.newProduct = {
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

    changePage(page) {
      this.currentPage = page;
    },
    productDelay(){
    }
  },

  mounted() {
    this.getProducts();
    
    this.getCategories();
  },

  watch:{
    filteredProducts() {
      this.currentPage = 1; // Reset to the first page when the filtered data changes
    },
  }
};
</script>
