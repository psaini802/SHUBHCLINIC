import { useRef, useState } from "react"
import ApiService, { Apiurls } from "../../WebService/ApiService"
import { newPatientReducer } from "../../reduxData/PatientSlice"
import { useSelector, useDispatch } from 'react-redux'
export default function UpdatePateint() {

    const user = useSelector(state => state.authInfo.value)
    const patientData = useSelector(state => state.patientInfo.upData)

    console.log("token", user.token)
    const [msg, setMsg] = useState("")
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()

    const nameBox = useRef()
    const dateBox = useRef()
    const phoneBox = useRef()


    const save = async (event) => {
        event.preventDefault()
        const ob = {
            name: nameBox.current.value,
            phoneNumber: phoneBox.current.value,
            appointmentdate: dateBox.current.value
        }
        try {
            setLoading(true)
            const URL = Apiurls.PATIENT_UPDATE + patientData.id
            const response = await ApiService.PutApiCall(URL, ob, user.token)
            console.log("response recep update", response)
            if (response.status) {
                setMsg(response.data.msg)
                // dispatch(newRecpReducer([response.data]))
            } else {
                setMsg(response.data.msg)
            }
        } catch (error) {
            setMsg("Network error !")
        } finally {
            setLoading(false)

        }
    }
    return <>
        <section id="appointment" className="appointment section-bg " style={{ marginTop: "80px" }}>
            <div className="container">

                <div className="section-title">
                    <h2>Update Record of MR/MIss {patientData?.name}</h2>
                    <p>{msg}</p>
                </div>

                <form onSubmit={save} className="php-email-form">
                    <div className="row">
                        <div className="col-md-4 form-group mt-md-0">
                            <label>Name</label>
                            <input ref={nameBox} defaultValue={patientData?.name} type="text" name="name" className="form-control" id="name" placeholder="Your Name" required/>
                        </div>
                        <div className="col-md-4 form-group mt-md-0">
                            <label>Phone</label>
                            <input ref={phoneBox} defaultValue={patientData?.phoneNumber} type="number" className="form-control" name="phone" id="phone" placeholder="Your Phone" required/>
                        </div>
                        <div className="col-md-4 form-group mt-3 mt-md-0">
                            <label>Appointment Date</label>
                            <input ref={dateBox} defaultValue={patientData?.appointmentdate} type="date" className="form-control" name="date" id="date" required/>
                        </div>
                    </div>
                    <div className="text-center"><button type="submit">{loading ? <div class="spinner-border" role="status">
                        <span class="sr-only">Loading...</span>
                    </div> : "Update"}</button></div>
                </form>

            </div >
        </section >

    </>
}