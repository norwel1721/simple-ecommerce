import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'


const customDarkTheme = {
    dark: true,
    colors: {
        background: "#B0BEC5",
        surface: "#CFD8DC",
        primary: "#F5F5DC",
        secondary: "#607D8B",
        error: "#ff5722",
        text:"#ffffff"
        
    },
};
const customLightTheme = {
    dark: false,
    colors: {
        background: "#ECEFF1",
        surface: "#eff2f3",
        primary: "#607D8B",
        secondary: "#F5F5DC",
        error: "#EF5350",
        warning:"#FFD180",
        success:"#66BB6A",
        info:"#81D4FA",
        text:"#424242"
    },
};

const vuetify = createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: 
        // "customDarkTheme"
        "customLightTheme"
        ,
        themes: {
            customDarkTheme,
            customLightTheme,
        },
    },

    icons: {
        defaultSet: 'mdi',
    },

    defaults: {
        VContainer:{
        },

        global:{
            transition:"slide-x-transition"
        },
        VCard: {
            elevation:5,
            VTextField: { 
                variant:'underlined',
                density:'compact'
            },
            VTextarea: { 
                variant:'underlined',
                density:'compact'
            },
            VAutocomplete: { 
                variant:'underlined',
                density:'compact' 
            },
            VSelect: { 
                variant:'underlined',
                density:'compact' 
            },
            VBtn:{
                color:'primary',
            }
        },
        VSheet:{
            VTextField: { 
                variant:'outlined',
                density:'compact'
                
            },
        },
        VPagination:{
            color:"primary",
            activeColor:"secondary",
            density:"comfortable",
            variant:"elevated",
        },
        VTable:{
            VBtn:{
                variant:'tonal',
            }
        },
        VTooltip:{
            activator:"parent",
            location:"top"
        },
        VIcon:{
        }

    }
})
export default vuetify