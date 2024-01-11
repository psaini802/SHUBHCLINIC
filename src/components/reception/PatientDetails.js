import ApiService, { Apiurls } from "../../WebService/ApiService"
import { useSelector, useDispatch } from 'react-redux'
import { listRecpReducer } from "../../reduxData/ReceptionSlice"
import { useEffect, useState } from "react"
import { listPatientReducer, patientDeleteReducer, patientStatusReducer, updatePatientReducer } from "../../reduxData/PatientSlice"
import { useNavigate } from "react-router-dom"
export default function PatientDetails() {
    const user = useSelector(state => state.authInfo.value)
    const patientList = useSelector(state => state.patientInfo.value)
    const newPatientList = useSelector(state => state.patientInfo.value)
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [msg, setMsg] = useState("")

    const list = async () => {
        try {
            setLoading(true)
            const response = await ApiService.GetApiCall(Apiurls.APPOINTMENTS, user.token)
            console.log(response)
            if (response.data.status) {
                dispatch(listPatientReducer(response.data.data))
            } else {
                setMsg(response.data.msg)
            }
        }
        catch (error) {
            setMsg("Network ERROR..!")
        }
        finally {
            setLoading(false)
        }
    }

    const deactive = async (id) => {
        try {
            const URL = Apiurls.APPOINTMENTS_DONE + id
            const response = await ApiService.PutApiCall(URL, null, user.token)
            console.log(response)
            if (response.data.status) {
                setMsg(response.data.msg)
                var list = patientList.filter(ob => ob.id != response.data.id)
                dispatch(patientStatusReducer(list))
            } else {
                setMsg(response.data.msg)
            }
        }
        catch (error) {
            setMsg("Network ERROR..!")
        }

    }

    const active = async (id) => {
        try {
            const URL = Apiurls.APPOINTMENTS_UNDO + id
            const response = await ApiService.PutApiCall(URL, null, user.token)
            console.log(response)
            if (response.data.status) {
                setMsg(response.data.msg)
                var alist = patientList.filter(ob => ob.id != response.data.id)
                dispatch(patientStatusReducer(alist))
            } else {
                setMsg(response.data.msg)
            }
        }
        catch (error) {
            setMsg("Network ERROR..!")
        }

    }

    const update = (ob) => {
        dispatch(updatePatientReducer(ob))
        navigate('/updatePatientDetails')
    }

    const dele = async (id) => {
        const status = window.confirm("Are You Sure to want to Delete this record ")
        if (status) {
            const URL = Apiurls.PATIENTS_DELETE + id
            const response = await ApiService.DeleApiCall(URL, user.token)
            console.log(response)
            if (response.data.status) {
                setMsg(response.data.msg)
                var alist = patientList.filter(ob => ob.id != response.data.data.id)
                dispatch(patientDeleteReducer(alist))
            } else {
                setMsg(response.data.msg)
            }
        }
        else {
            setMsg("delete errror")
        }
    }
    useEffect(() => {
        list()
    }, [])

    return <>

        <section id="appointment" className="appointment section-bg " style={{ marginTop: "80px" }}>
            <div className="container">

                <div className="section-title">
                    <h2>Appointments</h2>
                    <p>{msg}</p>
                </div>
                <div>
                {loading ? <div className="section-title"><div class="spinner-border " role="status">
                    <span class="sr-only">Loading...</span>
                </div> </div> :
                    <table className=" table table-responsive table-hover">
                        <thead><tr className="text-center">
                            <th>S.no</th>
                            <th>Patient Name</th>
                            <th>Gender</th>
                            <th>Age</th>
                            <th>diagnosis</th>
                            <th>Date</th>
                            <th>Phone</th>
                            <th>Reception</th>
                            <th>Clinic Address</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                            <tbody>
                                {newPatientList.map((ob, index) => <tr className="text-center"><td>{index + 1}</td>
                                    <td>{ob.name}</td>
                                    <td>{ob.sex}</td>
                                    <td>{ob.age}</td>
                                    <td>{ob.daignosis}</td>
                                    <td>{ob.appointmentdate}</td>
                                    <td>{ob.phoneNumber}</td>
                                    <td>{ob.address?.name}</td>
                                    <td>{ob.address?.raddress}</td>
                                    <td>{ob.activeStatus ? <button className="btn btn-sm btn-warning" onClick={() => deactive(ob.id)}>DeActive</button> : <button className="btn btn-sm btn-info" onClick={() => active(ob.id)}>Active</button>}</td>
                                    <td><button className="btn btn-sm btn-primary" onClick={() => update(ob)}>Update</button> &nbsp;<button className="btn btn-sm btn-danger" onClick={() => dele(ob.id)}>Delete</button></td>
                                </tr>)}
                            </tbody>
                    </table>}
                </div>
            </div >
        </section >
    </>
}
