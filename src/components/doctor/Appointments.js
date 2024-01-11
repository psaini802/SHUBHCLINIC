import ApiService, { Apiurls } from "../../WebService/ApiService"
import { useSelector, useDispatch } from 'react-redux'
import { listRecpReducer } from "../../reduxData/ReceptionSlice"
import { useEffect, useState } from "react"
import { listPatientReducer, patientStatusReducer } from "../../reduxData/PatientSlice"
export default function Appointments() {
    const user = useSelector(state => state.authInfo.value)
    const patientList = useSelector(state => state.patientInfo.value)
    const patient = patientList.filter(ob => ob.doctor_name == user.id)
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const [msg, setMsg] = useState("")

    const list = async () => {
        try {
            setLoading(true)
            const response = await ApiService.GetApiCall(Apiurls.APPOINTMENTS_DOC, user.token)
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
            const URL = Apiurls.APPOINTMENTS_DONE + id;
            const response = await ApiService.PutApiCall(URL, null, user.token);
            console.log(response);
            if (response.data.status) {
                setMsg(response.data.msg);

                const indexToUpdate = patientList.findIndex(ob => ob.id === response.data.id);

                if (indexToUpdate !== -1) {
                    // Use splice to replace the item at the specified index
                    const updatedList = [...patientList];
                    updatedList.splice(indexToUpdate, 1, { ...patientList[indexToUpdate], activeStatus: response.data.activeStatus });

                    dispatch(patientStatusReducer(updatedList));
                }


            } else {
                setMsg(response.data.msg);
            }
        } catch (error) {
            setMsg("Network ERROR..!");
        }
    };

    const active = async (id) => {
        try {
            const URL = Apiurls.APPOINTMENTS_UNDO + id
            const response = await ApiService.PutApiCall(URL, null, user.token)
            console.log(response)
            if (response.data.status) {
                setMsg(response.data.msg)
                const indexToUpdate = patientList.findIndex(ob => ob.id === response.data.id);

                if (indexToUpdate !== -1) {
                    // Use splice to replace the item at the specified index
                    const updatedList = [...patientList];
                    updatedList.splice(indexToUpdate, 1, { ...patientList[indexToUpdate], activeStatus: response.data.activeStatus });

                    dispatch(patientStatusReducer(updatedList));
                }
            } else {
                setMsg(response.data.msg)
            }
        }
        catch (error) {
            setMsg("Network ERROR..!")
        }
    }


    
    useEffect(() => {
        list()
    }, [list])

    return <>
        <section id="appointment" className="appointment section-bg " style={{ marginTop: "80px" }}>
            <div className="container">

                <div className="section-title">
                    <h2>Appointments</h2>
                    <p>{msg}</p>
                </div>
                <div>{loading ? <div className="section-title"><div class="spinner-border " role="status">
                    <span class="sr-only">Loading...</span>
                </div> </div> :
                    <table className=" table table-responsive table-hover">
                        <thead>
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
                        </thead>

                        <tbody>
                            {patient.map((ob, index) => <tr><td>{index + 1}</td>
                                <td>{ob.name}</td>
                                <td>{ob.sex}</td>
                                <td>{ob.age}</td>
                                <td>{ob.daignosis}</td>
                                <td>{ob.appointmentdate}</td>
                                <td>{ob.phoneNumber}</td>
                                <td>{ob.address?.name}</td>
                                <td>{ob.address?.raddress}</td>
                                <td>{ob.activeStatus ? <button className="btn btn-sm btn-warning" onClick={() => deactive(ob.id)}>DeActive</button> : <button className="btn btn-sm btn-info" onClick={() => active(ob.id)}>Active</button>}</td>
                            </tr>)}
                        </tbody>
                    </table>
}
                </div>


            </div >
        </section >
    </>
}