<template>
    <v-app>
        <v-container fluid class="bg-secondary d-flex align-center overflow-hidden justify-center  position-relative h-screen  w-100">
            <transition name="slide-down" mode="out-in">
                <v-btn 
                    v-show="button"
                    @click="openShop()" 
                    class="enter-btn "
                    variant="flat"
                    color="primary"
                    text="EnterShop">
                </v-btn>
            </transition>
            <transition name="shoe" mode="out-in">
                <div v-show="shoe" class="shoes-container" >
                    <img class="shoes" src="../images/shoes.png" />
                </div>
            </transition>
            <transition name="arm" mode="out-in">
                <div v-show="arm" class="arm-container" >
                    <img class="arm" src="../images/armBag.png" />
                </div>
            </transition>
            <div :class="'elevation-20 bg-primary left ease '  + (!open?  'remove-width' : '' )"></div>
            <div :class="'elevation-20 bg-secondary right ease ' + (!open?  'remove-width' : '' )" ></div>
            <div :class="'elevation-20 bg-primary top ease ' + (!open?  'remove-height' : '' )"  >

            </div>
            <div :class="'elevation-20 bg-secondary bottom ease ' + (!open?  'remove-height' : '' )" ></div>
        </v-container>
    </v-app>
</template>
<script setup>
    import {ref, onMounted} from "vue"
    let open = ref(false)
    let button = ref(false)
    let shoe = ref(false)
    let arm = ref(false)
    function openShop(){

        localStorage.setItem('shopState', false);
        shoe.value = false
        setTimeout(() => {
            arm.value = false
            button.value = false
            setTimeout(() => {
                open.value = false
                setTimeout(() => {
                    location.reload()
                },1000);
            }, 500);
        }, 200);

    }
    onMounted(() => {
        setTimeout(() => {
            open.value = true
            
            setTimeout(() => {
                shoe.value = true
                setTimeout(() => {
                    arm.value = true
                    setTimeout(() => {
                        button.value = true
                    }, 200);
                }, 200);
            }, 1000);
        }, 200);
    })
</script>
<style scoped>
    .enter-btn{
        transition:all 1s ease-in-out;
        z-index: 100;
    }
    .ease{
        transition: 
            width 1s ease-in-out,
            height 1s ease-in-out,
            opacity 1s ease-in-out;
        /* opacity: 1; */
    }
    .left{
        top: 0;
        left: 0;
        position: absolute;
        width: 50%;
        height: 100%;
        z-index: 1
    }
    .right{
        top: 0;
        right: 0;
        position: absolute;
        width: 50%;
        height: 100%;
        z-index: 2
    }
    .top{
        top: 0;
        right: 0;
        position: absolute;
        width: 100%;
        height: 50%;
        z-index: 3
    }
    .bottom{
        bottom: 0;
        right: 0;
        position: absolute;
        width: 100%;
        height: 50%;
        z-index: 3
    }
    .remove-height{
        height: 0%!important;
        /* opacity: 0!important; */
    }
    .remove-width{
        width: 0%!important;
        /* opacity: 0!important; */

    }
    .shoes-container{
        transition: all 0.5s;
        position: absolute;
        width: 100%;
        max-width: 30%;
        left: 20px;
        bottom: 10%;
        z-index: 10;
    }
    .shoes{
        filter: drop-shadow( 10px 10px 10px black);
        width: 100%;
    }
    .shoe-enter-active {
    transition: all 0.9s ease-in-out;
    }
    
    .shoe-leave-active {
        transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
    }
    
    .shoe-enter-from,
    .shoe-leave-to {
        transform: translateX(-50%)!important;
        opacity: 0;
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    .arm-container{
        position: absolute;
        width: 100%;
        max-width: 50%;
        right: 0px;
        top: 10%;
        z-index: 10;
    }
    .arm{
        filter: drop-shadow( -10px 10px 10px black);
        width: 100%;
    }
    .arm-enter-active {
    transition: all 0.9s ease-in-out;
    }
    
    .arm-leave-active {
        transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
    }
    
    .arm-enter-from,
    .arm-leave-to {
        transform: translateX(50%)!important;
        opacity: 0;
    }

    
    @media only screen and (min-width: 1024px) {
        /* Styles for laptops and desktops */
    }

    /* For Tablets (Portrait and Landscape) */
    @media only screen and (min-width: 768px) and (max-width: 1023px) {
        /* Styles for tablets */
        .arm-container{
            max-width: 50%;
        }
        .shoes-container{
            max-width: 50%;
        }
    }

    /* For Mobile Devices (Portrait and Landscape) */
    @media only screen and (max-width: 767px) {
        /* Styles for mobile devices */
        .arm-container{
            max-width: 90%;
        }
        .shoes-container{
            max-width: 70%;
        }
    }

</style>