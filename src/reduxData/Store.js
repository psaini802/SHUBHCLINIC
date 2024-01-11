import { configureStore } from '@reduxjs/toolkit'
import authSlice from './AuthSlice'
import ReceptionSlice from './ReceptionSlice'
import PatientSlice from './PatientSlice'

const store = configureStore({
    reducer: {
        authInfo: authSlice,
        recpInfo: ReceptionSlice,
        patientInfo: PatientSlice
    }
})

export default store