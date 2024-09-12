import { defineStore } from 'pinia';
import axios from 'axios';

export const mainStore = defineStore('mainStore', {
    state: () => ({
        products: [],
        categories:[],
    }),
    actions: {
        async getProducts() {
            await axios({
                method: 'GET',
                url: 'https://api.escuelajs.co/api/v1/products/',
                }).then((res)=>{

                    this.products = res.data
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
              url: 'https://api.escuelajs.co/api/v1/products/',
              data: data
            }).then((res)=>{
                this.products.push(res.data)
            })
          }
    },
});
