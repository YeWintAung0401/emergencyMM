// Base Urls

export const API_BASE_URL = 'https://em.fothubtv.com/api'
export const IMAGE_BASE_URL = 'https://em.fothubtv.com'

//Local
// export const API_Base_Url = 'https://localhost:8080/api/'
// export const IMAGE_BASE_URL = 'https://localhost:8080'

export const ENDPOINT = {
    // Authentication
    LOGIN : `${API_BASE_URL}/auth/login/`,
    TOKEN_REFRESH : `${API_BASE_URL}/auth/token/refresh/`, 

    //Categories
    CATEGORIES : {
        LIST : `${API_BASE_URL}/categories/`,
        CREATE : `${API_BASE_URL}/categories/create/`,
        DETAIL : (uuid) => `${API_BASE_URL}/categories/${uuid}/`,
        UPDATE : (uuid) => `${API_BASE_URL}/categories/${uuid}/update/`,
        DETELE : (uuid) => `${API_BASE_URL}/categories/${uuid}/delete/`,
        BULK_DETELE : `${API_BASE_URL}/categories/bulk-delete/`,
    },

    // States 
    STATES: {
        LIST: `${API_BASE_URL}/states/`,
        CREATE: `${API_BASE_URL}/states/create/`,
        DETAIL: (id) => `${API_BASE_URL}/states/${id}/`,
        UPDATE: (id) => `${API_BASE_URL}/states/${id}/update/`,
        DELETE: (id) => `${API_BASE_URL}/states/${id}/delete/`,
        BULK_DELETE: `${API_BASE_URL}/states/bulk-delete/`,
    },

    // Townships
    TOWNSHIPS: {
        LIST: `${API_BASE_URL}/townships/`,
        CREATE: `${API_BASE_URL}/townships/create/`,
        DETAIL: (id) => `${API_BASE_URL}/townships/${id}/`,
        UPDATE: (id) => `${API_BASE_URL}/townships/${id}/update/`,
        DELETE: (id) => `${API_BASE_URL}/townships/${id}/delete/`,
        BULK_DELETE: `${API_BASE_URL}/townships/bulk-delete/`,
    },

    // Contacts
    CONTACTS: {
        LIST: `${API_BASE_URL}/contacts/`,
        CREATE: `${API_BASE_URL}/contacts/create/`,
        DETAIL: (uuid) => `${API_BASE_URL}/contacts/${uuid}/`,
        UPDATE: (uuid) => `${API_BASE_URL}/contacts/${uuid}/update/`,
        DELETE: (uuid) => `${API_BASE_URL}/contacts/${uuid}/delete/`,
        BULK_DELETE: `${API_BASE_URL}/contacts/bulk-delete/`,
    }
}