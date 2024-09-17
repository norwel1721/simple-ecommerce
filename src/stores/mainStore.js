import { defineStore } from 'pinia';
import axios from 'axios';

export const mainStore = defineStore('mainStore', {
    state: () => ({
        products: [],
        categories:[],
        DarkMode:false,
        shopState:false,
    }),
    actions: {
        async getProducts() {
            this.products = []
            await axios({
                method: 'GET',
                url: 'https://api.escuelajs.co/api/v1/products',
                }).then((res)=>{
                    for (let index = 0; index < res.data.length; index++) {
                        const element = res.data[index];
                        this.products.unshift(element)
                    }
                }).catch((err) =>{
                    console.log(err)
            })
        },
        
        async getCategories() {
            await axios({
                method: 'GET',
                url: 'https://api.escuelajs.co/api/v1/categories',
                }).then((res)=>{
                    this.categories = res.data
                }).catch((err) =>{
                    console.log(err)
            })
        },

        async createProducts(data){
            await axios({
              method: 'POST',
              url: 'https://api.escuelajs.co/api/v1/products',
              data: data
            }).then((res)=>{
                this.products.unshift(res.data)
            }).catch((err) => {
                console.log(err);
            });
        },

        async updateProducts(data){
            
            await axios({
              method: 'PUT',
              url: `https://api.escuelajs.co/api/v1/products/${data.id}`,
              data: data
            }).then((res)=>{
                console.log('UP',res)
                const index = this.products.findIndex((product) => product.id === data.id);
                if (index !== -1) {
                    this.products[index] = res.data;
                }
            }).catch((err) => {
                console.log(err);
            });
        },

        async deleteProduct(productId) {
            await axios({
                method: 'DELETE',
                url: `https://api.escuelajs.co/api/v1/products/${String(productId)}`,
            }).then(() => {
                this.products = this.products.filter(product => product.id !== parseInt(productId));
            }).catch((err) => {
                console.log(err);
            });
        },
    },
    persist: [
        {
            storage: localStorage,
            paths: [
                'DarkMode',         
                'shopState'
            ],
            key: 'eCommerce',
        },
    ]
});
